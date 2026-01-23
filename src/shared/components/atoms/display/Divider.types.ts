/**
 * Divider Component Types
 * @description Type definitions for the Divider component
 * @task Task 2.2.6: Divider Component
 */

import type { ViewStyle } from "react-native";

/**
 * Divider orientation type
 */
export type DividerOrientation = "horizontal" | "vertical";

/**
 * Divider variant type
 */
export type DividerVariant = "full" | "inset" | "middle";

/**
 * Divider component props
 */
export interface DividerProps {
  /** Orientation of the divider */
  orientation?: DividerOrientation;

  /** Variant - controls inset spacing */
  variant?: DividerVariant;

  /** Optional label text displayed in the middle */
  label?: string;

  /** Test ID for testing */
  testID?: string;

  /** Additional styles */
  style?: ViewStyle;
}
