#!/usr/bin/env node

/**
 * Color Contrast Validation Script for Solace AI Mobile
 * Validates therapeutic color palette against WCAG 2.1 AA standards
 */

const fs = require('fs');
const path = require('path');

// Import theme colors (would need to be adjusted based on actual theme structure)
const themeFile = path.join(__dirname, '../src/styles/theme.js');

// Color contrast calculation utilities
class ColorContrastValidator {
  constructor() {
    this.results = [];
  }

  // Convert hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Calculate luminance
  getLuminance(r, g, b) {
    const rs = r / 255;
    const gs = g / 255; 
    const bs = b / 255;

    const rLinear = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gLinear = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bLinear = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  }

  // Calculate contrast ratio
  getContrastRatio(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) {
      throw new Error('Invalid color format');
    }

    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Validate single color combination
  validateCombination(foreground, background, context = '', fontSize = 16, isBold = false) {
    try {
      const ratio = this.getContrastRatio(foreground, background);
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
      const requiredRatio = isLargeText ? 3.0 : 4.5;
      const passes = ratio >= requiredRatio;

      const result = {
        context,
        foreground,
        background,
        ratio: Math.round(ratio * 100) / 100,
        requiredRatio,
        passes,
        isLargeText,
        fontSize,
        isBold,
        wcagLevel: passes ? 'AA' : 'FAIL'
      };

      this.results.push(result);
      return result;
    } catch (error) {
      const result = {
        context,
        foreground,
        background,
        ratio: 0,
        requiredRatio: 4.5,
        passes: false,
        error: error.message,
        wcagLevel: 'ERROR'
      };
      
      this.results.push(result);
      return result;
    }
  }

  // Get suggested color fixes
  getSuggestedFix(foreground, background, targetRatio = 4.5) {
    try {
      // Try darkening foreground
      const fgRgb = this.hexToRgb(foreground);
      const bgRgb = this.hexToRgb(background);
      
      // Simple darkening approach - reduce RGB values
      const darkenAmount = 0.8; // Reduce by 20%
      const newFg = {
        r: Math.max(0, Math.floor(fgRgb.r * darkenAmount)),
        g: Math.max(0, Math.floor(fgRgb.g * darkenAmount)), 
        b: Math.max(0, Math.floor(fgRgb.b * darkenAmount))
      };

      const suggestedHex = `#${newFg.r.toString(16).padStart(2, '0')}${newFg.g.toString(16).padStart(2, '0')}${newFg.b.toString(16).padStart(2, '0')}`;
      const newRatio = this.getContrastRatio(suggestedHex, background);

      return {
        suggested: suggestedHex,
        ratio: Math.round(newRatio * 100) / 100,
        improvement: newRatio >= targetRatio
      };
    } catch (error) {
      return {
        error: 'Could not generate suggestion',
        suggested: foreground
      };
    }
  }

  // Generate comprehensive report
  generateReport() {
    const passed = this.results.filter(r => r.passes).length;
    const failed = this.results.filter(r => !r.passes && !r.error).length;
    const errors = this.results.filter(r => r.error).length;

    const report = {
      summary: {
        total: this.results.length,
        passed,
        failed,
        errors,
        passRate: Math.round((passed / this.results.length) * 100)
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const failed = this.results.filter(r => !r.passes && !r.error);
    
    return failed.map(result => ({
      context: result.context,
      issue: `Contrast ratio ${result.ratio}:1 is below required ${result.requiredRatio}:1`,
      currentColors: {
        foreground: result.foreground,
        background: result.background
      },
      suggestion: this.getSuggestedFix(result.foreground, result.background, result.requiredRatio),
      priority: result.ratio < 3.0 ? 'HIGH' : 'MEDIUM'
    }));
  }
}

// Therapeutic color combinations to test
const testCombinations = [
  // Primary text combinations
  { fg: '#111827', bg: '#FFFFFF', context: 'Primary text on white', fontSize: 16 },
  { fg: '#374151', bg: '#FFFFFF', context: 'Secondary text on white', fontSize: 14 },
  { fg: '#6B7280', bg: '#FFFFFF', context: 'Tertiary text on white', fontSize: 14 },
  
  // Therapeutic color combinations
  { fg: '#926247', bg: '#FFFFFF', context: 'Primary brand on white', fontSize: 16 },
  { fg: '#7DD44D', bg: '#FFFFFF', context: 'Secondary brand on white', fontSize: 16 },
  
  // Mental health mood colors on light backgrounds
  { fg: '#1F2937', bg: '#FEF08A', context: 'Text on happy mood color', fontSize: 14 },
  { fg: '#1F2937', bg: '#BAE6FD', context: 'Text on calm mood color', fontSize: 14 },
  { fg: '#1F2937', bg: '#E0E7FF', context: 'Text on anxious mood color', fontSize: 14 },
  { fg: '#1F2937', bg: '#DBEAFE', context: 'Text on sad mood color', fontSize: 14 },
  
  // Button and interactive element colors
  { fg: '#FFFFFF', bg: '#926247', context: 'White text on primary button', fontSize: 16 },
  { fg: '#FFFFFF', bg: '#7DD44D', context: 'White text on secondary button', fontSize: 16 },
  { fg: '#FFFFFF', bg: '#EF4444', context: 'White text on error button', fontSize: 16 },
  
  // Crisis intervention colors
  { fg: '#FFFFFF', bg: '#DC2626', context: 'Crisis button text', fontSize: 16, isBold: true },
  { fg: '#7F1D1D', bg: '#FEE2E2', context: 'Crisis alert text', fontSize: 14 },
  
  // Form and input colors  
  { fg: '#374151', bg: '#F9FAFB', context: 'Input text on light background', fontSize: 16 },
  { fg: '#9CA3AF', bg: '#FFFFFF', context: 'Placeholder text', fontSize: 16 },
  
  // Chat message colors
  { fg: '#FFFFFF', bg: '#4ADE80', context: 'User message text', fontSize: 16 },
  { fg: '#1F2937', bg: '#F3F4F6', context: 'AI message text', fontSize: 16 },
  
  // Mood intensity colors (problem area identified in audit)
  { fg: '#4B5563', bg: '#E5E7EB', context: 'Mood intensity text on gradient', fontSize: 14 },
  { fg: '#6B7280', bg: '#F9FAFB', context: 'Wellness tip subtitle', fontSize: 12 },
  { fg: '#9CA3AF', bg: '#FFFFFF', context: 'Chat timestamp text', fontSize: 11 },
];

// Run validation
function runValidation() {
  console.log('🔍 Solace AI Mobile - Color Contrast Validation');
  console.log('=' .repeat(60));
  
  const validator = new ColorContrastValidator();
  
  console.log(`\n📊 Testing ${testCombinations.length} color combinations...\n`);
  
  testCombinations.forEach(combo => {
    const result = validator.validateCombination(
      combo.fg, 
      combo.bg, 
      combo.context, 
      combo.fontSize, 
      combo.isBold
    );
    
    const status = result.passes ? '✅' : '❌';
    const sizeInfo = result.isLargeText ? '(Large)' : '(Normal)';
    
    console.log(`${status} ${result.context} ${sizeInfo}`);
    console.log(`   Ratio: ${result.ratio}:1 (Required: ${result.requiredRatio}:1)`);
    console.log(`   Colors: ${result.foreground} on ${result.background}`);
    
    if (!result.passes && !result.error) {
      const suggestion = validator.getSuggestedFix(result.foreground, result.background, result.requiredRatio);
      if (suggestion.improvement) {
        console.log(`   💡 Suggested fix: ${suggestion.suggested} (${suggestion.ratio}:1)`);
      } else {
        console.log(`   ⚠️ Manual color adjustment needed`);
      }
    }
    console.log('');
  });

  const report = validator.generateReport();
  
  console.log('📈 VALIDATION SUMMARY');
  console.log('-'.repeat(30));
  console.log(`Total combinations tested: ${report.summary.total}`);
  console.log(`✅ Passed: ${report.summary.passed}`);
  console.log(`❌ Failed: ${report.summary.failed}`);
  console.log(`🚨 Errors: ${report.summary.errors}`);
  console.log(`📊 Pass rate: ${report.summary.passRate}%`);
  
  if (report.recommendations.length > 0) {
    console.log('\n🛠️ RECOMMENDATIONS');
    console.log('-'.repeat(30));
    
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.context}`);
      console.log(`   Issue: ${rec.issue}`);
      console.log(`   Priority: ${rec.priority}`);
      
      if (rec.suggestion.improvement) {
        console.log(`   Fix: Use ${rec.suggestion.suggested} instead of ${rec.currentColors.foreground}`);
        console.log(`   New ratio: ${rec.suggestion.ratio}:1`);
      } else {
        console.log(`   Action: Manual color adjustment required`);
      }
      console.log('');
    });
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, '../test-reports/color-contrast-report.json');
  const dir = path.dirname(reportPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}`);
  
  // Set exit code based on results
  const criticalFailures = report.recommendations.filter(r => r.priority === 'HIGH').length;
  if (criticalFailures > 0) {
    console.log(`\n⚠️ ${criticalFailures} critical contrast issues found. Please address before production.`);
    process.exit(1);
  } else if (report.summary.failed > 0) {
    console.log(`\n⚠️ ${report.summary.failed} contrast issues found. Consider addressing for better accessibility.`);
    process.exit(0);
  } else {
    console.log('\n✅ All color combinations pass WCAG 2.1 AA contrast requirements!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  runValidation();
}

module.exports = { ColorContrastValidator, runValidation };