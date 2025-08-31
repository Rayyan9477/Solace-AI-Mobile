/**
 * Therapeutic Button Component
 * Enhanced shadcn UI-inspired button component for mental health applications
 * Provides accessibility, therapeutic design patterns, and touch-optimized interactions
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Animated,
  ActivityIndicator,
  View,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { spacing, borderRadius, typography } from "../../shared/theme/theme";
import {
  TouchTargetHelpers,
  WCAG_CONSTANTS,
} from "../../shared/utils/accessibility";
import { MentalHealthContrastValidators } from "../../utils/colorContrast";

// Button variants for different therapeutic contexts
const BUTTON_VARIANTS = {
  primary: {
    background: "primary.500",
    text: "white",
    border: "primary.500",
    hover: "primary.600",
    pressed: "primary.700",
  },
  secondary: {
    background: "transparent",
    text: "primary.500",
    border: "primary.500",
    hover: "primary.50",
    pressed: "primary.100",
  },
  therapeutic: {
    background: "therapeutic.nurturing.500",
    text: "white",
    border: "therapeutic.nurturing.500",
    hover: "therapeutic.nurturing.600",
    pressed: "therapeutic.nurturing.700",
    gradient: ["therapeutic.nurturing.500", "therapeutic.nurturing.600"],
  },
  calming: {
    background: "therapeutic.calming.500",
    text: "white",
    border: "therapeutic.calming.500",
    hover: "therapeutic.calming.600",
    pressed: "therapeutic.calming.700",
    gradient: ["therapeutic.calming.500", "therapeutic.calming.600"],
  },
  crisis: {
    background: "error.500",
    text: "white",
    border: "error.500",
    hover: "error.600",
    pressed: "error.700",
    gradient: ["error.500", "error.600"],
    pulse: true, // Enable attention animation
  },
  success: {
    background: "success.500",
    text: "white",
    border: "success.500",
    hover: "success.600",
    pressed: "success.700",
    gradient: ["success.500", "success.600"],
  },
  ghost: {
    background: "transparent",
    text: "gray.700",
    border: "transparent",
    hover: "gray.100",
    pressed: "gray.200",
  },
  destructive: {
    background: "error.500",
    text: "white",
    border: "error.500",
    hover: "error.600",
    pressed: "error.700",
  },
};

// Button sizes with accessibility considerations
const BUTTON_SIZES = {
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: typography.body2.fontSize,
    minHeight: WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE,
    borderRadius: borderRadius.md,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body1.fontSize,
    minHeight: WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE,
    borderRadius: borderRadius.lg,
  },
  lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.h3.fontSize,
    minHeight: 56, // Larger for important actions
    borderRadius: borderRadius.xl,
  },
  xl: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    fontSize: typography.h2.fontSize,
    minHeight: 64, // Emergency/crisis buttons
    borderRadius: borderRadius["2xl"],
  },
};

export const TherapeuticButton = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onPress,
  style = {},
  textStyle = {},
  icon,
  iconPosition = "left",
  fullWidth = false,
  animated = true,
  therapeutic = false, // Enable therapeutic-specific features
  emergencyMode = false, // For crisis support buttons
  testID,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  const { theme } = useTheme();
  const pressAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(1)).current;

  const buttonVariant = BUTTON_VARIANTS[variant];
  const buttonSize = BUTTON_SIZES[size];

  // Get theme color helper
  const getThemeColor = (colorPath) => {
    const path = colorPath.split(".");
    let color = theme.colors;
    for (const segment of path) {
      color = color[segment];
    }
    return color;
  };

  // Button colors
  const backgroundColor = getThemeColor(buttonVariant.background);
  const textColor = getThemeColor(buttonVariant.text);
  const borderColor = getThemeColor(buttonVariant.border);

  // Gradient colors if available
  const gradientColors = buttonVariant.gradient
    ? buttonVariant.gradient.map(getThemeColor)
    : null;

  // Accessibility validation for crisis buttons
  if ((variant === "crisis" || emergencyMode) && __DEV__) {
    const contrastResult = MentalHealthContrastValidators.validateCrisisElement(
      textColor,
      backgroundColor,
    );
    if (!contrastResult.isCompliant) {
      console.warn(
        "Crisis button contrast issue:",
        contrastResult.recommendation,
      );
    }
  }

  // Touch target optimization
  const touchTargetConfig = TouchTargetHelpers.ensureMinimumTouchTarget({
    minWidth: buttonSize.minHeight,
    minHeight: buttonSize.minHeight,
  });

  // Handle press animations
  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;

    Animated.parallel([
      Animated.timing(pressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, loading, pressAnim, feedbackAnim]);

  const handlePressOut = useCallback(() => {
    if (disabled || loading) return;

    Animated.parallel([
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
      Animated.spring(feedbackAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 8,
      }),
    ]).start();
  }, [disabled, loading, pressAnim, feedbackAnim]);

  const handlePress = useCallback(() => {
    if (disabled || loading || !onPress) return;

    // Haptic feedback for important actions
    if (Platform.OS !== "web" && (variant === "crisis" || emergencyMode)) {
      const { HapticFeedback } = require("expo-haptics");
      HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
    }

    onPress();
  }, [disabled, loading, onPress, variant, emergencyMode]);

  // Button styles
  const buttonStyles = [
    styles.button,
    {
      backgroundColor: gradientColors ? "transparent" : backgroundColor,
      borderColor,
      borderWidth: buttonVariant.background === "transparent" ? 1 : 0,
      borderRadius: buttonSize.borderRadius,
      paddingHorizontal: buttonSize.paddingHorizontal,
      paddingVertical: buttonSize.paddingVertical,
      minHeight: buttonSize.minHeight,
    },
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    touchTargetConfig.style,
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: textColor,
      fontSize: buttonSize.fontSize,
      fontWeight: variant === "crisis" ? "700" : "600",
    },
    textStyle,
  ];

  // Accessibility props
  const accessibilityProps = {
    accessible: true,
    accessibilityRole: "button",
    accessibilityLabel:
      accessibilityLabel ||
      (typeof children === "string" ? children : "Button"),
    accessibilityHint: accessibilityHint || "Double tap to activate",
    accessibilityState: {
      disabled: disabled || loading,
      busy: loading,
    },
    testID,
    ...(touchTargetConfig.hitSlop && { hitSlop: touchTargetConfig.hitSlop }),
    ...props,
  };

  // Button content
  const ButtonContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.loader}
          accessibilityLabel="Loading"
        />
      )}

      {icon && iconPosition === "left" && !loading && (
        <View style={styles.iconLeft}>{icon}</View>
      )}

      {children && (
        <Text style={textStyles} numberOfLines={1}>
          {children}
        </Text>
      )}

      {icon && iconPosition === "right" && !loading && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </>
  );

  // Animated wrapper
  const AnimatedWrapper = ({ children }) => {
    if (!animated) return children;

    const animatedStyle = {
      transform: [{ scale: pressAnim }],
    };

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
  };

  // Emergency/Crisis attention animation
  const EmergencyWrapper = ({ children }) => {
    if (!emergencyMode && variant !== "crisis") return children;

    return (
      <Animated.View
        style={[
          styles.emergencyWrapper,
          { transform: [{ scale: feedbackAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  // Gradient wrapper
  const GradientWrapper = ({ children }) => {
    if (!gradientColors) {
      return <View style={buttonStyles}>{children}</View>;
    }

    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={buttonStyles}
      >
        {children}
      </LinearGradient>
    );
  };

  return (
    <EmergencyWrapper>
      <AnimatedWrapper>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          {...accessibilityProps}
        >
          <GradientWrapper>
            <View style={styles.content}>
              <ButtonContent />
            </View>
          </GradientWrapper>
        </TouchableOpacity>
      </AnimatedWrapper>
    </EmergencyWrapper>
  );
};

// Specialized button variants for mental health contexts
export const PrimaryButton = (props) => (
  <TherapeuticButton variant="primary" {...props} />
);

export const TherapeuticActionButton = (props) => (
  <TherapeuticButton variant="therapeutic" therapeutic {...props} />
);

export const CalmingButton = (props) => (
  <TherapeuticButton variant="calming" therapeutic {...props} />
);

export const CrisisButton = (props) => (
  <TherapeuticButton
    variant="crisis"
    size="xl"
    emergencyMode
    accessibilityLabel="Emergency crisis support"
    accessibilityHint="Double tap for immediate crisis support and emergency resources"
    {...props}
  />
);

export const SuccessButton = (props) => (
  <TherapeuticButton variant="success" {...props} />
);

export const SecondaryButton = (props) => (
  <TherapeuticButton variant="secondary" {...props} />
);

export const GhostButton = (props) => (
  <TherapeuticButton variant="ghost" {...props} />
);

// Button group for organizing multiple actions
export const ButtonGroup = ({
  children,
  orientation = "horizontal",
  spacing: buttonSpacing = "sm",
  style = {},
}) => {
  const spacingValue = spacing[buttonSpacing] || spacing.sm;

  const groupStyles = [
    styles.buttonGroup,
    orientation === "horizontal" ? styles.horizontal : styles.vertical,
    style,
  ];

  const childrenWithSpacing = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const marginStyle =
        orientation === "horizontal"
          ? index > 0
            ? { marginLeft: spacingValue }
            : {}
          : index > 0
            ? { marginTop: spacingValue }
            : {};

      return React.cloneElement(child, {
        style: [child.props.style, marginStyle],
      });
    }
    return child;
  });

  return <View style={groupStyles}>{childrenWithSpacing}</View>;
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    ...Platform.select({
      web: {
        cursor: "pointer",
        userSelect: "none",
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontWeight: "600",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: "not-allowed",
      },
    }),
  },
  loader: {
    marginRight: spacing.xs,
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  emergencyWrapper: {
    // Emergency-specific styling handled by animation component
  },
  buttonGroup: {
    flexDirection: "row",
  },
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
  },
  vertical: {
    flexDirection: "column",
    alignItems: "stretch",
  },
});

export default {
  TherapeuticButton,
  PrimaryButton,
  TherapeuticActionButton,
  CalmingButton,
  CrisisButton,
  SuccessButton,
  SecondaryButton,
  GhostButton,
  ButtonGroup,
};
