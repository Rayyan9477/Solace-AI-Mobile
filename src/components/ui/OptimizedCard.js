import React, { memo, useMemo } from "react";
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
import { OptimizedGradient, TherapeuticGradients } from "./OptimizedGradients";

/**
 * OptimizedCard - Performance-focused card component
 *
 * Performance Optimizations:
 * - Memoized component to prevent unnecessary re-renders
 * - Optimized gradient usage with pre-built variants
 * - Cached style objects
 * - Efficient conditional rendering
 * - Proper prop destructuring to avoid object creation
 */

// Card header component - memoized separately
const CardHeader = memo(({ title, subtitle, icon, iconColor, isDarkMode }) => {
  if (!title && !icon) return null;

  const styles = useMemo(() => createHeaderStyles(), []);

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
});

CardHeader.displayName = "CardHeader";

// Main OptimizedCard component
const OptimizedCard = memo(
  ({
    children,
    title,
    subtitle,
    icon,
    iconColor,
    variant = "default", // 'default', 'elevated', 'outlined', 'gradient'
    gradientVariant = "subtle", // therapeutic gradient variant
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

    // Memoize card variant styles to prevent recalculation
    const cardVariantStyle = useMemo(() => {
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
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.12)"
              : "#FFFFFF",
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
    }, [variant, isDarkMode]);

    // Determine if the card should be interactive
    const isInteractive = !!onPress && !disabled;

    // Memoize styles object
    const styles = useMemo(() => createCardStyles(), []);

    // Card content component
    const CardContent = useMemo(() => {
      const content = (
        <View style={[styles.container, cardVariantStyle, style]} {...props}>
          {variant === "gradient" ? (
            <OptimizedGradient
              variant={gradientVariant}
              style={styles.gradientBackground}
            >
              <View style={[styles.content, contentStyle]}>
                <CardHeader
                  title={title}
                  subtitle={subtitle}
                  icon={icon}
                  iconColor={iconColor}
                  isDarkMode={isDarkMode}
                />
                {children}
              </View>
            </OptimizedGradient>
          ) : (
            <View style={[styles.content, contentStyle]}>
              <CardHeader
                title={title}
                subtitle={subtitle}
                icon={icon}
                iconColor={iconColor}
                isDarkMode={isDarkMode}
              />
              {children}
            </View>
          )}
        </View>
      );

      return content;
    }, [
      variant,
      gradientVariant,
      title,
      subtitle,
      icon,
      iconColor,
      isDarkMode,
      children,
      cardVariantStyle,
      style,
      contentStyle,
      styles,
      props,
    ]);

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
          {CardContent}
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
        {CardContent}
      </View>
    );
  },
);

OptimizedCard.displayName = "OptimizedCard";

// Optimized specialized therapeutic card variants
export const OptimizedMindfulCard = memo((props) => (
  <OptimizedCard
    variant="gradient"
    gradientVariant="serenity"
    iconColor={FreudColors.serenityGreen[60]}
    {...props}
  />
));

export const OptimizedEmpathyCard = memo((props) => (
  <OptimizedCard
    variant="gradient"
    gradientVariant="empathy"
    iconColor={FreudColors.empathyOrange[60]}
    {...props}
  />
));

export const OptimizedCalmingCard = memo((props) => (
  <OptimizedCard
    variant="gradient"
    gradientVariant="calming"
    iconColor={FreudColors.kindPurple[60]}
    {...props}
  />
));

export const OptimizedWisdomCard = memo((props) => (
  <OptimizedCard
    variant="gradient"
    gradientVariant="wisdom"
    iconColor={FreudColors.mindfulBrown[70]}
    {...props}
  />
));

export const OptimizedEnergizingCard = memo((props) => (
  <OptimizedCard
    variant="gradient"
    gradientVariant="energizing"
    iconColor={FreudColors.zenYellow[60]}
    {...props}
  />
));

// Set display names for debugging
OptimizedMindfulCard.displayName = "OptimizedMindfulCard";
OptimizedEmpathyCard.displayName = "OptimizedEmpathyCard";
OptimizedCalmingCard.displayName = "OptimizedCalmingCard";
OptimizedWisdomCard.displayName = "OptimizedWisdomCard";
OptimizedEnergizingCard.displayName = "OptimizedEnergizingCard";

// Create cached styles to avoid recreation
const createCardStyles = () =>
  StyleSheet.create({
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
    disabled: {
      opacity: 0.6,
    },
  });

const createHeaderStyles = () =>
  StyleSheet.create({
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
      lineHeight:
        FreudTypography.sizes.sm * FreudTypography.lineHeights.relaxed,
      opacity: 0.8,
    },
  });

export default OptimizedCard;
