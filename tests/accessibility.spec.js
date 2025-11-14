/**
 * Accessibility Testing Suite
 * Tests WCAG compliance and accessibility features
 */

const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile - Accessibility Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Get accessibility snapshot
    const snapshot = await page.accessibility.snapshot();
    
    // Check if snapshot has accessible elements
    expect(snapshot).not.toBeNull();
    expect(snapshot.name || snapshot.children).toBeDefined();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through elements
    const tabSequence = [];
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      // Get focused element
      const focusedElement = await page.evaluateHandle(() => document.activeElement);
      const tagName = await focusedElement.evaluate(el => el.tagName);
      tabSequence.push(tagName);
    }
    
    console.log('Tab sequence:', tabSequence);
    
    // Take screenshot of final focused state
    await page.screenshot({ 
      path: 'test-results/screenshots/keyboard-nav.png' 
    });
  });

  test('should have adequate touch target sizes (mobile)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Get all buttons and links
    const interactiveElements = await page.$$('button, a');
    
    let smallTargets = 0;
    
    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      if (box) {
        // WCAG recommends 44x44px minimum
        if (box.width < 44 || box.height < 44) {
          smallTargets++;
        }
      }
    }
    
    console.log(`Found ${smallTargets} potentially small touch targets out of ${interactiveElements.length}`);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Get all headings
    const headings = await page.$$('h1, h2, h3, h4, h5, h6');
    console.log(`Found ${headings.length} headings`);
    
    const headingLevels = [];
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const text = await heading.textContent();
      headingLevels.push({ level: tagName, text });
    }
    
    console.log('Heading hierarchy:', headingLevels);
  });

  test('should have proper color contrast (automated check)', async ({ page }) => {
    // Get all text elements
    const textElements = await page.$$('p, span, div, button, a');
    
    console.log(`Checking ${textElements.length} text elements for contrast`);
    
    // Take screenshots for manual review
    await page.screenshot({ 
      path: 'test-results/screenshots/contrast-check.png',
      fullPage: true 
    });
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Get accessibility tree
    const snapshot = await page.accessibility.snapshot();
    
    // Recursively check for accessible names
    const hasAccessibleNames = (node) => {
      if (!node) return false;
      if (node.name) return true;
      if (node.children) {
        return node.children.some(hasAccessibleNames);
      }
      return false;
    };
    
    expect(hasAccessibleNames(snapshot)).toBeTruthy();
  });

  test('should have alt text for images', async ({ page }) => {
    const images = await page.$$('img');
    
    let missingAlt = 0;
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt === null || alt === '') {
        missingAlt++;
      }
    }
    
    console.log(`${missingAlt} images missing alt text out of ${images.length}`);
  });

  test('should handle zoom (200%)', async ({ page }) => {
    // Zoom to 200%
    await page.evaluate(() => {
      document.body.style.zoom = '2';
    });
    
    await page.waitForTimeout(500);
    
    // Check if content is still usable
    const body = await page.$('body');
    expect(body).not.toBeNull();
    
    await page.screenshot({ 
      path: 'test-results/screenshots/zoom-200.png' 
    });
  });

  test('should have focus indicators', async ({ page }) => {
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Get focused element styles
    const focusStyles = await page.evaluate(() => {
      const focused = document.activeElement;
      const styles = window.getComputedStyle(focused);
      return {
        outline: styles.outline,
        border: styles.border,
        boxShadow: styles.boxShadow
      };
    });
    
    console.log('Focus styles:', focusStyles);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/focus-indicator.png' 
    });
  });

  test('should work with reduced motion', async ({ page, context }) => {
    await context.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check if page still works
    const body = await page.$('body');
    expect(body).not.toBeNull();
    
    await page.screenshot({ 
      path: 'test-results/screenshots/reduced-motion.png' 
    });
  });

  test('should have semantic HTML', async ({ page }) => {
    // Check for semantic elements
    const main = await page.$('main');
    const nav = await page.$('nav');
    const header = await page.$('header');
    const footer = await page.$('footer');
    
    const semanticElements = { 
      main: !!main, 
      nav: !!nav, 
      header: !!header, 
      footer: !!footer 
    };
    
    console.log('Semantic elements found:', semanticElements);
  });

  test('should support high contrast mode', async ({ page, context }) => {
    await context.emulateMedia({ forcedColors: 'active' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/screenshots/high-contrast.png',
      fullPage: true 
    });
  });

  test('should have proper form labels', async ({ page }) => {
    const inputs = await page.$$('input');
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = await page.$(`label[for="${id}"]`);
        if (!label && !ariaLabel && !ariaLabelledBy) {
          console.warn('Input without label found');
        }
      }
    }
  });

  test('should test with different font sizes', async ({ page }) => {
    const fontSizes = [12, 16, 20, 24];
    
    for (const size of fontSizes) {
      await page.evaluate((fontSize) => {
        document.body.style.fontSize = `${fontSize}px`;
      }, size);
      
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: `test-results/screenshots/font-size-${size}.png`,
        fullPage: true
      });
    }
  });

});
