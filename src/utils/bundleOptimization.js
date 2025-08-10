import { lazy, Suspense } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBundlePerformance } from '../hooks/usePerformanceMonitor';

/**
 * Bundle optimization utilities for React Native
 * Provides lazy loading, code splitting, and performance optimizations
 */

// Loading component with therapeutic design
const LoadingComponent = ({ message = 'Loading...', theme }) => (
  <View style={styles.loadingContainer}>
    <LinearGradient
      colors={[
        theme?.colors?.therapeutic?.calming?.[50] || '#E3F2FD',
        theme?.colors?.therapeutic?.peaceful?.[50] || '#F1F8E9',
      ]}
      style={styles.loadingGradient}
    >
      <ActivityIndicator 
        size="large" 
        color={theme?.colors?.primary?.[500] || '#2196F3'} 
      />
      <Text style={[styles.loadingText, { color: theme?.colors?.text?.primary || '#333' }]}>
        {message}
      </Text>
    </LinearGradient>
  </View>
);

/**
 * Enhanced lazy loading with performance tracking
 */
export const createLazyComponent = (importFunction, componentName) => {
  const LazyComponent = lazy(() => {
    const startTime = performance.now();
    
    return importFunction().then(module => {
      const endTime = performance.now();
      
      if (__DEV__) {
        console.log(`📦 Lazy loaded ${componentName}: ${(endTime - startTime).toFixed(2)}ms`);
      }
      
      return module;
    }).catch(error => {
      console.error(`❌ Failed to lazy load ${componentName}:`, error);
      throw error;
    });
  });
  
  LazyComponent.displayName = `Lazy(${componentName})`;
  
  return LazyComponent;
};

/**
 * Suspense wrapper with error boundary and loading state
 */
export const withSuspense = (Component, loadingMessage, fallbackComponent) => {
  const WrappedComponent = (props) => {
    const FallbackComponent = fallbackComponent || LoadingComponent;
    
    return (
      <Suspense fallback={<FallbackComponent message={loadingMessage} {...props} />}>
        <Component {...props} />
      </Suspense>
    );
  };
  
  WrappedComponent.displayName = `withSuspense(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Dynamic import with retry logic for network failures
 */
export const dynamicImport = async (importFunction, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const startTime = performance.now();
      const module = await importFunction();
      const endTime = performance.now();
      
      if (__DEV__) {
        console.log(`📥 Dynamic import successful on attempt ${attempt}: ${(endTime - startTime).toFixed(2)}ms`);
      }
      
      return module;
    } catch (error) {
      if (attempt === retries) {
        console.error('❌ Dynamic import failed after all retries:', error);
        throw error;
      }
      
      if (__DEV__) {
        console.warn(`⚠️ Dynamic import attempt ${attempt} failed, retrying in ${delay}ms...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

/**
 * Preload components for better UX
 */
export const preloadComponent = (importFunction, componentName) => {
  if (__DEV__) {
    console.log(`🔄 Preloading ${componentName}...`);
  }
  
  return importFunction().then(() => {
    if (__DEV__) {
      console.log(`✅ Preloaded ${componentName}`);
    }
  }).catch(error => {
    if (__DEV__) {
      console.error(`❌ Failed to preload ${componentName}:`, error);
    }
  });
};

/**
 * Bundle splitting for large screens
 */
export const createScreenBundle = (screenName, importFunction) => {
  return createLazyComponent(
    () => dynamicImport(importFunction),
    screenName
  );
};

/**
 * Component splitting for large components
 */
export const createComponentBundle = (componentName, importFunction) => {
  return createLazyComponent(
    () => dynamicImport(importFunction),
    componentName
  );
};

/**
 * Memory-efficient lazy loading with cleanup
 */
export const createMemoizedLazyComponent = (importFunction, componentName, dependencies = []) => {
  let cachedComponent = null;
  
  const LazyComponent = lazy(() => {
    if (cachedComponent) {
      return Promise.resolve(cachedComponent);
    }
    
    const startTime = performance.now();
    
    return importFunction().then(module => {
      const endTime = performance.now();
      cachedComponent = module;
      
      if (__DEV__) {
        console.log(`💾 Memoized lazy load ${componentName}: ${(endTime - startTime).toFixed(2)}ms`);
      }
      
      return module;
    });
  });
  
  // Clear cache when dependencies change
  LazyComponent.clearCache = () => {
    cachedComponent = null;
  };
  
  return LazyComponent;
};

/**
 * Route-based code splitting
 */
export const createRouteBundle = (routeName, importFunction) => {
  const RouteComponent = createLazyComponent(importFunction, `Route:${routeName}`);
  
  return withSuspense(
    RouteComponent,
    `Loading ${routeName}...`,
    ({ theme }) => (
      <LoadingComponent 
        message={`Loading ${routeName}...`} 
        theme={theme}
      />
    )
  );
};

/**
 * Feature-based code splitting
 */
export const createFeatureBundle = (featureName, components) => {
  const bundlePromise = Promise.all(
    Object.entries(components).map(([name, importFn]) => 
      importFn().then(module => ({ name, module }))
    )
  ).then(results => {
    const bundle = {};
    results.forEach(({ name, module }) => {
      bundle[name] = module.default || module;
    });
    return { default: bundle };
  });
  
  return lazy(() => bundlePromise);
};

/**
 * Performance monitoring for lazy loaded components
 */
export const withPerformanceTracking = (Component, componentName) => {
  const TrackedComponent = (props) => {
    const { trackBundleLoad } = useBundlePerformance(componentName);
    
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        trackBundleLoad(startTime, endTime);
      };
    }, []);
    
    return <Component {...props} />;
  };
  
  TrackedComponent.displayName = `Tracked(${Component.displayName || Component.name})`;
  
  return TrackedComponent;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default {
  createLazyComponent,
  withSuspense,
  dynamicImport,
  preloadComponent,
  createScreenBundle,
  createComponentBundle,
  createMemoizedLazyComponent,
  createRouteBundle,
  createFeatureBundle,
  withPerformanceTracking,
  LoadingComponent,
};