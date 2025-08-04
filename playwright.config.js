// playwright.config.js
// Comprehensive Playwright config for Solace AI Mobile MCP testing environment

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: [
    {
      command: "npm run web",
      port: 8081,
      timeout: 120 * 1000,
      reuseExistingServer: true,
      env: {
        NODE_ENV: 'test'
      }
    },
    {
      command: "npm run theme-preview",
      port: 3000,
      timeout: 120 * 1000,
      reuseExistingServer: true,
    }
  ],
  
  // Timeout settings optimized for therapy tests
  globalTimeout: 300 * 1000, // 5 minute global timeout for therapy suite
  timeout: 60 * 1000, // 1 minute per test for therapy interactions
  expect: {
    timeout: 15 * 1000 // 15 second assertion timeout for AI responses
  },
  
  // Test configuration
  testDir: "./tests/playwright",
  outputDir: "./test-results/playwright",
  
  // Parallel execution with proper worker management
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  
  // Retry and failure handling
  retries: process.env.CI ? 2 : 1,
  
  // Reporter configuration with screenshot capture
  reporter: [
    ['html', { outputFolder: './test-reports/playwright-html' }],
    ['json', { outputFile: './test-reports/playwright-results.json' }],
    ['junit', { outputFile: './test-reports/playwright-junit.xml' }],
  ],
  
  // Global setup and teardown
  globalSetup: require.resolve('./tests/playwright/global-setup.js'),
  globalTeardown: require.resolve('./tests/playwright/global-teardown.js'),
  
  // Screenshot and video capture on failure
  use: {
    // Base configuration
    headless: process.env.CI ? true : false,
    
    // Screenshot configuration
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    
    // Video recording for debugging
    video: {
      mode: 'retain-on-failure',
      size: { width: 640, height: 480 }
    },
    
    // Trace collection for debugging
    trace: 'retain-on-failure',
    
    // Default timeout for actions (increased for therapy interactions)
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },
  
  // Device and viewport configurations
  projects: [
    // Therapy Testing - Desktop Chrome
    {
      name: 'therapy-desktop',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: "http://localhost:8081",
        viewport: { width: 1280, height: 720 },
        permissions: ['microphone', 'geolocation'], // Required for therapy features
      },
      testMatch: ['**/therapy-screen.spec.js', '**/therapy-integration.spec.js'],
    },
    
    // Crisis Detection Testing
    {
      name: 'crisis-detection',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: "http://localhost:8081",
        viewport: { width: 1280, height: 720 },
        permissions: ['microphone', 'geolocation'],
      },
      testMatch: ['**/therapy-crisis-detection.spec.js'],
    },
    
    // Performance Testing
    {
      name: 'therapy-performance',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: "http://localhost:8081",
        viewport: { width: 1280, height: 720 },
        permissions: ['microphone', 'geolocation'],
        launchOptions: {
          args: ['--enable-precise-memory-info', '--disable-web-security']
        }
      },
      testMatch: ['**/therapy-performance.spec.js'],
    },
    
    // Accessibility Testing
    {
      name: 'therapy-accessibility',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: "http://localhost:8081",
        viewport: { width: 1280, height: 720 },
        permissions: ['microphone', 'geolocation'],
        reducedMotion: 'reduce', // Test with reduced motion
      },
      testMatch: ['**/therapy-accessibility.spec.js'],
    },
    
    // Mobile Therapy Testing - iPhone
    {
      name: 'therapy-mobile-ios',
      use: {
        ...devices['iPhone 12'],
        baseURL: "http://localhost:8081",
        permissions: ['microphone', 'geolocation'],
      },
      testMatch: ['**/therapy-screen.spec.js'],
    },
    
    // Mobile Therapy Testing - Android
    {
      name: 'therapy-mobile-android',
      use: {
        ...devices['Galaxy S21'],
        baseURL: "http://localhost:8081",
        permissions: ['microphone', 'geolocation'],
      },
      testMatch: ['**/therapy-screen.spec.js'],
    },
    
    // Edge Desktop Browser (existing tests)
    {
      name: 'edge-desktop',
      use: {
        ...devices['Desktop Edge'],
        baseURL: "http://localhost:8081",
        viewport: { width: 1280, height: 720 },
      },
      testIgnore: ['**/therapy-*.spec.js'], // Skip therapy tests on Edge
    },
    
    // iPhone 14 Pro Mobile Viewport (existing tests)
    {
      name: 'iphone-14-pro',
      use: {
        ...devices['iPhone 14 Pro'],
        baseURL: "http://localhost:8081",
        viewport: { width: 393, height: 852 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
      testIgnore: ['**/therapy-*.spec.js'], // Skip therapy tests on this config
    },
    
    // iPhone SE Mobile Viewport (existing tests)
    {
      name: 'iphone-se',
      use: {
        ...devices['iPhone SE'],
        baseURL: "http://localhost:8081",
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
      testIgnore: ['**/therapy-*.spec.js'],
    },
    
    // Samsung Galaxy S21 Android Viewport (existing tests)
    {
      name: 'samsung-galaxy-s21',
      use: {
        ...devices['Galaxy S21'],
        baseURL: "http://localhost:8081",
        viewport: { width: 360, height: 800 },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
      testIgnore: ['**/therapy-*.spec.js'],
    },
    
    // Pixel 7 Android Viewport (existing tests)
    {
      name: 'pixel-7',
      use: {
        ...devices['Pixel 7'],
        baseURL: "http://localhost:8081",
        viewport: { width: 412, height: 915 },
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36',
        deviceScaleFactor: 2.625,
        isMobile: true,
        hasTouch: true,
      },
      testIgnore: ['**/therapy-*.spec.js'],
    },
    
    // Theme Preview Testing (existing)
    {
      name: 'theme-preview',
      use: {
        baseURL: "http://localhost:3000",
        viewport: { width: 375, height: 667 },
        headless: true,
      },
      testIgnore: ['**/therapy-*.spec.js'],
    },
  ],
};

// Import devices from Playwright
const { devices } = require('@playwright/test');

module.exports = config;
