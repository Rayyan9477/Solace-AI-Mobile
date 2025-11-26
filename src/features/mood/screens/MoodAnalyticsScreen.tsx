import { logger } from "@shared/utils/logger";

/**
 * Mood Analytics Screen - AI-Generated Mood Insights
 * Based on ui-designs/Dark-mode/🔒 Mood Tracker.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { moodStorageService } from "../services/moodStorageService";
import type { MoodEntry as StoredMoodEntry } from "../services/moodStorageService";

interface InsightCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "positive" | "neutral" | "warning";
}

interface Pattern {
  id: string;
  pattern: string;
  frequency: string;
  impact: "positive" | "negative" | "neutral";
}

export const MoodAnalyticsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");
  const [isLoading, setIsLoading] = useState(true);
  const [moodData, setMoodData] = useState<StoredMoodEntry[]>([]);

  // Load mood data based on selected period
  useEffect(() => {
    loadMoodData();
  }, [selectedPeriod]);

  const loadMoodData = async () => {
    setIsLoading(true);
    try {
      const days =
        selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 30 : 365;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const moods = await moodStorageService.getMoodEntriesByDateRange(
        startDate,
        new Date()
      );

      setMoodData(moods);
    } catch (error) {
      logger.error("Failed to load mood analytics:", error);
      setMoodData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate activity patterns from mood data
  const patterns: Pattern[] = useMemo(() => {
    if (moodData.length === 0) return [];

    const activityMap = new Map<string, number>();

    // Count activities
    moodData.forEach((entry) => {
      if (entry.activities && Array.isArray(entry.activities)) {
        entry.activities.forEach((activity: string) => {
          activityMap.set(activity, (activityMap.get(activity) || 0) + 1);
        });
      }
    });

    // Define positive/negative activities
    const positiveActivities = [
      "Exercise",
      "Social Time",
      "Sleep",
      "Meditation",
      "Reading",
      "Hobby",
      "Family Time",
      "Relaxation",
      "Therapy",
    ];
    const negativeActivities = [
      "Work Stress",
      "Conflict",
      "Isolation",
      "Late Work",
    ];

    const periodText =
      selectedPeriod === "week"
        ? "this week"
        : selectedPeriod === "month"
          ? "this month"
          : "this year";

    return Array.from(activityMap.entries())
      .map(([name, count]) => ({
        id: name,
        pattern: name,
        frequency: `${count}x ${periodText}`,
        impact: positiveActivities.includes(name)
          ? ("positive" as const)
          : negativeActivities.includes(name)
            ? ("negative" as const)
            : ("neutral" as const),
      }))
      .sort((a, b) => {
        // Sort by frequency
        const aCount = parseInt(a.frequency);
        const bCount = parseInt(b.frequency);
        return bCount - aCount;
      })
      .slice(0, 8); // Top 8 patterns
  }, [moodData, selectedPeriod]);

  // Calculate mood trends from data
  const moodTrends = useMemo(() => {
    if (moodData.length === 0) {
      return {
        averageMood: "No data",
        trendDirection: "stable",
        changePercentage: "0%",
        bestTime: "N/A",
        worstTime: "N/A",
      };
    }

    // Calculate average mood
    const avgIntensity =
      moodData.reduce((sum, entry) => sum + entry.intensity, 0) /
      moodData.length;

    const avgMoodName =
      avgIntensity >= 4.5
        ? "Excited"
        : avgIntensity >= 3.5
          ? "Happy"
          : avgIntensity >= 2.5
            ? "Okay"
            : avgIntensity >= 1.5
              ? "Sad"
              : "Very sad";

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(moodData.length / 2);
    const firstHalf = moodData.slice(0, midpoint);
    const secondHalf = moodData.slice(midpoint);

    const firstAvg =
      firstHalf.reduce((sum, e) => sum + e.intensity, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, e) => sum + e.intensity, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    const trendDirection =
      change > 5 ? "improving" : change < -5 ? "declining" : "stable";
    const changePercentage =
      change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;

    // Find best and worst times of day
    const timeSlots = {
      morning: [] as number[],
      afternoon: [] as number[],
      evening: [] as number[],
      night: [] as number[],
    };

    moodData.forEach((entry) => {
      const hour = new Date(entry.timestamp).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning.push(entry.intensity);
      else if (hour >= 12 && hour < 17)
        timeSlots.afternoon.push(entry.intensity);
      else if (hour >= 17 && hour < 21)
        timeSlots.evening.push(entry.intensity);
      else timeSlots.night.push(entry.intensity);
    });

    const avgByTime = {
      Morning: timeSlots.morning.length
        ? timeSlots.morning.reduce((a, b) => a + b, 0) /
          timeSlots.morning.length
        : 0,
      Afternoon: timeSlots.afternoon.length
        ? timeSlots.afternoon.reduce((a, b) => a + b, 0) /
          timeSlots.afternoon.length
        : 0,
      Evening: timeSlots.evening.length
        ? timeSlots.evening.reduce((a, b) => a + b, 0) /
          timeSlots.evening.length
        : 0,
      Night: timeSlots.night.length
        ? timeSlots.night.reduce((a, b) => a + b, 0) / timeSlots.night.length
        : 0,
    };

    const bestTime =
      Object.entries(avgByTime).reduce((a, b) => (b[1] > a[1] ? b : a))[0] ||
      "N/A";
    const worstTime =
      Object.entries(avgByTime).reduce((a, b) => (b[1] < a[1] ? b : a))[0] ||
      "N/A";

    return {
      averageMood: avgMoodName,
      trendDirection,
      changePercentage,
      bestTime,
      worstTime,
    };
  }, [moodData]);

  // Generate insights based on patterns and trends
  const insights: InsightCard[] = useMemo(() => {
    if (moodData.length === 0) {
      return [
        {
          id: "1",
          title: "Start Tracking",
          description:
            "Begin logging your moods regularly to receive personalized insights",
          icon: "📊",
          type: "neutral" as const,
        },
      ];
    }

    const generatedInsights: InsightCard[] = [];

    // Trend insight
    if (moodTrends.trendDirection === "improving") {
      generatedInsights.push({
        id: "trend",
        title: "Positive Trend Detected",
        description: `Your mood is ${moodTrends.trendDirection} by ${moodTrends.changePercentage}. Keep up the great work!`,
        icon: "📈",
        type: "positive",
      });
    } else if (moodTrends.trendDirection === "declining") {
      generatedInsights.push({
        id: "trend",
        title: "Mood Decline Noticed",
        description: `Your mood has decreased by ${moodTrends.changePercentage}. Consider talking to someone or trying relaxation techniques.`,
        icon: "📉",
        type: "warning",
      });
    }

    // Time of day insight
    if (moodTrends.bestTime !== "N/A") {
      generatedInsights.push({
        id: "time",
        title: `Best Time: ${moodTrends.bestTime}`,
        description: `Your mood tends to be highest during ${moodTrends.bestTime.toLowerCase()}. Try scheduling important tasks then.`,
        icon: "⏰",
        type: "positive",
      });
    }

    // Activity insight
    const topPattern = patterns[0];
    if (topPattern) {
      generatedInsights.push({
        id: "activity",
        title: `${topPattern.pattern} Pattern`,
        description: `You've engaged in ${topPattern.pattern.toLowerCase()} ${topPattern.frequency}. ${topPattern.impact === "positive" ? "This appears to help your mood!" : topPattern.impact === "negative" ? "Consider reducing this activity." : ""}`,
        icon: topPattern.impact === "positive" ? "✨" : "💭",
        type:
          topPattern.impact === "positive"
            ? "positive"
            : topPattern.impact === "negative"
              ? "warning"
              : "neutral",
      });
    }

    return generatedInsights;
  }, [moodData, moodTrends, patterns]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    exportButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    periodSelector: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.brown["10"],
      alignItems: "center",
    },
    periodButtonActive: {
      backgroundColor: theme.colors.orange["60"],
    },
    periodText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    periodTextActive: {
      color: "#FFFFFF",
    },
    overviewCard: {
      backgroundColor: theme.colors.green["20"],
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 20,
      padding: 20,
    },
    overviewTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    overviewStat: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    overviewIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    overviewLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    overviewValue: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    insightCard: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    insightPositive: {
      backgroundColor: theme.colors.green["20"],
    },
    insightWarning: {
      backgroundColor: theme.colors.orange["20"],
    },
    insightNeutral: {
      backgroundColor: theme.colors.brown["10"],
    },
    insightIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    insightContent: {
      flex: 1,
    },
    insightTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    insightDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
    patternCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    patternInfo: {
      flex: 1,
    },
    patternName: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    patternFrequency: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    impactBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    impactPositive: {
      backgroundColor: theme.colors.green["60"],
    },
    impactNegative: {
      backgroundColor: theme.colors.red["60"],
    },
    impactNeutral: {
      backgroundColor: theme.colors.gray["60"],
    },
    impactText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    recommendationCard: {
      backgroundColor: theme.colors.purple["20"],
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 24,
      alignItems: "center",
    },
    recommendationIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    recommendationTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    recommendationText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 16,
    },
    recommendationButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    recommendationButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const getInsightStyle = (type: string) => {
    switch (type) {
      case "positive":
        return styles.insightPositive;
      case "warning":
        return styles.insightWarning;
      default:
        return styles.insightNeutral;
    }
  };

  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case "positive":
        return styles.impactPositive;
      case "negative":
        return styles.impactNegative;
      default:
        return styles.impactNeutral;
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "positive":
        return "✓ Helpful";
      case "negative":
        return "✗ Harmful";
      default:
        return "– Neutral";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Analytics</Text>
        <TouchableOpacity
          style={styles.exportButton}
          accessible
          accessibilityLabel="Export"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={theme.colors.orange["60"]} />
            <Text
              style={{
                marginTop: 16,
                color: theme.colors.text.secondary,
                fontSize: 14,
              }}
            >
              Analyzing mood data...
            </Text>
          </View>
        ) : (
          <>
            {/* Period Selector */}
            <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "week" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("week")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "week" && styles.periodTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "month" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("month")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "month" && styles.periodTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === "year" && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod("year")}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === "year" && styles.periodTextActive,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Mood Trends</Text>

          <View style={styles.overviewStat}>
            <Text style={styles.overviewIcon}>📊</Text>
            <Text style={styles.overviewLabel}>Average Mood</Text>
            <Text style={styles.overviewValue}>{moodTrends.averageMood}</Text>
          </View>

          <View style={styles.overviewStat}>
            <Text style={styles.overviewIcon}>📈</Text>
            <Text style={styles.overviewLabel}>Trend</Text>
            <Text style={styles.overviewValue}>
              {moodTrends.changePercentage} {moodTrends.trendDirection}
            </Text>
          </View>

          <View style={styles.overviewStat}>
            <Text style={styles.overviewIcon}>☀️</Text>
            <Text style={styles.overviewLabel}>Best Time</Text>
            <Text style={styles.overviewValue}>{moodTrends.bestTime}</Text>
          </View>

          <View style={styles.overviewStat}>
            <Text style={styles.overviewIcon}>🌙</Text>
            <Text style={styles.overviewLabel}>Worst Time</Text>
            <Text style={styles.overviewValue}>{moodTrends.worstTime}</Text>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI-Generated Insights</Text>
          {insights.map((insight) => (
            <View
              key={insight.id}
              style={[styles.insightCard, getInsightStyle(insight.type)]}
            >
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>
                  {insight.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Behavior Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Behavior Patterns</Text>
          {patterns.map((pattern) => (
            <View key={pattern.id} style={styles.patternCard}>
              <View style={styles.patternInfo}>
                <Text style={styles.patternName}>{pattern.pattern}</Text>
                <Text style={styles.patternFrequency}>{pattern.frequency}</Text>
              </View>
              <View
                style={[styles.impactBadge, getImpactStyle(pattern.impact)]}
              >
                <Text style={styles.impactText}>
                  {getImpactLabel(pattern.impact)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recommendation */}
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationIcon}>💡</Text>
          <Text style={styles.recommendationTitle}>
            Personalized Recommendation
          </Text>
          <Text style={styles.recommendationText}>
            Based on your patterns, try scheduling meditation sessions in the
            morning for optimal mood improvement
          </Text>
          <TouchableOpacity style={styles.recommendationButton}>
            <Text style={styles.recommendationButtonText}>
              Set Morning Reminder
            </Text>
          </TouchableOpacity>
        </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
