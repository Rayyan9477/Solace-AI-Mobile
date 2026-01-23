/**
 * Divider Component
 * @description Visual separator for content sections
 * @task Task 2.2.6: Divider Component
 *
 * Features:
 * - Horizontal and vertical orientation
 * - Three variants (full, inset, middle)
 * - Optional center label
 * - Full accessibility support
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { DividerProps, DividerOrientation, DividerVariant } from "./Divider.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  line: "#334155",
  label: "#94A3B8",
};

/**
 * Get margin based on variant
 */
function getVariantMargin(variant: DividerVariant): { marginLeft: number; marginRight: number } {
  switch (variant) {
    case "inset":
      return { marginLeft: 16, marginRight: 0 };
    case "middle":
      return { marginLeft: 16, marginRight: 16 };
    case "full":
    default:
      return { marginLeft: 0, marginRight: 0 };
  }
}

/**
 * Divider Component
 *
 * @example
 * ```tsx
 * // Basic horizontal divider
 * <Divider />
 *
 * // With label
 * <Divider label="OR" />
 *
 * // Inset variant
 * <Divider variant="inset" />
 *
 * // Vertical divider
 * <Divider orientation="vertical" />
 * ```
 */
export function Divider({
  orientation = "horizontal",
  variant = "full",
  label,
  testID,
  style,
}: DividerProps): React.ReactElement {
  const margins = getVariantMargin(variant);
  const isHorizontal = orientation === "horizontal";

  // Horizontal divider with optional label
  if (isHorizontal && label) {
    return (
      <View
        testID={testID}
        accessibilityRole="none"
        accessible={false}
        style={[styles.labelContainer, style]}
      >
        <View
          testID={testID ? `${testID}-line-left` : "divider-line-left"}
          style={[styles.line, styles.labelLine]}
        />
        <Text style={styles.label}>{label}</Text>
        <View
          testID={testID ? `${testID}-line-right` : "divider-line-right"}
          style={[styles.line, styles.labelLine]}
        />
      </View>
    );
  }

  // Vertical divider
  if (!isHorizontal) {
    return (
      <View
        testID={testID}
        accessibilityRole="none"
        accessible={false}
        style={[styles.vertical, style]}
      />
    );
  }

  // Standard horizontal divider
  return (
    <View
      testID={testID}
      accessibilityRole="none"
      accessible={false}
      style={[
        styles.horizontal,
        {
          marginLeft: margins.marginLeft,
          marginRight: margins.marginRight,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: colors.line,
  },
  vertical: {
    width: 1,
    height: "100%",
    backgroundColor: colors.line,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelLine: {
    flex: 1,
  },
  line: {
    height: 1,
    backgroundColor: colors.line,
  },
  label: {
    fontSize: 12,
    color: colors.label,
    paddingHorizontal: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default Divider;
