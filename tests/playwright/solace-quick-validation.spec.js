/**
 * Solace AI Mobile - Quick Validation Test
 * 
 * Fast smoke test to verify the app is running correctly
 * and all major components are accessible before running
 * the comprehensive test suite.
 */

import { test, expect } from '@playwright/test';

const QUICK_TEST_CONFIG = {
  baseURL: 'http://localhost:8082',
  timeout: 15000,
  viewport: { width: 375, height: 812 }
};

test.describe('Solace AI Mobile - Quick Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(QUICK_TEST_CONFIG.viewport);
    await page.goto(QUICK_TEST_CONFIG.baseURL);
  });

  test('app loads and shows onboarding screen', async ({ page }) => {
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should show onboarding
    await expect(page.locator('text=/Welcome to the ultimate freud UI Kit/i')).toBeVisible({
      timeout: 10000
    });

    // Should have navigation elements
    await expect(page.locator('text=/Get Started|Skip/i')).toBeVisible();

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/quick-validation-onboarding.png',
      fullPage: true 
    });

    console.log('✅ Onboarding screen loaded successfully');
  });

  test('can complete onboarding and reach main app', async ({ page }) => {
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(3000);

    // Should be in main app with tabs
    await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible({
      timeout: 10000
    });

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/quick-validation-main-app.png',
      fullPage: true 
    });

    console.log('✅ Main app loaded successfully');
  });

  test('navigation tabs are functional', async ({ page }) => {
    // Complete onboarding
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    // Test tab navigation
    const tabs = ['Home', 'Chat', 'Mood', 'Profile'];
    
    for (const tab of tabs) {
      await page.click(`text=${tab}`);
      await page.waitForTimeout(1000);
      
      // Verify tab is active/visible
      await expect(page.locator(`text=${tab}`)).toBeVisible();
      
      console.log(`✅ ${tab} tab working`);
    }
  });

  test('mood tracking is accessible', async ({ page }) => {
    // Complete onboarding and go to mood
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);
    
    await page.click('text=Mood');
    await page.waitForTimeout(1500);

    // Should show mood tracking interface
    await expect(page.locator('text=/mood|tracking|feeling|select/i')).toBeVisible({
      timeout: 10000
    });

    console.log('✅ Mood tracking accessible');
  });

  test('error boundaries are working', async ({ page }) => {
    // Complete onboarding
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    // Navigate around to test stability
    const tabs = ['Home', 'Chat', 'Mood', 'Profile'];
    
    for (const tab of tabs) {
      await page.click(`text=${tab}`);
      await page.waitForTimeout(500);
      
      // Should not show error boundary messages
      const errorCount = await page.locator('text=/error.*boundary|something.*wrong|error.*occurred/i').count();
      expect(errorCount).toBe(0);
    }

    console.log('✅ Error boundaries working correctly');
  });

  test('therapeutic design elements are present', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for gradient backgrounds (therapeutic design)
    const gradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let gradientCount = 0;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.background && style.background.includes('gradient')) {
          gradientCount++;
        }
      });
      return gradientCount;
    });

    expect(gradients).toBeGreaterThan(0);
    console.log('✅ Therapeutic design elements present');
  });

  test('app performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(QUICK_TEST_CONFIG.baseURL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds for mental health app
    expect(loadTime).toBeLessThan(5000);
    
    console.log(`✅ App loaded in ${loadTime}ms`);
  });
});

// Quick health check
test.describe('App Health Check', () => {
  test('responds to HTTP requests', async ({ page }) => {
    const response = await page.goto(QUICK_TEST_CONFIG.baseURL);
    expect(response.status()).toBe(200);
    console.log('✅ App responding to HTTP requests');
  });

  test('JavaScript executes without errors', async ({ page }) => {
    const errors = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto(QUICK_TEST_CONFIG.baseURL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Should have no critical JavaScript errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning') && 
      !error.includes('DevTools') &&
      !error.includes('Websocket')
    );

    expect(criticalErrors.length).toBe(0);
    
    if (criticalErrors.length === 0) {
      console.log('✅ No critical JavaScript errors detected');
    } else {
      console.log('❌ JavaScript errors detected:', criticalErrors);
    }
  });
});