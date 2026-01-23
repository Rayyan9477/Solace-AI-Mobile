/**
 * Theme Module Exports
 * Central theme system exports for Solace AI Design System
 *
 * @description
 * This module re-exports all theme-related tokens and utilities.
 * Import from this file for consistent theming across the app.
 *
 * @example
 * ```tsx
 * import { shadows, applyShadow } from '@/shared/theme';
 *
 * const cardStyle = {
 *   ...applyShadow('md'),
 * };
 * ```
 */

// Shadow Tokens (Task 1.1.1)
export { shadows, applyShadow } from "./shadows";
export type { ShadowLevel, ShadowStyle } from "./shadows";

// Gradient Tokens (Task 1.1.2)
export { gradients, getGradientProps } from "./gradients";
export type {
  GradientPreset,
  GradientConfig,
  GradientDirection,
  LinearGradientProps,
} from "./gradients";

// Animation Timings (Task 1.1.3)
export { animations, easings, animationPresets } from "./animationTimings";
export type {
  DurationKey,
  StaggerKey,
  EasingKey,
  AnimationPresetKey,
  SpringConfig,
  AnimationPreset,
} from "./animationTimings";

// Z-Index Scale (Task 1.1.4)
export { zIndex } from "./zIndex";
export type { ZIndexLevel } from "./zIndex";
