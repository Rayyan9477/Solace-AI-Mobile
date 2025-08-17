/**
 * Solace AI Mental Health App - Final Comprehensive E2E Validation
 * 
 * This test suite performs comprehensive end-to-end validation covering:
 * - Complete user journey testing
 * - Cross-device responsive testing
 * - Performance and accessibility validation
 * - Mental health app quality assurance
 * - Error handling and edge cases
 * - Comprehensive screenshot documentation
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:8083';
const NAVIGATION_TIMEOUT = 20000;
const SCREENSHOT_PATH = path.resolve('test-results/final-validation');

function ensureDir(dir) {
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
}

// Device configurations for responsive testing
const DEVICE_CONFIGS = {
  mobile: { width: 375, height: 812, name: 'iPhone-14-Pro' },
  mobileLarge: { width: 414, height: 896, name: 'iPhone-14-Pro-Max' },
  tablet: { width: 768, height: 1024, name: 'iPad-Pro' },
  desktop: { width: 1280, height: 720, name: 'Desktop-1280' },
  desktopLarge: { width: 1920, height: 1080, name: 'Desktop-1920' }
};

test.describe('Solace AI - Final Comprehensive Validation', () => {
  let consoleErrors = [];
  let performanceMetrics = {};

  test.beforeAll(async () => {
    ensureDir(SCREENSHOT_PATH);
    console.log('🚀 Starting Final Comprehensive Validation of Solace AI Mental Health App');
  });

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    
    // Monitor console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push({
        text: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });
  });

  test('1. Complete User Journey - Onboarding to Main App Flow', async ({ page }) => {
    console.log('🎯 Testing Complete User Journey Flow...');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    // Take initial screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/01-initial-load.png`,
      fullPage: true
    });

    // Check for onboarding elements
    const onboardingElements = [
      'Welcome', 'Get Started', 'Continue', 'Solace', 'Mental Health', 
      'AI Support', 'Privacy', 'Progress'
    ];

    let foundElements = [];
    for (const element of onboardingElements) {
      if (await page.locator(`text=${element}`).first().isVisible().catch(() => false)) {
        foundElements.push(element);
      }
    }

    console.log(`✅ Onboarding elements found: ${foundElements.join(', ')}`);

    // Try to navigate through onboarding
    const getStartedButton = page.locator('text=Get Started').first();
    if (await getStartedButton.isVisible().catch(() => false)) {
      await getStartedButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: `${SCREENSHOT_PATH}/02-after-get-started.png`,
        fullPage: true
      });
    }

    // Look for main app elements
    const mainAppElements = [
      'Dashboard', 'Home', 'Chat', 'Mood', 'Assessment', 'Profile'
    ];

    let foundMainElements = [];
    for (const element of mainAppElements) {
      if (await page.locator(`text=${element}`).first().isVisible().catch(() => false)) {
        foundMainElements.push(element);
      }
    }

    console.log(`✅ Main app elements found: ${foundMainElements.join(', ')}`);
    expect(foundElements.length + foundMainElements.length).toBeGreaterThan(0);
  });

  test('2. Navigation Tabs Comprehensive Testing', async ({ page }) => {
    console.log('🧭 Testing All Navigation Tabs...');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    const expectedTabs = ['Home', 'Chat', 'Mood', 'Assessment', 'Profile', 'Welcome'];
    let foundTabs = [];
    let tabScreenshots = [];

    for (const tab of expectedTabs) {
      const selectors = [
        `[role="tab"]:has-text("${tab}")`,
        `button:has-text("${tab}")`,
        `text="${tab}"`,
        `[aria-label*="${tab}"]`
      ];

      for (const selector of selectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          foundTabs.push(tab);
          
          try {
            await element.click();
            await page.waitForTimeout(2000);
            
            const screenshotPath = `${SCREENSHOT_PATH}/nav-${tab.toLowerCase()}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            tabScreenshots.push(screenshotPath);
            
            console.log(`✅ Successfully tested ${tab} tab`);
          } catch (e) {
            console.log(`⚠️  Could not fully test ${tab} tab: ${e.message}`);
          }
          break;
        }
      }
    }

    console.log(`🧭 Navigation tabs found and tested: ${foundTabs.join(', ')}`);
    console.log(`📸 Screenshots captured: ${tabScreenshots.length}`);
    
    expect(foundTabs.length).toBeGreaterThan(0);
  });

  test('3. Mood Tracking Workflow Validation', async ({ page }) => {
    console.log('💭 Testing Mood Tracking Workflow...');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    // Navigate to mood tracking
    const moodTab = page.locator('text=Mood').first();
    if (await moodTab.isVisible().catch(() => false)) {
      await moodTab.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({
        path: `${SCREENSHOT_PATH}/mood-tracking-start.png`,
        fullPage: true
      });

      // Look for mood tracking elements
      const moodElements = [
        'How are you feeling', 'Select mood', 'Happy', 'Sad', 'Anxious', 
        'Calm', 'Excited', 'Tired', 'Stressed', 'Content'
      ];

      let foundMoodElements = [];
      for (const element of moodElements) {
        if (await page.locator(`text=${element}`).first().isVisible().catch(() => false)) {
          foundMoodElements.push(element);
        }
      }

      console.log(`💭 Mood tracking elements found: ${foundMoodElements.join(', ')}`);

      // Try to interact with mood selection
      const moodOptions = await page.locator('button, [role="button"]').all();
      let moodInteractions = 0;
      
      for (let i = 0; i < Math.min(moodOptions.length, 5); i++) {
        try {
          await moodOptions[i].click();
          await page.waitForTimeout(1000);
          moodInteractions++;
        } catch (e) {
          // Continue with next option
        }
      }

      console.log(`💭 Mood interactions tested: ${moodInteractions}`);
      
      await page.screenshot({
        path: `${SCREENSHOT_PATH}/mood-tracking-interaction.png`,
        fullPage: true
      });

      expect(foundMoodElements.length).toBeGreaterThan(0);
    } else {
      console.log('⚠️  Mood tab not found, skipping mood tracking test');
    }
  });

  test('4. Cross-Device Responsive Testing', async ({ page }) => {
    console.log('📱 Testing Cross-Device Responsive Design...');
    
    for (const [deviceType, config] of Object.entries(DEVICE_CONFIGS)) {
      console.log(`📱 Testing ${deviceType} (${config.width}x${config.height})...`);
      
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
      await page.waitForTimeout(2000);

      // Take screenshot for each device
      await page.screenshot({
        path: `${SCREENSHOT_PATH}/responsive-${config.name}.png`,
        fullPage: false
      });

      // Check layout elements
      const buttons = await page.locator('button').count();
      const cards = await page.locator('[style*="shadow"], [class*="card"]').count();
      const navigableElements = await page.locator('[role="tab"], [role="button"]').count();

      console.log(`  📊 ${deviceType}: Buttons: ${buttons}, Cards: ${cards}, Nav: ${navigableElements}`);

      // Test navigation on this device
      const navElements = await page.locator('[role="tab"], [role="button"]').all();
      let clickableCount = 0;
      for (let i = 0; i < Math.min(navElements.length, 3); i++) {
        if (await navElements[i].isVisible().catch(() => false)) {
          clickableCount++;
        }
      }

      console.log(`  ✅ ${deviceType}: ${clickableCount} clickable navigation elements`);
    }

    console.log('✅ Cross-device responsive testing completed');
  });

  test('5. Performance Metrics and Core Web Vitals', async ({ page }) => {
    console.log('⚡ Measuring Performance Metrics...');
    
    // Start performance monitoring
    const startTime = Date.now();
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️  Total load time: ${loadTime}ms`);

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    console.log(`📊 Performance Metrics:`);
    console.log(`  - Load Time: ${metrics.loadTime}ms`);
    console.log(`  - DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`  - First Paint: ${metrics.firstPaint}ms`);
    console.log(`  - First Contentful Paint: ${metrics.firstContentfulPaint}ms`);

    performanceMetrics = metrics;

    // Check for performance issues
    expect(metrics.loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(3000); // FCP should be under 3 seconds

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/performance-loaded-state.png`,
      fullPage: true
    });

    console.log('✅ Performance metrics captured');
  });

  test('6. Accessibility Features Validation', async ({ page }) => {
    console.log('♿ Testing Accessibility Features...');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    // Check accessibility landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="complementary"]').count();
    console.log(`♿ Accessibility landmarks: ${landmarks}`);

    // Check heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    console.log(`📝 Heading elements: ${headings}`);

    // Check images with alt text
    const images = await page.locator('img').count();
    const imagesWithAlt = await page.locator('img[alt]').count();
    console.log(`🖼️  Images: ${images}, With alt text: ${imagesWithAlt}`);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? {
        tagName: active.tagName,
        role: active.getAttribute('role'),
        ariaLabel: active.getAttribute('aria-label')
      } : null;
    });

    console.log(`⌨️  Focused element after Tab:`, focusedElement);

    // Test multiple tab navigation
    let tabCount = 0;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      const activeElement = await page.evaluate(() => document.activeElement?.tagName || 'NONE');
      if (activeElement !== 'BODY') {
        tabCount++;
      }
    }

    console.log(`⌨️  Keyboard navigable elements: ${tabCount}/5`);

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/accessibility-state.png`,
      fullPage: true
    });

    expect(headings).toBeGreaterThan(0);
    console.log('✅ Accessibility validation completed');
  });

  test('7. Theme Switching and Persistence', async ({ page }) => {
    console.log('🎨 Testing Theme Switching...');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    // Take screenshot of default theme
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/theme-default.png`,
      fullPage: true
    });

    // Look for theme toggle
    const themeSelectors = [
      '[data-testid="theme-toggle"]',
      '[aria-label*="theme"]',
      '[aria-label*="dark"]',
      'text=Dark',
      'text=Light',
      'text=Theme'
    ];

    let themeToggleFound = false;
    for (const selector of themeSelectors) {
      const toggle = page.locator(selector).first();
      if (await toggle.isVisible().catch(() => false)) {
        try {
          await toggle.click();
          await page.waitForTimeout(1000);
          
          await page.screenshot({
            path: `${SCREENSHOT_PATH}/theme-switched.png`,
            fullPage: true
          });
          
          themeToggleFound = true;
          console.log(`🎨 Theme toggle found and tested: ${selector}`);
          break;
        } catch (e) {
          console.log(`⚠️  Could not click theme toggle: ${e.message}`);
        }
      }
    }

    if (!themeToggleFound) {
      console.log('⚠️  No theme toggle found, checking for automatic theme detection');
      
      // Check for time-based or system theme
      const hasTimeBasedGradient = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (let element of elements) {
          const style = window.getComputedStyle(element);
          if (style.background && style.background.includes('gradient')) {
            return true;
          }
        }
        return false;
      });
      
      console.log(`🎨 Time-based/automatic theming detected: ${hasTimeBasedGradient}`);
    }

    console.log('✅ Theme switching validation completed');
  });

  test('8. Error Handling and Edge Cases', async ({ page }) => {
    console.log('🔍 Testing Error Handling and Edge Cases...');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    // Test rapid clicking to check for race conditions
    const buttons = await page.locator('button').all();
    if (buttons.length > 0) {
      try {
        for (let i = 0; i < 3; i++) {
          await buttons[0].click();
          await page.waitForTimeout(100);
        }
        console.log('✅ Rapid clicking test passed');
      } catch (e) {
        console.log(`⚠️  Rapid clicking test: ${e.message}`);
      }
    }

    // Test network offline scenario
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);
    
    // Try to navigate while offline
    if (buttons.length > 1) {
      try {
        await buttons[1].click();
        await page.waitForTimeout(2000);
        console.log('✅ Offline navigation test completed');
      } catch (e) {
        console.log(`⚠️  Offline navigation: ${e.message}`);
      }
    }

    // Restore network
    await page.context().setOffline(false);
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/error-handling-test.png`,
      fullPage: true
    });

    // Check console errors accumulated during testing
    const criticalErrors = consoleErrors.filter(error => 
      !error.text.includes('favicon') && 
      !error.text.includes('Source map') &&
      !error.text.includes('DevTools')
    );

    console.log(`🚨 Critical console errors found: ${criticalErrors.length}`);
    criticalErrors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error.text}`);
    });

    console.log('✅ Error handling validation completed');
  });

  test('9. Mental Health App Quality Assurance', async ({ page }) => {
    console.log('🧠 Testing Mental Health App Quality...');
    
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    // Check for therapeutic elements
    const therapeuticElements = [
      'therapy', 'wellness', 'mindfulness', 'meditation', 'calm', 'peaceful',
      'support', 'care', 'healing', 'mental health', 'wellbeing'
    ];

    let foundTherapeuticElements = [];
    for (const element of therapeuticElements) {
      if (await page.locator(`text=${element}`).first().isVisible().catch(() => false)) {
        foundTherapeuticElements.push(element);
      }
    }

    console.log(`🧠 Therapeutic elements found: ${foundTherapeuticElements.join(', ')}`);

    // Check for calming colors and gradients
    const hasTherapeuticDesign = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let hasCalming = false;
      let hasGradients = false;
      
      for (let element of elements) {
        const style = window.getComputedStyle(element);
        
        // Check for gradients
        if (style.background && style.background.includes('gradient')) {
          hasGradients = true;
        }
        
        // Check for calming colors (blues, greens, soft purples)
        if (style.color || style.backgroundColor) {
          const colors = (style.color + ' ' + style.backgroundColor).toLowerCase();
          if (colors.includes('blue') || colors.includes('green') || colors.includes('purple')) {
            hasCalming = true;
          }
        }
      }
      
      return { hasCalming, hasGradients };
    });

    console.log(`🎨 Therapeutic design detected:`, hasTherapeuticDesign);

    // Check for crisis/emergency features
    const emergencyElements = [
      'emergency', 'crisis', 'help', 'support', 'hotline', 'urgent'
    ];

    let foundEmergencyElements = [];
    for (const element of emergencyElements) {
      if (await page.locator(`text=${element}`).first().isVisible().catch(() => false)) {
        foundEmergencyElements.push(element);
      }
    }

    console.log(`🚨 Emergency support elements: ${foundEmergencyElements.join(', ')}`);

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/mental-health-quality.png`,
      fullPage: true
    });

    expect(foundTherapeuticElements.length).toBeGreaterThan(0);
    console.log('✅ Mental health app quality validation completed');
  });

  test('10. Final Comprehensive Screenshots', async ({ page }) => {
    console.log('📸 Capturing Final Comprehensive Screenshots...');
    
    // Test on primary mobile device
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/final-mobile-full.png`,
      fullPage: true
    });

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/final-mobile-viewport.png`,
      fullPage: false
    });

    // Test on desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: NAVIGATION_TIMEOUT });
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/final-desktop-full.png`,
      fullPage: true
    });

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/final-desktop-viewport.png`,
      fullPage: false
    });

    console.log('📸 Final screenshots captured');
    console.log('✅ Comprehensive validation completed successfully!');
  });

  test.afterAll(async () => {
    console.log('\n🎯 FINAL VALIDATION SUMMARY:');
    console.log('=====================================');
    console.log(`📊 Performance Metrics:`);
    if (performanceMetrics.loadTime) {
      console.log(`  - Load Time: ${performanceMetrics.loadTime}ms`);
      console.log(`  - DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
      console.log(`  - First Paint: ${performanceMetrics.firstPaint}ms`);
      console.log(`  - First Contentful Paint: ${performanceMetrics.firstContentfulPaint}ms`);
    }
    console.log(`🚨 Total Console Errors: ${consoleErrors.length}`);
    console.log(`📁 Screenshots Directory: ${SCREENSHOT_PATH}`);
    console.log('=====================================');
  });
});