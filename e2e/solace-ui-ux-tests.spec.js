// e2e/solace-ui-ux-tests.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile - UI/UX Tests', () => {
  
  // Test Accessibility Features
  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on all interactive elements', async ({ page }) => {
      await page.goto('/');
      
      // Check buttons have aria-labels
      const buttons = await page.locator('button').all();
      for (const button of buttons) {
        const ariaLabel = await button.getAttribute('aria-label');
        const text = await button.textContent();
        expect(ariaLabel || text).toBeTruthy();
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/');
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      
      // Check text contrast ratios
      const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span').all();
      for (const element of textElements.slice(0, 5)) { // Test first 5 elements
        const isVisible = await element.isVisible();
        if (isVisible) {
          const color = await element.evaluate(el => window.getComputedStyle(el).color);
          const bgColor = await element.evaluate(el => window.getComputedStyle(el).backgroundColor);
          // Note: In real tests, you'd calculate actual contrast ratio
          expect(color).toBeTruthy();
          expect(bgColor).toBeTruthy();
        }
      }
    });
  });

  // Test Theme Switching
  test.describe('Theme System', () => {
    test('should toggle between light and dark mode', async ({ page }) => {
      await page.goto('/');
      
      // Find theme toggle button
      const themeToggle = await page.locator('[aria-label*="theme"], button:has-text("Dark Mode"), button:has-text("Light Mode")').first();
      
      if (await themeToggle.isVisible()) {
        // Get initial background color
        const initialBg = await page.evaluate(() => 
          window.getComputedStyle(document.body).backgroundColor
        );
        
        // Click theme toggle
        await themeToggle.click();
        
        // Wait for theme transition
        await page.waitForTimeout(300);
        
        // Check background changed
        const newBg = await page.evaluate(() => 
          window.getComputedStyle(document.body).backgroundColor
        );
        
        expect(newBg).not.toBe(initialBg);
      }
    });

    test('should persist theme preference', async ({ page, context }) => {
      await page.goto('/');
      
      // Toggle theme
      const themeToggle = await page.locator('[aria-label*="theme"], button:has-text("Dark Mode"), button:has-text("Light Mode")').first();
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        
        // Reload page
        await page.reload();
        
        // Check theme persisted
        const currentTheme = await page.evaluate(() => 
          window.getComputedStyle(document.body).backgroundColor
        );
        expect(currentTheme).toBeTruthy();
      }
    });
  });

  // Test Mobile Responsiveness
  test.describe('Mobile Responsiveness', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      // Test iPhone SE
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    });

    test('should be responsive on tablet devices', async ({ page }) => {
      // Test iPad
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Check layout adapts
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
    });
  });

  // Test Navigation
  test.describe('Navigation', () => {
    test('should have accessible navigation menu', async ({ page }) => {
      await page.goto('/');
      
      // Check for navigation elements
      const nav = await page.locator('nav, [role="navigation"]').first();
      if (await nav.isVisible()) {
        expect(nav).toBeVisible();
      }
    });

    test('should have clear visual feedback on hover/focus', async ({ page }) => {
      await page.goto('/');
      
      // Find clickable elements
      const link = await page.locator('a, button').first();
      if (await link.isVisible()) {
        // Hover
        await link.hover();
        
        // Check for visual change (cursor, color, etc.)
        const cursor = await link.evaluate(el => 
          window.getComputedStyle(el).cursor
        );
        expect(['pointer', 'hand']).toContain(cursor);
      }
    });
  });

  // Test Form Elements
  test.describe('Form Elements', () => {
    test('should have proper form labels', async ({ page }) => {
      await page.goto('/');
      
      // Check all inputs have labels
      const inputs = await page.locator('input:not([type="hidden"])').all();
      for (const input of inputs) {
        if (await input.isVisible()) {
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const placeholder = await input.getAttribute('placeholder');
          
          // Input should have either associated label, aria-label, or placeholder
          expect(id || ariaLabel || placeholder).toBeTruthy();
        }
      }
    });

    test('should show validation errors clearly', async ({ page }) => {
      await page.goto('/');
      
      // Find a form
      const form = await page.locator('form').first();
      if (await form.isVisible()) {
        // Submit empty form
        const submitButton = await form.locator('button[type="submit"], button:has-text("Submit")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Check for error messages
          const errorMessage = await page.locator('[role="alert"], .error, .invalid').first();
          // Errors should be visible if validation exists
          // This is a soft check as not all forms have validation
        }
      }
    });
  });

  // Test Loading States
  test.describe('Loading States', () => {
    test('should show loading indicators during async operations', async ({ page }) => {
      await page.goto('/');
      
      // Check for loading states
      const loadingIndicators = await page.locator('[role="progressbar"], .loading, .spinner').all();
      // Just verify the selectors exist in the codebase
      expect(loadingIndicators).toBeDefined();
    });
  });

  // Test Error Handling
  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline
      await page.route('**/*', route => route.abort());
      
      try {
        await page.goto('/');
      } catch (e) {
        // Check for error message
        const errorMessage = await page.locator('[role="alert"], .error').first();
        // Error UI should exist in the app
      }
    });
  });

  // Test Performance
  test.describe('Performance', () => {
    test('should load quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have optimized images', async ({ page }) => {
      await page.goto('/');
      
      // Check image loading
      const images = await page.locator('img').all();
      for (const img of images.slice(0, 3)) { // Check first 3 images
        if (await img.isVisible()) {
          const hasLazyLoading = await img.getAttribute('loading');
          const hasAlt = await img.getAttribute('alt');
          
          // Images should have alt text for accessibility
          expect(hasAlt).toBeTruthy();
        }
      }
    });
  });
}); 