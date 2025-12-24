/**
 * Mindful Goals Screen - Daily Goals and Targets
 * Based on ui-designs/Dark-mode/🔒 Mindful Hours.png
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

export const MindfulGoalsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(20);

  const goalOptions = [5, 10, 15, 20, 30, 45, 60];

  const currentProgress = {
    todayMinutes: 15,
    goalMinutes: 20,
    streak: 7,
    weeklyTotal: 105,
    weeklyGoal: 140,
  };

  const weeklyProgress = [
    { day: "Mon", minutes: 15, completed: true },
    { day: "Tue", minutes: 20, completed: true },
    { day: "Wed", minutes: 10, completed: true },
    { day: "Thu", minutes: 25, completed: true },
    { day: "Fri", minutes: 20, completed: true },
    { day: "Sat", minutes: 0, completed: false },
    { day: "Sun", minutes: 15, completed: true },
  ];

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
    content: {
      flex: 1,
    },
    progressCard: {
      backgroundColor: theme.colors.purple["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      padding: 20,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    circularProgress: {
      alignItems: "center",
      marginBottom: 20,
    },
    circularProgressOuter: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: theme.colors.gray["20"],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    circularProgressInner: {
      alignItems: "center",
    },
    progressValue: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.purple["60"],
    },
    progressTarget: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    progressLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 16,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    goalSelector: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    goalSelectorTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
      textAlign: "center",
    },
    goalOptionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "center",
    },
    goalOption: {
      width: "30%",
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.gray["20"],
      alignItems: "center",
    },
    goalOptionSelected: {
      backgroundColor: theme.colors.purple["60"],
    },
    goalOptionText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    goalOptionTextSelected: {
      color: "#FFFFFF",
    },
    weeklyProgressCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
    },
    weeklyProgressTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    weeklyChart: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: 120,
      marginBottom: 8,
    },
    dayColumn: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    dayBar: {
      width: "80%",
      borderRadius: 4,
      marginBottom: 8,
    },
    dayBarCompleted: {
      backgroundColor: theme.colors.purple["60"],
    },
    dayBarIncomplete: {
      backgroundColor: theme.colors.gray["40"],
    },
    dayLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.text.secondary,
    },
    dayMinutes: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      marginBottom: 4,
    },
    saveButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const progressPercentage = Math.round(
    (currentProgress.todayMinutes / currentProgress.goalMinutes) * 100,
  );

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
        <Text style={styles.headerTitle}>Mindful Goals</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Today's Progress</Text>

          <View style={styles.circularProgress}>
            <View style={styles.circularProgressOuter}>
              <View style={styles.circularProgressInner}>
                <Text style={styles.progressValue}>
                  {currentProgress.todayMinutes}
                </Text>
                <Text style={styles.progressTarget}>
                  / {currentProgress.goalMinutes} min
                </Text>
              </View>
            </View>
            <Text style={styles.progressLabel}>
              {progressPercentage}% Complete
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentProgress.streak} 🔥</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {currentProgress.weeklyTotal}
              </Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentProgress.weeklyGoal}</Text>
              <Text style={styles.statLabel}>Weekly Goal</Text>
            </View>
          </View>
        </View>

        {/* Daily Goal Setting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Goal</Text>
          <View style={styles.goalSelector}>
            <Text style={styles.goalSelectorTitle}>
              Set your daily mindfulness target
            </Text>
            <View style={styles.goalOptionsGrid}>
              {goalOptions.map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.goalOption,
                    dailyGoalMinutes === minutes && styles.goalOptionSelected,
                  ]}
                  onPress={() => setDailyGoalMinutes(minutes)}
                >
                  <Text
                    style={[
                      styles.goalOptionText,
                      dailyGoalMinutes === minutes &&
                        styles.goalOptionTextSelected,
                    ]}
                  >
                    {minutes}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <View style={styles.weeklyProgressCard}>
            <Text style={styles.weeklyProgressTitle}>This Week's Progress</Text>
            <View style={styles.weeklyChart}>
              {/* LOW-NEW-002 FIX: Use day name as stable key instead of index */}
              {weeklyProgress.map((day) => (
                <View key={`progress-${day.day}`} style={styles.dayColumn}>
                  <Text style={styles.dayMinutes}>
                    {day.minutes > 0 ? `${day.minutes}m` : ""}
                  </Text>
                  <View
                    style={[
                      styles.dayBar,
                      day.completed
                        ? styles.dayBarCompleted
                        : styles.dayBarIncomplete,
                      {
                        height:
                          day.minutes > 0 ? `${(day.minutes / 30) * 100}%` : 8,
                      },
                    ]}
                  />
                  <Text style={styles.dayLabel}>{day.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Goal ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
MindfulGoalsScreen.displayName = 'MindfulGoalsScreen';

export default MindfulGoalsScreen;
