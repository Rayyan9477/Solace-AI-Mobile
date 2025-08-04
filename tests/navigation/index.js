/**
 * Main Navigation Flow Test Suite
 * Entry point for comprehensive navigation testing with memory profiling
 */

const NavigationFlowTests = require('./flows/navigation-flow-tests');
const StatePersistenceTests = require('./flows/state-persistence-tests');
const ParallelTestRunner = require('./parallel/parallel-test-runner');
const TestReporter = require('./reports/test-reporter');
const PortManager = require('./utils/port-manager');
const SeleniumConfig = require('./config/selenium-config');

class NavigationTestSuite {
  constructor(options = {}) {
    this.options = {
      // Execution options
      parallel: options.parallel !== false, // Default to parallel
      headless: options.headless !== false, // Default to headless
      maxWorkers: options.maxWorkers || 4,
      timeout: options.timeout || 300000, // 5 minutes
      
      // Test selection
      testSuites: options.testSuites || ['navigation', 'state'],
      crossBrowser: options.crossBrowser || false,
      
      // Reporting options
      generateReport: options.generateReport !== false,
      saveResults: options.saveResults !== false,
      verbose: options.verbose || false,
      
      // Advanced options
      retries: options.retries || 1,
      memoryProfiling: options.memoryProfiling !== false,
      performanceThresholds: {
        maxRenderTime: options.maxRenderTime || 5000,
        maxMemoryUsage: options.maxMemoryUsage || 200, // MB
        minSuccessRate: options.minSuccessRate || 90 // %
      },
      
      ...options
    };
    
    this.config = new SeleniumConfig();
    this.reporter = new TestReporter();
    this.results = null;
  }

  /**
   * Run complete navigation test suite
   */
  async run() {
    console.log('🧭 Starting Solace AI Mobile Navigation Test Suite...');
    console.log(`Configuration: ${this.options.parallel ? 'Parallel' : 'Sequential'} execution, ${this.options.headless ? 'Headless' : 'GUI'} mode`);
    
    const startTime = Date.now();
    
    try {
      // Pre-flight checks
      await this.preflightChecks();
      
      // Run tests
      if (this.options.parallel) {
        this.results = await this.runParallelTests();
      } else {
        this.results = await this.runSequentialTests();
      }
      
      // Post-processing
      await this.postProcessResults();
      
      const duration = Date.now() - startTime;
      console.log(`✅ Navigation test suite completed in ${(duration / 1000).toFixed(1)} seconds`);
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Navigation test suite failed:', error);
      throw error;
    }
  }

  /**
   * Run preflight checks
   */
  async preflightChecks() {
    console.log('🔍 Running preflight checks...');
    
    // Check if required dependencies are available
    try {
      require('selenium-webdriver');
      console.log('✅ Selenium WebDriver available');
    } catch (error) {
      throw new Error('Selenium WebDriver not installed. Run: npm install selenium-webdriver');
    }
    
    // Check port availability
    const portManager = new PortManager(this.config);
    const systemInfo = await portManager.getSystemInfo();
    
    if (this.options.verbose) {
      console.log('📊 System Info:', systemInfo);
    }
    
    // Check if Expo dev server is running or can be started
    const portInUse = await portManager.isPortInUse(this.config.EXPO_WEB_PORT);
    if (portInUse) {
      console.log(`⚠️ Port ${this.config.EXPO_WEB_PORT} is in use - will attempt to use alternative ports`);
    }
    
    console.log('✅ Preflight checks completed');
  }

  /**
   * Run tests in parallel
   */
  async runParallelTests() {
    console.log('🚀 Running tests in parallel mode...');
    
    const parallelRunner = new ParallelTestRunner({
      maxWorkers: this.options.maxWorkers,
      testSuites: this.options.testSuites,
      headless: this.options.headless,
      timeout: this.options.timeout,
      retries: this.options.retries,
      crossBrowser: this.options.crossBrowser
    });
    
    return await parallelRunner.runParallelTests();
  }

  /**
   * Run tests sequentially
   */
  async runSequentialTests() {
    console.log('📚 Running tests in sequential mode...');
    
    const results = {
      summary: {
        totalTests: 0,
        successful: 0,
        failed: 0,
        duration: 0,
        timestamp: new Date().toISOString()
      },
      results: [],
      bottleneckReport: null
    };
    
    const startTime = Date.now();
    
    for (const suite of this.options.testSuites) {
      try {
        console.log(`\n🧪 Running ${suite} test suite...`);
        
        const suiteResult = await this.runSingleTestSuite(suite);
        results.results.push({
          suite,
          status: 'completed',
          result: suiteResult,
          duration: suiteResult.duration || 0
        });
        
        results.summary.successful++;
        
        // Add to reporter
        this.reporter.addReport(suite, suiteResult);
        
      } catch (error) {
        console.error(`❌ ${suite} test suite failed:`, error);
        results.results.push({
          suite,
          status: 'failed',
          error: error.message
        });
        
        results.summary.failed++;
      }
      
      results.summary.totalTests++;
    }
    
    results.summary.duration = Date.now() - startTime;
    
    // Generate bottleneck report
    if (this.options.generateReport) {
      try {
        results.bottleneckReport = await this.reporter.generateNavigationBottleneckReport();
      } catch (error) {
        console.warn('⚠️ Could not generate bottleneck report:', error.message);
      }
    }
    
    return results;
  }

  /**
   * Run a single test suite
   */
  async runSingleTestSuite(suite) {
    const portManager = new PortManager(this.config);
    
    try {
      // Setup server
      const serverInfo = await portManager.startExpoWeb();
      await portManager.waitForServer(serverInfo.url);
      
      // Create and initialize test runner
      const navigationTests = new NavigationFlowTests();
      await navigationTests.initialize(this.options.headless);
      
      let result;
      
      if (suite === 'navigation') {
        result = await navigationTests.runAllTests();
      } else if (suite === 'state') {
        const stateTests = new StatePersistenceTests(
          navigationTests.driver, 
          navigationTests.config, 
          navigationTests.memoryProfiler
        );
        result = await stateTests.runStatePersistenceTests();
      } else {
        throw new Error(`Unknown test suite: ${suite}`);
      }
      
      await navigationTests.cleanup();
      return result;
      
    } finally {
      await portManager.cleanup();
    }
  }

  /**
   * Post-process results and generate reports
   */
  async postProcessResults() {
    if (!this.results) return;
    
    console.log('\n📊 Post-processing results...');
    
    // Validate against performance thresholds
    const validation = this.validatePerformanceThresholds();
    this.results.performanceValidation = validation;
    
    // Generate final summary
    this.printSummary();
    
    // Save results if requested
    if (this.options.saveResults) {
      await this.saveResults();
    }
  }

  /**
   * Validate results against performance thresholds
   */
  validatePerformanceThresholds() {
    const validation = {
      passed: true,
      violations: [],
      warnings: []
    };
    
    if (!this.results || !this.results.bottleneckReport) {
      return validation;
    }
    
    const { performanceAnalysis, memoryAnalysis } = this.results.bottleneckReport;
    const thresholds = this.options.performanceThresholds;
    
    // Check render time threshold
    if (performanceAnalysis.averageRenderTime > thresholds.maxRenderTime) {
      validation.violations.push({
        type: 'performance',
        message: `Average render time (${performanceAnalysis.averageRenderTime.toFixed(0)}ms) exceeds threshold (${thresholds.maxRenderTime}ms)`
      });
      validation.passed = false;
    }
    
    // Check memory usage threshold
    if (memoryAnalysis.averageMemoryUsage > thresholds.maxMemoryUsage) {
      validation.violations.push({
        type: 'memory',
        message: `Average memory usage (${memoryAnalysis.averageMemoryUsage.toFixed(1)}MB) exceeds threshold (${thresholds.maxMemoryUsage}MB)`
      });
      validation.passed = false;
    }
    
    // Check success rate threshold
    const successRate = (this.results.summary.successful / this.results.summary.totalTests) * 100;
    if (successRate < thresholds.minSuccessRate) {
      validation.violations.push({
        type: 'reliability',
        message: `Test success rate (${successRate.toFixed(1)}%) below threshold (${thresholds.minSuccessRate}%)`
      });
      validation.passed = false;
    }
    
    return validation;
  }

  /**
   * Print comprehensive summary
   */
  printSummary() {
    if (!this.results) return;
    
    const { summary } = this.results;
    
    console.log('\n🎯 NAVIGATION TEST SUITE SUMMARY');
    console.log('================================');
    console.log(`📋 Tests: ${summary.successful}/${summary.totalTests} passed (${((summary.successful / summary.totalTests) * 100).toFixed(1)}%)`);
    console.log(`⏱️ Duration: ${(summary.duration / 1000).toFixed(1)} seconds`);
    console.log(`🔧 Mode: ${this.options.parallel ? 'Parallel' : 'Sequential'} execution`);
    
    if (this.results.bottleneckReport) {
      const { memoryAnalysis, performanceAnalysis, bottlenecks } = this.results.bottleneckReport;
      
      console.log('\n📊 PERFORMANCE ANALYSIS');
      console.log('=======================');
      console.log(`🧠 Memory Efficiency: ${memoryAnalysis.memoryEfficiency}`);
      console.log(`⚡ Performance Rating: ${performanceAnalysis.performanceRating}`);
      console.log(`🚨 Critical Issues: ${bottlenecks.criticalIssues.length}`);
      
      if (performanceAnalysis.slowestScreen) {
        console.log(`🐌 Slowest Screen: ${performanceAnalysis.slowestScreen.screen} (${performanceAnalysis.slowestScreen.averageTime.toFixed(0)}ms)`);
      }
      
      if (memoryAnalysis.averageMemoryUsage > 0) {
        console.log(`💾 Average Memory: ${memoryAnalysis.averageMemoryUsage.toFixed(1)}MB`);
      }
    }
    
    // Performance validation summary
    if (this.results.performanceValidation) {
      const validation = this.results.performanceValidation;
      
      console.log('\n✅ PERFORMANCE VALIDATION');
      console.log('==========================');
      
      if (validation.passed) {
        console.log('🎉 All performance thresholds met!');
      } else {
        console.log(`❌ ${validation.violations.length} performance threshold violations:`);
        validation.violations.forEach(violation => {
          console.log(`   - ${violation.type}: ${violation.message}`);
        });
      }
    }
    
    if (summary.failed > 0) {
      console.log('\n❌ FAILED TESTS');
      console.log('================');
      this.results.results.filter(r => r.status === 'failed').forEach(r => {
        console.log(`- ${r.suite}: ${r.error}`);
      });
    }
    
    console.log('\n🚀 Navigation testing complete!');
  }

  /**
   * Save results to files
   */
  async saveResults() {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const reportsDir = path.join(process.cwd(), 'test-reports', 'navigation-suite');
      await fs.mkdir(reportsDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `navigation-test-suite-${timestamp}.json`;
      const filePath = path.join(reportsDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(this.results, null, 2));
      console.log(`📁 Test results saved: ${filePath}`);
      
    } catch (error) {
      console.error('❌ Failed to save results:', error);
    }
  }

  /**
   * Static method to run with CLI options
   */
  static async runFromCLI(argv) {
    const options = {
      parallel: !argv.includes('--sequential'),
      headless: !argv.includes('--gui'),
      verbose: argv.includes('--verbose'),
      crossBrowser: argv.includes('--cross-browser'),
      generateReport: !argv.includes('--no-report'),
      saveResults: !argv.includes('--no-save')
    };
    
    // Parse test suites
    const suiteIndex = argv.indexOf('--suites');
    if (suiteIndex !== -1 && argv[suiteIndex + 1]) {
      options.testSuites = argv[suiteIndex + 1].split(',');
    }
    
    // Parse max workers
    const workersIndex = argv.indexOf('--workers');
    if (workersIndex !== -1 && argv[workersIndex + 1]) {
      options.maxWorkers = parseInt(argv[workersIndex + 1]);
    }
    
    // Parse timeout
    const timeoutIndex = argv.indexOf('--timeout');
    if (timeoutIndex !== -1 && argv[timeoutIndex + 1]) {
      options.timeout = parseInt(argv[timeoutIndex + 1]) * 1000; // Convert to ms
    }
    
    const suite = new NavigationTestSuite(options);
    return await suite.run();
  }
}

// CLI execution
if (require.main === module) {
  NavigationTestSuite.runFromCLI(process.argv)
    .then(results => {
      const successRate = (results.summary.successful / results.summary.totalTests) * 100;
      process.exit(successRate >= 90 ? 0 : 1); // Exit with error if success rate < 90%
    })
    .catch(error => {
      console.error('❌ Test suite execution failed:', error);
      process.exit(1);
    });
}

module.exports = NavigationTestSuite;