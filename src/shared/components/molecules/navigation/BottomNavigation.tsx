/**
 * BottomNavigation Component
 * @description Bottom tab navigation bar for main app navigation
 * @task Task 2.3.2: BottomNavigation Component (Sprint 2.3 - Molecules Navigation)
 *
 * Features:
 * - 2-5 tab support
 * - Active/inactive states with icons
 * - Badge support for notifications
 * - Optional labels
 * - Disabled state per tab
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import type {
  BottomNavigationProps,
  NavTab,
} from "./BottomNavigation.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Background
  background: "#1E293B",

  // Text
  labelActive: "#818CF8",
  labelInactive: "#64748B",
  labelDisabled: "#334155",

  // Badge
  badge: "#EF4444",
  badgeText: "#FFFFFF",

  // Border
  border: "#334155",

  // Pressed
  pressed: "rgba(129, 140, 248, 0.1)",
};

/**
 * Format badge count (99+ for large numbers)
 */
function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return count.toString();
}

/**
 * BottomNavigation Component
 *
 * @example
 * ```tsx
 * // Basic navigation
 * <BottomNavigation
 *   tabs={[
 *     { key: 'home', label: 'Home', icon: <HomeIcon /> },
 *     { key: 'chat', label: 'Chat', icon: <ChatIcon />, badge: 3 },
 *     { key: 'profile', label: 'Profile', icon: <ProfileIcon /> },
 *   ]}
 *   activeTab="home"
 *   onTabPress={(key) => navigation.navigate(key)}
 * />
 *
 * // Without labels
 * <BottomNavigation
 *   tabs={tabs}
 *   activeTab={currentTab}
 *   onTabPress={handleTabPress}
 *   showLabels={false}
 * />
 * ```
 */
export function BottomNavigation({
  tabs,
  activeTab,
  onTabPress,
  showLabels = true,
  showBorder = false,
  isLoading = false,
  testID,
  accessibilityLabel,
  style,
}: BottomNavigationProps): React.ReactElement {
  // Compute container styles
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      backgroundColor: colors.background,
      paddingBottom: 8,
      paddingTop: 8,
    };

    if (showBorder) {
      baseStyle.borderTopWidth = 1;
      baseStyle.borderTopColor = colors.border;
    }

    return baseStyle;
  }, [showBorder]);

  // Render single tab
  const renderTab = (tab: NavTab) => {
    const isActive = tab.key === activeTab;
    const isDisabled = tab.disabled || isLoading;
    const hasBadge = tab.badge !== undefined && tab.badge > 0;

    // Determine which icon to show
    const iconToShow = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;

    const handlePress = () => {
      if (!isDisabled) {
        onTabPress(tab.key);
      }
    };

    return (
      <Pressable
        key={tab.key}
        testID={testID ? `${testID}-tab-${tab.key}` : `nav-tab-${tab.key}`}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="tab"
        accessibilityLabel={tab.accessibilityLabel || tab.label}
        accessibilityState={{
          selected: isActive,
          disabled: isDisabled,
        }}
        style={({ pressed }) => [
          styles.tab,
          pressed && !isDisabled && styles.tabPressed,
        ]}
      >
        {/* Icon Container with Badge */}
        <View style={styles.iconContainer}>
          {iconToShow}
          {hasBadge && (
            <View
              testID={testID ? `${testID}-tab-${tab.key}-badge` : `nav-tab-${tab.key}-badge`}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>
                {formatBadgeCount(tab.badge!)}
              </Text>
            </View>
          )}
        </View>

        {/* Label */}
        {showLabels && (
          <Text
            style={[
              styles.label,
              isActive && styles.labelActive,
              isDisabled && styles.labelDisabled,
            ]}
            numberOfLines={1}
          >
            {tab.label}
          </Text>
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
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 4,
  },
  tabPressed: {
    backgroundColor: colors.pressed,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
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
  label: {
    fontSize: 10,
    color: colors.labelInactive,
    marginTop: 4,
    textAlign: "center",
  },
  labelActive: {
    color: colors.labelActive,
    fontWeight: "600",
  },
  labelDisabled: {
    color: colors.labelDisabled,
  },
});

export default BottomNavigation;
