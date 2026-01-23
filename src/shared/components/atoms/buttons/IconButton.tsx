/**
 * IconButton Component
 * @description Accessible icon-only button with multiple variants
 * @task Task 2.1.2: IconButton Component
 *
 * Features:
 * - 4 visual variants (filled, tinted, outlined, ghost)
 * - 3 sizes (sm: 32, md: 44, lg: 56)
 * - Circular option
 * - Animated press feedback
 * - Full accessibility support with required label
 */

import React, { useMemo } from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonSize,
} from "./IconButton.types";

/**
 * Size specifications
 */
const sizeSpecs: Record<IconButtonSize, number> = {
  sm: 32,
  md: 44,
  lg: 56,
};

/**
 * Variant color configurations (dark mode first)
 */
const variantColors: Record<
  IconButtonVariant,
  {
    background: string;
    iconColor: string;
    border: string;
    pressedBackground: string;
  }
> = {
  filled: {
    background: "#78716C",
    iconColor: "#FFFFFF",
    border: "transparent",
    pressedBackground: "#57534E",
  },
  tinted: {
    background: "rgba(120, 113, 108, 0.2)",
    iconColor: "#78716C",
    border: "transparent",
    pressedBackground: "rgba(120, 113, 108, 0.3)",
  },
  outlined: {
    background: "transparent",
    iconColor: "#78716C",
    border: "#78716C",
    pressedBackground: "rgba(120, 113, 108, 0.1)",
  },
  ghost: {
    background: "transparent",
    iconColor: "#78716C",
    border: "transparent",
    pressedBackground: "rgba(120, 113, 108, 0.1)",
  },
};

/**
 * IconButton Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <IconButton
 *   icon={<CloseIcon />}
 *   onPress={handleClose}
 *   accessibilityLabel="Close dialog"
 * />
 *
 * // Circular outlined
 * <IconButton
 *   icon={<PlusIcon />}
 *   variant="outlined"
 *   circular
 *   onPress={handleAdd}
 *   accessibilityLabel="Add item"
 * />
 * ```
 */
export function IconButton({
  icon,
  onPress,
  size = "md",
  variant = "filled",
  circular = false,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: IconButtonProps): React.ReactElement {
  const sizeValue = sizeSpecs[size];
  const colors = variantColors[variant];

  // Calculate hitSlop for smaller buttons to meet 44pt touch target
  const hitSlop = useMemo(() => {
    if (sizeValue < 44) {
      const padding = Math.ceil((44 - sizeValue) / 2);
      return { top: padding, bottom: padding, left: padding, right: padding };
    }
    return undefined;
  }, [sizeValue]);

  // Compute button styles
  const buttonStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: sizeValue,
      height: sizeValue,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: circular ? sizeValue / 2 : 8,
      backgroundColor: disabled
        ? "rgba(120, 113, 108, 0.3)"
        : colors.background,
      borderWidth: colors.border !== "transparent" ? 1 : 0,
      borderColor: colors.border,
    };

    // Disabled opacity
    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  }, [sizeValue, circular, colors, disabled]);

  // Pressed style handler
  const getPressedStyle = (pressed: boolean): ViewStyle => {
    if (pressed && !disabled) {
      return {
        transform: [{ scale: 0.95 }],
        backgroundColor: colors.pressedBackground,
      };
    }
    return {};
  };

  return (
    <Pressable
      testID={testID}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled,
      }}
      style={({ pressed }) => [buttonStyle, getPressedStyle(pressed), style]}
    >
      {icon}
    </Pressable>
  );
}

export default IconButton;
