/**
 * Script to find hardcoded styles in the codebase
 * Helps identify fontSize, colors, and other hardcoded values
 */

import * as fs from 'fs';
import * as path from 'path';

interface HardcodedStyle {
  file: string;
  line: number;
  type: 'fontSize' | 'color' | 'spacing' | 'emoji';
  value: string;
  context: string;
}

class StyleAnalyzer {
  private results: HardcodedStyle[] = [];
  private fileCount = 0;
  private patterns = {
    fontSize: /fontSize:\s*(\d+)/g,
    hexColor: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g,
    rgbColor: /rgb\([^)]+\)/g,
    hardcodedSpacing: /margin[A-Z]\w*:\s*(\d+)|padding[A-Z]\w*:\s*(\d+)/g,
    emoji: /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
  };

  analyzeFile(filePath: string): void {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) {
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Skip imports and comments
        if (line.trim().startsWith('import') ||
            line.trim().startsWith('//') ||
            line.trim().startsWith('*')) {
          return;
        }

        // Check for hardcoded font sizes
        const fontSizeMatches = [...line.matchAll(this.patterns.fontSize)];
        fontSizeMatches.forEach(match => {
          this.results.push({
            file: filePath,
            line: index + 1,
            type: 'fontSize',
            value: match[1],
            context: line.trim()
          });
        });

        // Check for hardcoded colors
        const hexMatches = [...line.matchAll(this.patterns.hexColor)];
        hexMatches.forEach(match => {
          // Skip if it's likely a template literal or inside a string
          if (!line.includes('theme.colors')) {
            this.results.push({
              file: filePath,
              line: index + 1,
              type: 'color',
              value: match[0],
              context: line.trim()
            });
          }
        });

        // Check for hardcoded spacing
        const spacingMatches = [...line.matchAll(this.patterns.hardcodedSpacing)];
        spacingMatches.forEach(match => {
          const value = match[1] || match[2];
          if (value && !line.includes('spacing[')) {
            this.results.push({
              file: filePath,
              line: index + 1,
              type: 'spacing',
              value: value,
              context: line.trim()
            });
          }
        });

        // Check for emoji usage
        const emojiMatches = [...line.matchAll(this.patterns.emoji)];
        emojiMatches.forEach(match => {
          this.results.push({
            file: filePath,
            line: index + 1,
            type: 'emoji',
            value: match[0],
            context: line.trim()
          });
        });
      });

      this.fileCount++;
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error);
    }
  }

  analyzeDirectory(dirPath: string): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (!['node_modules', '.git', 'build', 'dist', 'coverage'].includes(entry.name)) {
          this.analyzeDirectory(fullPath);
        }
      } else if (entry.isFile()) {
        this.analyzeFile(fullPath);
      }
    }
  }

  generateReport(): string {
    const summary = {
      fontSize: this.results.filter(r => r.type === 'fontSize').length,
      color: this.results.filter(r => r.type === 'color').length,
      spacing: this.results.filter(r => r.type === 'spacing').length,
      emoji: this.results.filter(r => r.type === 'emoji').length,
    };

    let report = `
HARDCODED STYLES ANALYSIS REPORT
================================

Summary:
--------
Files Analyzed: ${this.fileCount}
Total Issues Found: ${this.results.length}

By Type:
- Font Sizes: ${summary.fontSize}
- Colors: ${summary.color}
- Spacing: ${summary.spacing}
- Emojis: ${summary.emoji}

Detailed Findings:
-----------------
`;

    // Group by type
    const byType = this.results.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, HardcodedStyle[]>);

    for (const [type, items] of Object.entries(byType)) {
      report += `\n### ${type.toUpperCase()} (${items.length} occurrences)\n`;

      // Group by file
      const byFile = items.reduce((acc, item) => {
        const relPath = item.file.replace(process.cwd(), '');
        if (!acc[relPath]) acc[relPath] = [];
        acc[relPath].push(item);
        return acc;
      }, {} as Record<string, HardcodedStyle[]>);

      for (const [file, fileItems] of Object.entries(byFile)) {
        report += `\n${file}:\n`;
        fileItems.slice(0, 5).forEach(item => {
          report += `  Line ${item.line}: ${item.value} -> ${item.context.substring(0, 60)}...\n`;
        });
        if (fileItems.length > 5) {
          report += `  ... and ${fileItems.length - 5} more\n`;
        }
      }
    }

    // Recommendations
    report += `
Recommendations:
---------------
1. Replace hardcoded font sizes with typography.sizes constants
2. Replace hex colors with theme.colors references
3. Replace hardcoded spacing with spacing constants
4. Consider replacing emojis with SVG icons for consistency

Example Replacements:
--------------------
fontSize: 14 -> ...typography.sizes.textSm
color: "#FFFFFF" -> color: theme.colors.text.primary
marginBottom: 16 -> marginBottom: spacing[4]
`;

    return report;
  }

  saveReport(outputPath: string): void {
    const report = this.generateReport();
    fs.writeFileSync(outputPath, report);
    console.log(`Report saved to: ${outputPath}`);
  }

  getStatistics() {
    return {
      totalFiles: this.fileCount,
      totalIssues: this.results.length,
      byType: {
        fontSize: this.results.filter(r => r.type === 'fontSize').length,
        color: this.results.filter(r => r.type === 'color').length,
        spacing: this.results.filter(r => r.type === 'spacing').length,
        emoji: this.results.filter(r => r.type === 'emoji').length,
      },
      topFiles: this.getTopFiles(5)
    };
  }

  private getTopFiles(count: number) {
    const fileCount: Record<string, number> = {};

    this.results.forEach(item => {
      const relPath = item.file.replace(process.cwd(), '');
      fileCount[relPath] = (fileCount[relPath] || 0) + 1;
    });

    return Object.entries(fileCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([file, count]) => ({ file, count }));
  }
}

// Run the analysis
if (require.main === module) {
  const analyzer = new StyleAnalyzer();
  const srcPath = path.join(process.cwd(), 'src');

  console.log('Starting analysis...');
  analyzer.analyzeDirectory(srcPath);

  const stats = analyzer.getStatistics();
  console.log('\n=== QUICK STATISTICS ===');
  console.log(`Total Files Analyzed: ${stats.totalFiles}`);
  console.log(`Total Issues Found: ${stats.totalIssues}`);
  console.log('\nBy Type:');
  console.log(`  Font Sizes: ${stats.byType.fontSize}`);
  console.log(`  Colors: ${stats.byType.color}`);
  console.log(`  Spacing: ${stats.byType.spacing}`);
  console.log(`  Emojis: ${stats.byType.emoji}`);
  console.log('\nTop Files with Issues:');
  stats.topFiles.forEach(({ file, count }) => {
    console.log(`  ${file}: ${count} issues`);
  });

  // Save full report
  const reportPath = path.join(process.cwd(), 'hardcoded-styles-report.txt');
  analyzer.saveReport(reportPath);
}

export default StyleAnalyzer;