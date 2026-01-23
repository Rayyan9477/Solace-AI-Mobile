/**
 * RadioButton Component Types
 * @description Type definitions for the RadioButton component
 * @task Task 2.1.6: RadioButton Component
 */

import type { ViewStyle } from "react-native";

/**
 * RadioButton component props
 */
export interface RadioButtonProps {
  /** Whether this option is selected */
  selected: boolean;

  /** Selection handler */
  onSelect: () => void;

  /** Disabled state */
  disabled?: boolean;

  /** Label displayed next to radio button */
  label?: string;

  /** Value for form submission */
  value: string;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional styles */
  style?: ViewStyle;
}
