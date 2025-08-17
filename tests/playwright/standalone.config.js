/**
 * Standalone Playwright Configuration for Solace AI Mental Health App
 * 
 * This configuration bypasses the complex global setup and connects
 * directly to the running app on localhost:8082
 */

const { devices } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  // Basic test configuration
  testDir: './tests/playwright',
  outputDir: './test-results/mental-health',
  
  // Timeouts
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000
  },
  
  // Test execution
  workers: 1, // Run tests sequentially for stability
  fullyParallel: false,
  retries: 1,
  
  // Reporting
  reporter: [
    ['html', { outputFolder: './test-reports/mental-health-html' }],
    ['json', { outputFile: './test-reports/mental-health-results.json' }],
    ['line']
  ],
  
  // Screenshot and video capture
  use: {
    headless: false, // Show browser for mental health app testing
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Longer timeouts for mental health app interactions
    actionTimeout: 15 * 1000,
    navigationTimeout: 20 * 1000,
  },
  
  // Test projects for different devices/viewports
  projects: [
    // Mobile Testing (Primary)
    {
      name: 'mental-health-mobile',
      use: {
        ...devices['iPhone 14 Pro'],
        baseURL: 'http://localhost:8082',
        viewport: { width: 375, height: 812 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
      testMatch: ['**/solace-mental-health-e2e-final.spec.js'],
    },
    
    // Desktop Testing
    {
      name: 'mental-health-desktop',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8082',
        viewport: { width: 1280, height: 720 },
      },
      testMatch: ['**/solace-mental-health-e2e-final.spec.js'],
    },
    
    // Tablet Testing
    {
      name: 'mental-health-tablet',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:8082',
        viewport: { width: 768, height: 1024 },
        isMobile: true,
        hasTouch: true,
      },
      testMatch: ['**/solace-mental-health-e2e-final.spec.js'],
    }
  ],
};

module.exports = config;