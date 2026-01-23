/**
 * Checkbox Component Types
 * @description Type definitions for the Checkbox component
 * @task Task 2.1.5: Checkbox Component
 */

import type { ViewStyle } from "react-native";

/**
 * Checkbox component props
 */
export interface CheckboxProps {
  /** Checked state */
  checked: boolean;

  /** Change handler */
  onChange: (checked: boolean) => void;

  /** Indeterminate state (partial selection) */
  indeterminate?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Label displayed next to checkbox */
  label?: string;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional styles */
  style?: ViewStyle;
}
