/**
 * Performance and Network Testing
 * Tests load times, resource optimization, and network behavior
 */

const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile - Performance Tests', () => {
  
  test('should measure initial load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'load' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Initial load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(15000); // 15 seconds max
  });

  test('should measure time to interactive', async ({ page }) => {
    await page.goto('/');
    
    const tti = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return perf.domInteractive - perf.fetchStart;
    });
    
    console.log(`Time to Interactive: ${tti}ms`);
  });

  test('should check resource sizes', async ({ page }) => {
    const resources = [];
    
    page.on('response', response => {
      resources.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'] || 'unknown'
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Total resources loaded: ${resources.length}`);
    
    // Check for large resources
    const jsResources = resources.filter(r => r.url.includes('.js'));
    console.log(`JavaScript files: ${jsResources.length}`);
  });

  test('should test offline behavior', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Go offline
    await context.setOffline(true);
    
    // Try to reload
    try {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 5000 });
    } catch (e) {
      console.log('Offline mode detected correctly');
    }
    
    await page.screenshot({ 
      path: 'test-results/screenshots/offline-mode.png' 
    });
  });

  test('should test slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 500); // Add 500ms delay
    });
    
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`Load time on slow network: ${loadTime}ms`);
  });

  test('should measure render performance', async ({ page }) => {
    await page.goto('/');
    
    const renderMetrics = await page.evaluate(() => {
      return {
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      };
    });
    
    console.log('Render metrics:', renderMetrics);
  });

  test('should check memory usage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const memoryInfo = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });
    
    if (memoryInfo) {
      console.log('Memory usage:', memoryInfo);
    }
  });

  test('should test scroll performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    // Perform multiple scrolls
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 100));
      await page.waitForTimeout(50);
    }
    
    const scrollTime = Date.now() - startTime;
    console.log(`Scroll performance: ${scrollTime}ms for 10 scrolls`);
  });

  test('should test animation frame rate', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const fps = await page.evaluate(() => {
      return new Promise(resolve => {
        let frameCount = 0;
        const startTime = performance.now();
        
        function countFrames() {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frameCount);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    });
    
    console.log(`Frame rate: ${fps} FPS`);
  });

  test('should check for console warnings', async ({ page }) => {
    const warnings = [];
    
    page.on('console', msg => {
      if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log(`Console warnings: ${warnings.length}`);
    if (warnings.length > 0) {
      console.log('Warnings:', warnings);
    }
  });

  test('should test caching behavior', async ({ page }) => {
    // First load
    await page.goto('/');
    const firstLoadResources = [];
    
    page.on('response', response => {
      firstLoadResources.push(response.url());
    });
    
    await page.waitForLoadState('networkidle');
    
    // Second load (should use cache)
    await page.reload({ waitUntil: 'networkidle' });
    
    console.log(`Resources loaded on first visit: ${firstLoadResources.length}`);
  });

});
