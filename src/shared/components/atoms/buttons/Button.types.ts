/**
 * Button Component Types
 * @description Type definitions for the Button component
 * @task Task 2.1.1: Button Component
 */

import type { ReactNode } from "react";
import type { ViewStyle, TextStyle } from "react-native";

/**
 * Button variant type
 * Defines the visual style of the button
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "crisis"
  | "link";

/**
 * Button size type
 * Defines the dimensions of the button
 */
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Size specifications interface
 */
export interface SizeSpec {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
}

/**
 * Variant color configuration
 */
export interface VariantColors {
  background: string;
  text: string;
  border: string;
  /** Pressed state background */
  pressedBackground?: string;
  /** Disabled state background */
  disabledBackground?: string;
  /** Disabled state text */
  disabledText?: string;
}

/**
 * Button component props
 */
export interface ButtonProps {
  /** Button text label */
  label: string;

  /** Press handler */
  onPress: () => void;

  /** Visual variant style */
  variant?: ButtonVariant;

  /** Button size */
  size?: ButtonSize;

  /** Shows loading indicator */
  loading?: boolean;

  /** Disables button interaction */
  disabled?: boolean;

  /** Icon element before label */
  leftIcon?: ReactNode;

  /** Icon element after label */
  rightIcon?: ReactNode;

  /** Makes button 100% width */
  fullWidth?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional button container styles */
  style?: ViewStyle;

  /** Additional label text styles */
  labelStyle?: TextStyle;
}
