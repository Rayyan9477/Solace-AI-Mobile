/**
 * ProgressBar Component Types
 * @description Type definitions for the ProgressBar component
 * @task Task 2.2.5: ProgressBar Component
 */

import type { ViewStyle } from "react-native";

/**
 * ProgressBar variant type
 */
export type ProgressBarVariant = "default" | "success" | "warning" | "error";

/**
 * ProgressBar size type
 */
export type ProgressBarSize = "sm" | "md" | "lg";

/**
 * ProgressBar component props
 */
export interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;

  /** Visual variant/color */
  variant?: ProgressBarVariant;

  /** Bar height/size */
  size?: ProgressBarSize;

  /** Show percentage label */
  showLabel?: boolean;

  /** Indeterminate mode (animated loading) */
  indeterminate?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional styles */
  style?: ViewStyle;
}
