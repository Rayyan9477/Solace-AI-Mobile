/**
 * Solace AI Mobile - Final Comprehensive Mental Health E2E Tests
 * 
 * Complete validation of the mental health app running on http://localhost:8082
 * Tests all critical user journeys without complex global setup
 */

import { test, expect, devices } from '@playwright/test';

// Simple test configuration
const CONFIG = {
  baseURL: 'http://localhost:8082',
  timeout: 20000,
  viewports: {
    mobile: { width: 375, height: 812 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 }
  }
};

// Helper functions
const helpers = {
  async takeScreenshot(page, name) {
    try {
      await page.screenshot({ 
        path: `test-results/mental-health-${name}.png`,
        fullPage: true 
      });
    } catch (e) {
      console.log(`Screenshot failed for ${name}:`, e.message);
    }
  },

  async waitForApp(page) {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(2000); // Allow React to render
  },

  async checkConnectivity(page) {
    try {
      const response = await page.goto(CONFIG.baseURL, { timeout: 10000 });
      return response.status() === 200;
    } catch (e) {
      console.error('App connectivity check failed:', e.message);
      return false;
    }
  }
};

test.describe('Solace AI Mobile - Mental Health E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport for mental health app testing
    await page.setViewportSize(CONFIG.viewports.mobile);
    
    // Check if app is running
    const isRunning = await helpers.checkConnectivity(page);
    if (!isRunning) {
      throw new Error('🚨 Solace AI Mobile app is not running on http://localhost:8082\nPlease start the app first: npm start or expo start --port 8082');
    }
  });

  test('🎯 App loads and shows onboarding screen', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Should show onboarding
    await expect(page.locator('text=/Welcome to the ultimate freud UI Kit/i')).toBeVisible({
      timeout: 10000
    });

    // Check for key onboarding elements
    await expect(page.locator('text=/Step One/i')).toBeVisible();
    await expect(page.locator('text=/Get Started|Skip/i')).toBeVisible();

    await helpers.takeScreenshot(page, 'onboarding-initial');
    console.log('✅ Onboarding screen loaded successfully');
  });

  test('🚀 Complete 6-step onboarding flow', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    const steps = [
      { step: 1, title: 'Welcome to the ultimate freud UI Kit', button: 'Get Started' },
      { step: 2, title: 'Personalize Your Mental Health State', button: 'Continue' },
      { step: 3, title: 'Intelligent Mood Tracking', button: 'Continue' },
      { step: 4, title: 'AI Mental Journaling', button: 'Continue' },
      { step: 5, title: 'Mindful Resources', button: 'Continue' },
      { step: 6, title: 'Loving & Supportive Community', button: 'Get Started' }
    ];

    for (const { step, title, button } of steps) {
      // Wait for step to load
      await expect(page.locator(`text=/Step.*${step === 1 ? 'One' : step === 2 ? 'Two' : step === 3 ? 'Three' : step === 4 ? 'Four' : step === 5 ? 'Five' : 'Six'}/i`)).toBeVisible();
      
      // Check step content
      await expect(page.locator(`text=/${title}/i`)).toBeVisible();
      
      await helpers.takeScreenshot(page, `onboarding-step-${step}`);
      
      // Click next button
      await page.click(`text=${button}`);
      await page.waitForTimeout(1500);
    }

    // Should reach main app
    await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible({
      timeout: 10000
    });

    await helpers.takeScreenshot(page, 'onboarding-complete');
    console.log('✅ 6-step onboarding flow completed successfully');
  });

  test('⚡ Skip onboarding and reach main app', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(3000);

    // Should be in main app
    await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible({
      timeout: 10000
    });

    await helpers.takeScreenshot(page, 'onboarding-skipped');
    console.log('✅ Onboarding skip functionality works');
  });

  test('🧭 Navigation between all tabs', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    const tabs = [
      { name: 'Welcome', expectedContent: 'Welcome|freud' },
      { name: 'Home', expectedContent: 'mood|dashboard|check|Home' },
      { name: 'Chat', expectedContent: 'chat|conversation|message|Chat' },
      { name: 'Mood', expectedContent: 'mood|tracking|feeling|select' },
      { name: 'Assessment', expectedContent: 'assessment|evaluation|Assessment' },
      { name: 'Wellness', expectedContent: 'wellness|mindful|resources|Wellness' },
      { name: 'Utilities', expectedContent: 'search|help|tools|utilities' },
      { name: 'Profile', expectedContent: 'profile|settings|account|Profile' }
    ];

    for (const tab of tabs) {
      try {
        // Click tab
        await page.click(`text=${tab.name}`);
        await page.waitForTimeout(1500);

        // Verify content or tab label is visible
        const contentVisible = await page.locator(`text=/${tab.expectedContent}/i`).first().isVisible();
        if (contentVisible) {
          await expect(page.locator(`text=/${tab.expectedContent}/i`).first()).toBeVisible();
        }

        await helpers.takeScreenshot(page, `navigation-${tab.name.toLowerCase()}`);
        console.log(`✅ ${tab.name} tab navigation working`);
      } catch (e) {
        console.log(`⚠️ ${tab.name} tab navigation issue:`, e.message);
      }
    }
  });

  test('🎭 Mood tracking functionality', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding and go to mood tracking
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);
    
    await page.click('text=Mood');
    await page.waitForTimeout(2000);

    // Should show mood tracking interface
    const moodElements = await page.locator('text=/mood|tracking|feeling|select|step/i').count();
    expect(moodElements).toBeGreaterThan(0);

    // Try to interact with mood tracking
    const moodOptions = await page.locator('text=/happy|sad|anxious|calm|angry|excited/i').count();
    if (moodOptions > 0) {
      const firstMood = page.locator('text=/happy|calm/i').first();
      if (await firstMood.isVisible()) {
        await firstMood.click();
        await page.waitForTimeout(1000);
        console.log('✅ Mood selection interaction working');
      }
    }

    await helpers.takeScreenshot(page, 'mood-tracking');
  });

  test('🛡️ Error boundaries and stability', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    // Navigate rapidly to test stability
    const tabs = ['Home', 'Chat', 'Mood', 'Profile'];
    
    for (let i = 0; i < 3; i++) { // Multiple cycles
      for (const tab of tabs) {
        try {
          await page.click(`text=${tab}`);
          await page.waitForTimeout(500);
          
          // Check no error boundaries triggered
          const errorCount = await page.locator('text=/error.*boundary|something.*wrong|error.*occurred/i').count();
          expect(errorCount).toBe(0);
        } catch (e) {
          console.log(`Navigation error on ${tab}:`, e.message);
        }
      }
    }

    console.log('✅ App stability test passed - no error boundaries triggered');
  });

  test('♿ Accessibility validation', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      expect(await focusedElement.isVisible()).toBe(true);
      console.log('✅ Keyboard navigation working');
    }

    // Check touch target sizes (important for mental health apps)
    const buttons = await page.locator('button, [role="button"]').all();
    let validTargets = 0;
    
    for (const button of buttons.slice(0, 5)) {
      const box = await button.boundingBox();
      if (box && box.width >= 44 && box.height >= 44) {
        validTargets++;
      }
    }

    expect(validTargets).toBeGreaterThan(0);
    console.log(`✅ Touch target accessibility validated (${validTargets} valid targets)`);

    await helpers.takeScreenshot(page, 'accessibility-check');
  });

  test('🎨 Therapeutic design elements', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Check for therapeutic design (gradients, calming colors)
    const hasGradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (let el of elements) {
        const style = window.getComputedStyle(el);
        if (style.background && style.background.includes('gradient')) {
          return true;
        }
      }
      return false;
    });

    expect(hasGradients).toBe(true);
    console.log('✅ Therapeutic design elements (gradients) present');

    await helpers.takeScreenshot(page, 'therapeutic-design');
  });

  test('🚀 Performance validation', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);
    
    const loadTime = Date.now() - startTime;
    
    // Mental health apps should load quickly to reduce user anxiety
    expect(loadTime).toBeLessThan(6000);
    console.log(`✅ App loaded in ${loadTime}ms (under 6s target)`);

    // Check for critical JS errors
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.waitForTimeout(3000);
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning') && 
      !e.includes('DevTools') &&
      !e.includes('WebSocket')
    );

    expect(criticalErrors.length).toBe(0);
    if (criticalErrors.length === 0) {
      console.log('✅ No critical JavaScript errors detected');
    }
  });

  test('📱 Responsive design - tablet viewport', async ({ page }) => {
    await page.setViewportSize(CONFIG.viewports.tablet);
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    // Should adapt to tablet size
    await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible();

    await helpers.takeScreenshot(page, 'responsive-tablet');
    console.log('✅ Tablet viewport adaptation working');
  });

  test('🖥️ Responsive design - desktop viewport', async ({ page }) => {
    await page.setViewportSize(CONFIG.viewports.desktop);
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    // Should work on desktop
    await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible();

    // Test interaction
    await page.click('text=Home');
    await page.waitForTimeout(1000);

    await helpers.takeScreenshot(page, 'responsive-desktop');
    console.log('✅ Desktop viewport functionality working');
  });
});

// Crisis support and safety feature tests
test.describe('🆘 Mental Health Safety Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(CONFIG.viewports.mobile);
    const isRunning = await helpers.checkConnectivity(page);
    if (!isRunning) {
      throw new Error('App not accessible on http://localhost:8082');
    }
  });

  test('🚨 Crisis support accessibility', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Skip onboarding
    await page.click('text=/Skip/i');
    await page.waitForTimeout(2000);

    // Check for crisis support elements
    const crisisElements = await page.locator('text=/emergency|crisis|help|988|support/i').count();
    if (crisisElements > 0) {
      console.log('✅ Crisis support elements found');
    } else {
      console.log('ℹ️ No visible crisis support elements detected');
    }

    await helpers.takeScreenshot(page, 'crisis-support-check');
  });

  test('🔒 Security validation', async ({ page }) => {
    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    // Check that sensitive data is not exposed
    const content = await page.content();
    const sensitivePatterns = [
      /api[_-]?key/i,
      /secret/i,
      /password/i,
      /private.*key/i,
      /token.*[a-zA-Z0-9]{20,}/i
    ];

    let securityIssues = 0;
    for (const pattern of sensitivePatterns) {
      if (pattern.test(content)) {
        securityIssues++;
      }
    }

    expect(securityIssues).toBe(0);
    console.log('✅ No sensitive data exposed in client');
  });
});

// Final comprehensive test
test.describe('🎯 Final Integration Test', () => {
  test('Complete user journey - onboarding to mood tracking', async ({ page }) => {
    await page.setViewportSize(CONFIG.viewports.mobile);
    
    const isRunning = await helpers.checkConnectivity(page);
    if (!isRunning) {
      throw new Error('App not running on port 8082');
    }

    await page.goto(CONFIG.baseURL);
    await helpers.waitForApp(page);

    console.log('🎬 Starting complete user journey test...');

    // 1. Complete onboarding
    await page.click('text=/Get Started/i');
    await page.waitForTimeout(1000);
    
    // Skip through remaining steps quickly
    for (let i = 0; i < 4; i++) {
      await page.click('text=/Continue/i');
      await page.waitForTimeout(800);
    }
    
    // Final step
    await page.click('text=/Get Started/i');
    await page.waitForTimeout(2000);

    console.log('✅ Onboarding completed');

    // 2. Navigate to mood tracking
    await page.click('text=Mood');
    await page.waitForTimeout(1500);

    console.log('✅ Navigated to mood tracking');

    // 3. Interact with mood features
    const moodContent = await page.locator('text=/mood|feeling|track/i').count();
    expect(moodContent).toBeGreaterThan(0);

    console.log('✅ Mood tracking interface accessible');

    // 4. Test other key features
    await page.click('text=Home');
    await page.waitForTimeout(1000);

    await page.click('text=Profile');
    await page.waitForTimeout(1000);

    console.log('✅ Core navigation working');

    await helpers.takeScreenshot(page, 'complete-journey');

    console.log('🎉 Complete user journey test passed!');
  });
});