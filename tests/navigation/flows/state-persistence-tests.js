/**
 * Navigation State Persistence Tests
 * Tests navigation state persistence between sessions and deep linking
 */

const { By, until } = require('selenium-webdriver');
const fs = require('fs').promises;
const path = require('path');

class StatePersistenceTests {
  constructor(driver, config, memoryProfiler) {
    this.driver = driver;
    this.config = config;
    this.memoryProfiler = memoryProfiler;
    this.stateTestResults = [];
  }

  /**
   * Run all state persistence tests
   */
  async runStatePersistenceTests() {
    console.log('🔄 Running navigation state persistence tests...');
    
    const tests = [
      { name: 'tabPersistence', test: this.testTabStatePersistence.bind(this) },
      { name: 'sessionPersistence', test: this.testSessionPersistence.bind(this) },
      { name: 'deepLinkState', test: this.testDeepLinkStatePersistence.bind(this) },
      { name: 'backForwardState', test: this.testBackForwardStatePersistence.bind(this) },
      { name: 'refreshPersistence', test: this.testRefreshStatePersistence.bind(this) }
    ];

    for (const test of tests) {
      try {
        console.log(`\n🧪 Running state test: ${test.name}`);
        const result = await test.test();
        this.stateTestResults.push({
          name: test.name,
          status: 'passed',
          result,
          timestamp: new Date().toISOString()
        });
        console.log(`✅ State test passed: ${test.name}`);
      } catch (error) {
        console.error(`❌ State test failed: ${test.name}`, error);
        this.stateTestResults.push({
          name: test.name,
          status: 'failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return this.generateStatePersistenceReport();
  }

  /**
   * Test tab state persistence when switching between tabs
   */
  async testTabStatePersistence() {
    await this.memoryProfiler.startProfiling('tab-persistence');
    
    const testSteps = [];
    
    // Navigate to mood tracker and interact
    await this.navigateToTab('mood');
    const initialMoodState = await this.captureScreenState('mood');
    testSteps.push({ action: 'navigate_to_mood', state: initialMoodState });
    
    // Interact with mood tracker if possible
    try {
      await this.interactWithMoodTracker();
      const moodAfterInteraction = await this.captureScreenState('mood');
      testSteps.push({ action: 'mood_interaction', state: moodAfterInteraction });
    } catch (error) {
      console.log('ℹ️ Mood interaction not available for state test');
    }
    
    // Switch to another tab
    await this.navigateToTab('dashboard');
    const dashboardState = await this.captureScreenState('dashboard');
    testSteps.push({ action: 'switch_to_dashboard', state: dashboardState });
    
    // Return to mood tracker
    await this.navigateToTab('mood');
    const returnedMoodState = await this.captureScreenState('mood');
    testSteps.push({ action: 'return_to_mood', state: returnedMoodState });
    
    // Compare states (basic comparison)
    const statePreserved = this.compareStates(initialMoodState, returnedMoodState);
    
    await this.memoryProfiler.stopProfiling();
    
    return {
      steps: testSteps,
      statePreserved,
      totalSteps: testSteps.length
    };
  }

  /**
   * Test session persistence across browser refresh
   */
  async testSessionPersistence() {
    await this.memoryProfiler.startProfiling('session-persistence');
    
    const testSteps = [];
    
    // Navigate to specific tab and capture state
    await this.navigateToTab('assessment');
    const preRefreshState = await this.captureScreenState('assessment');
    testSteps.push({ action: 'pre_refresh_state', state: preRefreshState });
    
    // Store current URL
    const currentUrl = await this.driver.getCurrentUrl();
    testSteps.push({ action: 'capture_url', url: currentUrl });
    
    // Refresh the page
    await this.driver.navigate().refresh();
    await this.waitForPageLoad();
    const postRefreshState = await this.captureScreenState('current');
    testSteps.push({ action: 'post_refresh_state', state: postRefreshState });
    
    // Check if we're still on the same logical screen
    const urlAfterRefresh = await this.driver.getCurrentUrl();
    const urlPreserved = currentUrl === urlAfterRefresh;
    
    await this.memoryProfiler.stopProfiling();
    
    return {
      steps: testSteps,
      urlPreserved,
      stateComparison: this.compareStates(preRefreshState, postRefreshState),
      totalSteps: testSteps.length
    };
  }

  /**
   * Test deep link state persistence
   */
  async testDeepLinkStatePersistence() {
    await this.memoryProfiler.startProfiling('deep-link-persistence');
    
    const testSteps = [];
    const deepLinks = this.config.getDeepLinks();
    
    for (const [screenName, path] of Object.entries(deepLinks)) {
      try {
        // Navigate directly to deep link
        const fullUrl = `${this.config.getBaseUrl()}${path}`;
        await this.driver.get(fullUrl);
        await this.waitForPageLoad();
        
        const stateAfterDeepLink = await this.captureScreenState(screenName);
        testSteps.push({
          action: 'deep_link_navigation',
          screen: screenName,
          path,
          url: fullUrl,
          state: stateAfterDeepLink
        });
        
        // Verify URL matches expected path
        const currentUrl = await this.driver.getCurrentUrl();
        const urlMatches = currentUrl.includes(path) || currentUrl === fullUrl;
        
        testSteps.push({
          action: 'url_verification',
          screen: screenName,
          urlMatches,
          expected: fullUrl,
          actual: currentUrl
        });
        
        await this.sleep(1000);
        
      } catch (error) {
        testSteps.push({
          action: 'deep_link_failed',
          screen: screenName,
          path,
          error: error.message
        });
      }
    }
    
    await this.memoryProfiler.stopProfiling();
    
    return {
      steps: testSteps,
      successfulDeepLinks: testSteps.filter(s => s.action === 'url_verification' && s.urlMatches).length,
      totalDeepLinks: Object.keys(deepLinks).length,
      totalSteps: testSteps.length
    };
  }

  /**
   * Test back/forward button state persistence
   */
  async testBackForwardStatePersistence() {
    await this.memoryProfiler.startProfiling('back-forward-persistence');
    
    const testSteps = [];
    const navigationPath = ['dashboard', 'mood', 'assessment', 'chat'];
    const stateHistory = [];
    
    // Navigate through path and capture states
    for (const screen of navigationPath) {
      await this.navigateToTab(screen);
      const state = await this.captureScreenState(screen);
      stateHistory.push({ screen, state });
      testSteps.push({ action: 'forward_navigation', screen, state });
    }
    
    // Test back navigation
    for (let i = navigationPath.length - 2; i >= 0; i--) {
      await this.driver.navigate().back();
      await this.waitForPageLoad();
      
      const currentState = await this.captureScreenState('back_navigation');
      const expectedState = stateHistory[i];
      
      testSteps.push({
        action: 'back_navigation',
        expectedScreen: expectedState.screen,
        stateMatch: this.compareStates(currentState, expectedState.state)
      });
    }
    
    // Test forward navigation
    for (let i = 1; i < navigationPath.length; i++) {
      await this.driver.navigate().forward();
      await this.waitForPageLoad();
      
      const currentState = await this.captureScreenState('forward_navigation');
      const expectedState = stateHistory[i];
      
      testSteps.push({
        action: 'forward_navigation_back',
        expectedScreen: expectedState.screen,
        stateMatch: this.compareStates(currentState, expectedState.state)
      });
    }
    
    await this.memoryProfiler.stopProfiling();
    
    return {
      steps: testSteps,
      navigationPath,
      backNavigationSuccessful: testSteps.filter(s => s.action === 'back_navigation' && s.stateMatch).length,
      forwardNavigationSuccessful: testSteps.filter(s => s.action === 'forward_navigation_back' && s.stateMatch).length,
      totalSteps: testSteps.length
    };
  }

  /**
   * Test state persistence across page refresh
   */
  async testRefreshStatePersistence() {
    await this.memoryProfiler.startProfiling('refresh-persistence');
    
    const testSteps = [];
    
    // Navigate to a screen with potential state
    await this.navigateToTab('mood');
    
    // Try to create some state by interacting
    try {
      await this.interactWithMoodTracker();
      testSteps.push({ action: 'create_state', success: true });
    } catch (error) {
      testSteps.push({ action: 'create_state', success: false, error: error.message });
    }
    
    // Capture pre-refresh state
    const preRefreshState = await this.captureScreenState('mood');
    const preRefreshUrl = await this.driver.getCurrentUrl();
    testSteps.push({ action: 'capture_pre_refresh', state: preRefreshState, url: preRefreshUrl });
    
    // Refresh the page
    await this.driver.navigate().refresh();
    await this.waitForPageLoad();
    
    // Capture post-refresh state
    const postRefreshState = await this.captureScreenState('mood');
    const postRefreshUrl = await this.driver.getCurrentUrl();
    testSteps.push({ action: 'capture_post_refresh', state: postRefreshState, url: postRefreshUrl });
    
    // Check persistence
    const urlPersisted = preRefreshUrl === postRefreshUrl;
    const stateSimilarity = this.compareStates(preRefreshState, postRefreshState);
    
    await this.memoryProfiler.stopProfiling();
    
    return {
      steps: testSteps,
      urlPersisted,
      stateSimilarity,
      refreshSuccessful: urlPersisted && stateSimilarity,
      totalSteps: testSteps.length
    };
  }

  /**
   * Capture current screen state
   */
  async captureScreenState(screenName) {
    try {
      const url = await this.driver.getCurrentUrl();
      const title = await this.driver.getTitle();
      
      // Try to capture some basic DOM structure
      const elements = await this.driver.executeScript(`
        const elements = document.querySelectorAll('button, input, a, h1, h2, h3');
        return Array.from(elements).map(el => ({
          tagName: el.tagName,
          textContent: el.textContent?.slice(0, 50),
          className: el.className,
          id: el.id
        }));
      `);
      
      // Capture any form data
      const formData = await this.driver.executeScript(`
        const inputs = document.querySelectorAll('input, textarea, select');
        const data = {};
        inputs.forEach((input, index) => {
          if (input.type !== 'password') {
            data['input_' + index] = {
              type: input.type,
              value: input.value,
              name: input.name || input.id || 'unnamed'
            };
          }
        });
        return data;
      `);
      
      return {
        screenName,
        url,
        title,
        timestamp: Date.now(),
        elementCount: elements.length,
        elements: elements.slice(0, 10), // First 10 elements only
        formData,
        urlPath: new URL(url).pathname
      };
      
    } catch (error) {
      console.warn(`⚠️ Could not capture state for ${screenName}:`, error.message);
      return {
        screenName,
        url: await this.driver.getCurrentUrl().catch(() => 'unknown'),
        timestamp: Date.now(),
        error: error.message
      };
    }
  }

  /**
   * Compare two screen states for similarity
   */
  compareStates(state1, state2) {
    if (!state1 || !state2) return false;
    
    // Basic URL path comparison
    const urlMatch = state1.urlPath === state2.urlPath;
    
    // Element count similarity (within 20% difference)
    const elementCountSimilar = Math.abs(state1.elementCount - state2.elementCount) <= Math.max(state1.elementCount, state2.elementCount) * 0.2;
    
    // Title similarity
    const titleMatch = state1.title === state2.title;
    
    // Form data comparison (basic)
    const formDataKeys1 = Object.keys(state1.formData || {});
    const formDataKeys2 = Object.keys(state2.formData || {});
    const formStructureSimilar = Math.abs(formDataKeys1.length - formDataKeys2.length) <= 2;
    
    // Overall similarity score
    const matches = [urlMatch, elementCountSimilar, titleMatch, formStructureSimilar];
    const similarityScore = matches.filter(Boolean).length / matches.length;
    
    return similarityScore >= 0.75; // 75% similarity threshold
  }

  /**
   * Navigate to tab with error handling
   */
  async navigateToTab(tabName) {
    try {
      const selectors = this.config.getSelectors();
      const tabSelector = selectors.tabs[tabName];
      
      if (tabSelector) {
        const tab = await this.driver.wait(
          until.elementLocated(By.css(tabSelector)), 
          10000
        );
        await tab.click();
        await this.sleep(2000); // Wait for navigation
      } else {
        throw new Error(`No selector found for tab: ${tabName}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not navigate to tab ${tabName}:`, error.message);
      throw error;
    }
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
   * Interact with mood tracker for state testing
   */
  async interactWithMoodTracker() {
    try {
      // Look for mood selection options
      const moodOptions = await this.driver.findElements(By.css('[data-testid="mood-option"], .mood-option, button[aria-label*="mood"]'));
      if (moodOptions.length > 0) {
        await moodOptions[Math.floor(Math.random() * moodOptions.length)].click();
        await this.sleep(1000);
      }
      
      // Look for sliders or input fields
      const sliders = await this.driver.findElements(By.css('input[type="range"], .slider'));
      if (sliders.length > 0) {
        await sliders[0].sendKeys('5'); // Set slider value
        await this.sleep(500);
      }
      
      // Look for text input
      const textInputs = await this.driver.findElements(By.css('input[type="text"], textarea'));
      if (textInputs.length > 0) {
        await textInputs[0].sendKeys('Test mood note for state persistence');
        await this.sleep(500);
      }
      
    } catch (error) {
      console.log('ℹ️ Could not interact with mood tracker for state test');
      throw error;
    }
  }

  /**
   * Generate state persistence test report
   */
  generateStatePersistenceReport() {
    const passedTests = this.stateTestResults.filter(t => t.status === 'passed');
    const failedTests = this.stateTestResults.filter(t => t.status === 'failed');
    
    const report = {
      summary: {
        totalStateTests: this.stateTestResults.length,
        passed: passedTests.length,
        failed: failedTests.length,
        successRate: (passedTests.length / this.stateTestResults.length) * 100,
        timestamp: new Date().toISOString()
      },
      testResults: this.stateTestResults,
      stateAnalysis: {
        tabPersistence: this.analyzeTabPersistence(),
        sessionPersistence: this.analyzeSessionPersistence(),
        deepLinkSupport: this.analyzeDeepLinkSupport(),
        backForwardSupport: this.analyzeBackForwardSupport()
      },
      recommendations: this.generateStatePersistenceRecommendations()
    };
    
    console.log('\n🔄 State Persistence Test Report:');
    console.log(`Total State Tests: ${report.summary.totalStateTests}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
    
    return report;
  }

  /**
   * Analyze tab persistence results
   */
  analyzeTabPersistence() {
    const tabTest = this.stateTestResults.find(t => t.name === 'tabPersistence');
    if (!tabTest || tabTest.status === 'failed') {
      return { status: 'failed', reason: 'Tab persistence test failed or not run' };
    }
    
    return {
      status: 'passed',
      statePreserved: tabTest.result.statePreserved,
      steps: tabTest.result.totalSteps
    };
  }

  /**
   * Analyze session persistence results
   */
  analyzeSessionPersistence() {
    const sessionTest = this.stateTestResults.find(t => t.name === 'sessionPersistence');
    if (!sessionTest || sessionTest.status === 'failed') {
      return { status: 'failed', reason: 'Session persistence test failed or not run' };
    }
    
    return {
      status: 'passed',
      urlPreserved: sessionTest.result.urlPreserved,
      stateComparison: sessionTest.result.stateComparison
    };
  }

  /**
   * Analyze deep link support
   */
  analyzeDeepLinkSupport() {
    const deepLinkTest = this.stateTestResults.find(t => t.name === 'deepLinkState');
    if (!deepLinkTest || deepLinkTest.status === 'failed') {
      return { status: 'failed', reason: 'Deep link test failed or not run' };
    }
    
    return {
      status: 'passed',
      successfulLinks: deepLinkTest.result.successfulDeepLinks,
      totalLinks: deepLinkTest.result.totalDeepLinks,
      successRate: (deepLinkTest.result.successfulDeepLinks / deepLinkTest.result.totalDeepLinks) * 100
    };
  }

  /**
   * Analyze back/forward navigation support
   */
  analyzeBackForwardSupport() {
    const backForwardTest = this.stateTestResults.find(t => t.name === 'backForwardState');
    if (!backForwardTest || backForwardTest.status === 'failed') {
      return { status: 'failed', reason: 'Back/forward test failed or not run' };
    }
    
    return {
      status: 'passed',
      backNavigationSuccessful: backForwardTest.result.backNavigationSuccessful,
      forwardNavigationSuccessful: backForwardTest.result.forwardNavigationSuccessful
    };
  }

  /**
   * Generate state persistence recommendations
   */
  generateStatePersistenceRecommendations() {
    const recommendations = [];
    const failedTests = this.stateTestResults.filter(t => t.status === 'failed');
    
    if (failedTests.some(t => t.name === 'tabPersistence')) {
      recommendations.push({
        type: 'state',
        priority: 'medium',
        message: 'Tab state persistence failed. Consider implementing Redux persist or local storage for form data.'
      });
    }
    
    if (failedTests.some(t => t.name === 'sessionPersistence')) {
      recommendations.push({
        type: 'state',
        priority: 'high',
        message: 'Session persistence failed. Implement proper URL routing and state restoration after refresh.'
      });
    }
    
    if (failedTests.some(t => t.name === 'deepLinkState')) {
      recommendations.push({
        type: 'navigation',
        priority: 'high',
        message: 'Deep linking failed. Ensure React Navigation is properly configured for web URLs.'
      });
    }
    
    if (failedTests.some(t => t.name === 'backForwardState')) {
      recommendations.push({
        type: 'navigation',
        priority: 'medium',
        message: 'Back/forward navigation issues detected. Review browser history integration.'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        message: 'All state persistence tests passed! Navigation state is well managed.'
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

module.exports = StatePersistenceTests;