/**
 * Haptic Feedback Utilities for Solace AI Mobile App
 * Provides consistent haptic feedback patterns for mental health interactions
 */

import { Vibration, Platform } from 'react-native';

// Haptic feedback patterns for different interactions
export const HapticPatterns = {
  // Light feedback for subtle interactions
  LIGHT: {
    ios: 'impactLight',
    android: [10],
  },
  
  // Medium feedback for standard interactions
  MEDIUM: {
    ios: 'impactMedium',
    android: [50],
  },
  
  // Heavy feedback for important interactions
  HEAVY: {
    ios: 'impactHeavy',
    android: [100],
  },
  
  // Success feedback for positive outcomes
  SUCCESS: {
    ios: 'notificationSuccess',
    android: [50, 50, 100],
  },
  
  // Warning feedback for caution
  WARNING: {
    ios: 'notificationWarning',
    android: [100, 50, 100],
  },
  
  // Error feedback for mistakes
  ERROR: {
    ios: 'notificationError',
    android: [200, 100, 200],
  },
  
  // Selection feedback for choices
  SELECTION: {
    ios: 'selection',
    android: [30],
  },
  
  // Mental health specific patterns
  MOOD_SELECTION: {
    ios: 'impactLight',
    android: [40, 20, 40],
  },
  
  INTENSITY_CHANGE: {
    ios: 'selection',
    android: [20],
  },
  
  ASSESSMENT_COMPLETE: {
    ios: 'notificationSuccess',
    android: [100, 50, 100, 50, 150],
  },
  
  THERAPEUTIC_ACTION: {
    ios: 'impactMedium',
    android: [60, 30, 60],
  },
  
  CHAT_MESSAGE_SENT: {
    ios: 'impactLight',
    android: [25],
  },
  
  EMERGENCY_ALERT: {
    ios: 'notificationError',
    android: [300, 100, 300, 100, 300],
  },
};

class HapticFeedbackManager {
  constructor() {
    this.isEnabled = true;
    this.isSupported = Platform.OS === 'ios' || Platform.OS === 'android';
  }

  /**
   * Enable or disable haptic feedback
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Check if haptic feedback is enabled
   */
  getEnabled() {
    return this.isEnabled;
  }

  /**
   * Trigger haptic feedback with a specific pattern
   */
  trigger(pattern, options = {}) {
    if (!this.isEnabled || !this.isSupported) {
      return;
    }

    const { 
      force = false,  // Force haptic even if disabled
      delay = 0,      // Delay before triggering
    } = options;

    if (!force && !this.isEnabled) {
      return;
    }

    const executeHaptic = () => {
      if (Platform.OS === 'ios') {
        this.triggerIOS(pattern);
      } else if (Platform.OS === 'android') {
        this.triggerAndroid(pattern);
      }
    };

    if (delay > 0) {
      setTimeout(executeHaptic, delay);
    } else {
      executeHaptic();
    }
  }

  /**
   * Trigger iOS haptic feedback
   */
  triggerIOS(pattern) {
    try {
      // This would use react-native-haptic-feedback in a real implementation
      // For now, we'll use Vibration as a fallback
      if (pattern.ios === 'impactLight' || pattern.ios === 'selection') {
        Vibration.vibrate(10);
      } else if (pattern.ios === 'impactMedium') {
        Vibration.vibrate(30);
      } else if (pattern.ios === 'impactHeavy') {
        Vibration.vibrate(50);
      } else if (pattern.ios.includes('notification')) {
        Vibration.vibrate([50, 20, 50]);
      }
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * Trigger Android haptic feedback
   */
  triggerAndroid(pattern) {
    try {
      if (Array.isArray(pattern.android)) {
        Vibration.vibrate(pattern.android);
      } else {
        Vibration.vibrate(pattern.android);
      }
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  /**
   * Mental health specific haptic methods
   */
  
  // Mood tracking haptics
  moodSelected(mood) {
    this.trigger(HapticPatterns.MOOD_SELECTION);
  }

  intensityChanged(intensity) {
    this.trigger(HapticPatterns.INTENSITY_CHANGE);
  }

  moodEntrySaved() {
    this.trigger(HapticPatterns.SUCCESS);
  }

  // Assessment haptics
  assessmentStarted() {
    this.trigger(HapticPatterns.MEDIUM);
  }

  assessmentAnswered() {
    this.trigger(HapticPatterns.SELECTION);
  }

  assessmentCompleted() {
    this.trigger(HapticPatterns.ASSESSMENT_COMPLETE);
  }

  // Chat haptics
  messageSent() {
    this.trigger(HapticPatterns.CHAT_MESSAGE_SENT);
  }

  messageReceived() {
    this.trigger(HapticPatterns.LIGHT);
  }

  // Therapeutic action haptics
  therapeuticActionTaken() {
    this.trigger(HapticPatterns.THERAPEUTIC_ACTION);
  }

  breathingExerciseStart() {
    this.trigger(HapticPatterns.MEDIUM);
  }

  meditationStart() {
    this.trigger(HapticPatterns.LIGHT);
  }

  // Emergency and alert haptics
  emergencyAlertTriggered() {
    this.trigger(HapticPatterns.EMERGENCY_ALERT, { force: true });
  }

  criticalNotification() {
    this.trigger(HapticPatterns.ERROR, { force: true });
  }

  // General UI haptics
  buttonPressed() {
    this.trigger(HapticPatterns.LIGHT);
  }

  toggleSwitched() {
    this.trigger(HapticPatterns.SELECTION);
  }

  tabChanged() {
    this.trigger(HapticPatterns.LIGHT);
  }

  errorOccurred() {
    this.trigger(HapticPatterns.WARNING);
  }

  successAction() {
    this.trigger(HapticPatterns.SUCCESS);
  }

  /**
   * Create a custom haptic pattern
   */
  createCustomPattern(durations, repeat = 1) {
    if (!Array.isArray(durations)) {
      durations = [durations];
    }

    const pattern = {
      ios: 'impactMedium', // Fallback for iOS
      android: durations,
    };

    for (let i = 0; i < repeat; i++) {
      this.trigger(pattern, { delay: i * (durations.reduce((a, b) => a + b, 0) + 100) });
    }
  }

  /**
   * Stop all vibrations
   */
  stop() {
    try {
      Vibration.cancel();
    } catch (error) {
      console.warn('Could not cancel vibration:', error);
    }
  }
}

// Create and export a singleton instance
const hapticFeedback = new HapticFeedbackManager();

export default hapticFeedback;

// Export individual haptic functions for convenience
export const {
  moodSelected,
  intensityChanged,
  moodEntrySaved,
  assessmentStarted,
  assessmentAnswered,
  assessmentCompleted,
  messageSent,
  messageReceived,
  therapeuticActionTaken,
  breathingExerciseStart,
  meditationStart,
  emergencyAlertTriggered,
  criticalNotification,
  buttonPressed,
  toggleSwitched,
  tabChanged,
  errorOccurred,
  successAction,
} = hapticFeedback;

// Export utility functions
export const enableHaptics = (enabled) => hapticFeedback.setEnabled(enabled);
export const isHapticsEnabled = () => hapticFeedback.getEnabled();
export const stopHaptics = () => hapticFeedback.stop();
export const customHaptic = (durations, repeat) => hapticFeedback.createCustomPattern(durations, repeat);
