/**
 * Visual Regression and Component Testing
 * Tests visual appearance and component rendering
 */

const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile - Visual Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should capture baseline visual state', async ({ page }) => {
    // Wait for any animations to complete
    await page.waitForTimeout(2000);
    
    // Take full page screenshot as baseline
    await page.screenshot({ 
      path: 'test-results/screenshots/visual-baseline.png',
      fullPage: true 
    });
  });

  test('should capture component states', async ({ page }) => {
    // Capture different viewport states
    const states = [
      { name: 'initial', action: () => {} },
      { name: 'scrolled', action: async () => await page.evaluate(() => window.scrollBy(0, 500)) },
    ];
    
    for (const state of states) {
      await state.action();
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: `test-results/screenshots/state-${state.name}.png`,
        fullPage: true
      });
    }
  });

  test('should test theme switching visuals', async ({ page }) => {
    // Capture light theme
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/screenshots/theme-light-full.png',
      fullPage: true 
    });
    
    // Capture dark theme
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/screenshots/theme-dark-full.png',
      fullPage: true 
    });
  });

  test('should capture mobile-specific visuals', async ({ page }) => {
    // iPhone 12 Pro
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/iphone-12-pro.png',
      fullPage: true 
    });
    
    // Samsung Galaxy S21
    await page.setViewportSize({ width: 360, height: 740 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/samsung-s21.png',
      fullPage: true 
    });
  });

  test('should capture tablet visuals', async ({ page }) => {
    // iPad Pro
    await page.setViewportSize({ width: 1024, height: 1366 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/ipad-pro.png',
      fullPage: true 
    });
  });

  test('should capture desktop visuals', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/desktop-1920.png',
      fullPage: true 
    });
  });

  test('should test button visual states', async ({ page }) => {
    const buttons = await page.$$('button');
    
    if (buttons.length > 0) {
      const button = buttons[0];
      
      // Normal state
      await page.screenshot({ 
        path: 'test-results/screenshots/button-normal.png' 
      });
      
      // Hover state
      await button.hover();
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: 'test-results/screenshots/button-hover.png' 
      });
      
      // Focus state
      await button.focus();
      await page.waitForTimeout(300);
      await page.screenshot({ 
        path: 'test-results/screenshots/button-focus.png' 
      });
    }
  });

  test('should capture loading states', async ({ page }) => {
    // Capture immediate load state
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.screenshot({ 
      path: 'test-results/screenshots/loading-state.png' 
    });
    
    // Wait for full load
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'test-results/screenshots/loaded-state.png',
      fullPage: true 
    });
  });

  test('should test responsive breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 320, name: 'xs' },
      { width: 480, name: 'sm' },
      { width: 768, name: 'md' },
      { width: 1024, name: 'lg' },
      { width: 1440, name: 'xl' }
    ];
    
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: 800 });
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: `test-results/screenshots/breakpoint-${bp.name}-${bp.width}.png`,
        fullPage: true
      });
    }
  });

  test('should capture orientation changes', async ({ page }) => {
    // Portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/orientation-portrait.png',
      fullPage: true 
    });
    
    // Landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'test-results/screenshots/orientation-landscape.png',
      fullPage: true 
    });
  });

  test('should test typography rendering', async ({ page }) => {
    // Check if fonts are loaded
    const fonts = await page.evaluate(() => {
      return document.fonts.size;
    });
    
    console.log(`Loaded fonts: ${fonts}`);
    
    // Take screenshot of text rendering
    await page.screenshot({ 
      path: 'test-results/screenshots/typography.png',
      fullPage: true 
    });
  });

  test('should capture color palette', async ({ page }) => {
    // Extract computed colors from various elements
    const colors = await page.evaluate(() => {
      const elements = document.querySelectorAll('body, button, a, h1, p');
      const colorSet = new Set();
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        colorSet.add(styles.color);
        colorSet.add(styles.backgroundColor);
      });
      
      return Array.from(colorSet).filter(c => c && c !== 'rgba(0, 0, 0, 0)');
    });
    
    console.log('Color palette:', colors);
  });

  test('should test shadow and elevation', async ({ page }) => {
    // Check for box shadows
    const shadows = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const shadowSet = new Set();
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.boxShadow && styles.boxShadow !== 'none') {
          shadowSet.add(styles.boxShadow);
        }
      });
      
      return Array.from(shadowSet);
    });
    
    console.log('Box shadows:', shadows.length);
  });

  test('should capture spacing consistency', async ({ page }) => {
    // Check padding and margins
    const spacing = await page.evaluate(() => {
      const elements = document.querySelectorAll('div, section, article');
      const spacingValues = [];
      
      for (let i = 0; i < Math.min(10, elements.length); i++) {
        const styles = window.getComputedStyle(elements[i]);
        spacingValues.push({
          padding: styles.padding,
          margin: styles.margin
        });
      }
      
      return spacingValues;
    });
    
    console.log('Spacing values (first 10 elements):', spacing);
  });

  test('should test border radius consistency', async ({ page }) => {
    const borderRadii = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, input, div');
      const radiusSet = new Set();
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.borderRadius && styles.borderRadius !== '0px') {
          radiusSet.add(styles.borderRadius);
        }
      });
      
      return Array.from(radiusSet);
    });
    
    console.log('Border radius values:', borderRadii);
  });

});
