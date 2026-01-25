/**
 * ListItem Component Types
 * @description Type definitions for the ListItem molecule component
 * @task Task 2.4.2: ListItem Component (Sprint 2.4 - Molecules Content)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * ListItem variant type
 * Defines the visual appearance of the list item
 */
export type ListItemVariant = "default" | "compact" | "expanded";

/**
 * ListItem component props
 */
export interface ListItemProps {
  /** Primary text/title */
  title: string;

  /** Secondary/subtitle text */
  subtitle?: string;

  /** Description text (third line) */
  description?: string;

  /** ListItem visual variant */
  variant?: ListItemVariant;

  /** Leading element (icon, avatar, checkbox) */
  leading?: ReactNode;

  /** Trailing element (icon, text, switch, chevron) */
  trailing?: ReactNode;

  /** Whether to show a divider below */
  showDivider?: boolean;

  /** Whether the item is pressable */
  pressable?: boolean;

  /** Press handler */
  onPress?: () => void;

  /** Long press handler */
  onLongPress?: () => void;

  /** Whether the item is selected */
  selected?: boolean;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;
}
