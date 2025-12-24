import { logger } from "@shared/utils/logger";

/**
 * Mood History Screen - Daily/Weekly/Monthly Mood Trends
 * Based on ui-designs/Dark-mode/🔒 Mood Tracker.png
 * Now connected to SQLite for real mood data
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { moodStorageService } from "../services/moodStorageService";
import type { MoodEntry as StoredMoodEntry } from "../services/moodStorageService";
import mentalHealthAPI from "@app/services/mentalHealthAPI";
import dataPersistence from "@app/services/dataPersistence";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
}

const getMoodEmoji = (mood: string): string => {
  const emojiMap: Record<string, string> = {
    "Very sad": "😭",
    "Sad": "😢",
    "Okay": "😐",
    "Good": "🙂",
    "Happy": "😁",
    "Excited": "🤩",
    "Neutral": "😐",
    "Depressed": "😞",
  };
  return emojiMap[mood] || "😐";
};

const formatRelativeDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (days === 0) return `Today, ${timeStr}`;
  if (days === 1) return `Yesterday, ${timeStr}`;
  if (days < 7) return `${days} days ago, ${timeStr}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const MoodHistoryScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dailyMoods, setDailyMoods] = useState<MoodEntry[]>([]);
  const [weeklyMoods, setWeeklyMoods] = useState<MoodEntry[]>([]);
  const [monthlyMoods, setMonthlyMoods] = useState<MoodEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load mood data from SQLite
  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      let dailyData: StoredMoodEntry[] = [];
      let weeklyData: StoredMoodEntry[] = [];
      let monthlyData: StoredMoodEntry[] = [];

      // Try to fetch from API first
      try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Fetch from API
        const apiMoods = await mentalHealthAPI.mood.getMoodEntries(
          thirtyDaysAgo.toISOString(),
          now.toISOString()
        );

        // Transform API data to StoredMoodEntry format
        interface APIMoodEntry {
          id?: string;
          mood: string;
          intensity: number;
          timestamp: string;
          notes?: string;
          activities?: string[];
          triggers?: string[];
        }
        const transformedMoods = (apiMoods as APIMoodEntry[]).map((mood) => ({
          id: mood.id || `mood_${Date.now()}_${Math.random()}`,
          mood: mood.mood,
          intensity: mood.intensity,
          timestamp: mood.timestamp,
          notes: mood.notes,
          activities: mood.activities || [],
          triggers: mood.triggers || []
        }));

        // Cache the data
        await dataPersistence.saveMoodEntries(transformedMoods);

        // Filter for different views
        dailyData = transformedMoods;
        weeklyData = transformedMoods.filter(
          m => new Date(m.timestamp) >= sevenDaysAgo
        );
        monthlyData = transformedMoods;

      } catch (apiError) {
        logger.debug("API unavailable, using local storage");

        // Fallback to local storage
        dailyData = await moodStorageService.getMoodHistory(30);

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        weeklyData = await moodStorageService.getMoodEntriesByDateRange(
          weekStart,
          new Date()
        );

        const monthStart = new Date();
        monthStart.setDate(monthStart.getDate() - 30);
        monthlyData = await moodStorageService.getMoodEntriesByDateRange(
          monthStart,
          new Date()
        );
      }

      // Transform to UI format
      const transformEntry = (entry: StoredMoodEntry): MoodEntry => ({
        id: entry.id,
        date: formatRelativeDate(entry.timestamp),
        mood: entry.mood,
        emoji: getMoodEmoji(entry.mood),
        intensity: entry.intensity * 20, // Convert 1-5 scale to 0-100
        note: entry.notes,
      });

      setDailyMoods(dailyData.map(transformEntry));
      setWeeklyMoods(weeklyData.map(transformEntry));
      setMonthlyMoods(monthlyData.map(transformEntry));
    } catch (error) {
      logger.error("Failed to load mood history:", error);
      setErrorMessage("Unable to load mood history. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Calculate weekly stats from real data
  const weeklyStats = React.useMemo(() => {
    if (weeklyMoods.length === 0) {
      return {
        mostCommonMood: "No data",
        averageIntensity: 0,
        totalEntries: 0,
        moodDistribution: [],
      };
    }

    // Count mood occurrences
    const moodCounts: Record<string, number> = {};
    let totalIntensity = 0;

    weeklyMoods.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      totalIntensity += entry.intensity;
    });

    // Find most common mood
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    // Calculate distribution
    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / weeklyMoods.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      mostCommonMood,
      averageIntensity: Math.round(totalIntensity / weeklyMoods.length),
      totalEntries: weeklyMoods.length,
      moodDistribution,
    };
  }, [weeklyMoods]);

  // Calculate monthly stats
  const monthlyStats = React.useMemo(() => {
    if (monthlyMoods.length === 0) {
      return {
        daysTracked: 0,
        bestDay: "N/A",
        avgMood: "No data",
      };
    }

    const bestEntry = monthlyMoods.reduce((best, current) =>
      current.intensity > best.intensity ? current : best
    );

    const avgIntensity =
      monthlyMoods.reduce((sum, entry) => sum + entry.intensity, 0) /
      monthlyMoods.length;

    const avgMoodName =
      avgIntensity >= 80
        ? "Happy"
        : avgIntensity >= 60
          ? "Good"
          : avgIntensity >= 40
            ? "Okay"
            : "Sad";

    return {
      daysTracked: monthlyMoods.length,
      bestDay: bestEntry.date.split(",")[0],
      avgMood: avgMoodName,
    };
  }, [monthlyMoods]);

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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadMoodData(true)}
            tintColor={theme.colors.orange["60"]}
            colors={[theme.colors.orange["60"]]}
          />
        }
      >
        {/* Error State */}
        {errorMessage && !isLoading && (
          <View style={{ padding: 20, backgroundColor: theme.colors.red["20"], borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ color: theme.colors.red["80"], textAlign: "center" }}>
              {errorMessage}
            </Text>
            <TouchableOpacity
              style={{ marginTop: 12, padding: 8 }}
              onPress={() => loadMoodData()}
            >
              <Text style={{ color: theme.colors.red["100"], textAlign: "center", fontWeight: "600" }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading State */}
        {isLoading && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={theme.colors.orange["60"]} />
            <Text style={{ marginTop: 16, color: theme.colors.text.secondary }}>
              Loading mood history...
            </Text>
          </View>
        )}

        {!isLoading && (
          <>

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
            {/* LOW-NEW-002 FIX: Use mood as stable key instead of index */}
            {weeklyStats.moodDistribution.map((item) => (
              <View key={`mood-dist-${item.mood}`} style={styles.distributionItem}>
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
            {dailyMoods.length === 0 ? (
              <Text style={{ textAlign: "center", padding: 20, color: theme.colors.text.secondary }}>
                No mood entries yet. Start tracking your mood!
              </Text>
            ) : (
              dailyMoods.map((entry) => (
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
              ))
            )}
          </View>
        )}

        {/* Monthly View */}
        {activeTab === "monthly" && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Monthly Overview</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Days Tracked</Text>
                <Text style={styles.statValue}>{monthlyStats.daysTracked}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Best Day</Text>
                <Text style={styles.statValue}>{monthlyStats.bestDay}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg Mood</Text>
                <Text style={styles.statValue}>{monthlyStats.avgMood}</Text>
              </View>
            </View>
          </View>
        )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export const MoodHistoryScreen = () => (
  <ScreenErrorBoundary screenName="Mood History">
    <MoodHistoryScreenComponent />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging
MoodHistoryScreen.displayName = 'MoodHistoryScreen';
MoodHistoryScreenComponent.displayName = 'MoodHistoryScreenComponent';

export default MoodHistoryScreen;
