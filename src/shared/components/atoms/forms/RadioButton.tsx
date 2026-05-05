/**
 * RadioButton Component
 * @description Accessible radio button for single selection
 * @task Task 2.1.6: RadioButton Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Selected/unselected states
 * - Optional label
 * - Disabled state
 * - 44pt minimum touch target
 * - Full accessibility support
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { RadioButtonProps } from "./RadioButton.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  selected: palette.indigo[400],
  unselected: palette.midnight[600],
  inner: palette.warm[50],
  label: palette.warm[200],
  labelDisabled: palette.warm[500],
  disabled: palette.midnight[700],
};

/**
 * RadioButton Component
 *
 * @example
 * ```tsx
 * // In a RadioGroup context
 * <RadioButton
 *   selected={selectedValue === 'option1'}
 *   onSelect={() => setSelectedValue('option1')}
 *   value="option1"
 *   label="Option 1"
 * />
 * <RadioButton
 *   selected={selectedValue === 'option2'}
 *   onSelect={() => setSelectedValue('option2')}
 *   value="option2"
 *   label="Option 2"
 * />
 * ```
 */
export function RadioButton({
  selected,
  onSelect,
  disabled = false,
  label,
  value,
  testID,
  accessibilityLabel,
  style,
}: RadioButtonProps): React.ReactElement {
  const handlePress = () => {
    if (!disabled) {
      onSelect();
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
          disabled && styles.radioDisabled,
        ]}
      >
        {selected && (
          <View
            style={[
              styles.innerCircle,
              disabled && styles.innerCircleDisabled,
            ]}
          />
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
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
  },
  innerCircle: {
    backgroundColor: colors.selected,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  innerCircleDisabled: {
    backgroundColor: colors.disabled,
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
  radio: {
    alignItems: "center",
    borderColor: colors.unselected,
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  radioDisabled: {
    borderColor: colors.disabled,
  },
  radioSelected: {
    borderColor: colors.selected,
  },
});

export default RadioButton;
