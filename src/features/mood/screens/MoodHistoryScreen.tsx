/**
 * Mood History Screen - Daily/Weekly/Monthly Mood Trends
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

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
}

export const MoodHistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );

  const dailyMoods: MoodEntry[] = [
    {
      id: "1",
      date: "Today, 2:30 PM",
      mood: "Happy",
      emoji: "😊",
      intensity: 80,
    },
    {
      id: "2",
      date: "Today, 10:00 AM",
      mood: "Neutral",
      emoji: "😐",
      intensity: 50,
    },
    {
      id: "3",
      date: "Yesterday, 6:00 PM",
      mood: "Excited",
      emoji: "🤩",
      intensity: 95,
    },
    {
      id: "4",
      date: "Yesterday, 2:00 PM",
      mood: "Sad",
      emoji: "😢",
      intensity: 30,
    },
    {
      id: "5",
      date: "2 days ago, 4:00 PM",
      mood: "Happy",
      emoji: "😊",
      intensity: 75,
    },
  ];

  const weeklyStats = {
    mostCommonMood: "Happy",
    averageIntensity: 66,
    totalEntries: 28,
    moodDistribution: [
      { mood: "Happy", count: 12, percentage: 43 },
      { mood: "Neutral", count: 8, percentage: 29 },
      { mood: "Sad", count: 5, percentage: 18 },
      { mood: "Excited", count: 3, percentage: 10 },
    ],
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
    filterButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    tabsRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.brown["10"],
      alignItems: "center",
    },
    tabActive: {
      backgroundColor: theme.colors.orange["60"],
    },
    tabText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    tabTextActive: {
      color: "#FFFFFF",
    },
    statsCard: {
      backgroundColor: theme.colors.brown["10"],
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 16,
      padding: 20,
    },
    statsTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    statItem: {
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text.primary,
    },
    distributionItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    distributionMood: {
      width: 80,
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    distributionBar: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.gray["20"],
      marginRight: 12,
      overflow: "hidden",
    },
    distributionFill: {
      height: "100%",
      borderRadius: 4,
    },
    distributionPercentage: {
      width: 40,
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
      textAlign: "right",
    },
    historyList: {
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    moodCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    moodEmoji: {
      fontSize: 40,
      marginRight: 16,
    },
    moodInfo: {
      flex: 1,
    },
    moodName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    moodDate: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    intensityBar: {
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.gray["20"],
      overflow: "hidden",
    },
    intensityFill: {
      height: "100%",
      borderRadius: 3,
    },
    moodIntensity: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
  });

  const getMoodColor = (mood: string) => {
    const colors = {
      Happy: theme.colors.green["60"],
      Excited: theme.colors.purple["60"],
      Neutral: theme.colors.gray["60"],
      Sad: theme.colors.blue["60"],
      Depressed: theme.colors.brown["80"],
    };
    return colors[mood] || theme.colors.orange["60"];
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
        <Text style={styles.headerTitle}>Mood History</Text>
        <TouchableOpacity
          style={styles.filterButton}
          accessible
          accessibilityLabel="Filter"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "daily" && styles.tabActive]}
            onPress={() => setActiveTab("daily")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "daily" && styles.tabTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "weekly" && styles.tabActive]}
            onPress={() => setActiveTab("weekly")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "weekly" && styles.tabTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "monthly" && styles.tabActive]}
            onPress={() => setActiveTab("monthly")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "monthly" && styles.tabTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Stats */}
        {activeTab === "weekly" && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>This Week's Stats</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Most Common</Text>
                <Text style={styles.statValue}>
                  {weeklyStats.mostCommonMood}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Intensity</Text>
                <Text style={styles.statValue}>
                  {weeklyStats.averageIntensity}%
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Entries</Text>
                <Text style={styles.statValue}>{weeklyStats.totalEntries}</Text>
              </View>
            </View>

            <Text style={[styles.statsTitle, { marginTop: 16 }]}>
              Mood Distribution
            </Text>
            {weeklyStats.moodDistribution.map((item, index) => (
              <View key={index} style={styles.distributionItem}>
                <Text style={styles.distributionMood}>{item.mood}</Text>
                <View style={styles.distributionBar}>
                  <View
                    style={[
                      styles.distributionFill,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: getMoodColor(item.mood),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.distributionPercentage}>
                  {item.percentage}%
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Daily History */}
        {activeTab === "daily" && (
          <View style={styles.historyList}>
            <Text style={styles.sectionTitle}>Recent Moods</Text>
            {dailyMoods.map((entry) => (
              <TouchableOpacity key={entry.id} style={styles.moodCard}>
                <Text style={styles.moodEmoji}>{entry.emoji}</Text>
                <View style={styles.moodInfo}>
                  <Text style={styles.moodName}>{entry.mood}</Text>
                  <Text style={styles.moodDate}>{entry.date}</Text>
                  <View style={styles.intensityBar}>
                    <View
                      style={[
                        styles.intensityFill,
                        {
                          width: `${entry.intensity}%`,
                          backgroundColor: getMoodColor(entry.mood),
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.moodIntensity}>{entry.intensity}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Monthly View */}
        {activeTab === "monthly" && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Monthly Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Days Tracked</Text>
                <Text style={styles.statValue}>28</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Best Day</Text>
                <Text style={styles.statValue}>Oct 15</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Mood</Text>
                <Text style={styles.statValue}>Happy</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodHistoryScreen;
