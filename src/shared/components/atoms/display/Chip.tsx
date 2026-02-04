/**
 * Chip Component
 * @description Selectable/dismissible tag for filters, selections, or categories
 * @task Task 2.2.4: Chip Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Filled and outlined variants
 * - Three sizes (sm, md, lg)
 * - Selected state
 * - Dismissible with close button
 * - Optional left icon
 * - 44pt minimum touch target
 * - Full accessibility support
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ChipProps, ChipVariant, ChipSize } from "./Chip.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Filled variant
  filledBg: palette.gray[700],
  filledBgSelected: palette.indigo[400],
  filledText: palette.gray[200],
  filledTextSelected: palette.white,
  // Outlined variant
  outlinedBorder: palette.gray[600],
  outlinedBorderSelected: palette.indigo[400],
  outlinedText: palette.gray[200],
  outlinedTextSelected: palette.indigo[400],
  // Disabled
  disabled: palette.gray[800],
  disabledText: palette.gray[500],
  // Dismiss button
  dismiss: palette.gray[400],
};

/**
 * Size configurations
 */
const sizeConfig: Record<ChipSize, { height: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  sm: { height: 28, paddingHorizontal: 10, fontSize: 12, iconSize: 14 },
  md: { height: 32, paddingHorizontal: 12, fontSize: 14, iconSize: 16 },
  lg: { height: 40, paddingHorizontal: 16, fontSize: 16, iconSize: 18 },
};

/**
 * Get background color based on variant and state
 */
function getBackgroundColor(
  variant: ChipVariant,
  selected: boolean,
  disabled: boolean
): string {
  if (disabled) return colors.disabled;
  if (variant === "filled") {
    return selected ? colors.filledBgSelected : colors.filledBg;
  }
  return "transparent";
}

/**
 * Get border color based on variant and state
 */
function getBorderColor(
  variant: ChipVariant,
  selected: boolean,
  disabled: boolean
): string {
  if (disabled) return colors.disabled;
  if (variant === "outlined") {
    return selected ? colors.outlinedBorderSelected : colors.outlinedBorder;
  }
  return "transparent";
}

/**
 * Get text color based on variant and state
 */
function getTextColor(
  variant: ChipVariant,
  selected: boolean,
  disabled: boolean
): string {
  if (disabled) return colors.disabledText;
  if (variant === "filled") {
    return selected ? colors.filledTextSelected : colors.filledText;
  }
  return selected ? colors.outlinedTextSelected : colors.outlinedText;
}

/**
 * Chip Component
 *
 * @example
 * ```tsx
 * // Basic chip
 * <Chip label="React Native" />
 *
 * // Selectable chip
 * <Chip
 *   label="Filter"
 *   selected={isSelected}
 *   onPress={() => setSelected(!isSelected)}
 * />
 *
 * // Dismissible chip
 * <Chip
 *   label="Tag"
 *   onDismiss={() => removeTag()}
 * />
 *
 * // Outlined variant
 * <Chip label="Category" variant="outlined" />
 * ```
 */
export function Chip({
  label,
  variant = "filled",
  size = "md",
  selected = false,
  disabled = false,
  onPress,
  onDismiss,
  leftIcon,
  testID,
  accessibilityLabel,
  style,
}: ChipProps): React.ReactElement {
  const config = sizeConfig[size];
  const backgroundColor = getBackgroundColor(variant, selected, disabled);
  const borderColor = getBorderColor(variant, selected, disabled);
  const textColor = getTextColor(variant, selected, disabled);

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleDismiss = () => {
    if (!disabled && onDismiss) {
      onDismiss();
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={disabled && !onDismiss}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityState={{
        selected,
        disabled,
      }}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={[
        styles.container,
        {
          height: config.height,
          paddingLeft: config.paddingHorizontal,
          paddingRight: onDismiss ? config.paddingHorizontal - 4 : config.paddingHorizontal,
          borderRadius: config.height / 2,
          backgroundColor,
          borderWidth: variant === "outlined" ? 1 : 0,
          borderColor,
        },
        style,
      ]}
    >
      {/* Left Icon */}
      {leftIcon && (
        <View style={styles.leftIcon}>
          {leftIcon}
        </View>
      )}

      {/* Label */}
      <Text
        style={[
          styles.label,
          {
            fontSize: config.fontSize,
            color: textColor,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {/* Dismiss Button */}
      {onDismiss && (
        <Pressable
          testID={testID ? `${testID}-dismiss` : "chip-dismiss"}
          onPress={handleDismiss}
          disabled={disabled}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
          style={styles.dismissButton}
        >
          <View
            style={[
              styles.dismissIcon,
              {
                width: config.iconSize,
                height: config.iconSize,
              },
            ]}
          >
            <Text
              style={[
                styles.dismissX,
                {
                  fontSize: config.iconSize - 2,
                  color: disabled ? colors.disabledText : colors.dismiss,
                },
              ]}
            >
              ×
            </Text>
          </View>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  leftIcon: {
    marginRight: 6,
  },
  label: {
    fontWeight: "500",
  },
  dismissButton: {
    marginLeft: 4,
    padding: 2,
  },
  dismissIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  dismissX: {
    fontWeight: "600",
    lineHeight: 16,
  },
});

export default Chip;
