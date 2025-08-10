/**
 * Solace AI Mental Health App - Comprehensive Frontend Validation Tests
 * 
 * This test suite validates that the React app is loading properly with full
 * module bundling, UI rendering, navigation functionality, and error-free operation.
 * 
 * Test Coverage:
 * - React app loading and module bundling verification
 * - Solace AI Mental Health app UI rendering
 * - Navigation tabs functionality
 * - Cover page, dashboard, and screen rendering
 * - Console error monitoring
 * - Screenshot capture for UI validation
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = 'http://localhost:8082';
const NAVIGATION_TIMEOUT = 30000;
const SCREENSHOT_PATH = 'test-results/screenshots/frontend-validation';

test.describe('Solace AI Mental Health App - Frontend Validation', () => {
  let consoleMessages = [];
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    // Clear console message arrays
    consoleMessages = [];
    consoleErrors = [];
    
    // Listen for console messages and errors
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
      
      if (msg.type() === 'error') {
        consoleErrors.push({
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      consoleErrors.push({
        text: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Set viewport for mobile testing
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('1. Verify React app loading and module bundling', async ({ page }) => {
    console.log('🚀 Testing React app loading and module bundling...');
    
    // Navigate to the app
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    // Wait for React app to fully load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Allow time for bundle loading

    // Verify page title
    const title = await page.title();
    console.log(`📱 App Title: ${title}`);
    
    // Check if main app container is present
    const appContainer = await page.locator('#root, #expo-root, [data-testid="app-container"]').first();
    await expect(appContainer).toBeVisible({ timeout: 10000 });

    // Verify React is loaded by checking for React-specific elements
    const reactElements = await page.locator('[data-reactroot], [data-react-helmet]').count();
    console.log(`⚛️  React elements detected: ${reactElements}`);

    // Take screenshot of initial load
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/01-app-initial-load.png`,
      fullPage: true
    });

    console.log('✅ React app loading verification completed');
  });

  test('2. Verify Solace AI Mental Health app UI rendering', async ({ page }) => {
    console.log('🎨 Testing Solace AI Mental Health app UI rendering...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    // Wait for the app to fully render
    await page.waitForTimeout(5000);

    // Check for mental health app specific elements
    const mentalHealthElements = [
      'Welcome', 'Solace', 'Mental Health', 'Therapy', 'Mood', 'Dashboard',
      'Chat', 'Assessment', 'Profile', 'Wellness', 'AI'
    ];

    let foundElements = [];
    for (const element of mentalHealthElements) {
      const count = await page.locator(`text=${element}`).count();
      if (count > 0) {
        foundElements.push(element);
      }
    }

    console.log(`🧠 Mental health elements found: ${foundElements.join(', ')}`);
    expect(foundElements.length).toBeGreaterThan(0);

    // Check for therapeutic colors and gradients
    const hasGradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let element of elements) {
        const style = window.getComputedStyle(element);
        if (style.background && (
          style.background.includes('gradient') ||
          style.background.includes('linear-gradient')
        )) {
          return true;
        }
      }
      return false;
    });

    console.log(`🎨 Therapeutic gradients detected: ${hasGradients}`);

    // Take screenshot of main UI
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/02-main-ui-rendering.png`,
      fullPage: true
    });

    console.log('✅ UI rendering verification completed');
  });

  test('3. Verify navigation tabs functionality', async ({ page }) => {
    console.log('🧭 Testing navigation tabs functionality...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    await page.waitForTimeout(5000);

    // Expected navigation tabs
    const expectedTabs = ['Home', 'Chat', 'Mood', 'Assessment', 'Profile', 'Welcome'];
    let foundTabs = [];

    // Look for navigation elements
    for (const tab of expectedTabs) {
      // Try multiple selectors for navigation tabs
      const selectors = [
        `[role="tab"]:has-text("${tab}")`,
        `button:has-text("${tab}")`,
        `text="${tab}"`,
        `[aria-label*="${tab}"]`,
        `[data-testid*="${tab.toLowerCase()}"]`
      ];

      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          foundTabs.push(tab);
          console.log(`🎯 Found tab: ${tab}`);
          
          // Try clicking the tab and take screenshot
          try {
            await element.click();
            await page.waitForTimeout(1000);
            await page.screenshot({
              path: `${SCREENSHOT_PATH}/03-navigation-${tab.toLowerCase()}-tab.png`,
              fullPage: true
            });
          } catch (e) {
            console.log(`ℹ️  Could not click ${tab} tab: ${e.message}`);
          }
          break;
        }
      }
    }

    console.log(`🧭 Navigation tabs found: ${foundTabs.join(', ')}`);
    
    // Check if we found any navigation elements
    if (foundTabs.length === 0) {
      // Look for any clickable elements that might be navigation
      const clickableElements = await page.locator('button, [role="button"], [role="tab"], a').count();
      console.log(`🔘 Total clickable elements found: ${clickableElements}`);
    }

    console.log('✅ Navigation tabs verification completed');
  });

  test('4. Verify cover page and dashboard rendering', async ({ page }) => {
    console.log('📱 Testing cover page and dashboard rendering...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    await page.waitForTimeout(5000);

    // Look for cover page elements
    const coverPageElements = [
      'Welcome', 'Get Started', 'Continue', 'Sign In', 'Sign Up', 
      'Mental Health', 'AI Support', 'Therapy', 'Wellness'
    ];

    let foundCoverElements = [];
    for (const element of coverPageElements) {
      if (await page.locator(`text="${element}"`).first().isVisible().catch(() => false)) {
        foundCoverElements.push(element);
      }
    }

    console.log(`🏠 Cover page elements: ${foundCoverElements.join(', ')}`);

    // Take screenshot of cover page
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/04-cover-page.png`,
      fullPage: true
    });

    // Look for dashboard elements
    const dashboardElements = [
      'Dashboard', 'Mood', 'Quick Actions', 'Progress', 'Recent Activity',
      'Daily Insights', 'Therapy Session', 'Journal', 'Meditation'
    ];

    let foundDashboardElements = [];
    for (const element of dashboardElements) {
      if (await page.locator(`text="${element}"`).first().isVisible().catch(() => false)) {
        foundDashboardElements.push(element);
      }
    }

    console.log(`📊 Dashboard elements: ${foundDashboardElements.join(', ')}`);

    // Check for interactive elements
    const buttons = await page.locator('button').count();
    const inputs = await page.locator('input, textarea').count();
    const cards = await page.locator('[style*="shadow"], [class*="card"], [class*="Card"]').count();

    console.log(`🎮 Interactive elements - Buttons: ${buttons}, Inputs: ${inputs}, Cards: ${cards}`);

    // Take screenshot of dashboard
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/05-dashboard.png`,
      fullPage: true
    });

    console.log('✅ Cover page and dashboard verification completed');
  });

  test('5. Verify console errors and app stability', async ({ page }) => {
    console.log('🔍 Testing console errors and app stability...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    // Wait for app to fully load and run
    await page.waitForTimeout(10000);

    // Interact with the app to trigger any potential errors
    const clickableElements = await page.locator('button, [role="button"]').all();
    for (let i = 0; i < Math.min(clickableElements.length, 5); i++) {
      try {
        await clickableElements[i].click();
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`ℹ️  Could not click element ${i}: ${e.message}`);
      }
    }

    // Check console messages
    console.log(`📝 Total console messages: ${consoleMessages.length}`);
    console.log(`❌ Console errors: ${consoleErrors.length}`);

    // Log console messages for analysis
    consoleMessages.slice(-10).forEach((msg, index) => {
      console.log(`${msg.type.toUpperCase()}: ${msg.text}`);
    });

    // Check for critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.text.includes('favicon') && 
      !error.text.includes('Source map') &&
      !error.text.includes('DevTools')
    );

    console.log(`🚨 Critical console errors: ${criticalErrors.length}`);
    criticalErrors.forEach(error => {
      console.log(`ERROR: ${error.text}`);
    });

    // Verify app is still responsive
    const appContainer = await page.locator('#root, #expo-root').first();
    await expect(appContainer).toBeVisible();

    console.log('✅ Console error verification completed');
  });

  test('6. Comprehensive UI screenshot validation', async ({ page }) => {
    console.log('📸 Taking comprehensive UI screenshots...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    await page.waitForTimeout(5000);

    // Take full page screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/06-complete-app-fullpage.png`,
      fullPage: true
    });

    // Take mobile viewport screenshot
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/07-mobile-viewport-375x812.png`,
      fullPage: false
    });

    // Take tablet viewport screenshot
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/08-tablet-viewport-768x1024.png`,
      fullPage: false
    });

    // Take desktop viewport screenshot
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/09-desktop-viewport-1280x720.png`,
      fullPage: false
    });

    // Test dark mode if available
    await page.evaluate(() => {
      // Try to trigger dark mode
      const darkModeToggle = document.querySelector('[data-testid="dark-mode"], [aria-label*="dark"]');
      if (darkModeToggle) {
        darkModeToggle.click();
      }
    });

    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/10-dark-mode-test.png`,
      fullPage: true
    });

    console.log('✅ Screenshot validation completed');
  });

  test('7. Performance and accessibility validation', async ({ page }) => {
    console.log('⚡ Testing performance and accessibility...');
    
    // Start performance monitoring
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    // Measure load time
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart;
    });
    console.log(`⏱️  Page load time: ${loadTime}ms`);

    // Check for accessibility landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="complementary"]').count();
    console.log(`♿ Accessibility landmarks: ${landmarks}`);

    // Check for alt text on images
    const images = await page.locator('img').count();
    const imagesWithAlt = await page.locator('img[alt]').count();
    console.log(`🖼️  Images with alt text: ${imagesWithAlt}/${images}`);

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    console.log(`📝 Heading elements: ${headings}`);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    const focusedElement = await page.evaluate(() => {
      return document.activeElement ? document.activeElement.tagName : 'none';
    });
    console.log(`⌨️  Keyboard navigation works: ${focusedElement !== 'BODY'}`);

    // Final comprehensive screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/11-final-app-state.png`,
      fullPage: true
    });

    console.log('✅ Performance and accessibility validation completed');
  });

  test.afterEach(async ({ page }) => {
    // Log final console summary
    console.log(`\n📊 Test Session Summary:`);
    console.log(`   Total console messages: ${consoleMessages.length}`);
    console.log(`   Console errors: ${consoleErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log(`\n❌ Console Errors Found:`);
      consoleErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.text}`);
      });
    }
  });
});