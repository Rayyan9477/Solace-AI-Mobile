/**
 * Performance Optimization Utilities
 * Provides tools for monitoring, profiling, and optimizing React Native performance
 */

import React, { useRef, useState, useEffect, useMemo, useCallback, DependencyList } from 'react';
import { InteractionManager } from 'react-native';
import { logger } from './logger';

// ==================== PERFORMANCE MONITORING ====================

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  slowRenders: number;
}

/**
 * Hook to monitor component render performance
 * Logs warnings when component renders slowly or frequently
 */
export function useRenderPerformance(componentName: string, threshold: number = 16): PerformanceMetrics {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    slowRenders: 0,
  });

  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTimeRef.current;
    metricsRef.current.renderCount++;
    metricsRef.current.lastRenderTime = renderTime;

    // Calculate average render time
    const prevAvg = metricsRef.current.averageRenderTime;
    const count = metricsRef.current.renderCount;
    metricsRef.current.averageRenderTime = (prevAvg * (count - 1) + renderTime) / count;

    // Track slow renders (> threshold ms, typically 16ms for 60fps)
    if (renderTime > threshold) {
      metricsRef.current.slowRenders++;
      logger.warn(
        `[Performance] ${componentName} rendered slowly: ${renderTime.toFixed(2)}ms ` +
        `(threshold: ${threshold}ms, total slow renders: ${metricsRef.current.slowRenders})`
      );
    }

    // Warn about excessive renders
    if (metricsRef.current.renderCount % 50 === 0) {
      logger.warn(
        `[Performance] ${componentName} has rendered ${metricsRef.current.renderCount} times. ` +
        `Average: ${metricsRef.current.averageRenderTime.toFixed(2)}ms`
      );
    }

    startTimeRef.current = performance.now();
  });

  return metricsRef.current;
}

/**
 * Hook to track why a component re-rendered
 * Useful for debugging unnecessary re-renders
 */
export function useWhyDidYouUpdate(name: string, props: any) {
  const previousProps = useRef<any>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: any = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        logger.debug(`[WhyDidYouUpdate] ${name}:`, changedProps);
      }
    }

    previousProps.current = props;
  });
}

// ==================== MEMOIZATION UTILITIES ====================

/**
 * Enhanced useMemo with performance tracking
 */
export function useTrackedMemo<T>(
  factory: () => T,
  deps: DependencyList,
  name?: string
): T {
  const startTime = useRef(performance.now());

  return useMemo(() => {
    const computeStart = performance.now();
    const result = factory();
    const computeTime = performance.now() - computeStart;

    if (computeTime > 5) {
      logger.warn(
        `[Performance] useMemo computation in ${name || 'anonymous'} took ${computeTime.toFixed(2)}ms`
      );
    }

    startTime.current = performance.now();
    return result;
  }, deps);
}

/**
 * Enhanced useCallback with performance tracking
 */
export function useTrackedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
  name?: string
): T {
  return useCallback((...args: any[]) => {
    const start = performance.now();
    const result = callback(...args);
    const duration = performance.now() - start;

    if (duration > 10) {
      logger.warn(
        `[Performance] Callback ${name || 'anonymous'} took ${duration.toFixed(2)}ms`
      );
    }

    return result;
  }, deps) as T;
}

// ==================== DEBOUNCING & THROTTLING ====================

/**
 * Debounce a function - delays execution until after wait time has passed
 * Useful for search inputs, window resize, scroll events
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttle a function - limits execution to once per wait time
 * Useful for scroll handlers, mouse move, API calls
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);

  return useCallback(
    ((...args: any[]) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;

        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T,
    [callback, limit]
  );
}

// ==================== INTERACTION MANAGER ====================

/**
 * Defer expensive operations until after interactions are complete
 * Improves perceived performance during animations and user interactions
 */
export function useDeferredValue<T>(value: T): T {
  const [deferredValue, setDeferredValue] = React.useState(value);

  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      setDeferredValue(value);
    });

    return () => handle.cancel();
  }, [value]);

  return deferredValue;
}

/**
 * Execute a callback after interactions are complete
 */
export function useAfterInteractions(callback: () => void, deps: DependencyList = []) {
  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(callback);
    return () => handle.cancel();
  }, deps);
}

// ==================== LAZY LOADING ====================

/**
 * Hook for lazy loading heavy components
 * Only renders component when it becomes visible
 */
export function useLazyRender(shouldRender: boolean = true) {
  const [hasRendered, setHasRendered] = React.useState(false);

  useEffect(() => {
    if (shouldRender && !hasRendered) {
      InteractionManager.runAfterInteractions(() => {
        setHasRendered(true);
      });
    }
  }, [shouldRender, hasRendered]);

  return hasRendered;
}

// ==================== MEMORY MANAGEMENT ====================

/**
 * Track memory usage (development only)
 */
export function useMemoryMonitor(componentName: string, interval: number = 5000) {
  useEffect(() => {
    if (__DEV__ && (performance as any).memory) {
      const memoryInterval = setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
        const totalMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);

        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
          logger.warn(
            `[Memory] ${componentName}: High memory usage - ${usedMB}MB / ${totalMB}MB`
          );
        }
      }, interval);

      return () => clearInterval(memoryInterval);
    }
  }, [componentName, interval]);
}

// ==================== LIST OPTIMIZATION ====================

/**
 * Calculate optimal number of items to render initially
 * Based on screen height and item height
 */
export function useInitialNumToRender(
  itemHeight: number,
  screenHeight: number = 800
): number {
  return useMemo(() => {
    // Render 1.5x screen worth of items initially for better scroll performance
    return Math.ceil((screenHeight * 1.5) / itemHeight);
  }, [itemHeight, screenHeight]);
}

/**
 * Optimize FlatList props for better performance
 */
export function useFlatListOptimization(itemHeight?: number) {
  return useMemo(() => ({
    // Rendering optimizations
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: itemHeight ? Math.ceil((800 * 1.5) / itemHeight) : 10,
    windowSize: 5,

    // Key extraction
    keyExtractor: (item: any, index: number) => item.id?.toString() || index.toString(),

    // Performance callbacks
    getItemLayout: itemHeight
      ? (data: any, index: number) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })
      : undefined,
  }), [itemHeight]);
}

// ==================== EXPORT ====================

export default {
  useRenderPerformance,
  useWhyDidYouUpdate,
  useTrackedMemo,
  useTrackedCallback,
  useDebounce,
  useThrottle,
  useDeferredValue,
  useAfterInteractions,
  useLazyRender,
  useMemoryMonitor,
  useInitialNumToRender,
  useFlatListOptimization,
};
