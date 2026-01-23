/**
 * Checkbox Component
 * @description Accessible checkbox component with indeterminate state
 * @task Task 2.1.5: Checkbox Component
 *
 * Features:
 * - Checked/unchecked/indeterminate states
 * - Optional label
 * - Disabled state
 * - 44pt minimum touch target
 * - Full accessibility support
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { CheckboxProps } from "./Checkbox.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  checked: "#818CF8", // Primary/indigo
  unchecked: "#475569", // Gray border
  checkmark: "#FFFFFF",
  label: "#E2E8F0",
  labelDisabled: "#64748B",
  disabled: "#334155",
};

/**
 * Checkbox Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Checkbox
 *   checked={agreed}
 *   onChange={setAgreed}
 *   label="I agree to the terms"
 * />
 *
 * // Indeterminate (partial selection)
 * <Checkbox
 *   checked={false}
 *   onChange={handleChange}
 *   indeterminate
 *   label="Select all"
 * />
 * ```
 */
export function Checkbox({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  label,
  testID,
  accessibilityLabel,
  style,
}: CheckboxProps): React.ReactElement {
  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  // Determine accessibility checked state
  const accessibilityChecked = indeterminate ? "mixed" : checked;

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{
        checked: accessibilityChecked,
        disabled,
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          indeterminate && styles.checkboxIndeterminate,
          disabled && styles.checkboxDisabled,
        ]}
      >
        {checked && !indeterminate && (
          <View style={styles.checkmark} />
        )}
        {indeterminate && (
          <View style={styles.indeterminateMark} />
        )}
      </View>
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.unchecked,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.checked,
    borderColor: colors.checked,
  },
  checkboxIndeterminate: {
    backgroundColor: colors.checked,
    borderColor: colors.checked,
  },
  checkboxDisabled: {
    borderColor: colors.disabled,
    backgroundColor: colors.disabled,
  },
  checkmark: {
    width: 6,
    height: 10,
    borderColor: colors.checkmark,
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    transform: [{ rotate: "45deg" }],
    marginBottom: 2,
  },
  indeterminateMark: {
    width: 10,
    height: 2,
    backgroundColor: colors.checkmark,
  },
  label: {
    fontSize: 16,
    color: colors.label,
    marginLeft: 12,
    flex: 1,
  },
  labelDisabled: {
    color: colors.labelDisabled,
  },
});

export default Checkbox;
