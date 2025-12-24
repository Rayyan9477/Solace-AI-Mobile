/**
 * Sleep Patterns Screen - Sleep Analytics and Insights
 * Based on ui-designs/Dark-mode/Sleep Quality.png
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
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export const SleepPatternsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week",
  );

  const weeklyData = [
    { day: "Mon", hours: 7.2, quality: "Good" },
    { day: "Tue", hours: 6.5, quality: "Fair" },
    { day: "Wed", hours: 8.0, quality: "Excellent" },
    { day: "Thu", hours: 7.5, quality: "Good" },
    { day: "Fri", hours: 6.0, quality: "Poor" },
    { day: "Sat", hours: 8.5, quality: "Excellent" },
    { day: "Sun", hours: 7.8, quality: "Good" },
  ];

  const averageSleep = 7.4;
  const sleepGoal = 8.0;

  const handleSettings = () => {
    // Navigate to sleep goals screen
    navigation.navigate("SleepGoals" as never);
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
    settingsButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    averageCard: {
      backgroundColor: theme.colors.purple["20"],
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      marginBottom: 24,
    },
    averageLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.purple["80"],
      marginBottom: 12,
    },
    averageHours: {
      fontSize: 64,
      fontWeight: "800",
      color: theme.colors.purple["100"],
    },
    averageText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.purple["80"],
      marginTop: 8,
    },
    chartCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    chart: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 200,
      marginBottom: 16,
    },
    barColumn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    bar: {
      width: "70%",
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 6,
      marginBottom: 8,
    },
    dayLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    statsGrid: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
    },
    statLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
    },
    insightCard: {
      backgroundColor: theme.colors.green["20"],
      borderRadius: 16,
      padding: 20,
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.green["100"],
      marginBottom: 8,
    },
    insightText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.green["80"],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Patterns</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettings}
          accessible
          accessibilityLabel="Sleep settings"
          accessibilityRole="button"
          accessibilityHint="Opens sleep tracking settings"
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.averageCard}>
          <Text style={styles.averageLabel}>Average Sleep</Text>
          <Text style={styles.averageHours}>{averageSleep}h</Text>
          <Text style={styles.averageText}>Goal: {sleepGoal}h per night</Text>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Sleep Pattern</Text>
          <View style={styles.chart}>
            {/* LOW-NEW-002 FIX: Use day as stable key instead of index */}
            {weeklyData.map((item) => {
              const barHeight = (item.hours / 10) * 160;
              return (
                <View key={`sleep-${item.day}`} style={styles.barColumn}>
                  <View style={[styles.bar, { height: barHeight }]} />
                  <Text style={styles.dayLabel}>{item.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Best Night</Text>
            <Text style={styles.statValue}>8.5h</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Week</Text>
            <Text style={styles.statValue}>52h</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💡 Sleep Insight</Text>
          <Text style={styles.insightText}>
            Your sleep quality has improved by 15% this week! Try to maintain a
            consistent bedtime schedule.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
SleepPatternsScreen.displayName = 'SleepPatternsScreen';

export default SleepPatternsScreen;
