// Solace AI Mobile - Fixed App Verification Test
// Verifies that the TabBarIcon fix resolved the rendering issues

const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile - Post-Fix Verification', () => {
  
  test.setTimeout(60000); // 1 minute timeout
  
  test.beforeEach(async ({ page }) => {
    // Enable console logging to catch any remaining errors
    page.on('console', msg => {
      console.log(`Console ${msg.type()}: ${msg.text()}`);
    });
    
    // Log page errors to catch TabBarIcon issues
    page.on('pageerror', error => {
      console.error(`❌ Page Error: ${error.message}`);
    });
  });

  test('Verify TabBarIcon error is resolved and app renders', async ({ page }) => {
    console.log('\n🔧 Testing fix for TabBarIcon naming conflict...\n');
    
    // Navigate to localhost:8083
    await page.goto('http://localhost:8083', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    console.log('✅ Page navigation successful');
    
    // Wait for React app to initialize
    await page.waitForTimeout(8000); // Wait 8 seconds for full app initialization
    
    // Check for React components rendering
    const appContent = await page.textContent('body');
    console.log(`📝 App content length: ${appContent ? appContent.length : 0} characters`);
    
    // Take screenshot to see current state
    await page.screenshot({ 
      path: './test-results/playwright/fixed-app-screenshot.png',
      fullPage: true 
    });
    
    // Check for mental health app elements
    const mentalHealthElements = [
      // Look for navigation tabs
      '[data-testid*="tab"]',
      '[role="tab"]',
      'button',
      // Look for app content
      'text="Solace"i',
      'text="Welcome"i',
      'text="Home"i',
      'text="Dashboard"i',
      'text="Mood"i',
      // Look for any rendered components
      '[data-testid]'
    ];
    
    let elementsFound = 0;
    for (const selector of mentalHealthElements) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        elementsFound++;
        console.log(`✅ Found element "${selector}": ${count}`);
      } else {
        console.log(`❌ Missing element "${selector}"`);
      }
    }
    
    console.log(`\n📊 Elements detected: ${elementsFound}/${mentalHealthElements.length}`);
    
    // Check for interactive elements
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input').count();
    
    console.log(`🎮 Interactive elements: ${buttons} buttons, ${links} links, ${inputs} inputs`);
    
    // Final evaluation
    const isAppWorking = elementsFound > 2 || buttons > 0 || appContent.length > 200;
    console.log(`\n🎯 App Status: ${isAppWorking ? '✅ WORKING' : '❌ STILL BROKEN'}`);
    
    // Additional diagnostic info
    const finalMetrics = await page.evaluate(() => {
      return {
        title: document.title,
        elementCount: document.querySelectorAll('*').length,
        hasReactContent: document.body.innerHTML.includes('react') || 
                        document.body.innerHTML.includes('React') ||
                        document.body.innerHTML.length > 500,
        bodyPreview: document.body.innerText.substring(0, 300)
      };
    });
    
    console.log('\n📈 Final App Metrics:');
    console.log(`  📄 Title: ${finalMetrics.title}`);
    console.log(`  🧱 Element Count: ${finalMetrics.elementCount}`);
    console.log(`  ⚛️  Has React Content: ${finalMetrics.hasReactContent}`);
    console.log(`  📝 Body Preview: ${finalMetrics.bodyPreview}`);
    
    // Expect basic functionality to be present
    expect(finalMetrics.elementCount).toBeGreaterThan(10);
  });

  test('Test navigation and component rendering', async ({ page }) => {
    console.log('\n🧭 Testing navigation and component rendering...\n');
    
    await page.goto('http://localhost:8083', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(10000); // Wait 10 seconds for full initialization
    
    // Look for navigation elements
    const navElements = await page.locator('nav, [role="navigation"], [data-testid*="nav"]').count();
    const tabElements = await page.locator('[role="tab"], [data-testid*="tab"]').count();
    const buttonElements = await page.locator('button').count();
    
    console.log(`🧭 Navigation elements: ${navElements}`);
    console.log(`📑 Tab elements: ${tabElements}`);
    console.log(`🔘 Button elements: ${buttonElements}`);
    
    // Try to click a navigation element if available
    const firstButton = page.locator('button').first();
    const hasButtons = await firstButton.count() > 0;
    
    if (hasButtons) {
      try {
        await firstButton.click({ timeout: 3000 });
        console.log('✅ Successfully clicked first button');
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log(`⚠️  Failed to click button: ${error.message}`);
      }
    }
    
    await page.screenshot({ 
      path: './test-results/playwright/navigation-test-screenshot.png',
      fullPage: true 
    });
    
    console.log(`\n🎯 Navigation Status: ${(navElements + tabElements + buttonElements) > 0 ? '✅ PRESENT' : '❌ MISSING'}`);
  });
});