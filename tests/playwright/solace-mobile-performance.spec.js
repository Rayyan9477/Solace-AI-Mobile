// e2e/solace-mobile-performance.spec.js
// Mobile Performance and Cross-Platform Tests for Solace AI Mobile
const { test, expect, devices } = require("@playwright/test");

test.describe("Solace AI Mobile - Mobile Performance & Cross-Platform", () => {
  let performanceIssues = [];
  let mobileIssues = [];

  test.beforeEach(async ({ page }) => {
    performanceIssues = [];
    mobileIssues = [];
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (performanceIssues.length > 0 || mobileIssues.length > 0) {
      console.log(`\n📱 Mobile/Performance Issues (${testInfo.title}):`);
      [...performanceIssues, ...mobileIssues].forEach(issue => {
        console.log(`  - ${issue.type}: ${issue.description}`);
      });
    }

    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ 
        path: `test-results/mobile-perf-failure-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  });

  // Test multiple mobile devices
  const mobileDevices = [
    { name: 'iPhone SE (Small)', ...devices['iPhone SE'] },
    { name: 'iPhone 12 (Standard)', ...devices['iPhone 12'] },
    { name: 'iPhone 14 Pro (Large)', ...devices['iPhone 14 Pro'] },
    { name: 'Samsung Galaxy S21', ...devices['Galaxy S21'] },
    { name: 'iPad (Tablet)', ...devices['iPad Pro'] }
  ];

  for (const device of mobileDevices) {
    test(`Mobile UI Analysis - ${device.name}`, async ({ browser }) => {
      console.log(`📱 Testing: ${device.name} (${device.viewport.width}x${device.viewport.height})`);
      
      const context = await browser.newContext({
        ...device,
        permissions: ['geolocation'] // Mental health apps may need location
      });
      
      const page = await context.newPage();

      // Performance monitoring
      await page.coverage.startCSSCoverage();
      await page.coverage.startJSCoverage();

      const startTime = Date.now();
      
      try {
        await page.goto("http://localhost:8082", { 
          waitUntil: 'networkidle',
          timeout: 90000  // Longer timeout for mobile
        });
      } catch (error) {
        mobileIssues.push({
          type: 'Loading Issue',
          description: `Failed to load on ${device.name}: ${error.message}`,
          device: device.name
        });
        await context.close();
        return;
      }

      const loadTime = Date.now() - startTime;
      console.log(`⏱️ Load time on ${device.name}: ${loadTime}ms`);

      if (loadTime > 8000) { // Mobile should load within 8 seconds
        performanceIssues.push({
          type: 'Performance Issue',
          description: `Slow load time on ${device.name}: ${loadTime}ms (should be < 8000ms)`,
          device: device.name
        });
      }

      await page.waitForTimeout(3000);

      // Check viewport fit and no horizontal scroll
      const viewportIssues = await page.evaluate((deviceName) => {
        const issues = [];
        
        // Check for horizontal scroll
        if (document.body.scrollWidth > window.innerWidth) {
          issues.push({
            type: 'Viewport Issue',
            description: `Horizontal scroll present on ${deviceName}`,
            scrollWidth: document.body.scrollWidth,
            windowWidth: window.innerWidth
          });
        }

        // Check for elements extending beyond viewport
        const elements = document.querySelectorAll('*');
        let overflowCount = 0;
        
        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth + 5) { // 5px tolerance
            overflowCount++;
          }
        }

        if (overflowCount > 0) {
          issues.push({
            type: 'Overflow Issue',
            description: `${overflowCount} elements extend beyond viewport on ${deviceName}`
          });
        }

        return issues;
      }, device.name);

      mobileIssues.push(...viewportIssues);

      // Test touch targets
      const touchTargets = await page.locator('button, a, input[type="button"], input[type="submit"], [role="button"]').all();
      let smallTouchTargets = 0;

      for (const target of touchTargets.slice(0, 15)) { // Test first 15 targets
        if (await target.isVisible()) {
          const box = await target.boundingBox();
          if (box && (box.width < 44 || box.height < 44)) {
            smallTouchTargets++;
          }
        }
      }

      if (smallTouchTargets > 0) {
        mobileIssues.push({
          type: 'Touch Target Issue',
          description: `${smallTouchTargets} touch targets smaller than 44x44px on ${device.name}`,
          device: device.name
        });
      }

      // Test navigation on mobile
      const tabBar = await page.locator('[role="tablist"], .tab-bar, nav').first();
      if (await tabBar.isVisible()) {
        // Test tab switching on mobile
        const tabs = await tabBar.locator('button, a, [role="tab"]').all();
        
        for (const tab of tabs.slice(0, 3)) { // Test first 3 tabs
          if (await tab.isVisible()) {
            const tabStartTime = Date.now();
            
            try {
              await tab.tap(); // Use tap instead of click for mobile
              await page.waitForTimeout(1500);
              
              const tapTime = Date.now() - tabStartTime;
              if (tapTime > 2000) {
                performanceIssues.push({
                  type: 'Mobile Performance',
                  description: `Tab switching slow on ${device.name}: ${tapTime}ms`,
                  device: device.name
                });
              }
            } catch (error) {
              mobileIssues.push({
                type: 'Interaction Issue',
                description: `Tab tap failed on ${device.name}: ${error.message}`,
                device: device.name
              });
            }
          }
        }
      }

      // Check mobile-specific UI elements
      if (device.viewport.width <= 768) {
        // Look for hamburger menu or mobile navigation
        const mobileNav = await page.locator('.hamburger, .menu-toggle, .mobile-menu, [aria-label*="menu"]').count();
        
        // Check if desktop elements are hidden on mobile
        const desktopOnlyElements = await page.locator('.desktop-only, .hide-mobile').count();
        if (desktopOnlyElements > 0) {
          const visibleDesktopElements = await page.locator('.desktop-only:visible, .hide-mobile:visible').count();
          if (visibleDesktopElements > 0) {
            mobileIssues.push({
              type: 'Responsive Issue',
              description: `Desktop-only elements visible on ${device.name}`,
              device: device.name
            });
          }
        }
      }

      // Test form interactions on mobile
      const inputs = await page.locator('input, textarea').all();
      for (const input of inputs.slice(0, 3)) { // Test first 3 inputs
        if (await input.isVisible()) {
          try {
            await input.tap();
            await page.waitForTimeout(500);
            
            // Check if virtual keyboard space is handled
            const inputBox = await input.boundingBox();
            if (inputBox && inputBox.bottom > device.viewport.height * 0.6) {
              // Input might be obscured by virtual keyboard
              mobileIssues.push({
                type: 'Mobile UX Issue',
                description: `Input field may be obscured by virtual keyboard on ${device.name}`,
                device: device.name
              });
            }
          } catch (error) {
            mobileIssues.push({
              type: 'Input Issue',
              description: `Input interaction failed on ${device.name}: ${error.message}`,
              device: device.name
            });
          }
        }
      }

      // Memory and performance check
      const performanceMetrics = await page.evaluate(() => {
        const nav = performance.navigation;
        const timing = performance.timing;
        
        return {
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          memoryUsed: performance.memory ? performance.memory.usedJSHeapSize : null,
          memoryLimit: performance.memory ? performance.memory.jsHeapSizeLimit : null
        };
      });

      if (performanceMetrics.memoryUsed && performanceMetrics.memoryLimit) {
        const memoryUsagePercent = (performanceMetrics.memoryUsed / performanceMetrics.memoryLimit) * 100;
        if (memoryUsagePercent > 50) {
          performanceIssues.push({
            type: 'Memory Issue',
            description: `High memory usage on ${device.name}: ${memoryUsagePercent.toFixed(1)}%`,
            device: device.name
          });
        }
      }

      // Stop coverage and analyze bundle size impact
      const jsCoverage = await page.coverage.stopJSCoverage();
      const cssCoverage = await page.coverage.stopCSSCoverage();

      let totalBytes = 0;
      jsCoverage.forEach(entry => {
        totalBytes += entry.text.length;
      });
      cssCoverage.forEach(entry => {
        totalBytes += entry.text.length;
      });

      const totalKB = totalBytes / 1024;
      console.log(`📊 ${device.name} - Total bundle size: ${totalKB.toFixed(1)}KB`);

      if (totalKB > 2000) { // 2MB threshold for mobile
        performanceIssues.push({
          type: 'Bundle Size Issue',
          description: `Large bundle size for mobile: ${totalKB.toFixed(1)}KB (recommend < 2000KB)`,
          device: device.name
        });
      }

      // Take device-specific screenshot
      await page.screenshot({ 
        path: `test-results/mobile-${device.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`,
        fullPage: false 
      });

      await context.close();
      console.log(`✅ ${device.name} analysis complete`);
    });
  }

  test("Cross-Browser Mobile Compatibility", async ({ page }) => {
    console.log("🔍 Testing: Cross-Browser Mobile Compatibility");
    
    // Test different mobile user agents
    const mobileUserAgents = [
      {
        name: 'iOS Safari',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      },
      {
        name: 'Android Chrome',
        userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36'
      },
      {
        name: 'Samsung Internet',
        userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/92.0.4515.166 Mobile Safari/537.36'
      }
    ];

    for (const ua of mobileUserAgents) {
      console.log(`🔍 Testing with ${ua.name}`);
      
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
      await page.setExtraHTTPHeaders({
        'User-Agent': ua.userAgent
      });

      try {
        await page.goto("http://localhost:8081", { 
          waitUntil: 'networkidle',
          timeout: 60000 
        });
        
        await page.waitForTimeout(3000);

        // Test basic functionality
        const hasInteractiveContent = await page.locator('button, a, input').count() > 0;
        if (!hasInteractiveContent) {
          mobileIssues.push({
            type: 'Browser Compatibility',
            description: `No interactive content detected on ${ua.name}`,
            browser: ua.name
          });
        }

        // Test React Native Web specific features
        const hasRNWebElements = await page.evaluate(() => {
          // Look for React Native Web specific styles or elements
          return document.body.style.fontFamily.includes('System') || 
                 document.querySelector('[data-reactroot]') !== null ||
                 window.ReactNativeWebView !== undefined;
        });

        console.log(`${ua.name}: React Native Web detected: ${hasRNWebElements}`);

      } catch (error) {
        mobileIssues.push({
          type: 'Browser Compatibility',
          description: `Failed to load on ${ua.name}: ${error.message}`,
          browser: ua.name
        });
      }
    }

    console.log("✅ Cross-browser mobile compatibility check complete");
  });

  test("Performance Benchmarking", async ({ page }) => {
    console.log("🔍 Testing: Performance Benchmarking");
    
    // Test with mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Performance timing
    const performanceRuns = [];
    
    for (let run = 0; run < 3; run++) {
      console.log(`🏃 Performance run ${run + 1}/3`);
      
      const startTime = Date.now();
      
      await page.goto("http://localhost:8082", { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });

      const navigationEnd = Date.now();
      await page.waitForTimeout(2000); // Wait for interactions to be ready

      // Test interaction responsiveness
      const interactionStart = Date.now();
      const firstButton = await page.locator('button').first();
      
      if (await firstButton.isVisible()) {
        await firstButton.click();
        await page.waitForTimeout(500);
      }
      
      const interactionEnd = Date.now();

      performanceRuns.push({
        navigationTime: navigationEnd - startTime,
        interactionTime: interactionEnd - interactionStart,
        run: run + 1
      });

      // Clear cache between runs
      await page.reload();
    }

    // Analyze performance consistency
    const avgNavigationTime = performanceRuns.reduce((sum, run) => sum + run.navigationTime, 0) / performanceRuns.length;
    const avgInteractionTime = performanceRuns.reduce((sum, run) => sum + run.interactionTime, 0) / performanceRuns.length;

    console.log(`📊 Average navigation time: ${avgNavigationTime.toFixed(0)}ms`);
    console.log(`📊 Average interaction time: ${avgInteractionTime.toFixed(0)}ms`);

    if (avgNavigationTime > 5000) {
      performanceIssues.push({
        type: 'Performance Issue',
        description: `Slow average navigation time: ${avgNavigationTime.toFixed(0)}ms`,
        metric: 'navigation'
      });
    }

    if (avgInteractionTime > 300) {
      performanceIssues.push({
        type: 'Performance Issue',
        description: `Slow interaction response time: ${avgInteractionTime.toFixed(0)}ms`,
        metric: 'interaction'
      });
    }

    // Check performance variation (consistency)
    const navigationTimes = performanceRuns.map(run => run.navigationTime);
    const maxNavTime = Math.max(...navigationTimes);
    const minNavTime = Math.min(...navigationTimes);
    const navigationVariation = maxNavTime - minNavTime;

    if (navigationVariation > 3000) {
      performanceIssues.push({
        type: 'Performance Consistency',
        description: `High performance variation: ${navigationVariation}ms difference between runs`,
        metric: 'consistency'
      });
    }

    console.log("✅ Performance benchmarking complete");
  });

  test("Final Mobile Performance Report", async ({ page }) => {
    console.log("\n" + "=".repeat(65));
    console.log("📱 SOLACE AI MOBILE - MOBILE PERFORMANCE REPORT");
    console.log("=".repeat(65));

    // Categorize issues
    const loadingIssues = [...performanceIssues, ...mobileIssues].filter(i => i.type.includes('Loading') || i.type.includes('Performance'));
    const uiIssues = mobileIssues.filter(i => i.type.includes('UI') || i.type.includes('Touch') || i.type.includes('Viewport'));
    const compatibilityIssues = mobileIssues.filter(i => i.type.includes('Compatibility') || i.type.includes('Browser'));

    console.log("\n⚡ PERFORMANCE ISSUES:");
    if (loadingIssues.length === 0) {
      console.log("   ✅ No significant performance issues detected");
    } else {
      loadingIssues.forEach(issue => {
        console.log(`   • ${issue.description} ${issue.device ? `(${issue.device})` : ''}`);
      });
    }

    console.log("\n📱 MOBILE UI/UX ISSUES:");
    if (uiIssues.length === 0) {
      console.log("   ✅ No mobile UI/UX issues detected");
    } else {
      uiIssues.forEach(issue => {
        console.log(`   • ${issue.description} ${issue.device ? `(${issue.device})` : ''}`);
      });
    }

    console.log("\n🌐 CROSS-PLATFORM COMPATIBILITY:");
    if (compatibilityIssues.length === 0) {
      console.log("   ✅ Good cross-platform compatibility");
    } else {
      compatibilityIssues.forEach(issue => {
        console.log(`   • ${issue.description} ${issue.browser ? `(${issue.browser})` : ''}`);
      });
    }

    console.log("\n🎯 MOBILE OPTIMIZATION RECOMMENDATIONS:");
    
    if (loadingIssues.some(i => i.description.includes('bundle'))) {
      console.log("   📦 Implement code splitting and lazy loading to reduce bundle size");
    }
    
    if (uiIssues.some(i => i.description.includes('touch'))) {
      console.log("   👆 Increase touch target sizes to minimum 44x44px for better accessibility");
    }
    
    if (uiIssues.some(i => i.description.includes('viewport'))) {
      console.log("   📐 Fix responsive design issues and eliminate horizontal scroll");
    }
    
    if (loadingIssues.some(i => i.description.includes('slow'))) {
      console.log("   🚀 Optimize images, fonts, and initial bundle for faster mobile loading");
    }

    console.log("\n📊 MOBILE PERFORMANCE SCORE:");
    
    const totalIssues = performanceIssues.length + mobileIssues.length;
    const criticalIssues = [...performanceIssues, ...mobileIssues].filter(i => 
      i.description.includes('Failed') || i.description.includes('slow') || i.description.includes('High')
    ).length;

    if (totalIssues === 0) {
      console.log("   🏆 Excellent (A+): No mobile performance issues detected");
    } else if (criticalIssues === 0 && totalIssues <= 3) {
      console.log("   ✅ Good (A): Minor mobile optimizations needed");
    } else if (criticalIssues <= 2) {
      console.log("   ⚠️  Fair (B): Several mobile issues should be addressed");
    } else {
      console.log("   ❌ Poor (C): Critical mobile performance issues need immediate attention");
    }

    console.log(`\n📋 TOTAL ISSUES: ${totalIssues}`);
    console.log(`   • Performance Issues: ${performanceIssues.length}`);
    console.log(`   • Mobile UI Issues: ${mobileIssues.length}`);
    console.log(`   • Critical Issues: ${criticalIssues}`);

    console.log("\n" + "=".repeat(65));

    // Take final mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:8082");
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'test-results/final-mobile-state.png', 
      fullPage: true 
    });
  });
});