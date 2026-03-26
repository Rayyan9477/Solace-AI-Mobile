/**
 * Button Component
 * @description Accessible button with multiple variants and sizes
 * @task Task 2.1.1: Button Component
 * @phase Phase 3C: Refactored to use theme tokens
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  SizeSpec,
  VariantColors,
} from "./Button.types";
import { shadows, palette } from "../../../theme";
import { useHaptic } from "../../../hooks/useHaptic";

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
 * Uses theme tokens for consistency
 */
const variantColors: Record<ButtonVariant, VariantColors> = {
  primary: {
    background: palette.stone[500],
    text: palette.white,
    border: "transparent",
    pressedBackground: palette.stone[600],
    disabledBackground: palette.brown[700],
    disabledText: palette.gray[500],
  },
  secondary: {
    background: palette.stone[200],
    text: palette.stone[900],
    border: "transparent",
    pressedBackground: palette.stone[300],
    disabledBackground: palette.brown[700],
    disabledText: palette.gray[500],
  },
  outline: {
    background: "transparent",
    text: palette.stone[500],
    border: palette.stone[500],
    pressedBackground: `${palette.stone[500]}${palette.alpha[10]}`,
    disabledBackground: "transparent",
    disabledText: palette.gray[500],
  },
  ghost: {
    background: "transparent",
    text: palette.stone[500],
    border: "transparent",
    pressedBackground: `${palette.stone[500]}${palette.alpha[10]}`,
    disabledBackground: "transparent",
    disabledText: palette.gray[500],
  },
  crisis: {
    background: palette.red[500],
    text: palette.white,
    border: palette.red[600],
    pressedBackground: palette.red[600],
    disabledBackground: palette.brown[700],
    disabledText: palette.gray[500],
  },
  link: {
    background: "transparent",
    text: palette.blue[500],
    border: "transparent",
    pressedBackground: "transparent",
    disabledBackground: "transparent",
    disabledText: palette.gray[500],
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
  accessibilityHint,
  accessibilityState: externalA11yState,
  style,
  labelStyle,
}: ButtonProps): React.ReactElement {
  const isDisabled = disabled || loading;
  const sizeSpec = sizeSpecs[size];
  const colors = variantColors[variant];
  const haptic = useHaptic();

  // Compute button styles
  const buttonStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: Math.max(sizeSpec.height, 44),
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

    // Disabled opacity — use 0.6 for slightly more visibility than the previous 0.5.
    // Background color is already switched to disabledBackground via the ternary above,
    // so opacity alone is a secondary cue; together they make disabled clearly distinct.
    if (isDisabled) {
      baseStyle.opacity = 0.6;
    }

    // Crisis variant gets shadow
    if (variant === "crisis" && !isDisabled) {
      Object.assign(baseStyle, shadows.md, {
        shadowColor: palette.red[500],
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

  // Spring animation for press feedback
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  // Pressed background color handler (color change stays on Pressable, scale moves to Animated.View)
  const getPressedBackgroundStyle = (pressed: boolean): ViewStyle => {
    if (pressed && !isDisabled) {
      return { backgroundColor: colors.pressedBackground };
    }
    return {};
  };

  return (
    <Pressable
      testID={testID}
      onPress={isDisabled ? undefined : () => { haptic.light(); onPress?.(); }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
        ...externalA11yState,
      }}
      style={({ pressed }) => [
        buttonStyle,
        getPressedBackgroundStyle(pressed),
        style,
      ]}
    >
      <Animated.View style={[styles.animatedContent, animatedStyle]}>
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
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  animatedContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
