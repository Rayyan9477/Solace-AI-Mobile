import React, { useState } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";

import { useTheme } from "../../contexts/ThemeContext";

const Card = ({
  children,
  onPress,
  style,
  elevation = 2,
  variant = "default",
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "none",
  borderRadius,
  padding,
  margin,
  animated = false,
  disabled = false,
  loading = false,
  borderColor,
  borderWidth,
  backgroundColor,
}) => {
  const { theme } = useTheme();
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (animated && !disabled) {
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animated && !disabled) {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: backgroundColor || theme.colors.background.surface,
          borderWidth: borderWidth || 1,
          borderColor: borderColor || theme.colors.border.main,
          elevation: 0,
          shadowOpacity: 0,
        };
      case "flat":
        return {
          backgroundColor: backgroundColor || theme.colors.background.surface,
          elevation: 0,
          shadowOpacity: 0,
        };
      case "elevated":
        return {
          backgroundColor: backgroundColor || theme.colors.background.surface,
          elevation: elevation + 2,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: elevation + 2 },
          shadowOpacity: 0.3,
          shadowRadius: (elevation + 2) * 2,
        };
      case "filled":
        return {
          backgroundColor: backgroundColor || theme.colors.primary.light,
          elevation: 0,
          shadowOpacity: 0,
        };
      case "gradient":
        return {
          backgroundColor: backgroundColor || theme.colors.background.surface,
          elevation,
          shadowColor: theme.colors.primary.main,
          shadowOffset: { width: 0, height: elevation },
          shadowOpacity: 0.2,
          shadowRadius: elevation * 2,
        };
      default:
        return {
          backgroundColor: backgroundColor || theme.colors.background.surface,
          elevation,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: elevation },
          shadowOpacity: disabled ? 0.1 : 0.25,
          shadowRadius: elevation * 2,
        };
    }
  };

  const Container = onPress ? Pressable : View;

  const cardStyle = [
    styles.card,
    getVariantStyles(),
    {
      borderRadius: borderRadius || 12,
      padding: padding !== undefined ? padding : 16,
      marginVertical: margin !== undefined ? margin : 8,
      opacity: disabled ? 0.6 : 1,
    },
    style,
  ];

  if (animated && onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Container
          style={cardStyle}
          onPress={disabled ? undefined : onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole={onPress ? "button" : accessibilityRole}
          accessibilityState={{
            disabled: disabled || loading,
            busy: loading,
          }}
        >
          {children}
        </Container>
      </Animated.View>
    );
  }

  return (
    <Container
      style={cardStyle}
      onPress={disabled ? undefined : onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={onPress ? "button" : accessibilityRole}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    // Base styles - specific styles are applied via props
  },
});

export default Card;
