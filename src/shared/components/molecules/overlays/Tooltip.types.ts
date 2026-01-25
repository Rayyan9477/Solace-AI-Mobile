/**
 * Tooltip Component Types
 * @description Type definitions for the Tooltip molecule component
 * @task Task 2.5.4: Tooltip Component (Sprint 2.5 - Molecules Overlay)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * Tooltip arrow position relative to content
 */
export type TooltipPlacement = "top" | "bottom" | "left" | "right";

/**
 * Tooltip component props
 */
export interface TooltipProps {
  /** Whether the tooltip is visible */
  visible: boolean;

  /** Tooltip content text */
  content: string;

  /** Arrow placement relative to tooltip content */
  placement?: TooltipPlacement;

  /** Called when tooltip should be dismissed */
  onDismiss?: () => void;

  /** Child element that triggers the tooltip */
  children?: ReactNode;

  /** Maximum width of tooltip */
  maxWidth?: number;

  /** Delay before showing tooltip (ms) */
  showDelay?: number;

  /** Whether tapping outside dismisses tooltip */
  dismissOnPress?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;

  /** Additional tooltip content styles */
  contentStyle?: ViewStyle;
}
