/**
 * Mood Analytics Screen - AI-Generated Mood Insights
 * Based on ui-designs/Dark-mode/🔒 Mood Tracker.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

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

  const insights: InsightCard[] = [
    {
      id: "1",
      title: "Consistent Sleep Schedule",
      description: "Your mood improves by 20% when you sleep before 11 PM",
      icon: "😴",
      type: "positive",
    },
    {
      id: "2",
      title: "Weekend Effect",
      description: "Your mood tends to be 15% higher on weekends",
      icon: "🎉",
      type: "positive",
    },
    {
      id: "3",
      title: "Morning Meditation",
      description:
        "Morning meditation correlates with better mood throughout the day",
      icon: "🧘",
      type: "positive",
    },
    {
      id: "4",
      title: "Stress Trigger Detected",
      description: "Work meetings on Mondays tend to lower your mood by 10%",
      icon: "⚠️",
      type: "warning",
    },
  ];

  const patterns: Pattern[] = [
    {
      id: "1",
      pattern: "Morning journaling",
      frequency: "5x this week",
      impact: "positive",
    },
    {
      id: "2",
      pattern: "Social interactions",
      frequency: "3x this week",
      impact: "positive",
    },
    {
      id: "3",
      pattern: "Late night work",
      frequency: "4x this week",
      impact: "negative",
    },
    {
      id: "4",
      pattern: "Exercise routine",
      frequency: "6x this week",
      impact: "positive",
    },
  ];

  const moodTrends = {
    averageMood: "Happy",
    trendDirection: "improving",
    changePercentage: "+12%",
    bestTime: "Morning (8-10 AM)",
    worstTime: "Late Evening (9-11 PM)",
  };

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
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
