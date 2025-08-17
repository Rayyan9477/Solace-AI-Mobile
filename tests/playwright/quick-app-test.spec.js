/**
 * Quick Application Test - Solace AI Mobile
 * Simple verification of app functionality on localhost:8083
 */

const { test, expect } = require('@playwright/test');

test.describe('Quick App Verification', () => {
  test('Verify app loads and basic functionality', async ({ page }) => {
    console.log('🚀 Testing Solace AI Mobile app on localhost:8083...');
    
    // Navigate to the application
    await page.goto('http://localhost:8083', { 
      waitUntil: 'networkidle',
      timeout: 20000 
    });

    // Wait for app to load
    await page.waitForTimeout(3000);

    // Check if app container exists
    const appContainer = await page.locator('#root, #expo-root').first();
    await expect(appContainer).toBeVisible({ timeout: 10000 });

    // Get page title
    const title = await page.title();
    console.log(`📱 App Title: ${title}`);

    // Count navigation elements
    const navButtons = await page.locator('button, [role="button"], [role="tab"]').count();
    console.log(`🧭 Navigation elements: ${navButtons}`);

    // Check for mental health related text
    const mentalHealthTerms = ['Solace', 'Mental Health', 'Mood', 'Therapy', 'Wellness'];
    let foundTerms = [];
    
    for (const term of mentalHealthTerms) {
      const count = await page.locator(`text="${term}"`).count();
      if (count > 0) {
        foundTerms.push(term);
      }
    }
    
    console.log(`🧠 Mental health terms found: ${foundTerms.join(', ')}`);

    // Take final screenshot
    await page.screenshot({
      path: 'test-results/quick-app-verification.png',
      fullPage: true
    });

    console.log('✅ Quick verification completed successfully');
  });
});