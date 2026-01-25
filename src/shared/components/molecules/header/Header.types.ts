/**
 * Header Component Types
 * @description Type definitions for the Header molecule component
 * @task Task 2.3.1: Header Component (Sprint 2.3 - Molecules Navigation)
 */

import type { ReactNode } from "react";
import type { ViewStyle, TextStyle } from "react-native";

/**
 * Header variant type
 * Defines the visual appearance of the header
 */
export type HeaderVariant = "default" | "transparent" | "gradient";

/**
 * Header size type
 * Defines the height and padding of the header
 */
export type HeaderSize = "sm" | "md" | "lg";

/**
 * Back button action type
 */
export interface BackButtonAction {
  /** Whether to show the back button */
  show: boolean;
  /** Custom onPress handler (defaults to navigation.goBack) */
  onPress?: () => void;
  /** Accessibility label for the back button */
  accessibilityLabel?: string;
}

/**
 * Header action item for right actions
 */
export interface HeaderAction {
  /** Unique key for the action */
  key: string;
  /** Icon element to display */
  icon: ReactNode;
  /** Press handler for the action */
  onPress: () => void;
  /** Optional badge count (for notifications) */
  badge?: number;
  /** Accessibility label for the action */
  accessibilityLabel: string;
  /** Whether the action is disabled */
  disabled?: boolean;
}

/**
 * Header component props
 */
export interface HeaderProps {
  /** Header title text */
  title?: string;

  /** Optional subtitle below the title */
  subtitle?: string;

  /** Header visual variant */
  variant?: HeaderVariant;

  /** Header size (height) */
  size?: HeaderSize;

  /** Back button configuration */
  backButton?: BackButtonAction;

  /** Right side action buttons (max 3) */
  rightActions?: HeaderAction[];

  /** Custom left element (replaces back button) */
  leftElement?: ReactNode;

  /** Custom center element (replaces title) */
  centerElement?: ReactNode;

  /** Custom right element (replaces rightActions) */
  rightElement?: ReactNode;

  /** Whether to show a bottom border */
  showBorder?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for the header region */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;

  /** Title text styles */
  titleStyle?: TextStyle;
}
