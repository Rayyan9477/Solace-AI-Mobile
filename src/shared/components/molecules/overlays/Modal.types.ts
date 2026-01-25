/**
 * Modal Component Types
 * @description Type definitions for the Modal molecule component
 * @task Task 2.5.1: Modal Component (Sprint 2.5 - Molecules Overlay)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * Modal size variant
 * Controls the width of the modal content
 */
export type ModalSize = "sm" | "md" | "lg";

/**
 * Modal action button configuration
 */
export interface ModalAction {
  /** Button label */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Button variant - primary or secondary */
  variant?: "primary" | "secondary";
  /** Whether the action is disabled */
  disabled?: boolean;
}

/**
 * Modal component props
 */
export interface ModalProps {
  /** Whether the modal is visible */
  visible: boolean;

  /** Called when modal should be dismissed */
  onDismiss: () => void;

  /** Modal title */
  title?: string;

  /** Modal content */
  children?: ReactNode;

  /** Action buttons to display at bottom */
  actions?: ModalAction[];

  /** Whether to show close button in header */
  showCloseButton?: boolean;

  /** Size variant controlling modal width */
  size?: ModalSize;

  /** Whether tapping backdrop dismisses modal */
  dismissOnBackdropPress?: boolean;

  /** Whether this is an alert modal requiring user action */
  isAlert?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;

  /** Additional content container styles */
  contentStyle?: ViewStyle;
}
