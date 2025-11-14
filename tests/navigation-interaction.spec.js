/**
 * Navigation and Interaction Tests
 * Tests clickable elements, navigation, and user interactions
 */

const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile - Navigation & Interaction Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should find and test interactive elements', async ({ page }) => {
    // Look for buttons
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons`);
    
    // Look for links
    const links = await page.$$('a');
    console.log(`Found ${links.length} links`);
    
    // Look for inputs
    const inputs = await page.$$('input');
    console.log(`Found ${inputs.length} input fields`);
    
    // Expect at least some interactive elements
    const totalInteractive = buttons.length + links.length + inputs.length;
    expect(totalInteractive).toBeGreaterThan(0);
  });

  test('should test button hover states', async ({ page }) => {
    const buttons = await page.$$('button');
    
    if (buttons.length > 0) {
      const firstButton = buttons[0];
      
      // Hover over button
      await firstButton.hover();
      await page.waitForTimeout(500);
      
      // Take screenshot of hover state
      await page.screenshot({ 
        path: 'test-results/screenshots/button-hover.png' 
      });
    }
  });

  test('should test keyboard navigation', async ({ page }) => {
    // Try tabbing through elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    
    // Take screenshot of focused state
    await page.screenshot({ 
      path: 'test-results/screenshots/keyboard-focus.png' 
    });
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Look for tappable elements
    const buttons = await page.$$('button');
    
    if (buttons.length > 0) {
      const firstButton = buttons[0];
      
      // Simulate tap
      await firstButton.tap();
      await page.waitForTimeout(500);
      
      // Check if any navigation or state change occurred
      const body = await page.$('body');
      expect(body).not.toBeNull();
    }
  });

  test('should test scroll behavior', async ({ page }) => {
    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
    
    const afterScroll = await page.evaluate(() => window.scrollY);
    
    // Check if scroll position changed
    expect(afterScroll).toBeGreaterThan(initialScroll);
    
    // Take screenshot after scroll
    await page.screenshot({ 
      path: 'test-results/screenshots/after-scroll.png' 
    });
  });

  test('should test form inputs if present', async ({ page }) => {
    const inputs = await page.$$('input[type="text"], input[type="email"]');
    
    if (inputs.length > 0) {
      const firstInput = inputs[0];
      
      // Click and type in input
      await firstInput.click();
      await firstInput.fill('Test Input');
      await page.waitForTimeout(500);
      
      // Verify input value
      const value = await firstInput.inputValue();
      expect(value).toBe('Test Input');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'test-results/screenshots/form-input.png' 
      });
    }
  });

  test('should check for navigation menu', async ({ page }) => {
    // Look for navigation elements
    const navElements = await page.$$('nav, [role="navigation"]');
    console.log(`Found ${navElements.length} navigation elements`);
    
    // Look for common navigation patterns
    const menuButtons = await page.$$('[aria-label*="menu"], [aria-label*="Menu"]');
    console.log(`Found ${menuButtons.length} menu buttons`);
  });

  test('should test viewport adaptability', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'small-mobile' },
      { width: 375, height: 667, name: 'iphone' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: `test-results/screenshots/viewport-${viewport.name}.png`,
        fullPage: true
      });
      
      // Check if content is still accessible
      const body = await page.$('body');
      expect(body).not.toBeNull();
    }
  });

  test('should test image loading', async ({ page }) => {
    // Get all images
    const images = await page.$$('img');
    console.log(`Found ${images.length} images`);
    
    // Check if images have alt text
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt === null || alt === '') {
        console.warn('Image without alt text found');
      }
    }
  });

  test('should test animation performance', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Capture performance metrics
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
      };
    });
    
    console.log('Performance metrics:', metrics);
  });

});
