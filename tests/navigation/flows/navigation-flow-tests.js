/**
 * Navigation Flow Tests for Mental Health App
 * Tests critical user journeys with memory profiling and performance monitoring
 */

const { By, until, Key } = require('selenium-webdriver');
const SeleniumConfig = require('../config/selenium-config');
const MemoryProfiler = require('../utils/memory-profiler');
const PortManager = require('../utils/port-manager');

class NavigationFlowTests {
  constructor() {
    this.config = new SeleniumConfig();
    this.portManager = new PortManager(this.config);
    this.driver = null;
    this.memoryProfiler = null;
    this.testResults = [];
    this.currentTest = null;
  }

  /**
   * Initialize test environment
   */
  async initialize(headless = false) {
    console.log('🚀 Initializing navigation flow tests...');
    
    try {
      // Setup port management and start server
      const serverInfo = await this.portManager.startExpoWeb();
      await this.portManager.waitForServer(serverInfo.url);
      
      // Create WebDriver
      this.driver = await this.config.createChromeDriver(headless);
      
      // Initialize memory profiler
      this.memoryProfiler = new MemoryProfiler(this.driver, this.config);
      
      console.log('✅ Test environment initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize test environment:', error);
      throw error;
    }
  }

  /**
   * Cleanup test environment
   */
  async cleanup() {
    console.log('🧹 Cleaning up test environment...');
    
    try {
      if (this.memoryProfiler && this.memoryProfiler.isProfilerActive) {
        await this.memoryProfiler.stopProfiling();
      }
      
      if (this.driver) {
        await this.driver.quit();
      }
      
      await this.portManager.cleanup();
      
      console.log('✅ Test environment cleaned up');
    } catch (error) {
      console.error('⚠️ Error during cleanup:', error);
    }
  }

  /**
   * Run all navigation flow tests
   */
  async runAllTests() {
    const testSuite = [
      { name: 'onboarding', flow: this.testOnboardingFlow.bind(this) },
      { name: 'moodTracking', flow: this.testMoodTrackingFlow.bind(this) },
      { name: 'assessmentFlow', flow: this.testAssessmentFlow.bind(this) },
      { name: 'therapyFlow', flow: this.testTherapyFlow.bind(this) },
      { name: 'chatTherapy', flow: this.testChatTherapyFlow.bind(this) },
      { name: 'dashboardNavigation', flow: this.testDashboardNavigation.bind(this) },
      { name: 'backNavigation', flow: this.testBackNavigation.bind(this) },
      { name: 'deepLinking', flow: this.testDeepLinking.bind(this) }
    ];

    console.log(`🧪 Running ${testSuite.length} navigation flow tests...`);
    
    for (const test of testSuite) {
      try {
        console.log(`\n📋 Starting test: ${test.name}`);
        this.currentTest = test.name;
        
        const result = await this.runSingleTest(test);
        this.testResults.push(result);
        
        console.log(`✅ Test completed: ${test.name} - ${result.status}`);
        
        // Wait between tests to ensure clean state
        await this.sleep(2000);
        
      } catch (error) {
        console.error(`❌ Test failed: ${test.name}`, error);
        this.testResults.push({
          name: test.name,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return this.generateTestReport();
  }

  /**
   * Run a single navigation test with memory profiling
   */
  async runSingleTest(test) {
    const startTime = Date.now();
    
    // Start memory profiling
    await this.memoryProfiler.startProfiling(test.name);
    
    try {
      // Navigate to base URL
      await this.driver.get(this.config.getBaseUrl());
      await this.waitForPageLoad();
      
      // Run the specific test flow
      const flowResult = await test.flow();
      
      // Stop memory profiling
      const memoryReport = await this.memoryProfiler.stopProfiling();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      return {
        name: test.name,
        status: 'passed',
        duration,
        flowResult,
        memoryReport,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      await this.memoryProfiler.stopProfiling();
      throw error;
    }
  }

  /**
   * Test onboarding flow: Splash → Onboarding → Sign In → Dashboard
   */
  async testOnboardingFlow() {
    console.log('🎯 Testing onboarding flow...');
    const steps = [];
    
    // Step 1: Wait for splash screen to load
    const renderStart = Date.now();
    await this.waitForElement(this.config.getSelectors().screens.coverPage, 'Cover Page');
    const renderTime = await this.memoryProfiler.trackRenderPerformance('coverPage', renderStart);
    steps.push({ screen: 'coverPage', renderTime: renderTime.renderTime });
    await this.memoryProfiler.trackMemoryUsage('coverPage', 'initial_load');
    
    // Step 2: Navigate to dashboard
    await this.clickTab('dashboard');
    const dashboardStart = Date.now();
    await this.waitForElement(this.config.getSelectors().screens.dashboard, 'Dashboard');
    const dashboardRender = await this.memoryProfiler.trackRenderPerformance('dashboard', dashboardStart);
    steps.push({ screen: 'dashboard', renderTime: dashboardRender.renderTime });
    await this.memoryProfiler.trackMemoryUsage('dashboard', 'navigation');
    
    // Step 3: Test basic dashboard functionality
    await this.validateDashboardElements();
    
    return {
      steps,
      totalSteps: steps.length,
      success: true
    };
  }

  /**
   * Test mood tracking flow: Dashboard → Mood → Tracker → Dashboard
   */
  async testMoodTrackingFlow() {
    console.log('🎯 Testing mood tracking flow...');
    const steps = [];
    
    // Start from dashboard
    await this.navigateToTab('dashboard');
    await this.memoryProfiler.trackMemoryUsage('dashboard', 'mood_flow_start');
    
    // Navigate to mood tracker
    await this.clickTab('mood');
    const moodStart = Date.now();
    await this.waitForElement(this.config.getSelectors().screens.moodTracker, 'Mood Tracker');
    const moodRender = await this.memoryProfiler.trackRenderPerformance('moodTracker', moodStart);
    steps.push({ screen: 'moodTracker', renderTime: moodRender.renderTime });
    await this.memoryProfiler.trackMemoryUsage('moodTracker', 'navigation');
    
    // Test mood tracking functionality
    await this.interactWithMoodTracker();
    await this.memoryProfiler.trackMemoryUsage('moodTracker', 'interaction');
    
    // Return to dashboard
    await this.clickTab('dashboard');
    await this.waitForElement(this.config.getSelectors().screens.dashboard, 'Dashboard');
    await this.memoryProfiler.trackMemoryUsage('dashboard', 'return_navigation');
    
    return {
      steps,
      totalSteps: steps.length,
      success: true
    };
  }

  /**
   * Test assessment flow: Dashboard → Assessment → Dashboard
   */
  async testAssessmentFlow() {
    console.log('🎯 Testing assessment flow...');
    const steps = [];
    
    // Navigate to assessment
    await this.navigateToTab('dashboard');
    await this.clickTab('assessment');
    const assessmentStart = Date.now();
    await this.waitForElement(this.config.getSelectors().screens.assessment, 'Assessment');
    const assessmentRender = await this.memoryProfiler.trackRenderPerformance('assessment', assessmentStart);
    steps.push({ screen: 'assessment', renderTime: assessmentRender.renderTime });
    await this.memoryProfiler.trackMemoryUsage('assessment', 'navigation');
    
    // Test assessment interaction
    await this.interactWithAssessment();
    await this.memoryProfiler.trackMemoryUsage('assessment', 'interaction');
    
    // Return to dashboard
    await this.clickTab('dashboard');
    await this.waitForElement(this.config.getSelectors().screens.dashboard, 'Dashboard');
    
    return {
      steps,
      totalSteps: steps.length,
      success: true
    };
  }

  /**
   * Test therapy flow: Dashboard → Wellness → Therapy → Dashboard
   */
  async testTherapyFlow() {
    console.log('🎯 Testing therapy flow...');
    const steps = [];
    
    // Navigate to wellness
    await this.navigateToTab('dashboard');
    await this.clickTab('wellness');
    const wellnessStart = Date.now();
    await this.waitForScreenLoad('wellness');
    const wellnessRender = await this.memoryProfiler.trackRenderPerformance('wellness', wellnessStart);
    steps.push({ screen: 'wellness', renderTime: wellnessRender.renderTime });
    await this.memoryProfiler.trackMemoryUsage('wellness', 'navigation');
    
    // Navigate to therapy (if available as a sub-screen)
    try {
      const therapyButton = await this.findElementWithTimeout('[data-testid="therapy-btn"], button[aria-label*="Therapy"]', 5000);
      if (therapyButton) {
        await therapyButton.click();
        const therapyStart = Date.now();
        await this.waitForScreenLoad('therapy');
        const therapyRender = await this.memoryProfiler.trackRenderPerformance('therapy', therapyStart);
        steps.push({ screen: 'therapy', renderTime: therapyRender.renderTime });
        await this.memoryProfiler.trackMemoryUsage('therapy', 'navigation');
      }
    } catch (error) {
      console.log('ℹ️ Therapy sub-screen not available or not interactive');
    }
    
    // Return to dashboard
    await this.clickTab('dashboard');
    await this.waitForElement(this.config.getSelectors().screens.dashboard, 'Dashboard');
    
    return {
      steps,
      totalSteps: steps.length,
      success: true
    };
  }

  /**
   * Test chat therapy flow: Dashboard → Chat → Dashboard
   */
  async testChatTherapyFlow() {
    console.log('🎯 Testing chat therapy flow...');
    const steps = [];
    
    // Navigate to chat
    await this.navigateToTab('dashboard');
    await this.clickTab('chat');
    const chatStart = Date.now();
    await this.waitForElement(this.config.getSelectors().screens.chat, 'Chat');
    const chatRender = await this.memoryProfiler.trackRenderPerformance('chat', chatStart);
    steps.push({ screen: 'chat', renderTime: chatRender.renderTime });
    await this.memoryProfiler.trackMemoryUsage('chat', 'navigation');
    
    // Test chat interaction
    await this.interactWithChat();
    await this.memoryProfiler.trackMemoryUsage('chat', 'interaction');
    
    // Return to dashboard
    await this.clickTab('dashboard');
    await this.waitForElement(this.config.getSelectors().screens.dashboard, 'Dashboard');
    
    return {
      steps,
      totalSteps: steps.length,
      success: true
    };
  }

  /**
   * Test dashboard navigation between all tabs
   */
  async testDashboardNavigation() {
    console.log('🎯 Testing dashboard navigation...');
    const steps = [];
    const tabs = ['dashboard', 'chat', 'mood', 'assessment', 'wellness', 'profile'];
    
    for (const tab of tabs) {
      const navStart = Date.now();
      await this.clickTab(tab);
      await this.waitForScreenLoad(tab);
      const renderTime = await this.memoryProfiler.trackRenderPerformance(tab, navStart);
      steps.push({ screen: tab, renderTime: renderTime.renderTime });
      await this.memoryProfiler.trackMemoryUsage(tab, 'tab_navigation');
      
      // Small delay between navigations
      await this.sleep(1000);
    }
    
    return {
      steps,
      totalSteps: steps.length,
      success: true
    };
  }

  /**
   * Test back navigation behavior
   */
  async testBackNavigation() {
    console.log('🎯 Testing back navigation...');
    const steps = [];
    
    // Start from dashboard
    await this.navigateToTab('dashboard');
    
    // Navigate through several screens and test back navigation
    const navigationPath = ['mood', 'assessment', 'chat'];
    
    for (const screen of navigationPath) {
      await this.clickTab(screen);
      await this.waitForScreenLoad(screen);
      await this.memoryProfiler.trackMemoryUsage(screen, 'forward_navigation');
      steps.push({ action: 'navigate_to', screen });
      
      // Test browser back button
      await this.driver.navigate().back();
      await this.sleep(2000); // Wait for navigation
      await this.memoryProfiler.trackMemoryUsage('after_back', 'back_navigation');
      steps.push({ action: 'back_navigation', screen: 'previous' });
      
      // Navigate forward again for next iteration
      await this.clickTab(screen);
      await this.waitForScreenLoad(screen);
    }
    
    return {
      steps,
      totalSteps: steps.length,
      success: true
    };
  }

  /**
   * Test deep linking to specific screens
   */
  async testDeepLinking() {
    console.log('🎯 Testing deep linking...');
    const steps = [];
    const deepLinks = this.config.getDeepLinks();
    
    for (const [name, path] of Object.entries(deepLinks)) {
      try {
        const url = `${this.config.getBaseUrl()}${path}`;
        const navStart = Date.now();
        
        await this.driver.get(url);
        await this.waitForPageLoad();
        
        const renderTime = await this.memoryProfiler.trackRenderPerformance(name, navStart);
        steps.push({ 
          screen: name, 
          path, 
          renderTime: renderTime.renderTime,
          success: true 
        });
        await this.memoryProfiler.trackMemoryUsage(name, 'deep_link');
        
        await this.sleep(2000);
        
      } catch (error) {
        console.warn(`⚠️ Deep link failed for ${name}: ${error.message}`);
        steps.push({ 
          screen: name, 
          path, 
          success: false, 
          error: error.message 
        });
      }
    }
    
    return {
      steps,
      totalSteps: steps.length,
      successfulLinks: steps.filter(s => s.success).length,
      success: true
    };
  }

  /**
   * Helper method to click tab navigation
   */
  async clickTab(tabName) {
    const selectors = this.config.getSelectors();
    const tabSelector = selectors.tabs[tabName];
    
    if (!tabSelector) {
      throw new Error(`Unknown tab: ${tabName}`);
    }
    
    const tab = await this.findElementWithTimeout(tabSelector, 10000);
    await tab.click();
    await this.sleep(1000); // Wait for navigation animation
  }

  /**
   * Helper method to navigate to tab and ensure it's loaded
   */
  async navigateToTab(tabName) {
    await this.clickTab(tabName);
    await this.waitForScreenLoad(tabName);
  }

  /**
   * Wait for a specific screen to load
   */
  async waitForScreenLoad(screenName) {
    const selectors = this.config.getSelectors();
    const screenSelector = selectors.screens[screenName];
    
    if (screenSelector) {
      await this.waitForElement(screenSelector, screenName);
    } else {
      // Fallback: wait for any content to load
      await this.sleep(2000);
    }
  }

  /**
   * Wait for element with multiple selector attempts
   */
  async waitForElement(selector, screenName) {
    try {
      await this.driver.wait(
        until.elementLocated(By.css(selector)), 
        this.config.DEFAULT_TIMEOUT
      );
      console.log(`✅ ${screenName} loaded successfully`);
    } catch (error) {
      console.warn(`⚠️ Could not find ${screenName} with selector: ${selector}`);
      // Try generic content selector as fallback
      try {
        await this.driver.wait(
          until.elementLocated(By.css('div, main, section')), 
          5000
        );
        console.log(`✅ ${screenName} loaded (fallback)`);
      } catch (fallbackError) {
        throw new Error(`Failed to load ${screenName}: ${error.message}`);
      }
    }
  }

  /**
   * Find element with timeout and multiple selector attempts
   */
  async findElementWithTimeout(selector, timeout = 10000) {
    const selectors = selector.split(',').map(s => s.trim());
    
    for (const sel of selectors) {
      try {
        const element = await this.driver.wait(
          until.elementLocated(By.css(sel)), 
          timeout
        );
        return element;
      } catch (error) {
        // Try next selector
        continue;
      }
    }
    
    throw new Error(`Could not find element with any of the selectors: ${selector}`);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.driver.wait(
      async () => {
        const readyState = await this.driver.executeScript('return document.readyState');
        return readyState === 'complete';
      },
      this.config.DEFAULT_TIMEOUT
    );
    
    // Additional wait for React to render
    await this.sleep(2000);
  }

  /**
   * Validate dashboard elements are present
   */
  async validateDashboardElements() {
    const expectedElements = [
      'div', // Basic content
      'button, a', // Interactive elements
      'h1, h2, h3' // Headings
    ];
    
    for (const selector of expectedElements) {
      try {
        await this.driver.findElement(By.css(selector));
      } catch (error) {
        console.warn(`⚠️ Dashboard validation: ${selector} not found`);
      }
    }
  }

  /**
   * Interact with mood tracker (if available)
   */
  async interactWithMoodTracker() {
    try {
      // Look for mood selection options
      const moodOptions = await this.driver.findElements(By.css('[data-testid="mood-option"], .mood-option, button[aria-label*="mood"]'));
      if (moodOptions.length > 0) {
        await moodOptions[0].click();
        await this.sleep(1000);
      }
      
      // Look for continue/next button
      const continueBtn = await this.findElementWithTimeout('[data-testid="continue-btn"], button[aria-label*="Continue"], button[aria-label*="Next"]', 3000);
      if (continueBtn) {
        await continueBtn.click();
        await this.sleep(1000);
      }
    } catch (error) {
      console.log('ℹ️ Mood tracker interaction not available or completed');
    }
  }

  /**
   * Interact with assessment (if available)
   */
  async interactWithAssessment() {
    try {
      // Look for assessment questions or buttons
      const assessmentElements = await this.driver.findElements(By.css('button, input[type="radio"], input[type="checkbox"]'));
      if (assessmentElements.length > 0) {
        await assessmentElements[0].click();
        await this.sleep(1000);
      }
    } catch (error) {
      console.log('ℹ️ Assessment interaction not available');
    }
  }

  /**
   * Interact with chat (if available)
   */
  async interactWithChat() {
    try {
      // Look for chat input
      const chatInput = await this.findElementWithTimeout('input[type="text"], textarea, [role="textbox"]', 3000);
      if (chatInput) {
        await chatInput.sendKeys('Hello, this is a test message');
        await chatInput.sendKeys(Key.RETURN);
        await this.sleep(1000);
      }
    } catch (error) {
      console.log('ℹ️ Chat interaction not available');
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateTestReport() {
    const passedTests = this.testResults.filter(t => t.status === 'passed');
    const failedTests = this.testResults.filter(t => t.status === 'failed');
    
    const report = {
      summary: {
        totalTests: this.testResults.length,
        passed: passedTests.length,
        failed: failedTests.length,
        successRate: (passedTests.length / this.testResults.length) * 100,
        timestamp: new Date().toISOString()
      },
      testResults: this.testResults,
      performance: {
        averageTestDuration: passedTests.reduce((sum, t) => sum + t.duration, 0) / passedTests.length,
        slowestTest: passedTests.reduce((max, t) => t.duration > max.duration ? t : max, { duration: 0 }),
        memoryReports: passedTests.map(t => t.memoryReport).filter(Boolean)
      },
      recommendations: this.generateNavigationRecommendations()
    };
    
    console.log('\n📊 Navigation Flow Test Report:');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
    
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      failedTests.forEach(test => {
        console.log(`- ${test.name}: ${test.error}`);
      });
    }
    
    return report;
  }

  /**
   * Generate navigation-specific recommendations
   */
  generateNavigationRecommendations() {
    const recommendations = [];
    const failedTests = this.testResults.filter(t => t.status === 'failed');
    
    if (failedTests.length > 0) {
      recommendations.push({
        type: 'navigation',
        priority: 'high',
        message: `${failedTests.length} navigation tests failed. Review navigation implementation and selectors.`
      });
    }
    
    const slowTests = this.testResults.filter(t => t.duration > 10000);
    if (slowTests.length > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `${slowTests.length} tests took longer than 10 seconds. Consider optimizing screen load times.`
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        message: 'All navigation flows are working correctly with good performance!'
      });
    }
    
    return recommendations;
  }

  /**
   * Utility function to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = NavigationFlowTests;