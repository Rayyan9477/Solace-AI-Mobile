/**
 * Button Component
 * @description Accessible button with multiple variants and sizes
 * @task Task 2.1.1: Button Component
 *
 * Features:
 * - 6 visual variants (primary, secondary, outline, ghost, crisis, link)
 * - 3 sizes (sm, md, lg) with 44pt minimum touch target
 * - Loading and disabled states
 * - Left/right icon support
 * - Animated press feedback
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  SizeSpec,
  VariantColors,
} from "./Button.types";
import { shadows } from "../../../theme";

/**
 * Size specifications
 */
const sizeSpecs: Record<ButtonSize, SizeSpec> = {
  sm: { height: 36, paddingHorizontal: 12, fontSize: 14 },
  md: { height: 44, paddingHorizontal: 16, fontSize: 16 },
  lg: { height: 52, paddingHorizontal: 24, fontSize: 18 },
};

/**
 * Variant color configurations (dark mode first)
 */
const variantColors: Record<ButtonVariant, VariantColors> = {
  primary: {
    background: "#78716C", // brown-70 equivalent
    text: "#FFFFFF",
    border: "transparent",
    pressedBackground: "#57534E",
    disabledBackground: "#44403C",
    disabledText: "#A8A29E",
  },
  secondary: {
    background: "#E7E5E4", // gray-20 equivalent
    text: "#1C1917", // gray-90
    border: "transparent",
    pressedBackground: "#D6D3D1",
    disabledBackground: "#F5F5F4",
    disabledText: "#A8A29E",
  },
  outline: {
    background: "transparent",
    text: "#78716C", // brown-70
    border: "#78716C",
    pressedBackground: "rgba(120, 113, 108, 0.1)",
    disabledBackground: "transparent",
    disabledText: "#A8A29E",
  },
  ghost: {
    background: "transparent",
    text: "#78716C", // brown-70
    border: "transparent",
    pressedBackground: "rgba(120, 113, 108, 0.1)",
    disabledBackground: "transparent",
    disabledText: "#A8A29E",
  },
  crisis: {
    background: "#EF4444", // red-50
    text: "#FFFFFF",
    border: "#DC2626", // red-60
    pressedBackground: "#DC2626",
    disabledBackground: "#FCA5A5",
    disabledText: "#FECACA",
  },
  link: {
    background: "transparent",
    text: "#3B82F6", // blue-60
    border: "transparent",
    pressedBackground: "transparent",
    disabledBackground: "transparent",
    disabledText: "#93C5FD",
  },
};

/**
 * Button Component
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button label="Submit" onPress={handleSubmit} />
 *
 * // Crisis button with icon
 * <Button
 *   label="Get Help Now"
 *   variant="crisis"
 *   leftIcon={<PhoneIcon />}
 *   onPress={handleCrisis}
 * />
 *
 * // Loading state
 * <Button label="Saving..." loading onPress={handleSave} />
 * ```
 */
export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  testID,
  accessibilityLabel,
  style,
  labelStyle,
}: ButtonProps): React.ReactElement {
  const isDisabled = disabled || loading;
  const sizeSpec = sizeSpecs[size];
  const colors = variantColors[variant];

  // Compute button styles
  const buttonStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: sizeSpec.height,
      paddingHorizontal: sizeSpec.paddingHorizontal,
      borderRadius: 8,
      backgroundColor: isDisabled
        ? colors.disabledBackground
        : colors.background,
      borderWidth: colors.border !== "transparent" ? 1 : 0,
      borderColor: colors.border,
    };

    // Full width
    if (fullWidth) {
      baseStyle.width = "100%";
    }

    // Disabled opacity
    if (isDisabled) {
      baseStyle.opacity = 0.5;
    }

    // Crisis variant gets shadow
    if (variant === "crisis" && !isDisabled) {
      Object.assign(baseStyle, shadows.md, {
        shadowColor: "#EF4444",
      });
    }

    return baseStyle;
  }, [
    sizeSpec,
    colors,
    isDisabled,
    fullWidth,
    variant,
  ]);

  // Compute label styles
  const computedLabelStyle = useMemo((): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: sizeSpec.fontSize,
      fontWeight: "600",
      color: isDisabled ? colors.disabledText : colors.text,
      textAlign: "center",
    };

    // Link variant gets underline
    if (variant === "link") {
      baseStyle.textDecorationLine = "underline";
    }

    return baseStyle;
  }, [sizeSpec, colors, isDisabled, variant]);

  // Pressed style handler
  const getPressedStyle = (pressed: boolean): ViewStyle => {
    if (pressed && !isDisabled) {
      return {
        transform: [{ scale: 0.96 }],
        backgroundColor: colors.pressedBackground,
      };
    }
    return {};
  };

  return (
    <Pressable
      testID={testID}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      style={({ pressed }) => [
        buttonStyle,
        getPressedStyle(pressed),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          testID={testID ? `${testID}-indicator` : undefined}
          size="small"
          color={colors.text}
        />
      ) : (
        <>
          {leftIcon && (
            <View style={styles.iconLeft}>{leftIcon}</View>
          )}
          <Text
            style={[computedLabelStyle, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {rightIcon && (
            <View style={styles.iconRight}>{rightIcon}</View>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
