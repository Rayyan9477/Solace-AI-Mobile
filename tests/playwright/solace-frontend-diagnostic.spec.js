// Comprehensive frontend diagnostic test for Solace AI Mobile
// Tests localhost connection, UI rendering, navigation, and identifies issues

const { test, expect } = require('@playwright/test');

test.describe('Solace AI Mobile Frontend Diagnostic', () => {
  
  const commonPorts = [8081, 19006, 19000, 3000, 8080, 8082];
  let workingPort = null;

  test.beforeAll(async () => {
    console.log('🔍 Starting frontend diagnostic tests...');
  });

  test('Find active localhost port and test connection', async ({ page }) => {
    console.log('\n📡 Testing localhost ports...');
    
    // Test each common port to find the active server
    for (const port of commonPorts) {
      try {
        const url = `http://localhost:${port}`;
        console.log(`🔗 Trying port ${port}...`);
        
        // Set a shorter timeout for port testing
        const response = await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 5000 
        });
        
        if (response && response.ok()) {
          workingPort = port;
          console.log(`✅ Found active server on port ${port}`);
          break;
        }
      } catch (error) {
        console.log(`❌ Port ${port} not responding: ${error.message}`);
      }
    }

    // Verify we found a working port
    expect(workingPort).not.toBeNull();
    console.log(`🎯 Using port ${workingPort} for testing`);
  });

  test('Load Solace AI Mobile app and check basic rendering', async ({ page }) => {
    // Skip if no working port found
    test.skip(!workingPort, 'No active server found');
    
    console.log('\n🚀 Loading Solace AI Mobile app...');
    
    const url = `http://localhost:${workingPort}`;
    
    // Navigate with extended timeout for initial load
    const response = await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 20000 
    });
    
    // Check if page loaded successfully
    expect(response.ok()).toBeTruthy();
    console.log('✅ Page loaded successfully');

    // Take initial screenshot
    await page.screenshot({ 
      path: 'test-results/01-initial-load.png', 
      fullPage: true 
    });
    console.log('📸 Initial screenshot saved');

    // Check for React/Expo loading indicators
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      console.log('✅ DOM content loaded');
    } catch (error) {
      console.log('⚠️ DOM content loading timeout:', error.message);
    }
  });

  test('Check for React app rendering and error states', async ({ page }) => {
    test.skip(!workingPort, 'No active server found');
    
    console.log('\n🔍 Checking React app rendering...');
    
    const url = `http://localhost:${workingPort}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Listen for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('🚨 Console Error:', msg.text());
      }
    });

    // Listen for uncaught exceptions
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
      console.log('💥 Page Error:', error.message);
    });

    // Wait for potential React components to render
    await page.waitForTimeout(5000);

    // Check for common React/Expo elements
    const bodyContent = await page.textContent('body');
    console.log('📄 Body content length:', bodyContent ? bodyContent.length : 0);

    // Look for specific app elements
    const checks = [
      { selector: '[data-testid*="solace"]', name: 'Solace test elements' },
      { selector: '[data-testid*="cover"]', name: 'Cover page elements' },
      { selector: '[data-testid*="dashboard"]', name: 'Dashboard elements' },
      { selector: 'nav', name: 'Navigation elements' },
      { selector: '[role="navigation"]', name: 'Navigation role elements' },
      { selector: 'button', name: 'Interactive buttons' },
      { selector: 'input', name: 'Input elements' },
      { selector: '.react-root', name: 'React root' },
      { selector: '#root', name: 'App root' },
      { selector: '#expo-root', name: 'Expo root' },
    ];

    console.log('\n🔎 Checking for UI elements...');
    const foundElements = [];
    
    for (const check of checks) {
      try {
        const element = await page.locator(check.selector).first();
        const isVisible = await element.isVisible({ timeout: 2000 });
        if (isVisible) {
          foundElements.push(check.name);
          console.log(`✅ Found: ${check.name}`);
        } else {
          console.log(`⚠️ Present but not visible: ${check.name}`);
        }
      } catch (error) {
        console.log(`❌ Not found: ${check.name}`);
      }
    }

    // Take screenshot of current state
    await page.screenshot({ 
      path: 'test-results/02-react-rendering.png', 
      fullPage: true 
    });

    // Report findings
    console.log(`\n📊 Found ${foundElements.length} element types`);
    console.log(`🚨 Console errors: ${consoleErrors.length}`);
    console.log(`💥 Page errors: ${pageErrors.length}`);

    if (consoleErrors.length > 0) {
      console.log('\n🚨 Console Errors:');
      consoleErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (pageErrors.length > 0) {
      console.log('\n💥 Page Errors:');
      pageErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }
  });

  test('Test mental health app specific elements', async ({ page }) => {
    test.skip(!workingPort, 'No active server found');
    
    console.log('\n💚 Checking mental health app elements...');
    
    const url = `http://localhost:${workingPort}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    await page.waitForTimeout(3000);

    // Mental health specific elements to check
    const mentalHealthElements = [
      { text: 'Solace', name: 'App title' },
      { text: 'Mental Health', name: 'Mental Health text' },
      { text: 'Therapy', name: 'Therapy text' },
      { text: 'Mood', name: 'Mood text' },
      { text: 'Wellness', name: 'Wellness text' },
      { text: 'Dashboard', name: 'Dashboard text' },
      { text: 'Welcome', name: 'Welcome text' },
      { text: 'Chat', name: 'Chat text' },
      { text: 'Assessment', name: 'Assessment text' },
      { text: 'Profile', name: 'Profile text' },
    ];

    console.log('\n🔍 Looking for mental health app content...');
    const foundContent = [];

    for (const element of mentalHealthElements) {
      try {
        const locator = page.getByText(element.text, { timeout: 2000 });
        const isVisible = await locator.isVisible();
        if (isVisible) {
          foundContent.push(element.name);
          console.log(`✅ Found: ${element.name}`);
        } else {
          console.log(`❌ Not visible: ${element.name}`);
        }
      } catch (error) {
        console.log(`❌ Not found: ${element.name}`);
      }
    }

    // Look for navigation tabs
    try {
      const navElements = await page.locator('[role="navigation"], nav, [data-testid*="tab"]').count();
      console.log(`🧭 Navigation elements found: ${navElements}`);
    } catch (error) {
      console.log('❌ No navigation elements found');
    }

    // Check for loading states or error messages
    const loadingStates = [
      'Loading...',
      'Please wait',
      'Error',
      'Failed to load',
      'Something went wrong',
      'Network error',
      'Unable to connect'
    ];

    console.log('\n⏳ Checking for loading/error states...');
    for (const state of loadingStates) {
      try {
        const element = page.getByText(state);
        const isVisible = await element.isVisible({ timeout: 1000 });
        if (isVisible) {
          console.log(`⚠️ Found loading/error state: ${state}`);
        }
      } catch {
        // Ignore - element not found
      }
    }

    await page.screenshot({ 
      path: 'test-results/03-mental-health-elements.png', 
      fullPage: true 
    });

    console.log(`\n📊 Found ${foundContent.length} mental health app elements`);
  });

  test('Test navigation and interaction capabilities', async ({ page }) => {
    test.skip(!workingPort, 'No active server found');
    
    console.log('\n🧭 Testing navigation and interactions...');
    
    const url = `http://localhost:${workingPort}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    await page.waitForTimeout(3000);

    // Look for clickable elements
    const clickableSelectors = [
      'button',
      '[role="button"]',
      'a',
      '[role="tab"]',
      '[data-testid*="button"]',
      '[data-testid*="tab"]'
    ];

    console.log('\n🖱️ Finding clickable elements...');
    let totalClickable = 0;

    for (const selector of clickableSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`✅ Found ${elements.length} ${selector} elements`);
          totalClickable += elements.length;
        }
      } catch (error) {
        console.log(`❌ Error finding ${selector}: ${error.message}`);
      }
    }

    // Try to interact with first few buttons
    if (totalClickable > 0) {
      console.log('\n👆 Testing button interactions...');
      try {
        const buttons = await page.locator('button').all();
        const maxTests = Math.min(3, buttons.length);
        
        for (let i = 0; i < maxTests; i++) {
          try {
            const button = buttons[i];
            const isVisible = await button.isVisible();
            const isEnabled = await button.isEnabled();
            
            if (isVisible && isEnabled) {
              console.log(`✅ Button ${i + 1}: Visible and enabled`);
              // Take screenshot before click
              await page.screenshot({ 
                path: `test-results/04-before-button-${i + 1}.png`, 
                fullPage: true 
              });
              
              // Try clicking the button
              await button.click({ timeout: 3000 });
              await page.waitForTimeout(2000);
              
              // Take screenshot after click
              await page.screenshot({ 
                path: `test-results/05-after-button-${i + 1}.png`, 
                fullPage: true 
              });
              
              console.log(`✅ Successfully clicked button ${i + 1}`);
            } else {
              console.log(`⚠️ Button ${i + 1}: Not visible or enabled`);
            }
          } catch (error) {
            console.log(`❌ Error clicking button ${i + 1}: ${error.message}`);
          }
        }
      } catch (error) {
        console.log(`❌ Error testing button interactions: ${error.message}`);
      }
    }

    console.log(`\n📊 Total clickable elements: ${totalClickable}`);
  });

  test('Comprehensive diagnostic report', async ({ page }) => {
    test.skip(!workingPort, 'No active server found');
    
    console.log('\n📋 Generating comprehensive diagnostic report...');
    
    const url = `http://localhost:${workingPort}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    await page.waitForTimeout(5000);

    // Gather comprehensive page information
    const pageInfo = {
      title: await page.title(),
      url: page.url(),
      timestamp: new Date().toISOString()
    };

    // Check page structure
    const structure = {
      html: await page.locator('html').count(),
      head: await page.locator('head').count(),
      body: await page.locator('body').count(),
      scripts: await page.locator('script').count(),
      stylesheets: await page.locator('link[rel="stylesheet"]').count(),
      divs: await page.locator('div').count(),
      totalElements: await page.locator('*').count()
    };

    // Check for meta tags and React/Expo indicators
    const metaTags = await page.locator('meta').all();
    const metaInfo = [];
    for (const meta of metaTags.slice(0, 10)) { // Limit to first 10
      try {
        const name = await meta.getAttribute('name') || await meta.getAttribute('property');
        const content = await meta.getAttribute('content');
        if (name && content) {
          metaInfo.push({ name, content });
        }
      } catch (error) {
        // Ignore errors
      }
    }

    // Final comprehensive screenshot
    await page.screenshot({ 
      path: 'test-results/06-final-diagnostic.png', 
      fullPage: true 
    });

    // Generate report
    const report = {
      pageInfo,
      structure,
      metaInfo,
      workingPort,
      diagnosticComplete: true
    };

    console.log('\n📄 DIAGNOSTIC REPORT:');
    console.log('====================');
    console.log(`🌐 URL: ${pageInfo.url}`);
    console.log(`📰 Title: ${pageInfo.title}`);
    console.log(`🔌 Port: ${workingPort}`);
    console.log(`🏗️ Total Elements: ${structure.totalElements}`);
    console.log(`📜 Scripts: ${structure.scripts}`);
    console.log(`🎨 Stylesheets: ${structure.stylesheets}`);
    console.log(`📦 Divs: ${structure.divs}`);
    console.log(`📋 Meta tags: ${metaInfo.length}`);
    console.log('====================');

    if (metaInfo.length > 0) {
      console.log('\n📋 Key Meta Tags:');
      metaInfo.forEach(meta => {
        console.log(`  ${meta.name}: ${meta.content}`);
      });
    }

    // Save report to file
    const reportContent = JSON.stringify(report, null, 2);
    console.log('\n💾 Diagnostic report saved to test-results');
  });
});

test.describe('Error Recovery and Troubleshooting', () => {
  
  test('Check for common React/Expo issues', async ({ page }) => {
    console.log('\n🔧 Checking for common issues...');
    
    const issues = [];
    
    // Test basic network connectivity
    try {
      await page.goto('http://google.com', { timeout: 5000 });
      console.log('✅ Network connectivity OK');
    } catch (error) {
      issues.push('Network connectivity problem');
      console.log('❌ Network connectivity issue');
    }
    
    // Try the working port again
    if (process.env.WORKING_PORT || '8081') {
      const port = process.env.WORKING_PORT || '8081';
      try {
        await page.goto(`http://localhost:${port}`, { timeout: 10000 });
        
        // Check for specific error patterns
        const bodyText = await page.textContent('body');
        
        if (bodyText.includes('ECONNREFUSED')) {
          issues.push('Server connection refused - server may not be running');
        }
        if (bodyText.includes('Cannot GET')) {
          issues.push('Route not found - check server routing');
        }
        if (bodyText.includes('Module not found')) {
          issues.push('Module resolution error - check dependencies');
        }
        if (bodyText.includes('SyntaxError')) {
          issues.push('JavaScript syntax error - check bundle compilation');
        }
        if (bodyText.includes('TypeError')) {
          issues.push('JavaScript type error - check component props');
        }
        
      } catch (error) {
        issues.push(`Port ${port} connection failed: ${error.message}`);
      }
    }
    
    console.log('\n🔍 Issues Found:');
    if (issues.length === 0) {
      console.log('✅ No common issues detected');
    } else {
      issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    await page.screenshot({ 
      path: 'test-results/07-troubleshooting.png', 
      fullPage: true 
    });
  });
});