# 🧭 Navigation Flow Testing Suite

Comprehensive Selenium WebDriver test suite for Solace AI Mobile mental health app navigation flows with memory usage tracking and performance monitoring.

## 🌟 Features

### Core Testing Capabilities
- **Navigation Flow Tests**: Complete user journey testing (onboarding → assessment → dashboard → therapy)
- **State Persistence**: Validates navigation state between sessions and deep linking
- **Memory Profiling**: JavaScript heap monitoring and memory leak detection
- **Performance Tracking**: Render time measurement and bottleneck identification
- **Back Navigation**: Browser back button and navigation state validation

### Advanced Features
- **20-Second Timeout**: Enforced timeout for all operations as specified
- **Port Management**: Automatic port conflict resolution and cleanup
- **Parallel Testing**: Multi-worker concurrent test execution
- **Cross-Browser Support**: Chrome and Firefox testing capabilities
- **Comprehensive Reporting**: HTML and JSON reports with recommendations

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
cd tests/navigation
npm install

# Or install individual dependency
npm install selenium-webdriver
```

### Basic Usage
```bash
# Run all tests (parallel, headless)
npm test

# Run with GUI (non-headless)
npm run test:gui

# Run sequentially
npm run test:sequential

# Run with verbose output
npm run test:verbose
```

### Specific Test Suites
```bash
# Navigation flows only
npm run test:navigation

# State persistence only
npm run test:state

# Cross-browser testing
npm run test:cross-browser

# Quick test (2 workers, 2min timeout)
npm run test:quick

# Comprehensive test suite
npm run test:comprehensive
```

## 📋 Test Coverage

### Navigation Flow Tests
- **Onboarding Flow**: Splash → Onboarding → Sign In → Dashboard
- **Mood Tracking**: Dashboard → Mood → Tracker → Dashboard  
- **Assessment Flow**: Dashboard → Assessment → Dashboard
- **Therapy Flow**: Dashboard → Wellness → Therapy → Dashboard
- **Chat Therapy**: Dashboard → Chat → Dashboard
- **Dashboard Navigation**: Tab switching between all screens
- **Back Navigation**: Browser back button behavior
- **Deep Linking**: Direct URL navigation to specific screens

### State Persistence Tests
- **Tab Persistence**: State preservation when switching tabs
- **Session Persistence**: State recovery after browser refresh
- **Deep Link State**: URL routing and state initialization
- **Back/Forward Navigation**: Browser history state management
- **Refresh Persistence**: Data retention across page reloads

### Memory Profiling
- **Heap Monitoring**: JavaScript memory usage tracking
- **Memory Leak Detection**: Growth pattern analysis
- **Component Cleanup**: Render optimization monitoring
- **Performance Metrics**: First paint and render timing

## 🔧 Configuration

### Command Line Options
```bash
node index.js [options]

Options:
  --sequential         Run tests sequentially instead of parallel
  --gui               Run with browser GUI (non-headless)
  --verbose           Enable verbose logging
  --cross-browser     Test on multiple browsers
  --no-report         Skip report generation
  --no-save           Don't save results to files
  --suites <suites>   Comma-separated list: navigation,state
  --workers <num>     Number of parallel workers (default: 4)
  --timeout <sec>     Timeout per test in seconds (default: 300)
```

### Environment Variables
```bash
# Expo web server port (default: 8082)
EXPO_WEB_PORT=8082

# Chrome debug port (default: 9222)
CHROME_DEBUG_PORT=9222

# Enable/disable memory profiling
MEMORY_PROFILING=true
```

## 📊 Reports and Output

### Report Types Generated
1. **JSON Reports**: Detailed test results and metrics
2. **HTML Reports**: Visual dashboard with charts and analysis
3. **Text Summaries**: Human-readable performance summaries
4. **Memory Reports**: Heap usage and leak analysis
5. **Bottleneck Reports**: Performance optimization recommendations

### Report Locations
```
test-reports/
├── navigation-analysis/     # Bottleneck and performance reports
├── memory-profiling/        # Memory usage reports
├── parallel-execution/      # Parallel test execution reports
└── navigation-suite/        # Main test suite reports
```

### Sample Output
```
🎯 NAVIGATION TEST SUITE SUMMARY
================================
📋 Tests: 8/8 passed (100.0%)
⏱️ Duration: 45.2 seconds
🔧 Mode: Parallel execution

📊 PERFORMANCE ANALYSIS
=======================
🧠 Memory Efficiency: excellent
⚡ Performance Rating: good
🚨 Critical Issues: 0
🐌 Slowest Screen: assessment (2.1s)
💾 Average Memory: 87.3MB

✅ PERFORMANCE VALIDATION
==========================
🎉 All performance thresholds met!
```

## 🎯 Critical User Journeys Tested

### Mental Health App Specific Flows
1. **New User Onboarding**
   - App launch → Welcome → Sign up → Profile setup → Dashboard
   - Memory tracking during account creation process

2. **Daily Mood Tracking**
   - Dashboard → Mood tracker → Mood selection → Intensity → Notes → Save
   - State persistence of mood data

3. **Mental Health Assessment**
   - Dashboard → Assessment → Questions → Progress → Results → Dashboard
   - Performance monitoring of complex forms

4. **AI Therapy Session**
   - Dashboard → Chat → Conversation → Session end → Dashboard
   - Memory usage during real-time chat

5. **Wellness Activities**
   - Dashboard → Wellness → Activity selection → Participation → Progress tracking
   - Navigation between multiple wellness screens

## ⚡ Performance Thresholds

### Default Limits
- **Max Render Time**: 5 seconds per screen
- **Max Memory Usage**: 200MB average heap size
- **Min Success Rate**: 90% test pass rate
- **Memory Leak Threshold**: 100MB growth between screens
- **Re-render Limit**: 10 re-renders per component

### Monitoring Alerts
- Alert if any screen takes longer than 3 seconds
- Alert if memory usage exceeds 150MB
- Alert if navigation success rate drops below 95%

## 🛠️ Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# The suite handles port conflicts automatically
# To manually check ports:
netstat -ano | findstr :8082  # Windows
lsof -i :8082                 # macOS/Linux
```

**Chrome Driver Issues**
```bash
# Install/update Chrome driver
npm install chromedriver

# Verify Chrome installation
chrome --version
```

**Memory Profiling Not Working**
- Ensure Chrome is running in debug mode
- Check if `performance.memory` API is available
- Use `--verbose` flag to see detailed memory logs

**Tests Timing Out**
```bash
# Increase timeout for slower systems
npm test -- --timeout 600  # 10 minutes

# Run sequentially to reduce resource contention
npm run test:sequential
```

### Debug Mode
```bash
# Run with maximum verbosity
npm run test:verbose

# Run single test suite for debugging
npm run test:navigation -- --gui --verbose
```

## 🔍 Memory Leak Detection

### Automatic Detection
The suite automatically detects:
- Memory growth > 100MB between screen transitions
- Total heap usage > 500MB
- Excessive re-renders (>10 per component)
- Memory not released after navigation

### Manual Analysis
```javascript
// Memory usage is tracked at these points:
// - Initial screen load
// - After user interactions
// - During navigation transitions
// - After cleanup operations
```

## 📈 Performance Optimization

### Recommendations Generated
Based on test results, the suite provides:
- **Immediate Actions**: Critical performance issues
- **Short-term Improvements**: Optimization opportunities
- **Long-term Optimizations**: Architecture improvements
- **Monitoring Guidelines**: Continuous performance tracking

### Example Recommendations
```
IMMEDIATE ACTIONS:
- Fix slow rendering on Assessment screen (8.2s)
- Address memory leak in Mood Tracker (150MB growth)

SHORT-TERM IMPROVEMENTS:
- Implement code splitting for Wellness screens
- Add memoization to Dashboard components

LONG-TERM OPTIMIZATIONS:
- Consider virtualization for large lists
- Implement progressive loading for media content
```

## 🏥 Mental Health App Specific Considerations

### Therapeutic Design Testing
- Validates calming color transitions don't cause performance issues
- Ensures mindfulness animations maintain 60fps
- Tests accessibility features under load

### Privacy and Security
- No sensitive data is logged during testing
- Memory dumps exclude personal information
- Test data uses anonymous/mock content only

### Crisis Support Testing
- Emergency button accessibility under all conditions
- Crisis hotline links tested across all screens
- Immediate access validation during navigation failures

## 🤝 Contributing

### Adding New Tests
1. Create test files in appropriate subdirectories
2. Follow naming convention: `*-tests.js`
3. Implement memory profiling for new flows
4. Add performance thresholds for new screens

### Updating Selectors
Selectors are defined in `config/selenium-config.js`:
```javascript
// Add new screen selectors
screens: {
  newScreen: '[data-testid="new-screen"], .new-screen-container'
}
```

## 📄 License

MIT License - See LICENSE file for details.

---

**🧠 Mental Health Testing Excellence**  
*Ensuring every navigation supports user wellbeing and therapeutic goals*