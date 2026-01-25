/**
 * Card Component Types
 * @description Type definitions for the Card molecule component
 * @task Task 2.4.1: Card Component (Sprint 2.4 - Molecules Content)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * Card variant type
 * Defines the visual appearance of the card
 */
export type CardVariant = "elevated" | "filled" | "outlined";

/**
 * Card size type
 * Defines the padding of the card
 */
export type CardSize = "sm" | "md" | "lg";

/**
 * Card component props
 */
export interface CardProps {
  /** Card visual variant */
  variant?: CardVariant;

  /** Card size (padding) */
  size?: CardSize;

  /** Whether the card is pressable */
  pressable?: boolean;

  /** Press handler (only when pressable=true) */
  onPress?: () => void;

  /** Long press handler */
  onLongPress?: () => void;

  /** Whether the card is selected/active */
  selected?: boolean;

  /** Whether the card is disabled */
  disabled?: boolean;

  /** Card content */
  children: ReactNode;

  /** Card header content (optional) */
  header?: ReactNode;

  /** Card footer content (optional) */
  footer?: ReactNode;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for the card */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;

  /** Content container styles */
  contentStyle?: ViewStyle;
}
