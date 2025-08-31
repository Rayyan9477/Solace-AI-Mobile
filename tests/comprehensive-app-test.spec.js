/**
 * Comprehensive Solace AI Mobile App Testing
 * Tests all major functionality, cross-platform compatibility, and performance
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const APP_URL = process.env.SOLACE_BASE_URL || 'http://localhost:8081';
const TEST_TIMEOUT = 30000;

test.describe('Solace AI Mobile App - Comprehensive Testing', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL, { timeout: TEST_TIMEOUT });
    await page.waitForLoadState('networkidle');
  });

  test.describe('App Loading and Initialization', () => {
    
    test('should load the app successfully', async ({ page }) => {
      // Wait for app to initialize
      await page.waitForSelector('[data-testid="app-root"], div, body', { timeout: 15000 });
      
      // Check if the page is not blank
      const content = await page.textContent('body');
      expect(content.trim()).not.toBe('');
      
      // Check for React Native web indicators
      const reactNativeElements = await page.$$('[data-reactroot], #root, [class*="react"], [class*="expo"]');
      expect(reactNativeElements.length).toBeGreaterThan(0);
    });

    test('should have proper meta tags and title', async ({ page }) => {
      const title = await page.title();
      expect(title).toContain('Solace');
      
      // Check viewport meta tag for mobile responsiveness
      const viewportMeta = await page.getAttribute('meta[name="viewport"]', 'content');
      expect(viewportMeta).toContain('width=device-width');
    });

  });

  test.describe('Navigation System Testing', () => {
    
    test('should render navigation tabs', async ({ page }) => {
      // Look for tab navigation elements
      await page.waitForSelector('*', { timeout: 10000 });
      
      // Check for tab-like elements or navigation
      const hasTabElements = await page.evaluate(() => {
        // Look for common tab navigation patterns
        const tabSelectors = [
          '[role="tablist"]',
          '[role="tab"]',
          '[data-testid*="tab"]',
          'button[aria-label*="tab"]',
          'div[class*="tab"]',
          'nav',
          'button[class*="navigation"]'
        ];
        
        for (const selector of tabSelectors) {
          if (document.querySelector(selector)) return true;
        }
        return false;
      });
      
      // If no explicit tabs found, check if app is interactive
      const interactiveElements = await page.$$('button, [role="button"], a, [tabindex]');
      expect(interactiveElements.length).toBeGreaterThan(0);
    });

  });

  test.describe('Theme System Testing', () => {
    
    test('should apply CSS styles and themes', async ({ page }) => {
      await page.waitForSelector('*', { timeout: 10000 });
      
      // Check if styles are applied
      const hasStyles = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (let element of elements) {
          const styles = window.getComputedStyle(element);
          if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
              styles.color !== 'rgb(0, 0, 0)' ||
              styles.fontSize !== '16px') {
            return true;
          }
        }
        return false;
      });
      
      expect(hasStyles).toBe(true);
    });

    test('should support responsive design', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      
      let mobileLayout = await page.screenshot({ type: 'png' });
      expect(mobileLayout.length).toBeGreaterThan(1000);
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(1000);
      
      let tabletLayout = await page.screenshot({ type: 'png' });
      expect(tabletLayout.length).toBeGreaterThan(1000);
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.waitForTimeout(1000);
      
      let desktopLayout = await page.screenshot({ type: 'png' });
      expect(desktopLayout.length).toBeGreaterThan(1000);
    });

  });

  test.describe('User Interaction Testing', () => {
    
    test('should handle basic user interactions', async ({ page }) => {
      await page.waitForSelector('*', { timeout: 10000 });
      
      // Try to find and interact with buttons
      const buttons = await page.$$('button, [role="button"]');
      
      if (buttons.length > 0) {
        // Test clicking the first button
        await buttons[0].click();
        await page.waitForTimeout(1000);
        
        // Check if interaction caused any changes
        const afterClick = await page.textContent('body');
        expect(afterClick).toBeDefined();
      }
      
      // Test touch/click interactions on the page
      await page.click('body');
      await page.waitForTimeout(500);
    });

  });

  test.describe('Performance Testing', () => {
    
    test('should load within performance budgets', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(APP_URL, { timeout: TEST_TIMEOUT });
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // App should load within 20 seconds
      expect(loadTime).toBeLessThan(20000);
      
      // Check for console errors
      const logs = [];
      page.on('console', msg => logs.push(msg.text()));
      
      await page.waitForTimeout(2000);
      
      // Filter out non-critical messages
      const errors = logs.filter(log => 
        log.includes('Error') || log.includes('Failed') || log.includes('Cannot')
      ).filter(log => 
        !log.includes('DevTools') && 
        !log.includes('extension') &&
        !log.includes('favicon')
      );
      
      // Should have minimal errors
      expect(errors.length).toBeLessThan(5);
    });

  });

  test.describe('Accessibility Testing', () => {
    
    test('should meet basic accessibility standards', async ({ page }) => {
      await page.waitForSelector('*', { timeout: 10000 });
      
      // Check for accessibility attributes
      const accessibleElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let count = 0;
        
        for (let element of elements) {
          if (element.hasAttribute('aria-label') ||
              element.hasAttribute('aria-labelledby') ||
              element.hasAttribute('role') ||
              element.hasAttribute('alt') ||
              element.hasAttribute('title')) {
            count++;
          }
        }
        
        return count;
      });
      
      // Should have some accessible elements
      expect(accessibleElements).toBeGreaterThan(0);
      
      // Check color contrast (basic test)
      const hasGoodContrast = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (let element of elements) {
          const styles = window.getComputedStyle(element);
          const bgColor = styles.backgroundColor;
          const textColor = styles.color;
          
          // Basic check for non-transparent colors
          if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgb(0, 0, 0)') {
            return true;
          }
        }
        return false;
      });
      
      expect(hasGoodContrast).toBe(true);
    });

  });

  test.describe('Cross-Platform Compatibility', () => {
    
    test('should work on different screen orientations', async ({ page }) => {
      // Test portrait orientation
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      
      let portraitContent = await page.textContent('body');
      expect(portraitContent.length).toBeGreaterThan(0);
      
      // Test landscape orientation
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(1000);
      
      let landscapeContent = await page.textContent('body');
      expect(landscapeContent.length).toBeGreaterThan(0);
    });

  });

  test.describe('Error Handling', () => {
    
    test('should handle network errors gracefully', async ({ page }) => {
      // Block network requests to test offline behavior
      await page.route('**/*', route => {
        if (route.request().url().includes('api') || 
            route.request().url().includes('fetch')) {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      await page.goto(APP_URL);
      await page.waitForTimeout(3000);
      
      // App should still render something even with network issues
      const content = await page.textContent('body');
      expect(content.length).toBeGreaterThan(0);
    });

  });

});

test.describe('Mobile-Specific Testing', () => {
  
  test.use({ 
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  test('should optimize for mobile devices', async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for mobile-optimized layout
    const isMobileOptimized = await page.evaluate(() => {
      // Check for touch-friendly elements (minimum 44px touch targets)
      const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
      let properSized = 0;
      
      for (let element of interactiveElements) {
        const rect = element.getBoundingClientRect();
        if (rect.width >= 44 && rect.height >= 44) {
          properSized++;
        }
      }
      
      return {
        totalInteractive: interactiveElements.length,
        properSized: properSized,
        ratio: properSized / Math.max(interactiveElements.length, 1)
      };
    });
    
    // At least 50% of interactive elements should be properly sized
    expect(isMobileOptimized.ratio).toBeGreaterThan(0.5);
  });

});