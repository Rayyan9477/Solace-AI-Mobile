import React from "react";
import {
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";

import { PLATFORM_CONFIG } from "../../config/environment";
import { useTheme } from "../../contexts/ThemeContext";
import { styleUtils, hapticUtils } from "../../utils/platformOptimizations";

const PlatformButton = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  hapticFeedback = true,
  ...props
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (disabled || loading) return;

    if (hapticFeedback && PLATFORM_CONFIG.features.hapticFeedback) {
      hapticUtils.impact("medium");
    }

    onPress?.();
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: styleUtils.createBorderRadius(size),
      ...styleUtils.createShadow(variant === "primary" ? 2 : 1),
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: styleUtils.createSpacing("small"),
        paddingVertical: styleUtils.createSpacing("xs"),
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: styleUtils.createSpacing("medium"),
        paddingVertical: styleUtils.createSpacing("small"),
        minHeight: 44,
      },
      large: {
        paddingHorizontal: styleUtils.createSpacing("large"),
        paddingVertical: styleUtils.createSpacing("medium"),
        minHeight: 52,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary[500],
      },
      secondary: {
        backgroundColor: theme.colors.secondary[500],
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: theme.colors.primary[500],
      },
      ghost: {
        backgroundColor: "transparent",
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = styleUtils.createTextStyle("body");

    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantTextStyles = {
      primary: { color: theme.colors.text.inverse },
      secondary: { color: theme.colors.text.inverse },
      outline: { color: theme.colors.primary[500] },
      ghost: { color: theme.colors.text.primary },
    };

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      fontWeight: "600",
      textAlign: "center",
    };
  };

  // Use platform-appropriate touchable component
  const TouchableComponent = PLATFORM_CONFIG.isWeb
    ? Pressable
    : TouchableOpacity;

  return (
    <TouchableComponent
      style={[styles.button, getButtonStyle()]}
      onPress={handlePress}
      disabled={disabled || loading}
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      {...(PLATFORM_CONFIG.isWeb && {
        onHoverIn: () => {
          // Web hover effects could be added here
        },
        onHoverOut: () => {
          // Web hover effects could be added here
        },
      })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? theme.colors.primary[500]
              : theme.colors.text.inverse
          }
        />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
  },
});

export default PlatformButton;
