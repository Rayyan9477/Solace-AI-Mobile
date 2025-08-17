import PropTypes from "prop-types";
import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  maxLength,
  autoCapitalize = "none",
  autoCorrect = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  variant = "outlined",
  size = "medium",
  loading = false,
  disabled = false,
  helperText,
  characterCount = false,
  focused = false,
  onFocus,
  onBlur,
  animated = true,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(focused);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);
  const inputRef = useRef(null);
  const animatedFocus = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedFocus, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, animated]);

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
          minHeight: 36,
        };
      case "large":
        return {
          paddingHorizontal: 20,
          paddingVertical: 16,
          fontSize: 18,
          minHeight: 56,
        };
      default:
        return {
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          minHeight: 48,
        };
    }
  };

  const getVariantStyles = () => {
    const baseStyle = {
      borderRadius: 8,
      ...getSizeStyles(),
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.secondary,
          borderWidth: 0,
        };
      case "underlined":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 0,
          borderBottomWidth: 2,
          borderRadius: 0,
          paddingHorizontal: 0,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.colors.background.surface,
          borderWidth: 1,
        };
    }
  };

  const borderColor = error
    ? theme.colors.error[500]
    : isFocused
      ? theme.colors.primary[500]
      : theme.colors.border.primary;

  const inputAccessibilityLabel =
    accessibilityLabel ||
    `${label} input field${error ? `. Error: ${error}` : ""}`;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const variantStyles = getVariantStyles();
  const animatedBorderColor = animated
    ? animatedFocus.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.border.primary, theme.colors.primary[500]],
      })
    : borderColor;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Animated.Text
          style={[
            styles.label,
            {
              color: error
                ? theme.colors.error[500]
                : animated
                  ? animatedFocus.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        theme.colors.text.secondary,
                        theme.colors.primary[500],
                      ],
                    })
                  : theme.colors.text.primary,
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}

      <Animated.View
        style={[
          styles.inputContainer,
          variantStyles,
          {
            borderColor: error
              ? theme.colors.error[500]
              : animated
                ? animatedBorderColor
                : borderColor,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {leftIcon && (
          <Pressable
            onPress={onLeftIconPress}
            style={styles.iconContainer}
            accessibilityLabel="Left icon"
            accessibilityRole="button"
            disabled={!onLeftIconPress}
          >
            {leftIcon}
          </Pressable>
        )}

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.placeholder}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={!disabled && !loading}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              height: multiline ? undefined : variantStyles.minHeight - 24,
              fontSize: variantStyles.fontSize,
            },
          ]}
          accessibilityLabel={inputAccessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: disabled || loading,
          }}
        />

        {(secureTextEntry || rightIcon) && (
          <Pressable
            onPress={
              secureTextEntry
                ? () => setIsSecureVisible(!isSecureVisible)
                : onRightIconPress
            }
            style={styles.iconContainer}
            accessible
            accessibilityRole="button"
            accessibilityLabel={
              secureTextEntry
                ? `${isSecureVisible ? "Hide" : "Show"} password`
                : "Right icon"
            }
            accessibilityHint="Double tap to toggle password visibility"
          >
            {secureTextEntry ? (
              <Text style={{ color: theme.colors.primary[500], fontSize: 18 }}>
                {isSecureVisible ? "👁️" : "👁️‍🗨️"}
              </Text>
            ) : (
              rightIcon
            )}
          </Pressable>
        )}
      </Animated.View>

      {/* Helper text, character count, or error */}
      <View style={styles.bottomContainer}>
        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              {
                color: error
                  ? theme.colors.error[500]
                  : theme.colors.text.secondary,
              },
            ]}
            accessibilityLabel={error ? `Error: ${error}` : helperText}
            accessibilityRole={error ? "alert" : "text"}
          >
            {error || helperText}
          </Text>
        )}

        {characterCount && maxLength && (
          <Text
            style={[
              styles.characterCount,
              {
                color:
                  (value?.length || 0) > maxLength * 0.9
                    ? theme.colors.warning[500]
                    : theme.colors.text.secondary,
              },
            ]}
            accessibilityLabel={`${value?.length || 0} of ${maxLength} characters`}
          >
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  iconContainer: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    fontWeight: "400",
    flex: 1,
  },
  characterCount: {
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 8,
  },
});

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  numberOfLines: PropTypes.number,
  maxLength: PropTypes.number,
  autoCapitalize: PropTypes.string,
  autoCorrect: PropTypes.bool,
  style: PropTypes.object,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onLeftIconPress: PropTypes.func,
  onRightIconPress: PropTypes.func,
  variant: PropTypes.oneOf(["outlined", "filled", "underlined"]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  characterCount: PropTypes.bool,
  focused: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  animated: PropTypes.bool,
};

Input.defaultProps = {
  autoCapitalize: "none",
  autoCorrect: false,
  variant: "outlined",
  size: "medium",
  loading: false,
  disabled: false,
  characterCount: false,
  focused: false,
  animated: true,
};

export default Input;
