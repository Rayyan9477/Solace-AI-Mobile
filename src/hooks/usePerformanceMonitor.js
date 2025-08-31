import { useEffect, useRef, useState, useCallback } from "react";
import { AppState, DeviceEventEmitter } from "react-native";

/**
 * Performance monitoring hook for React Native applications
 * Tracks render times, memory usage, and component performance metrics
 */
export const usePerformanceMonitor = (componentName) => {
  const renderStartTime = useRef(null);
  const mountTime = useRef(null);
  const renderCount = useRef(0);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderTime: 0,
    renderCount: 0,
    mountTime: 0,
    isLagging: false,
  });

  // Start render timing
  const startRenderTimer = useCallback(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  }, []);

  // End render timing
  const endRenderTimer = useCallback(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;

      setPerformanceMetrics((prev) => ({
        ...prev,
        renderTime,
        renderCount: renderCount.current,
        isLagging: renderTime > 16.67, // 60fps threshold
      }));

      // Log slow renders in development
      if (__DEV__ && renderTime > 16.67) {
        console.warn(
          `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`,
        );
      }

      renderStartTime.current = null;
    }
  }, [componentName]);

  // Memory usage monitoring
  const [memoryInfo, setMemoryInfo] = useState({
    used: 0,
    available: 0,
    percentage: 0,
  });

  const checkMemoryUsage = useCallback(async () => {
    try {
      // Simulate memory checking (real implementation would use native modules)
      const mockMemoryInfo = {
        used: Math.round(Math.random() * 100),
        available: Math.round(Math.random() * 200 + 100),
        percentage: Math.round(Math.random() * 50 + 20),
      };
      setMemoryInfo(mockMemoryInfo);
    } catch (error) {
      if (__DEV__) {
        console.warn("Memory monitoring unavailable:", error);
      }
    }
  }, []);

  // Track mount time
  useEffect(() => {
    mountTime.current = performance.now();
    startRenderTimer();

    return () => {
      const totalMountTime = performance.now() - mountTime.current;
      if (__DEV__) {
        console.log(
          `📊 Component ${componentName} performance:
          - Mount time: ${totalMountTime.toFixed(2)}ms
          - Total renders: ${renderCount.current}
          - Last render: ${performanceMetrics.renderTime.toFixed(2)}ms`,
        );
      }
    };
  }, [componentName, startRenderTimer, performanceMetrics.renderTime]);

  // End timing after each render
  useEffect(() => {
    endRenderTimer();
  });

  // Memory monitoring interval
  useEffect(() => {
    checkMemoryUsage();
    const memoryInterval = setInterval(checkMemoryUsage, 10000); // Check every 10s

    return () => clearInterval(memoryInterval);
  }, [checkMemoryUsage]);

  return {
    performanceMetrics,
    memoryInfo,
    startRenderTimer,
    endRenderTimer,
  };
};

/**
 * Hook to detect and prevent memory leaks in React Native components
 */
export const useMemoryLeakDetector = (componentName) => {
  const refs = useRef(new Set());
  const timers = useRef(new Set());
  const listeners = useRef(new Set());

  const registerRef = useCallback((ref) => {
    if (ref) {
      refs.current.add(ref);
    }
  }, []);

  const registerTimer = useCallback((timerId) => {
    if (timerId) {
      timers.current.add(timerId);
    }
    return timerId;
  }, []);

  const registerListener = useCallback((listener) => {
    if (listener) {
      listeners.current.add(listener);
    }
    return listener;
  }, []);

  // Cleanup all registered resources
  const cleanup = useCallback(() => {
    // Clear timers
    timers.current.forEach((timerId) => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    timers.current.clear();

    // Remove listeners
    listeners.current.forEach((listener) => {
      if (listener && typeof listener.remove === "function") {
        listener.remove();
      }
    });
    listeners.current.clear();

    // Clear refs
    refs.current.clear();

    if (__DEV__) {
      console.log(`🧹 Cleaned up resources for ${componentName}`);
    }
  }, [componentName]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    registerRef,
    registerTimer,
    registerListener,
    cleanup,
  };
};

/**
 * Bundle size and lazy loading performance tracker
 */
export const useBundlePerformance = (bundleName) => {
  const [bundleMetrics, setBundleMetrics] = useState({
    loadTime: 0,
    size: 0,
    cached: false,
  });

  const trackBundleLoad = useCallback(
    (startTime, endTime, size = 0) => {
      const loadTime = endTime - startTime;

      setBundleMetrics({
        loadTime,
        size,
        cached: loadTime < 50, // Assume cached if very fast
      });

      if (__DEV__) {
        console.log(
          `📦 Bundle ${bundleName} loaded: ${loadTime.toFixed(2)}ms (${size > 0 ? `${(size / 1024).toFixed(2)}KB` : "unknown size"})`,
        );
      }
    },
    [bundleName],
  );

  return {
    bundleMetrics,
    trackBundleLoad,
  };
};

/**
 * Frame rate and animation performance monitor
 */
export const useFrameRateMonitor = () => {
  const [frameRate, setFrameRate] = useState(60);
  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);

  const measureFrameRate = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime.current;

    if (deltaTime >= 1000) {
      // Update every second
      const currentFrameRate = Math.round(
        (frameCount.current * 1000) / deltaTime,
      );
      setFrameRate(currentFrameRate);

      if (__DEV__ && currentFrameRate < 55) {
        console.warn(`📉 Low frame rate detected: ${currentFrameRate}fps`);
      }

      frameCount.current = 0;
      lastFrameTime.current = currentTime;
    } else {
      frameCount.current++;
    }
  }, []);

  useEffect(() => {
    const animation = () => {
      measureFrameRate();
      requestAnimationFrame(animation);
    };

    const animationId = requestAnimationFrame(animation);

    return () => cancelAnimationFrame(animationId);
  }, [measureFrameRate]);

  return frameRate;
};

/**
 * Network performance monitoring for API calls
 */
export const useNetworkPerformance = () => {
  const [networkMetrics, setNetworkMetrics] = useState({
    latency: 0,
    bandwidth: 0,
    requests: 0,
  });

  const trackNetworkRequest = useCallback(
    (url, startTime, endTime, size = 0) => {
      const latency = endTime - startTime;
      const bandwidth = size > 0 ? (size * 8) / (latency / 1000) : 0; // bits per second

      setNetworkMetrics((prev) => ({
        latency,
        bandwidth,
        requests: prev.requests + 1,
      }));

      if (__DEV__) {
        console.log(
          `🌐 Network request to ${url}: ${latency.toFixed(2)}ms${bandwidth > 0 ? ` (${(bandwidth / 1000000).toFixed(2)} Mbps)` : ""}`,
        );
      }
    },
    [],
  );

  return {
    networkMetrics,
    trackNetworkRequest,
  };
};

/**
 * Component render optimization hook
 * Provides utilities for memoization and render prevention
 */
export const useRenderOptimization = (dependencies = []) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  // Track unnecessary renders
  useEffect(() => {
    renderCount.current++;
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime.current;

    if (__DEV__ && timeSinceLastRender < 16 && renderCount.current > 1) {
      console.warn(
        `⚡ Potential unnecessary render (${timeSinceLastRender.toFixed(2)}ms since last)`,
      );
    }

    lastRenderTime.current = now;
  });

  // Memoization helpers
  const memoizedValue = useCallback((fn, deps) => {
    return useMemo(fn, deps);
  }, []);

  const memoizedCallback = useCallback((fn, deps) => {
    return useCallback(fn, deps);
  }, []);

  return {
    renderCount: renderCount.current,
    memoizedValue,
    memoizedCallback,
  };
};
