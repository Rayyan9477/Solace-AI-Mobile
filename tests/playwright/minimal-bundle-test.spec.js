// Minimal test to isolate bundle loading issues
const { test, expect } = require('@playwright/test');

test.describe('Minimal Bundle Test', () => {

  test('Check bundle compilation with minimal error catching', async ({ page }) => {
    console.log('\n🔍 Testing minimal bundle loading...');
    
    const jsErrors = [];
    
    // Capture errors with more detail
    page.on('pageerror', error => {
      jsErrors.push({
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      console.log(`❌ JS Error: ${error.message}`);
      // Log first few lines of stack trace
      if (error.stack) {
        const stackLines = error.stack.split('\n').slice(0, 5);
        stackLines.forEach(line => console.log(`   ${line}`));
      }
    });
    
    // Navigate
    await page.goto('http://localhost:8081', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // Wait for bundle to load
    await page.waitForTimeout(5000);
    
    // Check if this was an import error by looking at the bundle size
    const htmlContent = await page.content();
    console.log(`HTML length: ${htmlContent.length}`);
    
    // Check if any React components rendered
    const rootContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML.length : 0;
    });
    
    console.log(`Root content length: ${rootContent}`);
    
    // Try to access the bundle and look for error patterns
    try {
      const bundleUrl = 'http://localhost:8081/node_modules/expo/AppEntry.bundle?platform=web&dev=true&hot=false&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable';
      const bundleResponse = await page.goto(bundleUrl);
      const bundleText = await bundleResponse.text();
      
      // Look for the specific "theme is not defined" error in the bundle
      const themeErrorMatch = bundleText.match(/theme\s+is\s+not\s+defined/gi);
      if (themeErrorMatch) {
        console.log('✅ Found "theme is not defined" in bundle');
      }
      
      // Look for the context around the error
      const lines = bundleText.split('\n');
      let foundErrorContext = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('theme is not defined') || lines[i].includes('ReferenceError')) {
          foundErrorContext = true;
          console.log(`\n🔍 Error context around line ${i + 1}:`);
          // Show 5 lines before and after the error
          const start = Math.max(0, i - 5);
          const end = Math.min(lines.length, i + 5);
          
          for (let j = start; j < end; j++) {
            const prefix = j === i ? '>>> ' : '    ';
            console.log(`${prefix}${j + 1}: ${lines[j].slice(0, 100)}...`);
          }
          break;
        }
      }
      
      if (!foundErrorContext) {
        // Look for where theme is used without being defined
        const themeReferences = bundleText.match(/[^a-zA-Z_]theme[^a-zA-Z_.]/g);
        if (themeReferences) {
          console.log(`Found ${themeReferences.length} theme references in bundle`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Could not analyze bundle: ${error.message}`);
    }
    
    // Return to main page
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(2000);
    
    console.log(`\n📊 Summary:`);
    console.log(`- JavaScript errors: ${jsErrors.length}`);
    console.log(`- React components rendered: ${rootContent > 0}`);
    
    if (jsErrors.length > 0) {
      console.log('\n🚨 Errors found:');
      jsErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.name}: ${error.message}`);
      });
    }
  });

});