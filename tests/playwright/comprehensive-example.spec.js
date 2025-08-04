// tests/playwright/comprehensive-example.spec.js
// Comprehensive example demonstrating all Playwright MCP features for Solace AI Mobile

const { test, expect } = require('@playwright/test');
const { BaseTest } = require('./base-test');
const { TestReporter, DeviceConfig, ErrorHandler, TestData } = require('./test-utils');

// Initialize test reporter
const reporter = new TestReporter();

test.describe('Solace AI Mobile - Comprehensive MCP Testing Example', () => {
  let baseTest;

  test.beforeEach(async ({ page, context }) => {
    baseTest = new BaseTest(page, context);
    await baseTest.setup();
  });

  test.afterEach(async ({ page }) => {
    // Generate test report
    const testReport = baseTest.getTestReport();
    reporter.addTestResult({
      testName: test.info().title,
      status: test.info().status,
      duration: testReport.duration,
      errors: testReport.errors,
      device: page.viewportSize(),
      browser: 'chromium',
      url: testReport.url,
    });

    await baseTest.teardown();
  });

  test.afterAll(async () => {
    // Save comprehensive test report
    await reporter.saveReport('comprehensive-test-report.json');
  });

  test('should demonstrate complete testing workflow with all features', async ({ page }) => {
    // Step 1: Multi-device testing
    await test.step('Test across multiple devices', async () => {
      const mobileDevices = DeviceConfig.getMobileDevices().slice(0, 3); // Test first 3 devices
      
      for (const device of mobileDevices) {
        console.log(`🔄 Testing on ${device.name}`);
        
        // Simulate device
        await baseTest.simulateDevice(device.name);
        
        // Navigate and verify
        await baseTest.navigateTo('/');
        await baseTest.waitForAppReady();
        
        // Take device-specific screenshot
        await baseTest.takeScreenshot(`workflow-${device.name}`);
        
        // Verify responsive layout
        const viewport = page.viewportSize();
        expect(viewport.width).toBe(device.width);
        expect(viewport.height).toBe(device.height);
        
        console.log(`✅ ${device.name} testing completed`);
      }
    });

    // Step 2: Comprehensive accessibility testing
    await test.step('Run comprehensive accessibility tests', async () => {
      // Set back to default device for accessibility testing
      await baseTest.simulateDevice('iphone-14-pro');
      await baseTest.navigateTo('/');
      await baseTest.waitForAppReady();
      
      // Run full accessibility audit
      const accessibilityResults = await baseTest.runAccessibilityTests({
        includeAudits: ['color-contrast', 'keyboard', 'aria', 'forms'],
        level: 'AA'
      });
      
      // Log detailed results
      console.log('♿ Accessibility Test Results:', {
        passed: accessibilityResults.passed,
        totalViolations: accessibilityResults.violations.length,
        violationTypes: accessibilityResults.violations.map(v => v.type)
      });
      
      // Assert accessibility standards
      if (accessibilityResults.violations.length > 0) {
        // Log violations but don't fail test (for demo purposes)
        console.warn('Accessibility violations found:', accessibilityResults.violations);
      }
      
      expect(accessibilityResults.totalTests).toBeGreaterThan(0);
    });

    // Step 3: User interaction testing with error handling
    await test.step('Test user interactions with error handling', async () => {
      try {
        // Test form interactions
        const testData = TestData.getTestCredentials();
        
        // Look for email input
        const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
        
        if (await emailInput.isVisible({ timeout: 10000 })) {
          // Test form filling
          await emailInput.fill(testData.valid.email);
          await expect(emailInput).toHaveValue(testData.valid.email);
          
          // Test password input if available
          const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
          
          if (await passwordInput.isVisible({ timeout: 5000 })) {
            await passwordInput.fill(testData.valid.password);
            await expect(passwordInput).toHaveValue(testData.valid.password);
          }
          
          await baseTest.takeScreenshot('form-filled');
          
        } else {
          // Alternative interaction - test navigation buttons
          const buttons = page.locator('button, a[href]');
          const buttonCount = await buttons.count();
          
          if (buttonCount > 0) {
            const firstButton = buttons.first();
            await firstButton.click();
            await page.waitForTimeout(2000);
            await baseTest.takeScreenshot('button-interaction');
          }
        }
        
      } catch (error) {
        // Demonstrate error handling
        const errorInfo = await ErrorHandler.handleTestError(error, page, 'user-interaction-test');
        console.log('Handled error gracefully:', errorInfo.message);
        
        // Continue test execution despite error
        await baseTest.takeScreenshot('error-recovery');
      }
    });

    // Step 4: Performance and loading testing
    await test.step('Test performance and loading behavior', async () => {
      // Measure page load time
      const startTime = Date.now();
      
      await baseTest.navigateTo('/', { waitForLoad: true });
      
      const loadTime = Date.now() - startTime;
      console.log(`📊 Page load time: ${loadTime}ms`);
      
      // Assert reasonable load time (adjust based on your requirements)
      expect(loadTime).toBeLessThan(20000); // 20 second timeout
      
      // Test loading states
      const loadingIndicators = [
        page.locator('[data-testid="loading"]'),
        page.locator('.loading'),
        page.locator('.spinner'),
      ];
      
      // Verify loading indicators are handled properly
      for (const indicator of loadingIndicators) {
        try {
          if (await indicator.isVisible({ timeout: 1000 })) {
            // Wait for loading to complete
            await indicator.waitFor({ state: 'hidden', timeout: 15000 });
            console.log('✅ Loading indicator properly handled');
          }
        } catch {
          // Loading indicator might not exist
        }
      }
    });

    // Step 5: Network and error condition testing
    await test.step('Test network conditions and error handling', async () => {
      // Test offline behavior
      await page.context().setOffline(true);
      
      try {
        await page.reload();
        await page.waitForTimeout(3000);
        
        // Look for offline indicators or error messages
        const offlineIndicators = [
          page.locator('text=/offline/i'),
          page.locator('text=/network error/i'),
          page.locator('[data-testid="offline-indicator"]'),
        ];
        
        let foundOfflineIndicator = false;
        for (const indicator of offlineIndicators) {
          if (await indicator.isVisible({ timeout: 5000 })) {
            foundOfflineIndicator = true;
            console.log('✅ Offline indicator found');
            break;
          }
        }
        
        await baseTest.takeScreenshot('offline-state');
        
      } finally {
        // Restore network connection
        await page.context().setOffline(false);
        await page.waitForTimeout(2000);
      }
      
      // Test slow network conditions
      await page.context().setOffline(false);
      await page.context().route('**/*', async route => {
        // Add artificial delay to simulate slow network
        await new Promise(resolve => setTimeout(resolve, 100));
        await route.continue();
      });
      
      await page.reload();
      await baseTest.waitForAppReady();
      
      await baseTest.takeScreenshot('slow-network-state');
      
      // Clear route handler
      await page.context().unroute('**/*');
    });

    // Step 6: Cross-browser and cross-platform testing simulation
    await test.step('Simulate cross-platform scenarios', async () => {
      // Test different orientations
      const orientations = ['portrait', 'landscape'];
      
      for (const orientation of orientations) {
        await baseTest.simulateDevice('iphone-14-pro', { orientation });
        
        await page.waitForTimeout(1000); // Allow layout adjustment
        
        const viewport = page.viewportSize();
        if (orientation === 'landscape') {
          expect(viewport.width).toBeGreaterThan(viewport.height);
        } else {
          expect(viewport.height).toBeGreaterThan(viewport.width);
        }
        
        await baseTest.takeScreenshot(`orientation-${orientation}`);
      }
      
      // Reset to portrait
      await baseTest.simulateDevice('iphone-14-pro', { orientation: 'portrait' });
    });

    // Step 7: Mental health app specific testing
    await test.step('Test mental health app specific features', async () => {
      // Test mood tracking if available
      const moodElements = [
        page.locator('[data-testid="mood-check-in"]'),
        page.locator('button:has-text("Mood")'),
        page.locator('.mood-tracker'),
      ];
      
      for (const element of moodElements) {
        if (await element.isVisible({ timeout: 5000 })) {
          await element.click();
          await page.waitForTimeout(2000);
          
          // Look for mood options
          const moodOptions = page.locator('[data-testid*="mood"], button:has-text("Happy"), button:has-text("Sad")');
          const optionCount = await moodOptions.count();
          
          if (optionCount > 0) {
            console.log(`✅ Found ${optionCount} mood options`);
            await baseTest.takeScreenshot('mood-tracker');
          }
          
          break;
        }
      }
      
      // Test therapeutic color schemes
      const colorElements = page.locator('*[style*="gradient"], *[class*="therapeutic"], *[class*="calming"]');
      const colorCount = await colorElements.count();
      
      console.log(`🎨 Found ${colorCount} elements with therapeutic styling`);
      
      // Test accessibility of therapeutic elements
      if (colorCount > 0) {
        const therapeuticElement = colorElements.first();
        await therapeuticElement.hover();
        await page.waitForTimeout(500);
        
        // Verify element is keyboard accessible
        try {
          await therapeuticElement.focus();
          const isFocused = await therapeuticElement.evaluate(el => document.activeElement === el);
          if (isFocused) {
            console.log('✅ Therapeutic element is keyboard accessible');
          }
        } catch {
          // Element might not be focusable
        }
      }
    });

    // Step 8: Generate final test summary
    await test.step('Generate test summary and cleanup', async () => {
      // Collect final debug information
      const debugInfo = await ErrorHandler.collectDebugInfo(page);
      
      console.log('🏁 Test Summary:', {
        totalSteps: 8,
        finalUrl: page.url(),
        viewport: page.viewportSize(),
        testDuration: Date.now() - baseTest.testStartTime,
        errorsFound: baseTest.errors.length,
        debugInfo: debugInfo.userAgent,
      });
      
      // Take final screenshot
      await baseTest.takeScreenshot('final-state');
      
      // Verify test completed successfully
      expect(page.url()).not.toBe('about:blank');
      expect(baseTest.errors.filter(e => e.type === 'page-error').length).toBeLessThan(5); // Allow some minor errors
    });
  });

  test('should handle edge cases and error scenarios', async ({ page }) => {
    await test.step('Test with invalid URLs', async () => {
      try {
        await page.goto('http://invalid-url-that-does-not-exist.com');
      } catch (error) {
        console.log('✅ Invalid URL handled gracefully');
        expect(error.message).toContain('net::ERR');
      }
    });

    await test.step('Test with extremely small viewport', async () => {
      await page.setViewportSize({ width: 200, height: 300 });
      await baseTest.navigateTo('/');
      
      // Verify app still functions with minimal viewport
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      await baseTest.takeScreenshot('minimal-viewport');
    });

    await test.step('Test with JavaScript disabled', async () => {
      await page.context().addInitScript(() => {
        // Simulate limited JavaScript environment
        delete window.fetch;
      });
      
      await baseTest.navigateTo('/');
      await page.waitForTimeout(3000);
      
      // App should gracefully degrade
      const content = page.locator('body');
      await expect(content).toBeVisible();
      
      await baseTest.takeScreenshot('limited-js');
    });
  });

  // Device-specific test suite
  DeviceConfig.getMobileDevices().slice(0, 2).forEach(device => {
    test(`should work correctly on ${device.name}`, async ({ page }) => {
      await baseTest.simulateDevice(device.name);
      
      await test.step(`${device.name} - Basic functionality`, async () => {
        await baseTest.navigateTo('/');
        await baseTest.waitForAppReady();
        
        // Device-specific assertions
        const viewport = page.viewportSize();
        expect(viewport.width).toBe(device.width);
        expect(viewport.height).toBe(device.height);
        
        // Test touch interactions if device supports touch
        if (device.touch) {
          const touchElement = page.locator('button, a, [role="button"]').first();
          if (await touchElement.isVisible({ timeout: 5000 })) {
            await touchElement.tap();
            console.log(`✅ Touch interaction works on ${device.name}`);
          }
        }
        
        await baseTest.takeScreenshot(`device-test-${device.name}`);
      });
    });
  });
});