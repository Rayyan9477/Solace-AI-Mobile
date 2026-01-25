/**
 * Header Component
 * @description Navigation header molecule with back button, title, and actions
 * @task Task 2.3.1: Header Component (Sprint 2.3 - Molecules Navigation)
 *
 * Features:
 * - Back button with customizable action
 * - Title and subtitle support
 * - Right action buttons with badge support
 * - Multiple variants (default, transparent, gradient)
 * - Three sizes (sm, md, lg)
 * - Custom element slots
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
  HeaderProps,
  HeaderVariant,
  HeaderSize,
  HeaderAction,
} from "./Header.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Backgrounds
  default: "#1E293B",
  transparent: "transparent",
  gradient: "#1C1410",

  // Text
  title: "#F1F5F9",
  subtitle: "#94A3B8",

  // Interactive
  backButton: "#334155",
  backButtonPressed: "#475569",
  actionButton: "#334155",
  actionButtonPressed: "#475569",

  // Badge
  badge: "#EF4444",
  badgeText: "#FFFFFF",

  // Border
  border: "#334155",

  // Back arrow
  arrow: "#F1F5F9",
};

/**
 * Size configurations
 */
const sizeConfig: Record<
  HeaderSize,
  { height: number; paddingHorizontal: number; titleSize: number; subtitleSize: number }
> = {
  sm: { height: 48, paddingHorizontal: 12, titleSize: 16, subtitleSize: 12 },
  md: { height: 56, paddingHorizontal: 16, titleSize: 18, subtitleSize: 14 },
  lg: { height: 64, paddingHorizontal: 20, titleSize: 20, subtitleSize: 14 },
};

/**
 * Format badge count (99+ for large numbers)
 */
function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return count.toString();
}

/**
 * Header Component
 *
 * @example
 * ```tsx
 * // Basic header with back button
 * <Header
 *   title="Settings"
 *   backButton={{ show: true, onPress: () => navigation.goBack() }}
 * />
 *
 * // Header with actions and badge
 * <Header
 *   title="Dashboard"
 *   rightActions={[
 *     {
 *       key: "notifications",
 *       icon: <BellIcon />,
 *       onPress: handleNotifications,
 *       badge: 5,
 *       accessibilityLabel: "Notifications",
 *     },
 *   ]}
 * />
 *
 * // Transparent header with gradient background
 * <Header
 *   title="Profile"
 *   variant="transparent"
 *   backButton={{ show: true }}
 * />
 * ```
 */
export function Header({
  title,
  subtitle,
  variant = "default",
  size = "md",
  backButton,
  rightActions = [],
  leftElement,
  centerElement,
  rightElement,
  showBorder = false,
  testID,
  accessibilityLabel,
  style,
  titleStyle,
}: HeaderProps): React.ReactElement {
  const config = sizeConfig[size];

  // Compute container styles
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: config.height,
      paddingHorizontal: config.paddingHorizontal,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    };

    // Background based on variant
    switch (variant) {
      case "transparent":
        baseStyle.backgroundColor = colors.transparent;
        break;
      case "gradient":
        baseStyle.backgroundColor = colors.gradient;
        break;
      default:
        baseStyle.backgroundColor = colors.default;
    }

    // Border
    if (showBorder) {
      baseStyle.borderBottomWidth = 1;
      baseStyle.borderBottomColor = colors.border;
    }

    return baseStyle;
  }, [config, variant, showBorder]);

  // Render back button
  const renderBackButton = () => {
    if (leftElement) return leftElement;
    if (!backButton?.show) return <View style={styles.placeholder} />;

    return (
      <Pressable
        testID={testID ? `${testID}-back-button` : "header-back-button"}
        onPress={backButton.onPress}
        accessibilityRole="button"
        accessibilityLabel={backButton.accessibilityLabel || "Go back"}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
      >
        <Text style={styles.backArrow}>{"<"}</Text>
      </Pressable>
    );
  };

  // Render center content (title/subtitle or custom)
  const renderCenterContent = () => {
    if (centerElement) return centerElement;

    return (
      <View style={styles.centerContent}>
        {title && (
          <Text
            style={[
              styles.title,
              { fontSize: config.titleSize },
              titleStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            style={[styles.subtitle, { fontSize: config.subtitleSize }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  // Render single action button
  const renderAction = (action: HeaderAction) => {
    const hasBadge = action.badge !== undefined && action.badge > 0;

    return (
      <Pressable
        key={action.key}
        testID={testID ? `${testID}-action-${action.key}` : `header-action-${action.key}`}
        onPress={action.disabled ? undefined : action.onPress}
        disabled={action.disabled}
        accessibilityRole="button"
        accessibilityLabel={action.accessibilityLabel}
        accessibilityState={{ disabled: action.disabled }}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        style={({ pressed }) => [
          styles.actionButton,
          pressed && !action.disabled && styles.actionButtonPressed,
          action.disabled && styles.actionButtonDisabled,
        ]}
      >
        {action.icon}
        {hasBadge && (
          <View
            testID={testID ? `${testID}-action-${action.key}-badge` : `header-action-${action.key}-badge`}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>
              {formatBadgeCount(action.badge!)}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  // Render right actions
  const renderRightActions = () => {
    if (rightElement) return rightElement;
    if (rightActions.length === 0) return <View style={styles.placeholder} />;

    return (
      <View style={styles.actionsContainer}>
        {rightActions.slice(0, 3).map(renderAction)}
      </View>
    );
  };

  return (
    <View
      testID={testID}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel}
      style={[containerStyle, style]}
    >
      {/* Left Section */}
      <View style={styles.leftSection}>{renderBackButton()}</View>

      {/* Center Section */}
      <View style={styles.centerSection}>{renderCenterContent()}</View>

      {/* Right Section */}
      <View style={styles.rightSection}>{renderRightActions()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  leftSection: {
    minWidth: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    minWidth: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backButton,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPressed: {
    backgroundColor: colors.backButtonPressed,
  },
  backArrow: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.arrow,
  },
  centerContent: {
    alignItems: "center",
  },
  title: {
    fontWeight: "600",
    color: colors.title,
    textAlign: "center",
  },
  subtitle: {
    color: colors.subtitle,
    marginTop: 2,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.actionButton,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  actionButtonPressed: {
    backgroundColor: colors.actionButtonPressed,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
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

export default Header;
