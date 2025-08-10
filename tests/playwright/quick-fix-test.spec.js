// Quick test to verify the InfoIcon fix
const { test, expect } = require('@playwright/test');

test.describe('Quick Fix Verification', () => {

  test('Test InfoIcon fix and error resolution', async ({ page }) => {
    console.log('\n🔧 Testing InfoIcon fix...');
    
    const jsErrors = [];
    
    // Capture page errors
    page.on('pageerror', error => {
      jsErrors.push(error.message);
      console.log('JS Error:', error.message);
    });
    
    // Navigate to the app
    try {
      await page.goto('http://localhost:8081', { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });
      console.log('✅ Page loaded successfully');
    } catch (error) {
      console.log('❌ Page load error:', error.message);
    }
    
    // Wait for potential React rendering
    await page.waitForTimeout(8000);
    
    // Check for errors
    const hasInfoIconError = jsErrors.some(error => error.includes('InfoIcon'));
    console.log(`InfoIcon error resolved: ${!hasInfoIconError}`);
    
    // Check page content
    const bodyContent = await page.textContent('body');
    console.log(`Body content length: ${bodyContent ? bodyContent.length : 0}`);
    
    // Check for React elements
    const hasReactElements = await page.locator('div').count() > 3;
    console.log(`React components rendering: ${hasReactElements}`);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/fix-verification.png', 
      fullPage: true 
    });
    
    console.log(`\n📊 Fix Results:`);
    console.log(`- InfoIcon error resolved: ${!hasInfoIconError}`);
    console.log(`- Total JS errors: ${jsErrors.length}`);
    console.log(`- React rendering: ${hasReactElements}`);
    
    if (jsErrors.length > 0 && !hasInfoIconError) {
      console.log('\n🚨 Remaining Errors:');
      jsErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  });

});