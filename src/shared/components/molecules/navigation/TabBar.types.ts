/**
 * TabBar Component Types
 * @description Type definitions for the TabBar (SegmentedControl) molecule component
 * @task Task 2.3.3: TabBar Component (Sprint 2.3 - Molecules Navigation)
 */

import type { ViewStyle } from "react-native";

/**
 * Tab item for the TabBar
 */
export interface Tab {
  /** Unique key for the tab */
  key: string;
  /** Label text displayed in the tab */
  label: string;
  /** Optional badge count */
  badge?: number;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * TabBar variant type
 */
export type TabBarVariant = "pill" | "underline" | "filled";

/**
 * TabBar size type
 */
export type TabBarSize = "sm" | "md" | "lg";

/**
 * TabBar component props
 */
export interface TabBarProps {
  /** Array of tabs (2-5 tabs recommended) */
  tabs: Tab[];

  /** Currently active tab key */
  activeTab: string;

  /** Callback when a tab is pressed */
  onTabChange: (tabKey: string) => void;

  /** Visual variant */
  variant?: TabBarVariant;

  /** Size of the tab bar */
  size?: TabBarSize;

  /** Whether the tabs should be equal width */
  equalWidth?: boolean;

  /** Whether the component spans full width */
  fullWidth?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for the tab bar container */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;
}
