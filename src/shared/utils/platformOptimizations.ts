import { Platform, Dimensions, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PLATFORM_CONFIG, FEATURE_FLAGS, logger } from '../config/environment';

// Screen dimensions utilities
export const screenUtils = {
  getScreenDimensions() {
    const { width, height } = Dimensions.get('window');
    const screenData = Dimensions.get('screen');
    
    return {
      window: { width, height },
      screen: screenData,
      isTablet: Platform.OS === 'ios' ? 
        Math.min(width, height) >= 768 : 
        Math.min(width, height) >= 600,
      orientation: width > height ? 'landscape' : 'portrait',
    };
  },

  getSafeAreaInsets() {
    if (Platform.OS === 'web') {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    
    // For React Native, you would typically use react-native-safe-area-context
    // This is a fallback implementation
    return {
      top: StatusBar.currentHeight || 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  },

  getStatusBarHeight() {
    return Platform.select({
      ios: PLATFORM_CONFIG.styles.statusBarHeight,
      android: StatusBar.currentHeight || 24,
      web: 0,
    });
  },
};

// Haptic feedback utilities
export const hapticUtils = {
  impact(style = 'medium') {
    if (!FEATURE_FLAGS.ENABLE_HAPTIC_FEEDBACK) return;
    
    try {
      const hapticStyle = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      }[style] || Haptics.ImpactFeedbackStyle.Medium;
      
      Haptics.impactAsync(hapticStyle);
    } catch (error) {
      logger.warn('Haptic feedback failed:', error);
    }
  },

  notification(type = 'success') {
    if (!FEATURE_FLAGS.ENABLE_HAPTIC_FEEDBACK) return;
    
    try {
      const notificationType = {
        success: Haptics.NotificationFeedbackType.Success,
        warning: Haptics.NotificationFeedbackType.Warning,
        error: Haptics.NotificationFeedbackType.Error,
      }[type] || Haptics.NotificationFeedbackType.Success;
      
      Haptics.notificationAsync(notificationType);
    } catch (error) {
      logger.warn('Haptic notification failed:', error);
    }
  },

  selection() {
    if (!FEATURE_FLAGS.ENABLE_HAPTIC_FEEDBACK) return;
    
    try {
      Haptics.selectionAsync();
    } catch (error) {
      logger.warn('Haptic selection failed:', error);
    }
  },
};

// Platform-specific styling utilities
export const styleUtils = {
  // Create platform-specific shadows
  createShadow(elevation = 2) {
    if (Platform.OS === 'web') {
      return {
        boxShadow: `0px ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.1)`,
      };
    }
    
    if (Platform.OS === 'android') {
      return {
        elevation,
      };
    }
    
    // iOS shadow
    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.1 + (elevation * 0.05),
      shadowRadius: elevation * 2,
    };
  },

  // Create platform-specific border radius
  createBorderRadius(size = 'medium') {
    const radiusMap = {
      small: Platform.select({ ios: 8, android: 8, web: 6 }),
      medium: Platform.select({ ios: 12, android: 12, web: 8 }),
      large: Platform.select({ ios: 16, android: 16, web: 12 }),
      extraLarge: Platform.select({ ios: 24, android: 24, web: 16 }),
    };
    
    return radiusMap[size] || radiusMap.medium;
  },

  // Create platform-specific text styles
  createTextStyle(variant = 'body') {
    const baseStyles = {
      fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
        web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      }),
    };

    const variantStyles = {
      heading: {
        fontSize: Platform.select({ ios: 28, android: 28, web: 32 }),
        fontWeight: Platform.select({ ios: '700', android: '700', web: '600' }),
        lineHeight: Platform.select({ ios: 34, android: 34, web: 40 }),
      },
      subheading: {
        fontSize: Platform.select({ ios: 20, android: 20, web: 24 }),
        fontWeight: Platform.select({ ios: '600', android: '600', web: '500' }),
        lineHeight: Platform.select({ ios: 26, android: 26, web: 32 }),
      },
      body: {
        fontSize: Platform.select({ ios: 16, android: 16, web: 16 }),
        fontWeight: Platform.select({ ios: '400', android: '400', web: '400' }),
        lineHeight: Platform.select({ ios: 24, android: 24, web: 24 }),
      },
      caption: {
        fontSize: Platform.select({ ios: 12, android: 12, web: 14 }),
        fontWeight: Platform.select({ ios: '400', android: '400', web: '400' }),
        lineHeight: Platform.select({ ios: 18, android: 18, web: 20 }),
      },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
    };
  },

  // Create responsive spacing
  createSpacing(size = 'medium') {
    const { isTablet } = screenUtils.getScreenDimensions();
    
    const spacingMap = {
      xs: isTablet ? 6 : 4,
      small: isTablet ? 12 : 8,
      medium: isTablet ? 20 : 16,
      large: isTablet ? 32 : 24,
      xl: isTablet ? 48 : 32,
    };

    return spacingMap[size] || spacingMap.medium;
  },
};

// Performance optimizations
export const performanceUtils = {
  // Debounce utility for search inputs
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle utility for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Image optimization for different platforms
  optimizeImageSource(source, size = 'medium') {
    if (typeof source === 'string') {
      // For web, add size parameters
      if (Platform.OS === 'web') {
        const sizeMap = {
          small: 'w_300,h_300',
          medium: 'w_600,h_600',
          large: 'w_1200,h_1200',
        };
        
        if (source.includes('cloudinary') || source.includes('imgix')) {
          return `${source}?${sizeMap[size]}&c_fill&q_auto&f_auto`;
        }
      }
      
      return source;
    }
    
    return source;
  },

  // Memory optimization for large lists
  getListOptimization() {
    const { isTablet } = screenUtils.getScreenDimensions();
    
    return {
      initialNumToRender: isTablet ? 15 : 10,
      maxToRenderPerBatch: isTablet ? 10 : 5,
      windowSize: isTablet ? 15 : 10,
      removeClippedSubviews: Platform.OS === 'android',
      getItemLayout: (data, index) => ({
        length: 80, // Adjust based on your item height
        offset: 80 * index,
        index,
      }),
    };
  },
};

// Accessibility optimizations
export const accessibilityUtils = {
  // Create accessibility props for mental health contexts
  createMentalHealthAccessibility(type, content) {
    const baseProps = {
      accessible: true,
      accessibilityRole: 'button',
    };

    switch (type) {
      case 'mood-selector':
        return {
          ...baseProps,
          accessibilityLabel: `Select ${content} mood`,
          accessibilityHint: 'Double tap to record your current mood',
          accessibilityState: { selected: false },
        };
      
      case 'crisis-button':
        return {
          ...baseProps,
          accessibilityRole: 'button',
          accessibilityLabel: 'Emergency support',
          accessibilityHint: 'Double tap for immediate crisis support resources',
          importantForAccessibility: 'yes',
        };
      
      case 'assessment-question':
        return {
          ...baseProps,
          accessibilityRole: 'radiogroup',
          accessibilityLabel: content,
          accessibilityHint: 'Select an option that best describes your experience',
        };
      
      case 'chat-message':
        return {
          accessible: true,
          accessibilityRole: 'text',
          accessibilityLabel: `AI therapist says: ${content}`,
          accessibilityLiveRegion: 'polite',
        };
      
      default:
        return baseProps;
    }
  },

  // Check if screen reader is enabled
  isScreenReaderEnabled() {
    // This would typically use AccessibilityInfo.isScreenReaderEnabled()
    // For now, return false as default
    return false;
  },

  // Announce important messages to screen readers
  announceForAccessibility(message) {
    if (Platform.OS !== 'web') {
      // Use AccessibilityInfo.announceForAccessibility in real implementation
      logger.log('Accessibility announcement:', message);
    }
  },
};

// Network optimization
export const networkUtils = {
  // Check network connectivity
  async checkConnectivity() {
    if (Platform.OS === 'web') {
      return navigator.onLine;
    }
    
    // For React Native, you would use @react-native-netinfo/netinfo
    // This is a fallback implementation
    try {
      const response = await fetch('https://httpbin.org/status/200', {
        method: 'HEAD',
        timeout: 5000,
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Create optimized request configuration
  createRequestConfig(priority = 'normal') {
    const baseConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    switch (priority) {
      case 'high':
        return {
          ...baseConfig,
          timeout: 30000,
          retries: 3,
        };
      
      case 'low':
        return {
          ...baseConfig,
          timeout: 10000,
          retries: 1,
        };
      
      default:
        return {
          ...baseConfig,
          timeout: 15000,
          retries: 2,
        };
    }
  },
};

// Storage optimization
export const storageUtils = {
  // Calculate storage usage
  async getStorageInfo() {
    if (Platform.OS === 'web') {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0,
          percentage: estimate.usage ? (estimate.usage / estimate.quota) * 100 : 0,
        };
      } catch {
        return { used: 0, available: 0, percentage: 0 };
      }
    }
    
    // For React Native, you would implement platform-specific storage checks
    return { used: 0, available: 0, percentage: 0 };
  },

  // Clear cache when needed
  async clearCache() {
    try {
      if (Platform.OS === 'web') {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      logger.log('Cache cleared successfully');
    } catch (error) {
      logger.error('Failed to clear cache:', error);
    }
  },
};

// Export all utilities
export default {
  screenUtils,
  hapticUtils,
  styleUtils,
  performanceUtils,
  accessibilityUtils,
  networkUtils,
  storageUtils,
};