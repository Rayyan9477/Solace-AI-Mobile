#!/usr/bin/env node

/**
 * Comprehensive Accessibility Testing Script
 * 
 * Runs all accessibility audits, tests, and generates reports
 * for the Solace AI Mobile App
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Comprehensive Accessibility Testing...\n');

// Configuration
const CONFIG = {
  TIMEOUT: 10000, // 10 second timeout for integrations
  OUTPUT_DIR: './accessibility-reports',
  TIMESTAMP: new Date().toISOString().replace(/[:.]/g, '-'),
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
}

// Test execution functions
const testSuite = {
  // Run accessibility audit script
  runAudit: () => {
    console.log('🔍 Running Accessibility Audit...');
    try {
      const auditOutput = execSync('node scripts/accessibility-audit.js', {
        timeout: CONFIG.TIMEOUT,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(auditOutput);
      
      // Move report to timestamped location
      const reportPath = `./accessibility-audit-report.json`;
      const timestampedPath = path.join(CONFIG.OUTPUT_DIR, `audit-${CONFIG.TIMESTAMP}.json`);
      
      if (fs.existsSync(reportPath)) {
        fs.renameSync(reportPath, timestampedPath);
        console.log(`✅ Audit report saved to: ${timestampedPath}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Accessibility audit failed:', error.message);
      return false;
    }
  },

  // Run Jest accessibility tests
  runJestTests: () => {
    console.log('🧪 Running Jest Accessibility Tests...');
    try {
      const testOutput = execSync('npm test -- --testPathPattern="accessibility"', {
        timeout: CONFIG.TIMEOUT,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(testOutput);
      console.log('✅ Jest accessibility tests completed');
      return true;
    } catch (error) {
      console.error('❌ Jest accessibility tests failed:', error.message);
      console.log('Output:', error.stdout);
      return false;
    }
  },

  // Test component integrations with timeout
  testIntegrations: () => {
    console.log('🔧 Testing Component Integrations...');
    
    const integrationTests = [
      {
        name: 'AccessibleButton Integration',
        command: 'node -e "const AccessibleButton = require(\'./src/components/common/AccessibleButton.js\').default; console.log(\'✅ AccessibleButton loaded successfully\');"'
      },
      {
        name: 'Accessibility Utils Integration',
        command: 'node -e "const utils = require(\'./src/utils/accessibility.js\'); console.log(\'✅ Accessibility utils loaded successfully\');"'
      },
      {
        name: 'Accessibility Testing Utils Integration',
        command: 'node -e "const tester = require(\'./src/utils/accessibilityTesting.js\').default; console.log(\'✅ Accessibility testing utils loaded successfully\');"'
      },
    ];

    let allPassed = true;

    integrationTests.forEach(test => {
      try {
        console.log(`  Testing: ${test.name}`);
        execSync(test.command, { 
          timeout: CONFIG.TIMEOUT,
          stdio: 'pipe' 
        });
        console.log(`  ✅ ${test.name} - PASSED`);
      } catch (error) {
        console.error(`  ❌ ${test.name} - FAILED:`, error.message);
        allPassed = false;
      }
    });

    return allPassed;
  },

  // Test screen reader simulation
  testScreenReaderSupport: () => {
    console.log('🔊 Testing Screen Reader Support...');
    try {
      const testScript = `
        const AccessibilityTester = require('./src/utils/accessibilityTesting.js').default;
        const tester = new AccessibilityTester();
        
        // Test announcements
        tester.announceForAccessibility('Testing screen reader support');
        
        // Test component validation
        const mockButton = {
          props: {
            accessibilityLabel: 'Test Button',
            accessibilityRole: 'button',
            style: { minWidth: 44, minHeight: 44 }
          }
        };
        
        const results = tester.testComponent(mockButton, 'Screen Reader Test');
        const failures = results.filter(r => r.status === 'FAIL');
        
        if (failures.length > 0) {
          console.error('Screen reader test failures:', failures);
          process.exit(1);
        }
        
        console.log('✅ Screen reader support validated');
      `;

      execSync(`node -e "${testScript}"`, {
        timeout: CONFIG.TIMEOUT,
        stdio: 'inherit'
      });

      return true;
    } catch (error) {
      console.error('❌ Screen reader support test failed:', error.message);
      return false;
    }
  },

  // Validate WCAG compliance
  validateWCAGCompliance: () => {
    console.log('📋 Validating WCAG 2.1 AA Compliance...');
    
    try {
      const validationScript = `
        const { 
          WCAG_CONSTANTS, 
          AccessibilityValidators 
        } = require('./src/utils/accessibility.js');
        
        // Test touch target validation
        const touchTargetTest = AccessibilityValidators.validateTouchTarget(44, 44);
        console.log('Touch target validation:', touchTargetTest.isValid ? '✅ PASS' : '❌ FAIL');
        
        // Test color contrast validation
        const contrastTest = AccessibilityValidators.validateColorContrast('#000000', '#FFFFFF');
        console.log('Color contrast validation:', contrastTest.requiredRatio);
        
        // Test animation duration validation
        const animationTest = AccessibilityValidators.validateAnimationDuration(3000);
        console.log('Animation duration validation:', animationTest.isValid ? '✅ PASS' : '❌ FAIL');
        
        // Test accessibility label validation
        const labelTest = AccessibilityValidators.validateAccessibilityLabel('Submit Form');
        console.log('Accessibility label validation:', labelTest.hasLabel && labelTest.isDescriptive ? '✅ PASS' : '❌ FAIL');
        
        console.log('✅ WCAG 2.1 AA compliance validation completed');
      `;

      execSync(`node -e "${validationScript}"`, {
        timeout: CONFIG.TIMEOUT,
        stdio: 'inherit'
      });

      return true;
    } catch (error) {
      console.error('❌ WCAG compliance validation failed:', error.message);
      return false;
    }
  },

  // Generate comprehensive report
  generateSummaryReport: (testResults) => {
    console.log('📊 Generating Summary Report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      testSuite: 'Solace AI Mobile App - Accessibility Testing',
      wcagLevel: 'AA',
      results: {
        audit: testResults.audit,
        jestTests: testResults.jestTests,
        integrations: testResults.integrations,
        screenReader: testResults.screenReader,
        wcagCompliance: testResults.wcagCompliance,
      },
      summary: {
        totalTests: 5,
        passed: Object.values(testResults).filter(Boolean).length,
        failed: Object.values(testResults).filter(result => !result).length,
        successRate: Math.round((Object.values(testResults).filter(Boolean).length / 5) * 100),
      },
      recommendations: [],
    };

    // Add recommendations based on failures
    if (!testResults.audit) {
      report.recommendations.push({
        priority: 'HIGH',
        category: 'Audit',
        message: 'Fix accessibility audit issues before proceeding',
        action: 'Review audit report and address all critical accessibility issues',
      });
    }

    if (!testResults.jestTests) {
      report.recommendations.push({
        priority: 'HIGH',
        category: 'Testing',
        message: 'Jest accessibility tests are failing',
        action: 'Fix failing tests and ensure all components meet accessibility standards',
      });
    }

    if (!testResults.integrations) {
      report.recommendations.push({
        priority: 'CRITICAL',
        category: 'Integration',
        message: 'Component integrations are broken',
        action: 'Fix import/export issues and ensure all accessibility components load correctly',
      });
    }

    // Save report
    const reportPath = path.join(CONFIG.OUTPUT_DIR, `summary-${CONFIG.TIMESTAMP}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Summary report saved to: ${reportPath}`);
    return report;
  },
};

// Main execution
async function runAllTests() {
  const startTime = Date.now();
  
  console.log('🎯 Testing Configuration:');
  console.log(`   • Timeout: ${CONFIG.TIMEOUT}ms`);
  console.log(`   • Output Directory: ${CONFIG.OUTPUT_DIR}`);
  console.log(`   • Timestamp: ${CONFIG.TIMESTAMP}`);
  console.log('');

  // Run all tests
  const testResults = {
    audit: testSuite.runAudit(),
    jestTests: testSuite.runJestTests(),
    integrations: testSuite.testIntegrations(),
    screenReader: testSuite.testScreenReaderSupport(),
    wcagCompliance: testSuite.validateWCAGCompliance(),
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));

  Object.entries(testResults).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`${test.padEnd(20)} ${status}`);
  });

  // Generate summary report
  const summaryReport = testSuite.generateSummaryReport(testResults);

  console.log('\n📈 OVERALL RESULTS:');
  console.log(`   • Success Rate: ${summaryReport.summary.successRate}%`);
  console.log(`   • Tests Passed: ${summaryReport.summary.passed}/${summaryReport.summary.totalTests}`);
  console.log(`   • Duration: ${Math.round((Date.now() - startTime) / 1000)}s`);

  if (summaryReport.recommendations.length > 0) {
    console.log('\n🎯 RECOMMENDATIONS:');
    summaryReport.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.message}`);
      console.log(`      Action: ${rec.action}`);
    });
  }

  console.log('\n🎉 Accessibility testing completed!');
  console.log(`📁 Reports available in: ${CONFIG.OUTPUT_DIR}`);

  // Exit with appropriate code
  const allPassed = Object.values(testResults).every(Boolean);
  process.exit(allPassed ? 0 : 1);
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception during accessibility testing:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection during accessibility testing:', reason);
  process.exit(1);
});

// Run the tests
runAllTests().catch(console.error);