/**
 * Easing Curves
 * @description Reanimated-dependent easing curves, separated to avoid import side effects
 *
 * Import directly when needed:
 * ```tsx
 * import { easingCurves, easings } from '@/shared/theme/easingCurves';
 * ```
 */

import {
  Easing,
  type EasingFunction,
  type EasingFactoryFn,
} from "react-native-reanimated";

import type { EasingKey, SpringConfig } from "./animationTimings";

/**
 * Standard easing curves using Reanimated's Easing
 * EasingFunction for in/out curves, EasingFactoryFn for bezier curves
 */
export const easingCurves: Record<EasingKey, EasingFunction | EasingFactoryFn> = {
  /** Ease in - accelerating from zero velocity */
  easeIn: Easing.in(Easing.ease),
  /** Ease out - decelerating to zero velocity */
  easeOut: Easing.out(Easing.ease),
  /** Ease in-out - accelerating then decelerating */
  easeInOut: Easing.inOut(Easing.ease),
  /** Gentle - very subtle easing for minimal motion */
  gentle: Easing.bezier(0.25, 0.1, 0.25, 1),
  /** Calming - therapeutic easing for relaxation features */
  calming: Easing.bezier(0.4, 0.0, 0.2, 1),
};

/**
 * Spring configuration for bouncy animations
 */
const spring: SpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/**
 * Therapeutic spring configuration for calming animations
 * Higher damping and lower stiffness for gentler motion
 */
const therapeuticSpring: SpringConfig = {
  damping: 20,
  stiffness: 100,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

/**
 * Easings object containing curves and spring configs
 */
export const easings = {
  ...easingCurves,
  spring,
  therapeuticSpring,
} as const;
