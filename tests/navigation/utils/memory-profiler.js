/**
 * Memory Profiler for Navigation Flow Testing
 * Tracks JavaScript heap usage, memory leaks, and performance metrics
 */

const fs = require('fs').promises;
const path = require('path');

class MemoryProfiler {
  constructor(driver, config) {
    this.driver = driver;
    this.config = config;
    this.memoryData = [];
    this.performanceData = [];
    this.renderData = [];
    this.isProfilerActive = false;
    this.startTime = null;
    this.currentScreen = null;
    this.baselineMemory = null;
  }

  /**
   * Start memory profiling session
   */
  async startProfiling(sessionName = 'navigation-test') {
    this.sessionName = sessionName;
    this.startTime = Date.now();
    this.isProfilerActive = true;
    this.memoryData = [];
    this.performanceData = [];
    this.renderData = [];
    
    console.log(`🔍 Memory profiling started: ${sessionName}`);
    
    // Get baseline memory
    this.baselineMemory = await this.getCurrentMemoryUsage();
    console.log(`📊 Baseline memory: ${this.baselineMemory.usedJSHeapSize / 1024 / 1024:.2f}MB`);
    
    return this.baselineMemory;
  }

  /**
   * Stop memory profiling and generate report
   */
  async stopProfiling() {
    if (!this.isProfilerActive) return null;
    
    this.isProfilerActive = false;
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    const finalMemory = await this.getCurrentMemoryUsage();
    const memoryDiff = finalMemory.usedJSHeapSize - this.baselineMemory.usedJSHeapSize;
    
    console.log(`🏁 Memory profiling stopped. Duration: ${duration}ms`);
    console.log(`📈 Memory change: ${memoryDiff / 1024 / 1024:.2f}MB`);
    
    const report = await this.generateReport(duration, memoryDiff);
    await this.saveReport(report);
    
    return report;
  }

  /**
   * Get current memory usage from browser
   */
  async getCurrentMemoryUsage() {
    try {
      const memoryInfo = await this.driver.executeScript(`
        if (window.performance && window.performance.memory) {
          return {
            usedJSHeapSize: window.performance.memory.usedJSHeapSize,
            totalJSHeapSize: window.performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
            timestamp: Date.now()
          };
        } else {
          return {
            usedJSHeapSize: 0,
            totalJSHeapSize: 0,
            jsHeapSizeLimit: 0,
            timestamp: Date.now(),
            error: 'Memory API not available'
          };
        }
      `);
      
      return memoryInfo;
    } catch (error) {
      console.warn('⚠️ Could not get memory info:', error.message);
      return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }

  /**
   * Track memory usage for current screen
   */
  async trackMemoryUsage(screenName, action = 'navigation') {
    if (!this.isProfilerActive) return;
    
    const memoryInfo = await this.getCurrentMemoryUsage();
    const timestamp = Date.now();
    const elapsed = timestamp - this.startTime;
    
    const dataPoint = {
      timestamp,
      elapsed,
      screen: screenName,
      action,
      memory: memoryInfo,
      memoryMB: memoryInfo.usedJSHeapSize / 1024 / 1024
    };
    
    this.memoryData.push(dataPoint);
    this.currentScreen = screenName;
    
    // Check for memory leaks
    await this.checkMemoryLeaks(dataPoint);
    
    return dataPoint;
  }

  /**
   * Track rendering performance
   */
  async trackRenderPerformance(screenName, startTime) {
    try {
      const renderMetrics = await this.driver.executeScript(`
        return {
          navigationStart: window.performance.timing.navigationStart,
          domContentLoaded: window.performance.timing.domContentLoadedEventEnd,
          loadComplete: window.performance.timing.loadEventEnd,
          firstPaint: window.performance.getEntriesByType ? 
            window.performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime : null,
          firstContentfulPaint: window.performance.getEntriesByType ? 
            window.performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime : null,
          timestamp: Date.now()
        };
      `);
      
      const renderTime = Date.now() - startTime;
      
      const renderData = {
        screen: screenName,
        renderTime,
        metrics: renderMetrics,
        timestamp: Date.now()
      };
      
      this.renderData.push(renderData);
      
      // Check for slow renders
      if (renderTime > this.config.RENDER_TIMEOUT) {
        console.warn(`⚠️ Slow render detected: ${screenName} took ${renderTime}ms`);
      }
      
      return renderData;
    } catch (error) {
      console.warn('⚠️ Could not get render metrics:', error.message);
      return {
        screen: screenName,
        renderTime: Date.now() - startTime,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Check for memory leaks and performance issues
   */
  async checkMemoryLeaks(dataPoint) {
    if (this.memoryData.length < 2) return;
    
    const previousPoint = this.memoryData[this.memoryData.length - 2];
    const memoryGrowth = dataPoint.memoryMB - previousPoint.memoryMB;
    
    // Check for excessive memory growth
    if (memoryGrowth > this.config.MEMORY_LEAK_THRESHOLD) {
      console.warn(`🚨 Potential memory leak detected: ${memoryGrowth.toFixed(2)}MB growth between ${previousPoint.screen} and ${dataPoint.screen}`);
    }
    
    // Check for excessive total memory usage
    if (dataPoint.memoryMB > this.config.MAX_HEAP_SIZE) {
      console.warn(`🚨 High memory usage: ${dataPoint.memoryMB.toFixed(2)}MB on ${dataPoint.screen}`);
    }
  }

  /**
   * Track component re-renders (if React DevTools is available)
   */
  async trackReRenders(componentName) {
    try {
      const reRenderCount = await this.driver.executeScript(`
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__.rendererInterfaces) {
          // Try to get render count from React DevTools
          return window.__REACT_DEVTOOLS_GLOBAL_HOOK__.rendererInterfaces.get(1)?.getFiberRoots?.()?.size || 0;
        }
        return 0;
      `);
      
      if (reRenderCount > this.config.MAX_RE_RENDERS) {
        console.warn(`⚠️ Excessive re-renders detected for ${componentName}: ${reRenderCount}`);
      }
      
      return reRenderCount;
    } catch (error) {
      // React DevTools not available, skip re-render tracking
      return 0;
    }
  }

  /**
   * Generate comprehensive memory and performance report
   */
  async generateReport(duration, totalMemoryChange) {
    const avgMemoryUsage = this.memoryData.reduce((sum, point) => sum + point.memoryMB, 0) / this.memoryData.length;
    const maxMemoryUsage = Math.max(...this.memoryData.map(point => point.memoryMB));
    const minMemoryUsage = Math.min(...this.memoryData.map(point => point.memoryMB));
    
    const avgRenderTime = this.renderData.reduce((sum, render) => sum + render.renderTime, 0) / this.renderData.length;
    const slowRenders = this.renderData.filter(render => render.renderTime > this.config.RENDER_TIMEOUT);
    
    // Detect memory leaks
    const memoryLeaks = [];
    for (let i = 1; i < this.memoryData.length; i++) {
      const growth = this.memoryData[i].memoryMB - this.memoryData[i-1].memoryMB;
      if (growth > this.config.MEMORY_LEAK_THRESHOLD) {
        memoryLeaks.push({
          from: this.memoryData[i-1].screen,
          to: this.memoryData[i].screen,
          growth: growth.toFixed(2)
        });
      }
    }
    
    return {
      sessionName: this.sessionName,
      duration,
      timestamp: new Date().toISOString(),
      
      // Memory metrics
      memory: {
        baseline: (this.baselineMemory.usedJSHeapSize / 1024 / 1024).toFixed(2),
        final: ((this.baselineMemory.usedJSHeapSize + totalMemoryChange) / 1024 / 1024).toFixed(2),
        totalChange: (totalMemoryChange / 1024 / 1024).toFixed(2),
        average: avgMemoryUsage.toFixed(2),
        peak: maxMemoryUsage.toFixed(2),
        minimum: minMemoryUsage.toFixed(2)
      },
      
      // Performance metrics
      performance: {
        averageRenderTime: avgRenderTime.toFixed(2),
        slowRenders: slowRenders.length,
        slowRenderScreens: slowRenders.map(r => r.screen)
      },
      
      // Issues detected
      issues: {
        memoryLeaks: memoryLeaks.length,
        memoryLeakDetails: memoryLeaks,
        highMemoryUsage: this.memoryData.filter(p => p.memoryMB > this.config.MAX_HEAP_SIZE).length,
        slowRenders: slowRenders.length
      },
      
      // Raw data
      rawData: {
        memoryPoints: this.memoryData.length,
        renderPoints: this.renderData.length,
        screensCovered: [...new Set(this.memoryData.map(p => p.screen))]
      },
      
      // Recommendations
      recommendations: this.generateRecommendations(memoryLeaks, slowRenders, maxMemoryUsage)
    };
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(memoryLeaks, slowRenders, maxMemory) {
    const recommendations = [];
    
    if (memoryLeaks.length > 0) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: `${memoryLeaks.length} potential memory leaks detected. Review component cleanup and useEffect dependencies.`
      });
    }
    
    if (slowRenders.length > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `${slowRenders.length} slow renders detected. Consider implementing React.memo() or useMemo() for expensive components.`
      });
    }
    
    if (maxMemory > this.config.MAX_HEAP_SIZE) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        message: `Peak memory usage (${maxMemory.toFixed(2)}MB) exceeds threshold. Consider lazy loading and component virtualization.`
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        message: 'No major performance or memory issues detected. App is performing well!'
      });
    }
    
    return recommendations;
  }

  /**
   * Save report to file
   */
  async saveReport(report) {
    try {
      const reportsDir = path.join(process.cwd(), 'test-reports', 'memory-profiling');
      await fs.mkdir(reportsDir, { recursive: true });
      
      const fileName = `memory-report-${this.sessionName}-${Date.now()}.json`;
      const filePath = path.join(reportsDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(report, null, 2));
      console.log(`📁 Memory report saved: ${filePath}`);
      
      // Also save a summary
      const summaryPath = path.join(reportsDir, `summary-${this.sessionName}-${Date.now()}.txt`);
      const summary = this.generateTextSummary(report);
      await fs.writeFile(summaryPath, summary);
      
      return filePath;
    } catch (error) {
      console.error('❌ Failed to save memory report:', error);
      return null;
    }
  }

  /**
   * Generate human-readable text summary
   */
  generateTextSummary(report) {
    return `
Memory Profiling Report: ${report.sessionName}
Generated: ${report.timestamp}
Duration: ${report.duration}ms

MEMORY USAGE:
- Baseline: ${report.memory.baseline}MB
- Final: ${report.memory.final}MB  
- Total Change: ${report.memory.totalChange}MB
- Average: ${report.memory.average}MB
- Peak: ${report.memory.peak}MB

PERFORMANCE:
- Average Render Time: ${report.performance.averageRenderTime}ms
- Slow Renders: ${report.performance.slowRenders}

ISSUES DETECTED:
- Memory Leaks: ${report.issues.memoryLeaks}
- High Memory Usage Events: ${report.issues.highMemoryUsage}
- Slow Renders: ${report.issues.slowRenders}

SCREENS TESTED:
${report.rawData.screensCovered.map(screen => `- ${screen}`).join('\n')}

RECOMMENDATIONS:
${report.recommendations.map(rec => `- [${rec.priority.toUpperCase()}] ${rec.message}`).join('\n')}

${report.issues.memoryLeakDetails.length > 0 ? `
MEMORY LEAK DETAILS:
${report.issues.memoryLeakDetails.map(leak => `- ${leak.from} → ${leak.to}: +${leak.growth}MB`).join('\n')}
` : ''}
`.trim();
  }
}

module.exports = MemoryProfiler;