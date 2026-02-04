/**
 * ListItem Component
 * @description Versatile list item component for various list contexts
 * @task Task 2.4.2: ListItem Component (Sprint 2.4 - Molecules Content)
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Multiple variants (default, compact, expanded)
 * - Leading element slot (icon, avatar, checkbox)
 * - Trailing element slot (icon, text, switch, chevron)
 * - Title, subtitle, and description text
 * - Optional divider
 * - Pressable support with feedback
 * - Selected and disabled states
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type {
  ListItemProps,
  ListItemVariant,
} from "./ListItem.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Background
  background: "transparent",
  backgroundSelected: `${palette.indigo[400]}${palette.alpha[10]}`,
  backgroundPressed: `${palette.white}${palette.alpha[5]}`,

  // Text
  title: palette.gray[100],
  subtitle: palette.gray[400],
  description: palette.gray[500],
  titleDisabled: palette.gray[600],

  // Divider
  divider: `${palette.white}${palette.alpha[10]}`,
};

/**
 * Variant configurations
 */
const variantConfig: Record<
  ListItemVariant,
  { paddingVertical: number; titleSize: number; subtitleSize: number }
> = {
  compact: { paddingVertical: 8, titleSize: 14, subtitleSize: 12 },
  default: { paddingVertical: 12, titleSize: 16, subtitleSize: 14 },
  expanded: { paddingVertical: 16, titleSize: 18, subtitleSize: 14 },
};

/**
 * ListItem Component
 *
 * @example
 * ```tsx
 * // Basic list item
 * <ListItem title="Settings" />
 *
 * // With subtitle and trailing chevron
 * <ListItem
 *   title="Account"
 *   subtitle="Manage your account settings"
 *   trailing={<ChevronIcon />}
 *   pressable
 *   onPress={handlePress}
 * />
 *
 * // With leading icon and divider
 * <ListItem
 *   title="Notifications"
 *   subtitle="Manage notification preferences"
 *   leading={<BellIcon />}
 *   trailing={<Switch value={enabled} onValueChange={setEnabled} />}
 *   showDivider
 * />
 * ```
 */
export function ListItem({
  title,
  subtitle,
  description,
  variant = "default",
  leading,
  trailing,
  showDivider = false,
  pressable = false,
  onPress,
  onLongPress,
  selected = false,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: ListItemProps): React.ReactElement {
  const config = variantConfig[variant];

  // Compute container styles
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: config.paddingVertical,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
    };

    if (selected) {
      baseStyle.backgroundColor = colors.backgroundSelected;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  }, [config, selected, disabled]);

  // Compute title styles
  const titleStyle = useMemo((): TextStyle => ({
    fontSize: config.titleSize,
    fontWeight: "500",
    color: disabled ? colors.titleDisabled : colors.title,
    marginBottom: subtitle || description ? 2 : 0,
  }), [config.titleSize, disabled, subtitle, description]);

  // Compute subtitle styles
  const subtitleStyle = useMemo((): TextStyle => ({
    fontSize: config.subtitleSize,
    color: colors.subtitle,
    marginBottom: description ? 2 : 0,
  }), [config.subtitleSize, description]);

  // Description styles
  const descriptionStyle: TextStyle = {
    fontSize: 12,
    color: colors.description,
  };

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
      {/* Leading Element */}
      {leading && (
        <View style={styles.leading}>
          {leading}
        </View>
      )}

      {/* Text Content */}
      <View style={styles.content}>
        <Text style={titleStyle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={subtitleStyle} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
        {description && (
          <Text style={descriptionStyle} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>

      {/* Trailing Element */}
      {trailing && (
        <View style={styles.trailing}>
          {trailing}
        </View>
      )}
    </>
  );

  // Render divider
  const renderDivider = () => {
    if (!showDivider) return null;
    return (
      <View
        testID={testID ? `${testID}-divider` : undefined}
        style={[
          styles.divider,
          { marginLeft: leading ? 56 : 16 },
        ]}
      />
    );
  };

  // Render as Pressable if pressable
  if (pressable) {
    return (
      <View>
        <Pressable
          testID={testID}
          onPress={handlePress}
          onLongPress={handleLongPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || title}
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
        {renderDivider()}
      </View>
    );
  }

  // Render as View if not pressable
  return (
    <View>
      <View
        testID={testID}
        accessibilityLabel={accessibilityLabel || title}
        style={[containerStyle, style]}
      >
        {renderContent()}
      </View>
      {renderDivider()}
    </View>
  );
}

const styles = StyleSheet.create({
  leading: {
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  trailing: {
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginRight: 16,
  },
  pressed: {
    backgroundColor: colors.backgroundPressed,
  },
});

export default ListItem;
