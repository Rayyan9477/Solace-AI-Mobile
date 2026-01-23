/**
 * TextInput Component
 * @description Accessible text input with label, error, and icon support
 * @task Task 2.1.3: TextInput Component
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

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Text colors
  label: "#E2E8F0",
  placeholder: "#64748B",
  text: "#F1F5F9",
  helperText: "#94A3B8",
  error: "#EF4444",
  disabled: "#64748B",

  // Border colors
  borderDefault: "#475569",
  borderFocused: "#818CF8",
  borderError: "#EF4444",
  borderDisabled: "#334155",

  // Background
  background: "#1E293B",
  backgroundDisabled: "#0F172A",
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
        return colors.borderError;
      case "focused":
        return colors.borderFocused;
      case "disabled":
        return colors.borderDisabled;
      default:
        return colors.borderDefault;
    }
  }, [state]);

  // Compute input container style
  const inputContainerStyle = useMemo((): ViewStyle => ({
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor,
    borderRadius: 8,
    backgroundColor: disabled ? colors.backgroundDisabled : colors.background,
    minHeight: multiline ? 100 : 48,
    paddingHorizontal: 12,
  }), [borderColor, disabled, multiline]);

  // Compute input style
  const computedInputStyle = useMemo((): TextStyle => {
    const style: TextStyle = {
      flex: 1,
      fontSize: 16,
      color: disabled ? colors.disabled : colors.text,
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
          placeholderTextColor={colors.placeholder}
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
    color: colors.label,
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
    color: colors.error,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: colors.helperText,
    marginTop: 4,
  },
});

export default TextInput;
