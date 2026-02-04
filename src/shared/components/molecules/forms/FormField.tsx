/**
 * FormField Component
 * @description Form field wrapper with label, helper text, and error handling
 * @task Task 2.4.3: FormField Component (Sprint 2.4 - Molecules Content)
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Label with optional required indicator
 * - Helper text below input
 * - Error message display
 * - Multiple status states (default, error, success, warning)
 * - Optional label icon
 * - Character/word counter
 * - Disabled state
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type {
  FormFieldProps,
  FormFieldStatus,
} from "./FormField.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Label
  label: palette.gray[100],
  labelDisabled: palette.gray[500],
  required: palette.red[500],

  // Helper/Error text
  helper: palette.gray[400],
  error: palette.red[500],
  success: palette.green[500],
  warning: palette.amber[500],

  // Counter
  counter: palette.gray[500],
};

/**
 * Status color mapping
 */
const statusColors: Record<FormFieldStatus, string> = {
  default: colors.helper,
  error: colors.error,
  success: colors.success,
  warning: colors.warning,
};

/**
 * FormField Component
 *
 * @example
 * ```tsx
 * // Basic form field with label
 * <FormField label="Email Address">
 *   <TextInput value={email} onChangeText={setEmail} />
 * </FormField>
 *
 * // Required field with helper text
 * <FormField
 *   label="Password"
 *   required
 *   helperText="At least 8 characters"
 * >
 *   <TextInput secureTextEntry value={password} onChangeText={setPassword} />
 * </FormField>
 *
 * // Field with error state
 * <FormField
 *   label="Email"
 *   required
 *   error="Invalid email address"
 *   status="error"
 * >
 *   <TextInput value={email} onChangeText={setEmail} />
 * </FormField>
 *
 * // Field with counter
 * <FormField
 *   label="Bio"
 *   counter={`${bio.length}/200`}
 * >
 *   <TextInput multiline value={bio} onChangeText={setBio} />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  required = false,
  helperText,
  error,
  status = "default",
  children,
  labelIcon,
  counter,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: FormFieldProps): React.ReactElement {
  // Compute container styles
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {};

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  }, [disabled]);

  // Compute label styles
  const labelStyle = useMemo((): TextStyle => ({
    fontSize: 14,
    fontWeight: "500",
    color: disabled ? colors.labelDisabled : colors.label,
    marginBottom: 6,
  }), [disabled]);

  // Compute helper/error text style
  const helperStyle = useMemo((): TextStyle => ({
    fontSize: 12,
    color: statusColors[status],
    marginTop: 4,
  }), [status]);

  // Determine which text to show below input
  const bottomText = status === "error" && error ? error : helperText;
  const showBottomText = !!bottomText;

  // Render label section
  const renderLabel = () => {
    if (!label && !labelIcon) return null;

    return (
      <View style={styles.labelContainer}>
        {labelIcon && (
          <View style={styles.labelIcon}>
            {labelIcon}
          </View>
        )}
        {label ? (
          <Text style={labelStyle}>
            {label}
            {required && (
              <Text style={styles.required}> *</Text>
            )}
          </Text>
        ) : null}
        {counter && (
          <Text
            testID={testID ? `${testID}-counter` : undefined}
            style={styles.counter}
          >
            {counter}
          </Text>
        )}
      </View>
    );
  };

  // Render bottom text (helper or error)
  const renderBottomText = () => {
    if (!showBottomText) return null;

    return (
      <Text
        testID={testID ? `${testID}-helper` : undefined}
        style={helperStyle}
      >
        {bottomText}
      </Text>
    );
  };

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || label}
      style={[containerStyle, style]}
    >
      {renderLabel()}
      <View style={styles.inputContainer}>
        {children}
      </View>
      {renderBottomText()}
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  labelIcon: {
    marginRight: 6,
  },
  required: {
    color: colors.required,
    fontSize: 14,
  },
  counter: {
    marginLeft: "auto",
    fontSize: 12,
    color: colors.counter,
  },
  inputContainer: {
    // Container for the input children
  },
});

export default FormField;
