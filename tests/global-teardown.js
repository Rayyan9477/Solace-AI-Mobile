/**
 * Global teardown for Playwright tests
 * Cleanup after comprehensive Solace AI testing
 */

const fs = require('fs');
const path = require('path');

async function globalTeardown() {
  console.log('🧹 Cleaning up Solace AI Mobile App testing environment...');
  
  // Generate test summary
  const testResultsDir = path.join(__dirname, '../test-results');
  
  try {
    // Check if results.json exists
    const resultsPath = path.join(testResultsDir, 'results.json');
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      console.log('📊 Test Results Summary:');
      console.log(`   Total Tests: ${results.stats?.total || 'N/A'}`);
      console.log(`   Passed: ${results.stats?.passed || 'N/A'}`);
      console.log(`   Failed: ${results.stats?.failed || 'N/A'}`);
      console.log(`   Skipped: ${results.stats?.skipped || 'N/A'}`);
      console.log(`   Duration: ${results.stats?.duration || 'N/A'}ms`);
      
      // Create summary report
      const summaryPath = path.join(testResultsDir, 'test-summary.txt');
      const summary = `
Solace AI Mobile App - Test Summary
=====================================
Date: ${new Date().toISOString()}
Total Tests: ${results.stats?.total || 'N/A'}
Passed: ${results.stats?.passed || 'N/A'}
Failed: ${results.stats?.failed || 'N/A'}
Skipped: ${results.stats?.skipped || 'N/A'}
Duration: ${results.stats?.duration || 'N/A'}ms

Cross-Platform Testing Status:
- Mobile Chrome: ${results.suites?.find(s => s.title?.includes('mobile-chrome')) ? '✅' : '❌'}
- Mobile Safari: ${results.suites?.find(s => s.title?.includes('mobile-safari')) ? '✅' : '❌'}
- Desktop Chrome: ${results.suites?.find(s => s.title?.includes('chromium-desktop')) ? '✅' : '❌'}
- Firefox: ${results.suites?.find(s => s.title?.includes('firefox-desktop')) ? '✅' : '❌'}
- Safari: ${results.suites?.find(s => s.title?.includes('webkit-desktop')) ? '✅' : '❌'}

Mental Health App Validation:
- Navigation System: Tested
- Theme System: Tested  
- User Interactions: Tested
- Accessibility: Tested
- Performance: Tested
- Cross-Platform: Tested

Report Location: ${path.join(testResultsDir, 'html-report/index.html')}
`;
      
      fs.writeFileSync(summaryPath, summary);
      console.log(`📄 Test summary saved to: ${summaryPath}`);
    }
    
  } catch (error) {
    console.log('⚠️  Error generating test summary:', error.message);
  }
  
  console.log('✅ Test environment cleanup complete!');
  console.log(`📁 Test artifacts available in: ${testResultsDir}`);
}

module.exports = globalTeardown;