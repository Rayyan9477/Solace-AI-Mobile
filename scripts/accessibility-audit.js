#!/usr/bin/env node

/**
 * Comprehensive Accessibility Audit Script for Solace AI Mobile App
 * 
 * This script performs WCAG 2.1 AA compliance checks across the entire codebase
 * and generates a detailed report with actionable recommendations.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// WCAG 2.1 AA Requirements
const WCAG_REQUIREMENTS = {
  TOUCH_TARGET_MIN_SIZE: 44, // minimum 44x44 dp
  COLOR_CONTRAST_NORMAL: 4.5, // 4.5:1 for normal text
  COLOR_CONTRAST_LARGE: 3, // 3:1 for large text (18pt+ or 14pt+ bold)
  MAX_FONT_SIZE_LARGE: 18, // 18pt+ considered large text
  ANIMATION_DURATION_MAX: 5000, // max 5 seconds for non-essential animations
};

// Accessibility Issues Database
class AccessibilityAudit {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
    this.scannedFiles = 0;
    this.componentsScanned = 0;
  }

  // Color contrast calculation using relative luminance
  calculateContrast(color1, color2) {
    const getLuminance = (color) => {
      // Convert hex to RGB
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      // Apply gamma correction
      const gammaCorrect = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      
      const rLinear = gammaCorrect(r);
      const gLinear = gammaCorrect(g);
      const bLinear = gammaCorrect(b);

      return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Extract colors from theme files
  extractColorsFromTheme(themeContent) {
    const colors = {};
    const colorRegex = /(\w+):\s*['"`]?(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgba?\([^)]+\))['"`]?/g;
    let match;

    while ((match = colorRegex.exec(themeContent)) !== null) {
      colors[match[1]] = match[2];
    }

    return colors;
  }

  // Check touch target sizes
  checkTouchTargets(content, filePath) {
    const touchTargetPatterns = [
      /width:\s*(\d+)/g,
      /height:\s*(\d+)/g,
      /minWidth:\s*(\d+)/g,
      /minHeight:\s*(\d+)/g,
      /touchTargetSize:\s*(\d+)/g,
      /hitSlop:\s*(\d+)/g,
    ];

    touchTargetPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const size = parseInt(match[1]);
        if (size < WCAG_REQUIREMENTS.TOUCH_TARGET_MIN_SIZE) {
          this.issues.push({
            type: 'TOUCH_TARGET_TOO_SMALL',
            severity: 'HIGH',
            file: filePath,
            line: this.getLineNumber(content, match.index),
            message: `Touch target size ${size}px is below WCAG minimum of ${WCAG_REQUIREMENTS.TOUCH_TARGET_MIN_SIZE}px`,
            wcagRule: '2.5.5 Target Size',
            suggestion: `Increase touch target to minimum ${WCAG_REQUIREMENTS.TOUCH_TARGET_MIN_SIZE}px or add sufficient padding`,
          });
        }
      }
    });
  }

  // Check accessibility labels and roles
  checkAccessibilityLabels(content, filePath) {
    // Check for missing accessibilityLabel on interactive elements
    const interactiveElements = [
      /TouchableOpacity[^>]*>/g,
      /TouchableHighlight[^>]*>/g,
      /TouchableWithoutFeedback[^>]*>/g,
      /Pressable[^>]*>/g,
      /Button[^>]*>/g,
    ];

    interactiveElements.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const elementContent = match[0];
        if (!elementContent.includes('accessibilityLabel') && 
            !elementContent.includes('accessible={false}')) {
          this.issues.push({
            type: 'MISSING_ACCESSIBILITY_LABEL',
            severity: 'HIGH',
            file: filePath,
            line: this.getLineNumber(content, match.index),
            message: 'Interactive element missing accessibilityLabel',
            wcagRule: '4.1.2 Name, Role, Value',
            suggestion: 'Add accessibilityLabel with descriptive text for screen readers',
            codeExample: 'accessibilityLabel="Button description"',
          });
        }
      }
    });

    // Check for missing accessibilityRole
    const roleRequiredElements = /TouchableOpacity|TouchableHighlight|Pressable|Button/g;
    let match;
    while ((match = roleRequiredElements.exec(content)) !== null) {
      const lineStart = content.lastIndexOf('\n', match.index) + 1;
      const lineEnd = content.indexOf('\n', match.index);
      const lineContent = content.substring(lineStart, lineEnd);
      
      if (!lineContent.includes('accessibilityRole')) {
        this.warnings.push({
          type: 'MISSING_ACCESSIBILITY_ROLE',
          severity: 'MEDIUM',
          file: filePath,
          line: this.getLineNumber(content, match.index),
          message: 'Interactive element missing accessibilityRole',
          wcagRule: '4.1.2 Name, Role, Value',
          suggestion: 'Add accessibilityRole="button" or appropriate role',
        });
      }
    });
  }

  // Check for keyboard navigation support
  checkKeyboardNavigation(content, filePath) {
    // Check for onFocus/onBlur handlers
    const focusableElements = /TouchableOpacity|TouchableHighlight|TextInput|Pressable/g;
    let match;
    
    while ((match = focusableElements.exec(content)) !== null) {
      const lineStart = content.lastIndexOf('\n', match.index) + 1;
      const lineEnd = content.indexOf('\n', match.index);
      const lineContent = content.substring(lineStart, lineEnd);
      
      if (!lineContent.includes('onFocus') && !lineContent.includes('onBlur')) {
        this.warnings.push({
          type: 'MISSING_FOCUS_HANDLERS',
          severity: 'MEDIUM',
          file: filePath,
          line: this.getLineNumber(content, match.index),
          message: 'Focusable element missing focus/blur handlers for keyboard navigation',
          wcagRule: '2.1.1 Keyboard',
          suggestion: 'Add onFocus and onBlur handlers for keyboard accessibility',
        });
      }
    });
  }

  // Check animation duration and motion preferences
  checkAnimations(content, filePath) {
    const animationPatterns = [
      /duration:\s*(\d+)/g,
      /timing:\s*(\d+)/g,
      /Animated\.timing[^}]*duration:\s*(\d+)/g,
    ];

    animationPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const duration = parseInt(match[1]);
        if (duration > WCAG_REQUIREMENTS.ANIMATION_DURATION_MAX) {
          this.issues.push({
            type: 'ANIMATION_TOO_LONG',
            severity: 'MEDIUM',
            file: filePath,
            line: this.getLineNumber(content, match.index),
            message: `Animation duration ${duration}ms exceeds WCAG recommendation of ${WCAG_REQUIREMENTS.ANIMATION_DURATION_MAX}ms`,
            wcagRule: '2.2.2 Pause, Stop, Hide',
            suggestion: 'Reduce animation duration or provide user controls to disable animations',
          });
        }
      }
    });

    // Check for reduced motion support
    if (content.includes('Animated') && !content.includes('useReducedMotion') && 
        !content.includes('prefersReducedMotion')) {
      this.warnings.push({
        type: 'MISSING_REDUCED_MOTION',
        severity: 'MEDIUM',
        file: filePath,
        line: 1,
        message: 'Component uses animations but doesn\'t respect reduced motion preferences',
        wcagRule: '2.3.3 Animation from Interactions',
        suggestion: 'Add support for prefers-reduced-motion or useReducedMotion hook',
      });
    }
  }

  // Check text alternatives for images
  checkImageAccessibility(content, filePath) {
    const imagePatterns = [
      /Image[^>]*source/g,
      /FastImage[^>]*source/g,
      /<Image[^>]*>/g,
    ];

    imagePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const imageContent = match[0];
        if (!imageContent.includes('accessibilityLabel') && 
            !imageContent.includes('accessible={false}') &&
            !imageContent.includes('accessibilityRole="none"')) {
          this.issues.push({
            type: 'MISSING_IMAGE_ALT_TEXT',
            severity: 'HIGH',
            file: filePath,
            line: this.getLineNumber(content, match.index),
            message: 'Image missing accessibility description',
            wcagRule: '1.1.1 Non-text Content',
            suggestion: 'Add accessibilityLabel with meaningful description or accessibilityRole="none" for decorative images',
          });
        }
      }
    });
  }

  // Check form accessibility
  checkFormAccessibility(content, filePath) {
    const inputElements = /TextInput[^>]*>/g;
    let match;

    while ((match = inputElements.exec(content)) !== null) {
      const inputContent = match[0];
      
      if (!inputContent.includes('accessibilityLabel') && !inputContent.includes('placeholder')) {
        this.issues.push({
          type: 'MISSING_INPUT_LABEL',
          severity: 'HIGH',
          file: filePath,
          line: this.getLineNumber(content, match.index),
          message: 'Text input missing accessible label',
          wcagRule: '3.3.2 Labels or Instructions',
          suggestion: 'Add accessibilityLabel or visible label for the input field',
        });
      }

      // Check for error handling
      if (!inputContent.includes('accessibilityInvalid') && content.includes('error')) {
        this.warnings.push({
          type: 'MISSING_ERROR_INDICATION',
          severity: 'MEDIUM',
          file: filePath,
          line: this.getLineNumber(content, match.index),
          message: 'Input field missing error state accessibility',
          wcagRule: '3.3.1 Error Identification',
          suggestion: 'Add accessibilityInvalid and accessibilityErrorMessage for error states',
        });
      }
    }
  }

  // Check color contrast in theme files
  checkColorContrast(content, filePath) {
    if (filePath.includes('theme') || filePath.includes('color')) {
      const colors = this.extractColorsFromTheme(content);
      const colorKeys = Object.keys(colors);

      // Common text/background combinations to check
      const contrastPairs = [
        ['textPrimary', 'backgroundPrimary'],
        ['textSecondary', 'backgroundSecondary'],
        ['primary', 'background'],
        ['text', 'background'],
        ['foreground', 'background'],
      ];

      contrastPairs.forEach(([foreground, background]) => {
        if (colors[foreground] && colors[background]) {
          try {
            const contrast = this.calculateContrast(colors[foreground], colors[background]);
            if (contrast < WCAG_REQUIREMENTS.COLOR_CONTRAST_NORMAL) {
              this.issues.push({
                type: 'INSUFFICIENT_COLOR_CONTRAST',
                severity: 'HIGH',
                file: filePath,
                line: 1,
                message: `Color contrast ratio ${contrast.toFixed(2)}:1 is below WCAG AA minimum of ${WCAG_REQUIREMENTS.COLOR_CONTRAST_NORMAL}:1`,
                wcagRule: '1.4.3 Contrast (Minimum)',
                suggestion: `Adjust ${foreground} (${colors[foreground]}) or ${background} (${colors[background]}) to meet contrast requirements`,
                colors: { foreground: colors[foreground], background: colors[background] },
              });
            }
          } catch (error) {
            // Skip invalid color formats
          }
        }
      });
    }
  }

  // Get line number from character index
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  // Scan a single file
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.scannedFiles++;

      // Skip non-component files
      if (!content.includes('React') && !content.includes('component') && 
          !filePath.includes('.js') && !filePath.includes('.jsx') && 
          !filePath.includes('.ts') && !filePath.includes('.tsx')) {
        return;
      }

      this.componentsScanned++;

      // Run all accessibility checks
      this.checkTouchTargets(content, filePath);
      this.checkAccessibilityLabels(content, filePath);
      this.checkKeyboardNavigation(content, filePath);
      this.checkAnimations(content, filePath);
      this.checkImageAccessibility(content, filePath);
      this.checkFormAccessibility(content, filePath);
      this.checkColorContrast(content, filePath);

      // Check for positive patterns
      if (content.includes('accessibilityLabel') && content.includes('accessibilityRole')) {
        this.successes.push({
          type: 'GOOD_ACCESSIBILITY_IMPLEMENTATION',
          file: filePath,
          message: 'Component includes proper accessibility labels and roles',
        });
      }

    } catch (error) {
      console.error(`Error scanning file ${filePath}:`, error.message);
    }
  }

  // Recursively scan directory
  async scanDirectory(dirPath, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', 'build', 'dist', '.git', 'android', 'ios'].includes(item)) {
          await this.scanDirectory(itemPath, extensions);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        await this.scanFile(itemPath);
      }
    }
  }

  // Generate comprehensive report
  generateReport() {
    const report = {
      summary: {
        totalFiles: this.scannedFiles,
        componentsScanned: this.componentsScanned,
        totalIssues: this.issues.length,
        totalWarnings: this.warnings.length,
        totalSuccesses: this.successes.length,
        scanDate: new Date().toISOString(),
        overallScore: this.calculateOverallScore(),
      },
      issues: this.groupIssuesByType(this.issues),
      warnings: this.groupIssuesByType(this.warnings),
      successes: this.successes,
      recommendations: this.generateRecommendations(),
      wcagCompliance: this.assessWCAGCompliance(),
    };

    return report;
  }

  // Calculate overall accessibility score
  calculateOverallScore() {
    const totalChecks = this.componentsScanned * 7; // 7 check categories
    const issueWeight = 3;
    const warningWeight = 1;
    const successWeight = 0.5;

    const penalty = (this.issues.length * issueWeight) + (this.warnings.length * warningWeight);
    const bonus = this.successes.length * successWeight;
    
    const score = Math.max(0, Math.min(100, 100 - (penalty / totalChecks * 100) + bonus));
    return Math.round(score * 100) / 100;
  }

  // Group issues by type
  groupIssuesByType(issues) {
    const grouped = {};
    issues.forEach(issue => {
      if (!grouped[issue.type]) {
        grouped[issue.type] = [];
      }
      grouped[issue.type].push(issue);
    });
    return grouped;
  }

  // Generate recommendations
  generateRecommendations() {
    const recommendations = [];

    // High-priority recommendations based on issues found
    const criticalIssues = this.issues.filter(issue => issue.severity === 'HIGH');
    if (criticalIssues.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        title: 'Address High-Severity Accessibility Issues',
        description: `Found ${criticalIssues.length} critical accessibility issues that prevent users with disabilities from using the app effectively.`,
        actions: [
          'Add missing accessibility labels to all interactive elements',
          'Ensure adequate color contrast ratios (4.5:1 minimum)',
          'Verify touch targets meet 44px minimum size requirement',
          'Provide text alternatives for all informative images',
        ],
      });
    }

    // Keyboard navigation recommendation
    const keyboardIssues = this.warnings.filter(w => w.type === 'MISSING_FOCUS_HANDLERS');
    if (keyboardIssues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Improve Keyboard Navigation Support',
        description: 'Many interactive elements lack proper keyboard navigation support.',
        actions: [
          'Add onFocus and onBlur handlers to all interactive elements',
          'Implement visible focus indicators',
          'Test tab order and ensure logical navigation flow',
          'Add keyboard shortcuts for common actions',
        ],
      });
    }

    // Animation and motion recommendation
    const motionIssues = this.warnings.filter(w => w.type === 'MISSING_REDUCED_MOTION');
    if (motionIssues.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Implement Motion Preferences Support',
        description: 'Components with animations should respect user motion preferences.',
        actions: [
          'Implement useReducedMotion hook across all animated components',
          'Provide settings to disable animations',
          'Reduce animation durations where possible',
          'Use transforms instead of layout animations for better performance',
        ],
      });
    }

    return recommendations;
  }

  // Assess WCAG compliance
  assessWCAGCompliance() {
    const wcagRules = {
      '1.1.1': { name: 'Non-text Content', level: 'A', passed: 0, failed: 0 },
      '1.4.3': { name: 'Contrast (Minimum)', level: 'AA', passed: 0, failed: 0 },
      '2.1.1': { name: 'Keyboard', level: 'A', passed: 0, failed: 0 },
      '2.2.2': { name: 'Pause, Stop, Hide', level: 'A', passed: 0, failed: 0 },
      '2.3.3': { name: 'Animation from Interactions', level: 'AAA', passed: 0, failed: 0 },
      '2.5.5': { name: 'Target Size', level: 'AAA', passed: 0, failed: 0 },
      '3.3.1': { name: 'Error Identification', level: 'A', passed: 0, failed: 0 },
      '3.3.2': { name: 'Labels or Instructions', level: 'A', passed: 0, failed: 0 },
      '4.1.2': { name: 'Name, Role, Value', level: 'A', passed: 0, failed: 0 },
    };

    // Count failures by WCAG rule
    this.issues.forEach(issue => {
      const ruleMatch = issue.wcagRule?.match(/(\d+\.\d+\.\d+)/);
      if (ruleMatch && wcagRules[ruleMatch[1]]) {
        wcagRules[ruleMatch[1]].failed++;
      }
    });

    this.warnings.forEach(warning => {
      const ruleMatch = warning.wcagRule?.match(/(\d+\.\d+\.\d+)/);
      if (ruleMatch && wcagRules[ruleMatch[1]]) {
        wcagRules[ruleMatch[1]].failed++;
      }
    });

    // Count successes (components without issues for each rule)
    Object.keys(wcagRules).forEach(rule => {
      wcagRules[rule].passed = Math.max(0, this.componentsScanned - wcagRules[rule].failed);
    });

    return wcagRules;
  }

  // Save report to file
  saveReport(outputPath = './accessibility-audit-report.json') {
    const report = this.generateReport();
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`Accessibility audit report saved to: ${outputPath}`);
    return report;
  }

  // Print summary to console
  printSummary() {
    const report = this.generateReport();
    
    console.log('\n🔍 ACCESSIBILITY AUDIT SUMMARY');
    console.log('================================');
    console.log(`📁 Files Scanned: ${report.summary.totalFiles}`);
    console.log(`⚛️  Components Analyzed: ${report.summary.componentsScanned}`);
    console.log(`🚨 Critical Issues: ${report.summary.totalIssues}`);
    console.log(`⚠️  Warnings: ${report.summary.totalWarnings}`);
    console.log(`✅ Good Practices Found: ${report.summary.totalSuccesses}`);
    console.log(`📊 Overall Score: ${report.summary.overallScore}/100`);
    
    if (report.summary.totalIssues > 0) {
      console.log('\n🔥 TOP ISSUES TO ADDRESS:');
      Object.entries(report.issues).slice(0, 5).forEach(([type, issues]) => {
        console.log(`   • ${type}: ${issues.length} occurrences`);
      });
    }

    console.log('\n📋 WCAG 2.1 COMPLIANCE STATUS:');
    Object.entries(report.wcagCompliance).forEach(([rule, data]) => {
      const status = data.failed === 0 ? '✅' : '❌';
      console.log(`   ${status} ${rule} ${data.name} (${data.level}): ${data.failed} failures`);
    });

    return report;
  }
}

// CLI Interface
async function main() {
  const audit = new AccessibilityAudit();
  
  console.log('🚀 Starting Accessibility Audit for Solace AI Mobile App...\n');
  
  // Scan source directory
  const srcPath = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcPath)) {
    await audit.scanDirectory(srcPath);
  }
  
  // Generate and display results
  const report = audit.printSummary();
  
  // Save detailed report
  const outputFile = path.join(process.cwd(), 'accessibility-audit-report.json');
  audit.saveReport(outputFile);
  
  // Exit with appropriate code
  process.exit(report.summary.totalIssues > 0 ? 1 : 0);
}

// Export for use in other scripts
module.exports = { AccessibilityAudit, WCAG_REQUIREMENTS };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}