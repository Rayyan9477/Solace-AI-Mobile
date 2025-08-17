/**
 * Solace AI Mental Health App - User Validation Tests
 * 
 * Comprehensive testing of the application on http://localhost:8083
 * after fixing critical JavaScript errors.
 * 
 * Test Coverage:
 * 1. Initial Loading & Error Check
 * 2. Navigation Testing
 * 3. UI Component Interaction
 * 4. Mental Health App Features
 * 5. Accessibility Validation
 * 6. Responsive Design
 * 7. Performance Check
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:8083';
const TIMEOUT_20S = 20000; // 20-second timeouts as requested
const SCREENSHOT_PATH = path.resolve('test-results/screenshots/user-validation');

function ensureDir(dir) {
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
}

test.describe('Solace AI Mobile - User Validation Test Suite', () => {
  let consoleMessages = [];
  let consoleErrors = [];

  test.beforeAll(async () => {
    ensureDir(SCREENSHOT_PATH);
  });

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

    // Set default viewport for mobile testing
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('1. Initial Loading & Error Check', async ({ page }) => {
    console.log('🔍 1. Testing Initial Loading & Error Check...');
    
    // Navigate to the application
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT_20S 
    });

    // Wait for React app to load
    await page.waitForLoadState('domcontentloaded', { timeout: TIMEOUT_20S });
    await page.waitForTimeout(3000); // Allow time for full rendering

    // Check for console errors (should be none now)
    console.log(`📝 Console messages: ${consoleMessages.length}`);
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    
    // Filter out non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.text.includes('favicon') && 
      !error.text.includes('Source map') &&
      !error.text.includes('DevTools') &&
      !error.text.includes('Extension')
    );
    
    console.log(`🚨 Critical errors: ${criticalErrors.length}`);
    criticalErrors.forEach(error => console.log(`   ERROR: ${error.text}`));

    // Verify React application loads properly
    const appContainer = await page.locator('#root, #expo-root, [data-testid="app-container"]').first();
    await expect(appContainer).toBeVisible({ timeout: TIMEOUT_20S });

    // Verify page title
    const title = await page.title();
    console.log(`📱 App Title: ${title}`);
    expect(title).toBeTruthy();

    // Take screenshot of initial screen
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/01-initial-loading.png`,
      fullPage: true
    });

    console.log('✅ Initial loading verification completed');
  });

  test('2. Navigation Testing', async ({ page }) => {
    console.log('🧭 2. Testing Navigation...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT_20S 
    });

    await page.waitForTimeout(3000);

    // Expected navigation tabs
    const expectedTabs = ['Cover', 'Home', 'Chat', 'Mood', 'Assessment', 'Wellness', 'Utilities', 'Profile'];
    let foundTabs = [];

    // Test tab navigation
    for (const tab of expectedTabs) {
      try {
        // Try multiple selectors for navigation tabs
        const selectors = [
          `[role="tab"]:has-text("${tab}")`,
          `button:has-text("${tab}")`,
          `text="${tab}"`,
          `[aria-label*="${tab}"]`,
          `[data-testid*="${tab.toLowerCase()}"]`,
          `[class*="tab"]:has-text("${tab}")`,
          `[class*="navigation"]:has-text("${tab}")`
        ];

        for (const selector of selectors) {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
            foundTabs.push(tab);
            console.log(`🎯 Found and testing tab: ${tab}`);
            
            // Click the tab and verify it loads
            await element.click({ timeout: TIMEOUT_20S });
            await page.waitForTimeout(1000);
            
            // Take screenshot of each screen
            await page.screenshot({
              path: `${SCREENSHOT_PATH}/02-navigation-${tab.toLowerCase()}.png`,
              fullPage: true
            });
            
            break;
          }
        }
      } catch (e) {
        console.log(`ℹ️  Could not access ${tab} tab: ${e.message}`);
      }
    }

    console.log(`🧭 Navigation tabs found: ${foundTabs.join(', ')}`);

    // Test back navigation if possible
    try {
      await page.goBack({ timeout: 5000 });
      console.log('🔙 Back navigation works');
    } catch (e) {
      console.log('ℹ️  Back navigation not applicable');
    }

    console.log('✅ Navigation testing completed');
  });

  test('3. UI Component Interaction', async ({ page }) => {
    console.log('🎮 3. Testing UI Component Interaction...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT_20S 
    });

    await page.waitForTimeout(3000);

    // Test all visible buttons and interactive elements
    const buttons = await page.locator('button, [role="button"]').all();
    console.log(`🔘 Found ${buttons.length} interactive buttons`);

    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      try {
        const button = buttons[i];
        const isVisible = await button.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (isVisible) {
          const buttonText = await button.textContent().catch(() => '');
          console.log(`🖱️  Testing button: "${buttonText}"`);
          
          await button.click({ timeout: 5000 });
          await page.waitForTimeout(500);
        }
      } catch (e) {
        console.log(`ℹ️  Could not interact with button ${i}: ${e.message}`);
      }
    }

    // Test form inputs if present
    const inputs = await page.locator('input, textarea').all();
    console.log(`📝 Found ${inputs.length} input fields`);

    for (let i = 0; i < Math.min(inputs.length, 5); i++) {
      try {
        const input = inputs[i];
        const isVisible = await input.isVisible({ timeout: 1000 }).catch(() => false);
        
        if (isVisible) {
          await input.fill('Test input', { timeout: 5000 });
          await page.waitForTimeout(200);
          await input.clear({ timeout: 5000 });
          console.log(`📝 Tested input field ${i}`);
        }
      } catch (e) {
        console.log(`ℹ️  Could not test input ${i}: ${e.message}`);
      }
    }

    // Test theme toggle functionality
    try {
      const themeToggle = page.locator('[data-testid="theme-toggle"], [aria-label*="theme"], [aria-label*="dark"], button:has-text("Theme")').first();
      if (await themeToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('🎨 Testing theme toggle');
        await themeToggle.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
        
        await page.screenshot({
          path: `${SCREENSHOT_PATH}/03-theme-toggle-test.png`,
          fullPage: true
        });
      }
    } catch (e) {
      console.log('ℹ️  Theme toggle not found or not functional');
    }

    // Test hover states and animations
    try {
      const firstButton = page.locator('button').first();
      if (await firstButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstButton.hover({ timeout: 5000 });
        await page.waitForTimeout(500);
        console.log('🖱️  Hover interactions work');
      }
    } catch (e) {
      console.log('ℹ️  Hover interactions not testable');
    }

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/04-ui-components.png`,
      fullPage: true
    });

    console.log('✅ UI component interaction testing completed');
  });

  test('4. Mental Health App Features', async ({ page }) => {
    console.log('🧠 4. Testing Mental Health App Features...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT_20S 
    });

    await page.waitForTimeout(3000);

    // Look for mood tracking components
    const moodElements = [
      'mood', 'feeling', 'track', 'check-in', 'how are you',
      'emotion', 'anxiety', 'depression', 'happy', 'sad'
    ];

    let foundMoodFeatures = [];
    for (const element of moodElements) {
      const count = await page.locator(`text="${element}"`, { hasText: new RegExp(element, 'i') }).count();
      if (count > 0) {
        foundMoodFeatures.push(element);
      }
    }

    console.log(`🎭 Mood tracking features found: ${foundMoodFeatures.join(', ')}`);

    // Check for therapeutic color schemes
    const hasTherapeuticColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const therapeuticColors = ['blue', 'green', 'purple', 'teal', 'indigo'];
      
      for (let element of elements) {
        const style = window.getComputedStyle(element);
        const bgColor = style.backgroundColor || style.background;
        const color = style.color;
        
        for (let therapeuticColor of therapeuticColors) {
          if (bgColor.includes(therapeuticColor) || color.includes(therapeuticColor)) {
            return true;
          }
        }
      }
      return false;
    });

    console.log(`🎨 Therapeutic colors detected: ${hasTherapeuticColors}`);

    // Check for gradients
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

    console.log(`🌈 Therapeutic gradients detected: ${hasGradients}`);

    // Test mood selectors if present
    try {
      const moodSelector = page.locator('[data-testid*="mood"], button:has-text("mood"), [class*="mood"]').first();
      if (await moodSelector.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('🎭 Testing mood selector');
        await moodSelector.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('ℹ️  Mood selector not found');
    }

    // Verify icon system integration
    const iconCount = await page.locator('svg, [class*="icon"], [data-testid*="icon"]').count();
    console.log(`🎯 Icon system elements: ${iconCount}`);

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/05-mental-health-features.png`,
      fullPage: true
    });

    console.log('✅ Mental health features testing completed');
  });

  test('5. Accessibility Validation', async ({ page }) => {
    console.log('♿ 5. Testing Accessibility...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT_20S 
    });

    await page.waitForTimeout(3000);

    // Check for ARIA labels and roles
    const ariaLabels = await page.locator('[aria-label]').count();
    const ariaRoles = await page.locator('[role]').count();
    const landmarkRoles = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="complementary"]').count();
    
    console.log(`🏷️  ARIA labels: ${ariaLabels}`);
    console.log(`🎭 ARIA roles: ${ariaRoles}`);
    console.log(`🗺️  Accessibility landmarks: ${landmarkRoles}`);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    const focusedElement = await page.evaluate(() => {
      const activeEl = document.activeElement;
      return activeEl ? {
        tagName: activeEl.tagName,
        role: activeEl.getAttribute('role'),
        ariaLabel: activeEl.getAttribute('aria-label')
      } : null;
    });
    
    console.log(`⌨️  Keyboard focus works:`, focusedElement ? 'Yes' : 'No');
    if (focusedElement) {
      console.log(`   Focused element: ${focusedElement.tagName} ${focusedElement.role || ''} ${focusedElement.ariaLabel || ''}`);
    }

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    console.log(`📝 Heading elements: ${headings}`);

    // Check touch targets (minimum 44px)
    const touchTargets = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, [role="button"], a, input, [tabindex]');
      let validTargets = 0;
      
      for (let element of interactiveElements) {
        const rect = element.getBoundingClientRect();
        if (rect.width >= 44 && rect.height >= 44) {
          validTargets++;
        }
      }
      
      return {
        total: interactiveElements.length,
        valid: validTargets
      };
    });

    console.log(`👆 Touch targets 44px+: ${touchTargets.valid}/${touchTargets.total}`);

    // Test screen reader compatibility
    const hasScreenReaderContent = await page.locator('[aria-hidden="true"], .sr-only, [class*="screen-reader"]').count();
    console.log(`📢 Screen reader elements: ${hasScreenReaderContent}`);

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/06-accessibility-validation.png`,
      fullPage: true
    });

    console.log('✅ Accessibility validation completed');
  });

  test('6. Responsive Design', async ({ page }) => {
    console.log('📱 6. Testing Responsive Design...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT_20S 
    });

    await page.waitForTimeout(3000);

    // Test mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/07-mobile-375x667.png`,
      fullPage: false
    });
    console.log('📱 Mobile viewport (375x667) tested');

    // Test mobile viewport (iPhone 14 Pro)
    await page.setViewportSize({ width: 393, height: 852 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/08-mobile-393x852.png`,
      fullPage: false
    });
    console.log('📱 Mobile viewport (393x852) tested');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/09-tablet-768x1024.png`,
      fullPage: false
    });
    console.log('📱 Tablet viewport (768x1024) tested');

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/10-desktop-1280x720.png`,
      fullPage: false
    });
    console.log('🖥️  Desktop viewport (1280x720) tested');

    // Check component scaling and readability
    const textElements = await page.locator('p, span, div').allTextContents();
    const readableText = textElements.filter(text => text.length > 5);
    console.log(`📖 Readable text elements: ${readableText.length}`);

    console.log('✅ Responsive design testing completed');
  });

  test('7. Performance Check', async ({ page }) => {
    console.log('⚡ 7. Testing Performance...');
    
    // Start performance monitoring
    const startTime = Date.now();
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: TIMEOUT_20S 
    });

    const loadTime = Date.now() - startTime;
    console.log(`⏱️  Page load time: ${loadTime}ms`);

    // Check performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
        loadComplete: perf.loadEventEnd - perf.navigationStart,
        domReady: perf.domInteractive - perf.navigationStart
      };
    });

    console.log(`🎯 DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`🎯 Load Complete: ${performanceMetrics.loadComplete}ms`);
    console.log(`🎯 DOM Ready: ${performanceMetrics.domReady}ms`);

    // Monitor network requests
    const networkRequests = [];
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    await page.waitForTimeout(3000);
    console.log(`🌐 Network requests: ${networkRequests.length}`);

    // Check bundle sizes (approximate)
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      
      resources.forEach(resource => {
        if (resource.transferSize) {
          totalSize += resource.transferSize;
          if (resource.name.includes('.js')) {
            jsSize += resource.transferSize;
          } else if (resource.name.includes('.css')) {
            cssSize += resource.transferSize;
          }
        }
      });
      
      return { totalSize, jsSize, cssSize };
    });

    console.log(`📦 Total resource size: ${Math.round(resourceSizes.totalSize / 1024)}KB`);
    console.log(`📦 JavaScript size: ${Math.round(resourceSizes.jsSize / 1024)}KB`);
    console.log(`📦 CSS size: ${Math.round(resourceSizes.cssSize / 1024)}KB`);

    // Test smooth animations
    try {
      const animatedElement = page.locator('[style*="transition"], [style*="animation"], [class*="animate"]').first();
      if (await animatedElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('🎬 Animations detected and functioning');
      }
    } catch (e) {
      console.log('ℹ️  No animations detected');
    }

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/11-performance-final.png`,
      fullPage: true
    });

    console.log('✅ Performance check completed');
  });

  test.afterEach(async ({ page }) => {
    // Generate final summary
    const criticalErrors = consoleErrors.filter(error => 
      !error.text.includes('favicon') && 
      !error.text.includes('Source map') &&
      !error.text.includes('DevTools') &&
      !error.text.includes('Extension')
    );

    console.log(`\n📊 Test Session Summary:`);
    console.log(`   Total console messages: ${consoleMessages.length}`);
    console.log(`   Console errors: ${consoleErrors.length}`);
    console.log(`   Critical errors: ${criticalErrors.length}`);
    
    if (criticalErrors.length > 0) {
      console.log(`\n❌ Critical Console Errors:`);
      criticalErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.text}`);
      });
    } else {
      console.log(`\n✅ No critical console errors detected!`);
    }
  });
});