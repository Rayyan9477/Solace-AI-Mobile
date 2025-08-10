/**
 * Solace AI Mobile - shadcn UI Utilities for React Native
 * 
 * Utility functions for working with shadcn UI components in React Native,
 * optimized for mental health applications with therapeutic design principles.
 */

import { Animated, Platform } from 'react-native';
import { shadcnConfig } from './config';

// Color utility functions
export const colorUtils = {
  /**
   * Resolve a color token path to actual color value
   * @param {string} colorPath - Color path like 'primary.500' or 'therapeutic.calming.500'
   * @param {Object} theme - Theme object containing colors
   * @returns {string} Resolved color value
   */
  resolveColor(colorPath, theme = shadcnConfig.colors) {
    if (!colorPath) return 'transparent';
    
    const path = colorPath.split('.');
    let color = theme;
    
    for (const segment of path) {
      if (color && color[segment] !== undefined) {
        color = color[segment];
      } else {
        console.warn(`Color path '${colorPath}' not found in theme`);
        return '#000000'; // Fallback color
      }
    }
    
    return typeof color === 'string' ? color : color.toString();
  },
  
  /**
   * Get therapeutic color based on mood or context
   * @param {string} mood - Mood identifier (happy, calm, anxious, etc.)
   * @returns {string} Therapeutic color
   */
  getTherapeuticColor(mood) {
    const moodColors = shadcnConfig.colors.mood;
    return moodColors[mood] || moodColors.neutral;
  },
  
  /**
   * Generate gradient colors for therapeutic backgrounds
   * @param {string} scheme - Therapeutic scheme (calming, nurturing, peaceful, etc.)
   * @param {number} intensity - Intensity level (0-4, lower is lighter)
   * @returns {Array<string>} Array of gradient colors
   */
  getTherapeuticGradient(scheme, intensity = 2) {
    const therapeuticColors = shadcnConfig.colors.therapeutic[scheme];
    if (!therapeuticColors) return ['#ffffff', '#f8fafc'];
    
    const intensityMap = [50, 100, 200, 300, 400];
    const baseIntensity = intensityMap[Math.min(intensity, 4)];
    const endIntensity = intensityMap[Math.min(intensity + 1, 4)];
    
    return [
      therapeuticColors[baseIntensity],
      therapeuticColors[endIntensity],
    ];
  },
  
  /**
   * Adjust color opacity for layering effects
   * @param {string} color - Base color
   * @param {number} opacity - Opacity value (0-1)
   * @returns {string} Color with opacity
   */
  withOpacity(color, opacity) {
    // Convert hex to rgba if needed
    if (color.startsWith('#')) {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
};

// Style utility functions
export const styleUtils = {
  /**
   * Generate component styles based on variant and state
   * @param {string} component - Component type (button, card, input, etc.)
   * @param {string} variant - Variant name (primary, secondary, outline, etc.)
   * @param {string} state - State name (default, hover, focus, disabled)
   * @returns {Object} Style object for React Native
   */
  getVariantStyle(component, variant, state = 'default') {
    const componentVariants = shadcnConfig.variants[component];
    if (!componentVariants) return {};
    
    const variantConfig = componentVariants[variant];
    if (!variantConfig) return {};
    
    const stateConfig = variantConfig[state] || variantConfig.default || {};
    
    return {
      backgroundColor: colorUtils.resolveColor(stateConfig.backgroundColor),
      color: colorUtils.resolveColor(stateConfig.foregroundColor),
      borderColor: colorUtils.resolveColor(stateConfig.borderColor),
      borderWidth: stateConfig.borderWidth || 0,
      borderRadius: shadcnConfig.borderRadius[stateConfig.borderRadius] || 0,
      ...this.convertShadowStyle(stateConfig),
    };
  },
  
  /**
   * Convert shadow configuration to React Native style
   * @param {Object} config - Shadow configuration
   * @returns {Object} React Native shadow style
   */
  convertShadowStyle(config) {
    if (!config.shadowColor) return {};
    
    return {
      shadowColor: colorUtils.resolveColor(config.shadowColor),
      shadowOffset: config.shadowOffset || { width: 0, height: 2 },
      shadowOpacity: config.shadowOpacity || 0.1,
      shadowRadius: config.shadowRadius || 4,
      elevation: config.elevation || 3, // Android shadow
    };
  },
  
  /**
   * Generate responsive spacing based on screen size
   * @param {number} baseSpacing - Base spacing value
   * @param {Object} screenDimensions - Screen dimensions
   * @returns {number} Responsive spacing
   */
  getResponsiveSpacing(baseSpacing, screenDimensions) {
    const { width } = screenDimensions;
    
    // Mobile-first approach
    if (width < 768) return baseSpacing;
    if (width < 1024) return baseSpacing * 1.25;
    return baseSpacing * 1.5;
  },
  
  /**
   * Generate therapeutic card style with mood-based coloring
   * @param {string} mood - Current mood
   * @param {string} cardVariant - Card variant (elevated, outlined, flat)
   * @returns {Object} Card style object
   */
  getTherapeuticCardStyle(mood, cardVariant = 'elevated') {
    const baseStyle = this.getVariantStyle('card', cardVariant);
    const moodColor = colorUtils.getTherapeuticColor(mood);
    
    return {
      ...baseStyle,
      borderLeftWidth: 4,
      borderLeftColor: moodColor,
      shadowColor: colorUtils.withOpacity(moodColor, 0.3),
    };
  },
};

// Animation utility functions
export const animationUtils = {
  /**
   * Create gentle entrance animation for mental health apps
   * @param {Animated.Value} animatedValue - Animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  createGentleEntrance(animatedValue, config = {}) {
    const defaultConfig = shadcnConfig.animations.gentle;
    
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration: config.duration || defaultConfig.duration,
      useNativeDriver: true,
      ...config,
    });
  },
  
  /**
   * Create soothing slide-in animation
   * @param {Animated.Value} translateY - Y translation animated value
   * @param {Animated.Value} opacity - Opacity animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  createSoothingSlideIn(translateY, opacity, config = {}) {
    const defaultConfig = shadcnConfig.animations.soothing;
    
    return Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: config.duration || defaultConfig.duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: config.duration || defaultConfig.duration,
        useNativeDriver: true,
      }),
    ]);
  },
  
  /**
   * Create calming breathing animation
   * @param {Animated.Value} scaleValue - Scale animated value
   * @param {Object} config - Animation configuration
   * @returns {Animated.CompositeAnimation} Animation
   */
  createBreathingAnimation(scaleValue, config = {}) {
    const breathConfig = shadcnConfig.mentalHealth.calmingAnimations.breathe;
    
    return Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.05,
          duration: (config.duration || breathConfig.duration) / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: (config.duration || breathConfig.duration) / 2,
          useNativeDriver: true,
        }),
      ])
    );
  },
  
  /**
   * Create focus animation with therapeutic glow
   * @param {Animated.Value} glowValue - Glow animated value
   * @returns {Animated.CompositeAnimation} Animation
   */
  createTherapeuticFocus(glowValue) {
    const focusConfig = shadcnConfig.animations.focus;
    
    return Animated.timing(glowValue, {
      toValue: 1,
      duration: focusConfig.duration,
      useNativeDriver: false, // Shadow animations don't support native driver
    });
  },
  
  /**
   * Create staggered animation sequence for multiple elements
   * @param {Array<Animated.Value>} animatedValues - Array of animated values
   * @param {number} staggerDelay - Delay between animations
   * @returns {Animated.CompositeAnimation} Staggered animation
   */
  createStaggeredEntrance(animatedValues, staggerDelay = 100) {
    const animations = animatedValues.map((value, index) => 
      Animated.timing(value, {
        toValue: 1,
        duration: shadcnConfig.animations.gentle.duration,
        delay: index * staggerDelay,
        useNativeDriver: true,
      })
    );
    
    return Animated.parallel(animations);
  },
};

// Accessibility utility functions
export const accessibilityUtils = {
  /**
   * Generate accessibility props for components
   * @param {Object} config - Accessibility configuration
   * @returns {Object} Accessibility props
   */
  getAccessibilityProps(config) {
    const {
      label,
      hint,
      role = 'button',
      state = {},
      testID,
    } = config;
    
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityRole: role,
      accessibilityState: state,
      testID: testID,
      importantForAccessibility: 'yes',
    };
  },
  
  /**
   * Ensure minimum touch target size for mobile
   * @param {Object} dimensions - Current dimensions
   * @returns {Object} Touch target style and hitSlop
   */
  ensureMinimumTouchTarget(dimensions) {
    const minSize = shadcnConfig.accessibility.minimumTouchTarget;
    const { width = minSize, height = minSize } = dimensions;
    
    const extraWidth = Math.max(0, minSize - width);
    const extraHeight = Math.max(0, minSize - height);
    
    return {
      style: {
        minWidth: minSize,
        minHeight: minSize,
      },
      hitSlop: {
        top: extraHeight / 2,
        bottom: extraHeight / 2,
        left: extraWidth / 2,
        right: extraWidth / 2,
      },
    };
  },
  
  /**
   * Generate therapeutic content guidelines
   * @param {string} content - Text content
   * @returns {Object} Content analysis and recommendations
   */
  analyzeTherapeuticContent(content) {
    const guidelines = shadcnConfig.mentalHealth.contentGuidelines;
    
    return {
      characterCount: content.length,
      wordCount: content.split(/\s+/).length,
      recommendedLineBreaks: Math.ceil(content.length / guidelines.maxCharactersPerLine),
      isOptimalLength: content.length <= guidelines.maxCharactersPerLine * 3, // Max 3 lines
      readabilityScore: this.calculateReadabilityScore(content),
    };
  },
  
  /**
   * Simple readability score calculation
   * @param {string} text - Text to analyze
   * @returns {number} Readability score (0-100)
   */
  calculateReadabilityScore(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Simplified score - shorter sentences are better for mental health apps
    return Math.max(0, Math.min(100, 100 - avgWordsPerSentence * 5));
  },
};

// Platform-specific utility functions
export const platformUtils = {
  /**
   * Get platform-specific styles
   * @param {Object} styles - Style object with platform keys
   * @returns {Object} Platform-specific styles
   */
  getPlatformStyle(styles) {
    const { ios, android, web, default: defaultStyle = {} } = styles;
    
    if (Platform.OS === 'ios' && ios) return { ...defaultStyle, ...ios };
    if (Platform.OS === 'android' && android) return { ...defaultStyle, ...android };
    if (Platform.OS === 'web' && web) return { ...defaultStyle, ...web };
    
    return defaultStyle;
  },
  
  /**
   * Get platform-specific shadow style
   * @param {Object} shadowConfig - Shadow configuration
   * @returns {Object} Platform-optimized shadow
   */
  getPlatformShadow(shadowConfig) {
    if (Platform.OS === 'android') {
      return {
        elevation: shadowConfig.elevation || 3,
      };
    }
    
    return {
      shadowColor: shadowConfig.shadowColor || '#000',
      shadowOffset: shadowConfig.shadowOffset || { width: 0, height: 2 },
      shadowOpacity: shadowConfig.shadowOpacity || 0.1,
      shadowRadius: shadowConfig.shadowRadius || 4,
    };
  },
  
  /**
   * Check if device supports haptic feedback
   * @returns {boolean} Haptic support status
   */
  supportsHaptics() {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  },
};

// Theme utility functions
export const themeUtils = {
  /**
   * Create theme variations for different times of day
   * @param {string} baseTheme - Base theme name
   * @param {Date} time - Current time
   * @returns {Object} Time-appropriate theme
   */
  getTimeBasedTheme(baseTheme, time = new Date()) {
    const hour = time.getHours();
    
    let timeContext;
    if (hour >= 5 && hour < 12) timeContext = 'morning';
    else if (hour >= 12 && hour < 17) timeContext = 'afternoon';
    else if (hour >= 17 && hour < 21) timeContext = 'evening';
    else timeContext = 'night';
    
    const timeColors = {
      morning: 'therapeutic.energizing',
      afternoon: 'therapeutic.calming',
      evening: 'therapeutic.peaceful',
      night: 'therapeutic.grounding',
    };
    
    return {
      ...shadcnConfig,
      accent: colorUtils.resolveColor(timeColors[timeContext]),
      timeContext,
    };
  },
  
  /**
   * Apply mood-based theme modifications
   * @param {Object} baseTheme - Base theme object
   * @param {string} mood - Current mood
   * @returns {Object} Mood-modified theme
   */
  applyMoodTheme(baseTheme, mood) {
    const moodColor = colorUtils.getTherapeuticColor(mood);
    
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        accent: {
          ...baseTheme.colors.accent,
          500: moodColor,
        },
      },
    };
  },
};

// Export all utilities
export default {
  colorUtils,
  styleUtils,
  animationUtils,
  accessibilityUtils,
  platformUtils,
  themeUtils,
};