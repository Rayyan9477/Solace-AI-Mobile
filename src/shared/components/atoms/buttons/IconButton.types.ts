/**
 * IconButton Component Types
 * @description Type definitions for the IconButton component
 * @task Task 2.1.2: IconButton Component
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * IconButton variant type
 */
export type IconButtonVariant = "filled" | "tinted" | "outlined" | "ghost";

/**
 * IconButton size type
 * sm: 32px, md: 44px, lg: 56px
 */
export type IconButtonSize = "sm" | "md" | "lg";

/**
 * IconButton component props
 */
export interface IconButtonProps {
  /** Icon element to render */
  icon: ReactNode;

  /** Press handler */
  onPress: () => void;

  /** Button size */
  size?: IconButtonSize;

  /** Visual variant style */
  variant?: IconButtonVariant;

  /** Whether button is circular */
  circular?: boolean;

  /** Disables button interaction */
  disabled?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel: string;

  /** Additional styles */
  style?: ViewStyle;
}
