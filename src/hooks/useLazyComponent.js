import { useState, useEffect, useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Hook for implementing lazy loading with visibility-based loading
 * Optimizes performance by only loading components when they're needed
 */
export const useLazyComponent = (
  importFunc,
  options = {}
) => {
  const {
    preload = false,
    delay = 0,
    onLoadStart,
    onLoadComplete,
    onLoadError,
  } = options;

  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadPromiseRef = useRef(null);

  const loadComponent = useCallback(async () => {
    if (Component || loading) return Component;

    // Prevent multiple simultaneous loads
    if (loadPromiseRef.current) {
      return loadPromiseRef.current;
    }

    setLoading(true);
    setError(null);
    onLoadStart?.();

    loadPromiseRef.current = new Promise(async (resolve, reject) => {
      try {
        // Wait for interactions to complete for better UX
        await InteractionManager.runAfterInteractions();
        
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const module = await importFunc();
        const LoadedComponent = module.default || module;
        
        setComponent(() => LoadedComponent);
        setLoading(false);
        onLoadComplete?.(LoadedComponent);
        resolve(LoadedComponent);
      } catch (err) {
        setError(err);
        setLoading(false);
        onLoadError?.(err);
        reject(err);
      } finally {
        loadPromiseRef.current = null;
      }
    });

    return loadPromiseRef.current;
  }, [Component, loading, importFunc, delay, onLoadStart, onLoadComplete, onLoadError]);

  useEffect(() => {
    if (preload) {
      loadComponent();
    }
  }, [preload, loadComponent]);

  return {
    Component,
    loading,
    error,
    loadComponent,
    isLoaded: !!Component,
  };
};

/**
 * Hook for intersection-based lazy loading
 * Loads components when they become visible
 */
export const useIntersectionLazyLoad = (
  importFunc,
  options = {}
) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    ...lazyOptions
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);
  const elementRef = useRef(null);

  const { Component, loading, error, loadComponent } = useLazyComponent(
    importFunc,
    lazyOptions
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          loadComponent();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadComponent, isVisible, rootMargin, threshold]);

  return {
    Component,
    loading,
    error,
    isVisible,
    elementRef,
    loadComponent,
  };
};

/**
 * Hook for priority-based lazy loading
 * Implements different loading strategies based on component priority
 */
export const usePriorityLazyLoad = (
  components = [],
  options = {}
) => {
  const {
    highPriorityDelay = 0,
    mediumPriorityDelay = 100,
    lowPriorityDelay = 300,
  } = options;

  const [loadedComponents, setLoadedComponents] = useState(new Map());
  const [loading, setLoading] = useState(new Set());

  const getDelayForPriority = useCallback((priority) => {
    switch (priority) {
      case 'high': return highPriorityDelay;
      case 'medium': return mediumPriorityDelay;
      case 'low': return lowPriorityDelay;
      default: return mediumPriorityDelay;
    }
  }, [highPriorityDelay, mediumPriorityDelay, lowPriorityDelay]);

  const loadComponent = useCallback(async (componentConfig) => {
    const { key, importFunc, priority = 'medium' } = componentConfig;
    
    if (loadedComponents.has(key) || loading.has(key)) {
      return loadedComponents.get(key);
    }

    setLoading(prev => new Set([...prev, key]));
    
    try {
      const delay = getDelayForPriority(priority);
      
      await InteractionManager.runAfterInteractions();
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const module = await importFunc();
      const Component = module.default || module;
      
      setLoadedComponents(prev => new Map([...prev, [key, Component]]));
      setLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      
      return Component;
    } catch (error) {
      setLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      throw error;
    }
  }, [loadedComponents, loading, getDelayForPriority]);

  const loadAllComponents = useCallback(async () => {
    // Sort by priority: high -> medium -> low
    const sortedComponents = [...components].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
    });

    // Load high priority components first
    const highPriority = sortedComponents.filter(c => (c.priority || 'medium') === 'high');
    await Promise.allSettled(highPriority.map(loadComponent));

    // Load medium priority components
    const mediumPriority = sortedComponents.filter(c => (c.priority || 'medium') === 'medium');
    await Promise.allSettled(mediumPriority.map(loadComponent));

    // Load low priority components
    const lowPriority = sortedComponents.filter(c => (c.priority || 'medium') === 'low');
    await Promise.allSettled(lowPriority.map(loadComponent));
  }, [components, loadComponent]);

  return {
    loadedComponents,
    loading: Array.from(loading),
    loadComponent,
    loadAllComponents,
    getComponent: (key) => loadedComponents.get(key),
    isLoaded: (key) => loadedComponents.has(key),
    isLoading: (key) => loading.has(key),
  };
};

/**
 * Hook for route-based preloading
 * Preloads components based on navigation patterns
 */
export const useRoutePreloader = (navigationState, preloadConfig = {}) => {
  const [preloadedRoutes, setPreloadedRoutes] = useState(new Set());
  const preloadingRef = useRef(new Set());

  const preloadRoute = useCallback(async (routeName) => {
    if (preloadedRoutes.has(routeName) || preloadingRef.current.has(routeName)) {
      return;
    }

    const config = preloadConfig[routeName];
    if (!config) return;

    preloadingRef.current.add(routeName);

    try {
      await InteractionManager.runAfterInteractions();
      await config.importFunc();
      
      setPreloadedRoutes(prev => new Set([...prev, routeName]));
    } catch (error) {
      console.warn(`Failed to preload route ${routeName}:`, error);
    } finally {
      preloadingRef.current.delete(routeName);
    }
  }, [preloadedRoutes, preloadConfig]);

  useEffect(() => {
    if (!navigationState) return;

    const currentRoute = navigationState.routes[navigationState.index];
    const currentRouteName = currentRoute.name;

    // Preload likely next routes based on current route
    const likelyRoutes = preloadConfig[currentRouteName]?.preloadRoutes || [];
    
    likelyRoutes.forEach(routeName => {
      setTimeout(() => preloadRoute(routeName), 1000); // Delay to not interfere with current navigation
    });
  }, [navigationState, preloadRoute, preloadConfig]);

  return {
    preloadedRoutes: Array.from(preloadedRoutes),
    preloadRoute,
    isPreloaded: (routeName) => preloadedRoutes.has(routeName),
  };
};

export default {
  useLazyComponent,
  useIntersectionLazyLoad,
  usePriorityLazyLoad,
  useRoutePreloader,
};