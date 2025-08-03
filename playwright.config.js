// playwright.config.js
// Basic Playwright config for Solace AI Mobile theme preview

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: "npm run theme-preview",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    viewport: { width: 375, height: 667 }, // iPhone 8 size
  },
  testDir: "./e2e",
};

module.exports = config;
