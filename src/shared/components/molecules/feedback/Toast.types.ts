/**
 * Toast Component Types
 * @description Type definitions for the Toast molecule component
 * @task Task 2.5.3: Toast Component (Sprint 2.5 - Molecules Overlay)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * Toast variant determines color scheme and icon
 */
export type ToastVariant = "info" | "success" | "warning" | "error";

/**
 * Toast position on screen
 */
export type ToastPosition = "top" | "bottom";

/**
 * Toast action configuration
 */
export interface ToastAction {
  /** Button label */
  label: string;
  /** Press handler */
  onPress: () => void;
}

/**
 * Toast component props
 */
export interface ToastProps {
  /** Whether the toast is visible */
  visible: boolean;

  /** Toast message */
  message: string;

  /** Toast variant for styling */
  variant?: ToastVariant;

  /** Position on screen */
  position?: ToastPosition;

  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;

  /** Called when toast is dismissed */
  onDismiss?: () => void;

  /** Optional action button */
  action?: ToastAction;

  /** Custom icon element */
  icon?: ReactNode;

  /** Whether to show close button */
  showCloseButton?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;
}
