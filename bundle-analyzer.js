const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen for console messages
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.type(), ':', msg.text());
  });

  // Listen for page errors with full stack trace
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    console.log('PAGE ERROR STACK:', error.stack);
    console.log('PAGE ERROR LINE:', error.stack?.split('\n')[1]);
  });

  try {
    console.log('=== BUNDLE ANALYSIS TEST ===');

    // Get the bundle content
    const bundleUrl = 'http://localhost:8081/expo/AppEntry.bundle?platform=web&dev=true&hot=false&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable';
    console.log('Fetching bundle from:', bundleUrl);

    const response = await page.request.get(bundleUrl);
    const bundleContent = await response.text();

    console.log('Bundle size:', bundleContent.length, 'characters');

    // Save bundle for analysis
    fs.writeFileSync('bundle-content.js', bundleContent);
    console.log('Bundle saved to bundle-content.js');

    // Find lines containing "compact"
    const linesWithCompact = bundleContent.split('\n')
      .map((line, index) => ({ line: index + 1, content: line }))
      .filter(item => item.content.includes('compact'));

    console.log('Lines containing "compact":', linesWithCompact.length);
    linesWithCompact.slice(0, 10).forEach(item => {
      console.log(`Line ${item.line}: ${item.content.substring(0, 100)}...`);
    });

    // Now navigate to the page to trigger the error
    console.log('Navigating to page...');
    await page.goto('http://localhost:8081', { timeout: 30000 });

    // Wait a bit for the error to occur
    await page.waitForTimeout(5000);

    console.log('Test completed');

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
