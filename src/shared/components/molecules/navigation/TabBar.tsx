/**
 * TabBar Component
 * @description Segmented control / tab bar for switching between views
 * @task Task 2.3.3: TabBar Component (Sprint 2.3 - Molecules Navigation)
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Multiple visual variants (pill, underline, filled)
 * - Three sizes (sm, md, lg)
 * - Badge support
 * - Disabled state per tab
 * - Equal width option
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type {
  TabBarProps,
  Tab,
  TabBarVariant,
  TabBarSize,
} from "./TabBar.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Container
  containerPill: palette.gray[700],
  containerFilled: palette.gray[900],
  containerUnderline: "transparent",

  // Active tab
  activePill: palette.white,
  activeFilled: palette.indigo[400],
  activeUnderline: palette.indigo[400],

  // Text
  textActive: palette.gray[900],
  textActiveFilled: palette.white,
  textActiveUnderline: palette.indigo[400],
  textInactive: palette.gray[400],
  textDisabled: palette.gray[600],

  // Badge
  badge: palette.red[500],
  badgeText: palette.white,

  // Underline
  underlineBorder: palette.gray[700],
  underlineActive: palette.indigo[400],
};

/**
 * Size configurations
 */
const sizeConfig: Record<
  TabBarSize,
  { height: number; paddingHorizontal: number; fontSize: number; borderRadius: number }
> = {
  sm: { height: 32, paddingHorizontal: 12, fontSize: 12, borderRadius: 16 },
  md: { height: 40, paddingHorizontal: 16, fontSize: 14, borderRadius: 20 },
  lg: { height: 48, paddingHorizontal: 20, fontSize: 16, borderRadius: 24 },
};

/**
 * Format badge count (99+ for large numbers)
 */
function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return count.toString();
}

/**
 * TabBar Component
 *
 * @example
 * ```tsx
 * // Basic pill tabs
 * <TabBar
 *   tabs={[
 *     { key: 'recent', label: 'Recent' },
 *     { key: 'trash', label: 'Trash' },
 *   ]}
 *   activeTab="recent"
 *   onTabChange={(key) => setActiveTab(key)}
 * />
 *
 * // Underline variant with badges
 * <TabBar
 *   tabs={[
 *     { key: 'all', label: 'All', badge: 12 },
 *     { key: 'unread', label: 'Unread', badge: 3 },
 *   ]}
 *   activeTab="all"
 *   onTabChange={handleTabChange}
 *   variant="underline"
 * />
 * ```
 */
export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  variant = "pill",
  size = "md",
  equalWidth = false,
  fullWidth = false,
  testID,
  accessibilityLabel,
  style,
}: TabBarProps): React.ReactElement {
  const config = sizeConfig[size];

  // Compute container styles based on variant
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
    };

    if (fullWidth) {
      baseStyle.width = "100%";
    } else {
      baseStyle.alignSelf = "flex-start";
    }

    switch (variant) {
      case "pill":
        baseStyle.backgroundColor = colors.containerPill;
        baseStyle.borderRadius = config.borderRadius;
        baseStyle.padding = 4;
        break;
      case "filled":
        baseStyle.backgroundColor = colors.containerFilled;
        baseStyle.borderRadius = config.borderRadius;
        baseStyle.padding = 4;
        break;
      case "underline":
        baseStyle.backgroundColor = colors.containerUnderline;
        baseStyle.borderBottomWidth = 1;
        baseStyle.borderBottomColor = colors.underlineBorder;
        break;
    }

    return baseStyle;
  }, [variant, config.borderRadius, fullWidth]);

  // Get tab style based on variant and active state
  const getTabStyle = (isActive: boolean, isDisabled: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: variant === "underline" ? config.height : config.height - 8,
      paddingHorizontal: config.paddingHorizontal,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    if (equalWidth) {
      baseStyle.flex = 1;
    }

    switch (variant) {
      case "pill":
        if (isActive) {
          baseStyle.backgroundColor = colors.activePill;
          baseStyle.borderRadius = config.borderRadius - 4;
        } else {
          baseStyle.backgroundColor = "transparent";
          baseStyle.borderRadius = config.borderRadius - 4;
        }
        break;
      case "filled":
        if (isActive) {
          baseStyle.backgroundColor = colors.activeFilled;
          baseStyle.borderRadius = config.borderRadius - 4;
        } else {
          baseStyle.backgroundColor = "transparent";
          baseStyle.borderRadius = config.borderRadius - 4;
        }
        break;
      case "underline":
        if (isActive) {
          baseStyle.borderBottomWidth = 2;
          baseStyle.borderBottomColor = colors.underlineActive;
          baseStyle.marginBottom = -1;
        }
        break;
    }

    if (isDisabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  // Get text style based on variant and active state
  const getTextStyle = (isActive: boolean, isDisabled: boolean): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: config.fontSize,
      fontWeight: isActive ? "600" : "500",
    };

    if (isDisabled) {
      baseStyle.color = colors.textDisabled;
      return baseStyle;
    }

    switch (variant) {
      case "pill":
        baseStyle.color = isActive ? colors.textActive : colors.textInactive;
        break;
      case "filled":
        baseStyle.color = isActive ? colors.textActiveFilled : colors.textInactive;
        break;
      case "underline":
        baseStyle.color = isActive ? colors.textActiveUnderline : colors.textInactive;
        break;
    }

    return baseStyle;
  };

  // Render single tab
  const renderTab = (tab: Tab) => {
    const isActive = tab.key === activeTab;
    const isDisabled = tab.disabled || false;
    const hasBadge = tab.badge !== undefined && tab.badge > 0;

    const handlePress = () => {
      if (!isDisabled) {
        onTabChange(tab.key);
      }
    };

    return (
      <Pressable
        key={tab.key}
        testID={testID ? `${testID}-tab-${tab.key}` : `tabbar-tab-${tab.key}`}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="tab"
        accessibilityLabel={tab.accessibilityLabel || tab.label}
        accessibilityState={{
          selected: isActive,
          disabled: isDisabled,
        }}
        style={getTabStyle(isActive, isDisabled)}
      >
        <Text style={getTextStyle(isActive, isDisabled)} numberOfLines={1}>
          {tab.label}
        </Text>

        {hasBadge && (
          <View
            testID={testID ? `${testID}-tab-${tab.key}-badge` : `tabbar-tab-${tab.key}-badge`}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>
              {formatBadgeCount(tab.badge!)}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View
      testID={testID}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[containerStyle, style]}
    >
      {tabs.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginLeft: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.badge,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.badgeText,
  },
});

export default TabBar;
