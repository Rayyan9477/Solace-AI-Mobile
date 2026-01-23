/**
 * Skeleton Component Types
 * @description Type definitions for the Skeleton component
 * @task Task 2.2.7: Skeleton Component
 */

import type { ViewStyle, DimensionValue } from "react-native";

/**
 * Skeleton shape type
 */
export type SkeletonShape = "text" | "circle" | "rect";

/**
 * Skeleton component props
 */
export interface SkeletonProps {
  /** Shape of the skeleton */
  shape?: SkeletonShape;

  /** Width (number or percentage string) */
  width?: DimensionValue;

  /** Height (number or percentage string) */
  height?: DimensionValue;

  /** Border radius for rect shape */
  borderRadius?: number;

  /** Enable shimmer animation */
  animated?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Additional styles */
  style?: ViewStyle;
}
