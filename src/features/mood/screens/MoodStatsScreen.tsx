import { logger } from "@shared/utils/logger";

import { MentalHealthIcon, NavigationIcon } from "@shared/components/icons";
import { useTheme } from "@theme/ThemeProvider";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { moodStorageService } from "../services/moodStorageService";
import type { MoodEntry as StoredMoodEntry } from "../services/moodStorageService";

const { width } = Dimensions.get("window");

const MoodStatsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // SQLite state
  const [isLoading, setIsLoading] = useState(true);
  const [moodHistory, setMoodHistory] = useState<StoredMoodEntry[]>([]);

  // Fetch mood history from SQLite on mount
  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    setIsLoading(true);
    try {
      // Load last 30 days of mood data
      const moods = await moodStorageService.getMoodHistory(30);
      setMoodHistory(moods);
    } catch (error) {
      logger.error("Failed to load mood stats:", error);
      setMoodHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get emoji based on mood score
  const getMoodEmoji = (score: number): string => {
    if (score >= 8) return "😄";
    if (score >= 6) return "😊";
    if (score >= 4) return "😐";
    if (score >= 2) return "😢";
    return "😞";
  };

  // Calculate mood stats from SQLite data
  const moodStatsData = useMemo(() => {
    if (moodHistory.length === 0) {
      return {
        weeklyAverage: 0,
        todayMood: "No data yet",
        moodHistory: [],
        moodDistribution: [],
        insights: ["Start tracking your mood to see insights"],
      };
    }

    // Get last 7 days of mood entries
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentMoods = moodHistory.filter((entry) => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= sevenDaysAgo;
    });

    // Map mood history to weekly display format
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const moodHistoryByDay = daysOfWeek.map((day, index) => {
      const dayEntries = recentMoods.filter((entry: any) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.getDay() === index;
      });

      if (dayEntries.length === 0) {
        return { day, mood: "😐", score: 0 };
      }

      const avgScore =
        dayEntries.reduce(
          (sum: number, entry: any) => sum + entry.intensity,
          0,
        ) / dayEntries.length;

      const moodEmoji = getMoodEmoji(avgScore);
      return { day, mood: moodEmoji, score: Math.round(avgScore) };
    });

    // Calculate mood distribution
    const moodCounts: Record<string, number> = {
      "Very Happy": 0,
      Happy: 0,
      Neutral: 0,
      Sad: 0,
      "Very Sad": 0,
    };

    recentMoods.forEach((entry: any) => {
      const intensity = entry.intensity;
      if (intensity >= 8) moodCounts["Very Happy"]++;
      else if (intensity >= 6) moodCounts["Happy"]++;
      else if (intensity >= 4) moodCounts["Neutral"]++;
      else if (intensity >= 2) moodCounts["Sad"]++;
      else moodCounts["Very Sad"]++;
    });

    const total = recentMoods.length || 1;
    const moodDistribution = [
      {
        mood: "Very Happy",
        emoji: "😄",
        percentage: Math.round((moodCounts["Very Happy"] / total) * 100),
        color: theme.colors.green?.[60] || "#4CAF50",
      },
      {
        mood: "Happy",
        emoji: "😊",
        percentage: Math.round((moodCounts["Happy"] / total) * 100),
        color: theme.colors.green?.[50] || "#8BC34A",
      },
      {
        mood: "Neutral",
        emoji: "😐",
        percentage: Math.round((moodCounts["Neutral"] / total) * 100),
        color: theme.colors.yellow?.[50] || "#FFC107",
      },
      {
        mood: "Sad",
        emoji: "😢",
        percentage: Math.round((moodCounts["Sad"] / total) * 100),
        color: theme.colors.orange?.[50] || "#FF9800",
      },
      {
        mood: "Very Sad",
        emoji: "😞",
        percentage: Math.round((moodCounts["Very Sad"] / total) * 100),
        color: theme.colors.red?.[50] || "#F44336",
      },
    ];

    // Calculate weekly average intensity
    const weeklyAverage =
      recentMoods.length > 0
        ? recentMoods.reduce((sum, entry) => sum + entry.intensity, 0) /
          recentMoods.length
        : 0;

    // Get today's mood (most recent entry)
    const today = moodHistory.length > 0 ? moodHistory[0] : null;
    const todayMood = today ? today.mood : "No mood logged today";

    // Find most common mood
    const commonMoodCounts: Record<string, number> = {};
    recentMoods.forEach((entry) => {
      commonMoodCounts[entry.mood] = (commonMoodCounts[entry.mood] || 0) + 1;
    });
    const mostCommonMood =
      Object.keys(commonMoodCounts).length > 0
        ? Object.entries(commonMoodCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
        : null;

    // Generate insights
    const displayInsights = [
      recentMoods.length > 0
        ? `You've logged ${recentMoods.length} mood entries this week!`
        : "Start tracking your mood to see insights",
      mostCommonMood
        ? `Most common mood: ${mostCommonMood}`
        : "Track moods regularly to see patterns",
      weeklyAverage > 0
        ? `Average mood intensity: ${weeklyAverage.toFixed(1)}/5`
        : "Log your daily mood to track progress",
      recentMoods.length >= 5
        ? "Great job staying consistent with mood tracking!"
        : "Try to log your mood daily for better insights",
    ];

    return {
      weeklyAverage,
      todayMood,
      moodHistory: moodHistoryByDay,
      moodDistribution,
      insights: displayInsights.slice(0, 4), // Limit to 4 insights
    };
  }, [moodHistory, theme]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const backgroundColors = isDarkMode
    ? [
        theme.colors.dark.background.primary,
        theme.colors.dark.background.secondary,
      ]
    : [
        theme.colors.therapeutic.calming[50],
        theme.colors.therapeutic.peaceful[50],
      ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <LinearGradient
        colors={backgroundColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            Mood Stats
          </Text>

          <TouchableOpacity style={styles.headerButton}>
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <ActivityIndicator
                size="large"
                color={theme.colors.orange["60"]}
              />
              <Text
                style={{
                  marginTop: 16,
                  color: theme.colors.text.secondary,
                  fontSize: 14,
                }}
              >
                Loading mood stats...
              </Text>
            </View>
          ) : (
            <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Today's Mood */}
            <View
              style={[
                styles.todayCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                See your mood through the day
              </Text>

              <View style={styles.todayMoodContainer}>
                <LinearGradient
                  colors={
                    isDarkMode ? ["#4CAF50", "#66BB6A"] : ["#E8F5E8", "#C8E6C9"]
                  }
                  style={styles.todayMoodCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.todayMoodEmoji}>😊</Text>
                </LinearGradient>

                <View style={styles.todayMoodInfo}>
                  <Text
                    style={[
                      styles.todayMoodTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {moodStatsData.todayMood}
                  </Text>
                  <Text
                    style={[
                      styles.todayMoodSubtitle,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Overall mood through the day
                  </Text>

                  <View style={styles.moodActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: theme.colors.primary["500"] },
                      ]}
                      onPress={() => navigation.navigate("MoodTracker")}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: theme.colors.text.inverse },
                        ]}
                      >
                        Set Mood ✓
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: theme.colors.background.secondary },
                      ]}
                      onPress={() => navigation.navigate("MoodHistory")}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        Statistics
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Weekly Mood Chart */}
            <View
              style={[
                styles.chartCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                Mood History
              </Text>

              <View style={styles.moodChart}>
                {/* LOW-NEW-002 FIX: Use day as stable key instead of index */}
                {moodStatsData.moodHistory.map((item, index) => (
                  <MoodChartItem
                    key={`mood-chart-${item.day}`}
                    item={item}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    delay={index * 100}
                  />
                ))}
              </View>

              <View style={styles.chartLabels}>
                <Text
                  style={[
                    styles.chartLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  This Week
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MoodHistory")}
                >
                  <Text
                    style={[
                      styles.seeAllText,
                      { color: theme.colors.primary["500"] },
                    ]}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Mood Distribution */}
            <View
              style={[
                styles.distributionCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                Mood Distribution
              </Text>

              <View style={styles.distributionChart}>
                {/* LOW-NEW-002 FIX: Use mood name as stable key instead of index */}
                {moodStatsData.moodDistribution.map((mood, index) => (
                  <MoodDistributionBar
                    key={`mood-dist-${mood.mood}`}
                    mood={mood}
                    theme={theme}
                    delay={index * 150}
                  />
                ))}
              </View>
            </View>

            {/* AI Insights */}
            <View
              style={[
                styles.insightsCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.insightsHeader}>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  AI Insights
                </Text>
                <View
                  style={[
                    styles.aiIcon,
                    { backgroundColor: theme.colors.primary["500"] },
                  ]}
                >
                  <MentalHealthIcon
                    name="Brain"
                    size={16}
                    color={theme.colors.text.inverse}
                    variant="filled"
                  />
                </View>
              </View>

              {/* LOW-NEW-002 FIX: Use insight text as stable key instead of index */}
              {moodStatsData.insights.map((insight, index) => (
                <InsightItem
                  key={`insight-${insight.substring(0, 20).replace(/\s/g, '-')}`}
                  insight={insight}
                  theme={theme}
                  delay={index * 200}
                />
              ))}
            </View>

            {/* Quick Actions */}
            <View
              style={[
                styles.actionsCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                Improve Your Mood
              </Text>

              <View style={styles.actionsGrid}>
                <ActionCard
                  title="Mindfulness"
                  subtitle="5 min session"
                  icon="🧘‍♀️"
                  gradient={["#4ECDC4", "#7FDBDA"]}
                  onPress={() => navigation.navigate("MindfulHours")}
                  theme={theme}
                />

                <ActionCard
                  title="Journal"
                  subtitle="Write thoughts"
                  icon="📝"
                  gradient={["#FFB347", "#FFCC70"]}
                  onPress={() => navigation.navigate("Journal")}
                  theme={theme}
                />
              </View>
            </View>
          </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const MoodChartItem = ({ item, theme, isDarkMode, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.chartItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.chartBar, { height: item.score * 15 }]} />
      <Text style={styles.chartEmoji}>{item.mood}</Text>
      <Text style={[styles.chartDay, { color: theme.colors.text.quaternary }]}>
        {item.day}
      </Text>
    </Animated.View>
  );
};

const MoodDistributionBar = ({ mood, theme, delay }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(widthAnim, {
        toValue: mood.percentage,
        duration: 1000,
        delay: delay + 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View style={[styles.distributionItem, { opacity: fadeAnim }]}>
      <View style={styles.distributionLabel}>
        <Text style={styles.distributionEmoji}>{mood.emoji}</Text>
        <Text
          style={[
            styles.distributionMood,
            { color: theme.colors.text.primary },
          ]}
        >
          {mood.mood}
        </Text>
      </View>

      <View style={styles.distributionBarContainer}>
        <Animated.View
          style={[
            styles.distributionBar,
            {
              backgroundColor: mood.color,
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.distributionPercentage,
          { color: theme.colors.text.secondary },
        ]}
      >
        {mood.percentage}%
      </Text>
    </Animated.View>
  );
};

const InsightItem = ({ insight, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.insightItem,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View
        style={[
          styles.insightIcon,
          { backgroundColor: theme.colors.therapeutic.calming[500] },
        ]}
      >
        <Text style={styles.insightIconText}>💡</Text>
      </View>
      <Text style={[styles.insightText, { color: theme.colors.text.primary }]}>
        {insight}
      </Text>
    </Animated.View>
  );
};

const ActionCard = ({ title, subtitle, icon, gradient, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradient}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text
          style={[styles.actionTitle, { color: theme.colors.text.inverse }]}
        >
          {title}
        </Text>
        <Text
          style={[styles.actionSubtitle, { color: theme.colors.text.inverse }]}
        >
          {subtitle}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  todayCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  todayMoodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  todayMoodCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  todayMoodEmoji: {
    fontSize: 32,
  },
  todayMoodInfo: {
    flex: 1,
  },
  todayMoodTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  todayMoodSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  moodActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodChart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100,
    marginBottom: 16,
  },
  chartItem: {
    alignItems: "center",
    gap: 4,
  },
  chartBar: {
    width: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    minHeight: 20,
  },
  chartEmoji: {
    fontSize: 16,
  },
  chartDay: {
    fontSize: 10,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartLabel: {
    fontSize: 14,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  distributionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distributionChart: {
    gap: 12,
  },
  distributionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  distributionLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    gap: 8,
  },
  distributionEmoji: {
    fontSize: 16,
  },
  distributionMood: {
    fontSize: 14,
    fontWeight: "500",
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  distributionBar: {
    height: "100%",
    borderRadius: 4,
  },
  distributionPercentage: {
    fontSize: 12,
    fontWeight: "500",
    width: 32,
    textAlign: "right",
  },
  insightsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  aiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  insightIconText: {
    fontSize: 16,
  },
  insightText: {
    fontSize: 14,
    flex: 1,
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 16,
    alignItems: "center",
    minHeight: 100,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
  },
});

export const MoodStatsScreenWithBoundary = (props: { navigation: any }) => (
  <ScreenErrorBoundary screenName="Mood Stats">
    <MoodStatsScreen {...props} />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging
MoodStatsScreen.displayName = 'MoodStatsScreen';
MoodStatsScreenWithBoundary.displayName = 'MoodStatsScreenWithBoundary';
MoodChartItem.displayName = 'MoodChartItem';
MoodDistributionBar.displayName = 'MoodDistributionBar';
InsightItem.displayName = 'InsightItem';
ActionCard.displayName = 'ActionCard';

export default MoodStatsScreenWithBoundary;
