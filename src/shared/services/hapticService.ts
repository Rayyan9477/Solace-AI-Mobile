/**
 * Comprehensive Haptic Feedback Service
 * Provides tactile feedback for user interactions with mental health considerations
 *
 * Features:
 * - Multiple feedback patterns for different interaction types
 * - Therapeutic haptic patterns for mental health features
 * - User preference support (can be disabled for sensitive users)
 * - Platform-specific implementations
 * - Accessibility considerations
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@shared/utils/logger';

// ============ TYPES ============

export enum HapticFeedbackType {
  // Standard UI interactions
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',

  // Selection events
  SELECTION = 'selection',
  SELECTION_CHANGED = 'selectionChanged',

  // Notification events
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',

  // Mental health specific
  THERAPEUTIC = 'therapeutic',
  BREATHING = 'breathing',
  CALMING = 'calming',
  GROUNDING = 'grounding',

  // Custom patterns
  DOUBLE_TAP = 'doubleTap',
  LONG_PRESS = 'longPress',
  PATTERN = 'pattern',
}

export interface HapticPattern {
  type: HapticFeedbackType;
  duration?: number;
  interval?: number;
  count?: number;
  intensity?: 'light' | 'medium' | 'heavy';
}

export interface HapticPreferences {
  enabled: boolean;
  intensity: 'light' | 'medium' | 'strong';
  mentalHealthHaptics: boolean;
  notificationHaptics: boolean;
  keyboardHaptics: boolean;
}

// ============ CONSTANTS ============

const STORAGE_KEY = '@solace_haptic_preferences';

const DEFAULT_PREFERENCES: HapticPreferences = {
  enabled: true,
  intensity: 'medium',
  mentalHealthHaptics: true,
  notificationHaptics: true,
  keyboardHaptics: false,
};

const HAPTIC_PATTERNS: Record<HapticFeedbackType, HapticPattern> = {
  [HapticFeedbackType.LIGHT]: {
    type: HapticFeedbackType.LIGHT,
    intensity: 'light',
  },
  [HapticFeedbackType.MEDIUM]: {
    type: HapticFeedbackType.MEDIUM,
    intensity: 'medium',
  },
  [HapticFeedbackType.HEAVY]: {
    type: HapticFeedbackType.HEAVY,
    intensity: 'heavy',
  },
  [HapticFeedbackType.SELECTION]: {
    type: HapticFeedbackType.SELECTION,
    intensity: 'light',
  },
  [HapticFeedbackType.SELECTION_CHANGED]: {
    type: HapticFeedbackType.SELECTION_CHANGED,
    intensity: 'light',
  },
  [HapticFeedbackType.SUCCESS]: {
    type: HapticFeedbackType.SUCCESS,
    intensity: 'medium',
    count: 2,
    interval: 100,
  },
  [HapticFeedbackType.WARNING]: {
    type: HapticFeedbackType.WARNING,
    intensity: 'medium',
    count: 2,
    interval: 150,
  },
  [HapticFeedbackType.ERROR]: {
    type: HapticFeedbackType.ERROR,
    intensity: 'heavy',
    count: 3,
    interval: 100,
  },
  [HapticFeedbackType.THERAPEUTIC]: {
    type: HapticFeedbackType.THERAPEUTIC,
    intensity: 'light',
    duration: 1000,
  },
  [HapticFeedbackType.BREATHING]: {
    type: HapticFeedbackType.BREATHING,
    intensity: 'light',
    duration: 4000,
    count: 3,
    interval: 1000,
  },
  [HapticFeedbackType.CALMING]: {
    type: HapticFeedbackType.CALMING,
    intensity: 'light',
    duration: 500,
    count: 5,
    interval: 500,
  },
  [HapticFeedbackType.GROUNDING]: {
    type: HapticFeedbackType.GROUNDING,
    intensity: 'medium',
    duration: 300,
    count: 5,
    interval: 300,
  },
  [HapticFeedbackType.DOUBLE_TAP]: {
    type: HapticFeedbackType.DOUBLE_TAP,
    intensity: 'medium',
    count: 2,
    interval: 100,
  },
  [HapticFeedbackType.LONG_PRESS]: {
    type: HapticFeedbackType.LONG_PRESS,
    intensity: 'medium',
    duration: 200,
  },
  [HapticFeedbackType.PATTERN]: {
    type: HapticFeedbackType.PATTERN,
    intensity: 'light',
  },
};

// ============ HAPTIC SERVICE CLASS ============

class HapticService {
  private preferences: HapticPreferences = DEFAULT_PREFERENCES;
  private initialized = false;
  private supported = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize haptic service
   */
  private async init() {
    try {
      // Check platform support
      this.supported = Platform.OS === 'ios' || Platform.OS === 'android';

      if (!this.supported) {
        logger.info('Haptic feedback not supported on this platform');
        return;
      }

      // Load user preferences
      await this.loadPreferences();

      this.initialized = true;
      logger.info('Haptic service initialized', { preferences: this.preferences });
    } catch (error) {
      logger.error('Failed to initialize haptic service:', error);
    }
  }

  /**
   * Load user preferences from storage
   */
  private async loadPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.preferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      logger.error('Failed to load haptic preferences:', error);
      this.preferences = DEFAULT_PREFERENCES;
    }
  }

  /**
   * Save user preferences to storage
   */
  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      logger.error('Failed to save haptic preferences:', error);
    }
  }

  /**
   * Check if haptics are enabled and supported
   */
  private canTriggerHaptic(): boolean {
    return this.initialized && this.supported && this.preferences.enabled;
  }

  /**
   * Get intensity based on user preference
   */
  private getAdjustedIntensity(baseIntensity: 'light' | 'medium' | 'heavy'): Haptics.ImpactFeedbackStyle {
    const { intensity } = this.preferences;

    // Map intensity based on user preference
    if (intensity === 'light') {
      return Haptics.ImpactFeedbackStyle.Light;
    } else if (intensity === 'strong') {
      return baseIntensity === 'light'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Heavy;
    } else {
      // Medium preference
      switch (baseIntensity) {
        case 'light':
          return Haptics.ImpactFeedbackStyle.Light;
        case 'medium':
          return Haptics.ImpactFeedbackStyle.Medium;
        case 'heavy':
          return Haptics.ImpactFeedbackStyle.Heavy;
        default:
          return Haptics.ImpactFeedbackStyle.Light;
      }
    }
  }

  // ============ PUBLIC API ============

  /**
   * Trigger haptic feedback
   */
  async trigger(type: HapticFeedbackType): Promise<void> {
    if (!this.canTriggerHaptic()) return;

    try {
      const pattern = HAPTIC_PATTERNS[type];

      // Check specific preferences
      if (type === HapticFeedbackType.THERAPEUTIC ||
          type === HapticFeedbackType.BREATHING ||
          type === HapticFeedbackType.CALMING ||
          type === HapticFeedbackType.GROUNDING) {
        if (!this.preferences.mentalHealthHaptics) return;
      }

      if (type === HapticFeedbackType.SUCCESS ||
          type === HapticFeedbackType.WARNING ||
          type === HapticFeedbackType.ERROR) {
        if (!this.preferences.notificationHaptics) return;
      }

      // Execute haptic pattern
      await this.executePattern(pattern);

    } catch (error) {
      logger.error('Failed to trigger haptic feedback:', error);
    }
  }

  /**
   * Execute a haptic pattern
   */
  private async executePattern(pattern: HapticPattern): Promise<void> {
    const intensity = this.getAdjustedIntensity(pattern.intensity || 'medium');

    if (pattern.count && pattern.count > 1) {
      // Multiple haptics with interval
      for (let i = 0; i < pattern.count; i++) {
        if (i > 0 && pattern.interval) {
          await new Promise(resolve => setTimeout(resolve, pattern.interval));
        }

        switch (pattern.type) {
          case HapticFeedbackType.SELECTION:
          case HapticFeedbackType.SELECTION_CHANGED:
            await Haptics.selectionAsync();
            break;
          case HapticFeedbackType.SUCCESS:
          case HapticFeedbackType.WARNING:
          case HapticFeedbackType.ERROR:
            await Haptics.notificationAsync(
              pattern.type === HapticFeedbackType.SUCCESS
                ? Haptics.NotificationFeedbackType.Success
                : pattern.type === HapticFeedbackType.WARNING
                  ? Haptics.NotificationFeedbackType.Warning
                  : Haptics.NotificationFeedbackType.Error
            );
            break;
          default:
            await Haptics.impactAsync(intensity);
            break;
        }
      }
    } else {
      // Single haptic
      switch (pattern.type) {
        case HapticFeedbackType.SELECTION:
        case HapticFeedbackType.SELECTION_CHANGED:
          await Haptics.selectionAsync();
          break;
        case HapticFeedbackType.SUCCESS:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case HapticFeedbackType.WARNING:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case HapticFeedbackType.ERROR:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          await Haptics.impactAsync(intensity);
          break;
      }
    }
  }

  /**
   * Trigger impact haptic
   */
  async impact(style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
    if (!this.canTriggerHaptic()) return;

    try {
      const intensity = this.getAdjustedIntensity(style);
      await Haptics.impactAsync(intensity);
    } catch (error) {
      logger.error('Failed to trigger impact haptic:', error);
    }
  }

  /**
   * Trigger selection haptic
   */
  async selection(): Promise<void> {
    if (!this.canTriggerHaptic()) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      logger.error('Failed to trigger selection haptic:', error);
    }
  }

  /**
   * Trigger notification haptic
   */
  async notification(
    type: 'success' | 'warning' | 'error' = 'success'
  ): Promise<void> {
    if (!this.canTriggerHaptic()) return;

    if (!this.preferences.notificationHaptics) return;

    try {
      const feedbackType =
        type === 'success' ? Haptics.NotificationFeedbackType.Success :
        type === 'warning' ? Haptics.NotificationFeedbackType.Warning :
        Haptics.NotificationFeedbackType.Error;

      await Haptics.notificationAsync(feedbackType);
    } catch (error) {
      logger.error('Failed to trigger notification haptic:', error);
    }
  }

  /**
   * Trigger therapeutic breathing pattern
   */
  async breathingPattern(cycles: number = 3): Promise<void> {
    if (!this.canTriggerHaptic()) return;
    if (!this.preferences.mentalHealthHaptics) return;

    try {
      for (let i = 0; i < cycles; i++) {
        // Inhale haptic (4 seconds)
        await this.impact('light');
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Hold (4 seconds) - no haptic
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Exhale haptic (4 seconds)
        await this.impact('light');
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Pause before next cycle
        if (i < cycles - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      logger.error('Failed to execute breathing pattern:', error);
    }
  }

  /**
   * Trigger grounding pattern (5-4-3-2-1 technique support)
   */
  async groundingPattern(): Promise<void> {
    if (!this.canTriggerHaptic()) return;
    if (!this.preferences.mentalHealthHaptics) return;

    try {
      const counts = [5, 4, 3, 2, 1];

      for (const count of counts) {
        for (let i = 0; i < count; i++) {
          await this.impact('medium');
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        // Pause between counts
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      logger.error('Failed to execute grounding pattern:', error);
    }
  }

  /**
   * Custom haptic pattern
   */
  async customPattern(
    pattern: number[], // Array of durations in ms
    intensity: 'light' | 'medium' | 'heavy' = 'medium'
  ): Promise<void> {
    if (!this.canTriggerHaptic()) return;

    try {
      for (let i = 0; i < pattern.length; i++) {
        if (i % 2 === 0) {
          // Even indices: haptic on
          await this.impact(intensity);
        }
        // Wait for duration
        await new Promise(resolve => setTimeout(resolve, pattern[i]));
      }
    } catch (error) {
      logger.error('Failed to execute custom pattern:', error);
    }
  }

  // ============ PREFERENCES MANAGEMENT ============

  /**
   * Get current haptic preferences
   */
  getPreferences(): HapticPreferences {
    return { ...this.preferences };
  }

  /**
   * Update haptic preferences
   */
  async updatePreferences(preferences: Partial<HapticPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    await this.savePreferences();
    logger.info('Haptic preferences updated', { preferences: this.preferences });
  }

  /**
   * Enable/disable haptic feedback
   */
  async setEnabled(enabled: boolean): Promise<void> {
    this.preferences.enabled = enabled;
    await this.savePreferences();
  }

  /**
   * Check if haptics are enabled
   */
  isEnabled(): boolean {
    return this.preferences.enabled;
  }

  /**
   * Check if platform supports haptics
   */
  isSupported(): boolean {
    return this.supported;
  }

  /**
   * Reset to default preferences
   */
  async resetPreferences(): Promise<void> {
    this.preferences = DEFAULT_PREFERENCES;
    await this.savePreferences();
    logger.info('Haptic preferences reset to defaults');
  }
}

// ============ SINGLETON EXPORT ============

const hapticService = new HapticService();

// Export convenience functions
export const haptic = {
  // Standard triggers
  trigger: (type: HapticFeedbackType) => hapticService.trigger(type),
  impact: (style?: 'light' | 'medium' | 'heavy') => hapticService.impact(style),
  selection: () => hapticService.selection(),
  notification: (type?: 'success' | 'warning' | 'error') => hapticService.notification(type),

  // Mental health patterns
  breathingPattern: (cycles?: number) => hapticService.breathingPattern(cycles),
  groundingPattern: () => hapticService.groundingPattern(),

  // Custom patterns
  customPattern: (pattern: number[], intensity?: 'light' | 'medium' | 'heavy') =>
    hapticService.customPattern(pattern, intensity),

  // Preferences
  getPreferences: () => hapticService.getPreferences(),
  updatePreferences: (prefs: Partial<HapticPreferences>) => hapticService.updatePreferences(prefs),
  setEnabled: (enabled: boolean) => hapticService.setEnabled(enabled),
  isEnabled: () => hapticService.isEnabled(),
  isSupported: () => hapticService.isSupported(),
  resetPreferences: () => hapticService.resetPreferences(),
};

export default hapticService;