/**
 * Performance Provider - App performance monitoring and optimization
 *
 * Features:
 * - Performance metrics tracking
 * - Memory usage monitoring
 * - Rendering performance optimization
 * - Bundle analysis in development
 * - Network request monitoring
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Platform } from "react-native";

const PerformanceContext = createContext(null);

export const PerformanceProvider = ({ children }) => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    navigationTime: 0,
  });

  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(__DEV__);

  // Performance observer for web
  useEffect(() => {
    if (
      isMonitoringEnabled &&
      Platform.OS === "web" &&
      typeof performance !== "undefined" &&
      typeof PerformanceObserver !== "undefined"
    ) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "measure") {
              console.log(
                `📊 Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`,
              );

              // Update metrics state
              setPerformanceMetrics((prev) => ({
                ...prev,
                [entry.name]: entry.duration,
              }));
            }

            if (entry.entryType === "navigation") {
              console.log(`📊 Navigation: ${entry.duration.toFixed(2)}ms`);
              setPerformanceMetrics((prev) => ({
                ...prev,
                navigationTime: entry.duration,
              }));
            }
          }
        });

        observer.observe({ entryTypes: ["measure", "navigation", "paint"] });

        return () => observer.disconnect();
      } catch (error) {
        console.warn("Performance monitoring not available:", error);
      }
    }
  }, [isMonitoringEnabled]);

  // Memory usage monitoring
  useEffect(() => {
    if (
      isMonitoringEnabled &&
      Platform.OS === "web" &&
      typeof performance !== "undefined" &&
      performance.memory
    ) {
      const checkMemoryUsage = () => {
        const memoryInfo = performance.memory;
        const usedMB = (memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2);

        setPerformanceMetrics((prev) => ({
          ...prev,
          memoryUsage: parseFloat(usedMB),
        }));

        // Log memory warnings
        const usagePercent =
          (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100;
        if (usagePercent > 80) {
          console.warn(`🚨 High memory usage: ${usagePercent.toFixed(1)}%`);
        }
      };

      const interval = setInterval(checkMemoryUsage, 10000); // Check every 10 seconds
      checkMemoryUsage(); // Initial check

      return () => clearInterval(interval);
    }
  }, [isMonitoringEnabled]);

  // Track performance of a function
  const trackPerformance = useCallback(
    (name, fn, options = {}) => {
      if (!isMonitoringEnabled) {
        return fn();
      }

      const { logResult = true, threshold = 100 } = options;

      if (Platform.OS === "web" && typeof performance !== "undefined") {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;

        performance.mark(startMark);
        const startTime = performance.now();

        const result = fn();

        const endTime = performance.now();
        const duration = endTime - startTime;

        performance.mark(endMark);
        performance.measure(name, startMark, endMark);

        if (logResult && duration > threshold) {
          console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        }

        return result;
      } else {
        // React Native - simple timing
        const startTime = Date.now();
        const result = fn();
        const duration = Date.now() - startTime;

        if (logResult && duration > threshold) {
          console.log(`⏱️ ${name}: ${duration}ms`);
        }

        return result;
      }
    },
    [isMonitoringEnabled],
  );

  // Track async performance
  const trackAsyncPerformance = useCallback(
    async (name, asyncFn, options = {}) => {
      if (!isMonitoringEnabled) {
        return await asyncFn();
      }

      const { logResult = true, threshold = 100 } = options;
      const startTime = Platform.OS === "web" ? performance.now() : Date.now();

      try {
        if (Platform.OS === "web" && typeof performance !== "undefined") {
          performance.mark(`${name}-start`);
        }

        const result = await asyncFn();

        const endTime = Platform.OS === "web" ? performance.now() : Date.now();
        const duration = endTime - startTime;

        if (Platform.OS === "web" && typeof performance !== "undefined") {
          performance.mark(`${name}-end`);
          performance.measure(name, `${name}-start`, `${name}-end`);
        }

        if (logResult && duration > threshold) {
          console.log(
            `⏱️ Async ${name}: ${duration.toFixed ? duration.toFixed(2) : duration}ms`,
          );
        }

        return result;
      } catch (error) {
        console.error(`❌ Async ${name} failed:`, error);
        throw error;
      }
    },
    [isMonitoringEnabled],
  );

  // Measure React component render time
  const measureRenderTime = useCallback(
    (componentName) => {
      if (
        !isMonitoringEnabled ||
        Platform.OS !== "web" ||
        typeof performance === "undefined"
      ) {
        return { start: () => {}, end: () => {} };
      }

      const startMark = `${componentName}-render-start`;
      const endMark = `${componentName}-render-end`;

      return {
        start: () => {
          performance.mark(startMark);
        },
        end: () => {
          performance.mark(endMark);
          performance.measure(`${componentName}-render`, startMark, endMark);
        },
      };
    },
    [isMonitoringEnabled],
  );

  // Monitor network requests (web only)
  const monitorNetworkRequests = useCallback(() => {
    if (
      !isMonitoringEnabled ||
      Platform.OS !== "web" ||
      typeof PerformanceObserver === "undefined"
    ) {
      return () => {};
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "resource") {
            const duration = entry.responseEnd - entry.requestStart;
            if (duration > 1000) {
              // Log slow requests
              console.log(
                `🐌 Slow network request: ${entry.name} took ${duration.toFixed(2)}ms`,
              );
            }
          }
        }
      });

      observer.observe({ entryTypes: ["resource"] });

      return () => observer.disconnect();
    } catch (error) {
      console.warn("Network monitoring not available:", error);
      return () => {};
    }
  }, [isMonitoringEnabled]);

  // Get performance report
  const getPerformanceReport = useCallback(() => {
    return {
      metrics: performanceMetrics,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      isMonitoring: isMonitoringEnabled,
    };
  }, [performanceMetrics, isMonitoringEnabled]);

  // Clear performance data
  const clearPerformanceData = useCallback(() => {
    setPerformanceMetrics({
      renderTime: 0,
      memoryUsage: 0,
      navigationTime: 0,
    });

    if (Platform.OS === "web" && typeof performance !== "undefined") {
      try {
        performance.clearMarks();
        performance.clearMeasures();
      } catch (error) {
        console.warn("Failed to clear performance data:", error);
      }
    }
  }, []);

  // Context value
  const contextValue = useMemo(
    () => ({
      // State
      performanceMetrics,
      isMonitoringEnabled,

      // Functions
      trackPerformance,
      trackAsyncPerformance,
      measureRenderTime,
      monitorNetworkRequests,
      getPerformanceReport,
      clearPerformanceData,
      setIsMonitoringEnabled,

      // Utilities
      withPerformanceTracking: (name, component) => {
        if (!isMonitoringEnabled) return component;

        const WrappedComponent = (props) => {
          const renderTimer = measureRenderTime(name);

          useEffect(() => {
            renderTimer.start();
            return () => renderTimer.end();
          });

          return component(props);
        };

        WrappedComponent.displayName = `withPerformanceTracking(${name})`;
        return WrappedComponent;
      },
    }),
    [
      performanceMetrics,
      isMonitoringEnabled,
      trackPerformance,
      trackAsyncPerformance,
      measureRenderTime,
      monitorNetworkRequests,
      getPerformanceReport,
      clearPerformanceData,
    ],
  );

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Custom hook to use performance features
export const usePerformance = () => {
  const context = useContext(PerformanceContext);

  if (!context) {
    console.warn("usePerformance must be used within PerformanceProvider");

    // Return fallback functions to prevent crashes
    return {
      performanceMetrics: { renderTime: 0, memoryUsage: 0, navigationTime: 0 },
      isMonitoringEnabled: false,
      trackPerformance: (name, fn) => fn(),
      trackAsyncPerformance: async (name, fn) => await fn(),
      measureRenderTime: () => ({ start: () => {}, end: () => {} }),
      monitorNetworkRequests: () => () => {},
      getPerformanceReport: () => ({}),
      clearPerformanceData: () => {},
      setIsMonitoringEnabled: () => {},
      withPerformanceTracking: (name, component) => component,
    };
  }

  return context;
};

export default PerformanceProvider;
