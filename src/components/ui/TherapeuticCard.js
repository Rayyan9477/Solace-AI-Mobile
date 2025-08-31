import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import FreudDesignSystem, {
  FreudColors,
  FreudSpacing,
  FreudTypography,
  FreudShadows,
  FreudBorderRadius,
} from "../../shared/theme/FreudDesignSystem";
import { useTheme } from "../../shared/theme/UnifiedThemeProvider";
import { MentalHealthIcon } from "../icons";

/**
 * TherapeuticCard - A reusable card component designed for mental health applications
 *
 * Features:
 * - Consistent therapeutic design language
 * - Accessibility-first approach
 * - Flexible content support
 * - Optional interactive states
 * - Theme-aware styling
 */
const TherapeuticCard = ({
  children,
  title,
  subtitle,
  icon,
  iconColor,
  variant = "default", // 'default', 'elevated', 'outlined', 'gradient'
  gradientColors,
  onPress,
  style,
  contentStyle,
  disabled = false,
  testID,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "text",
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();

  // Determine card background and styling based on variant
  const getCardVariant = () => {
    const baseStyle = {
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(255, 255, 255, 0.95)",
      borderRadius: FreudBorderRadius.xl,
      overflow: "hidden",
    };

    switch (variant) {
      case "elevated":
        return {
          ...baseStyle,
          ...FreudShadows.lg,
          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "#FFFFFF",
        };

      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDarkMode
            ? FreudColors.optimisticGray[70]
            : FreudColors.optimisticGray[20],
          backgroundColor: "transparent",
          ...FreudShadows.xs,
        };

      case "gradient":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          ...FreudShadows.md,
        };

      default:
        return {
          ...baseStyle,
          ...FreudShadows.sm,
        };
    }
  };

  // Determine if the card should be interactive
  const isInteractive = !!onPress && !disabled;

  // Card header component
  const CardHeader = () => {
    if (!title && !icon) return null;

    return (
      <View style={styles.header}>
        {icon && (
          <View
            style={[
              styles.iconContainer,
              iconColor && { backgroundColor: iconColor + "20" },
            ]}
          >
            <MentalHealthIcon
              name={icon}
              size={24}
              color={iconColor || FreudColors.mindfulBrown[70]}
            />
          </View>
        )}
        <View style={styles.headerText}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: isDarkMode
                    ? FreudDesignSystem.themes.dark.colors.text.primary
                    : FreudDesignSystem.themes.light.colors.text.primary,
                },
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: isDarkMode
                    ? FreudDesignSystem.themes.dark.colors.text.secondary
                    : FreudDesignSystem.themes.light.colors.text.secondary,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // Card content wrapper
  const CardContent = ({ children }) => {
    const content = (
      <View style={[styles.container, getCardVariant(), style]} {...props}>
        {variant === "gradient" && gradientColors ? (
          <LinearGradient
            colors={gradientColors}
            style={styles.gradientBackground}
            start={[0, 0]}
            end={[1, 1]}
          >
            <View style={[styles.content, contentStyle]}>
              <CardHeader />
              {children}
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.content, contentStyle]}>
            <CardHeader />
            {children}
          </View>
        )}
      </View>
    );

    return content;
  };

  // Interactive card wrapper
  if (isInteractive) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.95}
        style={[disabled && styles.disabled]}
        testID={testID}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
      >
        <CardContent>{children}</CardContent>
      </TouchableOpacity>
    );
  }

  // Static card
  return (
    <View
      testID={testID}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole={accessibilityRole}
    >
      <CardContent>{children}</CardContent>
    </View>
  );
};

// Specialized therapeutic card variants
export const MindfulCard = (props) => (
  <TherapeuticCard
    variant="gradient"
    gradientColors={[
      FreudColors.serenityGreen[20],
      FreudColors.serenityGreen[10],
    ]}
    iconColor={FreudColors.serenityGreen[60]}
    {...props}
  />
);

export const EmpathyCard = (props) => (
  <TherapeuticCard
    variant="gradient"
    gradientColors={[
      FreudColors.empathyOrange[20],
      FreudColors.empathyOrange[10],
    ]}
    iconColor={FreudColors.empathyOrange[60]}
    {...props}
  />
);

export const CalmingCard = (props) => (
  <TherapeuticCard
    variant="gradient"
    gradientColors={[FreudColors.kindPurple[20], FreudColors.kindPurple[10]]}
    iconColor={FreudColors.kindPurple[60]}
    {...props}
  />
);

export const WisdomCard = (props) => (
  <TherapeuticCard
    variant="gradient"
    gradientColors={[
      FreudColors.mindfulBrown[20],
      FreudColors.mindfulBrown[10],
    ]}
    iconColor={FreudColors.mindfulBrown[70]}
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    marginBottom: FreudSpacing[4],
  },
  gradientBackground: {
    flex: 1,
    borderRadius: FreudBorderRadius.xl,
  },
  content: {
    padding: FreudSpacing[4],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: FreudSpacing[3],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: FreudBorderRadius.xl,
    backgroundColor: FreudColors.optimisticGray[10],
    justifyContent: "center",
    alignItems: "center",
    marginRight: FreudSpacing[3],
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: FreudTypography.sizes.lg,
    fontWeight: FreudTypography.weights.semiBold,
    lineHeight: FreudTypography.sizes.lg * FreudTypography.lineHeights.tight,
    marginBottom: FreudSpacing[1],
  },
  subtitle: {
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.normal,
    lineHeight: FreudTypography.sizes.sm * FreudTypography.lineHeights.relaxed,
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default TherapeuticCard;
