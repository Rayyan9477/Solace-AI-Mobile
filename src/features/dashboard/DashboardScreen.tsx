import { logger } from "@shared/utils/logger";

/**
 * Dashboard Screen - Main Mental Health Dashboard
 * Based on ui-designs/Dark-mode/Home & Mental Health Score.png
 * Enhanced with accessible components and improved styling
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { useResponsive } from "@shared/hooks/useResponsive";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { moodStorageService } from "@features/mood/services/moodStorageService";
import type { MoodEntry } from "@features/mood/services/moodStorageService";
import { useSelector } from "react-redux";
import mentalHealthAPI from "@app/services/mentalHealthAPI";
import { typography, spacing } from "@shared/theme/theme";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";

import { MentalHealthScoreWidget } from "./components/MentalHealthScoreWidget";

interface DashboardData {
  mentalHealthScore?: number;
  streakDays?: number;
  insights?: string[];
  todaysMood?: MoodEntry;
  mindfulHours?: number;
  sleepAverage?: number;
  journalCount?: number;
}

const DashboardScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { isWeb, getMaxContentWidth, getContainerPadding } = useResponsive();
  const userProfile = useSelector((state: { user: { profile: { name?: string } | null } }) => state.user.profile);

  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 1024) : "100%";
  const containerPadding = getContainerPadding();

  // Dashboard data state
  const [currentMood, setCurrentMood] = useState<MoodEntry | null>(null);
  const [isLoadingMood, setIsLoadingMood] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [mentalHealthScore, setMentalHealthScore] = useState(75); // Default score
  const [streakDays, setStreakDays] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [mindfulHours, setMindfulHours] = useState(0);
  const [sleepAverage, setSleepAverage] = useState(7);
  const [journalCount, setJournalCount] = useState(0);

  // Load dashboard data on mount
  useEffect(() => {
    loadCurrentMood();
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoadingDashboard(true);
    try {
      // Try to fetch from API, fallback to local storage
      try {
        const data = await mentalHealthAPI.dashboard.getDashboardData();
        setDashboardData(data);
        setMentalHealthScore(data.mentalHealthScore || 75);
        setStreakDays(data.streakDays || 0);
        setInsights(data.insights || []);
        if (data.todaysMood) {
          setCurrentMood(data.todaysMood);
        }

        // Set mindfulness and sleep data from API
        if (data.mindfulHours) setMindfulHours(data.mindfulHours);
        if (data.sleepAverage) setSleepAverage(data.sleepAverage);
        if (data.journalCount) setJournalCount(data.journalCount);
      } catch (apiError) {
        // Fallback to local storage if API fails
        logger.debug("API unavailable, using local data");
        const moods = await moodStorageService.getMoodHistory(7);
        const latestMood = moods[0] || null;
        setCurrentMood(latestMood);

        // Calculate local mental health score based on recent moods
        const avgIntensity = moods.reduce((sum, m) => sum + m.intensity, 0) / (moods.length || 1);
        setMentalHealthScore(Math.round(avgIntensity * 20)); // Convert 1-5 scale to 0-100

        // Calculate streak
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < moods.length; i++) {
          const moodDate = new Date(moods[i].timestamp);
          const daysDiff = Math.floor((today.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === i) streak++;
          else break;
        }
        setStreakDays(streak);

        // Set default values for other metrics when API is unavailable
        setMindfulHours(2.5);
        setSleepAverage(7);
        setJournalCount(3);
      }
    } catch (error) {
      logger.error("Failed to load dashboard data:", error);
      // Use default values on error
      setMentalHealthScore(75);
      setStreakDays(0);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const loadCurrentMood = async () => {
    setIsLoadingMood(true);
    try {
      const moods = await moodStorageService.getMoodHistory(1);
      if (moods.length > 0) {
        setCurrentMood(moods[0]);
      }
    } catch (error) {
      logger.error("Failed to load current mood:", error);
    } finally {
      setIsLoadingMood(false);
    }
  };

  // Helper to get mood emoji
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      flexGrow: 1,
    },
    innerContainer: {
      width: "100%",
      alignItems: "center",
    },
    contentWrapper: {
      width: "100%",
      maxWidth: contentMaxWidth,
      paddingHorizontal: containerPadding,
      paddingVertical: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 24,
    },
    greeting: {
      ...typography.sizes.textXs,
      marginBottom: spacing[1],
    },
    title: {
      ...typography.sizes.heading2xl,
      fontWeight: typography.weights.extrabold,
      color: theme.colors.text.primary,
      marginBottom: spacing[1],
    },
    subtitle: {
      ...typography.sizes.textSm,
    },
    searchButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    metricsGrid: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    metricCard: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      minHeight: 140,
    },
    scoreCard: {
      alignItems: "center",
      justifyContent: "center",
    },
    metricLabel: {
      ...typography.sizes.textSm,
      fontWeight: typography.weights.bold,
      marginBottom: spacing[2],
    },
    metricValue: {
      ...typography.sizes.displayLg,
      fontWeight: typography.weights.extrabold,
      marginVertical: spacing[2],
    },
    metricSubtext: {
      fontSize: 12,
      fontWeight: "600",
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    trackerCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 16,
      marginBottom: 8,
    },
    trackerIcon: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    trackerContent: {
      flex: 1,
      marginLeft: 12,
    },
    trackerTitle: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 2,
    },
    trackerSubtitle: {
      fontSize: 12,
      fontWeight: "600",
    },
    trackerProgress: {
      width: 60,
      height: 4,
      backgroundColor: "rgba(0,0,0,0.1)",
      borderRadius: 2,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      borderRadius: 2,
    },
    aiCard: {
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
    },
    aiHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    aiTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    aiStats: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    aiStat: {},
    aiStatValue: {
      fontSize: 32,
      fontWeight: "800",
      marginBottom: 4,
    },
    aiStatLabel: {
      fontSize: 14,
      fontWeight: "600",
    },
    aiMessages: {},
    aiSubtext: {
      fontSize: 12,
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <View style={styles.contentWrapper}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text
                  style={[
                    styles.greeting,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
                <Text style={styles.title}>Hi, {userProfile?.name || 'there'}!</Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {streakDays > 0 ? `${streakDays} day streak · ` : ''}{isLoadingMood ? "Loading..." : currentMood ? `${getMoodEmoji(currentMood.mood)} ${currentMood.mood}` : "No mood logged"}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.searchButton}
                accessibilityRole="button"
                accessibilityLabel="Search - Find resources, articles, and help"
                accessibilityHint="Double tap to open search"
              >
                <MaterialCommunityIcons 
                  name="magnify" 
                  size={24} 
                  color={theme.colors.text.primary} 
                />
              </TouchableOpacity>
            </View>

            {/* Mental Health Metrics Grid */}
            <View style={styles.metricsGrid}>
              <TouchableOpacity
                style={[
                  styles.metricCard,
                  styles.scoreCard,
                  { backgroundColor: theme.colors.green["20"] },
                ]}
                onPress={() => navigation.navigate("FreudScore")}
              >
                <Text
                  style={[
                    styles.metricLabel,
                    { color: theme.colors.green["100"] },
                  ]}
                >
                  Freud Score
                </Text>
                {isLoadingDashboard ? (
                  <ActivityIndicator size="large" color={theme.colors.green["100"]} />
                ) : (
                  <MentalHealthScoreWidget score={mentalHealthScore} size={100} label="" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.metricCard,
                  { backgroundColor: theme.colors.orange["20"] },
                ]}
                onPress={() => navigation.navigate("MoodStats")}
              >
                <Text
                  style={[
                    styles.metricLabel,
                    { color: theme.colors.orange["100"] },
                  ]}
                >
                  Mood
                </Text>
                {isLoadingMood ? (
                  <ActivityIndicator size="large" color={theme.colors.orange["100"]} />
                ) : (
                  <>
                    <Text
                      style={[
                        styles.metricValue,
                        { color: theme.colors.orange["100"] },
                      ]}
                    >
                      {currentMood ? getMoodEmoji(currentMood.mood) : "😐"}
                    </Text>
                    <Text
                      style={[
                        styles.metricSubtext,
                        { color: theme.colors.orange["80"] },
                      ]}
                    >
                      {currentMood ? `${currentMood.mood} today` : "Log your mood"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Mindful Tracker */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mindful Tracker</Text>

              <TouchableOpacity
                style={[
                  styles.trackerCard,
                  { backgroundColor: theme.colors.green["20"] },
                ]}
                onPress={() => navigation.navigate("MindfulHours")}
              >
                <View style={styles.trackerIcon}>
                  <Text style={{ fontSize: 24 }}>🫁</Text>
                </View>
                <View style={styles.trackerContent}>
                  <Text
                    style={[
                      styles.trackerTitle,
                      { color: theme.colors.green["100"] },
                    ]}
                  >
                    Mindful Hours
                  </Text>
                  <Text
                    style={[
                      styles.trackerSubtitle,
                      { color: theme.colors.green["80"] },
                    ]}
                  >
                    {mindfulHours.toFixed(2)}h
                  </Text>
                </View>
                <View style={styles.trackerProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: theme.colors.green["40"] },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.trackerCard,
                  { backgroundColor: theme.colors.purple["20"] },
                ]}
                onPress={() => navigation.navigate("SleepQuality")}
              >
                <View style={styles.trackerIcon}>
                  <Text style={{ fontSize: 24 }}>⭐</Text>
                </View>
                <View style={styles.trackerContent}>
                  <Text
                    style={[
                      styles.trackerTitle,
                      { color: theme.colors.purple["100"] },
                    ]}
                  >
                    Sleep Quality
                  </Text>
                  <Text
                    style={[
                      styles.trackerSubtitle,
                      { color: theme.colors.purple["80"] },
                    ]}
                  >
                    {sleepAverage < 6 ? 'Poor' : sleepAverage < 7 ? 'Fair' : 'Good'} ({sleepAverage.toFixed(1)}h Avg)
                  </Text>
                </View>
                <View style={styles.trackerProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: theme.colors.purple["40"],
                        width: "60%",
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.trackerCard,
                  { backgroundColor: theme.colors.orange["20"] },
                ]}
                onPress={() => navigation.navigate("JournalList")}
              >
                <View style={styles.trackerIcon}>
                  <Text style={{ fontSize: 24 }}>📖</Text>
                </View>
                <View style={styles.trackerContent}>
                  <Text
                    style={[
                      styles.trackerTitle,
                      { color: theme.colors.orange["100"] },
                    ]}
                  >
                    Mindful Journal
                  </Text>
                  <Text
                    style={[
                      styles.trackerSubtitle,
                      { color: theme.colors.orange["80"] },
                    ]}
                  >
                    {journalCount} logs {streakDays > 0 ? `(${streakDays} day streak)` : ''}
                  </Text>
                </View>
                <View style={styles.trackerProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: theme.colors.orange["40"],
                        width: "80%",
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.trackerCard,
                  { backgroundColor: theme.colors.yellow["20"] },
                ]}
                onPress={() => navigation.navigate("StressLevel")}
              >
                <View style={styles.trackerIcon}>
                  <Text style={{ fontSize: 24 }}>😤</Text>
                </View>
                <View style={styles.trackerContent}>
                  <Text
                    style={[
                      styles.trackerTitle,
                      { color: theme.colors.yellow["100"] },
                    ]}
                  >
                    Stress Level
                  </Text>
                  <Text
                    style={[
                      styles.trackerSubtitle,
                      { color: theme.colors.yellow["80"] },
                    ]}
                  >
                    Level 3 (Normal)
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.trackerCard,
                  { backgroundColor: theme.colors.brown["20"] },
                ]}
                onPress={() => navigation.navigate("MoodTracker")}
              >
                <View style={styles.trackerIcon}>
                  <Text style={{ fontSize: 24 }}>😊</Text>
                </View>
                <View style={styles.trackerContent}>
                  <Text
                    style={[
                      styles.trackerTitle,
                      { color: theme.colors.brown["100"] },
                    ]}
                  >
                    Mood Tracker
                  </Text>
                  <Text
                    style={[
                      styles.trackerSubtitle,
                      { color: theme.colors.brown["80"] },
                    ]}
                  >
                    😊 Happy (Today)
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Therapy Challenges */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Therapy Challenges</Text>

              <TouchableOpacity
                style={[
                  styles.trackerCard,
                  { backgroundColor: theme.colors.purple["20"] },
                ]}
                onPress={() => navigation.navigate("TherapyExercises")}
              >
                <View style={styles.trackerIcon}>
                  <Text style={{ fontSize: 24 }}>🧠</Text>
                </View>
                <View style={styles.trackerContent}>
                  <Text
                    style={[
                      styles.trackerTitle,
                      { color: theme.colors.purple["100"] },
                    ]}
                  >
                    Therapeutic Exercises
                  </Text>
                  <Text
                    style={[
                      styles.trackerSubtitle,
                      { color: theme.colors.purple["80"] },
                    ]}
                  >
                    6 exercises • CBT, Mindfulness & More
                  </Text>
                </View>
                <View style={styles.trackerProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: theme.colors.purple["40"],
                        width: "40%",
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* AI Therapy Chatbot */}
            <TouchableOpacity
              style={[
                styles.aiCard,
                { backgroundColor: theme.colors.gray["20"] },
              ]}
              onPress={() => navigation.navigate("Chat")}
            >
              <View style={styles.aiHeader}>
                <Text
                  style={[styles.aiTitle, { color: theme.colors.text.primary }]}
                >
                  AI Therapy Chatbot
                </Text>
                <TouchableOpacity>
                  <Text style={{ fontSize: 20 }}>ℹ️</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.aiStats}>
                <View style={styles.aiStat}>
                  <Text
                    style={[
                      styles.aiStatValue,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    2,541
                  </Text>
                  <Text
                    style={[
                      styles.aiStatLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Conversations
                  </Text>
                </View>
                <View style={styles.aiMessages}>
                  <Text style={{ fontSize: 40 }}>💬</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.aiSubtext,
                  { color: theme.colors.text.secondary },
                ]}
              >
                10:14 am this month · Get Pro Now!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const DashboardScreen = () => (
  <ScreenErrorBoundary screenName="Dashboard">
    <DashboardScreenComponent />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging and React DevTools
DashboardScreen.displayName = "DashboardScreen";

export default DashboardScreen;
