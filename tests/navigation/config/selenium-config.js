/**
 * Selenium WebDriver Configuration for Navigation Flow Testing
 * Mental Health App - Solace AI Mobile
 */

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

class SeleniumConfig {
  constructor() {
    this.DEFAULT_TIMEOUT = 20000; // 20 second timeout as required
    this.MEMORY_CHECK_INTERVAL = 1000; // Check memory every second
    this.RENDER_TIMEOUT = 5000; // Time to wait for screen renders
    this.NAVIGATION_TIMEOUT = 15000; // Navigation specific timeout
    
    // Port management
    this.EXPO_WEB_PORT = 8082;
    this.SELENIUM_HUB_PORT = 4444;
    this.CHROME_DEBUG_PORT = 9222;
    
    // Memory thresholds (in MB)
    this.MEMORY_LEAK_THRESHOLD = 100; // Alert if heap grows by more than 100MB
    this.MAX_HEAP_SIZE = 500; // Alert if total heap exceeds 500MB
    this.MAX_RE_RENDERS = 10; // Alert if component re-renders more than 10 times
  }

  /**
   * Create Chrome WebDriver with memory profiling capabilities
   */
  async createChromeDriver(headless = false) {
    const options = new chrome.Options();
    
    // Chrome arguments for testing
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-web-security');
    options.addArguments('--allow-running-insecure-content');
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--ignore-ssl-errors=yes');
    options.addArguments('--ignore-certificate-errors-spki-list');
    options.addArguments('--ignore-ssl-errors-fatal');
    
    // Memory profiling specific options
    options.addArguments('--enable-memory-info');
    options.addArguments('--enable-precise-memory-info');
    options.addArguments(`--remote-debugging-port=${this.CHROME_DEBUG_PORT}`);
    
    // Performance optimization
    options.addArguments('--disable-background-timer-throttling');
    options.addArguments('--disable-backgrounding-occluded-windows');
    options.addArguments('--disable-renderer-backgrounding');
    
    if (headless) {
      options.addArguments('--headless');
    }
    
    // Set window size for consistent testing
    options.addArguments('--window-size=375,812'); // iPhone X dimensions

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // Set timeouts
    await driver.manage().setTimeouts({
      implicit: this.DEFAULT_TIMEOUT,
      pageLoad: this.DEFAULT_TIMEOUT,
      script: this.DEFAULT_TIMEOUT
    });

    return driver;
  }

  /**
   * Create Firefox WebDriver for cross-browser testing
   */
  async createFirefoxDriver(headless = false) {
    const options = new firefox.Options();
    
    if (headless) {
      options.addArguments('--headless');
    }
    
    // Set window size
    options.addArguments('--width=375');
    options.addArguments('--height=812');

    const driver = await new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(options)
      .build();

    await driver.manage().setTimeouts({
      implicit: this.DEFAULT_TIMEOUT,
      pageLoad: this.DEFAULT_TIMEOUT,
      script: this.DEFAULT_TIMEOUT
    });

    return driver;
  }

  /**
   * Get base URL for testing
   */
  getBaseUrl() {
    return `http://localhost:${this.EXPO_WEB_PORT}`;
  }

  /**
   * Navigation selectors for React Navigation web
   */
  getSelectors() {
    return {
      // Tab navigation
      tabs: {
        welcome: '[data-testid="tab-Cover"], [aria-label="Welcome tab"], .tab-welcome',
        dashboard: '[data-testid="tab-Home"], [aria-label="Dashboard tab"], .tab-home',
        chat: '[data-testid="tab-Chat"], [aria-label="Chat tab"], .tab-chat',
        mood: '[data-testid="tab-Mood"], [aria-label="Mood tab"], .tab-mood',
        assessment: '[data-testid="tab-Assessment"], [aria-label="Assessment tab"], .tab-assessment',
        wellness: '[data-testid="tab-Wellness"], [aria-label="Wellness tab"], .tab-wellness',
        profile: '[data-testid="tab-Profile"], [aria-label="Profile tab"], .tab-profile'
      },
      
      // Screen content identifiers
      screens: {
        splash: '[data-testid="splash-screen"], .splash-container',
        onboarding: '[data-testid="onboarding-screen"], .onboarding-container',
        signIn: '[data-testid="signin-screen"], .signin-container',
        register: '[data-testid="register-screen"], .register-container',
        coverPage: '[data-testid="cover-page"], .cover-container',
        dashboard: '[data-testid="dashboard-screen"], .dashboard-container',
        moodTracker: '[data-testid="mood-tracker"], .mood-tracker-container',
        assessment: '[data-testid="assessment-screen"], .assessment-container',
        chat: '[data-testid="chat-screen"], .chat-container'
      },

      // Interactive elements
      buttons: {
        getStarted: '[data-testid="get-started-btn"], button[aria-label*="Get Started"]',
        signIn: '[data-testid="signin-btn"], button[aria-label*="Sign In"]',
        register: '[data-testid="register-btn"], button[aria-label*="Register"]',
        continue: '[data-testid="continue-btn"], button[aria-label*="Continue"]',
        next: '[data-testid="next-btn"], button[aria-label*="Next"]',
        back: '[data-testid="back-btn"], button[aria-label*="Back"]',
        submit: '[data-testid="submit-btn"], button[aria-label*="Submit"]'
      },

      // Form elements
      forms: {
        email: 'input[type="email"], input[name="email"]',
        password: 'input[type="password"], input[name="password"]',
        confirmPassword: 'input[name="confirmPassword"]',
        moodSlider: '[data-testid="mood-slider"], input[type="range"]',
        moodOptions: '[data-testid="mood-option"], .mood-option'
      },

      // Loading states
      loading: {
        spinner: '[data-testid="loading-spinner"], .loading-spinner',
        progressBar: '[data-testid="progress-bar"], .progress-bar',
        skeleton: '[data-testid="skeleton"], .skeleton-loader'
      }
    };
  }

  /**
   * Deep linking routes for testing
   */
  getDeepLinks() {
    return {
      dashboard: '/dashboard',
      mood: '/mood',
      moodTracker: '/mood/tracker',
      assessment: '/assessment',
      chat: '/chat',
      profile: '/profile',
      wellness: '/wellness',
      therapy: '/wellness/therapy',
      journal: '/journal',
      settings: '/profile/settings'
    };
  }

  /**
   * Expected navigation flows for testing
   */
  getNavigationFlows() {
    return {
      onboarding: [
        'splash',
        'onboarding',
        'signIn',
        'dashboard'
      ],
      newUserRegistration: [
        'splash',
        'onboarding', 
        'register',
        'dashboard'
      ],
      moodTracking: [
        'dashboard',
        'mood',
        'moodTracker',
        'dashboard'
      ],
      assessment: [
        'dashboard',
        'assessment',
        'dashboard'
      ],
      therapy: [
        'dashboard',
        'wellness',
        'therapy',
        'dashboard'
      ],
      chatTherapy: [
        'dashboard',
        'chat',
        'dashboard'
      ]
    };
  }
}

module.exports = SeleniumConfig;