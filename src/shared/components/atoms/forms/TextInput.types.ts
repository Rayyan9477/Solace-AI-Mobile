/**
 * TextInput Component Types
 * @description Type definitions for the TextInput component
 * @task Task 2.1.3: TextInput Component
 */

import type { ReactNode } from "react";
import type {
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";

/**
 * Input state type
 */
export type InputState = "default" | "focused" | "error" | "disabled";

/**
 * TextInput component props
 */
export interface TextInputProps
  extends Omit<RNTextInputProps, "style" | "editable"> {
  /** Current input value */
  value: string;

  /** Change handler */
  onChangeText: (text: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Label displayed above input */
  label?: string;

  /** Error message (enables error state) */
  error?: string;

  /** Helper text displayed below input */
  helperText?: string;

  /** Secure text entry for passwords */
  secureTextEntry?: boolean;

  /** Multiline input */
  multiline?: boolean;

  /** Icon on the left side */
  leftIcon?: ReactNode;

  /** Icon on the right side */
  rightIcon?: ReactNode;

  /** Input mode for keyboard type */
  inputMode?: RNTextInputProps["inputMode"];

  /** Disabled state */
  disabled?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for screen readers */
  accessibilityLabel?: string;

  /** Container style */
  containerStyle?: ViewStyle;

  /** Input style override */
  inputStyle?: TextStyle;
}
