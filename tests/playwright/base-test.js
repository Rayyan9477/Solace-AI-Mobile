// tests/playwright/base-test.js
// Base test class for Solace AI Mobile with accessibility utilities and responsive testing

const { test, expect } = require('@playwright/test');

/**
 * Base Test Class for Solace AI Mobile MCP Testing
 * Provides common setup/teardown, accessibility testing, and screen size simulation
 */
class BaseTest {
  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.testStartTime = Date.now();
    this.errors = [];
  }

  /**
   * Common setup method for all tests
   */
  async setup() {
    console.log('🚀 Setting up test environment...');
    
    try {
      // Set up error handling
      this.page.on('console', msg => {
        if (msg.type() === 'error') {
          this.errors.push({
            type: 'console-error',
            message: msg.text(),
            timestamp: new Date().toISOString()
          });
        }
      });

      this.page.on('pageerror', error => {
        this.errors.push({
          type: 'page-error',
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      });

      // Set up request/response monitoring
      this.page.on('requestfailed', request => {
        this.errors.push({
          type: 'request-failed',
          url: request.url(),
          method: request.method(),
          failure: request.failure(),
          timestamp: new Date().toISOString()
        });
      });

      // Enable accessibility tree
      await this.page.addInitScript(() => {
        window.addEventListener('DOMContentLoaded', () => {
          // Enable accessibility features
          document.body.setAttribute('data-testid', 'app-root');
          
          // Add keyboard navigation support
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
              e.target.classList.add('keyboard-focused');
            }
          });
        });
      });

      // Set reasonable defaults
      await this.page.setDefaultTimeout(20000);
      await this.page.setDefaultNavigationTimeout(20000);

      console.log('✅ Test environment setup completed');
      
    } catch (error) {
      console.error('❌ Test setup failed:', error);
      throw error;
    }
  }

  /**
   * Common teardown method for all tests
   */
  async teardown() {
    console.log('🏁 Tearing down test environment...');
    
    try {
      // Report any errors that occurred during the test
      if (this.errors.length > 0) {
        console.warn(`⚠️  ${this.errors.length} errors occurred during test:`, this.errors);
      }

      // Close any open dialogs or modals
      try {
        const dialogs = await this.page.locator('[role="dialog"]').count();
        if (dialogs > 0) {
          await this.page.keyboard.press('Escape');
          console.log('🚪 Closed open dialogs');
        }
      } catch {
        // Ignore errors if no dialogs present
      }

      // Clear local storage and session storage
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Calculate test duration
      const duration = Date.now() - this.testStartTime;
      console.log(`⏱️  Test completed in ${duration}ms`);

      console.log('✅ Test environment teardown completed');
      
    } catch (error) {
      console.error('❌ Test teardown failed:', error);
      // Don't throw here to avoid masking the actual test failure
    }
  }

  /**
   * Navigate to a page with error handling and loading verification
   */
  async navigateTo(url, options = {}) {
    const { waitForLoad = true, timeout = 20000 } = options;
    
    console.log(`🧭 Navigating to: ${url}`);
    
    try {
      await this.page.goto(url, { 
        waitUntil: 'networkidle',
        timeout 
      });

      if (waitForLoad) {
        // Wait for React/React Native app to load
        await this.page.waitForSelector('[data-testid="app-root"], body', { timeout });
        
        // Wait for loading indicators to disappear
        try {
          await this.page.waitForSelector('[data-testid="loading"], .loading', { 
            state: 'hidden', 
            timeout: 10000 
          });
        } catch {
          // Loading indicator might not exist
        }
      }

      console.log('✅ Navigation completed successfully');
      return true;
      
    } catch (error) {
      console.error(`❌ Navigation to ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Comprehensive accessibility testing utilities
   */
  async runAccessibilityTests(options = {}) {
    const { 
      includeAudits = ['color-contrast', 'keyboard', 'aria', 'forms'],
      level = 'AA',
      skipSelectors = []
    } = options;

    console.log('♿ Running accessibility tests...');

    const violations = [];

    try {
      // Test 1: Check for basic accessibility attributes
      await this.checkBasicAccessibility(violations, skipSelectors);

      // Test 2: Color contrast testing
      if (includeAudits.includes('color-contrast')) {
        await this.checkColorContrast(violations, level);
      }

      // Test 3: Keyboard navigation testing
      if (includeAudits.includes('keyboard')) {
        await this.checkKeyboardNavigation(violations);
      }

      // Test 4: ARIA attributes testing
      if (includeAudits.includes('aria')) {
        await this.checkAriaAttributes(violations);
      }

      // Test 5: Form accessibility testing
      if (includeAudits.includes('forms')) {
        await this.checkFormAccessibility(violations);
      }

      if (violations.length === 0) {
        console.log('✅ All accessibility tests passed');
      } else {
        console.warn(`⚠️  Found ${violations.length} accessibility violations:`, violations);
      }

      return {
        passed: violations.length === 0,
        violations,
        totalTests: includeAudits.length
      };

    } catch (error) {
      console.error('❌ Accessibility testing failed:', error);
      throw error;
    }
  }

  /**
   * Check basic accessibility requirements
   */
  async checkBasicAccessibility(violations, skipSelectors) {
    // Check for images without alt text
    const imagesWithoutAlt = await this.page.locator('img:not([alt])').count();
    if (imagesWithoutAlt > 0) {
      violations.push({
        type: 'missing-alt-text',
        count: imagesWithoutAlt,
        severity: 'warning',
        message: `${imagesWithoutAlt} images found without alt text`
      });
    }

    // Check for buttons without accessible names
    const buttonsWithoutNames = await this.page.locator('button:not([aria-label]):not([aria-labelledby])').filter({
      has: this.page.locator(':not(:has-text))')
    }).count();
    
    if (buttonsWithoutNames > 0) {
      violations.push({
        type: 'button-without-name',
        count: buttonsWithoutNames,
        severity: 'error',
        message: `${buttonsWithoutNames} buttons found without accessible names`
      });
    }

    // Check for proper heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const currentLevel = parseInt(tagName.replace('h', ''));
      
      if (currentLevel > previousLevel + 1) {
        violations.push({
          type: 'heading-skip',
          severity: 'warning',
          message: `Heading hierarchy skipped from h${previousLevel} to h${currentLevel}`
        });
      }
      
      previousLevel = currentLevel;
    }
  }

  /**
   * Check color contrast ratios
   */
  async checkColorContrast(violations, level) {
    const minimumRatio = level === 'AAA' ? 7 : 4.5;
    
    // Inject axe-core for color contrast testing
    await this.page.addScriptTag({
      url: 'https://unpkg.com/axe-core@4.8.2/axe.min.js'
    });

    const contrastResults = await this.page.evaluate((ratio) => {
      if (typeof axe !== 'undefined') {
        return axe.run({
          rules: {
            'color-contrast': { enabled: true }
          }
        }).then(results => {
          return results.violations.filter(v => v.id === 'color-contrast');
        });
      }
      return [];
    }, minimumRatio);

    if (contrastResults && contrastResults.length > 0) {
      violations.push({
        type: 'color-contrast',
        severity: 'error',
        violations: contrastResults,
        message: `Color contrast violations found (minimum ratio: ${minimumRatio}:1)`
      });
    }
  }

  /**
   * Test keyboard navigation
   */
  async checkKeyboardNavigation(violations) {
    const focusableElements = await this.page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])').all();
    
    let unreachableElements = 0;
    
    for (const element of focusableElements.slice(0, 10)) { // Test first 10 to avoid timeout
      try {
        await element.focus();
        const isFocused = await element.evaluate(el => document.activeElement === el);
        
        if (!isFocused) {
          unreachableElements++;
        }
      } catch {
        unreachableElements++;
      }
    }

    if (unreachableElements > 0) {
      violations.push({
        type: 'keyboard-navigation',
        count: unreachableElements,
        severity: 'error',
        message: `${unreachableElements} focusable elements cannot be reached via keyboard`
      });
    }
  }

  /**
   * Check ARIA attributes
   */
  async checkAriaAttributes(violations) {
    // Check for invalid ARIA attributes
    const invalidAria = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const invalid = [];
      
      const validAriaAttributes = [
        'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
        'aria-expanded', 'aria-checked', 'aria-selected', 'aria-disabled',
        'aria-required', 'aria-invalid', 'role'
      ];
      
      elements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('aria-') && !validAriaAttributes.includes(attr.name)) {
            invalid.push({
              element: el.tagName.toLowerCase(),
              attribute: attr.name,
              value: attr.value
            });
          }
        });
      });
      
      return invalid;
    });

    if (invalidAria.length > 0) {
      violations.push({
        type: 'invalid-aria',
        count: invalidAria.length,
        severity: 'warning',
        details: invalidAria,
        message: `${invalidAria.length} invalid ARIA attributes found`
      });
    }
  }

  /**
   * Check form accessibility
   */
  async checkFormAccessibility(violations) {
    // Check for inputs without labels
    const unlabeledInputs = await this.page.locator('input:not([aria-label]):not([aria-labelledby])').filter({
      hasNot: this.page.locator('label')
    }).count();

    if (unlabeledInputs > 0) {
      violations.push({
        type: 'unlabeled-inputs',
        count: unlabeledInputs,
        severity: 'error',
        message: `${unlabeledInputs} form inputs found without proper labels`
      });
    }

    // Check for required fields without indication
    const requiredWithoutIndication = await this.page.locator('input[required]:not([aria-required="true"])').count();
    
    if (requiredWithoutIndication > 0) {
      violations.push({
        type: 'required-without-indication',
        count: requiredWithoutIndication,
        severity: 'warning',
        message: `${requiredWithoutIndication} required fields without proper ARIA indication`
      });
    }
  }

  /**
   * Screen size simulation for responsive testing
   */
  async simulateDevice(deviceName, options = {}) {
    const { orientation = 'portrait' } = options;
    
    console.log(`📱 Simulating device: ${deviceName} (${orientation})`);

    const devices = {
      'iphone-se': { width: 375, height: 667, mobile: true, touch: true },
      'iphone-14-pro': { width: 393, height: 852, mobile: true, touch: true },
      'iphone-14-pro-max': { width: 430, height: 932, mobile: true, touch: true },
      'samsung-galaxy-s21': { width: 360, height: 800, mobile: true, touch: true },
      'pixel-7': { width: 412, height: 915, mobile: true, touch: true },
      'ipad': { width: 768, height: 1024, mobile: false, touch: true },
      'desktop': { width: 1280, height: 720, mobile: false, touch: false },
    };

    const device = devices[deviceName];
    if (!device) {
      throw new Error(`Unknown device: ${deviceName}. Available: ${Object.keys(devices).join(', ')}`);
    }

    const viewport = orientation === 'landscape' ? 
      { width: device.height, height: device.width } :
      { width: device.width, height: device.height };

    await this.page.setViewportSize(viewport);

    if (device.mobile) {
      await this.page.emulateMedia({ media: 'screen' });
      await this.page.addInitScript(() => {
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
        });
      });
    }

    console.log(`✅ Device simulation completed: ${viewport.width}x${viewport.height}`);
    
    return viewport;
  }

  /**
   * Wait for React/React Native app to be ready
   */
  async waitForAppReady(timeout = 20000) {
    console.log('⏳ Waiting for app to be ready...');
    
    try {
      // Wait for React to mount
      await this.page.waitForFunction(() => {
        return window.React || 
               document.querySelector('[data-reactroot]') ||
               document.querySelector('#root') ||
               document.querySelector('[data-testid="app-root"]');
      }, { timeout });

      // Wait for loading indicators to disappear
      const loadingSelectors = [
        '[data-testid="loading"]',
        '[data-testid="spinner"]',
        '.loading',
        '.spinner'
      ];

      for (const selector of loadingSelectors) {
        try {
          await this.page.waitForSelector(selector, { state: 'hidden', timeout: 5000 });
        } catch {
          // Loading indicator might not exist
        }
      }

      console.log('✅ App is ready');
      return true;
      
    } catch (error) {
      console.error('❌ App failed to become ready:', error);
      throw error;
    }
  }

  /**
   * Take screenshot with enhanced metadata
   */
  async takeScreenshot(name, options = {}) {
    const { fullPage = true, annotations = [] } = options;
    
    const screenshot = await this.page.screenshot({
      fullPage,
      path: `./test-results/playwright/screenshots/${name}-${Date.now()}.png`,
      ...options
    });

    console.log(`📸 Screenshot taken: ${name}`);
    return screenshot;
  }

  /**
   * Get test report data
   */
  getTestReport() {
    return {
      duration: Date.now() - this.testStartTime,
      errors: this.errors,
      url: this.page.url(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { BaseTest };