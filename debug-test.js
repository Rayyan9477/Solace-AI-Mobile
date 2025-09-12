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
  });

  try {
    console.log('Navigating to http://localhost:8081...');
    await page.goto('http://localhost:8081', { timeout: 30000 });

    // Wait for React to potentially load
    console.log('Waiting for React to load...');
    await page.waitForTimeout(8000);

    // Check if the page has loaded content
    const content = await page.textContent('body');
    console.log('Body content length:', content.length);
    console.log('Body content preview:', content.substring(0, 300) + '...');

    // Check for React root
    const rootElement = await page.$('#root');
    console.log('Root element exists:', !!rootElement);

    if (rootElement) {
      const rootContent = await rootElement.textContent();
      console.log('Root element content length:', rootContent.length);
      console.log('Root element content preview:', rootContent.substring(0, 200) + '...');

      // Check if root has children
      const rootChildren = await rootElement.$$('*');
      console.log('Root element children count:', rootChildren.length);
    }

    // Check for any interactive elements
    const buttons = await page.$$('button, [role="button"], a, [tabindex]');
    console.log('Number of interactive elements:', buttons.length);

    // Check for React-specific elements
    const reactElements = await page.$$('[data-reactroot], [data-react-helmet]');
    console.log('Number of React elements:', reactElements.length);

    // Check for loading indicators
    const loadingElements = await page.$$('*[class*="loading"], *[class*="Loading"], text=/loading/i');
    console.log('Number of loading elements:', loadingElements.length);

    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'debug-screenshot-updated.png', fullPage: true });
    console.log('Screenshot saved as debug-screenshot-updated.png');

  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
