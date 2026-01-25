/**
 * BottomNavigation Component Types
 * @description Type definitions for the BottomNavigation molecule component
 * @task Task 2.3.2: BottomNavigation Component (Sprint 2.3 - Molecules Navigation)
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

/**
 * Navigation tab item
 */
export interface NavTab {
  /** Unique key for the tab */
  key: string;
  /** Label text displayed below the icon */
  label: string;
  /** Icon element (inactive state) */
  icon: ReactNode;
  /** Active state icon (optional, uses icon if not provided) */
  activeIcon?: ReactNode;
  /** Badge count for notifications */
  badge?: number;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * BottomNavigation component props
 */
export interface BottomNavigationProps {
  /** Array of navigation tabs (2-5 tabs) */
  tabs: NavTab[];

  /** Currently active tab key */
  activeTab: string;

  /** Callback when a tab is pressed */
  onTabPress: (tabKey: string) => void;

  /** Whether to show labels below icons */
  showLabels?: boolean;

  /** Whether to show a top border */
  showBorder?: boolean;

  /** Whether the component is in a loading state */
  isLoading?: boolean;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label for the navigation container */
  accessibilityLabel?: string;

  /** Additional container styles */
  style?: ViewStyle;
}
