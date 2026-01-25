/**
 * BottomSheet Component Types
 * @description Type definitions for the BottomSheet molecule component
 * @task Task 2.5.2: BottomSheet Component (Sprint 2.5 - Molecules Overlay)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * BottomSheet snap point configuration
 * Values represent percentage of screen height
 */
export type SnapPoint = number | string;

/**
 * BottomSheet component props
 */
export interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;

  /** Called when bottom sheet should be dismissed */
  onDismiss: () => void;

  /** Sheet content */
  children?: ReactNode;

  /** Title displayed in header */
  title?: string;

  /** Whether to show drag handle indicator */
  showDragHandle?: boolean;

  /** Height of the sheet (percentage of screen or fixed pixels) */
  height?: number | string;

  /** Whether tapping backdrop dismisses sheet */
  dismissOnBackdropPress?: boolean;

  /** Whether dragging down dismisses sheet */
  dismissOnDragDown?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;

  /** Additional content container styles */
  contentStyle?: ViewStyle;

  /** Header right element (e.g., help button) */
  headerRight?: ReactNode;
}
