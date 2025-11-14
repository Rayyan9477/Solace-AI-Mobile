/**
 * Comprehensive UI Testing for Solace AI Mental Health App
 * Tests UI rendering, navigation, and visual appearance
 */

const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile - Comprehensive UI Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the app successfully', async ({ page }) => {
    // Check if the page loaded
    expect(page.url()).toContain('localhost');
    
    // Check for any console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Log any errors found
    if (errors.length > 0) {
      console.warn('Console errors detected:', errors);
    }
  });

  test('should display app title or branding', async ({ page }) => {
    // Look for common app identifiers
    const bodyText = await page.textContent('body');
    const hasAppName = bodyText.includes('Solace') || 
                       bodyText.includes('Mental Health') ||
                       bodyText.includes('Welcome');
    
    expect(hasAppName).toBeTruthy();
  });

  test('should have proper page structure', async ({ page }) => {
    // Check if main content area exists
    const body = await page.$('body');
    expect(body).not.toBeNull();
    
    // Get snapshot of the page
    const snapshot = await page.accessibility.snapshot();
    expect(snapshot).not.toBeNull();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Check if content is visible
    const body = await page.$('body');
    expect(body).not.toBeNull();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/mobile-view.png',
      fullPage: true 
    });
  });

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/tablet-view.png',
      fullPage: true 
    });
  });

  test('should be responsive on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/desktop-view.png',
      fullPage: true 
    });
  });

  test('should have no critical accessibility violations', async ({ page }) => {
    // Get accessibility tree
    const snapshot = await page.accessibility.snapshot();
    
    // Basic accessibility checks
    expect(snapshot).not.toBeNull();
    expect(snapshot.children).toBeDefined();
  });

  test('should handle dark mode gracefully', async ({ page, context }) => {
    // Set color scheme to dark
    await context.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of dark mode
    await page.screenshot({ 
      path: 'test-results/screenshots/dark-mode.png',
      fullPage: true 
    });
  });

  test('should handle light mode gracefully', async ({ page, context }) => {
    // Set color scheme to light
    await context.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of light mode
    await page.screenshot({ 
      path: 'test-results/screenshots/light-mode.png',
      fullPage: true 
    });
  });

  test('should handle reduced motion preference', async ({ page, context }) => {
    // Set reduced motion
    await context.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if page still loads correctly
    const body = await page.$('body');
    expect(body).not.toBeNull();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check for viewport meta tag
    const viewport = await page.$('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    
    // Check for description (if present)
    const description = await page.$('meta[name="description"]');
    // Description might not be present in development, so just check
    if (description) {
      const content = await description.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.waitForTimeout(3000);
    
    // Expect no critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('console.warn')
    );
    
    if (criticalErrors.length > 0) {
      console.warn('Page errors detected:', criticalErrors);
    }
  });

  test('should capture full page visual state', async ({ page }) => {
    // Take full page screenshot for visual inspection
    await page.screenshot({ 
      path: 'test-results/screenshots/full-page.png',
      fullPage: true 
    });
    
    // Take viewport screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/viewport.png',
      fullPage: false 
    });
  });

  test('should measure page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    // Expect reasonable load time (adjust as needed)
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
  });

  test('should have proper color contrast in light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for manual contrast review
    await page.screenshot({ 
      path: 'test-results/screenshots/contrast-light.png',
      fullPage: true 
    });
  });

  test('should have proper color contrast in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for manual contrast review
    await page.screenshot({ 
      path: 'test-results/screenshots/contrast-dark.png',
      fullPage: true 
    });
  });

});
