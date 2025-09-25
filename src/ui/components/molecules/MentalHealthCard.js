/**
 * Mental Health Card Component
 * Enhanced shadcn UI-inspired card component for therapeutic interfaces
 * Combines accessibility, mental health design patterns, and modern UI
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, Platform, Animated } from "react-native";

import { useTheme } from "../../../core/utils/shared/theme/ThemeContext";
import {
  spacing,
  borderRadius,
  shadows,
  typography,
} from "../../../core/utils/shared/theme/theme";
import { validateThemeAccessibility } from "../../../core/utils/colorContrast";

// Card variant configurations for different therapeutic contexts
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
  ...props
}) => {
  const { theme } = useTheme();
  const cardVariant = CARD_VARIANTS[variant];
  const cardSize = CARD_SIZES[size];

  // Get theme colors for the variant
  const getThemeColor = (colorPath) => {
    const path = colorPath.split(".");
    let color = theme.colors;
    for (const segment of path) {
      color = color[segment];
    }
    return color;
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
      console.warn(
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
      borderRadius: cardSize.borderRadius,
      padding: cardSize.padding,
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
    accessibilityState: { disabled },
    testID,
    ...props,
  };

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
                  { color: theme.colors.text.primary },
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
                  { color: theme.colors.text.secondary },
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
          <View {...accessibilityProps}>
            <CardContent />
          </View>
        </CardWrapper>
      </Animated.View>
    );
  }

  return (
    <CardWrapper>
      <View {...accessibilityProps}>
        <CardContent />
      </View>
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

  // Get theme color helper
  const getThemeColor = (colorPath) => {
    const path = colorPath.split(".");
    let color = theme.colors;
    for (const segment of path) {
      color = color[segment];
    }
    return color || theme.colors.primary[500];
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
            { backgroundColor: theme.colors.gray[200] },
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
          style={[styles.progressText, { color: theme.colors.text.secondary }]}
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
