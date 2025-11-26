import { logger } from "@shared/utils/logger";

/**
 * Mental Health Card Component
 * Enhanced shadcn UI-inspired card component for therapeutic interfaces
 * Combines accessibility, mental health design patterns, and modern UI
 */

import { validateThemeAccessibility } from "@shared/utils/accessibility";
import { useTheme } from "@theme/ThemeProvider";
import { lightTheme as themeTokens } from "@theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import PropTypes from "prop-types";
import React from "react";
import { View, Text, StyleSheet, Platform, Animated } from "react-native";

const { spacing, borderRadius, shadows, typography } = themeTokens;

// Card variant configurations for different therapeutic contexts
// Note: Uses logical color paths that may not exist in all theme shapes;
// color resolution below handles fallbacks safely.
const CARD_VARIANTS = {
  default: {
    backgroundColor: "background.primary",
    borderColor: "gray.200",
    shadow: shadows.sm,
  },
  elevated: {
    backgroundColor: "background.primary",
    borderColor: "gray.100",
    shadow: shadows.md,
  },
  // Legacy/compat variants used by older tests and components
  outlined: {
    backgroundColor: "background.primary",
    borderColor: "gray.200",
    shadow: shadows.xs,
  },
  flat: {
    backgroundColor: "background.primary",
    borderColor: "gray.100",
    shadow: {},
  },
  filled: {
    backgroundColor: "therapeutic.nurturing.50",
    borderColor: "therapeutic.nurturing.200",
    shadow: shadows.sm,
  },
  mood: {
    backgroundColor: "therapeutic.calming.50",
    borderColor: "therapeutic.calming.200",
    shadow: shadows.sm,
    gradientColors: ["therapeutic.calming.50", "therapeutic.calming.100"],
  },
  crisis: {
    backgroundColor: "error.50",
    borderColor: "error.200",
    shadow: shadows.lg,
    gradientColors: ["error.50", "error.100"],
  },
  therapeutic: {
    backgroundColor: "therapeutic.nurturing.50",
    borderColor: "therapeutic.nurturing.200",
    shadow: shadows.md,
    gradientColors: ["therapeutic.nurturing.50", "therapeutic.nurturing.100"],
  },
  success: {
    backgroundColor: "success.50",
    borderColor: "success.200",
    shadow: shadows.sm,
    gradientColors: ["success.50", "success.100"],
  },
  insight: {
    backgroundColor: "therapeutic.peaceful.50",
    borderColor: "therapeutic.peaceful.200",
    shadow: shadows.sm,
    gradientColors: ["therapeutic.peaceful.50", "therapeutic.peaceful.100"],
  },
};

// Size configurations
const CARD_SIZES = {
  sm: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  md: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  lg: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  xl: {
    padding: spacing.xl,
    borderRadius: borderRadius["2xl"],
  },
};

export const MentalHealthCard = ({
  children,
  variant = "default",
  size = "md",
  title,
  subtitle,
  icon,
  actionButton,
  style = {},
  animated = true,
  animationDelay = 0,
  testID,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  disabled = false,
  loading = false,
  padding,
  borderRadius: borderRadiusOverride,
  ...props
}) => {
  const { theme } = useTheme();
  const cardVariant = CARD_VARIANTS[variant] || CARD_VARIANTS.default;
  const cardSize = CARD_SIZES[size];

  // Fallback palette for compatibility with minimal theme mocks in tests
  const fallbackPalette = {
    background: { primary: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#6B7280" },
    gray: { 50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB" },
    error: { 50: "#FEF2F2", 100: "#FEE2E2", 200: "#FECACA" },
    success: { 50: "#F0FDF4", 100: "#DCFCE7", 200: "#BBF7D0" },
  };

  const resolvePath = (obj, path) => {
    if (!obj) return undefined;
    return path
      .split(".")
      .reduce((acc, seg) => (acc ? acc[seg] : undefined), obj);
  };

  // Get theme colors for the variant with robust fallbacks
  const getThemeColor = (colorPath) => {
    if (!colorPath) return undefined;
    // 1) Try current theme
    const fromTheme = resolvePath(theme?.colors || {}, colorPath);
    if (fromTheme) return fromTheme;
    // 2) Try enhanced theme tokens
    const fromTokens = resolvePath(themeTokens?.colors || {}, colorPath);
    if (fromTokens) return fromTokens;
    // 3) Try fallback palette
    const fromFallback = resolvePath(fallbackPalette, colorPath);
    if (fromFallback) return fromFallback;
    // 4) If it looks like a hex/rgb, return as-is
    return typeof colorPath === "string" ? colorPath : undefined;
  };

  const backgroundColor = getThemeColor(cardVariant.backgroundColor);
  const borderColor = getThemeColor(cardVariant.borderColor);

  // Gradient colors if available
  const gradientColors = cardVariant.gradientColors
    ? cardVariant.gradientColors.map(getThemeColor)
    : null;

  // Accessibility validation for crisis cards
  if (variant === "crisis" && __DEV__) {
    const contrastResult = validateThemeAccessibility(theme);
    if (contrastResult.issues.length > 0) {
      logger.warn(
        "Crisis card may have accessibility issues:",
        contrastResult.issues,
      );
    }
  }

  const cardStyles = [
    styles.card,
    {
      backgroundColor: gradientColors ? "transparent" : backgroundColor,
      borderColor,
      borderWidth: 1,
      borderRadius: borderRadiusOverride ?? cardSize.borderRadius,
      padding: typeof padding === "number" ? padding : cardSize.padding,
      ...cardVariant.shadow,
    },
    disabled && styles.disabled,
    style,
  ];

  const accessibilityProps = {
    accessible: true,
    accessibilityRole: onPress ? "button" : "group",
    accessibilityLabel: accessibilityLabel || title || "Mental health card",
    accessibilityHint:
      accessibilityHint || (onPress ? "Double tap to interact" : undefined),
    accessibilityState: { disabled: disabled || loading, busy: !!loading },
    testID,
    ...props,
  };
  const BaseWrapper = View;
  const handlePress = React.useCallback(() => {
    if (disabled || loading) return;
    if (typeof onPress === "function") onPress();
  }, [disabled, loading, onPress]);
  const CardContent = () => (
    <View style={styles.cardContent}>
      {/* Header section */}
      {(title || subtitle || icon) && (
        <View style={styles.header}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <View style={styles.headerText}>
            {title && (
              <Text
                style={[
                  styles.title,
                  { color: getThemeColor("text.primary") },
                  variant === "crisis" && styles.crisisTitle,
                ]}
                accessibilityRole="header"
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: getThemeColor("text.secondary") },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Main content */}
      {children && <View style={styles.content}>{children}</View>}

      {/* Action button */}
      {actionButton && (
        <View style={styles.actionContainer}>{actionButton}</View>
      )}
    </View>
  );

  const CardWrapper = ({ children }) => {
    if (gradientColors) {
      return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cardStyles}
        >
          {children}
        </LinearGradient>
      );
    }

    return <View style={cardStyles}>{children}</View>;
  };

  if (animated) {
    return (
      <Animated.View style={styles.animatedContainer}>
        <CardWrapper>
          <BaseWrapper
            {...accessibilityProps}
            onPress={onPress ? handlePress : undefined}
          >
            <CardContent />
          </BaseWrapper>
        </CardWrapper>
      </Animated.View>
    );
  }

  return (
    <CardWrapper>
      <BaseWrapper
        {...accessibilityProps}
        onPress={onPress ? handlePress : undefined}
      >
        <CardContent />
      </BaseWrapper>
    </CardWrapper>
  );
};

// Specialized card variants for mental health contexts
export const MoodCard = (props) => (
  <MentalHealthCard variant="mood" {...props} />
);

export const CrisisCard = (props) => (
  <MentalHealthCard
    variant="crisis"
    accessibilityLabel="Emergency support card"
    accessibilityHint="Crisis support information and emergency actions"
    {...props}
  />
);

export const TherapeuticCard = (props) => (
  <MentalHealthCard variant="therapeutic" {...props} />
);

export const SuccessCard = (props) => (
  <MentalHealthCard variant="success" {...props} />
);

export const InsightCard = (props) => (
  <MentalHealthCard
    variant="insight"
    accessibilityLabel="Daily insight card"
    accessibilityHint="Personal wellness insight and recommendation"
    {...props}
  />
);

// Card group for organizing multiple cards
export const CardGroup = ({
  children,
  spacing: cardSpacing = "md",
  style = {},
  animated = true,
  staggerDelay = 100,
}) => {
  const spacingValue = spacing[cardSpacing] || spacing.md;

  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        animated,
        animationDelay: animated ? index * staggerDelay : 0,
        style: [child.props.style, index > 0 && { marginTop: spacingValue }],
      });
    }
    return child;
  });

  return <View style={[styles.cardGroup, style]}>{childrenWithProps}</View>;
};

// Progress card for mood tracking
export const ProgressCard = ({
  title,
  progress = 0,
  maxValue = 100,
  color = "therapeutic.nurturing.500",
  ...props
}) => {
  const { theme } = useTheme();

  // Get theme color helper (robust)
  const resolvePath = (obj, path) => {
    if (!obj) return undefined;
    return path
      .split(".")
      .reduce((acc, seg) => (acc ? acc[seg] : undefined), obj);
  };
  const getThemeColor = (colorPath) => {
    const fromTheme = resolvePath(theme?.colors || {}, colorPath);
    if (fromTheme) return fromTheme;
    const fromTokens = resolvePath(themeTokens?.colors || {}, colorPath);
    if (fromTokens) return fromTokens;
    // fallback to a safe green
    return "#22c55e";
  };

  const progressColor = getThemeColor(color);

  return (
    <MentalHealthCard
      variant="therapeutic"
      title={title}
      accessibilityLabel={`Progress: ${title}, ${progress} out of ${maxValue}`}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: maxValue,
        now: progress,
      }}
      {...props}
    >
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: getThemeColor("gray.200") },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: progressColor,
                width: `${(progress / maxValue) * 100}%`,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.progressText,
            { color: getThemeColor("text.secondary") },
          ]}
        >
          {progress} / {maxValue}
        </Text>
      </View>
    </MentalHealthCard>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    width: "100%",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  disabled: {
    opacity: 0.6,
  },
  cardContent: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  crisisTitle: {
    fontWeight: "700",
    color: "#DC2626", // High contrast for crisis situations
  },
  subtitle: {
    ...typography.body2,
    opacity: 0.8,
  },
  content: {
    marginBottom: spacing.sm,
  },
  actionContainer: {
    alignItems: "flex-end",
    marginTop: spacing.sm,
  },
  cardGroup: {
    width: "100%",
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    ...typography.caption,
    textAlign: "right",
  },
});

MentalHealthCard.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  actionButton: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  animated: PropTypes.bool,
  animationDelay: PropTypes.number,
  testID: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  padding: PropTypes.number,
  borderRadius: PropTypes.number,
};

CardGroup.propTypes = {
  children: PropTypes.node,
  spacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  animated: PropTypes.bool,
  staggerDelay: PropTypes.number,
};

ProgressCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  progress: PropTypes.number,
  maxValue: PropTypes.number,
  color: PropTypes.string,
};

export default {
  MentalHealthCard,
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard,
};
