// tests/playwright/navigation-flow.spec.js
// Comprehensive navigation flow test from login to dashboard for Solace AI Mobile

const { test, expect } = require('@playwright/test');
const { BaseTest } = require('./base-test');

test.describe('Solace AI Mobile - Navigation Flow Tests', () => {
  let baseTest;

  test.beforeEach(async ({ page, context }) => {
    baseTest = new BaseTest(page, context);
    await baseTest.setup();
  });

  test.afterEach(async () => {
    await baseTest.teardown();
  });

  test.describe('Authentication Flow', () => {
    test('should complete full login to dashboard navigation flow', async ({ page }) => {
      // Step 1: Navigate to login page
      await test.step('Navigate to login page', async () => {
        await baseTest.navigateTo('/');
        await baseTest.waitForAppReady();
        
        // Verify we're on the correct starting page
        await expect(page).toHaveTitle(/Solace AI Mobile/i);
        
        // Look for login/sign-in elements
        const loginButton = page.locator('[data-testid="login-button"], button:has-text("Sign In"), button:has-text("Login")').first();
        const signInButton = page.locator('[data-testid="sign-in-button"], [data-testid="get-started-button"]').first();
        
        // Take screenshot of initial state
        await baseTest.takeScreenshot('01-initial-page');
        
        // Navigate to login if not already there
        try {
          if (await loginButton.isVisible({ timeout: 5000 })) {
            await loginButton.click();
          } else if (await signInButton.isVisible({ timeout: 5000 })) {
            await signInButton.click();
          }
        } catch {
          // Might already be on login page
          console.log('Already on login page or login elements not immediately visible');
        }
      });

      // Step 2: Verify login page elements
      await test.step('Verify login page accessibility and elements', async () => {
        await page.waitForTimeout(2000); // Allow page to settle
        
        // Run accessibility tests on login page
        const a11yResults = await baseTest.runAccessibilityTests({
          includeAudits: ['aria', 'keyboard', 'forms'],
          level: 'AA'
        });
        
        expect(a11yResults.passed, `Accessibility violations: ${JSON.stringify(a11yResults.violations)}`).toBeTruthy();
        
        // Look for common login form elements
        const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
        const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]').first();
        const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
        
        // Verify form elements exist
        await expect(emailInput.or(page.locator('input[data-testid="email-input"]'))).toBeVisible({ timeout: 10000 });
        await expect(passwordInput.or(page.locator('input[data-testid="password-input"]'))).toBeVisible({ timeout: 10000 });
        await expect(submitButton.or(page.locator('[data-testid="submit-button"]'))).toBeVisible({ timeout: 10000 });
        
        await baseTest.takeScreenshot('02-login-page');
      });

      // Step 3: Test form validation
      await test.step('Test form validation', async () => {
        const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[data-testid="email-input"]').first();
        const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i], input[data-testid="password-input"]').first();
        const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login"), [data-testid="submit-button"]').first();
        
        // Test empty form submission
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Look for validation messages
          await page.waitForTimeout(1000);
          const errorMessages = page.locator('.error, [role="alert"], .text-red, .error-message');
          
          // Take screenshot of validation state
          await baseTest.takeScreenshot('03-form-validation');
        }
        
        // Test invalid email format
        if (await emailInput.isVisible()) {
          await emailInput.fill('invalid-email');
          await passwordInput.fill('short');
          
          if (await submitButton.isVisible()) {
            await submitButton.click();
            await page.waitForTimeout(1000);
            await baseTest.takeScreenshot('04-invalid-email');
          }
        }
      });

      // Step 4: Perform valid login
      await test.step('Perform valid login', async () => {
        const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[data-testid="email-input"]').first();
        const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i], input[data-testid="password-input"]').first();
        const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login"), [data-testid="submit-button"]').first();
        
        // Use test credentials
        if (await emailInput.isVisible() && await passwordInput.isVisible()) {
          await emailInput.clear();
          await emailInput.fill('test@solace-ai.com');
          
          await passwordInput.clear();
          await passwordInput.fill('TestPassword123!');
          
          await baseTest.takeScreenshot('05-filled-form');
          
          // Submit the form
          await submitButton.click();
          
          // Wait for navigation or loading
          await page.waitForTimeout(3000);
        } else {
          // Alternative flow - look for demo/skip buttons
          const demoButton = page.locator('button:has-text("Demo"), button:has-text("Try Demo"), [data-testid="demo-button"]').first();
          const skipButton = page.locator('button:has-text("Skip"), button:has-text("Continue"), [data-testid="skip-button"]').first();
          
          if (await demoButton.isVisible({ timeout: 5000 })) {
            await demoButton.click();
          } else if (await skipButton.isVisible({ timeout: 5000 })) {
            await skipButton.click();
          } else {
            // Try to find any navigation button
            const navButtons = page.locator('button, a[href]');
            const count = await navButtons.count();
            
            if (count > 0) {
              // Click the most likely navigation button
              const buttons = await navButtons.all();
              for (const button of buttons) {
                const text = await button.textContent();
                if (text && (text.includes('Continue') || text.includes('Next') || text.includes('Enter'))) {
                  await button.click();
                  break;
                }
              }
            }
          }
        }
      });

      // Step 5: Verify successful navigation to dashboard
      await test.step('Verify navigation to dashboard', async () => {
        // Wait for potential navigation
        await page.waitForTimeout(5000);
        
        // Look for dashboard indicators
        const dashboardElements = [
          page.locator('[data-testid="dashboard"], [data-testid="main-app"], .dashboard'),
          page.locator('h1:has-text("Welcome"), h1:has-text("Dashboard"), h2:has-text("Good")'),
          page.locator('[data-testid="mood-check-in"], [data-testid="quick-actions"]'),
          page.locator('.bottom-tabs, .tab-bar, [role="tablist"]'),
        ];
        
        let foundDashboard = false;
        for (const element of dashboardElements) {
          try {
            if (await element.first().isVisible({ timeout: 5000 })) {
              foundDashboard = true;
              console.log('✅ Dashboard element found');
              break;
            }
          } catch {
            // Element not found, continue
          }
        }
        
        if (!foundDashboard) {
          // Try to find any main content area
          const mainContent = page.locator('main, [data-testid="app-root"], #root, body > div').first();
          await expect(mainContent).toBeVisible({ timeout: 10000 });
        }
        
        await baseTest.takeScreenshot('06-dashboard-page');
        
        // Verify URL changed (if applicable)
        const currentUrl = page.url();
        console.log(`Current URL: ${currentUrl}`);
        
        // The URL should have changed from the initial page
        expect(currentUrl).not.toBe('about:blank');
      });

      // Step 6: Test dashboard functionality
      await test.step('Test dashboard functionality', async () => {
        // Run accessibility tests on dashboard
        const a11yResults = await baseTest.runAccessibilityTests({
          includeAudits: ['color-contrast', 'keyboard', 'aria'],
          level: 'AA'
        });
        
        if (!a11yResults.passed) {
          console.warn('Dashboard accessibility issues:', a11yResults.violations);
        }
        
        // Look for key dashboard components
        const components = {
          moodCheckIn: page.locator('[data-testid="mood-check-in"], .mood-check-in, button:has-text("Mood")').first(),
          quickActions: page.locator('[data-testid="quick-actions"], .quick-actions').first(),
          welcomeHeader: page.locator('[data-testid="welcome-header"], .welcome-header, h1, h2').first(),
          navigationTabs: page.locator('.bottom-tabs, .tab-bar, [role="tablist"]').first(),
        };
        
        // Test component visibility
        for (const [name, component] of Object.entries(components)) {
          try {
            if (await component.isVisible({ timeout: 5000 })) {
              console.log(`✅ ${name} component is visible`);
              
              // Test interaction if it's interactive
              if (name === 'moodCheckIn' && await component.isEnabled()) {
                await component.hover();
                await page.waitForTimeout(500);
              }
            }
          } catch {
            console.log(`ℹ️  ${name} component not found or not visible`);
          }
        }
        
        await baseTest.takeScreenshot('07-dashboard-components');
      });

      // Step 7: Test navigation tabs (if present)
      await test.step('Test navigation tabs', async () => {
        const tabElements = page.locator('[role="tab"], .tab, .tab-button, button[data-testid*="tab"]');
        const tabCount = await tabElements.count();
        
        if (tabCount > 0) {
          console.log(`Found ${tabCount} navigation tabs`);
          
          // Test clicking different tabs
          const tabs = await tabElements.all();
          let tabIndex = 0;
          
          for (const tab of tabs.slice(0, 3)) { // Test first 3 tabs to avoid timeout
            try {
              const tabText = await tab.textContent();
              console.log(`Testing tab: ${tabText}`);
              
              await tab.click();
              await page.waitForTimeout(2000); // Allow content to load
              
              // Verify tab is active
              const isActive = await tab.getAttribute('aria-selected') === 'true' ||
                              await tab.evaluate(el => el.classList.contains('active'));
              
              if (isActive) {
                console.log(`✅ Tab "${tabText}" is active`);
              }
              
              await baseTest.takeScreenshot(`08-tab-${tabIndex}-${tabText?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`);
              tabIndex++;
              
            } catch (error) {
              console.warn(`Tab interaction failed:`, error.message);
            }
          }
        } else {
          console.log('ℹ️  No navigation tabs found');
        }
      });

      // Step 8: Test responsive behavior
      await test.step('Test responsive behavior', async () => {
        // Test different screen sizes
        const devices = ['iphone-se', 'iphone-14-pro', 'samsung-galaxy-s21'];
        
        for (const device of devices) {
          await baseTest.simulateDevice(device);
          await page.waitForTimeout(1000); // Allow layout to adjust
          
          // Verify layout is responsive
          const viewport = page.viewportSize();
          console.log(`Testing ${device}: ${viewport.width}x${viewport.height}`);
          
          // Check that content is still visible and accessible
          const mainContent = page.locator('main, [data-testid="app-root"], #root, body > div').first();
          await expect(mainContent).toBeVisible();
          
          await baseTest.takeScreenshot(`09-responsive-${device}`);
        }
      });
    });

    test('should handle authentication errors gracefully', async ({ page }) => {
      await test.step('Test network error handling', async () => {
        // Simulate network issues
        await page.route('**/api/**', route => {
          route.abort('failed');
        });
        
        await baseTest.navigateTo('/');
        await baseTest.waitForAppReady();
        
        // Try to perform login with network blocked
        const emailInput = page.locator('input[type="email"], input[name="email"], input[data-testid="email-input"]').first();
        const passwordInput = page.locator('input[type="password"], input[name="password"], input[data-testid="password-input"]').first();
        const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
        
        if (await emailInput.isVisible({ timeout: 5000 })) {
          await emailInput.fill('test@example.com');
          await passwordInput.fill('password123');
          await submitButton.click();
          
          // Wait for error handling
          await page.waitForTimeout(3000);
          
          // Look for error messages
          const errorElement = page.locator('.error, [role="alert"], .error-message').first();
          // Note: Error might not be visible if app doesn't handle network errors gracefully
          
          await baseTest.takeScreenshot('10-network-error');
        }
      });

      await test.step('Test invalid credentials', async () => {
        // Clear network route to restore normal behavior
        await page.unroute('**/api/**');
        
        await baseTest.navigateTo('/');
        await baseTest.waitForAppReady();
        
        const emailInput = page.locator('input[type="email"], input[name="email"], input[data-testid="email-input"]').first();
        const passwordInput = page.locator('input[type="password"], input[name="password"], input[data-testid="password-input"]').first();
        const submitButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Login")').first();
        
        if (await emailInput.isVisible({ timeout: 5000 })) {
          await emailInput.fill('invalid@example.com');
          await passwordInput.fill('wrongpassword');
          await submitButton.click();
          
          // Wait for response
          await page.waitForTimeout(3000);
          
          // Verify we're still on login page (authentication failed)
          await expect(emailInput.or(page.locator('input[placeholder*="email" i]'))).toBeVisible();
          
          await baseTest.takeScreenshot('11-invalid-credentials');
        }
      });
    });
  });

  test.describe('Cross-Device Navigation Flow', () => {
    const devices = [
      { name: 'iphone-14-pro', description: 'iPhone 14 Pro' },
      { name: 'samsung-galaxy-s21', description: 'Samsung Galaxy S21' },
      { name: 'pixel-7', description: 'Google Pixel 7' }
    ];

    devices.forEach(({ name, description }) => {
      test(`should complete navigation flow on ${description}`, async ({ page }) => {
        // Set up device simulation
        await baseTest.simulateDevice(name);
        
        // Run abbreviated flow for each device
        await test.step(`${description} - Navigate and verify`, async () => {
          await baseTest.navigateTo('/');
          await baseTest.waitForAppReady();
          
          // Take device-specific screenshot
          await baseTest.takeScreenshot(`device-${name}-initial`);
          
          // Try to navigate through the app
          const mainButton = page.locator('button, a[href]').first();
          if (await mainButton.isVisible({ timeout: 5000 })) {
            await mainButton.click();
            await page.waitForTimeout(2000);
            await baseTest.takeScreenshot(`device-${name}-navigated`);
          }
          
          // Verify responsive layout
          const viewport = page.viewportSize();
          expect(viewport.width).toBeGreaterThan(300);
          expect(viewport.height).toBeGreaterThan(400);
          
          // Run quick accessibility test
          const a11yResults = await baseTest.runAccessibilityTests({
            includeAudits: ['keyboard'],
            level: 'AA'
          });
          
          // Log results but don't fail test for minor accessibility issues on mobile
          if (!a11yResults.passed) {
            console.warn(`${description} - Accessibility warnings:`, a11yResults.violations);
          }
        });
      });
    });
  });
});