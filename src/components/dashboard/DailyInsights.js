import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect, memo } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import { MentalHealthIcon } from "../icons";

const DailyInsights = ({ insights }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Generate sample insights if none provided
  const sampleInsights = [
    {
      id: 1,
      type: "positive",
      icon: "🌟",
      title: "Great Progress!",
      message: "You've been consistent with your mood tracking this week.",
    },
    {
      id: 2,
      type: "suggestion",
      icon: "🧘",
      title: "Try Meditation",
      message: "Consider a 5-minute mindfulness session today.",
    },
    {
      id: 3,
      type: "insight",
      icon: "📈",
      title: "Mood Pattern",
      message: "Your mood tends to improve in the afternoon.",
    },
  ];

  const displayInsights =
    insights && insights.length > 0 ? insights : sampleInsights;

  if (!displayInsights || displayInsights.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Daily Insights
        </Text>
        <Text
          style={[styles.noInsights, { color: theme.colors.text.secondary }]}
        >
          Check back later for personalized insights based on your mood
          patterns.
        </Text>
      </View>
    );
  }

  const getInsightColors = (type) => {
    switch (type) {
      case "positive":
        return {
          background: theme.colors.success[50],
          border: theme.colors.success[200],
          text: theme.colors.success[800],
        };
      case "suggestion":
        return {
          background: theme.colors.warning[50],
          border: theme.colors.warning[200],
          text: theme.colors.warning[800],
        };
      case "alert":
        return {
          background: theme.colors.error[50],
          border: theme.colors.error[200],
          text: theme.colors.error[800],
        };
      default:
        return {
          background: theme.colors.primary[50],
          border: theme.colors.primary[200],
          text: theme.colors.primary[800],
        };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[
          theme.colors.background.primary,
          theme.colors.background.secondary,
        ]}
        style={[styles.cardBackground, shadows.lg]}
      >
        <View style={styles.titleContainer}>
          <MentalHealthIcon
            name="Insights"
            size="sm"
            colorScheme="energizing"
            style={styles.titleIcon}
          />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Daily Insights
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.insightsContainer}
          accessible
          accessibilityRole="scrollbar"
          accessibilityLabel="Daily insights carousel"
        >
          {displayInsights.map((insight, index) => {
            const insightColors = getInsightColors(insight.type);

            return (
              <Animated.View
                key={insight.id || index}
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + index * 5],
                      }),
                    },
                  ],
                }}
              >
                <LinearGradient
                  colors={[
                    insightColors.background,
                    insightColors.background + "80",
                  ]}
                  style={[
                    styles.insightCard,
                    {
                      borderColor: insightColors.border,
                    },
                  ]}
                >
                  <View style={styles.insightIconContainer}>
                    <Text style={styles.insightIcon}>{insight.icon}</Text>
                  </View>
                  <Text
                    style={[styles.insightTitle, { color: insightColors.text }]}
                  >
                    {insight.title}
                  </Text>
                  <Text
                    style={[
                      styles.insightMessage,
                      { color: insightColors.text },
                    ]}
                  >
                    {insight.message}
                  </Text>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
  },
  cardBackground: {
    padding: spacing[5],
    borderRadius: borderRadius.xl,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[4],
  },
  titleIcon: {
    marginRight: spacing[2],
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
  },
  noInsights: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    textAlign: "center",
    fontStyle: "italic",
  },
  insightsContainer: {
    paddingRight: spacing[4],
  },
  insightCard: {
    width: 220,
    padding: spacing[5],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginRight: spacing[4],
    ...shadows.md,
  },
  insightIconContainer: {
    alignItems: "center",
    marginBottom: spacing[3],
  },
  insightIcon: {
    fontSize: typography.sizes["3xl"],
  },
  insightTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  insightMessage: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    textAlign: "center",
    opacity: 0.9,
  },
});

export default memo(DailyInsights);
