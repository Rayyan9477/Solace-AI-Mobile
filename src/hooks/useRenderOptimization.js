import { useRef, useCallback, useMemo, useEffect } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Hook for preventing unnecessary re-renders using shallow comparison
 */
export const useShallowEqual = (obj) => {
  const prevRef = useRef();
  
  return useMemo(() => {
    if (!prevRef.current) {
      prevRef.current = obj;
      return obj;
    }
    
    const prev = prevRef.current;
    
    // Shallow comparison
    if (Object.keys(prev).length !== Object.keys(obj).length) {
      prevRef.current = obj;
      return obj;
    }
    
    for (const key in obj) {
      if (prev[key] !== obj[key]) {
        prevRef.current = obj;
        return obj;
      }
    }
    
    return prev;
  }, [obj]);
};

/**
 * Hook for debouncing callbacks to prevent excessive re-renders
 */
export const useDebouncedCallback = (callback, delay = 300, deps = []) => {
  const timeoutRef = useRef(null);
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedCallback;
};

/**
 * Hook for throttling callbacks to limit execution frequency
 */
export const useThrottledCallback = (callback, limit = 100, deps = []) => {
  const inThrottle = useRef(false);
  
  const throttledCallback = useCallback((...args) => {
    if (!inThrottle.current) {
      callback(...args);
      inThrottle.current = true;
      
      setTimeout(() => {
        inThrottle.current = false;
      }, limit);
    }
  }, [callback, limit, ...deps]);
  
  return throttledCallback;
};

/**
 * Hook for batching state updates to reduce re-renders
 */
export const useBatchedUpdates = () => {
  const updatesRef = useRef([]);
  const timeoutRef = useRef(null);
  
  const batchUpdate = useCallback((updateFn) => {
    updatesRef.current.push(updateFn);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        const updates = updatesRef.current;
        updatesRef.current = [];
        
        updates.forEach(update => update());
      });
    }, 0);
  }, []);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return batchUpdate;
};

/**
 * Hook for selective re-rendering based on specific prop changes
 */
export const useSelectiveRerender = (props, selectKeys = []) => {
  const prevPropsRef = useRef();
  
  return useMemo(() => {
    if (!prevPropsRef.current) {
      prevPropsRef.current = props;
      return props;
    }
    
    const prev = prevPropsRef.current;
    let hasChanged = false;
    
    // Check only selected keys
    for (const key of selectKeys) {
      if (prev[key] !== props[key]) {
        hasChanged = true;
        break;
      }
    }
    
    if (hasChanged) {
      prevPropsRef.current = props;
      return props;
    }
    
    return prev;
  }, [props, selectKeys]);
};

/**
 * Hook for creating stable references to prevent child re-renders
 */
export const useStableReference = (value) => {
  const ref = useRef(value);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  if (ref.current !== value) {
    ref.current = value;
    forceUpdate();
  }
  
  return ref.current;
};

/**
 * Hook for performance monitoring and optimization suggestions
 */
export const usePerformanceMonitor = (componentName) => {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const renderTimesRef = useRef([]);
  
  useEffect(() => {
    renderCountRef.current += 1;
    const renderTime = Date.now() - startTimeRef.current;
    renderTimesRef.current.push(renderTime);
    
    // Keep only last 10 render times
    if (renderTimesRef.current.length > 10) {
      renderTimesRef.current = renderTimesRef.current.slice(-10);
    }
    
    if (__DEV__ && renderCountRef.current % 10 === 0) {
      const avgRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;
      
      console.log(`Performance Monitor - ${componentName}:`, {
        renderCount: renderCountRef.current,
        avgRenderTime: avgRenderTime.toFixed(2) + 'ms',
        lastRenderTime: renderTime + 'ms',
      });
      
      if (avgRenderTime > 16) { // 60fps threshold
        console.warn(`Performance Warning - ${componentName}: Slow renders detected (avg: ${avgRenderTime.toFixed(2)}ms)`);
      }
    }
    
    startTimeRef.current = Date.now();
  });
  
  return {
    renderCount: renderCountRef.current,
    avgRenderTime: renderTimesRef.current.length > 0 
      ? renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length 
      : 0,
  };
};

export default {
  useShallowEqual,
  useDebouncedCallback,
  useThrottledCallback,
  useBatchedUpdates,
  useSelectiveRerender,
  useStableReference,
  usePerformanceMonitor,
};