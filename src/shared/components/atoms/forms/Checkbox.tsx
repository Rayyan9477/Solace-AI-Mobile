/**
 * Checkbox Component
 * @description Accessible checkbox component with indeterminate state
 * @task Task 2.1.5: Checkbox Component
 * @phase Phase 3C: Refactored to use theme tokens
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
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  checked: palette.indigo[400],
  unchecked: palette.midnight[600],
  checkmark: palette.warm[50],
  label: palette.warm[200],
  labelDisabled: palette.warm[500],
  disabled: palette.midnight[700],
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
  checkbox: {
    alignItems: "center",
    borderColor: colors.unchecked,
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: colors.checked,
    borderColor: colors.checked,
  },
  checkboxDisabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
  },
  checkboxIndeterminate: {
    backgroundColor: colors.checked,
    borderColor: colors.checked,
  },
  checkmark: {
    borderColor: colors.checkmark,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderWidth: 2,
    height: 10,
    marginBottom: 2,
    transform: [{ rotate: "45deg" }],
    width: 6,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
  },
  indeterminateMark: {
    backgroundColor: colors.checkmark,
    height: 2,
    width: 10,
  },
  label: {
    color: colors.label,
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  labelDisabled: {
    color: colors.labelDisabled,
  },
});

export default Checkbox;
