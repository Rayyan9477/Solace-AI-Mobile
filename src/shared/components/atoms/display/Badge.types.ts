/**
 * Badge Component Types
 * @description Type definitions for the Badge component
 * @task Task 2.2.2: Badge Component
 */

import type { ViewStyle } from "react-native";

/**
 * Badge variant type
 */
export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

/**
 * Badge size type
 */
export type BadgeSize = "sm" | "md" | "lg";

/**
 * Badge component props
 */
export interface BadgeProps {
  /** Badge label text */
  label?: string;

  /** Visual variant */
  variant?: BadgeVariant;

  /** Badge size */
  size?: BadgeSize;

  /** Show as dot only (no label) */
  dot?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Additional styles */
  style?: ViewStyle;
}
