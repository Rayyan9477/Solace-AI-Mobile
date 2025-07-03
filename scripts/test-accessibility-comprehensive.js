#!/usr/bin/env node

/**
 * Comprehensive Accessibility Testing Script for Solace AI Mobile
 * Tests accessibility features, compliance, and user experience
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class AccessibilityTester {
  constructor() {
    this.results = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
      recommendations: [],
    };
    this.srcPath = path.join(process.cwd(), 'src');
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  logHeader(title) {
    this.log(`\n${'='.repeat(60)}`, 'cyan');
    this.log(`${title.toUpperCase()}`, 'cyan');
    this.log(`${'='.repeat(60)}`, 'cyan');
  }

  logSection(title) {
    this.log(`\n${'-'.repeat(40)}`, 'blue');
    this.log(`${title}`, 'blue');
    this.log(`${'-'.repeat(40)}`, 'blue');
  }

  addResult(test, passed, message, type = 'test') {
    this.results.totalTests++;
    if (passed) {
      this.results.passed++;
      this.log(`✅ ${test}: ${message}`, 'green');
    } else {
      if (type === 'warning') {
        this.results.warnings++;
        this.log(`⚠️  ${test}: ${message}`, 'yellow');
        this.results.recommendations.push(`${test}: ${message}`);
      } else {
        this.results.failed++;
        this.log(`❌ ${test}: ${message}`, 'red');
        this.results.issues.push(`${test}: ${message}`);
      }
    }
  }

  getAllFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...this.getAllFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  readFileContent(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      return '';
    }
  }

  // Test 1: Check for accessibility imports
  testAccessibilityImports() {
    this.logSection('Testing Accessibility Imports');
    
    const files = this.getAllFiles(this.srcPath);
    let componentsWithAccessibility = 0;
    let totalComponents = 0;
    
    files.forEach(file => {
      if (file.includes('/components/') || file.includes('/screens/')) {
        totalComponents++;
        const content = this.readFileContent(file);
        
        const hasAccessibilityImports = 
          content.includes('accessibilityRole') ||
          content.includes('accessibilityLabel') ||
          content.includes('accessibilityHint') ||
          content.includes('accessibilityState') ||
          content.includes('accessibility.js') ||
          content.includes('MentalHealthAccessibility');
        
        if (hasAccessibilityImports) {
          componentsWithAccessibility++;
        }
      }
    });
    
    const percentage = totalComponents > 0 ? (componentsWithAccessibility / totalComponents) * 100 : 0;
    this.addResult(
      'Accessibility Implementation',
      percentage >= 80,
      `${componentsWithAccessibility}/${totalComponents} components (${percentage.toFixed(1)}%) have accessibility features`,
      percentage >= 60 && percentage < 80 ? 'warning' : 'test'
    );
  }

  // Test 2: Check for proper accessibility roles
  testAccessibilityRoles() {
    this.logSection('Testing Accessibility Roles');
    
    const files = this.getAllFiles(this.srcPath);
    const requiredRoles = ['button', 'text', 'header', 'list', 'listitem', 'slider'];
    const foundRoles = new Set();
    let touchableWithoutRole = 0;
    let totalTouchables = 0;
    
    files.forEach(file => {
      const content = this.readFileContent(file);
      
      // Count TouchableOpacity without accessibilityRole
      const touchableMatches = content.match(/TouchableOpacity/g) || [];
      totalTouchables += touchableMatches.length;
      
      const touchableLines = content.split('\n').filter(line => 
        line.includes('TouchableOpacity') || line.includes('<TouchableOpacity')
      );
      
      touchableLines.forEach(line => {
        if (!content.includes('accessibilityRole')) {
          touchableWithoutRole++;
        }
      });
      
      // Find accessibility roles
      const roleMatches = content.match(/accessibilityRole=["']([^"']+)["']/g) || [];
      roleMatches.forEach(match => {
        const role = match.match(/["']([^"']+)["']/)[1];
        foundRoles.add(role);
      });
    });
    
    // Check if essential roles are present
    const missingRoles = requiredRoles.filter(role => !foundRoles.has(role));
    
    this.addResult(
      'Essential Accessibility Roles',
      missingRoles.length === 0,
      missingRoles.length === 0 
        ? 'All essential roles found' 
        : `Missing roles: ${missingRoles.join(', ')}`,
      missingRoles.length <= 2 ? 'warning' : 'test'
    );
    
    const touchableRolePercentage = totalTouchables > 0 ? 
      ((totalTouchables - touchableWithoutRole) / totalTouchables) * 100 : 100;
    
    this.addResult(
      'TouchableOpacity Accessibility',
      touchableRolePercentage >= 80,
      `${totalTouchables - touchableWithoutRole}/${totalTouchables} touchables (${touchableRolePercentage.toFixed(1)}%) have accessibility roles`,
      touchableRolePercentage >= 60 ? 'warning' : 'test'
    );
  }

  // Test 3: Check for accessibility labels and hints
  testAccessibilityLabels() {
    this.logSection('Testing Accessibility Labels and Hints');
    
    const files = this.getAllFiles(this.srcPath);
    let componentsWithLabels = 0;
    let componentsWithHints = 0;
    let totalInteractiveComponents = 0;
    
    files.forEach(file => {
      const content = this.readFileContent(file);
      
      // Count interactive components
      const interactiveElements = [
        'TouchableOpacity',
        'TouchableHighlight',
        'TouchableWithoutFeedback',
        'Pressable',
        'Button',
        'Switch',
        'Slider',
        'TextInput'
      ];
      
      interactiveElements.forEach(element => {
        const matches = content.match(new RegExp(element, 'g')) || [];
        totalInteractiveComponents += matches.length;
      });
      
      if (content.includes('accessibilityLabel')) {
        componentsWithLabels++;
      }
      
      if (content.includes('accessibilityHint')) {
        componentsWithHints++;
      }
    });
    
    this.addResult(
      'Accessibility Labels',
      componentsWithLabels >= totalInteractiveComponents * 0.7,
      `Found in ${componentsWithLabels} files (target: 70% of interactive components)`
    );
    
    this.addResult(
      'Accessibility Hints',
      componentsWithHints >= totalInteractiveComponents * 0.5,
      `Found in ${componentsWithHints} files (target: 50% of interactive components)`,
      'warning'
    );
  }

  // Test 4: Check theme accessibility features
  testThemeAccessibility() {
    this.logSection('Testing Theme Accessibility Features');
    
    // Check ThemeContext.js
    const themeContextPath = path.join(this.srcPath, 'contexts', 'ThemeContext.js');
    const themeContextContent = this.readFileContent(themeContextPath);
    
    const accessibilityFeatures = [
      'isReducedMotionEnabled',
      'isHighContrastEnabled',
      'fontScale',
      'isScreenReaderEnabled',
      'AccessibilityInfo'
    ];
    
    accessibilityFeatures.forEach(feature => {
      this.addResult(
        `Theme ${feature}`,
        themeContextContent.includes(feature),
        themeContextContent.includes(feature) ? 'Implemented' : 'Not found in ThemeContext'
      );
    });
    
    // Check accessibility utility file
    const accessibilityUtilPath = path.join(this.srcPath, 'utils', 'accessibility.js');
    const hasAccessibilityUtils = fs.existsSync(accessibilityUtilPath);
    
    this.addResult(
      'Accessibility Utilities',
      hasAccessibilityUtils,
      hasAccessibilityUtils ? 'Accessibility utility file exists' : 'Missing accessibility utility file'
    );
    
    if (hasAccessibilityUtils) {
      const utilContent = this.readFileContent(accessibilityUtilPath);
      const utilFeatures = [
        'createMoodAccessibility',
        'createNavigationAccessibility',
        'createFormInputAccessibility',
        'MentalHealthAccessibility'
      ];
      
      utilFeatures.forEach(feature => {
        this.addResult(
          `Utility ${feature}`,
          utilContent.includes(feature),
          utilContent.includes(feature) ? 'Available' : 'Missing utility function'
        );
      });
    }
  }

  // Test 5: Check mental health specific accessibility
  testMentalHealthAccessibility() {
    this.logSection('Testing Mental Health Specific Accessibility');
    
    const mentalHealthFeatures = [
      { file: 'mood/MoodSelector.js', features: ['mood accessibility', 'selection state'] },
      { file: 'mood/IntensitySlider.js', features: ['slider accessibility', 'intensity feedback'] },
      { file: 'dashboard/QuickActions.js', features: ['therapeutic action labels'] },
      { file: 'assessment/AssessmentCard.js', features: ['assessment accessibility'] },
      { file: 'chat/MessageBubble.js', features: ['message accessibility'] }
    ];
    
    mentalHealthFeatures.forEach(({ file, features }) => {
      const filePath = path.join(this.srcPath, 'components', file);
      if (fs.existsSync(filePath)) {
        const content = this.readFileContent(filePath);
        
        features.forEach(feature => {
          const hasFeature = 
            content.includes('accessibilityLabel') ||
            content.includes('accessibilityHint') ||
            content.includes('accessibilityRole') ||
            content.includes('MentalHealthAccessibility');
          
          this.addResult(
            `${file} - ${feature}`,
            hasFeature,
            hasFeature ? 'Accessibility features found' : 'Missing accessibility features',
            'warning'
          );
        });
      }
    });
  }

  // Test 6: Check for accessibility settings screen
  testAccessibilitySettings() {
    this.logSection('Testing Accessibility Settings');
    
    const settingsScreenPath = path.join(this.srcPath, 'screens', 'AccessibilitySettingsScreen.js');
    const hasSettingsScreen = fs.existsSync(settingsScreenPath);
    
    this.addResult(
      'Accessibility Settings Screen',
      hasSettingsScreen,
      hasSettingsScreen ? 'Settings screen exists' : 'Missing accessibility settings screen'
    );
    
    if (hasSettingsScreen) {
      const content = this.readFileContent(settingsScreenPath);
      const settingsFeatures = [
        'font size control',
        'font scale control',
        'haptic feedback toggle',
        'screen reader support',
        'high contrast mode'
      ];
      
      settingsFeatures.forEach(feature => {
        const hasFeature = content.toLowerCase().includes(feature.replace(/\s+/g, ''));
        this.addResult(
          `Settings - ${feature}`,
          hasFeature,
          hasFeature ? 'Feature available' : 'Feature missing',
          'warning'
        );
      });
    }
  }

  // Test 7: Check color contrast compliance
  testColorContrast() {
    this.logSection('Testing Color Contrast Compliance');
    
    const themePath = path.join(this.srcPath, 'styles', 'theme.js');
    const themeContent = this.readFileContent(themePath);
    
    // This is a simplified test - in a real scenario, you'd use a color contrast library
    const hasContrastColors = themeContent.includes('contrast') || themeContent.includes('accessible');
    
    this.addResult(
      'Color Contrast Considerations',
      hasContrastColors,
      hasContrastColors ? 'Contrast considerations found in theme' : 'No explicit contrast considerations',
      'warning'
    );
    
    // Check for high contrast theme variant
    const hasHighContrastTheme = themeContent.includes('highContrast') || themeContent.includes('isHighContrastEnabled');
    
    this.addResult(
      'High Contrast Theme Support',
      hasHighContrastTheme,
      hasHighContrastTheme ? 'High contrast support found' : 'Missing high contrast theme support'
    );
  }

  // Test 8: Check for reduced motion support
  testReducedMotion() {
    this.logSection('Testing Reduced Motion Support');
    
    const files = this.getAllFiles(this.srcPath);
    let animationFiles = 0;
    let reducedMotionSupport = 0;
    
    files.forEach(file => {
      const content = this.readFileContent(file);
      
      if (content.includes('animation') || content.includes('Animated') || content.includes('useAnimation')) {
        animationFiles++;
        
        if (content.includes('isReducedMotionEnabled') || content.includes('reducedMotion')) {
          reducedMotionSupport++;
        }
      }
    });
    
    this.addResult(
      'Reduced Motion Support',
      animationFiles === 0 || reducedMotionSupport >= animationFiles * 0.8,
      `${reducedMotionSupport}/${animationFiles} animation files support reduced motion`
    );
  }

  // Generate comprehensive report
  generateReport() {
    this.logHeader('Accessibility Test Results');
    
    const successRate = this.results.totalTests > 0 ? 
      (this.results.passed / this.results.totalTests) * 100 : 0;
    
    this.log(`\nTotal Tests: ${this.results.totalTests}`, 'bright');
    this.log(`Passed: ${this.results.passed}`, 'green');
    this.log(`Failed: ${this.results.failed}`, 'red');
    this.log(`Warnings: ${this.results.warnings}`, 'yellow');
    this.log(`Success Rate: ${successRate.toFixed(1)}%`, successRate >= 80 ? 'green' : successRate >= 60 ? 'yellow' : 'red');
    
    if (this.results.issues.length > 0) {
      this.logSection('Critical Issues to Address');
      this.results.issues.forEach(issue => {
        this.log(`• ${issue}`, 'red');
      });
    }
    
    if (this.results.recommendations.length > 0) {
      this.logSection('Recommendations for Improvement');
      this.results.recommendations.forEach(rec => {
        this.log(`• ${rec}`, 'yellow');
      });
    }
    
    this.logSection('Accessibility Score');
    let grade = 'F';
    let color = 'red';
    
    if (successRate >= 95) {
      grade = 'A+';
      color = 'green';
    } else if (successRate >= 90) {
      grade = 'A';
      color = 'green';
    } else if (successRate >= 85) {
      grade = 'B+';
      color = 'green';
    } else if (successRate >= 80) {
      grade = 'B';
      color = 'yellow';
    } else if (successRate >= 75) {
      grade = 'B-';
      color = 'yellow';
    } else if (successRate >= 70) {
      grade = 'C+';
      color = 'yellow';
    } else if (successRate >= 65) {
      grade = 'C';
      color = 'yellow';
    } else if (successRate >= 60) {
      grade = 'C-';
      color = 'red';
    } else if (successRate >= 55) {
      grade = 'D';
      color = 'red';
    }
    
    this.log(`\n🎯 ACCESSIBILITY GRADE: ${grade} (${successRate.toFixed(1)}%)`, color);
    
    // Provide next steps
    this.logSection('Next Steps');
    
    if (this.results.failed > 0) {
      this.log('1. Address critical accessibility issues listed above', 'yellow');
      this.log('2. Implement missing accessibility features', 'yellow');
      this.log('3. Test with real screen readers (TalkBack, VoiceOver)', 'yellow');
    }
    
    if (this.results.warnings > 0) {
      this.log('4. Review and implement recommended improvements', 'yellow');
      this.log('5. Consider user testing with accessibility tools', 'yellow');
    }
    
    this.log('6. Conduct manual accessibility testing', 'yellow');
    this.log('7. Get feedback from users with disabilities', 'yellow');
    this.log('8. Regular accessibility audits and updates', 'yellow');
    
    return {
      grade,
      successRate,
      ...this.results,
    };
  }

  // Run all accessibility tests
  async runAllTests() {
    this.logHeader('Solace AI Mobile - Accessibility Testing Suite');
    
    try {
      this.testAccessibilityImports();
      this.testAccessibilityRoles();
      this.testAccessibilityLabels();
      this.testThemeAccessibility();
      this.testMentalHealthAccessibility();
      this.testAccessibilitySettings();
      this.testColorContrast();
      this.testReducedMotion();
      
      const report = this.generateReport();
      
      // Save detailed report
      const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
          grade: report.grade,
          successRate: report.successRate,
          totalTests: report.totalTests,
          passed: report.passed,
          failed: report.failed,
          warnings: report.warnings,
        },
        details: {
          issues: report.issues,
          recommendations: report.recommendations,
        },
        nextSteps: [
          'Implement missing accessibility features',
          'Test with screen readers',
          'Conduct user testing with disabled users',
          'Regular accessibility audits',
        ],
      };
      
      fs.writeFileSync('accessibility-report.json', JSON.stringify(reportData, null, 2));
      this.log('\n📊 Detailed report saved to accessibility-report.json', 'cyan');
      
      return report;
      
    } catch (error) {
      this.log(`\n❌ Error running accessibility tests: ${error.message}`, 'red');
      throw error;
    }
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  const tester = new AccessibilityTester();
  tester.runAllTests()
    .then(report => {
      process.exit(report.failed > 0 ? 1 : 0);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = AccessibilityTester;
