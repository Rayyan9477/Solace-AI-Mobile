const { test, expect, chromium } = require('@playwright/test');

test.use({
  // Force Edge browser only
  browserName: 'chromium',
  channel: 'msedge'
});

test.describe('Solace AI Mobile - Simple Edge Test', () => {
  test('Should load and test the app in Edge browser', async ({ page }) => {
    console.log('🔄 Testing Solace AI Mobile in Microsoft Edge...');
    
    try {
      // Navigate to localhost:8082
      console.log('📡 Connecting to http://localhost:8082...');
      await page.goto('http://localhost:8082', { 
        waitUntil: 'domcontentloaded',
        timeout: 20000 
      });
      
      console.log('✅ Successfully loaded localhost:8082');
      
      // Wait for React app to initialize
      await page.waitForTimeout(5000);
      
      // Take initial screenshot
      await page.screenshot({ 
        path: 'edge-app-loaded.png',
        fullPage: true 
      });
      console.log('📸 Screenshot saved: edge-app-loaded.png');
      
      // Get page title
      const title = await page.title();
      console.log(`📄 Page title: "${title}"`);
      
      // Check for React root
      const reactRoot = await page.$('#root');
      console.log(`⚛️ React root element: ${reactRoot ? '✅ Found' : '❌ Not found'}`);
      
      // Get page content stats
      const bodyText = await page.$eval('body', el => el.innerText);
      console.log(`📝 Page content: ${bodyText.length} characters`);
      
      // Look for mental health app indicators
      const pageContent = await page.content();
      const keywords = ['solace', 'mood', 'therapy', 'mental', 'wellness'];
      const foundKeywords = keywords.filter(keyword => 
        pageContent.toLowerCase().includes(keyword.toLowerCase())
      );
      console.log(`🧠 Mental health keywords found: [${foundKeywords.join(', ')}]`);
      
      // Check for navigation elements
      const navElements = await page.$$('nav, *[role="navigation"], *[class*="tab"]');
      console.log(`🧭 Navigation elements: ${navElements.length} found`);
      
      // Check for buttons and interactive elements
      const buttons = await page.$$('button');
      const inputs = await page.$$('input');
      console.log(`🎛️ Interactive elements: ${buttons.length} buttons, ${inputs.length} inputs`);
      
      // Look for specific Solace components
      const solaceSelectors = [
        '*[class*="solace"]',
        '*[id*="solace"]',
        '*[class*="mood"]',
        '*[class*="dashboard"]',
        '*[class*="therapy"]'
      ];
      
      let componentsFound = 0;
      for (let selector of solaceSelectors) {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          componentsFound += elements.length;
          console.log(`🎯 Found ${elements.length} elements matching "${selector}"`);
        }
      }
      console.log(`📊 Total Solace components found: ${componentsFound}`);
      
      // Check console for any errors
      const consoleMessages = [];
      page.on('console', message => {
        consoleMessages.push(`${message.type()}: ${message.text()}`);
      });
      
      // Wait a bit for console messages
      await page.waitForTimeout(3000);
      
      if (consoleMessages.length > 0) {
        console.log('📋 Console messages:');
        consoleMessages.forEach(msg => console.log(`  ${msg}`));
      }
      
      // Try clicking elements if they exist
      try {
        const firstButton = await page.$('button');
        if (firstButton) {
          const buttonText = await firstButton.textContent();
          console.log(`🖱️ Found clickable button: "${buttonText}"`);
          
          // Take screenshot before clicking
          await page.screenshot({ 
            path: 'edge-before-interaction.png',
            fullPage: true 
          });
          
          // Click the button
          await firstButton.click();
          await page.waitForTimeout(2000);
          
          // Take screenshot after clicking
          await page.screenshot({ 
            path: 'edge-after-interaction.png',
            fullPage: true 
          });
          console.log('🖱️ Button clicked successfully');
        }
      } catch (e) {
        console.log('ℹ️ No interactive elements to test');
      }
      
      // Final assessment
      console.log('\n🎯 FINAL ASSESSMENT:');
      console.log(`✅ Server responsive: YES`);
      console.log(`✅ Page loads: YES`);
      console.log(`✅ React app: ${reactRoot ? 'YES' : 'NO'}`);
      console.log(`✅ Content present: ${bodyText.length > 100 ? 'YES' : 'NO'}`);
      console.log(`✅ Mental health keywords: ${foundKeywords.length > 0 ? 'YES' : 'NO'}`);
      console.log(`✅ Interactive elements: ${buttons.length > 0 ? 'YES' : 'NO'}`);
      console.log(`✅ App components: ${componentsFound > 0 ? 'YES' : 'NO'}`);
      
      const isWorkingApp = reactRoot && bodyText.length > 100 && foundKeywords.length > 0;
      console.log(`\n🎉 APP STATUS: ${isWorkingApp ? '✅ WORKING' : '❌ NEEDS FIXES'}`);
      
    } catch (error) {
      console.error('💥 Test failed:', error.message);
      
      // Take error screenshot
      await page.screenshot({ 
        path: 'edge-error.png',
        fullPage: true 
      });
      
      throw error;
    }
  });
});