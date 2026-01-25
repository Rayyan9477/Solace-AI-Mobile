/**
 * EmptyState Component Types
 * @description Type definitions for the EmptyState molecule component
 * @task Task 2.4.4: EmptyState Component (Sprint 2.4 - Molecules Content)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * EmptyState variant type
 * Defines the visual appearance and purpose of the empty state
 */
export type EmptyStateVariant = "default" | "compact" | "card";

/**
 * EmptyState component props
 */
export interface EmptyStateProps {
  /** Icon element to display */
  icon?: ReactNode;

  /** Title text */
  title: string;

  /** Description/subtitle text */
  description?: string;

  /** Primary action button */
  action?: {
    /** Action button label */
    label: string;
    /** Action button press handler */
    onPress: () => void;
  };

  /** Secondary action button */
  secondaryAction?: {
    /** Secondary action button label */
    label: string;
    /** Secondary action button press handler */
    onPress: () => void;
  };

  /** EmptyState visual variant */
  variant?: EmptyStateVariant;

  /** Illustration/image element (instead of icon) */
  illustration?: ReactNode;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;
}
