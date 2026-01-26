/**
 * TypingIndicator Types
 * @description Type definitions for the TypingIndicator component
 * @task Task 2.7.2: TypingIndicator Component
 */

import type { StyleProp, ViewStyle } from "react-native";

/**
 * Typing indicator variant
 */
export type TypingIndicatorVariant = "dots" | "text" | "combined";

/**
 * Typing indicator size
 */
export type TypingIndicatorSize = "sm" | "md" | "lg";

/**
 * Animation style for dots
 */
export type DotAnimationStyle = "bounce" | "fade" | "pulse";

/**
 * TypingIndicator Props
 */
export interface TypingIndicatorProps {
  /**
   * Whether the indicator is visible
   * @default true
   */
  isTyping?: boolean;

  /**
   * Display variant
   * @default "combined"
   */
  variant?: TypingIndicatorVariant;

  /**
   * Size of the indicator
   * @default "md"
   */
  size?: TypingIndicatorSize;

  /**
   * Custom text to display (e.g., "Dr. Freud is thinking...")
   */
  text?: string;

  /**
   * Name of the person typing (generates default text)
   */
  typingUserName?: string;

  /**
   * Avatar image URL
   */
  avatar?: string;

  /**
   * Whether to show avatar
   * @default true
   */
  showAvatar?: boolean;

  /**
   * Animation style for dots
   * @default "bounce"
   */
  animationStyle?: DotAnimationStyle;

  /**
   * Animation duration in milliseconds
   * @default 600
   */
  animationDuration?: number;

  /**
   * Number of dots
   * @default 3
   */
  dotCount?: number;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Size specifications
 */
export const sizeSpecs: Record<
  TypingIndicatorSize,
  { dotSize: number; fontSize: number; avatarSize: number; spacing: number }
> = {
  sm: {
    dotSize: 6,
    fontSize: 12,
    avatarSize: 28,
    spacing: 4,
  },
  md: {
    dotSize: 8,
    fontSize: 14,
    avatarSize: 36,
    spacing: 6,
  },
  lg: {
    dotSize: 10,
    fontSize: 16,
    avatarSize: 44,
    spacing: 8,
  },
};

/**
 * Generate default typing text
 */
export function getTypingText(userName?: string): string {
  if (userName) {
    return `${userName} is thinking...`;
  }
  return "Typing...";
}
