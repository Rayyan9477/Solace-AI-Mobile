/**
 * Parallel Test Runner for Navigation Flow Testing
 * Handles concurrent test execution with port conflict resolution
 */

const cluster = require('cluster');
const os = require('os');
const NavigationFlowTests = require('../flows/navigation-flow-tests');
const StatePersistenceTests = require('../flows/state-persistence-tests');
const TestReporter = require('../reports/test-reporter');
const PortManager = require('../utils/port-manager');
const SeleniumConfig = require('../config/selenium-config');

class ParallelTestRunner {
  constructor(options = {}) {
    this.options = {
      maxWorkers: options.maxWorkers || Math.min(4, os.cpus().length),
      testSuites: options.testSuites || ['navigation', 'state'],
      headless: options.headless !== false, // Default to headless
      timeout: options.timeout || 300000, // 5 minutes per test suite
      retries: options.retries || 1,
      ...options
    };
    
    this.config = new SeleniumConfig();
    this.globalReporter = new TestReporter();
    this.workers = new Map();
    this.testQueue = [];
    this.results = [];
    this.startTime = null;
  }

  /**
   * Run all tests in parallel
   */
  async runParallelTests() {
    this.startTime = Date.now();
    console.log(`🚀 Starting parallel navigation tests with ${this.options.maxWorkers} workers...`);
    
    try {
      // Prepare test queue
      this.prepareTestQueue();
      
      if (cluster.isMaster) {
        return await this.runMaster();
      } else {
        return await this.runWorker();
      }
    } catch (error) {
      console.error('❌ Parallel test execution failed:', error);
      throw error;
    }
  }

  /**
   * Prepare test queue for parallel execution
   */
  prepareTestQueue() {
    const testConfigurations = [];
    
    // Create test configurations for each suite
    this.options.testSuites.forEach((suite, index) => {
      testConfigurations.push({
        id: index,
        suite,
        port: this.config.EXPO_WEB_PORT + (index * 10),
        headless: this.options.headless,
        timeout: this.options.timeout,
        retries: this.options.retries
      });
    });
    
    // Add additional browser configurations if requested
    if (this.options.crossBrowser) {
      const browsers = ['chrome', 'firefox'];
      browsers.forEach((browser, browserIndex) => {
        this.options.testSuites.forEach((suite, suiteIndex) => {
          testConfigurations.push({
            id: testConfigurations.length,
            suite,
            browser,
            port: this.config.EXPO_WEB_PORT + ((browserIndex + 1) * 100) + (suiteIndex * 10),
            headless: this.options.headless,
            timeout: this.options.timeout,
            retries: this.options.retries
          });
        });
      });
    }
    
    this.testQueue = testConfigurations;
    console.log(`📋 Prepared ${this.testQueue.length} test configurations for parallel execution`);
  }

  /**
   * Run master process (orchestrates workers)
   */
  async runMaster() {
    console.log('👑 Master process: Orchestrating parallel test execution...');
    
    return new Promise((resolve, reject) => {
      let completedTests = 0;
      let activeWorkers = 0;
      const workerResults = [];
      const maxWorkers = Math.min(this.options.maxWorkers, this.testQueue.length);
      
      // Set up cluster event handlers
      cluster.on('exit', (worker, code, signal) => {
        console.log(`🔄 Worker ${worker.process.pid} exited with code ${code}`);
        activeWorkers--;
        
        if (code !== 0 && !worker.exitedAfterDisconnect) {
          console.error(`❌ Worker ${worker.process.pid} crashed`);
        }
        
        // Start next test if queue is not empty
        if (this.testQueue.length > 0 && activeWorkers < maxWorkers) {
          this.startWorker();
        }
        
        // Check if all tests are complete
        if (completedTests >= this.testQueue.length && activeWorkers === 0) {
          this.finalizeResults(workerResults).then(resolve).catch(reject);
        }
      });
      
      cluster.on('message', (worker, message) => {
        if (message.type === 'testComplete') {
          completedTests++;
          workerResults.push(message.result);
          console.log(`✅ Test completed: ${message.result.testConfig.suite} (${completedTests}/${this.testQueue.length})`);
          
          // Update global reporter
          this.globalReporter.addReport(message.result.testConfig.suite, message.result);
        } else if (message.type === 'testError') {
          completedTests++;
          workerResults.push({
            testConfig: message.testConfig,
            error: message.error,
            status: 'failed'
          });
          console.error(`❌ Test failed: ${message.testConfig.suite} - ${message.error}`);
        }
      });
      
      // Start initial workers
      for (let i = 0; i < maxWorkers && i < this.testQueue.length; i++) {
        this.startWorker();
      }
      
      // Set overall timeout
      setTimeout(() => {
        if (completedTests < this.testQueue.length) {
          console.error('⏰ Overall test timeout reached, terminating remaining workers');
          cluster.disconnect();
          reject(new Error('Test execution timeout'));
        }
      }, this.options.timeout * this.testQueue.length);
    });
  }

  /**
   * Start a worker process
   */
  startWorker() {
    if (this.testQueue.length === 0) return;
    
    const testConfig = this.testQueue.shift();
    const worker = cluster.fork({
      TEST_CONFIG: JSON.stringify(testConfig),
      WORKER_ID: testConfig.id
    });
    
    this.workers.set(worker.id, { worker, testConfig });
    console.log(`🔧 Started worker ${worker.process.pid} for ${testConfig.suite} test on port ${testConfig.port}`);
  }

  /**
   * Run worker process (executes actual tests)
   */
  async runWorker() {
    const testConfig = JSON.parse(process.env.TEST_CONFIG);
    const workerId = process.env.WORKER_ID;
    
    console.log(`👷 Worker ${process.pid}: Starting ${testConfig.suite} test (ID: ${workerId})`);
    
    let testResult = null;
    let portManager = null;
    
    try {
      // Initialize port manager for this worker
      portManager = new PortManager(this.config);
      
      // Set up dedicated server for this worker
      const serverInfo = await portManager.setupParallelTesting(testConfig.id);
      console.log(`🌐 Worker ${process.pid}: Server ready on ${serverInfo.url}`);
      
      // Update test config with actual port
      testConfig.port = serverInfo.port;
      testConfig.baseUrl = serverInfo.url;
      
      // Run the appropriate test suite
      testResult = await this.executeTestSuite(testConfig, portManager);
      
      // Send result back to master
      process.send({
        type: 'testComplete',
        result: {
          testConfig,
          ...testResult,
          workerId,
          serverInfo
        }
      });
      
    } catch (error) {
      console.error(`❌ Worker ${process.pid} error:`, error);
      
      // Send error back to master
      process.send({
        type: 'testError',
        testConfig,
        error: error.message,
        workerId
      });
    } finally {
      // Cleanup
      if (portManager) {
        await portManager.cleanup();
      }
      
      // Exit worker process
      process.exit(0);
    }
  }

  /**
   * Execute specific test suite
   */
  async executeTestSuite(testConfig, portManager) {
    const { suite, browser = 'chrome', headless, timeout } = testConfig;
    
    // Create WebDriver with specific configuration
    const config = new SeleniumConfig();
    config.EXPO_WEB_PORT = testConfig.port;
    
    let driver;
    if (browser === 'firefox') {
      driver = await config.createFirefoxDriver(headless);
    } else {
      driver = await config.createChromeDriver(headless);
    }
    
    try {
      // Set test-specific timeout
      await driver.manage().setTimeouts({
        implicit: timeout / 10,
        pageLoad: timeout / 5,
        script: timeout / 5
      });
      
      let testResult;
      
      if (suite === 'navigation') {
        // Run navigation flow tests
        const navigationTests = new NavigationFlowTests();
        navigationTests.driver = driver;
        navigationTests.config = config;
        navigationTests.portManager = portManager;
        
        await navigationTests.initialize(headless);
        testResult = await navigationTests.runAllTests();
        await navigationTests.cleanup();
        
      } else if (suite === 'state') {
        // Run state persistence tests
        const navigationTests = new NavigationFlowTests();
        navigationTests.driver = driver;
        navigationTests.config = config;
        navigationTests.portManager = portManager;
        
        await navigationTests.initialize(headless);
        
        const stateTests = new StatePersistenceTests(driver, config, navigationTests.memoryProfiler);
        testResult = await stateTests.runStatePersistenceTests();
        
        await navigationTests.cleanup();
        
      } else {
        throw new Error(`Unknown test suite: ${suite}`);
      }
      
      return {
        suite,
        browser,
        status: 'completed',
        result: testResult,
        duration: Date.now() - this.startTime
      };
      
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  }

  /**
   * Finalize and aggregate all test results
   */
  async finalizeResults(workerResults) {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;
    
    console.log(`🏁 All parallel tests completed in ${totalDuration}ms`);
    
    // Separate successful and failed results
    const successfulResults = workerResults.filter(r => r.status !== 'failed');
    const failedResults = workerResults.filter(r => r.status === 'failed');
    
    // Generate comprehensive report
    const finalReport = {
      summary: {
        totalTests: workerResults.length,
        successful: successfulResults.length,
        failed: failedResults.length,
        duration: totalDuration,
        parallelWorkers: this.options.maxWorkers,
        timestamp: new Date().toISOString()
      },
      results: workerResults,
      performance: {
        averageTestDuration: successfulResults.reduce((sum, r) => sum + (r.duration || 0), 0) / successfulResults.length,
        fastestTest: successfulResults.reduce((min, r) => r.duration < min.duration ? r : min, { duration: Infinity }),
        slowestTest: successfulResults.reduce((max, r) => r.duration > max.duration ? r : max, { duration: 0 })
      },
      parallelEfficiency: this.calculateParallelEfficiency(workerResults, totalDuration),
      bottleneckReport: null // Will be generated
    };
    
    // Generate comprehensive bottleneck analysis
    try {
      finalReport.bottleneckReport = await this.globalReporter.generateNavigationBottleneckReport();
    } catch (error) {
      console.warn('⚠️ Could not generate bottleneck report:', error.message);
    }
    
    // Save final report
    await this.saveFinalReport(finalReport);
    
    // Print summary
    this.printFinalSummary(finalReport);
    
    return finalReport;
  }

  /**
   * Calculate parallel execution efficiency
   */
  calculateParallelEfficiency(results, totalDuration) {
    const successfulResults = results.filter(r => r.status !== 'failed');
    const totalSequentialTime = successfulResults.reduce((sum, r) => sum + (r.duration || 0), 0);
    
    const efficiency = totalSequentialTime > 0 ? (totalSequentialTime / totalDuration) * 100 : 0;
    const theoreticalMaxEfficiency = Math.min(this.options.maxWorkers, results.length) * 100;
    
    return {
      actualEfficiency: efficiency.toFixed(1),
      theoreticalMax: theoreticalMaxEfficiency,
      timeSaved: Math.max(0, totalSequentialTime - totalDuration),
      parallelSpeedup: totalSequentialTime / totalDuration
    };
  }

  /**
   * Save final comprehensive report
   */
  async saveFinalReport(report) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const reportsDir = path.join(process.cwd(), 'test-reports', 'parallel-execution');
      await fs.mkdir(reportsDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `parallel-test-report-${timestamp}.json`;
      const filePath = path.join(reportsDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(report, null, 2));
      
      // Also save a summary
      const summaryPath = path.join(reportsDir, `parallel-summary-${timestamp}.txt`);
      const summary = this.generateTextSummary(report);
      await fs.writeFile(summaryPath, summary);
      
      console.log(`📁 Final parallel test report saved: ${filePath}`);
      
    } catch (error) {
      console.error('❌ Failed to save final report:', error);
    }
  }

  /**
   * Generate text summary
   */
  generateTextSummary(report) {
    const { summary, performance, parallelEfficiency } = report;
    
    return `
PARALLEL NAVIGATION TEST EXECUTION REPORT
Generated: ${summary.timestamp}

EXECUTION SUMMARY
=================
Total Tests: ${summary.totalTests}
Successful: ${summary.successful}
Failed: ${summary.failed}
Success Rate: ${((summary.successful / summary.totalTests) * 100).toFixed(1)}%
Total Duration: ${(summary.duration / 1000).toFixed(1)} seconds
Parallel Workers: ${summary.parallelWorkers}

PERFORMANCE METRICS
===================
Average Test Duration: ${(performance.averageTestDuration / 1000).toFixed(1)} seconds
Fastest Test: ${performance.fastestTest.suite || 'N/A'} (${(performance.fastestTest.duration / 1000).toFixed(1)}s)
Slowest Test: ${performance.slowestTest.suite || 'N/A'} (${(performance.slowestTest.duration / 1000).toFixed(1)}s)

PARALLEL EFFICIENCY
===================
Actual Efficiency: ${parallelEfficiency.actualEfficiency}%
Theoretical Maximum: ${parallelEfficiency.theoreticalMax}%
Time Saved: ${(parallelEfficiency.timeSaved / 1000).toFixed(1)} seconds
Parallel Speedup: ${parallelEfficiency.parallelSpeedup.toFixed(2)}x

FAILED TESTS
============
${report.results.filter(r => r.status === 'failed').map(r => `- ${r.testConfig.suite}: ${r.error}`).join('\n') || 'None'}

RECOMMENDATIONS
===============
${summary.failed > 0 ? '- Investigate and fix failing tests before production deployment' : ''}
${parallelEfficiency.actualEfficiency < 50 ? '- Consider optimizing test execution for better parallel efficiency' : ''}
${performance.slowestTest.duration > 60000 ? '- Review slowest tests for potential optimization opportunities' : ''}
${summary.successful === summary.totalTests ? '- All tests passing! Navigation system is performing well.' : ''}
    `.trim();
  }

  /**
   * Print final summary to console
   */
  printFinalSummary(report) {
    const { summary, performance, parallelEfficiency } = report;
    
    console.log('\n🎯 PARALLEL TEST EXECUTION COMPLETE');
    console.log('=====================================');
    console.log(`📊 Results: ${summary.successful}/${summary.totalTests} tests passed (${((summary.successful / summary.totalTests) * 100).toFixed(1)}%)`);
    console.log(`⏱️ Duration: ${(summary.duration / 1000).toFixed(1)} seconds with ${summary.parallelWorkers} workers`);
    console.log(`🚀 Efficiency: ${parallelEfficiency.actualEfficiency}% (${parallelEfficiency.parallelSpeedup.toFixed(2)}x speedup)`);
    console.log(`💾 Time Saved: ${(parallelEfficiency.timeSaved / 1000).toFixed(1)} seconds compared to sequential execution`);
    
    if (summary.failed > 0) {
      console.log(`\n❌ Failed Tests: ${summary.failed}`);
      report.results.filter(r => r.status === 'failed').forEach(r => {
        console.log(`   - ${r.testConfig.suite}: ${r.error}`);
      });
    }
    
    if (report.bottleneckReport) {
      console.log(`\n📋 Bottleneck Analysis: ${report.bottleneckReport.bottlenecks.criticalIssues.length} critical issues found`);
      console.log(`🧠 Memory Efficiency: ${report.bottleneckReport.memoryAnalysis.memoryEfficiency}`);
      console.log(`⚡ Performance Rating: ${report.bottleneckReport.performanceAnalysis.performanceRating}`);
    }
    
    console.log('\n✅ Parallel test execution completed successfully!');
  }

  /**
   * Static method to create and run parallel tests
   */
  static async run(options = {}) {
    const runner = new ParallelTestRunner(options);
    return await runner.runParallelTests();
  }
}

module.exports = ParallelTestRunner;