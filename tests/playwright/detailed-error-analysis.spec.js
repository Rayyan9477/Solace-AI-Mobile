// Detailed error analysis for Solace AI Mobile frontend
const { test, expect } = require('@playwright/test');

test.describe('Detailed Error Analysis', () => {

  test('Capture detailed console and network errors', async ({ page }) => {
    console.log('\n🔍 Starting detailed error analysis...');
    
    const consoleMessages = [];
    const networkErrors = [];
    const jsErrors = [];
    
    // Capture all console messages
    page.on('console', msg => {
      const msgInfo = {
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
        timestamp: new Date().toISOString()
      };
      consoleMessages.push(msgInfo);
      console.log(`Console [${msg.type()}]:`, msg.text());
    });
    
    // Capture page errors (uncaught exceptions)
    page.on('pageerror', error => {
      const errorInfo = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: new Date().toISOString()
      };
      jsErrors.push(errorInfo);
      console.log('Page Error:', error.message);
    });
    
    // Capture network failures
    page.on('requestfailed', request => {
      const networkError = {
        url: request.url(),
        method: request.method(),
        failure: request.failure(),
        timestamp: new Date().toISOString()
      };
      networkErrors.push(networkError);
      console.log('Network Error:', request.url(), request.failure());
    });
    
    // Navigate and wait for network activity
    console.log('\n📡 Loading page and monitoring for errors...');
    try {
      const response = await page.goto('http://localhost:8081', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      console.log(`Response status: ${response.status()}`);
    } catch (error) {
      console.log('Navigation error:', error.message);
    }
    
    // Wait additional time for async loading
    await page.waitForTimeout(10000);
    
    // Check what's actually in the DOM
    console.log('\n🔍 Analyzing DOM structure...');
    const html = await page.content();
    console.log('HTML length:', html.length);
    
    // Look for script tags and their content
    const scripts = await page.locator('script').all();
    console.log(`Found ${scripts.length} script tags`);
    
    for (let i = 0; i < Math.min(scripts.length, 5); i++) {
      try {
        const src = await scripts[i].getAttribute('src');
        const type = await scripts[i].getAttribute('type');
        console.log(`Script ${i + 1}: src="${src}", type="${type}"`);
      } catch (error) {
        console.log(`Script ${i + 1}: Error reading attributes`);
      }
    }
    
    // Check for React/Expo specific elements
    const rootElement = await page.locator('#root').innerHTML().catch(() => null);
    const expoRoot = await page.locator('#expo-root').innerHTML().catch(() => null);
    
    console.log('Root element content:', rootElement ? rootElement.substring(0, 200) : 'Not found');
    console.log('Expo root content:', expoRoot ? expoRoot.substring(0, 200) : 'Not found');
    
    // Take a detailed screenshot
    await page.screenshot({ 
      path: 'test-results/detailed-error-analysis.png', 
      fullPage: true 
    });
    
    // Try to evaluate JavaScript in the browser context
    console.log('\n🧪 Testing JavaScript execution...');
    try {
      const windowObj = await page.evaluate(() => {
        return {
          reactVersion: window.React ? window.React.version : 'Not found',
          expoVersion: window.expo ? window.expo.version : 'Not found',
          hasReactRoot: !!window.React,
          documentReady: document.readyState,
          bodyChildren: document.body.children.length,
          errors: window.errors || []
        };
      });
      
      console.log('JavaScript evaluation results:', windowObj);
    } catch (error) {
      console.log('JavaScript evaluation error:', error.message);
    }
    
    // Generate comprehensive error report
    const errorReport = {
      timestamp: new Date().toISOString(),
      consoleMessages: consoleMessages.length,
      networkErrors: networkErrors.length,
      jsErrors: jsErrors.length,
      criticalErrors: [],
      recommendations: []
    };
    
    // Analyze console messages for critical errors
    consoleMessages.forEach(msg => {
      if (msg.type === 'error' || msg.text.toLowerCase().includes('error')) {
        errorReport.criticalErrors.push(msg);
      }
    });
    
    // Generate recommendations
    if (jsErrors.length > 0) {
      errorReport.recommendations.push('Fix JavaScript runtime errors');
    }
    if (networkErrors.length > 0) {
      errorReport.recommendations.push('Resolve network connectivity issues');
    }
    if (errorReport.criticalErrors.length === 0) {
      errorReport.recommendations.push('Check bundle loading and module resolution');
    }
    
    console.log('\n📊 ERROR ANALYSIS SUMMARY:');
    console.log('==========================');
    console.log(`Console messages: ${consoleMessages.length}`);
    console.log(`Network errors: ${networkErrors.length}`);
    console.log(`JavaScript errors: ${jsErrors.length}`);
    console.log(`Critical errors: ${errorReport.criticalErrors.length}`);
    console.log('==========================');
    
    if (errorReport.criticalErrors.length > 0) {
      console.log('\n🚨 CRITICAL ERRORS:');
      errorReport.criticalErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.text}`);
      });
    }
    
    if (errorReport.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      errorReport.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    
    // Save detailed error report
    const reportContent = JSON.stringify({
      errorReport,
      consoleMessages,
      networkErrors,
      jsErrors
    }, null, 2);
    
    console.log('\n💾 Detailed error report generated');
  });
  
  test('Test direct bundle access', async ({ page }) => {
    console.log('\n🎯 Testing direct bundle access...');
    
    // Try to access the bundle directly
    const bundleUrls = [
      'http://localhost:8081/static/js/bundle.js',
      'http://localhost:8081/bundle.js',
      'http://localhost:8081/_expo/static/js/web/bundle.js',
      'http://localhost:8081/static/media/bundle.js'
    ];
    
    for (const url of bundleUrls) {
      try {
        console.log(`Testing bundle URL: ${url}`);
        const response = await page.goto(url, { timeout: 5000 });
        console.log(`Bundle response: ${response.status()} - ${response.statusText()}`);
        
        if (response.ok()) {
          const contentType = response.headers()['content-type'];
          console.log(`Content-Type: ${contentType}`);
          
          // Check if it's actually JavaScript
          if (contentType && contentType.includes('javascript')) {
            const content = await response.text();
            console.log(`Bundle size: ${content.length} characters`);
            console.log(`Contains React: ${content.includes('React')}`);
            console.log(`Contains Expo: ${content.includes('expo')}`);
            break;
          }
        }
      } catch (error) {
        console.log(`Bundle URL ${url} failed: ${error.message}`);
      }
    }
  });

});