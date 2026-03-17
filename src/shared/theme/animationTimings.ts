/**
 * Animation Timings
 * @description Animation timing tokens for therapeutic mental health application
 * @task Task 1.1.3: Add Animation Timings
 *
 * Provides consistent animation durations, easing curves, and presets
 * compatible with React Native Reanimated and Moti.
 */

/**
 * Duration key type
 */
export type DurationKey =
  | "instant"
  | "fast"
  | "normal"
  | "slow"
  | "therapeutic"
  | "breathing";

/**
 * Stagger key type
 */
export type StaggerKey = "fast" | "normal" | "slow";

/**
 * Easing key type
 */
export type EasingKey =
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "gentle"
  | "calming";

/**
 * Animation preset key type
 */
export type AnimationPresetKey =
  | "fadeIn"
  | "slideUp"
  | "scalePress"
  | "breathingCircle";

/**
 * Spring configuration interface
 */
export interface SpringConfig {
  damping: number;
  stiffness: number;
  mass?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
}

/**
 * Animation preset interface
 */
export interface AnimationPreset {
  from: Record<string, number>;
  to: Record<string, number>;
  duration?: number;
}

/**
 * Animation durations in milliseconds
 * Designed for therapeutic, calming user experiences
 */
const duration: Record<DurationKey, number> = {
  /** Instant feedback - 100ms */
  instant: 100,
  /** Fast transitions - 200ms */
  fast: 200,
  /** Normal animations - 300ms */
  normal: 300,
  /** Slow, deliberate animations - 500ms */
  slow: 500,
  /** Therapeutic pace for calming features - 800ms */
  therapeutic: 800,
  /** Breathing exercise duration - 4000ms (4 seconds) */
  breathing: 4000,
};

/**
 * Stagger delays for sequential animations
 */
const stagger: Record<StaggerKey, number> = {
  /** Fast stagger - 50ms between items */
  fast: 50,
  /** Normal stagger - 100ms between items */
  normal: 100,
  /** Slow stagger - 150ms between items */
  slow: 150,
};

/**
 * Animations object containing duration and stagger
 */
export const animations = {
  duration,
  stagger,
} as const;

/**
 * Pre-configured animation presets
 * Compatible with Moti's from/animate pattern
 */
export const animationPresets: Record<AnimationPresetKey, AnimationPreset> = {
  /**
   * Fade in animation
   * Use for: Content reveals, modal appearances
   */
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },

  /**
   * Slide up animation
   * Use for: Bottom sheets, toasts, cards entering
   */
  slideUp: {
    from: { translateY: 20, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },

  /**
   * Scale press animation
   * Use for: Button press feedback, interactive elements
   */
  scalePress: {
    from: { scale: 1 },
    to: { scale: 0.96 },
  },

  /**
   * Breathing circle animation
   * Use for: Breathing exercises, meditation features
   */
  breathingCircle: {
    from: { scale: 1, opacity: 0.8 },
    to: { scale: 1.3, opacity: 1 },
    duration: duration.breathing,
  },
};

export default animations;
