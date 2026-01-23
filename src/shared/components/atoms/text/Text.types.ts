/**
 * Text Component Types
 * @description Type definitions for the Enhanced Text component
 * @task Task 1.2.1: Create Enhanced Text Component
 */

import type { TextProps as RNTextProps, TextStyle } from "react-native";

/**
 * Text variant type
 * Defines typography hierarchy levels
 */
export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "caption"
  | "overline"
  | "button"
  | "link";

/**
 * Text color type
 * Semantic color tokens for text
 */
export type TextColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "onPrimary"
  | "onSurface"
  | "onBackground";

/**
 * Text weight type
 * Font weight options
 */
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

/**
 * Text alignment type
 */
export type TextAlign = "left" | "center" | "right";

/**
 * Variant style configuration
 */
export interface VariantStyle {
  fontSize: number;
  fontWeight: TextStyle["fontWeight"];
  lineHeight: number;
}

/**
 * Text component props
 */
export interface TextProps extends Omit<RNTextProps, "style"> {
  /** Typography variant - determines size, weight, and line height */
  variant?: TextVariant;

  /** Semantic color token */
  color?: TextColor;

  /** Font weight override (overrides variant weight) */
  weight?: TextWeight;

  /** Text alignment */
  align?: TextAlign;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional styles (merged with variant styles) */
  style?: TextStyle;

  /** Child content */
  children: React.ReactNode;
}
