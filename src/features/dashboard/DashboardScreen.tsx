/**
 * Dashboard Screen - Main Mental Health Dashboard
 * Based on ui-designs/Dark-mode/Home & Mental Health Score.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { useResponsive } from "@shared/hooks/useResponsive";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import { MentalHealthScoreWidget } from "./components/MentalHealthScoreWidget";

export const DashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { isWeb, getMaxContentWidth, getContainerPadding } = useResponsive();

  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 1024) : "100%";
  const containerPadding = getContainerPadding();

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
      fontSize: 12,
      marginBottom: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
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
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 8,
    },
    metricValue: {
      fontSize: 48,
      fontWeight: "800",
      marginVertical: 8,
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
                  Tue, 28 Oct 2025
                </Text>
                <Text style={styles.title}>Hi, Shinomiya!</Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  By You · 😊 Happy
                </Text>
              </View>
              <TouchableOpacity style={styles.searchButton}>
                <Text style={{ fontSize: 20 }}>🔍</Text>
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
                <MentalHealthScoreWidget score={80} size={100} label="" />
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
                <Text
                  style={[
                    styles.metricValue,
                    { color: theme.colors.orange["100"] },
                  ]}
                >
                  😊
                </Text>
                <Text
                  style={[
                    styles.metricSubtext,
                    { color: theme.colors.orange["80"] },
                  ]}
                >
                  Happy today
                </Text>
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
                    5.21h
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
                    Insomnia (7h Avg)
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
                    44 logs (streak)
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

export default DashboardScreen;
