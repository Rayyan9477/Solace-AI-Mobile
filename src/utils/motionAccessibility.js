/**
 * Motion Accessibility Utility
 * Provides motion reduction support for users with vestibular disorders
 * Implements WCAG 2.1 Success Criterion 2.3.3 Animation from Interactions
 */

import { useState, useEffect, useCallback } from 'react';
import { Platform, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web-safe AccessibilityInfo import
let AccessibilityInfo;
if (Platform.OS === 'web') {
  AccessibilityInfo = {
    isReduceMotionEnabled: () => {
      // Check for prefers-reduced-motion on web
      if (typeof window !== 'undefined' && window.matchMedia) {
        return Promise.resolve(
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
      }
      return Promise.resolve(false);
    },
    addEventListener: (event, callback) => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e) => callback(e.matches);
        mediaQuery.addListener(handler);
        return {
          remove: () => mediaQuery.removeListener(handler)
        };
      }
      return { remove: () => {} };
    }
  };
} else {
  AccessibilityInfo = require('react-native').AccessibilityInfo;
}

// Motion types and their accessibility-safe alternatives
export const MOTION_TYPES = {
  PARALLAX: 'parallax',
  FADE: 'fade',
  SLIDE: 'slide',
  SCALE: 'scale',
  ROTATE: 'rotate',
  BOUNCE: 'bounce',
  PULSE: 'pulse',
  SHAKE: 'shake',
  WAVE: 'wave'
};

// Safe motion alternatives for reduced motion users
export const REDUCED_MOTION_ALTERNATIVES = {
  [MOTION_TYPES.PARALLAX]: 'instant',
  [MOTION_TYPES.FADE]: 'instant',
  [MOTION_TYPES.SLIDE]: 'instant',
  [MOTION_TYPES.SCALE]: 'instant',
  [MOTION_TYPES.ROTATE]: 'instant',
  [MOTION_TYPES.BOUNCE]: 'fade',
  [MOTION_TYPES.PULSE]: 'fade',
  [MOTION_TYPES.SHAKE]: 'instant',
  [MOTION_TYPES.WAVE]: 'instant'
};

// Motion preferences storage key
const MOTION_PREFERENCES_KEY = '@solace_motion_preferences';

// Hook for motion reduction support
export const useMotionAccessibility = () => {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  const [motionPreferences, setMotionPreferences] = useState({
    respectSystemPreferences: true,
    customReducedMotion: false,
    allowedMotions: Object.values(MOTION_TYPES),
    sensitivityLevel: 'normal' // 'low', 'normal', 'high'
  });

  // Load motion preferences from storage
  const loadMotionPreferences = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(MOTION_PREFERENCES_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        setMotionPreferences(prev => ({ ...prev, ...preferences }));
        
        if (!preferences.respectSystemPreferences) {
          setIsReducedMotionEnabled(preferences.customReducedMotion);
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load motion preferences:', error);
    }

    // Check system preferences
    try {
      const systemReducedMotion = await AccessibilityInfo.isReduceMotionEnabled();
      setIsReducedMotionEnabled(systemReducedMotion);
    } catch (error) {
      console.warn('Failed to check system motion preferences:', error);
      setIsReducedMotionEnabled(false);
    }
  }, []);

  // Save motion preferences to storage
  const saveMotionPreferences = useCallback(async (preferences) => {
    try {
      await AsyncStorage.setItem(
        MOTION_PREFERENCES_KEY, 
        JSON.stringify(preferences)
      );
      setMotionPreferences(preferences);
      
      if (!preferences.respectSystemPreferences) {
        setIsReducedMotionEnabled(preferences.customReducedMotion);
      }
    } catch (error) {
      console.warn('Failed to save motion preferences:', error);
    }
  }, []);

  // Update motion preferences
  const updateMotionPreferences = useCallback((updates) => {
    const newPreferences = { ...motionPreferences, ...updates };
    saveMotionPreferences(newPreferences);
  }, [motionPreferences, saveMotionPreferences]);

  // Check if specific motion type is allowed
  const isMotionAllowed = useCallback((motionType) => {
    if (isReducedMotionEnabled) {
      return false;
    }
    return motionPreferences.allowedMotions.includes(motionType);
  }, [isReducedMotionEnabled, motionPreferences.allowedMotions]);

  // Get animation duration based on motion preferences
  const getAnimationDuration = useCallback((defaultDuration, motionType = MOTION_TYPES.FADE) => {
    if (isReducedMotionEnabled) {
      return 0; // No animation
    }
    
    if (!isMotionAllowed(motionType)) {
      return 0;
    }

    // Adjust duration based on sensitivity level
    const multipliers = {
      low: 0.5,      // Faster animations
      normal: 1.0,   // Default speed
      high: 1.5      // Slower animations
    };

    return defaultDuration * (multipliers[motionPreferences.sensitivityLevel] || 1.0);
  }, [isReducedMotionEnabled, isMotionAllowed, motionPreferences.sensitivityLevel]);

  // Get safe animation configuration
  const getSafeAnimationConfig = useCallback((config, motionType = MOTION_TYPES.FADE) => {
    const duration = getAnimationDuration(config.duration || 300, motionType);
    
    if (duration === 0) {
      return {
        ...config,
        duration: 0,
        delay: 0,
        useNativeDriver: true
      };
    }

    return {
      ...config,
      duration,
      useNativeDriver: config.useNativeDriver !== false
    };
  }, [getAnimationDuration]);

  // Create accessibility-aware animated value
  const createAnimatedValue = useCallback((initialValue = 0) => {
    return new Animated.Value(initialValue);
  }, []);

  // Create safe animation timing
  const createSafeTiming = useCallback((animatedValue, toValue, config = {}, motionType = MOTION_TYPES.FADE) => {
    const safeConfig = getSafeAnimationConfig(config, motionType);
    return Animated.timing(animatedValue, {
      toValue,
      ...safeConfig
    });
  }, [getSafeAnimationConfig]);

  // Create safe spring animation
  const createSafeSpring = useCallback((animatedValue, toValue, config = {}, motionType = MOTION_TYPES.BOUNCE) => {
    if (isReducedMotionEnabled || !isMotionAllowed(motionType)) {
      // Use timing instead of spring for reduced motion
      return Animated.timing(animatedValue, {
        toValue,
        duration: 0,
        useNativeDriver: config.useNativeDriver !== false
      });
    }

    return Animated.spring(animatedValue, {
      toValue,
      tension: config.tension || 100,
      friction: config.friction || 8,
      useNativeDriver: config.useNativeDriver !== false,
      ...config
    });
  }, [isReducedMotionEnabled, isMotionAllowed]);

  // Initialize on mount
  useEffect(() => {
    loadMotionPreferences();

    // Listen for system preference changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (motionPreferences.respectSystemPreferences) {
          setIsReducedMotionEnabled(enabled);
        }
      }
    );

    return () => subscription?.remove();
  }, [loadMotionPreferences, motionPreferences.respectSystemPreferences]);

  return {
    isReducedMotionEnabled,
    motionPreferences,
    updateMotionPreferences,
    isMotionAllowed,
    getAnimationDuration,
    getSafeAnimationConfig,
    createAnimatedValue,
    createSafeTiming,
    createSafeSpring
  };
};

// Higher-order component for motion-aware animations
export const withMotionAccessibility = (WrappedComponent) => {
  return function MotionAccessibleComponent(props) {
    const motionUtils = useMotionAccessibility();
    
    return (
      <WrappedComponent
        {...props}
        motionUtils={motionUtils}
      />
    );
  };
};

// Accessibility-aware animation presets for mental health app
export const MentalHealthAnimations = {
  // Gentle fade in for mood tracking
  moodFadeIn: (animatedValue, motionUtils) => {
    return motionUtils.createSafeTiming(
      animatedValue,
      1,
      { duration: 800 },
      MOTION_TYPES.FADE
    );
  },

  // Calming slide for therapy content
  therapySlide: (animatedValue, motionUtils) => {
    return motionUtils.createSafeTiming(
      animatedValue,
      0,
      { duration: 600 },
      MOTION_TYPES.SLIDE
    );
  },

  // Gentle pulse for attention (crisis-safe)
  gentlePulse: (animatedValue, motionUtils) => {
    if (motionUtils.isReducedMotionEnabled) {
      // Static state for reduced motion
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true
      });
    }

    return Animated.loop(
      Animated.sequence([
        motionUtils.createSafeTiming(
          animatedValue,
          1.05,
          { duration: 2000 },
          MOTION_TYPES.PULSE
        ),
        motionUtils.createSafeTiming(
          animatedValue,
          1,
          { duration: 2000 },
          MOTION_TYPES.PULSE
        )
      ])
    );
  },

  // Emergency button attention (respects motion sensitivity)
  emergencyAttention: (animatedValue, motionUtils) => {
    if (motionUtils.isReducedMotionEnabled) {
      // High contrast static state for emergencies
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true
      });
    }

    // Gentle but noticeable pulsing for emergency elements
    return Animated.loop(
      Animated.sequence([
        motionUtils.createSafeTiming(
          animatedValue,
          1.1,
          { duration: 1000 },
          MOTION_TYPES.PULSE
        ),
        motionUtils.createSafeTiming(
          animatedValue,
          1,
          { duration: 1000 },
          MOTION_TYPES.PULSE
        )
      ])
    );
  },

  // Page transition (instant if reduced motion)
  pageTransition: (animatedValue, motionUtils) => {
    return motionUtils.createSafeTiming(
      animatedValue,
      1,
      { duration: 300 },
      MOTION_TYPES.SLIDE
    );
  }
};

// Motion accessibility settings component props
export const getMotionSettingsProps = (motionUtils) => ({
  respectSystemPreferences: {
    value: motionUtils.motionPreferences.respectSystemPreferences,
    onValueChange: (value) => motionUtils.updateMotionPreferences({
      respectSystemPreferences: value
    }),
    accessibilityLabel: 'Respect system motion preferences',
    accessibilityHint: 'Use system-wide reduced motion settings'
  },
  
  customReducedMotion: {
    value: motionUtils.motionPreferences.customReducedMotion,
    onValueChange: (value) => motionUtils.updateMotionPreferences({
      customReducedMotion: value
    }),
    accessibilityLabel: 'Reduce animations',
    accessibilityHint: 'Minimize or disable animations for comfort',
    disabled: motionUtils.motionPreferences.respectSystemPreferences
  },

  sensitivityLevel: {
    value: motionUtils.motionPreferences.sensitivityLevel,
    options: [
      { label: 'Low sensitivity (faster)', value: 'low' },
      { label: 'Normal sensitivity', value: 'normal' },
      { label: 'High sensitivity (slower)', value: 'high' }
    ],
    onValueChange: (value) => motionUtils.updateMotionPreferences({
      sensitivityLevel: value
    }),
    accessibilityLabel: 'Animation sensitivity level',
    accessibilityHint: 'Adjust animation speed for comfort'
  }
});

export default {
  MOTION_TYPES,
  REDUCED_MOTION_ALTERNATIVES,
  useMotionAccessibility,
  withMotionAccessibility,
  MentalHealthAnimations,
  getMotionSettingsProps
};