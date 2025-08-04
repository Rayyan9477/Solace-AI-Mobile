# Playwright MCP Testing Environment for Solace AI Mobile

## Overview

This comprehensive Playwright testing environment provides end-to-end testing capabilities specifically designed for the Solace AI Mobile React Native application. It includes mobile viewport simulation, accessibility testing, cross-device compatibility, and mental health app-specific test scenarios.

## Features

### 🎯 Core Features
- **Strict 20-second timeout** for all operations
- **Cross-device testing** (iPhone, Android, Desktop)
- **Comprehensive accessibility testing** (WCAG 2.1 AA compliance)
- **Automatic port cleanup** and error handling
- **Screenshot capture** on failure with detailed reporting
- **Parallel test execution** with proper worker management

### 📱 Device Support
- **iPhone**: SE, 14 Pro, 14 Pro Max
- **Android**: Samsung Galaxy S21, Google Pixel 7
- **Desktop**: Edge browser with various viewport sizes
- **Orientation testing**: Portrait and landscape modes

### ♿ Accessibility Testing
- Color contrast validation (AA/AAA levels)
- Keyboard navigation testing
- ARIA attributes validation
- Form accessibility compliance
- Screen reader compatibility

### 🔧 Mental Health App Specific
- Therapeutic color scheme validation
- Mood tracking functionality testing
- Crisis support accessibility
- Privacy and security testing
- Emotional state simulation

## Quick Start

### Installation

```bash
# Install Playwright dependencies
npm install
npx playwright install

# Run all tests
npm run test:playwright

# Run tests with browser UI
npm run test:playwright:headed

# Run only mobile device tests
npm run test:playwright:mobile

# Generate and view HTML report
npm run test:playwright:report
```

### Basic Usage

```javascript
const { test, expect } = require('@playwright/test');
const { BaseTest } = require('./base-test');

test('example test', async ({ page, context }) => {
  const baseTest = new BaseTest(page, context);
  await baseTest.setup();
  
  // Simulate iPhone 14 Pro
  await baseTest.simulateDevice('iphone-14-pro');
  
  // Navigate with error handling
  await baseTest.navigateTo('/');
  await baseTest.waitForAppReady();
  
  // Run accessibility tests
  const a11yResults = await baseTest.runAccessibilityTests();
  expect(a11yResults.passed).toBeTruthy();
  
  await baseTest.teardown();
});
```

## Configuration

### Playwright Config (`playwright.config.js`)

```javascript
{
  // Global 20-second timeout
  timeout: 20 * 1000,
  expect: { timeout: 20 * 1000 },
  
  // Multiple projects for different devices
  projects: [
    { name: 'iphone-14-pro', use: { viewport: { width: 393, height: 852 } } },
    { name: 'samsung-galaxy-s21', use: { viewport: { width: 360, height: 800 } } },
    { name: 'edge-desktop', use: { viewport: { width: 1280, height: 720 } } }
  ],
  
  // Comprehensive reporting
  reporter: [
    ['html', { outputFolder: './test-reports/playwright-html' }],
    ['json', { outputFile: './test-reports/playwright-results.json' }],
    ['junit', { outputFile: './test-reports/playwright-junit.xml' }]
  ]
}
```

### Environment Variables

```bash
# Cleanup test artifacts after completion
CLEANUP_TEST_ARTIFACTS=true

# Enable debug mode
PLAYWRIGHT_TEST_MODE=true

# Set custom timeout (milliseconds)
PLAYWRIGHT_TIMEOUT=20000
```

## Test Structure

### Base Test Class

The `BaseTest` class provides common functionality:

- **Setup/Teardown**: Automated test environment management
- **Error Handling**: Comprehensive error capture and reporting
- **Device Simulation**: Mobile and desktop viewport simulation
- **Accessibility Testing**: WCAG compliance validation
- **Screenshot Management**: Automatic failure screenshots

### Example Test Flow

```javascript
test('navigation flow', async ({ page, context }) => {
  const baseTest = new BaseTest(page, context);
  await baseTest.setup();
  
  // Test across multiple devices
  const devices = ['iphone-14-pro', 'samsung-galaxy-s21'];
  
  for (const device of devices) {
    await baseTest.simulateDevice(device);
    
    // Navigate to app
    await baseTest.navigateTo('/');
    await baseTest.waitForAppReady();
    
    // Test login flow
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Verify dashboard
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    
    // Run accessibility tests
    const a11yResults = await baseTest.runAccessibilityTests();
    expect(a11yResults.passed).toBeTruthy();
    
    await baseTest.takeScreenshot(`${device}-dashboard`);
  }
  
  await baseTest.teardown();
});
```

## Available Test Scripts

```bash
# Run all Playwright tests
npm run test:playwright

# Run tests with browser UI (non-headless)
npm run test:playwright:headed

# Run tests in debug mode
npm run test:playwright:debug

# Run only mobile device tests
npm run test:playwright:mobile

# Run only desktop tests
npm run test:playwright:desktop

# Generate and view HTML report
npm run test:playwright:report
```

## Device Configurations

### Mobile Devices

| Device | Width | Height | Scale | Touch |
|--------|--------|--------|-------|-------|
| iPhone SE | 375px | 667px | 2x | Yes |
| iPhone 14 Pro | 393px | 852px | 3x | Yes |
| Samsung Galaxy S21 | 360px | 800px | 3x | Yes |
| Google Pixel 7 | 412px | 915px | 2.625x | Yes |

### Desktop Viewports

| Size | Width | Height | Touch |
|------|--------|--------|-------|
| Standard | 1280px | 720px | No |
| Large | 1920px | 1080px | No |

## Accessibility Testing

### Supported Audits

- **Color Contrast**: WCAG AA/AAA compliance (4.5:1 / 7:1 ratios)
- **Keyboard Navigation**: Tab order and focus management
- **ARIA Attributes**: Proper semantic markup
- **Form Labels**: Input-label associations
- **Image Alt Text**: Alternative text for images
- **Heading Hierarchy**: Proper h1-h6 structure

### Usage

```javascript
const a11yResults = await baseTest.runAccessibilityTests({
  includeAudits: ['color-contrast', 'keyboard', 'aria', 'forms'],
  level: 'AA', // or 'AAA'
  skipSelectors: ['.known-issue'] // Optional
});

console.log('Accessibility Results:', {
  passed: a11yResults.passed,
  violations: a11yResults.violations.length,
  details: a11yResults.violations
});
```

## Error Handling and Debugging

### Automatic Error Capture

- **Console Errors**: JavaScript console errors
- **Page Errors**: Unhandled JavaScript exceptions
- **Network Failures**: Failed HTTP requests
- **Screenshots**: Automatic capture on test failure

### Debug Information

```javascript
const debugInfo = await ErrorHandler.collectDebugInfo(page);
console.log('Debug Info:', {
  url: debugInfo.url,
  viewport: debugInfo.viewport,
  userAgent: debugInfo.userAgent,
  localStorage: debugInfo.localStorage
});
```

## Port Management

### Automatic Cleanup

The testing environment automatically manages ports:

- **Cleanup on Start**: Kills existing processes on test ports
- **Port Detection**: Finds available ports automatically
- **Graceful Shutdown**: Proper cleanup on test completion

### Manual Port Management

```javascript
const { PortManager } = require('./test-utils');

// Find available port
const port = await PortManager.findAvailablePort(3000);

// Wait for service to be ready
await PortManager.waitForPortToBeReady(port, 30000);
```

## Test Reporting

### Built-in Reports

- **HTML Report**: Interactive test results with screenshots
- **JSON Report**: Machine-readable test data
- **JUnit Report**: CI/CD integration compatible

### Custom Reporting

```javascript
const { TestReporter } = require('./test-utils');

const reporter = new TestReporter();
reporter.addTestResult({
  testName: 'Login Flow',
  status: 'passed',
  duration: 5000,
  device: 'iphone-14-pro'
});

await reporter.saveReport('custom-report.json');
```

## Best Practices

### Test Organization

1. **Use descriptive test names** that explain the scenario
2. **Group related tests** using `test.describe()`
3. **Set up proper cleanup** in `afterEach` hooks
4. **Handle errors gracefully** with try-catch blocks

### Performance

1. **Use parallel execution** for faster test runs
2. **Limit screenshot capture** to failures only
3. **Clean up resources** properly in teardown
4. **Set reasonable timeouts** (20 seconds max)

### Accessibility

1. **Test with screen readers** in mind
2. **Verify keyboard navigation** works properly
3. **Check color contrast** meets WCAG standards
4. **Test with various devices** and viewports

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Kill processes on port 8081
npx kill-port 8081

# Or use our cleanup utility
node tests/playwright/global-setup.js
```

**Test timeouts:**
```javascript
// Increase timeout for slow operations
test.setTimeout(30000);

// Or configure globally in playwright.config.js
timeout: 30 * 1000
```

**Accessibility violations:**
```javascript
// Skip problematic selectors
const a11yResults = await baseTest.runAccessibilityTests({
  skipSelectors: ['.third-party-widget']
});
```

### Debug Mode

```bash
# Run tests in debug mode with browser UI
npm run test:playwright:debug

# Run specific test file
npx playwright test navigation-flow.spec.js --debug
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:playwright
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-reports/
```

## Contributing

When adding new tests:

1. **Extend BaseTest** for common functionality
2. **Follow naming conventions** for consistency
3. **Add proper documentation** for complex scenarios
4. **Test across multiple devices** when applicable
5. **Include accessibility checks** in all tests

## Support

For issues and questions:

- Check the [troubleshooting section](#troubleshooting)
- Review existing test examples
- Consult Playwright documentation
- File issues in the project repository

---

*This testing environment is specifically designed for the Solace AI Mobile mental health application and follows therapeutic design principles and accessibility standards.*