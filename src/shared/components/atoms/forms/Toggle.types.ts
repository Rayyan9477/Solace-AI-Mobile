/**
 * Toggle Component Types
 * @description Type definitions for the Toggle component
 * @task Task 2.1.4: Toggle Component
 */

import type { ViewStyle } from "react-native";

/**
 * Toggle component props
 */
export interface ToggleProps {
  /** Current value */
  value: boolean;

  /** Value change handler */
  onValueChange: (value: boolean) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Label displayed next to toggle */
  label?: string;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Additional styles */
  style?: ViewStyle;
}
