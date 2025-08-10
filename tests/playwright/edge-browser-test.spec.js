const { test, expect, chromium } = require('@playwright/test');

test.describe('Solace AI Mobile - Edge Browser Testing', () => {
  let browser;
  let context;
  let page;

  test.beforeAll(async () => {
    // Launch Edge browser specifically
    browser = await chromium.launch({
      channel: 'msedge',
      headless: false,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await context.close();
    await browser.close();
  });

  test('Should load Solace AI Mobile app on localhost:8082 in Edge', async () => {
    console.log('🔄 Testing localhost:8082 in Microsoft Edge...');
    
    try {
      // Navigate to localhost:8082 with extended timeout
      await page.goto('http://localhost:8082', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      console.log('✅ Successfully navigated to localhost:8082');
      
      // Wait for React app to load
      await page.waitForTimeout(5000);
      
      // Take screenshot of current state
      await page.screenshot({ 
        path: 'test-results/edge-initial-load.png',
        fullPage: true 
      });
      
      // Check if page loaded properly
      const title = await page.title();
      console.log(`📄 Page title: ${title}`);
      
      // Check for React root element
      const reactRoot = await page.$('#root');
      if (reactRoot) {
        console.log('✅ React root element found');
      } else {
        console.log('❌ React root element not found');
      }
      
      // Check for any visible content
      const bodyContent = await page.$eval('body', el => el.innerText);
      console.log(`📝 Page content length: ${bodyContent.length} characters`);
      
      // Look for Solace AI specific elements
      const solaceElements = await page.$$('*[id*="solace"], *[class*="solace"], *[id*="Solace"], *[class*="Solace"]');
      console.log(`🎯 Found ${solaceElements.length} Solace-related elements`);
      
      // Check for navigation elements
      const navElements = await page.$$('nav, *[role="navigation"], *[class*="tab"], *[class*="navigation"]');
      console.log(`🧭 Found ${navElements.length} navigation elements`);
      
      // Check console for errors
      const logs = [];
      page.on('console', message => {
        if (message.type() === 'error') {
          logs.push(`❌ Console Error: ${message.text()}`);
        }
      });
      
      // Wait a bit more for any console errors to appear
      await page.waitForTimeout(3000);
      
      if (logs.length > 0) {
        console.log('🚨 Console Errors Found:');
        logs.forEach(log => console.log(log));
      } else {
        console.log('✅ No console errors detected');
      }
      
      // Check if Metro bundler is working (look for bundled modules)
      const scripts = await page.$$('script[src]');
      console.log(`📦 Found ${scripts.length} script tags`);
      
      for (let script of scripts) {
        const src = await script.getAttribute('src');
        if (src && src.includes('bundle')) {
          console.log(`📦 Bundle found: ${src}`);
        }
      }
      
      // Final screenshot
      await page.screenshot({ 
        path: 'test-results/edge-final-state.png',
        fullPage: true 
      });
      
      console.log('🎯 Edge browser test completed');
      
    } catch (error) {
      console.error('💥 Test failed:', error.message);
      
      // Take error screenshot
      await page.screenshot({ 
        path: 'test-results/edge-error-state.png',
        fullPage: true 
      });
      
      throw error;
    }
  });

  test('Should test React app functionality in Edge', async () => {
    console.log('🔄 Testing React app functionality...');
    
    try {
      await page.goto('http://localhost:8082', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for React to potentially render
      await page.waitForTimeout(8000);
      
      // Check if we can find React components
      const reactComponents = await page.evaluate(() => {
        // Look for common React component patterns
        const elements = document.querySelectorAll('*[data-reactroot], *[class*="react"], div[id="root"] > div');
        return elements.length;
      });
      
      console.log(`⚛️ Found ${reactComponents} potential React components`);
      
      // Look for mental health app specific content
      const mentalHealthKeywords = ['mood', 'therapy', 'mental', 'wellness', 'solace'];
      let foundKeywords = [];
      
      for (let keyword of mentalHealthKeywords) {
        try {
          const element = await page.$(`text=${keyword}`);
          if (element) {
            foundKeywords.push(keyword);
          }
        } catch (e) {
          // Keyword not found, continue
        }
      }
      
      console.log(`🧠 Found mental health keywords: ${foundKeywords.join(', ')}`);
      
      // Check for interactive elements
      const buttons = await page.$$('button');
      const inputs = await page.$$('input');
      const links = await page.$$('a');
      
      console.log(`🎛️ Interactive elements found: ${buttons.length} buttons, ${inputs.length} inputs, ${links.length} links`);
      
      // Try to find tab navigation
      try {
        const tabs = await page.$$('*[role="tab"], *[class*="tab"]');
        console.log(`📑 Found ${tabs.length} potential tab elements`);
        
        if (tabs.length > 0) {
          console.log('✅ Tab navigation appears to be present');
        }
      } catch (e) {
        console.log('ℹ️ No tab navigation detected');
      }
      
      // Final functionality screenshot
      await page.screenshot({ 
        path: 'test-results/edge-functionality-test.png',
        fullPage: true 
      });
      
    } catch (error) {
      console.error('💥 Functionality test failed:', error.message);
      throw error;
    }
  });
});