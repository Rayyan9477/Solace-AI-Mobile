/**
 * Slider Component Types
 * @description Type definitions for the Slider component
 * @task Task 2.2.1: Slider Component
 */

import type { ViewStyle } from "react-native";

/**
 * Slider component props
 */
export interface SliderProps {
  /** Current value */
  value: number;

  /** Value change handler */
  onValueChange: (value: number) => void;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Step increment */
  step?: number;

  /** Show min/max labels */
  showLabels?: boolean;

  /** Show current value label */
  showValue?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional styles */
  style?: ViewStyle;
}
