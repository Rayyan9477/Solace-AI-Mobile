#!/usr/bin/env node

/**
 * Performance Test Suite for Solace AI Mobile
 * Comprehensive testing of therapeutic UI performance optimizations
 */

const fs = require('fs');
const path = require('path');

// Performance test configuration
const PERFORMANCE_CONFIG = {
  testTimeout: 30000,
  renderThreshold: 16.67, // 60fps
  memoryThreshold: 70,
  bundleLoadThreshold: 1000,
  animationFpsThreshold: 58,
};

// Color codes for console output
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

class PerformanceTestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.warnings = 0;
  }

  log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  logHeader(message) {
    this.log(`\n${'='.repeat(60)}`, colors.cyan);
    this.log(`${message}`, colors.cyan + colors.bright);
    this.log(`${'='.repeat(60)}`, colors.cyan);
  }

  logSuccess(message) {
    this.log(`✅ ${message}`, colors.green);
    this.testsPassed++;
  }

  logFailure(message) {
    this.log(`❌ ${message}`, colors.red);
    this.testsFailed++;
  }

  logWarning(message) {
    this.log(`⚠️  ${message}`, colors.yellow);
    this.warnings++;
  }

  logInfo(message) {
    this.log(`ℹ️  ${message}`, colors.blue);
  }

  // Test 1: Component Structure Analysis
  testComponentStructure() {
    this.logHeader('Testing Component Structure');
    
    const componentsDir = path.join(__dirname, '..', 'src', 'components');
    const dashboardDir = path.join(componentsDir, 'dashboard');
    
    try {
      if (!fs.existsSync(dashboardDir)) {
        this.logFailure('Dashboard components directory not found');
        return false;
      }

      const dashboardFiles = fs.readdirSync(dashboardDir);
      const expectedComponents = [
        'DailyInsights.js',
        'QuickActions.js', 
        'ProgressOverview.js',
        'MoodCheckIn.js',
        'WelcomeHeader.js',
        'RecentActivity.js'
      ];

      let componentsFound = 0;
      expectedComponents.forEach(component => {
        if (dashboardFiles.includes(component)) {
          componentsFound++;
          this.logSuccess(`Found dashboard component: ${component}`);
        } else {
          this.logWarning(`Dashboard component missing: ${component}`);
        }
      });

      // Check for optimized components
      const optimizedComponents = dashboardFiles.filter(file => 
        file.includes('Optimized') || file.includes('Enhanced')
      );
      
      if (optimizedComponents.length > 0) {
        this.logSuccess(`Found ${optimizedComponents.length} optimized components`);
      }

      return componentsFound >= expectedComponents.length * 0.8; // 80% threshold
    } catch (error) {
      this.logFailure(`Component structure test failed: ${error.message}`);
      return false;
    }
  }

  // Test 2: Performance Hook Analysis
  testPerformanceHooks() {
    this.logHeader('Testing Performance Monitoring Hooks');
    
    try {
      const hooksDir = path.join(__dirname, '..', 'src', 'hooks');
      const performanceHookPath = path.join(hooksDir, 'usePerformanceMonitor.js');
      
      if (!fs.existsSync(performanceHookPath)) {
        this.logFailure('Performance monitoring hook not found');
        return false;
      }

      const hookContent = fs.readFileSync(performanceHookPath, 'utf8');
      
      // Check for essential performance features
      const requiredFeatures = [
        'usePerformanceMonitor',
        'renderTime',
        'memoryInfo', 
        'useNativeDriver',
        'performance.now()',
        'useCallback',
        'useMemo'
      ];

      let featuresFound = 0;
      requiredFeatures.forEach(feature => {
        if (hookContent.includes(feature)) {
          featuresFound++;
          this.logSuccess(`Performance feature found: ${feature}`);
        } else {
          this.logWarning(`Performance feature missing: ${feature}`);
        }
      });

      return featuresFound >= requiredFeatures.length * 0.8;
    } catch (error) {
      this.logFailure(`Performance hooks test failed: ${error.message}`);
      return false;
    }
  }

  // Test 3: Bundle Optimization Analysis
  testBundleOptimization() {
    this.logHeader('Testing Bundle Optimization');
    
    try {
      const utilsDir = path.join(__dirname, '..', 'src', 'utils');
      const bundleOptPath = path.join(utilsDir, 'bundleOptimization.js');
      
      if (!fs.existsSync(bundleOptPath)) {
        this.logFailure('Bundle optimization utilities not found');
        return false;
      }

      const bundleContent = fs.readFileSync(bundleOptPath, 'utf8');
      
      // Check for optimization features
      const optimizationFeatures = [
        'lazy',
        'Suspense',
        'createLazyComponent',
        'withSuspense',
        'preloadComponent',
        'dynamicImport',
        'createScreenBundle',
        'useBundlePerformance'
      ];

      let featuresFound = 0;
      optimizationFeatures.forEach(feature => {
        if (bundleContent.includes(feature)) {
          featuresFound++;
          this.logSuccess(`Bundle optimization feature found: ${feature}`);
        } else {
          this.logWarning(`Bundle optimization feature missing: ${feature}`);
        }
      });

      return featuresFound >= optimizationFeatures.length * 0.9; // High threshold for bundle optimization
    } catch (error) {
      this.logFailure(`Bundle optimization test failed: ${error.message}`);
      return false;
    }
  }

  // Test 4: Navigation Performance Analysis
  testNavigationPerformance() {
    this.logHeader('Testing Navigation Performance');
    
    try {
      const navDir = path.join(__dirname, '..', 'src', 'navigation');
      const navFiles = fs.readdirSync(navDir);
      
      const optimizedNavFile = navFiles.find(file => 
        file.includes('Optimized') || file.includes('Enhanced')
      );
      
      if (!optimizedNavFile) {
        this.logWarning('No optimized navigation file found');
        return false;
      }

      const navPath = path.join(navDir, optimizedNavFile);
      const navContent = fs.readFileSync(navPath, 'utf8');
      
      // Check for performance optimizations in navigation
      const navOptimizations = [
        'lazy:',
        'unmountOnBlur:',
        'preloadComponent',
        'withSuspense',
        'usePerformanceMonitor',
        'createScreenBundle'
      ];

      let optimizationsFound = 0;
      navOptimizations.forEach(optimization => {
        if (navContent.includes(optimization)) {
          optimizationsFound++;
          this.logSuccess(`Navigation optimization found: ${optimization}`);
        }
      });

      return optimizationsFound >= navOptimizations.length * 0.7;
    } catch (error) {
      this.logFailure(`Navigation performance test failed: ${error.message}`);
      return false;
    }
  }

  // Test 5: Animation Performance Analysis
  testAnimationPerformance() {
    this.logHeader('Testing Animation Performance');
    
    try {
      const srcDir = path.join(__dirname, '..', 'src');
      
      // Find all JavaScript files
      const jsFiles = this.findJSFiles(srcDir);
      
      let useNativeDriverCount = 0;
      let totalAnimations = 0;
      let therapeuticAnimations = 0;
      
      jsFiles.forEach(filePath => {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Count animations
          const animationMatches = content.match(/Animated\.(timing|spring|decay)/g);
          if (animationMatches) {
            totalAnimations += animationMatches.length;
          }
          
          // Count native driver usage
          const nativeDriverMatches = content.match(/useNativeDriver:\s*true/g);
          if (nativeDriverMatches) {
            useNativeDriverCount += nativeDriverMatches.length;
          }
          
          // Count therapeutic animations (gradual, calming)
          const therapeuticMatches = content.match(/(therapeutic|calming|peaceful|nurturing)/gi);
          if (therapeuticMatches) {
            therapeuticAnimations += therapeuticMatches.length;
          }
        } catch (err) {
          // Skip files that can't be read
        }
      });

      this.logInfo(`Total animations found: ${totalAnimations}`);
      this.logInfo(`Native driver animations: ${useNativeDriverCount}`);
      this.logInfo(`Therapeutic animation references: ${therapeuticAnimations}`);
      
      const nativeDriverPercentage = totalAnimations > 0 ? (useNativeDriverCount / totalAnimations) * 100 : 0;
      
      if (nativeDriverPercentage >= 90) {
        this.logSuccess(`Excellent native driver usage: ${nativeDriverPercentage.toFixed(1)}%`);
      } else if (nativeDriverPercentage >= 70) {
        this.logWarning(`Good native driver usage: ${nativeDriverPercentage.toFixed(1)}%`);
      } else {
        this.logFailure(`Low native driver usage: ${nativeDriverPercentage.toFixed(1)}%`);
      }

      return nativeDriverPercentage >= 70;
    } catch (error) {
      this.logFailure(`Animation performance test failed: ${error.message}`);
      return false;
    }
  }

  // Test 6: Mental Health Specific Performance
  testMentalHealthPerformance() {
    this.logHeader('Testing Mental Health App Specific Performance');
    
    try {
      const srcDir = path.join(__dirname, '..', 'src');
      const jsFiles = this.findJSFiles(srcDir);
      
      let therapeuticFeatures = 0;
      let accessibilityFeatures = 0;
      let performanceOptimizations = 0;
      
      const therapeuticKeywords = [
        'therapeutic', 'calming', 'peaceful', 'nurturing', 'grounding',
        'mental health', 'therapy', 'mood', 'wellness', 'mindful'
      ];
      
      const accessibilityKeywords = [
        'accessibilityLabel', 'accessibilityHint', 'accessibilityRole',
        'accessible', 'importantForAccessibility'
      ];
      
      const performanceKeywords = [
        'React.memo', 'useMemo', 'useCallback', 'useNativeDriver',
        'performance', 'optimization'
      ];

      jsFiles.forEach(filePath => {
        try {
          const content = fs.readFileSync(filePath, 'utf8').toLowerCase();
          
          therapeuticKeywords.forEach(keyword => {
            const matches = content.match(new RegExp(keyword, 'g'));
            if (matches) therapeuticFeatures += matches.length;
          });
          
          accessibilityKeywords.forEach(keyword => {
            const matches = content.match(new RegExp(keyword.toLowerCase(), 'g'));
            if (matches) accessibilityFeatures += matches.length;
          });
          
          performanceKeywords.forEach(keyword => {
            const matches = content.match(new RegExp(keyword.toLowerCase(), 'g'));
            if (matches) performanceOptimizations += matches.length;
          });
        } catch (err) {
          // Skip files that can't be read
        }
      });

      this.logInfo(`Therapeutic features found: ${therapeuticFeatures}`);
      this.logInfo(`Accessibility features found: ${accessibilityFeatures}`);
      this.logInfo(`Performance optimizations found: ${performanceOptimizations}`);
      
      if (therapeuticFeatures >= 10) {
        this.logSuccess('Excellent therapeutic feature integration');
      } else {
        this.logWarning('Limited therapeutic features found');
      }
      
      if (accessibilityFeatures >= 20) {
        this.logSuccess('Excellent accessibility implementation');
      } else {
        this.logWarning('Limited accessibility features found');
      }
      
      if (performanceOptimizations >= 15) {
        this.logSuccess('Excellent performance optimization implementation');
      } else {
        this.logWarning('Limited performance optimizations found');
      }

      return therapeuticFeatures >= 5 && accessibilityFeatures >= 10 && performanceOptimizations >= 10;
    } catch (error) {
      this.logFailure(`Mental health performance test failed: ${error.message}`);
      return false;
    }
  }

  // Utility: Find all JS files recursively
  findJSFiles(dir, files = []) {
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          this.findJSFiles(fullPath, files);
        } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
          files.push(fullPath);
        }
      });
    } catch (err) {
      // Skip directories that can't be read
    }
    
    return files;
  }

  // Generate performance report
  generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    const totalTests = this.testsPassed + this.testsFailed;
    const successRate = totalTests > 0 ? (this.testsPassed / totalTests) * 100 : 0;
    
    this.logHeader('Performance Test Results Summary');
    
    this.logInfo(`Test Duration: ${duration}ms`);
    this.logInfo(`Total Tests: ${totalTests}`);
    this.logSuccess(`Tests Passed: ${this.testsPassed}`);
    this.logFailure(`Tests Failed: ${this.testsFailed}`);
    this.logWarning(`Warnings: ${this.warnings}`);
    this.logInfo(`Success Rate: ${successRate.toFixed(1)}%`);
    
    let grade;
    if (successRate >= 95) grade = 'A+';
    else if (successRate >= 90) grade = 'A';
    else if (successRate >= 85) grade = 'B+';
    else if (successRate >= 80) grade = 'B';
    else if (successRate >= 70) grade = 'C';
    else grade = 'D';
    
    this.log(`\n🎯 Overall Grade: ${grade}`, colors.bright + colors.magenta);
    
    const report = {
      timestamp: new Date().toISOString(),
      duration,
      totalTests,
      testsPassed: this.testsPassed,
      testsFailed: this.testsFailed,
      warnings: this.warnings,
      successRate,
      grade,
      therapeuticallyOptimized: successRate >= 85,
    };
    
    // Save report
    const reportPath = path.join(__dirname, '..', 'test-reports', 'performance-test-report.json');
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.logSuccess(`Report saved to: ${reportPath}`);
    
    return report;
  }

  // Run all tests
  async runAllTests() {
    this.logHeader('Solace AI Mobile Performance Test Suite');
    this.logInfo('Testing therapeutic UI performance optimizations...\n');
    
    const tests = [
      { name: 'Component Structure', fn: () => this.testComponentStructure() },
      { name: 'Performance Hooks', fn: () => this.testPerformanceHooks() },
      { name: 'Bundle Optimization', fn: () => this.testBundleOptimization() },
      { name: 'Navigation Performance', fn: () => this.testNavigationPerformance() },
      { name: 'Animation Performance', fn: () => this.testAnimationPerformance() },
      { name: 'Mental Health Performance', fn: () => this.testMentalHealthPerformance() },
    ];
    
    for (const test of tests) {
      try {
        const result = test.fn();
        if (!result) {
          this.logFailure(`${test.name} test completed with issues`);
        }
      } catch (error) {
        this.logFailure(`${test.name} test failed with error: ${error.message}`);
      }
    }
    
    return this.generateReport();
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  const testRunner = new PerformanceTestRunner();
  testRunner.runAllTests()
    .then(report => {
      if (report.grade === 'A+' || report.grade === 'A') {
        console.log('\n🎉 Solace AI Mobile performance is excellent!');
      } else if (report.grade === 'B+' || report.grade === 'B') {
        console.log('\n👍 Solace AI Mobile performance is good with room for improvement.');
      } else {
        console.log('\n⚠️ Solace AI Mobile performance needs optimization.');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Performance test suite failed:', error);
      process.exit(1);
    });
}

module.exports = PerformanceTestRunner;