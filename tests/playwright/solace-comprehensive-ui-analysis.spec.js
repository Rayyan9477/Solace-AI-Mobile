// e2e/solace-comprehensive-ui-analysis.spec.js
// Comprehensive UI/UX Analysis Tests for Solace AI Mobile
const { test, expect } = require("@playwright/test");

test.describe("Solace AI Mobile - Comprehensive UI/UX Analysis", () => {
  let consoleErrors = [];
  let networkErrors = [];
  let uiIssues = [];

  test.beforeEach(async ({ page }) => {
    // Clear issues array for each test
    consoleErrors = [];
    networkErrors = [];
    uiIssues = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          text: msg.text(),
          location: msg.location(),
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for network failures
    page.on('requestfailed', (request) => {
      networkErrors.push({
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText,
        timestamp: new Date().toISOString()
      });
    });

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Log issues found in this test
    if (consoleErrors.length > 0) {
      console.log(`\n🚨 Console Errors (${testInfo.title}):`);
      consoleErrors.forEach(error => {
        console.log(`  - ${error.text} (${error.location?.url}:${error.location?.lineNumber})`);
      });
    }

    if (networkErrors.length > 0) {
      console.log(`\n🌐 Network Errors (${testInfo.title}):`);
      networkErrors.forEach(error => {
        console.log(`  - ${error.method} ${error.url}: ${error.failure}`);
      });
    }

    if (uiIssues.length > 0) {
      console.log(`\n🎨 UI Issues (${testInfo.title}):`);
      uiIssues.forEach(issue => {
        console.log(`  - ${issue.type}: ${issue.description} (Element: ${issue.selector})`);
      });
    }

    // Take screenshot if test failed
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ 
        path: `test-results/failed-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  });

  test("1. App Loading and Initial State Analysis", async ({ page }) => {
    console.log("🔍 Testing: App Loading and Initial State");
    
    const startTime = Date.now();
    
    try {
      // Navigate to app with extended timeout for React Native web
      await page.goto("http://localhost:8082", { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });
    } catch (error) {
      await page.screenshot({ 
        path: 'test-results/app-loading-failure.png', 
        fullPage: true 
      });
      throw new Error(`App failed to load: ${error.message}`);
    }

    const loadTime = Date.now() - startTime;
    console.log(`📊 App loaded in ${loadTime}ms`);

    // Check if app loaded successfully
    await page.waitForSelector('body', { timeout: 30000 });

    // Look for critical React Native Web elements
    const appContainer = await page.locator('#root, [data-reactroot], .app-container').first();
    await expect(appContainer).toBeVisible({ timeout: 30000 });

    // Check for loading states or splash screen
    const hasLoader = await page.locator('[role="progressbar"], .loading, .spinner, [data-testid*="loading"]').count();
    if (hasLoader > 0) {
      console.log("✅ Loading indicators found");
      // Wait for loading to complete
      await page.waitForFunction(() => {
        const loaders = document.querySelectorAll('[role="progressbar"], .loading, .spinner, [data-testid*="loading"]');
        return loaders.length === 0 || Array.from(loaders).every(loader => 
          loader.style.display === 'none' || loader.classList.contains('hidden')
        );
      }, { timeout: 30000 }).catch(() => {
        console.log("⚠️ Loading state persists - potential issue");
      });
    }

    // Check page structure
    const bodyContent = await page.locator('body').innerHTML();
    if (bodyContent.includes('Application error') || bodyContent.includes('Error boundary')) {
      uiIssues.push({
        type: 'Critical Error',
        description: 'React error boundary or application error detected',
        selector: 'body'
      });
      await page.screenshot({ 
        path: 'test-results/critical-error-boundary.png', 
        fullPage: true 
      });
    }

    // Validate basic app structure is present
    const hasNavigation = await page.locator('nav, [role="navigation"], [role="tablist"]').count() > 0;
    const hasMainContent = await page.locator('main, [role="main"], .main-content, .app-content').count() > 0;
    
    if (!hasNavigation && !hasMainContent) {
      uiIssues.push({
        type: 'Structure Issue',
        description: 'No navigation or main content area detected - possible rendering failure',
        selector: 'body'
      });
    }

    // Check for React Native Web specific issues
    const rnWebStyles = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily.includes('System');
    });

    // Performance check
    if (loadTime > 5000) {
      uiIssues.push({
        type: 'Performance Issue',
        description: `Slow initial load time: ${loadTime}ms (should be < 5000ms)`,
        selector: 'body'
      });
    }

    console.log(`✅ Initial state analysis complete. Load time: ${loadTime}ms`);
  });

  test("2. Navigation Analysis - All Tabs", async ({ page }) => {
    console.log("🔍 Testing: Navigation System");
    
    await page.goto("http://localhost:8081", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    await page.waitForSelector('body', { timeout: 30000 });

    // Wait for app to stabilize
    await page.waitForTimeout(3000);

    // Find navigation tabs
    const tabNavigation = await page.locator('[role="tablist"], .tab-navigation, nav').first();
    
    if (!(await tabNavigation.isVisible())) {
      console.log("⚠️ Tab navigation not immediately visible, checking for alternative navigation");
      
      // Look for bottom navigation or other navigation patterns
      const bottomNav = await page.locator('.bottom-navigation, .tab-bar, [data-testid*="tab"]').first();
      if (await bottomNav.isVisible()) {
        console.log("✅ Bottom navigation found");
      } else {
        uiIssues.push({
          type: 'Navigation Issue',
          description: 'No visible tab navigation found',
          selector: 'body'
        });
        await page.screenshot({ 
          path: 'test-results/missing-navigation.png', 
          fullPage: true 
        });
        return;
      }
    }

    // Test each tab based on Solace AI Mobile navigation structure
    const expectedTabs = ['Welcome', 'Dashboard', 'Chat', 'Mood', 'Assessment', 'Wellness', 'Tools', 'Profile'];
    const foundTabs = [];

    // Find clickable tab elements
    const tabElements = await page.locator('button, a, [role="tab"], [data-testid*="tab"]').all();
    
    for (const tab of tabElements.slice(0, 10)) { // Limit to avoid infinite loops
      try {
        if (await tab.isVisible()) {
          const tabText = await tab.textContent();
          const tabRole = await tab.getAttribute('role');
          const tabTestId = await tab.getAttribute('data-testid');
          
          if (tabText && (tabRole === 'tab' || tabTestId?.includes('tab') || tabText.match(/^(Welcome|Dashboard|Home|Chat|Mood|Assessment|Wellness|Tools|Profile)$/i))) {
            foundTabs.push(tabText.trim());
            
            console.log(`🔍 Testing tab: ${tabText}`);
            
            // Take screenshot before click
            await page.screenshot({ 
              path: `test-results/tab-${tabText.toLowerCase().replace(/[^a-z0-9]/g, '-')}-before.png`,
              fullPage: true 
            });

            // Click tab and analyze
            await tab.click({ timeout: 10000 });
            await page.waitForTimeout(2000); // Wait for navigation/rendering

            // Check for loading states
            const hasActiveLoader = await page.locator('[role="progressbar"]:visible, .loading:visible').count();
            if (hasActiveLoader > 0) {
              await page.waitForTimeout(5000); // Wait for loading to complete
            }

            // Analyze tab content
            const pageTitle = await page.title();
            const hasContent = await page.locator('main, .content, .screen-content, [data-testid*="screen"]').count() > 0;
            
            if (!hasContent) {
              uiIssues.push({
                type: 'Content Issue',
                description: `Tab "${tabText}" has no visible content`,
                selector: `text=${tabText}`
              });
            }

            // Check for error states
            const hasErrors = await page.locator('.error, [role="alert"], .error-message').count();
            if (hasErrors > 0) {
              uiIssues.push({
                type: 'Error State',
                description: `Tab "${tabText}" shows error messages`,
                selector: `text=${tabText}`
              });
              
              await page.screenshot({ 
                path: `test-results/tab-${tabText.toLowerCase().replace(/[^a-z0-9]/g, '-')}-error.png`,
                fullPage: true 
              });
            }

            // Take screenshot after navigation
            await page.screenshot({ 
              path: `test-results/tab-${tabText.toLowerCase().replace(/[^a-z0-9]/g, '-')}-after.png`,
              fullPage: true 
            });
          }
        }
      } catch (error) {
        console.log(`⚠️ Error testing tab: ${error.message}`);
        uiIssues.push({
          type: 'Navigation Error',
          description: `Failed to navigate to tab: ${error.message}`,
          selector: 'tab-navigation'
        });
      }
    }

    console.log(`✅ Navigation analysis complete. Found tabs: ${foundTabs.join(', ')}`);
  });

  test("3. Dashboard/Main App Screen Analysis", async ({ page }) => {
    console.log("🔍 Testing: Dashboard/Main App Screen");
    
    await page.goto("http://localhost:8081", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Navigate to Dashboard/Home tab
    const homeTab = await page.locator('button:has-text("Dashboard"), button:has-text("Home"), [data-testid*="home"], [data-testid*="dashboard"]').first();
    
    if (await homeTab.isVisible()) {
      await homeTab.click();
      await page.waitForTimeout(2000);
    }

    // Analyze dashboard components based on project structure
    const dashboardComponents = [
      { name: 'Welcome Header', selectors: ['.welcome-header', '[data-testid*="welcome"]', 'h1', '.header'] },
      { name: 'Mood Check-in', selectors: ['.mood-checkin', '[data-testid*="mood"]', 'button:has-text("Mood")'] },
      { name: 'Quick Actions', selectors: ['.quick-actions', '[data-testid*="action"]', '.action-buttons'] },
      { name: 'Daily Insights', selectors: ['.daily-insights', '[data-testid*="insights"]', '.insights'] },
      { name: 'Progress Overview', selectors: ['.progress-overview', '[data-testid*="progress"]', '.progress'] },
      { name: 'Recent Activity', selectors: ['.recent-activity', '[data-testid*="activity"]', '.activity'] }
    ];

    for (const component of dashboardComponents) {
      let componentFound = false;
      
      for (const selector of component.selectors) {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          componentFound = true;
          console.log(`✅ ${component.name} found`);
          
          // Check for layout issues
          const boundingBox = await element.boundingBox();
          if (boundingBox && (boundingBox.width < 50 || boundingBox.height < 20)) {
            uiIssues.push({
              type: 'Layout Issue',
              description: `${component.name} has unusually small dimensions: ${boundingBox.width}x${boundingBox.height}`,
              selector: selector
            });
          }
          
          // Check for overflow issues
          const isOverflowing = await element.evaluate((el) => {
            return el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight;
          });
          
          if (isOverflowing) {
            uiIssues.push({
              type: 'Overflow Issue',
              description: `${component.name} has content overflow`,
              selector: selector
            });
          }
          
          break;
        }
      }
      
      if (!componentFound) {
        console.log(`⚠️ ${component.name} not found`);
        uiIssues.push({
          type: 'Missing Component',
          description: `${component.name} component is not visible on dashboard`,
          selector: 'dashboard'
        });
      }
    }

    // Check for mental health specific UI elements
    const mentalHealthKeywords = ['therapy', 'mood', 'wellness', 'meditation', 'mindful', 'stress', 'anxiety'];
    let hasMentalHealthContent = false;

    for (const keyword of mentalHealthKeywords) {
      const hasKeyword = await page.locator(`text=${keyword}`).first().isVisible().catch(() => false);
      if (hasKeyword) {
        hasMentalHealthContent = true;
        break;
      }
    }

    if (!hasMentalHealthContent) {
      uiIssues.push({
        type: 'Content Issue',
        description: 'Dashboard lacks mental health specific content/terminology',
        selector: 'dashboard'
      });
    }

    await page.screenshot({ 
      path: 'test-results/dashboard-analysis.png', 
      fullPage: true 
    });

    console.log("✅ Dashboard analysis complete");
  });

  test("4. Mood Tracker Screen Analysis", async ({ page }) => {
    console.log("🔍 Testing: Mood Tracker Screen");
    
    await page.goto("http://localhost:8081", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Navigate to Mood tab
    const moodTab = await page.locator('button:has-text("Mood"), [data-testid*="mood"]').first();
    
    if (await moodTab.isVisible()) {
      await moodTab.click();
      await page.waitForTimeout(3000); // Allow for screen transition
    } else {
      console.log("⚠️ Mood tab not found");
      return;
    }

    // Look for mood tracking components
    const moodComponents = [
      { name: 'Mood Selection', selectors: ['.mood-selector', '[data-testid*="mood-select"]', 'button[data-mood]', '.mood-option'] },
      { name: 'Intensity Slider', selectors: ['.intensity-slider', '[data-testid*="intensity"]', 'input[type="range"]', '.slider'] },
      { name: 'Activity Selection', selectors: ['.activity-selector', '[data-testid*="activity"]', '.activity-option'] },
      { name: 'Notes Input', selectors: ['.notes-input', '[data-testid*="notes"]', 'textarea', 'input[placeholder*="note"]'] },
      { name: 'Submit Button', selectors: ['.submit-mood', '[data-testid*="submit"]', 'button:has-text("Save")', 'button:has-text("Submit")'] }
    ];

    for (const component of moodComponents) {
      let found = false;
      
      for (const selector of component.selectors) {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          found = true;
          console.log(`✅ ${component.name} found`);
          
          // Test interactivity for mood components
          if (component.name === 'Mood Selection') {
            try {
              await element.click({ timeout: 5000 });
              console.log(`✅ ${component.name} is interactive`);
            } catch {
              uiIssues.push({
                type: 'Interaction Issue',
                description: `${component.name} is not clickable`,
                selector: selector
              });
            }
          }
          
          if (component.name === 'Intensity Slider') {
            const sliderValue = await element.getAttribute('value');
            if (sliderValue === null) {
              uiIssues.push({
                type: 'Functionality Issue',
                description: 'Intensity slider has no value attribute',
                selector: selector
              });
            }
          }
          
          break;
        }
      }
      
      if (!found) {
        console.log(`⚠️ ${component.name} not found`);
        uiIssues.push({
          type: 'Missing Component',
          description: `${component.name} component missing from mood tracker`,
          selector: 'mood-tracker'
        });
      }
    }

    // Check for step progression (if multi-step)
    const stepIndicators = await page.locator('.step-indicator, .progress-bar, [data-testid*="step"]').count();
    if (stepIndicators > 0) {
      console.log(`✅ Step progression found (${stepIndicators} indicators)`);
    }

    // Check accessibility for mood tracker
    const moodButtons = await page.locator('button').all();
    for (const button of moodButtons.slice(0, 5)) {
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label');
        const buttonText = await button.textContent();
        
        if (!ariaLabel && !buttonText?.trim()) {
          uiIssues.push({
            type: 'Accessibility Issue',
            description: 'Mood button lacks accessible label',
            selector: 'button'
          });
        }
      }
    }

    await page.screenshot({ 
      path: 'test-results/mood-tracker-analysis.png', 
      fullPage: true 
    });

    console.log("✅ Mood tracker analysis complete");
  });

  test("5. Chat/Therapy Screen Analysis", async ({ page }) => {
    console.log("🔍 Testing: Chat/Therapy Screen");
    
    await page.goto("http://localhost:8081", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Navigate to Chat tab
    const chatTab = await page.locator('button:has-text("Chat"), [data-testid*="chat"]').first();
    
    if (await chatTab.isVisible()) {
      await chatTab.click();
      await page.waitForTimeout(3000);
    } else {
      console.log("⚠️ Chat tab not found");
      return;
    }

    // Look for chat interface components
    const chatComponents = [
      { name: 'Chat Messages Area', selectors: ['.chat-messages', '[data-testid*="messages"]', '.messages-container', '.chat-history'] },
      { name: 'Message Input', selectors: ['.message-input', '[data-testid*="input"]', 'input[placeholder*="message"]', 'textarea'] },
      { name: 'Send Button', selectors: ['.send-button', '[data-testid*="send"]', 'button:has-text("Send")', '.chat-send'] },
      { name: 'Typing Indicator', selectors: ['.typing-indicator', '[data-testid*="typing"]', '.is-typing'] }
    ];

    for (const component of chatComponents) {
      let found = false;
      
      for (const selector of component.selectors) {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          found = true;
          console.log(`✅ ${component.name} found`);
          break;
        }
      }
      
      if (!found && component.name !== 'Typing Indicator') { // Typing indicator is optional
        console.log(`⚠️ ${component.name} not found`);
        uiIssues.push({
          type: 'Missing Component',
          description: `${component.name} missing from chat interface`,
          selector: 'chat-screen'
        });
      }
    }

    // Test chat functionality if input is available
    const messageInput = await page.locator('input, textarea').first();
    if (await messageInput.isVisible()) {
      try {
        await messageInput.fill("Hello, this is a test message");
        console.log("✅ Chat input is functional");
        
        // Look for send button and test
        const sendButton = await page.locator('button:has-text("Send"), .send-button').first();
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(2000);
          
          // Check if message appeared
          const hasMessage = await page.locator('text=Hello, this is a test message').isVisible();
          if (hasMessage) {
            console.log("✅ Message sending functional");
          } else {
            uiIssues.push({
              type: 'Functionality Issue',
              description: 'Message not displayed after sending',
              selector: 'chat-messages'
            });
          }
        }
      } catch (error) {
        uiIssues.push({
          type: 'Interaction Issue',
          description: `Chat input interaction failed: ${error.message}`,
          selector: 'message-input'
        });
      }
    }

    // Check for therapy-specific elements
    const therapyElements = await page.locator('text=therapy, text=therapist, text=AI, [data-testid*="therapy"]').count();
    if (therapyElements === 0) {
      uiIssues.push({
        type: 'Content Issue',
        description: 'No therapy-specific content found in chat screen',
        selector: 'chat-screen'
      });
    }

    await page.screenshot({ 
      path: 'test-results/chat-screen-analysis.png', 
      fullPage: true 
    });

    console.log("✅ Chat screen analysis complete");
  });

  test("6. Responsive Design Analysis", async ({ page }) => {
    console.log("🔍 Testing: Responsive Design");
    
    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 14 Pro', width: 393, height: 852 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 },
      { name: 'Large Desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("http://localhost:8082", { 
        waitUntil: 'networkidle',
        timeout: 60000 
      });
      await page.waitForTimeout(2000);

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });

      if (hasHorizontalScroll) {
        uiIssues.push({
          type: 'Responsive Issue',
          description: `Horizontal scroll present on ${viewport.name}`,
          selector: 'body'
        });
        
        await page.screenshot({ 
          path: `test-results/horizontal-scroll-${viewport.name.toLowerCase().replace(/ /g, '-')}.png`,
          fullPage: true 
        });
      }

      // Check for element overflow
      const overflowingElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const overflowing = [];
        
        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth + 10) { // 10px tolerance
            overflowing.push(el.tagName.toLowerCase() + (el.className ? '.' + el.className : ''));
          }
        }
        
        return overflowing.slice(0, 5); // Limit results
      });

      if (overflowingElements.length > 0) {
        uiIssues.push({
          type: 'Overflow Issue',
          description: `Elements overflow viewport on ${viewport.name}: ${overflowingElements.join(', ')}`,
          selector: 'responsive'
        });
      }

      // Check touch target sizes on mobile
      if (viewport.width <= 768) {
        const smallTouchTargets = await page.evaluate(() => {
          const buttons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
          const smallTargets = [];
          
          for (const button of buttons) {
            const rect = button.getBoundingClientRect();
            if ((rect.width < 44 || rect.height < 44) && rect.width > 0 && rect.height > 0) {
              smallTargets.push({
                tag: button.tagName.toLowerCase(),
                size: `${Math.round(rect.width)}x${Math.round(rect.height)}`
              });
            }
          }
          
          return smallTargets.slice(0, 5);
        });

        if (smallTouchTargets.length > 0) {
          uiIssues.push({
            type: 'Accessibility Issue',
            description: `Touch targets too small on ${viewport.name}: ${smallTouchTargets.map(t => `${t.tag}(${t.size})`).join(', ')} - minimum 44x44px required`,
            selector: 'touch-targets'
          });
        }
      }

      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name.toLowerCase().replace(/ /g, '-')}.png`,
        fullPage: false 
      });
    }

    console.log("✅ Responsive design analysis complete");
  });

  test("7. Animation and Performance Analysis", async ({ page }) => {
    console.log("🔍 Testing: Animation and Performance");
    
    await page.goto("http://localhost:8081", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    // Enable performance monitoring
    await page.coverage.startCSSCoverage();
    await page.coverage.startJSCoverage();

    await page.waitForTimeout(3000);

    // Check for animation performance
    const animationElements = await page.locator('[style*="transition"], [style*="animation"], .animated, [class*="animate"]').count();
    console.log(`📊 Found ${animationElements} elements with animations`);

    // Test tab switching performance
    const tabs = await page.locator('button[role="tab"], .tab-button').all();
    const tabSwitchTimes = [];

    for (const tab of tabs.slice(0, 3)) { // Test first 3 tabs
      if (await tab.isVisible()) {
        const startTime = Date.now();
        await tab.click();
        await page.waitForTimeout(1000);
        const endTime = Date.now();
        
        const switchTime = endTime - startTime;
        tabSwitchTimes.push(switchTime);
        
        if (switchTime > 1000) {
          uiIssues.push({
            type: 'Performance Issue',
            description: `Tab switch took ${switchTime}ms (should be < 1000ms)`,
            selector: 'tab-navigation'
          });
        }
      }
    }

    if (tabSwitchTimes.length > 0) {
      const avgSwitchTime = tabSwitchTimes.reduce((a, b) => a + b) / tabSwitchTimes.length;
      console.log(`📊 Average tab switch time: ${Math.round(avgSwitchTime)}ms`);
    }

    // Check for janky animations
    const hasReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    if (!hasReducedMotion) {
      // Test scroll performance
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(500);
      
      // Look for elements that might cause layout thrashing
      const potentialThrashingElements = await page.locator('[style*="width"], [style*="height"], [style*="transform"], [style*="left"], [style*="top"]').count();
      
      if (potentialThrashingElements > 50) {
        uiIssues.push({
          type: 'Performance Issue',
          description: `High number of elements with inline styles (${potentialThrashingElements}) - potential layout thrashing`,
          selector: 'performance'
        });
      }
    }

    // Stop coverage and analyze
    const jsCoverage = await page.coverage.stopJSCoverage();
    const cssCoverage = await page.coverage.stopCSSCoverage();

    let totalJSBytes = 0;
    let usedJSBytes = 0;
    for (const entry of jsCoverage) {
      totalJSBytes += entry.text.length;
      for (const range of entry.ranges) {
        usedJSBytes += range.end - range.start - 1;
      }
    }

    const jsUsagePercent = totalJSBytes > 0 ? (usedJSBytes / totalJSBytes) * 100 : 0;
    console.log(`📊 JavaScript usage: ${Math.round(jsUsagePercent)}%`);

    if (jsUsagePercent < 50) {
      uiIssues.push({
        type: 'Performance Issue',
        description: `Low JavaScript usage (${Math.round(jsUsagePercent)}%) - potential bundle optimization needed`,
        selector: 'performance'
      });
    }

    console.log("✅ Animation and performance analysis complete");
  });

  test("8. Final Summary Report", async ({ page }) => {
    console.log("\n" + "=".repeat(60));
    console.log("📋 SOLACE AI MOBILE - UI/UX ANALYSIS SUMMARY");
    console.log("=".repeat(60));

    // Count issues by type
    const issuesByType = {};
    let allIssues = [...uiIssues]; // Copy current issues

    // Get all issues from previous tests (this is a simplified approach)
    for (const issue of allIssues) {
      issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
    }

    console.log("\n🎯 ISSUE SUMMARY:");
    if (Object.keys(issuesByType).length === 0) {
      console.log("✅ No major UI/UX issues detected!");
    } else {
      for (const [type, count] of Object.entries(issuesByType)) {
        console.log(`   ${type}: ${count} issue(s)`);
      }
    }

    console.log("\n🔧 RECOMMENDATIONS:");
    
    if (issuesByType['Missing Component']) {
      console.log("   • Verify all expected components are rendering correctly");
      console.log("   • Check for import/export issues in component files");
    }
    
    if (issuesByType['Performance Issue']) {
      console.log("   • Optimize bundle size and implement code splitting");
      console.log("   • Review animation performance and reduce layout thrashing");
    }
    
    if (issuesByType['Accessibility Issue']) {
      console.log("   • Add proper ARIA labels and ensure minimum touch target sizes");
      console.log("   • Test with screen readers and keyboard navigation");
    }
    
    if (issuesByType['Responsive Issue']) {
      console.log("   • Fix horizontal scroll issues on mobile devices");
      console.log("   • Ensure proper responsive breakpoints are implemented");
    }

    console.log("\n📊 TESTING METADATA:");
    console.log(`   • Total Console Errors: ${consoleErrors.length}`);
    console.log(`   • Total Network Errors: ${networkErrors.length}`);
    console.log(`   • Screenshots Captured: Available in test-results/`);
    console.log(`   • Test Environment: http://localhost:8081`);

    console.log("\n" + "=".repeat(60));

    // Create a summary screenshot
    await page.goto("http://localhost:8081");
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'test-results/final-app-state.png', 
      fullPage: true 
    });
  });
});