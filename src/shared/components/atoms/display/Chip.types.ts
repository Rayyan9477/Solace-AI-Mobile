/**
 * Chip Component Types
 * @description Type definitions for the Chip component
 * @task Task 2.2.4: Chip Component
 */

import type { ViewStyle } from "react-native";
import type { ReactNode } from "react";

/**
 * Chip variant type
 */
export type ChipVariant = "filled" | "outlined";

/**
 * Chip size type
 */
export type ChipSize = "sm" | "md" | "lg";

/**
 * Chip component props
 */
export interface ChipProps {
  /** Chip label text */
  label: string;

  /** Visual variant */
  variant?: ChipVariant;

  /** Chip size */
  size?: ChipSize;

  /** Selected state */
  selected?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Press handler for selection */
  onPress?: () => void;

  /** Dismiss handler (shows close icon) */
  onDismiss?: () => void;

  /** Left icon element */
  leftIcon?: ReactNode;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional styles */
  style?: ViewStyle;
}
