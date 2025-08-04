/**
 * Comprehensive Test Reporter for Navigation Flow Testing
 * Generates detailed reports on navigation bottlenecks and performance issues
 */

const fs = require('fs').promises;
const path = require('path');

class TestReporter {
  constructor() {
    this.reports = [];
    this.aggregatedData = {
      memory: [],
      performance: [],
      navigation: [],
      state: []
    };
  }

  /**
   * Add test report data
   */
  addReport(type, data) {
    const report = {
      type,
      data,
      timestamp: new Date().toISOString(),
      id: this.generateReportId(type)
    };
    
    this.reports.push(report);
    
    // Aggregate data by type
    if (this.aggregatedData[type]) {
      this.aggregatedData[type].push(data);
    }
    
    return report.id;
  }

  /**
   * Generate comprehensive navigation bottleneck report
   */
  async generateNavigationBottleneckReport() {
    console.log('📊 Generating navigation bottleneck analysis...');
    
    const analysis = {
      overview: this.generateOverview(),
      bottlenecks: this.identifyBottlenecks(),
      memoryAnalysis: this.analyzeMemoryPatterns(),
      performanceAnalysis: this.analyzePerformancePatterns(),
      stateAnalysis: this.analyzeStatePatterns(),
      recommendations: this.generateComprehensiveRecommendations(),
      technicalDetails: this.generateTechnicalDetails(),
      executiveSummary: null // Will be set after analysis
    };
    
    // Generate executive summary based on analysis
    analysis.executiveSummary = this.generateExecutiveSummary(analysis);
    
    // Save report
    const reportPath = await this.saveBottleneckReport(analysis);
    
    // Generate visual summary
    await this.generateVisualSummary(analysis);
    
    console.log(`📁 Navigation bottleneck report saved: ${reportPath}`);
    
    return analysis;
  }

  /**
   * Generate test overview
   */
  generateOverview() {
    const totalReports = this.reports.length;
    const reportsByType = {};
    const timespan = this.getTimespan();
    
    // Count reports by type
    this.reports.forEach(report => {
      reportsByType[report.type] = (reportsByType[report.type] || 0) + 1;
    });
    
    return {
      totalReports,
      reportsByType,
      timespan,
      testEnvironment: this.getTestEnvironment(),
      dataPoints: {
        memory: this.aggregatedData.memory.length,
        performance: this.aggregatedData.performance.length,
        navigation: this.aggregatedData.navigation.length,
        state: this.aggregatedData.state.length
      }
    };
  }

  /**
   * Identify navigation bottlenecks
   */
  identifyBottlenecks() {
    const bottlenecks = {
      slowScreens: [],
      memoryLeaks: [],
      navigationFailures: [],
      stateIssues: [],
      criticalIssues: []
    };

    // Analyze navigation reports for slow screens
    this.aggregatedData.navigation.forEach(navData => {
      if (navData.testResults) {
        navData.testResults.forEach(test => {
          if (test.flowResult && test.flowResult.steps) {
            test.flowResult.steps.forEach(step => {
              if (step.renderTime > 5000) { // 5 second threshold
                bottlenecks.slowScreens.push({
                  screen: step.screen,
                  renderTime: step.renderTime,
                  testName: test.name,
                  severity: step.renderTime > 10000 ? 'critical' : 'warning'
                });
              }
            });
          }
        });
      }
    });

    // Analyze memory reports for leaks
    this.aggregatedData.memory.forEach(memData => {
      if (memData.issues && memData.issues.memoryLeaks > 0) {
        memData.issues.memoryLeakDetails.forEach(leak => {
          bottlenecks.memoryLeaks.push({
            from: leak.from,
            to: leak.to,
            growth: leak.growth,
            severity: parseFloat(leak.growth) > 50 ? 'critical' : 'warning'
          });
        });
      }
    });

    // Analyze navigation failures
    this.aggregatedData.navigation.forEach(navData => {
      if (navData.testResults) {
        const failedTests = navData.testResults.filter(t => t.status === 'failed');
        failedTests.forEach(test => {
          bottlenecks.navigationFailures.push({
            testName: test.name,
            error: test.error,
            severity: 'error'
          });
        });
      }
    });

    // Analyze state persistence issues
    this.aggregatedData.state.forEach(stateData => {
      if (stateData.testResults) {
        const failedStateTests = stateData.testResults.filter(t => t.status === 'failed');
        failedStateTests.forEach(test => {
          bottlenecks.stateIssues.push({
            testName: test.name,
            error: test.error,
            severity: 'warning'
          });
        });
      }
    });

    // Identify critical issues that need immediate attention
    bottlenecks.criticalIssues = [
      ...bottlenecks.slowScreens.filter(s => s.severity === 'critical'),
      ...bottlenecks.memoryLeaks.filter(m => m.severity === 'critical'),
      ...bottlenecks.navigationFailures
    ];

    return bottlenecks;
  }

  /**
   * Analyze memory usage patterns
   */
  analyzeMemoryPatterns() {
    const patterns = {
      averageMemoryUsage: 0,
      peakMemoryUsage: 0,
      memoryGrowthRate: 0,
      screenMemoryImpact: {},
      memoryEfficiency: 'unknown',
      leakProne: []
    };

    if (this.aggregatedData.memory.length === 0) {
      return patterns;
    }

    let totalAverage = 0;
    let totalPeak = 0;
    let totalGrowth = 0;
    const screenMemory = {};

    this.aggregatedData.memory.forEach(memData => {
      if (memData.memory) {
        totalAverage += parseFloat(memData.memory.average) || 0;
        totalPeak = Math.max(totalPeak, parseFloat(memData.memory.peak) || 0);
        totalGrowth += parseFloat(memData.memory.totalChange) || 0;
      }

      // Track memory usage by screen
      if (memData.rawData && memData.rawData.screensCovered) {
        memData.rawData.screensCovered.forEach(screen => {
          if (!screenMemory[screen]) {
            screenMemory[screen] = { usage: [], count: 0 };
          }
          screenMemory[screen].usage.push(parseFloat(memData.memory.average) || 0);
          screenMemory[screen].count++;
        });
      }

      // Identify leak-prone areas
      if (memData.issues && memData.issues.memoryLeaks > 0) {
        memData.issues.memoryLeakDetails.forEach(leak => {
          patterns.leakProne.push(`${leak.from} → ${leak.to}`);
        });
      }
    });

    patterns.averageMemoryUsage = totalAverage / this.aggregatedData.memory.length;
    patterns.peakMemoryUsage = totalPeak;
    patterns.memoryGrowthRate = totalGrowth / this.aggregatedData.memory.length;

    // Calculate screen memory impact
    Object.keys(screenMemory).forEach(screen => {
      const usage = screenMemory[screen].usage;
      patterns.screenMemoryImpact[screen] = {
        average: usage.reduce((a, b) => a + b, 0) / usage.length,
        peak: Math.max(...usage),
        samples: usage.length
      };
    });

    // Determine memory efficiency rating
    if (patterns.averageMemoryUsage < 50) {
      patterns.memoryEfficiency = 'excellent';
    } else if (patterns.averageMemoryUsage < 100) {
      patterns.memoryEfficiency = 'good';
    } else if (patterns.averageMemoryUsage < 200) {
      patterns.memoryEfficiency = 'fair';
    } else {
      patterns.memoryEfficiency = 'poor';
    }

    return patterns;
  }

  /**
   * Analyze performance patterns
   */
  analyzePerformancePatterns() {
    const patterns = {
      averageRenderTime: 0,
      slowestScreen: null,
      fastestScreen: null,
      renderTimeDistribution: {},
      performanceRating: 'unknown',
      optimizationOpportunities: []
    };

    const renderTimes = [];
    const screenRenderTimes = {};

    // Collect render times from navigation data
    this.aggregatedData.navigation.forEach(navData => {
      if (navData.testResults) {
        navData.testResults.forEach(test => {
          if (test.flowResult && test.flowResult.steps) {
            test.flowResult.steps.forEach(step => {
              if (step.renderTime) {
                renderTimes.push(step.renderTime);
                
                if (!screenRenderTimes[step.screen]) {
                  screenRenderTimes[step.screen] = [];
                }
                screenRenderTimes[step.screen].push(step.renderTime);
              }
            });
          }
        });
      }
    });

    if (renderTimes.length > 0) {
      patterns.averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
      
      // Find slowest and fastest screens
      let slowestTime = 0;
      let fastestTime = Infinity;
      
      Object.keys(screenRenderTimes).forEach(screen => {
        const times = screenRenderTimes[screen];
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        
        if (avgTime > slowestTime) {
          slowestTime = avgTime;
          patterns.slowestScreen = { screen, averageTime: avgTime, samples: times.length };
        }
        
        if (avgTime < fastestTime) {
          fastestTime = avgTime;
          patterns.fastestScreen = { screen, averageTime: avgTime, samples: times.length };
        }
        
        patterns.renderTimeDistribution[screen] = {
          average: avgTime,
          min: Math.min(...times),
          max: Math.max(...times),
          samples: times.length
        };
      });

      // Performance rating
      if (patterns.averageRenderTime < 1000) {
        patterns.performanceRating = 'excellent';
      } else if (patterns.averageRenderTime < 2000) {
        patterns.performanceRating = 'good';
      } else if (patterns.averageRenderTime < 3000) {
        patterns.performanceRating = 'fair';
      } else {
        patterns.performanceRating = 'poor';
      }

      // Identify optimization opportunities
      Object.keys(screenRenderTimes).forEach(screen => {
        const times = screenRenderTimes[screen];
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        
        if (avgTime > 3000) {
          patterns.optimizationOpportunities.push({
            screen,
            issue: 'slow_render',
            averageTime: avgTime,
            recommendation: 'Consider code splitting, lazy loading, or component optimization'
          });
        }
      });
    }

    return patterns;
  }

  /**
   * Analyze state persistence patterns
   */
  analyzeStatePatterns() {
    const patterns = {
      overallStateHealth: 'unknown',
      tabPersistenceRate: 0,
      sessionPersistenceRate: 0,
      deepLinkSuccessRate: 0,
      backNavigationSuccessRate: 0,
      stateIssues: [],
      recommendations: []
    };

    if (this.aggregatedData.state.length === 0) {
      return patterns;
    }

    let totalStateTests = 0;
    let passedStateTests = 0;
    const stateTestResults = {};

    this.aggregatedData.state.forEach(stateData => {
      if (stateData.testResults) {
        stateData.testResults.forEach(test => {
          totalStateTests++;
          if (test.status === 'passed') {
            passedStateTests++;
          }
          
          stateTestResults[test.name] = test;
          
          if (test.status === 'failed') {
            patterns.stateIssues.push({
              testName: test.name,
              error: test.error,
              impact: this.getStateIssueImpact(test.name)
            });
          }
        });
      }
    });

    // Calculate specific state persistence rates
    if (stateTestResults.tabPersistence) {
      patterns.tabPersistenceRate = stateTestResults.tabPersistence.status === 'passed' ? 100 : 0;
    }

    if (stateTestResults.sessionPersistence) {
      patterns.sessionPersistenceRate = stateTestResults.sessionPersistence.status === 'passed' ? 100 : 0;
    }

    if (stateTestResults.deepLinkState) {
      const deepLinkTest = stateTestResults.deepLinkState;
      if (deepLinkTest.status === 'passed' && deepLinkTest.result) {
        patterns.deepLinkSuccessRate = (deepLinkTest.result.successfulDeepLinks / deepLinkTest.result.totalDeepLinks) * 100;
      }
    }

    if (stateTestResults.backForwardState) {
      const backForwardTest = stateTestResults.backForwardState;
      if (backForwardTest.status === 'passed' && backForwardTest.result) {
        const backSuccess = backForwardTest.result.backNavigationSuccessful || 0;
        const forwardSuccess = backForwardTest.result.forwardNavigationSuccessful || 0;
        const totalNavigations = backForwardTest.result.navigationPath ? backForwardTest.result.navigationPath.length * 2 : 1;
        patterns.backNavigationSuccessRate = ((backSuccess + forwardSuccess) / totalNavigations) * 100;
      }
    }

    // Overall state health
    const overallSuccessRate = totalStateTests > 0 ? (passedStateTests / totalStateTests) * 100 : 0;
    
    if (overallSuccessRate >= 90) {
      patterns.overallStateHealth = 'excellent';
    } else if (overallSuccessRate >= 75) {
      patterns.overallStateHealth = 'good';
    } else if (overallSuccessRate >= 50) {
      patterns.overallStateHealth = 'fair';
    } else {
      patterns.overallStateHealth = 'poor';
    }

    // Generate state-specific recommendations
    if (patterns.tabPersistenceRate < 100) {
      patterns.recommendations.push('Implement Redux persist or local storage for better tab state management');
    }
    
    if (patterns.sessionPersistenceRate < 100) {
      patterns.recommendations.push('Add proper URL routing and state restoration after page refresh');
    }
    
    if (patterns.deepLinkSuccessRate < 80) {
      patterns.recommendations.push('Review React Navigation configuration for better deep linking support');
    }
    
    if (patterns.backNavigationSuccessRate < 80) {
      patterns.recommendations.push('Improve browser history integration and back button handling');
    }

    return patterns;
  }

  /**
   * Generate comprehensive recommendations
   */
  generateComprehensiveRecommendations() {
    const recommendations = {
      immediate: [], // Critical issues requiring immediate attention
      shortTerm: [], // Issues to address in next sprint
      longTerm: [], // Optimization opportunities
      monitoring: [] // Areas to monitor
    };

    const bottlenecks = this.identifyBottlenecks();
    const memoryPatterns = this.analyzeMemoryPatterns();
    const performancePatterns = this.analyzePerformancePatterns();
    const statePatterns = this.analyzeStatePatterns();

    // Immediate actions (critical issues)
    if (bottlenecks.criticalIssues.length > 0) {
      recommendations.immediate.push({
        priority: 'critical',
        category: 'performance',
        issue: `${bottlenecks.criticalIssues.length} critical performance issues detected`,
        action: 'Investigate and fix slow rendering screens and memory leaks immediately',
        impact: 'User experience severely affected'
      });
    }

    if (bottlenecks.navigationFailures.length > 0) {
      recommendations.immediate.push({
        priority: 'critical',
        category: 'navigation',
        issue: `${bottlenecks.navigationFailures.length} navigation tests failing`,
        action: 'Fix navigation implementation and selectors',
        impact: 'App navigation is broken'
      });
    }

    // Short-term actions
    if (memoryPatterns.memoryEfficiency === 'poor' || memoryPatterns.memoryEfficiency === 'fair') {
      recommendations.shortTerm.push({
        priority: 'high',
        category: 'memory',
        issue: `Memory efficiency rated as ${memoryPatterns.memoryEfficiency}`,
        action: 'Implement component cleanup, optimize re-renders, consider virtualization',
        impact: 'Improved app responsiveness and reduced crashes'
      });
    }

    if (performancePatterns.performanceRating === 'poor' || performancePatterns.performanceRating === 'fair') {
      recommendations.shortTerm.push({
        priority: 'high',
        category: 'performance',
        issue: `Render performance rated as ${performancePatterns.performanceRating}`,
        action: 'Implement code splitting, lazy loading, and component memoization',
        impact: 'Faster screen transitions and better user experience'
      });
    }

    if (statePatterns.overallStateHealth === 'poor' || statePatterns.overallStateHealth === 'fair') {
      recommendations.shortTerm.push({
        priority: 'medium',
        category: 'state',
        issue: `State persistence health rated as ${statePatterns.overallStateHealth}`,
        action: 'Implement proper state management and persistence',
        impact: 'Better user experience across sessions'
      });
    }

    // Long-term optimizations
    if (performancePatterns.optimizationOpportunities.length > 0) {
      recommendations.longTerm.push({
        priority: 'medium',
        category: 'optimization',
        issue: `${performancePatterns.optimizationOpportunities.length} screens could be optimized`,
        action: 'Systematic performance review and optimization of all screens',
        impact: 'Consistently fast user experience'
      });
    }

    recommendations.longTerm.push({
      priority: 'low',
      category: 'monitoring',
      issue: 'Continuous performance monitoring needed',
      action: 'Implement automated performance testing in CI/CD pipeline',
      impact: 'Prevent performance regressions'
    });

    // Monitoring recommendations
    recommendations.monitoring.push({
      category: 'memory',
      metric: 'Memory usage patterns',
      threshold: 'Alert if average memory usage exceeds 150MB',
      frequency: 'Monitor with each release'
    });

    recommendations.monitoring.push({
      category: 'performance',
      metric: 'Screen render times',
      threshold: 'Alert if any screen takes longer than 3 seconds',
      frequency: 'Monitor daily in production'
    });

    recommendations.monitoring.push({
      category: 'navigation',
      metric: 'Navigation success rate',
      threshold: 'Alert if success rate drops below 95%',
      frequency: 'Monitor with each deployment'
    });

    return recommendations;
  }

  /**
   * Generate technical details
   */
  generateTechnicalDetails() {
    return {
      testEnvironment: this.getTestEnvironment(),
      dataCollection: {
        totalDataPoints: this.reports.length,
        memorySnapshots: this.aggregatedData.memory.length,
        performanceMetrics: this.aggregatedData.performance.length,
        navigationTests: this.aggregatedData.navigation.length,
        stateTests: this.aggregatedData.state.length
      },
      tools: {
        webDriver: 'Selenium WebDriver',
        browser: 'Chrome (headless mode supported)',
        memoryProfiling: 'Browser Performance API',
        reporting: 'Custom test reporter'
      },
      configuration: {
        timeout: '20 seconds',
        memoryCheckInterval: '1 second',
        renderTimeout: '5 seconds',
        navigationTimeout: '15 seconds'
      }
    };
  }

  /**
   * Generate executive summary
   */
  generateExecutiveSummary(analysis) {
    const { bottlenecks, memoryAnalysis, performanceAnalysis, stateAnalysis } = analysis;
    
    const criticalIssues = bottlenecks.criticalIssues.length;
    const warningIssues = bottlenecks.slowScreens.filter(s => s.severity === 'warning').length +
                         bottlenecks.memoryLeaks.filter(m => m.severity === 'warning').length +
                         bottlenecks.stateIssues.length;
    
    let overallHealth = 'excellent';
    if (criticalIssues > 0) {
      overallHealth = 'critical';
    } else if (warningIssues > 5) {
      overallHealth = 'poor';
    } else if (warningIssues > 2) {
      overallHealth = 'fair';
    } else if (warningIssues > 0) {
      overallHealth = 'good';
    }
    
    return {
      overallHealth,
      keyFindings: [
        `${criticalIssues} critical issues requiring immediate attention`,
        `Memory efficiency: ${memoryAnalysis.memoryEfficiency}`,
        `Performance rating: ${performanceAnalysis.performanceRating}`,
        `State persistence health: ${stateAnalysis.overallStateHealth}`
      ],
      businessImpact: this.getBusinessImpact(overallHealth, criticalIssues, warningIssues),
      nextActions: this.getNextActions(analysis.recommendations),
      timeline: this.getRecommendedTimeline(criticalIssues, warningIssues)
    };
  }

  /**
   * Get business impact assessment
   */
  getBusinessImpact(overallHealth, criticalIssues, warningIssues) {
    if (overallHealth === 'critical') {
      return {
        userExperience: 'Severely impacted - users may abandon the app',
        performance: 'Poor - significant delays and potential crashes',
        recommendation: 'Immediate intervention required before release'
      };
    } else if (overallHealth === 'poor') {
      return {
        userExperience: 'Negatively impacted - frustrating user experience',
        performance: 'Below acceptable standards',
        recommendation: 'Address issues before production deployment'
      };
    } else if (overallHealth === 'fair') {
      return {
        userExperience: 'Acceptable but could be improved',
        performance: 'Meets minimum requirements',
        recommendation: 'Plan optimizations for next release cycle'
      };
    } else if (overallHealth === 'good') {
      return {
        userExperience: 'Good with minor room for improvement',
        performance: 'Performs well overall',
        recommendation: 'Monitor and maintain current standards'
      };
    } else {
      return {
        userExperience: 'Excellent user experience',
        performance: 'Optimal performance',
        recommendation: 'Maintain current quality standards'
      };
    }
  }

  /**
   * Get next actions based on recommendations
   */
  getNextActions(recommendations) {
    const nextActions = [];
    
    if (recommendations.immediate.length > 0) {
      nextActions.push(`Address ${recommendations.immediate.length} critical issues immediately`);
    }
    
    if (recommendations.shortTerm.length > 0) {
      nextActions.push(`Plan ${recommendations.shortTerm.length} short-term improvements`);
    }
    
    if (recommendations.longTerm.length > 0) {
      nextActions.push(`Schedule ${recommendations.longTerm.length} long-term optimizations`);
    }
    
    nextActions.push('Implement continuous monitoring as recommended');
    
    return nextActions;
  }

  /**
   * Get recommended timeline
   */
  getRecommendedTimeline(criticalIssues, warningIssues) {
    if (criticalIssues > 0) {
      return {
        immediate: 'Fix critical issues within 24-48 hours',
        shortTerm: 'Address remaining issues within 1-2 weeks',
        longTerm: 'Implement optimizations over next 1-2 months'
      };
    } else if (warningIssues > 5) {
      return {
        immediate: 'No critical issues',
        shortTerm: 'Address performance issues within 2-3 weeks',
        longTerm: 'Implement optimizations over next 2-3 months'
      };
    } else {
      return {
        immediate: 'No critical issues',
        shortTerm: 'Address minor issues as part of regular development',
        longTerm: 'Continue with planned optimization roadmap'
      };
    }
  }

  /**
   * Save bottleneck report to file
   */
  async saveBottleneckReport(analysis) {
    try {
      const reportsDir = path.join(process.cwd(), 'test-reports', 'navigation-analysis');
      await fs.mkdir(reportsDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `navigation-bottleneck-report-${timestamp}.json`;
      const filePath = path.join(reportsDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(analysis, null, 2));
      
      // Also save human-readable summary
      const summaryPath = path.join(reportsDir, `navigation-summary-${timestamp}.txt`);
      const summary = this.generateTextSummary(analysis);
      await fs.writeFile(summaryPath, summary);
      
      return filePath;
    } catch (error) {
      console.error('❌ Failed to save bottleneck report:', error);
      return null;
    }
  }

  /**
   * Generate visual summary (HTML report)
   */
  async generateVisualSummary(analysis) {
    try {
      const reportsDir = path.join(process.cwd(), 'test-reports', 'navigation-analysis');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const htmlPath = path.join(reportsDir, `navigation-report-${timestamp}.html`);
      
      const htmlContent = this.generateHTMLReport(analysis);
      await fs.writeFile(htmlPath, htmlContent);
      
      console.log(`📄 HTML report generated: ${htmlPath}`);
      return htmlPath;
    } catch (error) {
      console.error('❌ Failed to generate HTML report:', error);
      return null;
    }
  }

  /**
   * Generate HTML report content
   */
  generateHTMLReport(analysis) {
    const { executiveSummary, bottlenecks, memoryAnalysis, performanceAnalysis, stateAnalysis, recommendations } = analysis;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navigation Flow Test Report - Solace AI Mobile</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; margin: 10px; }
        .critical { background: #d32f2f; }
        .poor { background: #f57c00; }
        .fair { background: #fbc02d; color: #333; }
        .good { background: #388e3c; }
        .excellent { background: #1976d2; }
        .section { margin: 30px 0; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1976d2; }
        .recommendations { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .issue-list { background: #ffebee; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .success-message { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0; color: #2e7d32; }
        .chart-placeholder { background: #f0f0f0; height: 200px; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; font-weight: 600; }
        .timestamp { color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧭 Navigation Flow Test Report</h1>
            <h2>Solace AI Mobile - Mental Health App</h2>
            <div class="status-badge ${executiveSummary.overallHealth}">${executiveSummary.overallHealth.toUpperCase()}</div>
            <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
            <h2>📋 Executive Summary</h2>
            <div class="metric-grid">
                ${executiveSummary.keyFindings.map(finding => `
                    <div class="metric-card">
                        <strong>${finding}</strong>
                    </div>
                `).join('')}
            </div>
            
            <div class="recommendations">
                <h3>Business Impact</h3>
                <p><strong>User Experience:</strong> ${executiveSummary.businessImpact.userExperience}</p>
                <p><strong>Performance:</strong> ${executiveSummary.businessImpact.performance}</p>
                <p><strong>Recommendation:</strong> ${executiveSummary.businessImpact.recommendation}</p>
            </div>
        </div>

        <div class="section">
            <h2>🎯 Critical Issues</h2>
            ${bottlenecks.criticalIssues.length > 0 ? `
                <div class="issue-list">
                    <h3>Immediate Attention Required (${bottlenecks.criticalIssues.length} issues)</h3>
                    <ul>
                        ${bottlenecks.criticalIssues.map(issue => `
                            <li>${issue.screen ? `${issue.screen}: ` : ''}${issue.renderTime ? `${issue.renderTime}ms render time` : issue.error || 'Performance issue'}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : `
                <div class="success-message">
                    ✅ No critical issues detected! App navigation is performing well.
                </div>
            `}
        </div>

        <div class="section">
            <h2>📊 Performance Analysis</h2>
            <div class="metric-grid">
                <div class="metric-card">
                    <h4>Overall Rating</h4>
                    <div class="status-badge ${performanceAnalysis.performanceRating}">${performanceAnalysis.performanceRating.toUpperCase()}</div>
                </div>
                <div class="metric-card">
                    <h4>Average Render Time</h4>
                    <p>${performanceAnalysis.averageRenderTime ? performanceAnalysis.averageRenderTime.toFixed(0) + 'ms' : 'N/A'}</p>
                </div>
                <div class="metric-card">
                    <h4>Slowest Screen</h4>
                    <p>${performanceAnalysis.slowestScreen ? `${performanceAnalysis.slowestScreen.screen} (${performanceAnalysis.slowestScreen.averageTime.toFixed(0)}ms)` : 'N/A'}</p>
                </div>
                <div class="metric-card">
                    <h4>Fastest Screen</h4>
                    <p>${performanceAnalysis.fastestScreen ? `${performanceAnalysis.fastestScreen.screen} (${performanceAnalysis.fastestScreen.averageTime.toFixed(0)}ms)` : 'N/A'}</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🧠 Memory Analysis</h2>
            <div class="metric-grid">
                <div class="metric-card">
                    <h4>Memory Efficiency</h4>
                    <div class="status-badge ${memoryAnalysis.memoryEfficiency}">${memoryAnalysis.memoryEfficiency.toUpperCase()}</div>
                </div>
                <div class="metric-card">
                    <h4>Average Usage</h4>
                    <p>${memoryAnalysis.averageMemoryUsage ? memoryAnalysis.averageMemoryUsage.toFixed(1) + 'MB' : 'N/A'}</p>
                </div>
                <div class="metric-card">
                    <h4>Peak Usage</h4>
                    <p>${memoryAnalysis.peakMemoryUsage ? memoryAnalysis.peakMemoryUsage.toFixed(1) + 'MB' : 'N/A'}</p>
                </div>
                <div class="metric-card">
                    <h4>Memory Leaks</h4>
                    <p>${bottlenecks.memoryLeaks.length} detected</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🔄 State Persistence</h2>
            <div class="metric-grid">
                <div class="metric-card">
                    <h4>Overall Health</h4>
                    <div class="status-badge ${stateAnalysis.overallStateHealth}">${stateAnalysis.overallStateHealth.toUpperCase()}</div>
                </div>
                <div class="metric-card">
                    <h4>Deep Link Success</h4>
                    <p>${stateAnalysis.deepLinkSuccessRate ? stateAnalysis.deepLinkSuccessRate.toFixed(0) + '%' : 'N/A'}</p>
                </div>
                <div class="metric-card">
                    <h4>Session Persistence</h4>
                    <p>${stateAnalysis.sessionPersistenceRate ? stateAnalysis.sessionPersistenceRate.toFixed(0) + '%' : 'N/A'}</p>
                </div>
                <div class="metric-card">
                    <h4>Back Navigation</h4>
                    <p>${stateAnalysis.backNavigationSuccessRate ? stateAnalysis.backNavigationSuccessRate.toFixed(0) + '%' : 'N/A'}</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>💡 Recommendations</h2>
            
            ${recommendations.immediate.length > 0 ? `
                <div class="recommendations">
                    <h3>🚨 Immediate Actions (Critical)</h3>
                    <ul>
                        ${recommendations.immediate.map(rec => `
                            <li><strong>${rec.category}:</strong> ${rec.action}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${recommendations.shortTerm.length > 0 ? `
                <div class="recommendations">
                    <h3>📅 Short-term Actions (1-2 weeks)</h3>
                    <ul>
                        ${recommendations.shortTerm.map(rec => `
                            <li><strong>${rec.category}:</strong> ${rec.action}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${recommendations.longTerm.length > 0 ? `
                <div class="recommendations">
                    <h3>🎯 Long-term Optimizations</h3>
                    <ul>
                        ${recommendations.longTerm.map(rec => `
                            <li><strong>${rec.category}:</strong> ${rec.action}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>

        <div class="section">
            <h2>⏰ Recommended Timeline</h2>
            <table>
                <tr>
                    <th>Timeframe</th>
                    <th>Actions</th>
                </tr>
                <tr>
                    <td><strong>Immediate</strong></td>
                    <td>${executiveSummary.timeline.immediate}</td>
                </tr>
                <tr>
                    <td><strong>Short-term</strong></td>
                    <td>${executiveSummary.timeline.shortTerm}</td>
                </tr>
                <tr>
                    <td><strong>Long-term</strong></td>
                    <td>${executiveSummary.timeline.longTerm}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>📈 Next Steps</h2>
            <ol>
                ${executiveSummary.nextActions.map(action => `<li>${action}</li>`).join('')}
            </ol>
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate text summary
   */
  generateTextSummary(analysis) {
    const { executiveSummary, bottlenecks, memoryAnalysis, performanceAnalysis, stateAnalysis } = analysis;
    
    return `
NAVIGATION FLOW TEST REPORT - SOLACE AI MOBILE
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
=================
Overall Health: ${executiveSummary.overallHealth.toUpperCase()}

Key Findings:
${executiveSummary.keyFindings.map(f => `- ${f}`).join('\n')}

Business Impact:
- User Experience: ${executiveSummary.businessImpact.userExperience}
- Performance: ${executiveSummary.businessImpact.performance}
- Recommendation: ${executiveSummary.businessImpact.recommendation}

CRITICAL ISSUES
===============
${bottlenecks.criticalIssues.length > 0 ? 
  bottlenecks.criticalIssues.map(issue => `- ${issue.screen || 'Unknown'}: ${issue.renderTime ? issue.renderTime + 'ms' : issue.error}`).join('\n') :
  'No critical issues detected.'}

PERFORMANCE ANALYSIS
===================
- Overall Rating: ${performanceAnalysis.performanceRating.toUpperCase()}
- Average Render Time: ${performanceAnalysis.averageRenderTime ? performanceAnalysis.averageRenderTime.toFixed(0) + 'ms' : 'N/A'}
- Slowest Screen: ${performanceAnalysis.slowestScreen ? `${performanceAnalysis.slowestScreen.screen} (${performanceAnalysis.slowestScreen.averageTime.toFixed(0)}ms)` : 'N/A'}
- Fastest Screen: ${performanceAnalysis.fastestScreen ? `${performanceAnalysis.fastestScreen.screen} (${performanceAnalysis.fastestScreen.averageTime.toFixed(0)}ms)` : 'N/A'}

MEMORY ANALYSIS
===============
- Memory Efficiency: ${memoryAnalysis.memoryEfficiency.toUpperCase()}
- Average Usage: ${memoryAnalysis.averageMemoryUsage ? memoryAnalysis.averageMemoryUsage.toFixed(1) + 'MB' : 'N/A'}
- Peak Usage: ${memoryAnalysis.peakMemoryUsage ? memoryAnalysis.peakMemoryUsage.toFixed(1) + 'MB' : 'N/A'}
- Memory Leaks: ${bottlenecks.memoryLeaks.length} detected

STATE PERSISTENCE
=================
- Overall Health: ${stateAnalysis.overallStateHealth.toUpperCase()}
- Deep Link Success: ${stateAnalysis.deepLinkSuccessRate ? stateAnalysis.deepLinkSuccessRate.toFixed(0) + '%' : 'N/A'}
- Session Persistence: ${stateAnalysis.sessionPersistenceRate ? stateAnalysis.sessionPersistenceRate.toFixed(0) + '%' : 'N/A'}
- Back Navigation Success: ${stateAnalysis.backNavigationSuccessRate ? stateAnalysis.backNavigationSuccessRate.toFixed(0) + '%' : 'N/A'}

RECOMMENDATIONS
===============

Immediate Actions:
${analysis.recommendations.immediate.map(rec => `- ${rec.category}: ${rec.action}`).join('\n') || 'None required'}

Short-term Actions:
${analysis.recommendations.shortTerm.map(rec => `- ${rec.category}: ${rec.action}`).join('\n') || 'None required'}

Long-term Optimizations:
${analysis.recommendations.longTerm.map(rec => `- ${rec.category}: ${rec.action}`).join('\n') || 'None required'}

TIMELINE
========
Immediate: ${executiveSummary.timeline.immediate}
Short-term: ${executiveSummary.timeline.shortTerm}
Long-term: ${executiveSummary.timeline.longTerm}

NEXT STEPS
==========
${executiveSummary.nextActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}
    `.trim();
  }

  /**
   * Helper methods
   */
  generateReportId(type) {
    return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getTimespan() {
    if (this.reports.length === 0) return null;
    
    const timestamps = this.reports.map(r => new Date(r.timestamp));
    const earliest = new Date(Math.min(...timestamps));
    const latest = new Date(Math.max(...timestamps));
    
    return {
      start: earliest.toISOString(),
      end: latest.toISOString(),
      duration: latest - earliest
    };
  }

  getTestEnvironment() {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };
  }

  getStateIssueImpact(testName) {
    const impactMap = {
      'tabPersistence': 'medium',
      'sessionPersistence': 'high',
      'deepLinkState': 'high', 
      'backForwardState': 'medium',
      'refreshPersistence': 'medium'
    };
    
    return impactMap[testName] || 'low';
  }
}

module.exports = TestReporter;