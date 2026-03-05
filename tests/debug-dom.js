const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Collect ALL console messages and errors
  const consoleMessages = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  page.on("requestfailed", (request) => {
    console.log("REQUEST FAILED:", request.url(), request.failure()?.errorText);
  });

  console.log("Navigating to http://localhost:8081 ...");
  await page.goto("http://localhost:8081", { waitUntil: "load", timeout: 60000 });

  // Wait extra time for the JS bundle to download and execute
  console.log("Waiting 15s for JS bundle to hydrate...");
  await page.waitForTimeout(15000);

  // Check #root content
  const rootEl = await page.$("#root");
  const rootHTML = rootEl ? await rootEl.innerHTML() : "NO ROOT ELEMENT";
  console.log("\n=== ROOT ELEMENT ===");
  console.log("Root innerHTML length:", rootHTML.length);
  console.log("Root innerHTML (first 500 chars):", rootHTML.substring(0, 500));

  // Check for data-testid
  const testIdElements = await page.$$("[data-testid]");
  console.log("\nElements with data-testid:", testIdElements.length);
  if (testIdElements.length > 0) {
    for (let i = 0; i < Math.min(testIdElements.length, 15); i++) {
      const tid = await testIdElements[i].getAttribute("data-testid");
      console.log("  -", tid);
    }
  }

  // Show console errors
  console.log("\n=== CONSOLE MESSAGES (" + consoleMessages.length + ") ===");
  consoleMessages.forEach((msg) => console.log("  ", msg));

  console.log("\n=== PAGE ERRORS (" + pageErrors.length + ") ===");
  pageErrors.forEach((err) => console.log("  ", err));

  // Check script tags
  const scriptCount = await page.$$eval("script", (els) =>
    els.map((el) => ({ src: el.src, type: el.type, len: el.innerHTML.length }))
  );
  console.log("\n=== SCRIPT TAGS ===");
  scriptCount.forEach((s) => console.log("  ", JSON.stringify(s)));

  // Screenshot
  await page.screenshot({ path: "test-results/debug-screenshot.png", fullPage: true });
  console.log("\nScreenshot saved.");

  await browser.close();
})();
