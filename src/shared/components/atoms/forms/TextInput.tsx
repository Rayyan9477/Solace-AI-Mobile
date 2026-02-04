/**
 * TextInput Component
 * @description Accessible text input with label, error, and icon support
 * @task Task 2.1.3: TextInput Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Label and helper text
 * - Error state with message
 * - Left/right icon support
 * - Multiline support
 * - Secure text entry
 * - Focus state handling
 * - Full accessibility support
 */

import React, { useState, useMemo } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type { TextInputProps, InputState } from "./TextInput.types";
import { colors, palette } from "../../../theme";

/**
 * Input-specific color tokens from theme
 */
const inputColors = {
  // Text colors
  label: palette.gray[200],
  placeholder: palette.gray[500],
  text: palette.gray[100],
  helperText: palette.gray[400],
  error: palette.red[500],
  disabled: palette.gray[500],

  // Border colors
  borderDefault: palette.gray[600],
  borderFocused: palette.indigo[400],
  borderError: palette.red[500],
  borderDisabled: palette.gray[700],

  // Background
  background: palette.gray[800],
  backgroundDisabled: palette.gray[900],
};

/**
 * TextInput Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextInput
 *   value={email}
 *   onChangeText={setEmail}
 *   label="Email"
 *   placeholder="Enter your email"
 * />
 *
 * // With error
 * <TextInput
 *   value={password}
 *   onChangeText={setPassword}
 *   label="Password"
 *   secureTextEntry
 *   error="Password is required"
 * />
 *
 * // With icons
 * <TextInput
 *   value={search}
 *   onChangeText={setSearch}
 *   leftIcon={<SearchIcon />}
 *   rightIcon={<ClearIcon />}
 * />
 * ```
 */
export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  helperText,
  secureTextEntry,
  multiline,
  leftIcon,
  rightIcon,
  inputMode,
  disabled = false,
  testID,
  accessibilityLabel,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}: TextInputProps): React.ReactElement {
  const [isFocused, setIsFocused] = useState(false);

  // Determine current state
  const state: InputState = useMemo(() => {
    if (disabled) return "disabled";
    if (error) return "error";
    if (isFocused) return "focused";
    return "default";
  }, [disabled, error, isFocused]);

  // Get border color based on state
  const borderColor = useMemo(() => {
    switch (state) {
      case "error":
        return inputColors.borderError;
      case "focused":
        return inputColors.borderFocused;
      case "disabled":
        return inputColors.borderDisabled;
      default:
        return inputColors.borderDefault;
    }
  }, [state]);

  // Compute input container style
  const inputContainerStyle = useMemo((): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor,
    borderRadius: 8,
    backgroundColor: disabled ? inputColors.backgroundDisabled : inputColors.background,
    minHeight: multiline ? 100 : 48,
    paddingHorizontal: 12,
  }), [borderColor, disabled, multiline]);

  // Compute input style
  const computedInputStyle = useMemo((): TextStyle => {
    const style: TextStyle = {
      flex: 1,
      fontSize: 16,
      color: disabled ? inputColors.disabled : inputColors.text,
      paddingVertical: 12,
    };

    if (disabled) {
      style.opacity = 0.5;
    }

    if (multiline) {
      style.textAlignVertical = "top";
    }

    return style;
  }, [disabled, multiline]);

  // Handle focus
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]} testID={testID ? `${testID}-container` : undefined}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      {/* Input Container */}
      <View style={inputContainerStyle}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.iconLeft}>{leftIcon}</View>
        )}

        {/* Text Input */}
        <RNTextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={inputColors.placeholder}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          inputMode={inputMode}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityState={{ disabled }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[computedInputStyle, inputStyle]}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Helper Text (only shown if no error) */}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: inputColors.label,
    marginBottom: 6,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: inputColors.error,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: inputColors.helperText,
    marginTop: 4,
  },
});

export default TextInput;
