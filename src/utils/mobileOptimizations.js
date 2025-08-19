/**
 * Mobile Optimizations Utility
 * Provides mobile-specific optimizations for touch interactions, performance, and UX
 * Ensures optimal experience across different mobile devices and screen sizes
 */

import { Platform, Dimensions, PixelRatio } from 'react-native';
import { WCAG_CONSTANTS } from '../shared/utils/accessibility';

// Device detection and optimization helpers
export const DeviceDetection = {
  // Get device type based on screen dimensions
  getDeviceType: () => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = height / width;
    
    if (Platform.OS === 'web') {
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    }
    
    // React Native mobile detection
    if (Platform.OS === 'ios') {
      if (width <= 414 && height <= 896) return 'phone';
      return 'tablet';
    }
    
    if (Platform.OS === 'android') {
      const pixelDensity = PixelRatio.get();
      const adjustedWidth = width * pixelDensity;
      const adjustedHeight = height * pixelDensity;
      
      if (adjustedWidth < 1000 || adjustedHeight < 1000) return 'phone';
      return 'tablet';
    }
    
    return 'mobile';
  },

  // Check if device is in landscape mode
  isLandscape: () => {
    const { width, height } = Dimensions.get('window');
    return width > height;
  },

  // Get safe dimensions accounting for notches and navigation
  getSafeDimensions: () => {
    const { width, height } = Dimensions.get('window');
    const deviceType = DeviceDetection.getDeviceType();
    
    // Account for common mobile UI elements
    const adjustments = {
      phone: {
        topPadding: Platform.OS === 'ios' ? 44 : 24, // Status bar
        bottomPadding: Platform.OS === 'ios' ? 34 : 0, // Home indicator
      },
      tablet: {
        topPadding: Platform.OS === 'ios' ? 20 : 24,
        bottomPadding: 0,
      },
      desktop: {
        topPadding: 0,
        bottomPadding: 0,
      },
    };

    const adjustment = adjustments[deviceType] || adjustments.phone;
    
    return {
      width,
      height: height - adjustment.topPadding - adjustment.bottomPadding,
      topPadding: adjustment.topPadding,
      bottomPadding: adjustment.bottomPadding,
    };
  },
};

// Touch optimization utilities
export const TouchOptimizations = {
  // Calculate optimal touch target size based on device
  getOptimalTouchTarget: (minSize = WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE) => {
    const deviceType = DeviceDetection.getDeviceType();
    const pixelRatio = PixelRatio.get();
    
    const targetSizes = {
      phone: Math.max(minSize, 48), // Larger for phone usage
      tablet: Math.max(minSize, 44), // Standard for tablet
      desktop: Math.max(minSize, 40), // Smaller for desktop with precise cursors
    };

    return targetSizes[deviceType] || targetSizes.phone;
  },

  // Calculate touch target spacing for different contexts
  getTouchTargetSpacing: (context = 'normal') => {
    const deviceType = DeviceDetection.getDeviceType();
    
    const spacingMap = {
      normal: {
        phone: 8,
        tablet: 12,
        desktop: 16,
      },
      dense: {
        phone: 4,
        tablet: 6,
        desktop: 8,
      },
      comfortable: {
        phone: 16,
        tablet: 20,
        desktop: 24,
      },
      crisis: {
        phone: 24, // Extra space for emergency situations
        tablet: 32,
        desktop: 40,
      },
    };

    return spacingMap[context][deviceType] || spacingMap.normal.phone;
  },

  // Enhanced hit slop for better touch accuracy
  getEnhancedHitSlop: (targetSize) => {
    const optimalSize = TouchOptimizations.getOptimalTouchTarget();
    const hitSlopNeeded = Math.max(0, (optimalSize - targetSize) / 2);
    
    return {
      top: hitSlopNeeded,
      bottom: hitSlopNeeded,
      left: hitSlopNeeded,
      right: hitSlopNeeded,
    };
  },
};

// Performance optimizations for mobile
export const PerformanceOptimizations = {
  // Get optimal animation duration based on device performance
  getOptimalAnimationDuration: (baseDuration = 300) => {
    const deviceType = DeviceDetection.getDeviceType();
    const pixelRatio = PixelRatio.get();
    
    // Adjust animation duration based on device capabilities
    const performanceMultipliers = {
      phone: pixelRatio > 2 ? 1.0 : 1.2, // Slightly slower on lower density screens
      tablet: 1.0,
      desktop: 0.8, // Faster on desktop
    };

    return Math.round(baseDuration * (performanceMultipliers[deviceType] || 1.0));
  },

  // Memory optimization for large lists
  getOptimalListConfig: () => {
    const deviceType = DeviceDetection.getDeviceType();
    const { height } = Dimensions.get('window');
    
    const configs = {
      phone: {
        initialNumToRender: 10,
        maxToRenderPerBatch: 5,
        windowSize: 10,
        getItemLayout: (data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        }),
      },
      tablet: {
        initialNumToRender: 15,
        maxToRenderPerBatch: 8,
        windowSize: 15,
        getItemLayout: (data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        }),
      },
      desktop: {
        initialNumToRender: 20,
        maxToRenderPerBatch: 10,
        windowSize: 20,
        getItemLayout: (data, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        }),
      },
    };

    return configs[deviceType] || configs.phone;
  },

  // Image optimization based on device
  getOptimalImageSize: (baseWidth, baseHeight) => {
    const pixelRatio = PixelRatio.get();
    const deviceType = DeviceDetection.getDeviceType();
    
    // Scale images appropriately for device pixel density
    const scale = Math.min(pixelRatio, deviceType === 'phone' ? 2 : 3);
    
    return {
      width: Math.round(baseWidth * scale),
      height: Math.round(baseHeight * scale),
      scale,
    };
  },
};

// Typography optimizations for mobile readability
export const TypographyOptimizations = {
  // Get optimal font sizes for different device types
  getOptimalFontSize: (baseFontSize = 16) => {
    const deviceType = DeviceDetection.getDeviceType();
    const pixelRatio = PixelRatio.get();
    
    const fontScales = {
      phone: {
        small: pixelRatio < 2 ? 1.1 : 1.0, // Slightly larger on low-density screens
        medium: 1.0,
        large: 0.95, // Slightly smaller to fit more content
      },
      tablet: {
        small: 1.0,
        medium: 1.0,
        large: 1.0,
      },
      desktop: {
        small: 0.9,
        medium: 1.0,
        large: 1.1,
      },
    };

    const scale = fontScales[deviceType]?.medium || 1.0;
    return Math.round(baseFontSize * scale);
  },

  // Get optimal line height for mobile reading
  getOptimalLineHeight: (fontSize) => {
    const deviceType = DeviceDetection.getDeviceType();
    
    const lineHeightRatios = {
      phone: 1.5, // More generous for mobile reading
      tablet: 1.4,
      desktop: 1.3,
    };

    return Math.round(fontSize * (lineHeightRatios[deviceType] || 1.5));
  },
};

// Gesture optimization for mental health interactions
export const GestureOptimizations = {
  // Therapeutic gesture configurations
  getTherapeuticGestureConfig: (gestureType) => {
    const deviceType = DeviceDetection.getDeviceType();
    
    const configs = {
      moodSelection: {
        phone: {
          swipeThreshold: 50,
          velocityThreshold: 300,
          restoreThreshold: 0.3,
        },
        tablet: {
          swipeThreshold: 60,
          velocityThreshold: 400,
          restoreThreshold: 0.25,
        },
        desktop: {
          swipeThreshold: 40,
          velocityThreshold: 200,
          restoreThreshold: 0.2,
        },
      },
      journalEntry: {
        phone: {
          scrollThreshold: 20,
          momentumScrollDeceleration: 0.98,
        },
        tablet: {
          scrollThreshold: 25,
          momentumScrollDeceleration: 0.95,
        },
        desktop: {
          scrollThreshold: 15,
          momentumScrollDeceleration: 0.92,
        },
      },
      crisisMode: {
        phone: {
          longPressDelay: 500, // Shorter for emergency
          doubleTapDelay: 300,
        },
        tablet: {
          longPressDelay: 600,
          doubleTapDelay: 350,
        },
        desktop: {
          longPressDelay: 400,
          doubleTapDelay: 250,
        },
      },
    };

    return configs[gestureType]?.[deviceType] || configs[gestureType]?.phone;
  },
};

// Layout optimization utilities
export const LayoutOptimizations = {
  // Get optimal grid columns for different content types
  getOptimalGridColumns: (contentType = 'cards') => {
    const { width } = Dimensions.get('window');
    const deviceType = DeviceDetection.getDeviceType();
    
    const configurations = {
      cards: {
        phone: width < 375 ? 1 : 2, // Single column on very small phones
        tablet: 3,
        desktop: 4,
      },
      moodOptions: {
        phone: 2, // Always 2 for mood selection
        tablet: 3,
        desktop: 4,
      },
      insights: {
        phone: 1, // Single column for readability
        tablet: 2,
        desktop: 3,
      },
      quickActions: {
        phone: 2,
        tablet: 4,
        desktop: 6,
      },
    };

    return configurations[contentType]?.[deviceType] || configurations.cards.phone;
  },

  // Get optimal padding for different screen sizes
  getOptimalPadding: (context = 'normal') => {
    const deviceType = DeviceDetection.getDeviceType();
    const { width } = Dimensions.get('window');
    
    const paddingConfigs = {
      normal: {
        phone: width < 375 ? 12 : 16,
        tablet: 24,
        desktop: 32,
      },
      compact: {
        phone: 8,
        tablet: 16,
        desktop: 20,
      },
      spacious: {
        phone: 20,
        tablet: 32,
        desktop: 48,
      },
    };

    return paddingConfigs[context]?.[deviceType] || paddingConfigs.normal.phone;
  },

  // Get optimal card spacing
  getOptimalCardSpacing: () => {
    const deviceType = DeviceDetection.getDeviceType();
    
    return {
      phone: 12,
      tablet: 16,
      desktop: 20,
    }[deviceType] || 12;
  },
};

// Export all optimizations
export default {
  DeviceDetection,
  TouchOptimizations,
  PerformanceOptimizations,
  TypographyOptimizations,
  GestureOptimizations,
  LayoutOptimizations,
};