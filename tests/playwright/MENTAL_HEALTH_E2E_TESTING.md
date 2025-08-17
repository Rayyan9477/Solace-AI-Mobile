# Solace AI Mobile - Mental Health E2E Testing Guide

## Overview

This comprehensive E2E testing suite validates all critical user journeys for the Solace AI Mental Health mobile application. The tests are designed specifically for mental health apps, focusing on therapeutic UX, accessibility, crisis support, and user safety.

## 🎯 Test Coverage

### Core Features Tested
- ✅ **Onboarding Flow**: Complete 6-step onboarding process with therapeutic messaging
- ✅ **Navigation**: All 8 tabs (Welcome, Home, Chat, Mood, Assessment, Wellness, Utilities, Profile)
- ✅ **Mood Tracking**: Enhanced 4-step mood tracking workflow
- ✅ **Dashboard Components**: MoodCheckIn, QuickActions, ProgressOverview, etc.
- ✅ **Authentication**: Secure state management without hardcoded bypasses
- ✅ **Error Boundaries**: Graceful error handling and recovery
- ✅ **Accessibility**: WCAG 2.1 compliance, keyboard navigation, touch targets
- ✅ **Therapeutic Design**: Calming gradients, time-based theming, mental health icons
- ✅ **Performance**: Load times, memory management, animation smoothness
- ✅ **Crisis Support**: Emergency resources, safety features accessibility
- ✅ **Responsive Design**: Mobile, tablet, and desktop viewports
- ✅ **Security**: No sensitive data exposure, proper authentication handling

## 📂 Test Files

### Main Test Suites
1. **`solace-comprehensive-mental-health-e2e.spec.js`** - Complete comprehensive test suite (146 tests)
2. **`solace-mental-health-e2e-final.spec.js`** - Streamlined test suite (14 focused tests)
3. **`solace-quick-validation.spec.js`** - Quick smoke tests for verification

### Configuration Files
- **`standalone.config.js`** - Standalone configuration for direct app testing
- **`playwright.config.js`** - Main Playwright configuration with multiple projects
- **`run-mental-health-tests.js`** - Test runner script with different configurations

## 🚀 Quick Start

### Prerequisites
1. **Start the Solace AI Mobile App**:
   ```bash
   # In the project root directory
   npm start
   # OR
   npx expo start --port 8082 --web
   ```

2. **Verify app is running**:
   - Open http://localhost:8082 in browser
   - Should see onboarding screen with "Welcome to the ultimate freud UI Kit!"

### Running Tests

#### Option 1: Quick Validation (Recommended for first run)
```bash
# Quick smoke test to verify everything works
npx playwright test tests/playwright/solace-quick-validation.spec.js --config=tests/playwright/standalone.config.js --project=mental-health-mobile --headed
```

#### Option 2: Focused Test Suite (14 comprehensive tests)
```bash
# Run the streamlined comprehensive test suite
npx playwright test tests/playwright/solace-mental-health-e2e-final.spec.js --config=tests/playwright/standalone.config.js --project=mental-health-mobile --headed
```

#### Option 3: Full Comprehensive Suite (146 tests)
```bash
# Run the complete test suite (longer execution time)
npx playwright test tests/playwright/solace-comprehensive-mental-health-e2e.spec.js --config=tests/playwright/standalone.config.js --project=mental-health-mobile --headed
```

#### Option 4: Custom Test Runner
```bash
# Use the custom test runner script
node tests/playwright/run-mental-health-tests.js comprehensive --headed
```

### Multi-Device Testing
```bash
# Test on multiple devices/viewports
npx playwright test tests/playwright/solace-mental-health-e2e-final.spec.js --config=tests/playwright/standalone.config.js --headed

# Specific device
npx playwright test --config=tests/playwright/standalone.config.js --project=mental-health-desktop --headed
```

## 📊 Test Reports

After running tests, reports are generated in:
- **HTML Report**: `test-reports/mental-health-html/index.html`
- **JSON Results**: `test-reports/mental-health-results.json`
- **Screenshots**: `test-results/mental-health-*.png`
- **Videos**: Available in test results for failed tests
- **Traces**: Detailed execution traces for debugging

## 🧠 Mental Health App Specific Features

### Therapeutic Design Validation
- **Gradient Backgrounds**: Validates calming color schemes
- **Time-based Theming**: Checks dynamic theming based on time of day
- **Animation Performance**: Ensures smooth, non-jarring transitions
- **Accessibility**: Validates therapeutic touch targets (44px minimum)

### Crisis Support Testing
- **Emergency Access**: Verifies crisis support is always accessible
- **Crisis Detection**: Tests keyword detection for immediate support
- **Safety Resources**: Validates 988 and crisis hotline accessibility

### Mental Health UX Patterns
- **Progressive Disclosure**: Step-by-step mood tracking reduces cognitive load
- **Encouraging Messaging**: Positive, supportive language validation
- **Mindfulness Features**: Tests wellness resources and mindful design
- **Privacy & Security**: Ensures no sensitive data exposure

## 🔧 Configuration Details

### Test Environment
- **Base URL**: http://localhost:8082
- **Primary Viewport**: 375x812 (iPhone 14 Pro)
- **Timeouts**: 30s test timeout, 10s expect timeout
- **Retries**: 1 retry for flaky test resilience

### Device Configurations
1. **Mental Health Mobile**: iPhone 14 Pro simulation with touch support
2. **Mental Health Desktop**: 1280x720 Chrome desktop
3. **Mental Health Tablet**: 768x1024 tablet simulation

## 🐛 Troubleshooting

### Common Issues

#### "App not running on port 8082"
```bash
# Solution: Start the app first
npx expo start --port 8082 --web
# Wait for "Logs for your project will appear below" message
```

#### "net::ERR_CONNECTION_REFUSED"
```bash
# Check if another process is using port 8082
netstat -ano | findstr ":8082"
# Kill any conflicting processes
```

#### "Global setup conflicts"
```bash
# Use standalone configuration to bypass global setup
npx playwright test --config=tests/playwright/standalone.config.js
```

#### Tests are slow or timing out
```bash
# Increase timeouts for mental health app interactions
npx playwright test --timeout=60000 --expect-timeout=20000
```

### Debugging Failed Tests
```bash
# Show trace for detailed debugging
npx playwright show-trace test-results/trace.zip

# Run single test with debug mode
npx playwright test --debug "App loads and shows onboarding screen"

# Run with verbose logging
npx playwright test --reporter=line --verbose
```

## 📈 Performance Benchmarks

### Mental Health App Performance Standards
- **Load Time**: < 6 seconds (reduces user anxiety)
- **DOM Content Loaded**: < 2 seconds
- **Memory Usage**: < 50MB JavaScript heap
- **Animation Frame Rate**: 60 FPS with native driver

### Accessibility Standards
- **Touch Targets**: Minimum 44x44px (WCAG 2.1 Level AA)
- **Color Contrast**: Therapeutic color schemes validated
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Proper ARIA labels and semantic HTML

## 🎭 Test Scenarios

### Critical User Journeys
1. **New User Onboarding** → Skip onboarding → Main app access
2. **Complete Onboarding** → 6 steps → Main app with authentication
3. **Mood Tracking** → Navigation → Selection → Intensity → Activities → Notes → Save
4. **Crisis Support** → Immediate access → Emergency resources → Safety validation
5. **Cross-Device** → Mobile → Tablet → Desktop responsive behavior

### Edge Cases
- **Rapid Navigation**: Stress test with quick tab switching
- **Memory Management**: Long-running animations without leaks
- **Error Recovery**: Network failures and component errors
- **Offline Behavior**: Graceful degradation when offline

## 🎉 Success Criteria

A successful test run should show:
- ✅ All tests pass on mobile viewport
- ✅ No critical JavaScript errors
- ✅ Load time under 6 seconds
- ✅ Therapeutic design elements present
- ✅ Crisis support accessible
- ✅ Accessibility standards met
- ✅ Cross-device compatibility
- ✅ Security validation passed

## 📞 Support

For test-related issues:
1. Check this documentation first
2. Verify app is running on http://localhost:8082
3. Check Playwright installation: `npx playwright --version`
4. Review test reports in `test-reports/` directory
5. Use trace files for detailed debugging

---

*This testing suite is specifically designed for mental health applications, ensuring user safety, therapeutic UX, and accessibility compliance.*