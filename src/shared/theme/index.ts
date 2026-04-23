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
export { animations, animationPresets } from "./animationTimings";
export type {
  DurationKey,
  StaggerKey,
  EasingKey,
  AnimationPresetKey,
  SpringConfig,
  AnimationPreset,
} from "./animationTimings";

// Easing curves separated to avoid Reanimated import side effects
// Import directly from '@/shared/theme/easingCurves' when needed
export { easingCurves, easings } from "./easingCurves";

// Z-Index Scale (Task 1.1.4)
export { zIndex } from "./zIndex";
export type { ZIndexLevel } from "./zIndex";

// Color Tokens (Task 3C.1 + cosmic migration)
export { colors, palette, colorUtils, buildColors } from "./colors";
export type { ColorPalette, SemanticColors, ColorToken } from "./colors";

// Theme Presets (cosmic v4.2 — 5 runtime-switchable palettes)
export { presets, presetList, DEFAULT_THEME_ID } from "./presets";
export type { ThemeId, ThemePreset } from "./presets";

// Spacing Tokens
export { spacing } from "./spacing";
export type { SpacingKey } from "./spacing";

// Theme Hook (Task 3C.2)
export { useTheme, ThemeProvider, theme } from "./useTheme";
export type { Theme } from "./useTheme";

// Border Radius Tokens
export { borderRadius } from "./borderRadius";
export type { BorderRadiusKey } from "./borderRadius";

// Typography Tokens
export { fontFamily, fontWeight, letterSpacing, typeScale } from "./typography";
export type { TypeScaleKey, FontWeightKey } from "./typography";
