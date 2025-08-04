import { Platform, InteractionManager, DeviceEventEmitter } from 'react-native';

/**
 * Comprehensive Performance Profiler for React Native Mental Health App
 * Provides memory monitoring, render tracking, and performance analytics
 */

class PerformanceProfiler {
  constructor() {
    this.isEnabled = __DEV__;
    this.metrics = {
      renders: new Map(),
      memory: [],
      interactions: [],
      navigation: [],
      bundleLoads: [],
    };
    this.listeners = [];
    this.memoryWarningCount = 0;
    this.startTime = Date.now();
    
    if (this.isEnabled) {
      this.initialize();
    }
  }

  initialize() {
    this.setupMemoryMonitoring();
    this.setupInteractionTracking();
    this.setupNavigationTracking();
    this.startPeriodicReporting();
  }

  setupMemoryMonitoring() {
    // Memory warning listener
    if (Platform.OS === 'ios') {
      const memoryWarningListener = () => {
        this.memoryWarningCount++;
        this.recordMemoryWarning();
      };
      
      DeviceEventEmitter.addListener('memoryWarning', memoryWarningListener);
      this.listeners.push(() => 
        DeviceEventEmitter.removeListener('memoryWarning', memoryWarningListener)
      );
    }

    // Periodic memory sampling
    this.memoryInterval = setInterval(() => {
      this.sampleMemoryUsage();
    }, 5000);
  }

  setupInteractionTracking() {
    const originalRunAfterInteractions = InteractionManager.runAfterInteractions;
    
    InteractionManager.runAfterInteractions = (callback) => {
      const startTime = Date.now();
      
      return originalRunAfterInteractions(() => {
        const endTime = Date.now();
        this.recordInteraction({
          duration: endTime - startTime,
          timestamp: startTime,
        });
        
        if (callback) {
          callback();
        }
      });
    };
  }

  setupNavigationTracking() {
    // This would be integrated with React Navigation
    // For now, we provide a manual tracking method
  }

  // Component render tracking
  trackComponentRender(componentName, renderTime, props = {}) {
    if (!this.isEnabled) return;

    const renderData = this.metrics.renders.get(componentName) || {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      slowRenders: 0,
      lastRender: null,
      props: [],
    };

    renderData.count++;
    renderData.totalTime += renderTime;
    renderData.avgTime = renderData.totalTime / renderData.count;
    renderData.lastRender = Date.now();

    // Track slow renders (> 16ms for 60fps)
    if (renderTime > 16) {
      renderData.slowRenders++;
    }

    // Track prop changes (sample last 5)
    renderData.props.push({
      timestamp: Date.now(),
      props: Object.keys(props).length,
      renderTime,
    });
    
    if (renderData.props.length > 5) {
      renderData.props = renderData.props.slice(-5);
    }

    this.metrics.renders.set(componentName, renderData);

    // Warn about performance issues
    if (renderData.avgTime > 16 && renderData.count > 10) {
      console.warn(`Performance Warning: ${componentName} average render time is ${renderData.avgTime.toFixed(2)}ms`);
    }
  }

  // Memory usage sampling
  sampleMemoryUsage() {
    if (!this.isEnabled) return;

    const memoryInfo = {
      timestamp: Date.now(),
      jsHeapSizeUsed: 0,
      jsHeapSizeTotal: 0,
      jsHeapSizeLimit: 0,
    };

    // Try to get memory info if available
    if (global.performance && global.performance.memory) {
      memoryInfo.jsHeapSizeUsed = global.performance.memory.usedJSHeapSize;
      memoryInfo.jsHeapSizeTotal = global.performance.memory.totalJSHeapSize;
      memoryInfo.jsHeapSizeLimit = global.performance.memory.jsHeapSizeLimit;
    }

    this.metrics.memory.push(memoryInfo);

    // Keep only last 100 samples
    if (this.metrics.memory.length > 100) {
      this.metrics.memory = this.metrics.memory.slice(-100);
    }

    // Check for memory pressure
    if (memoryInfo.jsHeapSizeUsed > memoryInfo.jsHeapSizeLimit * 0.8) {
      console.warn('Memory Warning: High memory usage detected');
    }
  }

  recordMemoryWarning() {
    this.metrics.memory.push({
      timestamp: Date.now(),
      type: 'warning',
      jsHeapSizeUsed: global.performance?.memory?.usedJSHeapSize || 0,
    });

    console.warn(`Memory Warning #${this.memoryWarningCount}: Consider optimizing memory usage`);
  }

  recordInteraction(interactionData) {
    this.metrics.interactions.push({
      ...interactionData,
      id: this.metrics.interactions.length,
    });

    // Keep only last 50 interactions
    if (this.metrics.interactions.length > 50) {
      this.metrics.interactions = this.metrics.interactions.slice(-50);
    }
  }

  recordNavigation(from, to, duration) {
    this.metrics.navigation.push({
      from,
      to,
      duration,
      timestamp: Date.now(),
    });

    // Keep only last 20 navigations
    if (this.metrics.navigation.length > 20) {
      this.metrics.navigation = this.metrics.navigation.slice(-20);
    }
  }

  recordBundleLoad(bundleName, loadTime, size) {
    this.metrics.bundleLoads.push({
      bundleName,
      loadTime,
      size,
      timestamp: Date.now(),
    });
  }

  // Performance analysis
  getPerformanceReport() {
    if (!this.isEnabled) return null;

    const now = Date.now();
    const uptimeMinutes = (now - this.startTime) / 1000 / 60;

    return {
      uptime: uptimeMinutes.toFixed(2) + ' minutes',
      memoryWarnings: this.memoryWarningCount,
      
      renders: {
        totalComponents: this.metrics.renders.size,
        slowComponents: Array.from(this.metrics.renders.entries())
          .filter(([, data]) => data.avgTime > 16)
          .map(([name, data]) => ({
            name,
            avgTime: data.avgTime.toFixed(2) + 'ms',
            slowRenderPercent: ((data.slowRenders / data.count) * 100).toFixed(1) + '%',
          })),
      },

      memory: {
        samples: this.metrics.memory.length,
        current: this.getCurrentMemoryUsage(),
        peak: this.getPeakMemoryUsage(),
        warnings: this.metrics.memory.filter(m => m.type === 'warning').length,
      },

      interactions: {
        total: this.metrics.interactions.length,
        avgDuration: this.getAverageInteractionDuration(),
        slowInteractions: this.metrics.interactions
          .filter(i => i.duration > 100)
          .length,
      },

      navigation: {
        total: this.metrics.navigation.length,
        avgDuration: this.getAverageNavigationDuration(),
        slowNavigations: this.metrics.navigation
          .filter(n => n.duration > 300)
          .map(n => ({ from: n.from, to: n.to, duration: n.duration + 'ms' })),
      },

      bundles: {
        loaded: this.metrics.bundleLoads.length,
        totalLoadTime: this.metrics.bundleLoads
          .reduce((sum, b) => sum + b.loadTime, 0) + 'ms',
        slowLoads: this.metrics.bundleLoads
          .filter(b => b.loadTime > 1000)
          .map(b => ({ name: b.bundleName, time: b.loadTime + 'ms' })),
      },
    };
  }

  getCurrentMemoryUsage() {
    const latest = this.metrics.memory[this.metrics.memory.length - 1];
    return latest ? (latest.jsHeapSizeUsed / 1024 / 1024).toFixed(2) + ' MB' : 'N/A';
  }

  getPeakMemoryUsage() {
    const peak = Math.max(
      ...this.metrics.memory.map(m => m.jsHeapSizeUsed || 0)
    );
    return peak ? (peak / 1024 / 1024).toFixed(2) + ' MB' : 'N/A';
  }

  getAverageInteractionDuration() {
    if (this.metrics.interactions.length === 0) return 'N/A';
    
    const avg = this.metrics.interactions.reduce((sum, i) => sum + i.duration, 0) 
      / this.metrics.interactions.length;
    return avg.toFixed(2) + 'ms';
  }

  getAverageNavigationDuration() {
    if (this.metrics.navigation.length === 0) return 'N/A';
    
    const avg = this.metrics.navigation.reduce((sum, n) => sum + n.duration, 0) 
      / this.metrics.navigation.length;
    return avg.toFixed(2) + 'ms';
  }

  // Performance optimization suggestions
  getOptimizationSuggestions() {
    const suggestions = [];
    
    // Render performance suggestions
    const slowComponents = Array.from(this.metrics.renders.entries())
      .filter(([, data]) => data.avgTime > 16);
    
    if (slowComponents.length > 0) {
      suggestions.push({
        type: 'render',
        priority: 'high',
        message: `${slowComponents.length} components have slow render times. Consider using React.memo or optimizing render logic.`,
        components: slowComponents.map(([name]) => name),
      });
    }

    // Memory suggestions
    if (this.memoryWarningCount > 0) {
      suggestions.push({
        type: 'memory',
        priority: 'high',
        message: `${this.memoryWarningCount} memory warnings detected. Implement memory cleanup and lazy loading.`,
      });
    }

    // Bundle size suggestions
    const largeBundles = this.metrics.bundleLoads.filter(b => b.loadTime > 1000);
    if (largeBundles.length > 0) {
      suggestions.push({
        type: 'bundle',
        priority: 'medium',
        message: `${largeBundles.length} bundles have slow load times. Consider code splitting.`,
        bundles: largeBundles.map(b => b.bundleName),
      });
    }

    return suggestions;
  }

  // Periodic reporting
  startPeriodicReporting() {
    this.reportingInterval = setInterval(() => {
      if (this.isEnabled) {
        const report = this.getPerformanceReport();
        const suggestions = this.getOptimizationSuggestions();
        
        console.group('🚀 Performance Report');
        console.log('📊 Metrics:', report);
        
        if (suggestions.length > 0) {
          console.warn('⚠️ Optimization Suggestions:', suggestions);
        } else {
          console.log('✅ No performance issues detected');
        }
        
        console.groupEnd();
      }
    }, 60000); // Report every minute in development
  }

  // Component decorator for automatic tracking
  trackComponent(Component) {
    if (!this.isEnabled) return Component;

    return class TrackedComponent extends React.Component {
      constructor(props) {
        super(props);
        this.componentName = Component.displayName || Component.name || 'Unknown';
        this.renderStartTime = 0;
      }

      componentDidMount() {
        // Track mount time
        const mountTime = Date.now() - this.renderStartTime;
        profiler.trackComponentRender(this.componentName + '.mount', mountTime, this.props);
      }

      render() {
        this.renderStartTime = Date.now();
        const result = React.createElement(Component, this.props);
        const renderTime = Date.now() - this.renderStartTime;
        
        profiler.trackComponentRender(this.componentName, renderTime, this.props);
        
        return result;
      }
    };
  }

  // Cleanup
  destroy() {
    this.listeners.forEach(removeListener => removeListener());
    
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
    
    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
    }
  }
}

// Global instance
const profiler = new PerformanceProfiler();

// React hook for component performance tracking
export const usePerformanceTracking = (componentName) => {
  if (!__DEV__) return;

  const renderStartRef = React.useRef(0);

  React.useEffect(() => {
    renderStartRef.current = Date.now();
  });

  React.useEffect(() => {
    const renderTime = Date.now() - renderStartRef.current;
    profiler.trackComponentRender(componentName, renderTime);
  });
};

// Higher-order component for automatic tracking
export const withPerformanceTracking = (Component) => {
  return profiler.trackComponent(Component);
};

// Manual tracking functions
export const trackRender = (componentName, renderTime, props) => {
  profiler.trackComponentRender(componentName, renderTime, props);
};

export const trackNavigation = (from, to, duration) => {
  profiler.recordNavigation(from, to, duration);
};

export const trackBundleLoad = (bundleName, loadTime, size) => {
  profiler.recordBundleLoad(bundleName, loadTime, size);
};

export const getPerformanceReport = () => {
  return profiler.getPerformanceReport();
};

export const getOptimizationSuggestions = () => {
  return profiler.getOptimizationSuggestions();
};

export default profiler;