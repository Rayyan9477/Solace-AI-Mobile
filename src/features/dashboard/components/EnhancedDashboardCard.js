/**
 * Enhanced Dashboard Card Component
 * Features therapeutic gradients, Anime.js micro-interactions, and Material Design
 * Matches Freud UI Kit dashboard design with rounded cards and soft shadows
 */

import anime from "animejs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Card, Surface, IconButton } from "react-native-paper";

import { TherapeuticButton } from "./TherapeuticButton";
import { Typography } from "../../design-system/components";
import { therapeuticColors } from "../../design-system/theme/MaterialTheme";
import { PageShaderBackground } from "./PageShaderBackground";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} from "../../shared/theme/theme";

const { width: screenWidth } = Dimensions.get("window");

/**
 * Dashboard Card Configurations with Freud UI Kit theming
 */
const CardConfigs = {
  // Mental Health Dashboard Cards
  moodTracker: {
    title: "Mood Tracker",
    description: "Track your emotional wellbeing",
    icon: "🎭",
    therapeutic: "kind",
    colors: FreudColors.kind,
    gradient: FreudColors.kind.gradient,
    microInteraction: "pulse",
    chartType: "mood",
  },
  journalEntry: {
    title: "Journal Entry",
    description: "Express your thoughts and feelings",
    icon: "📝",
    therapeutic: "empathy",
    colors: FreudColors.empathy,
    gradient: FreudColors.empathy.gradient,
    microInteraction: "shimmer",
    chartType: "progress",
  },
  meditation: {
    title: "Meditation",
    description: "Find inner peace and calm",
    icon: "🧘‍♀️",
    therapeutic: "serenity",
    colors: FreudColors.serenity,
    gradient: FreudColors.serenity.gradient,
    microInteraction: "breathe",
    chartType: "radial",
  },
  insights: {
    title: "AI Insights",
    description: "Personalized mental health guidance",
    icon: "🧠",
    therapeutic: "zen",
    colors: FreudColors.zen,
    gradient: FreudColors.zen.gradient,
    microInteraction: "glow",
    chartType: "insights",
  },
  progress: {
    title: "Progress",
    description: "Your wellness journey overview",
    icon: "📊",
    therapeutic: "optimistic",
    colors: FreudColors.optimistic,
    gradient: FreudColors.optimistic.gradient,
    microInteraction: "grow",
    chartType: "line",
  },
  sessions: {
    title: "Therapy Sessions",
    description: "Schedule and manage sessions",
    icon: "💬",
    therapeutic: "mindful",
    colors: FreudColors.mindful,
    gradient: FreudColors.mindful.gradient,
    microInteraction: "float",
    chartType: "calendar",
  },
  emergency: {
    title: "Crisis Support",
    description: "24/7 emergency assistance",
    icon: "🆘",
    therapeutic: "empathy",
    colors: ["#FF6B6B", "#FF8E8E", "#FFB3B3"], // Emergency red gradient
    gradient: ["#FF6B6B", "#FF8E8E", "#FFB3B3"],
    microInteraction: "urgent",
    chartType: "emergency",
  },
  community: {
    title: "Community",
    description: "Connect with support groups",
    icon: "👥",
    therapeutic: "nurturing",
    colors: FreudColors.serenity,
    gradient: FreudColors.serenity.gradient,
    microInteraction: "connect",
    chartType: "social",
  },
};

/**
 * Anime.js Micro-interaction Configurations
 */
const MicroInteractions = {
  pulse: {
    scale: [1, 1.02, 1],
    duration: 2000,
    easing: "easeInOutSine",
    loop: true,
  },
  shimmer: {
    translateX: [-100, 100],
    opacity: [0.3, 0.7, 0.3],
    duration: 3000,
    easing: "easeInOutQuart",
    loop: true,
  },
  breathe: {
    scale: [1, 1.01, 1],
    opacity: [0.8, 1, 0.8],
    duration: 4000,
    easing: "easeInOutCirc",
    loop: true,
  },
  glow: {
    opacity: [0.6, 1, 0.6],
    duration: 2500,
    easing: "easeInOutQuad",
    loop: true,
  },
  grow: {
    scaleY: [0.95, 1.05, 0.95],
    duration: 3000,
    easing: "easeInOutBack",
    loop: true,
  },
  float: {
    translateY: [-2, 2, -2],
    duration: 4000,
    easing: "easeInOutSine",
    loop: true,
  },
  urgent: {
    scale: [1, 1.05, 1],
    duration: 1000,
    easing: "easeInOutQuart",
    loop: true,
  },
  connect: {
    rotate: [0, 2, -2, 0],
    duration: 5000,
    easing: "easeInOutSine",
    loop: true,
  },
};

/**
 * Enhanced Dashboard Card with micro-interactions
 */
export const EnhancedDashboardCard = ({
  type = "moodTracker",
  customConfig = null,
  value = null,
  progress = 0,
  onPress,
  onLongPress,
  size = "medium",
  variant = "gradient",
  animated = true,
  interactive = true,
  showProgress = false,
  showValue = false,
  showIcon = true,
  style = {},
  ...props
}) => {
  const config = customConfig || CardConfigs[type] || CardConfigs.moodTracker;
  const microInteractionRef = useRef(null);
  const pressAnimationRef = useRef(new Animated.Value(1)).current;
  const shimmerRef = useRef(null);

  // Card sizes
  const sizes = {
    small: {
      width: (screenWidth - spacing[6]) / 3,
      height: 120,
      padding: spacing[3],
      iconSize: 24,
      titleSize: typography.sizes.sm,
      descriptionSize: typography.sizes.xs,
    },
    medium: {
      width: (screenWidth - spacing[8]) / 2,
      height: 160,
      padding: spacing[4],
      iconSize: 32,
      titleSize: typography.sizes.base,
      descriptionSize: typography.sizes.sm,
    },
    large: {
      width: screenWidth - spacing[8],
      height: 200,
      padding: spacing[5],
      iconSize: 40,
      titleSize: typography.sizes.lg,
      descriptionSize: typography.sizes.base,
    },
    full: {
      width: screenWidth - spacing[8],
      height: 240,
      padding: spacing[6],
      iconSize: 48,
      titleSize: typography.sizes.xl,
      descriptionSize: typography.sizes.lg,
    },
  };

  const sizeConfig = sizes[size];

  // Initialize micro-interactions with Anime.js
  useEffect(() => {
    if (!animated || !microInteractionRef.current) return;

    const microConfig = MicroInteractions[config.microInteraction];
    if (!microConfig) return;

    // Create anime.js animation
    const animation = anime({
      targets: microInteractionRef.current,
      ...microConfig,
    });

    return () => {
      animation.pause();
    };
  }, [animated, config.microInteraction]);

  // Shimmer effect for certain card types
  useEffect(() => {
    if (
      !animated ||
      config.microInteraction !== "shimmer" ||
      !shimmerRef.current
    )
      return;

    const shimmerAnimation = anime({
      targets: shimmerRef.current,
      translateX: [-200, screenWidth],
      opacity: [0, 0.7, 0],
      duration: 3000,
      easing: "easeInOutQuart",
      loop: true,
      delay: 1000,
    });

    return () => {
      shimmerAnimation.pause();
    };
  }, [animated, config.microInteraction]);

  // Press animations
  const handlePressIn = () => {
    if (!interactive) return;

    Animated.spring(pressAnimationRef, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    // Add haptic feedback for important actions
    if (type === "emergency") {
      // Would add haptic feedback here in real implementation
    }
  };

  const handlePressOut = () => {
    if (!interactive) return;

    Animated.spring(pressAnimationRef, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    if (!showProgress) return null;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={[config.colors.light, config.colors.medium]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <TherapeuticText variant="caption" style={styles.progressText}>
          {Math.round(progress)}%
        </TherapeuticText>
      </View>
    );
  };

  // Value display component
  const ValueDisplay = () => {
    if (!showValue || value === null) return null;

    return (
      <View style={styles.valueContainer}>
        <TherapeuticText
          variant="headline"
          weight="bold"
          style={[styles.value, { color: config.colors.dark }]}
        >
          {value}
        </TherapeuticText>
      </View>
    );
  };

  // Chart preview component (placeholder for actual charts)
  const ChartPreview = () => {
    const chartStyles = {
      mood: styles.moodChart,
      progress: styles.progressChart,
      radial: styles.radialChart,
      insights: styles.insightsChart,
      line: styles.lineChart,
      calendar: styles.calendarChart,
      emergency: styles.emergencyChart,
      social: styles.socialChart,
    };

    return (
      <View style={[styles.chartContainer, chartStyles[config.chartType]]}>
        {/* This would contain actual chart components in real implementation */}
        <View style={styles.chartPlaceholder} />
      </View>
    );
  };

  // Card content
  const CardContent = () => (
    <View style={styles.cardContent}>
      {/* Header section */}
      <View style={styles.header}>
        {showIcon && (
          <View style={styles.iconContainer}>
            <Text style={[styles.icon, { fontSize: sizeConfig.iconSize }]}>
              {config.icon}
            </Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <TherapeuticText
            variant="title"
            weight="semiBold"
            style={[
              styles.title,
              {
                color: config.colors.dark,
                fontSize: sizeConfig.titleSize,
              },
            ]}
          >
            {config.title}
          </TherapeuticText>
          <TherapeuticText
            variant="caption"
            style={[
              styles.description,
              {
                color: config.colors.dark,
                fontSize: sizeConfig.descriptionSize,
                opacity: 0.8,
              },
            ]}
          >
            {config.description}
          </TherapeuticText>
        </View>
      </View>

      {/* Content section */}
      <View style={styles.content}>
        <ValueDisplay />
        <ChartPreview />
        <ProgressIndicator />
      </View>

      {/* Shimmer overlay for shimmer effect */}
      {config.microInteraction === "shimmer" && (
        <View
          ref={shimmerRef}
          style={[
            styles.shimmerOverlay,
            {
              background: `linear-gradient(90deg, transparent, ${config.colors.light}40, transparent)`,
            },
          ]}
        />
      )}
    </View>
  );

  const cardStyle = [
    styles.card,
    {
      width: sizeConfig.width,
      height: sizeConfig.height,
      padding: sizeConfig.padding,
    },
    style,
  ];

  // Gradient variant (default)
  if (variant === "gradient") {
    return (
      <Animated.View
        ref={microInteractionRef}
        style={[
          cardStyle,
          {
            transform: [{ scale: pressAnimationRef }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!interactive}
          activeOpacity={0.9}
          {...props}
        >
          <LinearGradient
            colors={config.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          >
            <CardContent />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Shader variant with animated background
  if (variant === "shader") {
    return (
      <Animated.View
        ref={microInteractionRef}
        style={[
          cardStyle,
          {
            transform: [{ scale: pressAnimationRef }],
          },
        ]}
      >
        <PageShaderBackground
          shader="therapeutic"
          variant={config.therapeutic}
          intensity={0.6}
          style={styles.shaderBackground}
        >
          <TouchableOpacity
            style={styles.touchable}
            onPress={onPress}
            onLongPress={onLongPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!interactive}
            activeOpacity={0.9}
            {...props}
          >
            <CardContent />
          </TouchableOpacity>
        </PageShaderBackground>
      </Animated.View>
    );
  }

  // Material variant with Paper components
  if (variant === "material") {
    return (
      <Animated.View
        ref={microInteractionRef}
        style={[
          cardStyle,
          {
            transform: [{ scale: pressAnimationRef }],
          },
        ]}
      >
        <Card
          style={styles.materialCard}
          elevation={4}
          onPress={onPress}
          onLongPress={onLongPress}
          disabled={!interactive}
        >
          <Card.Content>
            <CardContent />
          </Card.Content>
        </Card>
      </Animated.View>
    );
  }

  // Surface variant with subtle elevation
  return (
    <Animated.View
      ref={microInteractionRef}
      style={[
        cardStyle,
        {
          transform: [{ scale: pressAnimationRef }],
        },
      ]}
    >
      <Surface
        style={[styles.surfaceCard, { backgroundColor: config.colors.light }]}
        elevation={2}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!interactive}
          activeOpacity={0.9}
          {...props}
        >
          <CardContent />
        </TouchableOpacity>
      </Surface>
    </Animated.View>
  );
};

/**
 * Dashboard Card Grid Component
 */
export const DashboardCardGrid = ({
  cards = ["moodTracker", "journalEntry", "meditation", "insights"],
  cardData = {},
  onCardPress,
  onCardLongPress,
  columns = 2,
  cardSize = "medium",
  variant = "gradient",
  animated = true,
  style = {},
  ...props
}) => {
  return (
    <View style={[styles.grid, style]} {...props}>
      {cards.map((cardType, index) => (
        <View key={cardType} style={styles.gridItem}>
          <EnhancedDashboardCard
            type={cardType}
            onPress={() => onCardPress?.(cardType, index)}
            onLongPress={() => onCardLongPress?.(cardType, index)}
            size={cardSize}
            variant={variant}
            animated={animated}
            {...(cardData[cardType] || {})}
          />
        </View>
      ))}
    </View>
  );
};

/**
 * Quick Action Dashboard Cards
 */
export const QuickActionCards = ({
  actions = ["moodTracker", "emergency", "meditation"],
  onActionPress,
  style = {},
  ...props
}) => {
  return (
    <View style={[styles.quickActions, style]} {...props}>
      {actions.map((actionType) => (
        <EnhancedDashboardCard
          key={actionType}
          type={actionType}
          size="small"
          variant="gradient"
          onPress={() => onActionPress?.(actionType)}
          showIcon
          animated
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.md,
    backgroundColor: "transparent",
  },
  touchable: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradientBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  shaderBackground: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  materialCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
  },
  surfaceCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing[2],
  },
  iconContainer: {
    marginRight: spacing[2],
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: spacing[1],
  },
  description: {
    lineHeight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  valueContainer: {
    alignItems: "center",
    marginVertical: spacing[1],
  },
  value: {
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: spacing[2],
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    marginTop: spacing[1],
    fontSize: 10,
    opacity: 0.8,
  },
  chartContainer: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing[1],
  },
  chartPlaceholder: {
    width: "80%",
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: borderRadius.sm,
  },
  moodChart: {
    // Specific styling for mood charts
  },
  progressChart: {
    // Specific styling for progress charts
  },
  radialChart: {
    // Specific styling for radial charts
  },
  insightsChart: {
    // Specific styling for insights charts
  },
  lineChart: {
    // Specific styling for line charts
  },
  calendarChart: {
    // Specific styling for calendar charts
  },
  emergencyChart: {
    // Specific styling for emergency charts
  },
  socialChart: {
    // Specific styling for social charts
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: -100,
    width: 100,
    height: "100%",
    opacity: 0.3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: spacing[2],
  },
  gridItem: {
    marginBottom: spacing[4],
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: spacing[4],
  },
});

export default {
  EnhancedDashboardCard,
  DashboardCardGrid,
  QuickActionCards,
  CardConfigs,
  MicroInteractions,
};
