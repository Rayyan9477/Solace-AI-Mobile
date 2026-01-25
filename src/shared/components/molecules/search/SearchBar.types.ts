/**
 * SearchBar Component Types
 * @description Type definitions for the SearchBar molecule component
 * @task Task 2.3.4: SearchBar Component (Sprint 2.3 - Molecules Navigation)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * SearchBar variant type
 */
export type SearchBarVariant = "default" | "filled" | "outlined";

/**
 * SearchBar size type
 */
export type SearchBarSize = "sm" | "md" | "lg";

/**
 * SearchBar component props
 */
export interface SearchBarProps {
  /** Current search value */
  value: string;

  /** Callback when search value changes */
  onChangeText: (text: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Visual variant */
  variant?: SearchBarVariant;

  /** Size of the search bar */
  size?: SearchBarSize;

  /** Callback when search is submitted */
  onSubmit?: (text: string) => void;

  /** Callback when search bar is focused */
  onFocus?: () => void;

  /** Callback when search bar loses focus */
  onBlur?: () => void;

  /** Callback when clear button is pressed */
  onClear?: () => void;

  /** Whether to show the clear button when there's text */
  showClearButton?: boolean;

  /** Custom left icon (replaces default search icon) */
  leftIcon?: ReactNode;

  /** Right action element (filter button, etc.) */
  rightElement?: ReactNode;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Whether to auto-focus on mount */
  autoFocus?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for the search input */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;
}
