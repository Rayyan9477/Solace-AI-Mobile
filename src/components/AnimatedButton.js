import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, Text, StyleSheet } from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";

const AnimatedButton = ({ 
  title, 
  onPress, 
  variant = "primary",
  size = "medium",
  animated = true,
  style = {},
  textStyle = {},
  ...props 
}) => {
  const { theme, isReducedMotionEnabled } = useFixedTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated && !isReducedMotionEnabled) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [animated, isReducedMotionEnabled, pulseAnim]);

  const handlePressIn = () => {
    if (!isReducedMotionEnabled) {
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!isReducedMotionEnabled) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "transparent",
          borderColor: theme.colors.text?.inverse || "#FFFFFF",
          borderWidth: 2,
        };
      case "primary":
      default:
        return {
          backgroundColor: theme.colors.background?.primary || "#FFFFFF",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case "large":
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 16,
        };
      case "medium":
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return theme.colors.text?.inverse || "#FFFFFF";
      case "primary":
      default:
        return theme.colors.primary || "#926247";
    }
  };

  const animatedStyle = {
    transform: animated ? [{ scale: pulseAnim }, { scale: scaleAnim }] : [{ scale: scaleAnim }],
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.button,
          getVariantStyles(),
          getSizeStyles(),
          {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        {...props}
      >
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AnimatedButton;