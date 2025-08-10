// Comprehensive error detection for React/Expo bundle issues
const { test, expect } = require('@playwright/test');

test.describe('Comprehensive Error Detection', () => {

  test('Deep error analysis with bundle inspection', async ({ page }) => {
    console.log('\n🔍 Starting deep error analysis...');
    
    const allErrors = [];
    const networkRequests = [];
    
    // Capture ALL console messages including warnings
    page.on('console', msg => {
      const msgInfo = {
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
        timestamp: new Date().toISOString()
      };
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
      if (['error', 'warning'].includes(msg.type())) {
        allErrors.push(msgInfo);
      }
    });
    
    // Capture page errors
    page.on('pageerror', error => {
      const errorInfo = {
        type: 'pageerror',
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString()
      };
      allErrors.push(errorInfo);
      console.log(`[PAGEERROR] ${error.message}`);
      if (error.stack) {
        console.log(`Stack: ${error.stack.slice(0, 200)}...`);
      }
    });
    
    // Capture network activity
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        type: 'request'
      });
    });
    
    page.on('response', response => {
      networkRequests.push({
        url: response.url(),
        status: response.status(),
        type: 'response'
      });
    });
    
    // Navigate and wait
    console.log('\n📡 Loading page with comprehensive monitoring...');
    try {
      await page.goto('http://localhost:8081', { 
        waitUntil: 'networkidle',
        timeout: 20000 
      });
      console.log('✅ Page navigation completed');
    } catch (error) {
      console.log('❌ Page navigation error:', error.message);
    }
    
    // Wait longer for any async errors
    await page.waitForTimeout(10000);
    
    // Check the actual HTML content
    const htmlContent = await page.content();
    console.log(`\n📄 HTML Analysis:`);
    console.log(`- HTML length: ${htmlContent.length}`);
    console.log(`- Contains React root: ${htmlContent.includes('id="root"')}`);
    console.log(`- Contains Expo root: ${htmlContent.includes('id="expo-root"')}`);
    console.log(`- Contains scripts: ${(htmlContent.match(/<script/g) || []).length}`);
    
    // Try to access the bundle directly and check its content
    console.log('\n🔍 Bundle Analysis:');
    try {
      const bundleResponse = await page.goto('http://localhost:8081/node_modules/expo/AppEntry.bundle?platform=web&dev=true&hot=false&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable');
      const bundleContent = await bundleResponse.text();
      
      console.log(`- Bundle size: ${bundleContent.length} characters`);
      console.log(`- Contains exports: ${bundleContent.includes('exports')}`);
      console.log(`- Contains require: ${bundleContent.includes('require')}`);
      console.log(`- Contains React: ${bundleContent.includes('React')}`);
      console.log(`- Contains App: ${bundleContent.includes('App')}`);
      console.log(`- Contains theme: ${bundleContent.includes('theme')}`);
      console.log(`- Contains UnifiedThemeProvider: ${bundleContent.includes('UnifiedThemeProvider')}`);
      console.log(`- Contains ThemeProvider: ${bundleContent.includes('ThemeProvider')}`);
      
      // Check for common error patterns in bundle
      const errorPatterns = [
        'SyntaxError',
        'ReferenceError',  
        'TypeError',
        'Module not found',
        'Cannot resolve',
        'Unexpected token',
        'is not defined'
      ];
      
      errorPatterns.forEach(pattern => {
        if (bundleContent.includes(pattern)) {
          console.log(`⚠️ Bundle contains error pattern: ${pattern}`);
        }
      });
      
    } catch (error) {
      console.log('❌ Could not access bundle:', error.message);
    }
    
    // Return to main page for final checks
    await page.goto('http://localhost:8081');
    await page.waitForTimeout(5000);
    
    // Check JavaScript execution environment
    const jsEnvironment = await page.evaluate(() => {
      return {
        hasWindow: typeof window !== 'undefined',
        hasDocument: typeof document !== 'undefined',
        hasReact: typeof window.React !== 'undefined',
        hasExpo: typeof window.Expo !== 'undefined',
        bodyChildren: document.body ? document.body.children.length : 0,
        rootElement: document.getElementById('root') ? 'found' : 'not found',
        expoRoot: document.getElementById('expo-root') ? 'found' : 'not found',
        globalErrors: window.errors || [],
        globalTheme: typeof theme !== 'undefined' ? 'defined' : 'undefined'
      };
    });
    
    console.log('\n🧪 JavaScript Environment:');
    Object.entries(jsEnvironment).forEach(([key, value]) => {
      console.log(`- ${key}: ${value}`);
    });
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'test-results/comprehensive-error-analysis.png', 
      fullPage: true 
    });
    
    // Generate final report
    console.log('\n📊 COMPREHENSIVE ERROR ANALYSIS:');
    console.log('=====================================');
    console.log(`Total errors/warnings: ${allErrors.length}`);
    console.log(`Network requests: ${networkRequests.filter(r => r.type === 'request').length}`);
    console.log(`Network responses: ${networkRequests.filter(r => r.type === 'response').length}`);
    
    if (allErrors.length > 0) {
      console.log('\n🚨 All Errors and Warnings:');
      allErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message || error.text}`);
        if (error.location) {
          console.log(`   Location: ${error.location.url}:${error.location.lineNumber}`);
        }
      });
    }
    
    // Specific recommendations
    console.log('\n💡 SPECIFIC RECOMMENDATIONS:');
    if (allErrors.some(e => e.text && e.text.includes('theme is not defined'))) {
      console.log('1. Theme context issue - check theme provider setup');
    }
    if (allErrors.some(e => e.text && e.text.includes('Module not found'))) {
      console.log('2. Module resolution issue - check import paths');
    }
    if (allErrors.length === 0) {
      console.log('1. No JavaScript errors detected - issue may be in bundle compilation');
    }
  });

});