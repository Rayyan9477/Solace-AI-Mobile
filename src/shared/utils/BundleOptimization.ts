import { logger } from "@shared/utils/logger";

// PERFORMANCE OPTIMIZATION: Bundle size optimization strategies
import { Platform } from "react-native";

// Tree-shakable imports for React Native Paper
export const PaperComponents = {
  // Only import what we actually use
  Button: () =>
    import("react-native-paper/lib/module/components/Button/Button").then(
      (m) => m.default,
    ),
  Card: () =>
    import("react-native-paper/lib/module/components/Card/Card").then(
      (m) => m.default,
    ),
  Surface: () =>
    import("react-native-paper/lib/module/components/Surface").then(
      (m) => m.default,
    ),
  // Add other components as needed
};

// Replace styled-components with lighter alternatives
export const LightweightStyling = {
  // Use StyleSheet.create instead of styled-components for better performance
  createStyleSheet: (styles) => {
    if (Platform.OS === "web") {
      // For web, use CSS-in-JS only when necessary
      return styles;
    }
    return StyleSheet.create(styles);
  },

  // Conditional styling helper
  conditionalStyle: (condition, style) => (condition ? style : null),

  // Platform-specific styling
  platformStyle: (iosStyle, androidStyle, webStyle) => {
    switch (Platform.OS) {
      case "ios":
        return iosStyle;
      case "android":
        return androidStyle;
      case "web":
        return webStyle || iosStyle;
      default:
        return iosStyle;
    }
  },
};

// Icon optimization: Use platform-native icons when possible
export const OptimizedIcons = {
  // Platform-specific icon implementations
  ios: () => import("@react-native-vector-icons/ionicons"),
  android: () => import("@react-native-vector-icons/material-icons"),
  web: () => import("../components/icons/WebIcons"), // Custom web icons

  // Get platform-appropriate icon
  getIcon: async (iconName) => {
    const platform = Platform.OS;
    try {
      const iconModule = await OptimizedIcons[platform]();
      return iconModule[iconName] || iconModule.default;
    } catch (error) {
      logger.warn(`Failed to load platform icon for ${platform}:`, error);
      // Fallback to custom SVG icons
      const customIcons = await import("../components/icons/IconSystem");
      return customIcons.MentalHealthIcons[iconName];
    }
  },
};

// Conditional imports based on features used
export const ConditionalImports = {
  // Only import animation library if animations are enabled
  loadAnimations: async (isAnimationEnabled) => {
    if (!isAnimationEnabled) return null;

    if (Platform.OS === "web") {
      return import("framer-motion");
    } else {
      return import("react-native-reanimated");
    }
  },

  // Only import voice features if microphone is available
  loadVoiceFeatures: async () => {
    if (Platform.OS === "web") {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices) return null;
    }
    return import("../components/chat/VoiceRecorder");
  },

  // Only import haptic feedback on mobile
  loadHaptics: async () => {
    if (Platform.OS === "web") return null;
    return import("expo-haptics");
  },
};

// Asset optimization
export const AssetOptimization = {
  // Image optimization based on device capabilities
  getOptimizedImageUri: (baseUri, { width, height, quality = 80 }) => {
    if (Platform.OS === "web") {
      // Use WebP for web if supported
      const supportsWebP =
        document
          .createElement("canvas")
          .toDataURL("image/webp")
          .indexOf("data:image/webp") === 0;

      if (supportsWebP) {
        return `${baseUri}?format=webp&w=${width}&h=${height}&q=${quality}`;
      }
    }

    // Use platform-appropriate format
    return `${baseUri}?w=${width}&h=${height}&q=${quality}`;
  },

  // Preload critical images
  preloadImages: async (imageUris) => {
    if (Platform.OS === "web") {
      const loadPromises = imageUris.map((uri) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = uri;
        });
      });
      await Promise.allSettled(loadPromises);
    } else {
      // For mobile, use Image.prefetch
      const { Image } = require("react-native");
      const loadPromises = imageUris.map((uri) => Image.prefetch(uri));
      await Promise.allSettled(loadPromises);
    }
  },
};

// Bundle analysis helpers
export const BundleAnalysis = {
  // Track component render counts for optimization opportunities
  renderTracker: new Map(),

  trackRender: (componentName) => {
    const count = BundleAnalysis.renderTracker.get(componentName) || 0;
    BundleAnalysis.renderTracker.set(componentName, count + 1);
  },

  getRenderStats: () => {
    const stats = Array.from(BundleAnalysis.renderTracker.entries())
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [name, count]) => {
        acc[name] = count;
        return acc;
      }, {});

    return stats;
  },

  // Log high-frequency renders for optimization
  logHighFrequencyRenders: (threshold = 10) => {
    const stats = BundleAnalysis.getRenderStats();
    const highFrequency = Object.entries(stats).filter(
      ([, count]) => count > threshold,
    );

    if (highFrequency.length > 0) {
      logger.debug("High-frequency renders detected:", highFrequency);
    }
  },
};

// Memory optimization utilities
export const MemoryOptimization = {
  // WeakMap cache for component instances
  componentCache: new WeakMap(),

  // Cache expensive calculations
  memoize: (fn) => {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  },

  // Clear caches periodically
  clearCaches: () => {
    BundleAnalysis.renderTracker.clear();
    // Clear other caches as needed
  },

  // Monitor memory usage (development only)
  monitorMemory: () => {
    if (__DEV__ && Platform.OS === "web" && performance.memory) {
      const memory = performance.memory;
      logger.debug("Memory usage:", {
        used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
        total: Math.round(memory.totalJSHeapSize / 1048576) + " MB",
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
      });
    }
  },
};

// Performance monitoring
export const PerformanceMonitoring = {
  // Track time to interactive
  trackTTI: (screenName) => {
    if (__DEV__) {
      const startTime = Date.now();
      return () => {
        const endTime = Date.now();
        logger.debug(`${screenName} TTI: ${endTime - startTime}ms`);
      };
    }
    return () => {};
  },

  // Track component mount times
  trackComponentMount: (componentName) => {
    if (__DEV__) {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        logger.debug(
          `${componentName} mount time: ${(endTime - startTime).toFixed(2)}ms`,
        );
      };
    }
    return () => {};
  },
};

export default {
  PaperComponents,
  LightweightStyling,
  OptimizedIcons,
  ConditionalImports,
  AssetOptimization,
  BundleAnalysis,
  MemoryOptimization,
  PerformanceMonitoring,
};
