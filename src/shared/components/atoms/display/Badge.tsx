/**
 * Badge Component
 * @description Small status indicator for notifications, counts, or labels
 * @task Task 2.2.2: Badge Component
 *
 * Features:
 * - Multiple variants (default, success, warning, error, info)
 * - Three sizes (sm, md, lg)
 * - Dot mode for minimal indicator
 * - Full accessibility support
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BadgeProps, BadgeVariant, BadgeSize } from "./Badge.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Variant backgrounds
  default: "#475569",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#818CF8",
  // Text colors
  textDefault: "#E2E8F0",
  textDark: "#1E293B",
};

/**
 * Get background color for variant
 */
function getVariantColor(variant: BadgeVariant): string {
  const variantColors: Record<BadgeVariant, string> = {
    default: colors.default,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
  };
  return variantColors[variant];
}

/**
 * Get text color for variant
 */
function getTextColor(variant: BadgeVariant): string {
  // Warning needs dark text for contrast
  if (variant === "warning") {
    return colors.textDark;
  }
  return colors.textDefault;
}

/**
 * Size configurations
 */
const sizeConfig: Record<BadgeSize, { height: number; paddingHorizontal: number; fontSize: number; dotSize: number }> = {
  sm: { height: 16, paddingHorizontal: 6, fontSize: 10, dotSize: 6 },
  md: { height: 20, paddingHorizontal: 8, fontSize: 12, dotSize: 8 },
  lg: { height: 24, paddingHorizontal: 10, fontSize: 14, dotSize: 10 },
};

/**
 * Badge Component
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge label="New" variant="info" />
 *
 * // Status badge
 * <Badge label="Active" variant="success" />
 *
 * // Notification count
 * <Badge label="5" variant="error" />
 *
 * // Dot indicator
 * <Badge dot variant="error" />
 * ```
 */
export function Badge({
  label,
  variant = "default",
  size = "md",
  dot = false,
  testID,
  style,
}: BadgeProps): React.ReactElement {
  const config = sizeConfig[size];
  const backgroundColor = getVariantColor(variant);
  const textColor = getTextColor(variant);

  // Dot mode - small circular indicator
  if (dot) {
    return (
      <View
        testID={testID}
        accessibilityRole="text"
        accessibilityLabel="Status indicator"
        style={[
          styles.dot,
          {
            width: config.dotSize,
            height: config.dotSize,
            borderRadius: config.dotSize / 2,
            backgroundColor,
          },
          style,
        ]}
      />
    );
  }

  // Standard badge with label
  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[
        styles.container,
        {
          height: config.height,
          paddingHorizontal: config.paddingHorizontal,
          borderRadius: config.height / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            fontSize: config.fontSize,
            color: textColor,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Badge;
