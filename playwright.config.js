/**
 * Playwright Configuration for Solace AI Mobile App Testing
 * Comprehensive cross-platform testing setup
 */

const { defineConfig, devices } = require("@playwright/test");

const fullMatrixEnabled = process.env.PLAYWRIGHT_FULL_MATRIX === "1";

const coreProjects = [
  {
    name: "chromium-desktop",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1200, height: 800 },
    },
  },
  {
    name: "mobile-chrome",
    use: {
      ...devices["Pixel 5"],
      viewport: { width: 393, height: 851 },
    },
  },
];

const extendedProjects = [
  {
    name: "firefox-desktop",
    use: {
      ...devices["Desktop Firefox"],
      viewport: { width: 1200, height: 800 },
    },
  },
  {
    name: "webkit-desktop",
    use: {
      ...devices["Desktop Safari"],
      viewport: { width: 1200, height: 800 },
    },
  },
  {
    name: "mobile-safari",
    use: {
      ...devices["iPhone 12"],
      viewport: { width: 390, height: 844 },
    },
  },
  {
    name: "iphone-14-pro",
    use: {
      ...devices["iPhone 14 Pro"],
      viewport: { width: 393, height: 852 },
    },
  },
  {
    name: "samsung-galaxy-s21",
    use: {
      ...devices["Galaxy S8"],
      viewport: { width: 360, height: 740 },
    },
  },
  {
    name: "pixel-7",
    use: {
      ...devices["Pixel 7"],
      viewport: { width: 412, height: 915 },
    },
  },
  {
    name: "ipad",
    use: {
      ...devices["iPad Pro"],
      viewport: { width: 1024, height: 1366 },
    },
  },
  {
    name: "android-tablet",
    use: {
      ...devices["Galaxy Tab S4"],
      viewport: { width: 712, height: 1138 },
    },
  },
  {
    name: "small-screen",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 320, height: 568 },
    },
  },
  {
    name: "large-screen",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1920, height: 1080 },
    },
  },
  {
    name: "mental-health-comprehensive",
    use: {
      ...devices["iPhone 12"],
      viewport: { width: 390, height: 844 },
      colorScheme: "light",
      reducedMotion: "reduce",
      timezoneId: "America/New_York",
    },
  },
  {
    name: "accessibility-focused",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1200, height: 800 },
      colorScheme: "dark",
      reducedMotion: "reduce",
      forcedColors: "active",
    },
  },
];

module.exports = defineConfig({
  // Test directory
  testDir: "./tests",

  // Only run .spec.js files (not .test.tsx Jest files)
  testMatch: "**/*.spec.js",

  // Global test timeout
  timeout: 60000,

  // Expect timeout for assertions
  expect: {
    timeout: 10000,
  },

  // Run tests in parallel
  fullyParallel: false,
  workers: 1,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests
  retries: process.env.CI ? 2 : 1,

  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "test-results/html-report", open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["line"],
  ],

  // Global test setup
  use: {
    // Base URL for tests
    baseURL: process.env.SOLACE_BASE_URL || "http://localhost:8081",

    // Browser context options
    viewport: { width: 1200, height: 800 },

    // Collect trace on failure
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Video recording
    video: "retain-on-failure",

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Wait for page load events
    waitForLoadState: "networkidle",

    // Action timeout
    actionTimeout: 10000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Run core projects by default; set PLAYWRIGHT_FULL_MATRIX=1 for full cross-device matrix.
  projects: fullMatrixEnabled ? [...coreProjects, ...extendedProjects] : coreProjects,

  // Web server configuration (if needed)
  webServer: {
    command: "npm run start",
    url: "http://localhost:8081",
    reuseExistingServer: true, // Always reuse existing server
    timeout: 120000,
    env: {
      NODE_ENV: "test",
      EXPO_DEBUG: "1",
    },
  },

  // Output directory for test results
  outputDir: "test-results/artifacts",

  // Global setup and teardown
  globalSetup: require.resolve("./tests/global-setup.js"),
  globalTeardown: require.resolve("./tests/global-teardown.js"),
});
