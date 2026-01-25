/**
 * Card Component
 * @description Versatile container component with multiple variants
 * @task Task 2.4.1: Card Component (Sprint 2.4 - Molecules Content)
 *
 * Features:
 * - Multiple visual variants (elevated, filled, outlined)
 * - Three sizes (sm, md, lg)
 * - Pressable support with press feedback
 * - Selected/active state
 * - Disabled state
 * - Header and footer slots
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import type {
  CardProps,
  CardVariant,
  CardSize,
} from "./Card.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Background
  backgroundElevated: "#2A2220",
  backgroundFilled: "#1E293B",
  backgroundOutlined: "transparent",

  // Border
  borderOutlined: "#475569",
  borderSelected: "#818CF8",

  // Shadow
  shadowColor: "#000000",

  // States
  pressedOverlay: "rgba(255, 255, 255, 0.05)",
};

/**
 * Size configurations
 */
const sizeConfig: Record<
  CardSize,
  { padding: number; borderRadius: number }
> = {
  sm: { padding: 12, borderRadius: 8 },
  md: { padding: 16, borderRadius: 12 },
  lg: { padding: 20, borderRadius: 16 },
};

/**
 * Shadow configuration for elevated variant
 */
const elevatedShadow = {
  shadowColor: colors.shadowColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,
};

/**
 * Card Component
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 *
 * // Pressable card with header
 * <Card
 *   variant="outlined"
 *   pressable
 *   onPress={handlePress}
 *   header={<Text>Card Title</Text>}
 * >
 *   <Text>Card body content</Text>
 * </Card>
 *
 * // Selected card with footer
 * <Card
 *   variant="elevated"
 *   selected
 *   footer={<Button label="Action" onPress={handleAction} />}
 * >
 *   <Text>Selectable content</Text>
 * </Card>
 * ```
 */
export function Card({
  variant = "elevated",
  size = "md",
  pressable = false,
  onPress,
  onLongPress,
  selected = false,
  disabled = false,
  children,
  header,
  footer,
  testID,
  accessibilityLabel,
  style,
  contentStyle,
}: CardProps): React.ReactElement {
  const config = sizeConfig[size];

  // Compute container styles based on variant and state
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: config.borderRadius,
      overflow: "hidden",
    };

    // Apply variant styles
    switch (variant) {
      case "filled":
        baseStyle.backgroundColor = colors.backgroundFilled;
        break;
      case "outlined":
        baseStyle.backgroundColor = colors.backgroundOutlined;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.borderOutlined;
        break;
      case "elevated":
      default:
        baseStyle.backgroundColor = colors.backgroundElevated;
        Object.assign(baseStyle, elevatedShadow);
        break;
    }

    // Apply selected state
    if (selected) {
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = colors.borderSelected;
    }

    // Apply disabled state
    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  }, [variant, config, selected, disabled]);

  // Compute content styles
  const computedContentStyle = useMemo((): ViewStyle => ({
    padding: config.padding,
  }), [config.padding]);

  // Handle press
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  // Handle long press
  const handleLongPress = () => {
    if (!disabled && onLongPress) {
      onLongPress();
    }
  };

  // Render content
  const renderContent = () => (
    <>
      {header && (
        <View style={styles.header}>
          {header}
        </View>
      )}
      <View style={[computedContentStyle, contentStyle]}>
        {children}
      </View>
      {footer && (
        <View style={styles.footer}>
          {footer}
        </View>
      )}
    </>
  );

  // Render as Pressable if pressable
  if (pressable) {
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{
          disabled,
          selected,
        }}
        style={({ pressed }) => [
          containerStyle,
          pressed && !disabled && styles.pressed,
          style,
        ]}
      >
        {renderContent()}
      </Pressable>
    );
  }

  // Render as View if not pressable
  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={[containerStyle, style]}
    >
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  pressed: {
    backgroundColor: colors.pressedOverlay,
    opacity: 0.9,
  },
});

export default Card;
