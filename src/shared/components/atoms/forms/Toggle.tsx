/**
 * Toggle Component
 * @description Accessible toggle switch component
 * @task Task 2.1.4: Toggle Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Boolean on/off state
 * - Optional label
 * - Disabled state
 * - Full accessibility support
 */

import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import type { ToggleProps } from "./Toggle.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  trackOn: palette.indigo[400],
  trackOff: palette.gray[600],
  thumbOn: palette.white,
  thumbOff: palette.gray[400],
  label: palette.gray[200],
  labelDisabled: palette.gray[500],
};

/**
 * Toggle Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Toggle
 *   value={darkMode}
 *   onValueChange={setDarkMode}
 *   label="Dark Mode"
 * />
 *
 * // Disabled
 * <Toggle
 *   value={false}
 *   onValueChange={() => {}}
 *   disabled
 *   label="Feature disabled"
 * />
 * ```
 */
export function Toggle({
  value,
  onValueChange,
  disabled = false,
  label,
  testID,
  accessibilityLabel,
  style,
}: ToggleProps): React.ReactElement {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
      <Switch
        testID={testID}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.trackOff,
          true: colors.trackOn,
        }}
        thumbColor={value ? colors.thumbOn : colors.thumbOff}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="switch"
        accessibilityState={{
          checked: value,
          disabled,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: colors.label,
    marginRight: 12,
    flex: 1,
  },
  labelDisabled: {
    color: colors.labelDisabled,
  },
});

export default Toggle;
