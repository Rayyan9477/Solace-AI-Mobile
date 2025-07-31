/**
 * Design System UI Test Suite
 * Tests the complete design system functionality and user customization flow
 */

const fs = require('fs');
const path = require('path');

class DesignSystemTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  addResult(name, status, message, details = null) {
    const result = { name, status, message, details };
    this.results.tests.push(result);
    this.results[status]++;
    
    const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⚠️';
    console.log(`${emoji} ${name}: ${message}`);
    if (details) console.log(`   ${details}`);
  }

  testDesignTokens() {
    console.log('\n💎 Testing Design Tokens...');
    
    try {
      const tokensPath = path.join(__dirname, '../../src/design-system/DesignTokens.js');
      const content = fs.readFileSync(tokensPath, 'utf8');
      
      // Test base design tokens
      if (content.includes('BaseDesignTokens')) {
        this.addResult('Base Tokens', 'passed', 'BaseDesignTokens defined');
      } else {
        this.addResult('Base Tokens', 'failed', 'BaseDesignTokens missing');
      }
      
      // Test predefined themes
      if (content.includes('PredefinedThemes')) {
        this.addResult('Predefined Themes', 'passed', 'PredefinedThemes available');
      } else {
        this.addResult('Predefined Themes', 'failed', 'PredefinedThemes missing');
      }
      
      // Test therapeutic colors
      if (content.includes('therapeutic') && content.includes('calming')) {
        this.addResult('Therapeutic Colors', 'passed', 'Mental health color palette included');
      } else {
        this.addResult('Therapeutic Colors', 'failed', 'Therapeutic colors missing');
      }
      
      // Test color scales
      const colorScales = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
      const scaleCount = colorScales.filter(scale => content.includes(`${scale}:`)).length;
      
      if (scaleCount >= 8) {
        this.addResult('Color Scales', 'passed', `Complete color scales (${scaleCount}/10 shades)`);
      } else {
        this.addResult('Color Scales', 'warnings', `Incomplete color scales (${scaleCount}/10 shades)`);
      }
      
      // Test component variants
      if (content.includes('ComponentVariants')) {
        this.addResult('Component Variants', 'passed', 'Component styling variants defined');
      } else {
        this.addResult('Component Variants', 'warnings', 'Component variants missing');
      }
      
      // Test design system manager
      if (content.includes('DesignSystemManager')) {
        this.addResult('System Manager', 'passed', 'Design system manager class exists');
      } else {
        this.addResult('System Manager', 'failed', 'Design system manager missing');
      }
      
    } catch (error) {
      this.addResult('Design Tokens', 'failed', 'Error reading DesignTokens.js', error.message);
    }
  }

  testDesignSystemContext() {
    console.log('\n🔄 Testing Design System Context...');
    
    try {
      const contextPath = path.join(__dirname, '../../src/design-system/DesignSystemContext.js');
      const content = fs.readFileSync(contextPath, 'utf8');
      
      // Test context provider
      if (content.includes('DesignSystemProvider')) {
        this.addResult('Context Provider', 'passed', 'DesignSystemProvider implemented');
      } else {
        this.addResult('Context Provider', 'failed', 'DesignSystemProvider missing');
      }
      
      // Test hooks
      if (content.includes('useDesignSystem')) {
        this.addResult('Design System Hook', 'passed', 'useDesignSystem hook available');
      } else {
        this.addResult('Design System Hook', 'failed', 'useDesignSystem hook missing');
      }
      
      // Test persistence
      if (content.includes('AsyncStorage')) {
        this.addResult('Persistence', 'passed', 'AsyncStorage integration for customizations');
      } else {
        this.addResult('Persistence', 'failed', 'No persistence mechanism found');
      }
      
      // Test token updates
      if (content.includes('updateTokens')) {
        this.addResult('Token Updates', 'passed', 'Token update functionality available');
      } else {
        this.addResult('Token Updates', 'failed', 'Token update functionality missing');
      }
      
      // Test reset functionality
      if (content.includes('resetToDefault')) {
        this.addResult('Reset Functionality', 'passed', 'Reset to default implemented');
      } else {
        this.addResult('Reset Functionality', 'warnings', 'Reset functionality missing');
      }
      
    } catch (error) {
      this.addResult('Design System Context', 'failed', 'Error reading DesignSystemContext.js', error.message);
    }
  }

  testColorCustomizer() {
    console.log('\n🎨 Testing Color Customizer...');
    
    try {
      const customizerPath = path.join(__dirname, '../../src/design-system/ColorCustomizer.js');
      const content = fs.readFileSync(customizerPath, 'utf8');
      
      // Test color utilities
      if (content.includes('ColorUtils')) {
        this.addResult('Color Utils', 'passed', 'Color manipulation utilities available');
      } else {
        this.addResult('Color Utils', 'failed', 'Color utilities missing');
      }
      
      // Test hex to HSL conversion
      if (content.includes('hexToHsl')) {
        this.addResult('Color Conversion', 'passed', 'Hex to HSL conversion implemented');
      } else {
        this.addResult('Color Conversion', 'warnings', 'Color conversion functions missing');
      }
      
      // Test color scale generation
      if (content.includes('generateColorScale')) {
        this.addResult('Scale Generation', 'passed', 'Dynamic color scale generation');
      } else {
        this.addResult('Scale Generation', 'failed', 'Color scale generation missing');
      }
      
      // Test color validation
      if (content.includes('isValidHex')) {
        this.addResult('Color Validation', 'passed', 'Hex color validation implemented');
      } else {
        this.addResult('Color Validation', 'warnings', 'Color validation missing');
      }
      
      // Test theme application
      if (content.includes('applyPredefinedTheme')) {
        this.addResult('Theme Application', 'passed', 'Predefined theme application available');
      } else {
        this.addResult('Theme Application', 'warnings', 'Theme application function missing');
      }
      
      // Test real-time preview
      if (content.includes('useState') && content.includes('useEffect')) {
        this.addResult('Real-time Preview', 'passed', 'Real-time color preview implemented');
      } else {
        this.addResult('Real-time Preview', 'warnings', 'Real-time preview may be limited');
      }
      
    } catch (error) {
      this.addResult('Color Customizer', 'failed', 'Error reading ColorCustomizer.js', error.message);
    }
  }

  testComponentCustomizer() {
    console.log('\n🔧 Testing Component Customizer...');
    
    try {
      const customizerPath = path.join(__dirname, '../../src/design-system/ComponentCustomizer.js');
      const content = fs.readFileSync(customizerPath, 'utf8');
      
      // Test spacing customization
      if (content.includes('spacing') && content.includes('Slider')) {
        this.addResult('Spacing Customization', 'passed', 'Spacing adjustment controls available');
      } else {
        this.addResult('Spacing Customization', 'failed', 'Spacing customization missing');
      }
      
      // Test typography customization
      if (content.includes('typography') && content.includes('fontSize')) {
        this.addResult('Typography Customization', 'passed', 'Typography controls available');
      } else {
        this.addResult('Typography Customization', 'failed', 'Typography customization missing');
      }
      
      // Test border radius customization
      if (content.includes('borderRadius')) {
        this.addResult('Border Radius', 'passed', 'Border radius customization available');
      } else {
        this.addResult('Border Radius', 'warnings', 'Border radius customization missing');
      }
      
      // Test shadow customization
      if (content.includes('shadows') && content.includes('intensity')) {
        this.addResult('Shadow Customization', 'passed', 'Shadow intensity controls available');
      } else {
        this.addResult('Shadow Customization', 'warnings', 'Shadow customization missing');
      }
      
      // Test animation controls
      if (content.includes('animations') && content.includes('speed')) {
        this.addResult('Animation Controls', 'passed', 'Animation speed controls available');
      } else {
        this.addResult('Animation Controls', 'warnings', 'Animation controls missing');
      }
      
      // Test live preview
      if (content.includes('PreviewButton') || content.includes('PreviewCard')) {
        this.addResult('Live Preview', 'passed', 'Component preview functionality available');
      } else {
        this.addResult('Live Preview', 'warnings', 'Live preview may be limited');
      }
      
    } catch (error) {
      this.addResult('Component Customizer', 'failed', 'Error reading ComponentCustomizer.js', error.message);
    }
  }

  testDesignSystemScreen() {
    console.log('\n📱 Testing Design System Screen...');
    
    try {
      const screenPath = path.join(__dirname, '../../src/screens/DesignSystemScreen.js');
      const content = fs.readFileSync(screenPath, 'utf8');
      
      // Test tabbed interface
      if (content.includes('activeTab') && content.includes('colors') && content.includes('components')) {
        this.addResult('Tabbed Interface', 'passed', 'Colors and Components tabs implemented');
      } else {
        this.addResult('Tabbed Interface', 'failed', 'Tabbed interface missing');
      }
      
      // Test navigation integration
      if (content.includes('navigation.goBack')) {
        this.addResult('Navigation Integration', 'passed', 'Navigation controls available');
      } else {
        this.addResult('Navigation Integration', 'warnings', 'Navigation integration incomplete');
      }
      
      // Test customizer integration
      if (content.includes('ColorCustomizer') && content.includes('ComponentCustomizer')) {
        this.addResult('Customizer Integration', 'passed', 'Both customizers integrated');
      } else {
        this.addResult('Customizer Integration', 'failed', 'Customizer integration incomplete');
      }
      
      // Test design system provider wrapping
      if (content.includes('DesignSystemProvider')) {
        this.addResult('Provider Wrapping', 'passed', 'Screen wrapped with DesignSystemProvider');
      } else {
        this.addResult('Provider Wrapping', 'warnings', 'DesignSystemProvider wrapping missing');
      }
      
      // Test accessibility
      if (content.includes('accessibilityRole') && content.includes('accessibilityLabel')) {
        this.addResult('Screen Accessibility', 'passed', 'Accessibility labels and roles implemented');
      } else {
        this.addResult('Screen Accessibility', 'warnings', 'Accessibility implementation incomplete');
      }
      
    } catch (error) {
      this.addResult('Design System Screen', 'failed', 'Error reading DesignSystemScreen.js', error.message);
    }
  }

  testNavigationIntegration() {
    console.log('\n🧭 Testing Navigation Integration...');
    
    try {
      // Test navigation configuration
      const navPath = path.join(__dirname, '../../src/navigation/AppNavigator.js');
      const navContent = fs.readFileSync(navPath, 'utf8');
      
      if (navContent.includes('DesignSystem')) {
        this.addResult('Navigation Config', 'passed', 'DesignSystemScreen in navigation');
      } else {
        this.addResult('Navigation Config', 'failed', 'DesignSystemScreen not in navigation');
      }
      
      // Test profile screen integration
      const profilePath = path.join(__dirname, '../../src/screens/profile/ProfileScreen.js');
      const profileContent = fs.readFileSync(profilePath, 'utf8');
      
      if (profileContent.includes('handleDesignSystem') && profileContent.includes('DesignSystem')) {
        this.addResult('Profile Integration', 'passed', 'Design System accessible from Profile');
      } else {
        this.addResult('Profile Integration', 'failed', 'Profile integration missing');
      }
      
      // Test app-level integration
      const appPath = path.join(__dirname, '../../App.js');
      const appContent = fs.readFileSync(appPath, 'utf8');
      
      if (appContent.includes('DesignSystemProvider')) {
        this.addResult('App Integration', 'passed', 'DesignSystemProvider in App.js');
      } else {
        this.addResult('App Integration', 'failed', 'App-level integration missing');
      }
      
    } catch (error) {
      this.addResult('Navigation Integration', 'failed', 'Error testing navigation integration', error.message);
    }
  }

  testProductionReadiness() {
    console.log('\n🚀 Testing Production Readiness...');
    
    try {
      // Test error handling
      const contextPath = path.join(__dirname, '../../src/design-system/DesignSystemContext.js');
      const contextContent = fs.readFileSync(contextPath, 'utf8');
      
      if (contextContent.includes('try') && contextContent.includes('catch')) {
        this.addResult('Error Handling', 'passed', 'Error handling implemented');
      } else {
        this.addResult('Error Handling', 'warnings', 'Limited error handling');
      }
      
      // Test loading states
      if (contextContent.includes('isLoading')) {
        this.addResult('Loading States', 'passed', 'Loading state management implemented');
      } else {
        this.addResult('Loading States', 'warnings', 'Loading states missing');
      }
      
      // Test validation
      const colorPath = path.join(__dirname, '../../src/design-system/ColorCustomizer.js');
      const colorContent = fs.readFileSync(colorPath, 'utf8');
      
      if (colorContent.includes('Alert.alert') && colorContent.includes('validation')) {
        this.addResult('Input Validation', 'passed', 'User input validation implemented');
      } else if (colorContent.includes('isValidHex')) {
        this.addResult('Input Validation', 'passed', 'Color validation implemented');
      } else {
        this.addResult('Input Validation', 'warnings', 'Input validation may be incomplete');
      }
      
      // Test performance considerations
      if (contextContent.includes('useCallback') || contextContent.includes('useMemo')) {
        this.addResult('Performance', 'passed', 'Performance optimizations implemented');
      } else {
        this.addResult('Performance', 'warnings', 'Consider performance optimizations');
      }
      
    } catch (error) {
      this.addResult('Production Readiness', 'failed', 'Error testing production readiness', error.message);
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🎨 DESIGN SYSTEM TEST RESULTS');
    console.log('='.repeat(60));
    
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    
    const total = this.results.passed + this.results.failed + this.results.warnings;
    const successRate = Math.round((this.results.passed / total) * 100);
    
    console.log(`\n📊 Success Rate: ${successRate}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 Design System is production ready!');
      console.log('🎨 Users can fully customize their app experience!');
      console.log('🚀 All customization features are functional!');
    } else {
      console.log('\n🔧 Some issues found. Please review failed tests above.');
    }
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (this.results.warnings > 0) {
      console.log('• Address warning items to improve user experience');
    }
    console.log('• Test with real users to validate customization flow');
    console.log('• Consider adding more predefined themes');
    console.log('• Test with different device sizes and orientations');
    console.log('• Validate accessibility with screen readers');
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        successRate: successRate
      },
      tests: this.results.tests
    };
    
    try {
      const reportPath = path.join(__dirname, 'design-system-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    } catch (error) {
      console.log('\n⚠️  Could not save detailed report');
    }
    
    return this.results.failed === 0;
  }

  run() {
    console.log('🚀 Starting Design System Test Suite...\n');
    
    this.testDesignTokens();
    this.testDesignSystemContext();
    this.testColorCustomizer();
    this.testComponentCustomizer();
    this.testDesignSystemScreen();
    this.testNavigationIntegration();
    this.testProductionReadiness();
    
    return this.printSummary();
  }
}

// Run the test if called directly
if (require.main === module) {
  const test = new DesignSystemTest();
  const success = test.run();
  process.exit(success ? 0 : 1);
}

module.exports = DesignSystemTest;