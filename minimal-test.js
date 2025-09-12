const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen for console messages
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.type(), ':', msg.text());
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    console.log('PAGE ERROR STACK:', error.stack);
  });

  try {
    console.log('Navigating to http://localhost:8081...');
    await page.goto('http://localhost:8081', { timeout: 30000 });

    // Wait a bit for any scripts to load
    await page.waitForTimeout(3000);

    // Try to evaluate a simple expression to see if JavaScript works
    try {
      const result = await page.evaluate(() => {
        console.log('JavaScript evaluation test');
        return 'JavaScript works';
      });
      console.log('JavaScript evaluation result:', result);
    } catch (evalError) {
      console.log('JavaScript evaluation failed:', evalError.message);
    }

    // Check if compact is defined in global scope
    try {
      const compactExists = await page.evaluate(() => {
        return typeof window.compact !== 'undefined';
      });
      console.log('window.compact exists:', compactExists);
    } catch (error) {
      console.log('Error checking compact:', error.message);
    }

    // Try to access the bundle URL directly
    const bundleUrl = 'http://localhost:8081/expo/AppEntry.bundle?platform=web&dev=true&hot=false&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable';
    console.log('Bundle URL:', bundleUrl);

    try {
      const response = await page.request.get(bundleUrl);
      console.log('Bundle response status:', response.status());
      if (response.status() === 200) {
        const content = await response.text();
        console.log('Bundle content length:', content.length);
        // Check if bundle contains "compact"
        const hasCompact = content.includes('compact');
        console.log('Bundle contains "compact":', hasCompact);
      }
    } catch (bundleError) {
      console.log('Bundle fetch error:', bundleError.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
