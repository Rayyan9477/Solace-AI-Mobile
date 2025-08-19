/**
 * Web Polyfills for React Native Components
 * 
 * Provides web-specific polyfills and compatibility fixes for components
 * that don't work properly on web platform.
 */

import { Platform } from 'react-native';

// React Native SVG Web Compatibility
if (Platform.OS === 'web') {
  // Ensure SVG support for older browsers
  if (typeof window !== 'undefined') {
    // Add SVG polyfills if needed
    if (!window.SVGElement) {
      console.warn('SVG not supported in this browser');
    }

    // Polyfill for React Native Web missing methods
    if (window.navigator && !window.navigator.userAgent) {
      window.navigator.userAgent = 'ReactNativeWeb';
    }
  }
}

// Styled Components Web Compatibility
if (Platform.OS === 'web') {
  // Ensure styled-components works properly on web
  if (typeof window !== 'undefined' && !window.SC_DISABLE_SPEEDY) {
    // Disable speedy mode for development to improve debugging
    window.SC_DISABLE_SPEEDY = process.env.NODE_ENV === 'development';
  }
}

// AsyncStorage Web Compatibility Helpers
export const ensureAsyncStorageWeb = () => {
  if (Platform.OS === 'web') {
    // Check if localStorage is available
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage not available, AsyncStorage may not persist data');
        return false;
      }
      // Test localStorage functionality
      localStorage.setItem('__test__', 'test');
      localStorage.removeItem('__test__');
      return true;
    } catch (e) {
      console.warn('localStorage not available or restricted:', e);
      return false;
    }
  }
  return true;
};

// Linear Gradient Web Fallback
export const createWebGradientFallback = (colors, start, end) => {
  if (Platform.OS === 'web') {
    const direction = getGradientDirection(start, end);
    return {
      background: `linear-gradient(${direction}, ${colors.join(', ')})`,
    };
  }
  return {};
};

const getGradientDirection = (start = { x: 0, y: 0 }, end = { x: 1, y: 1 }) => {
  try {
    // Validate inputs
    const startX = typeof start.x === 'number' ? start.x : 0;
    const startY = typeof start.y === 'number' ? start.y : 0;
    const endX = typeof end.x === 'number' ? end.x : 1;
    const endY = typeof end.y === 'number' ? end.y : 1;
    
    // Convert React Native gradient coordinates to CSS
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    
    // Ensure angle is finite and within valid range
    if (!isFinite(angle)) {
      return '180deg'; // Default top-to-bottom gradient
    }
    
    return `${90 + angle}deg`;
  } catch (error) {
    console.warn('Gradient direction calculation failed:', error);
    return '180deg'; // Safe fallback
  }
};

// Dimensions Web Compatibility
export const getWebSafeDimensions = () => {
  if (Platform.OS === 'web') {
    return {
      width: typeof window !== 'undefined' ? window.innerWidth : 375,
      height: typeof window !== 'undefined' ? window.innerHeight : 667,
    };
  }
  
  // For native platforms, use React Native Dimensions
  const { Dimensions } = require('react-native');
  return Dimensions.get('window');
};

// Touch Events Web Compatibility
export const getWebSafeTouchProps = (props = {}) => {
  if (Platform.OS === 'web') {
    return {
      ...props,
      // Convert React Native touch props to web-compatible ones
      onPress: props.onPress,
      onLongPress: props.onLongPress,
      // Add web-specific accessibility
      role: props.accessibilityRole || 'button',
      'aria-label': props.accessibilityLabel,
      'aria-hint': props.accessibilityHint,
      tabIndex: props.accessible !== false ? 0 : -1,
    };
  }
  return props;
};

// Animation Web Compatibility
export const getWebSafeAnimationProps = (animatedProps = {}) => {
  if (Platform.OS === 'web') {
    // Convert React Native animations to web-safe CSS transitions
    const webProps = { ...animatedProps };
    
    // Disable complex animations on web if performance is poor
    if (typeof window !== 'undefined' && window.navigator.hardwareConcurrency < 4) {
      // Reduce animation complexity on lower-end devices
      webProps.duration = Math.min(webProps.duration || 300, 150);
    }
    
    return webProps;
  }
  return animatedProps;
};

// Console polyfills for better web debugging (development only)
if (Platform.OS === 'web' && typeof window !== 'undefined' && __DEV__) {
  // Enhance console for React Native Web debugging
  const originalLog = console.log;
  console.log = (...args) => {
    originalLog('[RNWeb]', ...args);
  };
  
  // Add React Native Web identifier
  window.__REACT_NATIVE_WEB__ = true;
}

// Export initialization function
export const initializeWebPolyfills = () => {
  if (Platform.OS === 'web') {
    console.log('🔧 Initializing React Native Web polyfills...');
    
    // Check AsyncStorage compatibility
    const storageWorks = ensureAsyncStorageWeb();
    console.log('📱 AsyncStorage web compatibility:', storageWorks ? '✅' : '❌');
    
    // Check SVG support
    const svgSupported = typeof window !== 'undefined' && window.SVGElement;
    console.log('🎨 SVG support:', svgSupported ? '✅' : '❌');
    
    // Check touch/mouse event support
    const touchSupported = typeof window !== 'undefined' && 'ontouchstart' in window;
    console.log('👆 Touch events:', touchSupported ? '✅ (Touch)' : '🖱️ (Mouse)');
    
    console.log('✅ Web polyfills initialized successfully');
  }
};

export default {
  ensureAsyncStorageWeb,
  createWebGradientFallback,
  getWebSafeDimensions,
  getWebSafeTouchProps,
  getWebSafeAnimationProps,
  initializeWebPolyfills,
};