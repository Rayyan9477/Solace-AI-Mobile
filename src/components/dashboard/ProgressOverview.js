import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import { MentalHealthIcon } from "../icons";

const ProgressOverview = ({ weeklyStats, userStats }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Default values if no data provided
  const defaultWeeklyStats = weeklyStats || {
    totalEntries: 3,
    averageIntensity: 3.5,
    mostCommonMood: "calm",
  };

  const defaultUserStats = userStats || {
    streakDays: 7,
    totalSessions: 12,
  };

  const getProgressColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return theme.colors.success[500];
    if (percentage >= 60) return theme.colors.warning[500];
    return theme.colors.error[500];
  };

  const StatItem = ({ label, value, unit, color, progress, icon }) => (
    <Animated.View
      style={[
        styles.statItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[color + "20", color + "10"]}
        style={styles.statCard}
      >
        <View style={styles.statHeader}>
          <View style={styles.statLabelContainer}>
            {icon && (
              <View
                style={[styles.statIconContainer, { backgroundColor: color }]}
              >
                <Text style={styles.statIcon}>{icon}</Text>
              </View>
            )}
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              {label}
            </Text>
          </View>
          <View style={[styles.statValue, { backgroundColor: color }]}>
            <Text style={styles.statValueText}>{value}</Text>
            {unit && <Text style={styles.statUnit}>{unit}</Text>}
          </View>
        </View>
        {progress !== undefined && (
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.gray[200] },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                { backgroundColor: color, width: `${progress}%` },
              ]}
            />
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );

  const streakProgress = Math.min(
    (defaultUserStats.streakDays / 30) * 100,
    100,
  );
  const moodProgress = Math.min(
    (defaultWeeklyStats.totalEntries / 7) * 100,
    100,
  );

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
            colorScheme="grounding"
            style={styles.titleIcon}
          />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Weekly Progress
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatItem
            label="Current Streak"
            value={defaultUserStats.streakDays}
            unit="days"
            color={getProgressColor(defaultUserStats.streakDays, 30)}
            progress={streakProgress}
            icon="🔥"
          />

          <StatItem
            label="Mood Entries"
            value={defaultWeeklyStats.totalEntries}
            unit="this week"
            color={getProgressColor(defaultWeeklyStats.totalEntries, 7)}
            progress={moodProgress}
            icon="📝"
          />

          <StatItem
            label="Avg. Mood"
            value={defaultWeeklyStats.averageIntensity.toFixed(1)}
            unit="/5"
            color={getProgressColor(defaultWeeklyStats.averageIntensity, 5)}
            icon="📊"
          />

          <StatItem
            label="Sessions"
            value={defaultUserStats.totalSessions}
            unit="total"
            color={theme.colors.therapeutic.calming[500]}
            icon="💬"
          />
        </View>

        {defaultWeeklyStats.mostCommonMood && (
          <Animated.View
            style={[
              styles.moodSummary,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                borderTopColor: theme.colors.gray[200],
              },
            ]}
          >
            <Text
              style={[
                styles.moodSummaryTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Most Common Mood This Week
            </Text>
            <LinearGradient
              colors={[
                theme.colors.therapeutic.peaceful[400],
                theme.colors.therapeutic.peaceful[600],
              ]}
              style={styles.moodSummaryBadge}
            >
              <Text
                style={[styles.moodSummaryText, { color: colors.text.inverse }]}
              >
                {defaultWeeklyStats.mostCommonMood.charAt(0).toUpperCase() +
                  defaultWeeklyStats.mostCommonMood.slice(1)}{" "}
                😌
              </Text>
            </LinearGradient>
          </Animated.View>
        )}
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
  },
  statCard: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  statHeader: {
    marginBottom: spacing[3],
  },
  statLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  statIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[2],
  },
  statIcon: {
    fontSize: typography.sizes.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.sm,
    flex: 1,
  },
  statValue: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
  },
  statValueText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  statUnit: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    marginLeft: spacing[1],
    opacity: 0.9,
  },
  progressBar: {
    height: 6,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.sm,
  },
  moodSummary: {
    marginTop: spacing[5],
    paddingTop: spacing[5],
    borderTopWidth: 1,
    alignItems: "center",
  },
  moodSummaryTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[3],
  },
  moodSummaryBadge: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  moodSummaryText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
  },
});

export default ProgressOverview;
