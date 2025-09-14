const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Listen for console messages
  page.on("console", (msg) => {
    console.log("PAGE LOG:", msg.type(), ":", msg.text());
  });

  // Listen for page errors
  page.on("pageerror", (error) => {
    console.log("PAGE ERROR:", error.message);
  });

  try {
    console.log("=== UI ANALYSIS TEST ===");
    console.log("Navigating to http://localhost:8081...");
    await page.goto("http://localhost:8081", { timeout: 30000 });

    // Wait for React to load
    console.log("Waiting for React to load...");
    await page.waitForTimeout(10000);

    // Get page title and basic info
    const title = await page.title();
    console.log("Page title:", title);

    // Check if the page has loaded content
    const content = await page.textContent("body");
    console.log("Body content length:", content.length);
    console.log("Body content preview:", content.substring(0, 500) + "...");

    // Check for React root
    const rootElement = await page.$("#root");
    console.log("Root element exists:", !!rootElement);

    if (rootElement) {
      const rootContent = await rootElement.textContent();
      console.log("Root element content length:", rootContent.length);
      console.log(
        "Root element content preview:",
        rootContent.substring(0, 200) + "...",
      );

      // Check if root has children
      const rootChildren = await rootElement.$$("*");
      console.log("Root element children count:", rootChildren.length);

      // Get all descendant elements
      const allElements = await rootElement.$$("*:not(script):not(style)");
      console.log(
        "Total non-script/style elements in root:",
        allElements.length,
      );

      // Analyze the DOM structure
      for (let i = 0; i < Math.min(10, allElements.length); i++) {
        const element = allElements[i];
        const tagName = await element.evaluate((el) => el.tagName);
        const className = await element.evaluate((el) => el.className);
        const text = await element.evaluate((el) =>
          el.textContent?.substring(0, 50),
        );
        console.log(
          `Element ${i}: ${tagName} class="${className}" text="${text}"`,
        );
      }
    }

    // Check for specific UI components
    const buttons = await page.$$(
      'button, [role="button"], input[type="button"], input[type="submit"]',
    );
    console.log("Button elements found:", buttons.length);

    const links = await page.$$('a[href], [role="link"]');
    console.log("Link elements found:", links.length);

    const inputs = await page.$$("input, textarea, select");
    console.log("Input elements found:", inputs.length);

    const navElements = await page.$$(
      'nav, [role="navigation"], [role="tablist"]',
    );
    console.log("Navigation elements found:", navElements.length);

    // Check for theme-related elements
    const styledElements = await page.$$("[style], [class]");
    console.log("Elements with styles or classes:", styledElements.length);

    // Check for accessibility attributes
    const ariaElements = await page.$$(
      "[aria-label], [aria-labelledby], [role]",
    );
    console.log("Elements with ARIA attributes:", ariaElements.length);

    // Check for React-specific attributes
    const reactElements = await page.$$(
      "[data-reactroot], [data-react-helmet], [data-testid]",
    );
    console.log("Elements with React attributes:", reactElements.length);

    // Check for loading indicators
    const loadingElements = await page.$$(
      'text=/loading/i, text=/loading/i, *[class*="loading"], *[class*="Loading"]',
    );
    console.log("Loading elements found:", loadingElements.length);

    // Check for error messages
    const errorElements = await page.$$(
      'text=/error/i, text=/Error/i, *[class*="error"], *[class*="Error"]',
    );
    console.log("Error elements found:", errorElements.length);

    // Check computed styles
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        fontSize: computed.fontSize,
        display: computed.display,
      };
    });
    console.log("Body computed styles:", bodyStyles);

    // Take a detailed screenshot
    await page.screenshot({
      path: "detailed-ui-analysis.png",
      fullPage: true,
      type: "png",
    });
    console.log("Detailed screenshot saved as detailed-ui-analysis.png");

    // Try to detect if the app is in a loading state
    const isLoading = await page.evaluate(() => {
      const loadingIndicators = [
        "loading",
        "Loading",
        "please wait",
        "Please wait",
        "initializing",
        "Initializing",
        "connecting",
        "Connecting",
      ];

      const bodyText = document.body?.textContent || "";
      return loadingIndicators.some((indicator) =>
        bodyText.toLowerCase().includes(indicator.toLowerCase()),
      );
    });
    console.log("App appears to be in loading state:", isLoading);
  } catch (error) {
    console.error("Test failed:", error.message);
  } finally {
    await browser.close();
  }
})();
