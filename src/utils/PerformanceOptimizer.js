/**
 * Performance Optimizer - Memory leak prevention and performance monitoring
 * Provides utilities to optimize React Native app performance
 */

import { InteractionManager, AppState } from 'react-native';

class PerformanceOptimizer {
  constructor() {
    this.subscriptions = new Set();
    this.timers = new Set();
    this.animations = new Set();
    this.listeners = new Set();
    this.appStateListener = null;
    
    this.setupAppStateListener();
  }

  setupAppStateListener() {
    this.appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        this.pauseNonEssentialOperations();
      } else if (nextAppState === 'active') {
        this.resumeOperations();
      }
    });
  }

  /**
   * Memory Management
   */
  
  // Track and cleanup subscriptions
  addSubscription(subscription) {
    if (subscription && typeof subscription.remove === 'function') {
      this.subscriptions.add(subscription);
    }
    return subscription;
  }

  // Track and cleanup timers
  addTimer(timerId) {
    this.timers.add(timerId);
    return timerId;
  }

  // Track and cleanup animations
  addAnimation(animation) {
    if (animation && typeof animation.stop === 'function') {
      this.animations.add(animation);
    }
    return animation;
  }

  // Track and cleanup event listeners
  addListener(listener) {
    this.listeners.add(listener);
    return listener;
  }

  // Cleanup all tracked resources
  cleanup() {
    // Remove subscriptions
    this.subscriptions.forEach(subscription => {
      try {
        if (subscription && typeof subscription.remove === 'function') {
          subscription.remove();
        }
      } catch (error) {
        console.warn('Error removing subscription:', error);
      }
    });
    this.subscriptions.clear();

    // Clear timers
    this.timers.forEach(timerId => {
      try {
        clearTimeout(timerId);
        clearInterval(timerId);
      } catch (error) {
        console.warn('Error clearing timer:', error);
      }
    });
    this.timers.clear();

    // Stop animations
    this.animations.forEach(animation => {
      try {
        if (animation && typeof animation.stop === 'function') {
          animation.stop();
        }
      } catch (error) {
        console.warn('Error stopping animation:', error);
      }
    });
    this.animations.clear();

    // Remove listeners
    this.listeners.forEach(listener => {
      try {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      } catch (error) {
        console.warn('Error removing listener:', error);
      }
    });
    this.listeners.clear();

    // Remove app state listener
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }
  }

  /**
   * Performance Monitoring
   */
  
  measureRenderTime(componentName, renderFunction) {
    if (!__DEV__) {
      return renderFunction();
    }

    const startTime = Date.now();
    const result = renderFunction();
    const endTime = Date.now();
    
    const renderTime = endTime - startTime;
    if (renderTime > 16) { // More than 1 frame at 60fps
      console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime}ms`);
    }
    
    return result;
  }

  measureAsyncOperation(operationName, asyncFunction) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      asyncFunction()
        .then(result => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          if (__DEV__ && duration > 100) {
            console.warn(`⏱️ Slow async operation ${operationName}: ${duration}ms`);
          }
          
          resolve(result);
        })
        .catch(error => {
          console.error(`❌ Async operation failed ${operationName}:`, error);
          reject(error);
        });
    });
  }

  /**
   * Interaction Management
   */
  
  runAfterInteractions(callback) {
    return new Promise(resolve => {
      InteractionManager.runAfterInteractions(() => {
        try {
          const result = callback();
          resolve(result);
        } catch (error) {
          console.error('Error in runAfterInteractions:', error);
          resolve(null);
        }
      });
    });
  }

  /**
   * App State Management
   */
  
  pauseNonEssentialOperations() {
    // Pause animations
    this.animations.forEach(animation => {
      try {
        if (animation && typeof animation.pause === 'function') {
          animation.pause();
        }
      } catch (error) {
        console.warn('Error pausing animation:', error);
      }
    });
    
    console.log('🔄 Paused non-essential operations for background mode');
  }

  resumeOperations() {
    // Resume animations
    this.animations.forEach(animation => {
      try {
        if (animation && typeof animation.resume === 'function') {
          animation.resume();
        }
      } catch (error) {
        console.warn('Error resuming animation:', error);
      }
    });
    
    console.log('▶️ Resumed operations for active mode');
  }

  /**
   * Memory Usage Monitoring
   */
  
  checkMemoryUsage() {
    if (__DEV__ && global.gc) {
      // Force garbage collection in dev mode if available
      global.gc();
      console.log('🗑️ Forced garbage collection');
    }
    
    // Monitor component mount/unmount ratio
    const componentCount = this.subscriptions.size + this.listeners.size;
    if (componentCount > 100) {
      console.warn(`⚠️ High component count detected: ${componentCount}. Check for memory leaks.`);
    }
  }

  /**
   * Batch Operations for Better Performance
   */
  
  batchUpdates(updates) {
    return new Promise(resolve => {
      InteractionManager.runAfterInteractions(() => {
        const results = updates.map(update => {
          try {
            return update();
          } catch (error) {
            console.error('Error in batched update:', error);
            return null;
          }
        });
        resolve(results);
      });
    });
  }
}

// Singleton instance
const performanceOptimizer = new PerformanceOptimizer();

/**
 * React Hook for Performance Optimization
 */
export const usePerformanceOptimizer = () => {
  const optimizer = performanceOptimizer;

  // Cleanup function for useEffect
  const cleanup = () => {
    optimizer.cleanup();
  };

  return {
    addSubscription: optimizer.addSubscription.bind(optimizer),
    addTimer: optimizer.addTimer.bind(optimizer),
    addAnimation: optimizer.addAnimation.bind(optimizer),
    addListener: optimizer.addListener.bind(optimizer),
    measureRenderTime: optimizer.measureRenderTime.bind(optimizer),
    measureAsyncOperation: optimizer.measureAsyncOperation.bind(optimizer),
    runAfterInteractions: optimizer.runAfterInteractions.bind(optimizer),
    checkMemoryUsage: optimizer.checkMemoryUsage.bind(optimizer),
    batchUpdates: optimizer.batchUpdates.bind(optimizer),
    cleanup,
  };
};

/**
 * HOC for Performance Monitoring
 */
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  return function PerformanceMonitoredComponent(props) {
    const optimizer = usePerformanceOptimizer();
    
    return optimizer.measureRenderTime(
      componentName || WrappedComponent.displayName || WrappedComponent.name,
      () => <WrappedComponent {...props} />
    );
  };
};

export default performanceOptimizer;
