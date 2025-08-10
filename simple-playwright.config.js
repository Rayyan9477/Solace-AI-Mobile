// Simple Playwright config for frontend diagnostic testing
const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./tests/playwright",
  outputDir: "./test-results/playwright",
  
  timeout: 60 * 1000,
  expect: {
    timeout: 15 * 1000
  },
  
  workers: 1,
  retries: 0,
  
  reporter: [
    ['line'],
    ['html', { outputFolder: './test-reports/playwright-html' }]
  ],
  
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },
  
  projects: [
    {
      name: 'chrome-diagnostic',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
};

module.exports = config;