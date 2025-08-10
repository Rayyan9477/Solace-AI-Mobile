// Simple Playwright config for diagnostic testing only
const { devices } = require('@playwright/test');

module.exports = {
  timeout: 120 * 1000,
  testDir: './tests/playwright',
  outputDir: './test-results/playwright',
  
  use: {
    headless: false, // Show browser for visual debugging
    baseURL: 'http://localhost:8083',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'diagnostic',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: ['**/solace-frontend-diagnostic.spec.js', '**/solace-fixed-verification.spec.js'],
    },
  ],
  
  reporter: [
    ['html', { outputFolder: './test-results/diagnostic-html' }],
    ['json', { outputFile: './test-results/diagnostic-results.json' }],
  ],
};