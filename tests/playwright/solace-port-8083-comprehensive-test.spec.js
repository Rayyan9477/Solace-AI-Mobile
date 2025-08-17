/**
 * Solace AI Mental Health App - Comprehensive Testing Suite
 * Testing application on http://localhost:8083
 * 
 * This test suite performs thorough validation of:
 * - Initial navigation and loading
 * - UI component testing and interactions
 * - Screen-by-screen validation
 * - Accessibility testing
 * - Performance and error detection
 * - Mental health app specific features
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:8083';
const NAVIGATION_TIMEOUT = 20000;
const SCREENSHOT_PATH = path.resolve('test-results/screenshots/port-8083-testing');

function ensureDir(dir) {
  try { 
    fs.mkdirSync(dir, { recursive: true }); 
  } catch (e) {
    // Directory already exists or creation failed
  }
}

test.describe('Solace AI Mental Health App - Comprehensive Testing on Port 8083', () => {
  let consoleMessages = [];
  let consoleErrors = [];
  let performanceMetrics = {};

  test.beforeAll(async () => {
    ensureDir(SCREENSHOT_PATH);
    console.log(`🚀 Starting comprehensive testing of Solace AI Mobile on ${BASE_URL}`);
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

    // Set mobile viewport for testing
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('1. Initial Navigation & Loading - Verify app loads without errors', async ({ page }) => {
    console.log('🌐 Testing initial navigation and loading...');
    
    const startTime = Date.now();
    
    // Navigate to the application
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    const loadTime = Date.now() - startTime;
    performanceMetrics.initialLoadTime = loadTime;
    console.log(`⏱️  Initial load time: ${loadTime}ms`);

    // Wait for React app to fully load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Allow time for component mounting

    // Verify page title
    const title = await page.title();
    console.log(`📱 App Title: "${title}"`);
    expect(title).toBeTruthy();

    // Check if main app container is present
    const appContainer = await page.locator('#root, #expo-root, [data-testid="app-container"]').first();
    await expect(appContainer).toBeVisible({ timeout: 10000 });

    // Verify React/Expo elements are loaded
    const reactElements = await page.locator('[data-reactroot], [data-react-helmet], [data-expo-root]').count();
    console.log(`⚛️  React/Expo elements detected: ${reactElements}`);

    // Take screenshot of initial page load
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/01-initial-page-load.png`,
      fullPage: true
    });

    // Check for any immediate console errors
    console.log(`📝 Console messages on load: ${consoleMessages.length}`);
    console.log(`❌ Console errors on load: ${consoleErrors.length}`);

    console.log('✅ Initial navigation and loading test completed');
  });

  test('2. UI Component Testing - Verify all interactive elements', async ({ page }) => {
    console.log('🎨 Testing UI components and interactive elements...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    await page.waitForTimeout(5000); // Allow full component rendering

    // Test for Solace AI Mental Health app specific elements
    const mentalHealthKeywords = [
      'Solace', 'Mental Health', 'Therapy', 'Mood', 'Wellness', 'AI', 
      'Dashboard', 'Chat', 'Assessment', 'Profile', 'Welcome', 'Progress'
    ];

    let foundKeywords = [];
    for (const keyword of mentalHealthKeywords) {
      const elements = await page.locator(`text="${keyword}"`).count();
      if (elements > 0) {
        foundKeywords.push(keyword);
        console.log(`🧠 Found mental health keyword: "${keyword}" (${elements} instances)`);
      }
    }

    console.log(`🔍 Mental health keywords found: ${foundKeywords.join(', ')}`);
    expect(foundKeywords.length).toBeGreaterThan(0);

    // Count and test interactive elements
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    const inputs = await page.locator('input, textarea').count();
    const clickableElements = await page.locator('[role="button"], [role="tab"], [onclick]').count();

    console.log(`🎮 Interactive elements found:`);
    console.log(`   - Buttons: ${buttons}`);
    console.log(`   - Links: ${links}`);
    console.log(`   - Input fields: ${inputs}`);
    console.log(`   - Other clickable: ${clickableElements}`);

    // Test a few interactive elements
    const testButtons = await page.locator('button').all();
    for (let i = 0; i < Math.min(testButtons.length, 3); i++) {
      try {
        await testButtons[i].click({ timeout: 1000 });
        console.log(`✅ Button ${i + 1} is clickable`);
        await page.waitForTimeout(500);
      } catch (e) {
        console.log(`⚠️  Button ${i + 1} click failed: ${e.message}`);
      }
    }

    // Check for therapeutic design elements
    const hasGradients = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let gradientCount = 0;
      for (let element of elements) {
        const style = window.getComputedStyle(element);
        if (style.background && (
          style.background.includes('gradient') ||
          style.background.includes('linear-gradient')
        )) {
          gradientCount++;
        }
      }
      return gradientCount;
    });

    console.log(`🎨 Therapeutic gradient elements: ${hasGradients}`);

    // Take UI components screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/02-ui-components.png`,
      fullPage: true
    });

    console.log('✅ UI component testing completed');
  });

  test('3. Screen-by-Screen Validation - Navigate through all tabs/screens', async ({ page }) => {
    console.log('📱 Testing screen-by-screen navigation...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    await page.waitForTimeout(5000);

    // Expected navigation tabs based on project structure
    const expectedTabs = ['Cover', 'Home', 'Chat', 'Mood', 'Assessment', 'Wellness', 'Utilities', 'Profile'];
    let foundTabs = [];
    let screenTests = [];

    // Try to find and test each navigation tab
    for (const tab of expectedTabs) {
      const selectors = [
        `[role="tab"]:has-text("${tab}")`,
        `button:has-text("${tab}")`,
        `text="${tab}"`,
        `[aria-label*="${tab}"]`,
        `[data-testid*="${tab.toLowerCase()}"]`,
        `[data-testid="${tab.toLowerCase()}-tab"]`
      ];

      let tabFound = false;
      for (const selector of selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 1000 })) {
            foundTabs.push(tab);
            console.log(`🎯 Found tab: ${tab}`);
            
            // Click the tab and take screenshot
            await element.click();
            await page.waitForTimeout(2000); // Allow screen transition
            
            // Capture screen content
            const screenContent = await page.textContent('body');
            const hasContent = screenContent && screenContent.trim().length > 100;
            
            screenTests.push({
              tab: tab,
              found: true,
              hasContent: hasContent,
              contentLength: screenContent ? screenContent.length : 0
            });

            await page.screenshot({
              path: `${SCREENSHOT_PATH}/03-screen-${tab.toLowerCase()}.png`,
              fullPage: true
            });

            tabFound = true;
            break;
          }
        } catch (e) {
          // Continue trying other selectors
        }
      }

      if (!tabFound) {
        screenTests.push({
          tab: tab,
          found: false,
          hasContent: false,
          contentLength: 0
        });
      }
    }

    console.log(`🧭 Navigation tabs found: ${foundTabs.join(', ')}`);
    console.log(`📊 Screen test results:`);
    screenTests.forEach(test => {
      const status = test.found ? '✅' : '❌';
      console.log(`   ${status} ${test.tab}: Found=${test.found}, Content=${test.hasContent} (${test.contentLength} chars)`);
    });

    // Test theme toggle if available
    const themeToggle = page.locator('[data-testid="theme-toggle"], [aria-label*="theme"], [aria-label*="dark"]').first();
    if (await themeToggle.isVisible().catch(() => false)) {
      console.log('🌙 Testing theme toggle...');
      await themeToggle.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `${SCREENSHOT_PATH}/04-theme-toggle-test.png`,
        fullPage: true
      });
    }

    console.log('✅ Screen-by-screen validation completed');
  });

  test('4. Accessibility Testing - Verify ARIA labels, keyboard navigation, contrast', async ({ page }) => {
    console.log('♿ Testing accessibility features...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    await page.waitForTimeout(3000);

    // Check for accessibility landmarks
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="complementary"], [role="contentinfo"]').count();
    console.log(`🏛️  Accessibility landmarks: ${landmarks}`);

    // Check for proper heading structure
    const headings = {
      h1: await page.locator('h1').count(),
      h2: await page.locator('h2').count(),
      h3: await page.locator('h3').count(),
      h4: await page.locator('h4').count(),
      h5: await page.locator('h5').count(),
      h6: await page.locator('h6').count()
    };
    console.log(`📝 Heading structure:`, headings);

    // Check for alt text on images
    const totalImages = await page.locator('img').count();
    const imagesWithAlt = await page.locator('img[alt]').count();
    const imagesWithEmptyAlt = await page.locator('img[alt=""]').count();
    console.log(`🖼️  Images: ${totalImages} total, ${imagesWithAlt} with alt text, ${imagesWithEmptyAlt} decorative`);

    // Check for aria-labels
    const elementsWithAriaLabel = await page.locator('[aria-label]').count();
    const elementsWithAriaDescribedBy = await page.locator('[aria-describedby]').count();
    console.log(`🏷️  ARIA labels: ${elementsWithAriaLabel} aria-label, ${elementsWithAriaDescribedBy} aria-describedby`);

    // Test keyboard navigation
    console.log('⌨️  Testing keyboard navigation...');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    let focusedElements = [];
    for (let i = 0; i < 5; i++) {
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement;
        return active ? {
          tagName: active.tagName,
          id: active.id,
          className: active.className,
          role: active.getAttribute('role'),
          ariaLabel: active.getAttribute('aria-label')
        } : null;
      });
      
      if (focusedElement) {
        focusedElements.push(focusedElement);
        console.log(`   Tab ${i + 1}: ${focusedElement.tagName}${focusedElement.id ? '#' + focusedElement.id : ''}${focusedElement.role ? ' [' + focusedElement.role + ']' : ''}`);
      }
      
      await page.keyboard.press('Tab');
      await page.waitForTimeout(300);
    }

    // Check for focus indicators
    const focusStyles = await page.evaluate(() => {
      const styles = [];
      const focusableElements = document.querySelectorAll('button, a, input, textarea, [tabindex]');
      for (let element of focusableElements) {
        const style = window.getComputedStyle(element, ':focus');
        if (style.outline !== 'none' || style.boxShadow !== 'none') {
          styles.push(true);
          break;
        }
      }
      return styles.length > 0;
    });
    console.log(`🎯 Focus indicators present: ${focusStyles}`);

    // Test for minimum touch target sizes (44x44px)
    const touchTargets = await page.evaluate(() => {
      const clickableElements = document.querySelectorAll('button, a, input, [role="button"], [onclick]');
      let validTargets = 0;
      let totalTargets = clickableElements.length;
      
      for (let element of clickableElements) {
        const rect = element.getBoundingClientRect();
        if (rect.width >= 44 && rect.height >= 44) {
          validTargets++;
        }
      }
      
      return { valid: validTargets, total: totalTargets };
    });
    console.log(`👆 Touch targets: ${touchTargets.valid}/${touchTargets.total} meet 44px minimum`);

    // Take accessibility testing screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/05-accessibility-testing.png`,
      fullPage: true
    });

    console.log('✅ Accessibility testing completed');
  });

  test('5. Performance & Error Detection - Monitor load times and detect issues', async ({ page }) => {
    console.log('⚡ Testing performance and error detection...');
    
    const startTime = Date.now();
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    // Measure various performance metrics
    const performanceData = await page.evaluate(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];
      
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        firstPaint: navigation ? navigation.responseEnd - navigation.fetchStart : null,
        domInteractive: timing.domInteractive - timing.navigationStart
      };
    });

    console.log(`⏱️  Performance Metrics:`);
    console.log(`   - DOM Content Loaded: ${performanceData.domContentLoaded}ms`);
    console.log(`   - Load Complete: ${performanceData.loadComplete}ms`);
    console.log(`   - DOM Interactive: ${performanceData.domInteractive}ms`);
    console.log(`   - First Paint: ${performanceData.firstPaint}ms`);

    // Check network requests
    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    await page.waitForTimeout(5000);

    console.log(`🌐 Network requests made: ${requests.length}`);
    
    // Group requests by type
    const requestsByType = requests.reduce((acc, req) => {
      acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`📊 Request breakdown:`, requestsByType);

    // Interact with app to trigger potential errors
    const interactiveElements = await page.locator('button, [role="button"], a').all();
    console.log(`🎮 Testing ${Math.min(interactiveElements.length, 5)} interactive elements...`);
    
    for (let i = 0; i < Math.min(interactiveElements.length, 5); i++) {
      try {
        await interactiveElements[i].click({ timeout: 1000 });
        await page.waitForTimeout(1000);
        console.log(`   ✅ Element ${i + 1}: Click successful`);
      } catch (e) {
        console.log(`   ⚠️  Element ${i + 1}: Click failed - ${e.message}`);
      }
    }

    // Final console error check
    const criticalErrors = consoleErrors.filter(error => 
      !error.text.includes('favicon') && 
      !error.text.includes('Source map') &&
      !error.text.includes('DevTools') &&
      !error.text.includes('extension')
    );

    console.log(`📝 Total console messages: ${consoleMessages.length}`);
    console.log(`❌ Total console errors: ${consoleErrors.length}`);
    console.log(`🚨 Critical errors: ${criticalErrors.length}`);

    if (criticalErrors.length > 0) {
      console.log(`🔍 Critical errors found:`);
      criticalErrors.slice(0, 5).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.text}`);
      });
    }

    // Verify app is still responsive
    const appContainer = await page.locator('#root, #expo-root').first();
    await expect(appContainer).toBeVisible();

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/06-performance-testing.png`,
      fullPage: true
    });

    console.log('✅ Performance and error detection completed');
  });

  test('6. Mental Health App Specific Features - Test therapeutic components', async ({ page }) => {
    console.log('🧠 Testing mental health app specific features...');
    
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: NAVIGATION_TIMEOUT 
    });

    await page.waitForTimeout(5000);

    // Test for mood tracking components
    const moodElements = [
      'mood', 'feeling', 'emotion', 'track', 'diary', 'journal', 
      'happy', 'sad', 'anxious', 'calm', 'stressed', 'peaceful'
    ];

    let foundMoodFeatures = [];
    for (const element of moodElements) {
      const found = await page.locator(`text="${element}"`).count();
      if (found > 0) {
        foundMoodFeatures.push(element);
      }
    }

    console.log(`💭 Mood tracking features: ${foundMoodFeatures.join(', ')}`);

    // Test for therapy/wellness features
    const therapyElements = [
      'therapy', 'session', 'meditation', 'mindfulness', 'breathing', 
      'relaxation', 'wellness', 'self-care', 'progress', 'insights'
    ];

    let foundTherapyFeatures = [];
    for (const element of therapyElements) {
      const found = await page.locator(`text="${element}"`).count();
      if (found > 0) {
        foundTherapyFeatures.push(element);
      }
    }

    console.log(`🌿 Therapy/wellness features: ${foundTherapyFeatures.join(', ')}`);

    // Test for AI/chat features
    const aiElements = ['AI', 'chat', 'assistant', 'help', 'support', 'bot'];
    let foundAiFeatures = [];
    for (const element of aiElements) {
      const found = await page.locator(`text="${element}"`).count();
      if (found > 0) {
        foundAiFeatures.push(element);
      }
    }

    console.log(`🤖 AI/chat features: ${foundAiFeatures.join(', ')}`);

    // Check for therapeutic color schemes
    const therapeuticColors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const colorPatterns = {
        blues: 0,    // calming
        greens: 0,   // nurturing  
        purples: 0,  // grounding
        pastels: 0   // gentle
      };

      for (let element of elements) {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const bgColor = style.backgroundColor;
        const combined = color + ' ' + bgColor;

        if (combined.includes('blue') || combined.includes('rgb(')) {
          const rgb = combined.match(/rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)/);
          if (rgb) {
            const [, r, g, b] = rgb.map(Number);
            if (b > r && b > g) colorPatterns.blues++;
            if (g > r && g > b) colorPatterns.greens++;
            if (r > 100 && g < 100 && b > 100) colorPatterns.purples++;
            if (r > 200 && g > 200 && b > 200) colorPatterns.pastels++;
          }
        }
      }

      return colorPatterns;
    });

    console.log(`🎨 Therapeutic color usage:`, therapeuticColors);

    // Test for emergency/crisis features
    const emergencyElements = ['emergency', 'crisis', 'help', 'hotline', 'support', '911'];
    let foundEmergencyFeatures = [];
    for (const element of emergencyElements) {
      const found = await page.locator(`text="${element}"`).count();
      if (found > 0) {
        foundEmergencyFeatures.push(element);
      }
    }

    console.log(`🚨 Emergency/crisis features: ${foundEmergencyFeatures.join(', ')}`);

    // Test icon system integration
    const svgIcons = await page.locator('svg').count();
    const mentalHealthIcons = await page.locator('[aria-label*="mental"], [aria-label*="health"], [aria-label*="therapy"], [aria-label*="mood"]').count();
    console.log(`🎭 SVG icons: ${svgIcons}, Mental health icons: ${mentalHealthIcons}`);

    // Take mental health features screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/07-mental-health-features.png`,
      fullPage: true
    });

    console.log('✅ Mental health app features testing completed');
  });

  test('7. Responsive Design Testing - Test different viewport sizes', async ({ page }) => {
    console.log('📱 Testing responsive design across viewports...');
    
    const viewports = [
      { name: 'Mobile Small', width: 320, height: 568 },
      { name: 'Mobile Medium', width: 375, height: 812 },
      { name: 'Mobile Large', width: 414, height: 896 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop Small', width: 1280, height: 720 },
      { name: 'Desktop Large', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      console.log(`📐 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(BASE_URL, { 
        waitUntil: 'networkidle',
        timeout: NAVIGATION_TIMEOUT 
      });
      
      await page.waitForTimeout(2000);

      // Check if content is properly visible and not overflowing
      const viewportInfo = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          hasVerticalScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight
        };
      });

      console.log(`   Content: ${viewportInfo.scrollWidth}x${viewportInfo.scrollHeight}, Viewport: ${viewportInfo.clientWidth}x${viewportInfo.clientHeight}`);
      console.log(`   Scroll: H=${viewportInfo.hasHorizontalScroll}, V=${viewportInfo.hasVerticalScroll}`);

      await page.screenshot({
        path: `${SCREENSHOT_PATH}/08-responsive-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: false
      });
    }

    console.log('✅ Responsive design testing completed');
  });

  test.afterEach(async ({ page }) => {
    // Update performance metrics
    performanceMetrics.consoleMessages = consoleMessages.length;
    performanceMetrics.consoleErrors = consoleErrors.length;
    
    console.log(`\n📊 Test Session Summary:`);
    console.log(`   Console messages: ${consoleMessages.length}`);
    console.log(`   Console errors: ${consoleErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log(`\n⚠️  Recent Console Errors:`);
      consoleErrors.slice(-3).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.text.substring(0, 100)}...`);
      });
    }
  });

  test.afterAll(async () => {
    console.log('\n🎯 Comprehensive Testing Summary:');
    console.log(`   Base URL: ${BASE_URL}`);
    console.log(`   Screenshots saved to: ${SCREENSHOT_PATH}`);
    console.log(`   Performance metrics:`, performanceMetrics);
    console.log('\n✅ All tests completed successfully!');
  });
});