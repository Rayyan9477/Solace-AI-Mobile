import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";
import EnhancedShadersContainer from "../enhanced/EnhancedShadersContainer";
import { MentalHealthIcon, ActionIcon } from "../icons";

// Enhanced Button component following shadcn/ui design principles
// Features shader effects, therapeutic design, and comprehensive variants
const EnhancedButton = ({
  title,
  onPress,
  variant = "primary", // 'primary', 'secondary', 'therapeutic', 'glass', 'outline', 'ghost'
  size = "medium", // 'small', 'medium', 'large'
  loading = false,
  disabled = false,
  animated = true,
  icon,
  iconPosition = "left", // 'left', 'right', 'only'
  shaderEffect = false,
  shaderVariant = "mesh",
  fullWidth = false,
  style,
  textStyle,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const pressAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loadingRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      // Pulse animation for primary therapeutic buttons
      if (variant === "therapeutic" || variant === "primary") {
        const pulseAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.02,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        );
        pulseAnimation.start();
        return () => pulseAnimation.stop();
      }
    } else {
      fadeAnim.setValue(1);
    }
  }, [animated, variant, fadeAnim, pulseAnim]);

  useEffect(() => {
    if (loading) {
      const rotateAnimation = Animated.loop(
        Animated.timing(loadingRotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      rotateAnimation.start();
      return () => rotateAnimation.stop();
    }
  }, [loading, loadingRotateAnim]);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.spring(pressAnim, {
        toValue: 0.96,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.spring(pressAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  // Get variant-specific styling
  const getVariantStyles = () => {
    const isDisabled = disabled || loading;
    const opacity = isDisabled ? 0.6 : 1;

    switch (variant) {
      case "primary":
        return {
          gradientColors: [
            theme.colors.primary[500],
            theme.colors.primary[600],
          ],
          textColor: theme.colors.text.inverse,
          borderColor: theme.colors.primary[500],
          shadowColor: theme.colors.primary[500],
          opacity,
        };

      case "therapeutic":
        return {
          gradientColors: [
            theme.colors.therapeutic.calming[500],
            theme.colors.therapeutic.peaceful[500],
          ],
          textColor: theme.colors.text.inverse,
          borderColor: theme.colors.therapeutic.calming[400],
          shadowColor: theme.colors.therapeutic.calming[400],
          opacity,
        };

      case "secondary":
        return {
          gradientColors: [
            theme.colors.secondary[100],
            theme.colors.secondary[200],
          ],
          textColor: theme.colors.text.primary,
          borderColor: theme.colors.secondary[300],
          shadowColor: theme.colors.secondary[400],
          opacity,
        };

      case "glass":
        return {
          gradientColors: [
            "rgba(255, 255, 255, 0.15)",
            "rgba(255, 255, 255, 0.05)",
          ],
          textColor: theme.colors.text.primary,
          borderColor: "rgba(255, 255, 255, 0.3)",
          shadowColor: "rgba(0, 0, 0, 0.1)",
          opacity,
        };

      case "outline":
        return {
          gradientColors: ["transparent", "transparent"],
          textColor: theme.colors.primary[600],
          borderColor: theme.colors.primary[400],
          shadowColor: "rgba(0, 0, 0, 0.1)",
          opacity,
        };

      case "ghost":
        return {
          gradientColors: ["transparent", "transparent"],
          textColor: theme.colors.text.primary,
          borderColor: "transparent",
          shadowColor: "transparent",
          opacity,
        };

      default:
        return {
          gradientColors: [
            theme.colors.background.surface,
            theme.colors.background.secondary,
          ],
          textColor: theme.colors.text.primary,
          borderColor: theme.colors.border.light,
          shadowColor: "rgba(0, 0, 0, 0.1)",
          opacity,
        };
    }
  };

  // Get size-specific styling
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingHorizontal: spacing[3],
          paddingVertical: spacing[2],
          borderRadius: borderRadius.md,
          fontSize: typography.sizes.sm,
          iconSize: 16,
          minHeight: 36,
        };

      case "large":
        return {
          paddingHorizontal: spacing[6],
          paddingVertical: spacing[4],
          borderRadius: borderRadius.xl,
          fontSize: typography.sizes.lg,
          iconSize: 24,
          minHeight: 56,
        };

      default: // medium
        return {
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          borderRadius: borderRadius.lg,
          fontSize: typography.sizes.base,
          iconSize: 20,
          minHeight: 44,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const loadingRotation = loadingRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderContent = () => {
    if (loading) {
      return (
        <Animated.View
          style={[
            styles.loadingContainer,
            { transform: [{ rotate: loadingRotation }] },
          ]}
        >
          <Text
            style={[styles.loadingText, { color: variantStyles.textColor }]}
          >
            ⟳
          </Text>
        </Animated.View>
      );
    }

    if (iconPosition === "only" && icon) {
      return (
        <View style={styles.iconOnlyContainer}>
          {typeof icon === "string" ? (
            <MentalHealthIcon
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.textColor}
              variant="outline"
            />
          ) : (
            icon
          )}
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === "left" && (
          <View style={styles.iconLeft}>
            {typeof icon === "string" ? (
              <MentalHealthIcon
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                variant="outline"
              />
            ) : (
              icon
            )}
          </View>
        )}

        <Text
          style={[
            styles.buttonText,
            {
              fontSize: sizeStyles.fontSize,
              color: variantStyles.textColor,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>

        {icon && iconPosition === "right" && (
          <View style={styles.iconRight}>
            {typeof icon === "string" ? (
              <MentalHealthIcon
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                variant="outline"
              />
            ) : (
              icon
            )}
          </View>
        )}
      </View>
    );
  };

  const ButtonComponent = () => (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: pressAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: fullWidth ? "100%" : undefined,
            opacity: variantStyles.opacity,
          },
          style,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        accessible
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        testID={testID}
        {...props}
      >
        <LinearGradient
          colors={variantStyles.gradientColors}
          style={[
            styles.buttonGradient,
            {
              paddingHorizontal: sizeStyles.paddingHorizontal,
              paddingVertical: sizeStyles.paddingVertical,
              borderRadius: sizeStyles.borderRadius,
              borderColor: variantStyles.borderColor,
              shadowColor: variantStyles.shadowColor,
              minHeight: sizeStyles.minHeight,
            },
            variant === "glass" && styles.glassEffect,
            variant === "outline" && styles.outlineEffect,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (shaderEffect) {
    return (
      <EnhancedShadersContainer
        variant={shaderVariant}
        intensity={0.3}
        animated={animated}
        style={styles.shaderWrapper}
      >
        <ButtonComponent />
      </EnhancedShadersContainer>
    );
  }

  return <ButtonComponent />;
};

const styles = StyleSheet.create({
  shaderWrapper: {
    borderRadius: borderRadius.lg,
  },
  buttonContainer: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    borderRadius: borderRadius.lg,
  },
  buttonGradient: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    ...shadows.md,
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  outlineEffect: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconOnlyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconLeft: {
    marginRight: spacing[2],
  },
  iconRight: {
    marginLeft: spacing[2],
  },
  buttonText: {
    fontWeight: typography.weights.semiBold,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
  },
});

export default EnhancedButton;
