/**
 * FormField Component Types
 * @description Type definitions for the FormField molecule component
 * @task Task 2.4.3: FormField Component (Sprint 2.4 - Molecules Content)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * FormField status type
 * Defines the validation state of the form field
 */
export type FormFieldStatus = "default" | "error" | "success" | "warning";

/**
 * FormField component props
 */
export interface FormFieldProps {
  /** Field label text */
  label?: string;

  /** Whether the field is required */
  required?: boolean;

  /** Helper text below the input */
  helperText?: string;

  /** Error message (shown when status is error) */
  error?: string;

  /** Field validation status */
  status?: FormFieldStatus;

  /** The input element to wrap */
  children: ReactNode;

  /** Optional left icon for the label */
  labelIcon?: ReactNode;

  /** Optional character/word counter text */
  counter?: string;

  /** Whether the field is disabled */
  disabled?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;
}
