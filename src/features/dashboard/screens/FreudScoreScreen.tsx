/**
 * Freud Score Screen - Detailed Mental Health Score Analysis
 * Based on ui-designs/Dark-mode/Home & Mental Health Score.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";

import { MentalHealthScoreWidget } from "../components/MentalHealthScoreWidget";

const { width } = Dimensions.get("window");

interface ScoreHistoryItem {
  date: string;
  score: number;
  status: string;
}

interface MoodHistoryItem {
  date: string;
  mood: string;
  emoji: string;
}

export const FreudScoreScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<
    "positive" | "negative" | "monthly"
  >("positive");

  const scoreHistory: ScoreHistoryItem[] = [
    { date: "12 Oct", score: 75, status: "Anxious, Depressed" },
    { date: "11 Oct", score: 82, status: "Very Happy" },
    { date: "10 Oct", score: 68, status: "Neutral" },
  ];

  const moodHistory = ["😢", "😟", "😐", "😊", "😄"];

  const barChartData = [
    { label: "Mon", positive: 60, negative: 30, monthly: 45 },
    { label: "Tue", positive: 40, negative: 50, monthly: 55 },
    { label: "Wed", positive: 80, negative: 20, monthly: 65 },
    { label: "Thu", positive: 55, negative: 35, monthly: 50 },
    { label: "Fri", positive: 70, negative: 25, monthly: 60 },
    { label: "Sat", positive: 45, negative: 40, monthly: 48 },
    { label: "Sun", positive: 85, negative: 15, monthly: 70 },
  ];

  const getBarColor = () => {
    if (selectedTab === "positive") return theme.colors.green["60"];
    if (selectedTab === "negative") return theme.colors.red["60"];
    return theme.colors.orange["60"];
  };

  const handleHelp = () => {
    // Show help information about Freud Score
    Alert.alert(
      "About Freud Score",
      "The Freud Score is a comprehensive mental health metric that combines your mood patterns, stress levels, and overall wellbeing indicators.\n\n• 80-100: Excellent\n• 60-79: Good\n• 40-59: Fair\n• Below 40: Needs Attention\n\nThis score is calculated based on your daily mood entries, therapy engagement, and wellness activities.",
      [{ text: "Got it!" }]
    );
  };

  const handleSeeInsights = () => {
    // Navigate to assessment history for detailed insights
    navigation.navigate("AssessmentHistory" as never);
  };

  const handleSeeAllHistory = () => {
    // Navigate to mood history for historical data
    navigation.navigate("MoodHistory" as never);
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
    helpButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    scoreCard: {
      backgroundColor: theme.colors.green["20"],
      borderRadius: 24,
      padding: 24,
      alignItems: "center",
      marginBottom: 24,
    },
    scoreLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.green["100"],
      marginBottom: 8,
    },
    normalBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.green["40"],
      marginTop: 8,
    },
    normalText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.green["100"],
    },
    seeInsightsButton: {
      marginTop: 16,
      width: "100%",
      height: 48,
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    seeInsightsText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    seeAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown["60"],
    },
    chartCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    tabRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 20,
    },
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.brown["20"],
    },
    tabActive: {
      backgroundColor: theme.colors.brown["60"],
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown["80"],
    },
    tabTextActive: {
      color: "#FFFFFF",
    },
    chartContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 180,
      marginBottom: 12,
    },
    barColumn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    bar: {
      width: "70%",
      borderRadius: 6,
      marginBottom: 8,
    },
    barLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    moodHistoryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
    },
    moodHistoryLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    moodEmojis: {
      flexDirection: "row",
      gap: 8,
    },
    moodEmoji: {
      fontSize: 20,
    },
    historyCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    historyDate: {
      width: 50,
    },
    historyDateText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    historyContent: {
      flex: 1,
      marginLeft: 12,
    },
    historyStatus: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    historyProgress: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
    },
    historyScore: {
      alignItems: "center",
    },
    scoreCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 4,
    },
    scoreValue: {
      fontSize: 16,
      fontWeight: "800",
    },
  });

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
        <Text style={styles.headerTitle}>Freud Score</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={handleHelp}
          accessible
          accessibilityLabel="Freud Score help"
          accessibilityRole="button"
          accessibilityHint="Learn about Freud Score and mental health metrics"
        >
          <Text style={{ fontSize: 20 }}>❓</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Freud Score</Text>
          <MentalHealthScoreWidget score={80} size={140} label="" />
          <View style={styles.normalBadge}>
            <Text style={styles.normalText}>Normal</Text>
          </View>
          <TouchableOpacity
            style={styles.seeInsightsButton}
            onPress={handleSeeInsights}
            accessible
            accessibilityLabel="View mental health insights"
            accessibilityRole="button"
            accessibilityHint="Opens detailed analysis of your mental health score"
          >
            <Text style={styles.seeInsightsText}>
              See your mental score insights
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mood History Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mood History</Text>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "positive" && styles.tabActive,
                ]}
                onPress={() => setSelectedTab("positive")}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "positive" && styles.tabTextActive,
                  ]}
                >
                  😊 Positive
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "negative" && styles.tabActive,
                ]}
                onPress={() => setSelectedTab("negative")}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "negative" && styles.tabTextActive,
                  ]}
                >
                  😢 Negative
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "monthly" && styles.tabActive,
                ]}
                onPress={() => setSelectedTab("monthly")}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "monthly" && styles.tabTextActive,
                  ]}
                >
                  📅 Monthly
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bar Chart */}
            <View style={styles.chartContainer}>
              {/* LOW-NEW-002 FIX: Use label as stable key instead of index */}
              {barChartData.map((item) => {
                const value = item[selectedTab];
                const barHeight = (value / 100) * 160;
                return (
                  <View key={`bar-${item.label}`} style={styles.barColumn}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: getBarColor(),
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>

            {/* Mood History Row */}
            <View style={styles.moodHistoryRow}>
              <Text style={styles.moodHistoryLabel}>Mood History</Text>
              <View style={styles.moodEmojis}>
                {/* LOW-NEW-002 FIX: Use emoji as stable key instead of index */}
                {moodHistory.map((emoji, idx) => (
                  <Text key={`mood-${idx}-${emoji}`} style={styles.moodEmoji}>
                    {emoji}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Score History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Score History</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleSeeAllHistory}
              accessible
              accessibilityLabel="See all score history"
              accessibilityRole="button"
              accessibilityHint="View complete Freud Score history"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* LOW-NEW-002 FIX: Use date as stable key instead of index */}
          {scoreHistory.map((item) => {
            const scoreColor =
              item.score >= 75
                ? theme.colors.green["60"]
                : item.score >= 50
                  ? theme.colors.orange["60"]
                  : theme.colors.red["60"];

            return (
              <View key={`score-${item.date}`} style={styles.historyCard}>
                <View style={styles.historyDate}>
                  <Text style={styles.historyDateText}>{item.date}</Text>
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyStatus}>{item.status}</Text>
                  <Text style={styles.historyProgress}>No recommendation</Text>
                </View>
                <View style={styles.historyScore}>
                  <View
                    style={[
                      styles.scoreCircle,
                      {
                        borderColor: scoreColor,
                        backgroundColor: `${scoreColor}20`,
                      },
                    ]}
                  >
                    <Text style={[styles.scoreValue, { color: scoreColor }]}>
                      {item.score}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const FreudScoreScreenWithBoundary = () => (
  <ScreenErrorBoundary screenName="Freud Score">
    <FreudScoreScreen />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging
FreudScoreScreen.displayName = 'FreudScoreScreen';
FreudScoreScreenWithBoundary.displayName = 'FreudScoreScreenWithBoundary';

export default FreudScoreScreenWithBoundary;
