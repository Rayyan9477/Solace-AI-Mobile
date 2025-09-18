/**
 * Accessibility Enhancer - Comprehensive accessibility utilities
 * Provides tools to make the app more accessible for users with disabilities
 */

import { AccessibilityInfo, Alert, Platform } from 'react-native';

class AccessibilityEnhancer {
  constructor() {
    this.isScreenReaderEnabled = false;
    this.isReduceMotionEnabled = false;
    this.isReduceTransparencyEnabled = false;
    this.listeners = new Set();
    
    this.init();
  }

  async init() {
    try {
      // Check initial accessibility settings
      await this.checkAccessibilitySettings();
      
      // Set up listeners for accessibility changes
      this.setupAccessibilityListeners();
    } catch (error) {
      console.error('Failed to initialize accessibility enhancer:', error);
    }
  }

  async checkAccessibilitySettings() {
    try {
      const [screenReader, reduceMotion, reduceTransparency] = await Promise.all([
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isReduceMotionEnabled(),
        this.checkReduceTransparency(),
      ]);

      this.isScreenReaderEnabled = screenReader;
      this.isReduceMotionEnabled = reduceMotion;
      this.isReduceTransparencyEnabled = reduceTransparency;

      console.log('♿ Accessibility settings:', {
        screenReader: this.isScreenReaderEnabled,
        reduceMotion: this.isReduceMotionEnabled,
        reduceTransparency: this.isReduceTransparencyEnabled,
      });
    } catch (error) {
      console.warn('Could not check accessibility settings:', error);
    }
  }

  async checkReduceTransparency() {
    try {
      if (Platform.OS === 'ios' && AccessibilityInfo.isReduceTransparencyEnabled) {
        return await AccessibilityInfo.isReduceTransparencyEnabled();
      }
    } catch (error) {
      console.warn('Could not check reduce transparency setting:', error);
    }
    return false;
  }

  setupAccessibilityListeners() {
    // Screen reader changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        this.isScreenReaderEnabled = enabled;
        console.log('♿ Screen reader changed:', enabled);
      }
    );
    this.listeners.add(screenReaderListener);

    // Reduce motion changes
    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        this.isReduceMotionEnabled = enabled;
        console.log('♿ Reduce motion changed:', enabled);
      }
    );
    this.listeners.add(reduceMotionListener);

    // Reduce transparency changes (iOS only)
    if (Platform.OS === 'ios' && AccessibilityInfo.addEventListener) {
      try {
        const reduceTransparencyListener = AccessibilityInfo.addEventListener(
          'reduceTransparencyChanged',
          (enabled) => {
            this.isReduceTransparencyEnabled = enabled;
            console.log('♿ Reduce transparency changed:', enabled);
          }
        );
        this.listeners.add(reduceTransparencyListener);
      } catch (error) {
        console.warn('Could not set up reduce transparency listener:', error);
      }
    }
  }

  cleanup() {
    this.listeners.forEach(listener => {
      try {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      } catch (error) {
        console.warn('Error removing accessibility listener:', error);
      }
    });
    this.listeners.clear();
  }

  /**
   * Screen Reader Utilities
   */

  announceToScreenReader(message, priority = 'polite') {
    if (!this.isScreenReaderEnabled) return;

    try {
      AccessibilityInfo.announceForAccessibility(message);
      
      // For web, also use aria-live regions
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => {
          if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
          }
        }, 1000);
      }
    } catch (error) {
      console.warn('Could not announce to screen reader:', error);
    }
  }

  /**
   * Focus Management
   */

  setAccessibilityFocus(ref) {
    try {
      if (ref && ref.current && AccessibilityInfo.setAccessibilityFocus) {
        AccessibilityInfo.setAccessibilityFocus(ref.current);
      }
    } catch (error) {
      console.warn('Could not set accessibility focus:', error);
    }
  }

  /**
   * Accessibility Props Helpers
   */

  createAccessibleButton(label, hint, role = 'button') {
    return {
      accessible: true,
      accessibilityRole: role,
      accessibilityLabel: label,
      accessibilityHint: hint,
      // Ensure minimum touch target size
      style: {
        minWidth: 44,
        minHeight: 44,
      },
    };
  }

  createAccessibleText(text, role = 'text') {
    return {
      accessible: true,
      accessibilityRole: role,
      accessibilityLabel: text,
    };
  }

  createAccessibleInput(label, hint, value, error) {
    const props = {
      accessible: true,
      accessibilityRole: 'text',
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityValue: value ? { text: value } : undefined,
    };

    if (error) {
      props.accessibilityInvalid = true;
      props.accessibilityLabel = `${label}, ${error}`;
    }

    return props;
  }

  /**
   * Color Contrast Validation
   */

  calculateContrastRatio(color1, color2) {
    const getLuminance = (color) => {
      // Simple luminance calculation for hex colors
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      const sRGB = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  validateContrastRatio(foreground, background, isLargeText = false) {
    const ratio = this.calculateContrastRatio(foreground, background);
    const minRatio = isLargeText ? 3.0 : 4.5; // WCAG AA standards
    
    return {
      ratio,
      passes: ratio >= minRatio,
      level: ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail',
    };
  }

  /**
   * Motion and Animation Helpers
   */

  getAnimationDuration(defaultDuration) {
    return this.isReduceMotionEnabled ? 0 : defaultDuration;
  }

  getAnimationConfig(config) {
    if (this.isReduceMotionEnabled) {
      return {
        ...config,
        duration: 0,
        useNativeDriver: true,
      };
    }
    return config;
  }

  /**
   * Error Announcements
   */

  announceError(errorMessage) {
    const message = `Error: ${errorMessage}. Please try again or contact support if the problem persists.`;
    this.announceToScreenReader(message, 'assertive');
    
    // Also show visual alert for users who might not use screen readers
    if (!this.isScreenReaderEnabled) {
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    }
  }

  announceSuccess(successMessage) {
    this.announceToScreenReader(`Success: ${successMessage}`, 'polite');
  }

  /**
   * Form Validation Helpers
   */

  announceFormErrors(errors) {
    if (errors.length === 0) return;

    const errorCount = errors.length;
    const message = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. ${errors.join('. ')}`;
    this.announceToScreenReader(message, 'assertive');
  }

  /**
   * Loading State Announcements
   */

  announceLoadingStart(action = 'Loading') {
    this.announceToScreenReader(`${action} started. Please wait.`, 'polite');
  }

  announceLoadingComplete(action = 'Loading') {
    this.announceToScreenReader(`${action} completed.`, 'polite');
  }

  /**
   * Transparency Adjustments
   */

  adjustTransparency(opacity) {
    return this.isReduceTransparencyEnabled ? 1.0 : opacity;
  }

  /**
   * Utility Methods
   */

  getAccessibilitySettings() {
    return {
      isScreenReaderEnabled: this.isScreenReaderEnabled,
      isReduceMotionEnabled: this.isReduceMotionEnabled,
      isReduceTransparencyEnabled: this.isReduceTransparencyEnabled,
    };
  }
}

// Singleton instance
const accessibilityEnhancer = new AccessibilityEnhancer();

/**
 * React Hook for Accessibility
 */
export const useAccessibility = () => {
  return {
    ...accessibilityEnhancer.getAccessibilitySettings(),
    announceToScreenReader: accessibilityEnhancer.announceToScreenReader.bind(accessibilityEnhancer),
    setAccessibilityFocus: accessibilityEnhancer.setAccessibilityFocus.bind(accessibilityEnhancer),
    createAccessibleButton: accessibilityEnhancer.createAccessibleButton.bind(accessibilityEnhancer),
    createAccessibleText: accessibilityEnhancer.createAccessibleText.bind(accessibilityEnhancer),
    createAccessibleInput: accessibilityEnhancer.createAccessibleInput.bind(accessibilityEnhancer),
    validateContrastRatio: accessibilityEnhancer.validateContrastRatio.bind(accessibilityEnhancer),
    getAnimationDuration: accessibilityEnhancer.getAnimationDuration.bind(accessibilityEnhancer),
    getAnimationConfig: accessibilityEnhancer.getAnimationConfig.bind(accessibilityEnhancer),
    announceError: accessibilityEnhancer.announceError.bind(accessibilityEnhancer),
    announceSuccess: accessibilityEnhancer.announceSuccess.bind(accessibilityEnhancer),
    announceFormErrors: accessibilityEnhancer.announceFormErrors.bind(accessibilityEnhancer),
    announceLoadingStart: accessibilityEnhancer.announceLoadingStart.bind(accessibilityEnhancer),
    announceLoadingComplete: accessibilityEnhancer.announceLoadingComplete.bind(accessibilityEnhancer),
    adjustTransparency: accessibilityEnhancer.adjustTransparency.bind(accessibilityEnhancer),
  };
};

export default accessibilityEnhancer;
