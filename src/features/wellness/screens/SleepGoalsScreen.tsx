/**
 * Sleep Goals Screen - Set Target Sleep Hours
 * Based on ui-designs/Dark-mode/🔒 Sleep Quality.png
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

interface SleepGoal {
  id: string;
  title: string;
  hours: number;
  description: string;
  recommended: boolean;
}

export const SleepGoalsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedGoal, setSelectedGoal] = useState<string>("2");
  const [customHours, setCustomHours] = useState(8);

  const sleepGoals: SleepGoal[] = [
    {
      id: "1",
      title: "Recovery Mode",
      hours: 9,
      description: "Extended sleep for maximum recovery",
      recommended: false,
    },
    {
      id: "2",
      title: "Optimal Health",
      hours: 8,
      description: "Recommended for most adults",
      recommended: true,
    },
    {
      id: "3",
      title: "Moderate",
      hours: 7,
      description: "Minimum for healthy functioning",
      recommended: false,
    },
    {
      id: "4",
      title: "Light Sleeper",
      hours: 6,
      description: "Below recommended amount",
      recommended: false,
    },
  ];

  const currentProgress = {
    averageSleep: 7.5,
    goalHours: 8,
    progressPercentage: 94,
    daysOnTrack: 18,
    totalDays: 30,
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
    progressStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    progressStat: {
      alignItems: "center",
    },
    progressValue: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    progressLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    progressBarContainer: {
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.gray["20"],
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 6,
    },
    progressText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
      textAlign: "center",
      marginTop: 8,
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
    goalCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "transparent",
    },
    goalCardSelected: {
      borderColor: theme.colors.purple["60"],
      backgroundColor: theme.colors.purple["10"],
    },
    goalCardRecommended: {
      borderColor: theme.colors.green["60"],
    },
    goalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    goalTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    goalHours: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.purple["60"],
    },
    goalDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    recommendedBadge: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.green["60"],
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    recommendedText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    customGoalCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 20,
      marginBottom: 12,
    },
    customGoalTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
      textAlign: "center",
    },
    sliderContainer: {
      alignItems: "center",
    },
    sliderValue: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.purple["60"],
      marginBottom: 8,
    },
    sliderLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 16,
    },
    sliderControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
    },
    sliderButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.purple["60"],
      justifyContent: "center",
      alignItems: "center",
    },
    sliderButtonText: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    sliderTrack: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.gray["20"],
    },
    tipsCard: {
      backgroundColor: theme.colors.blue["20"],
      marginHorizontal: 20,
      marginTop: 24,
      borderRadius: 16,
      padding: 16,
    },
    tipsTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    tipItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    tipIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    tipText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
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
        <Text style={styles.headerTitle}>Sleep Goals</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress This Month</Text>

          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>
                {currentProgress.averageSleep}h
              </Text>
              <Text style={styles.progressLabel}>Avg Sleep</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>
                {currentProgress.goalHours}h
              </Text>
              <Text style={styles.progressLabel}>Goal</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>
                {currentProgress.daysOnTrack}
              </Text>
              <Text style={styles.progressLabel}>Days On Track</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${currentProgress.progressPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentProgress.progressPercentage}% of your goal achieved
          </Text>
        </View>

        {/* Preset Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Goal</Text>
          {sleepGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoal === goal.id && styles.goalCardSelected,
                goal.recommended && styles.goalCardRecommended,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalHours}>{goal.hours}h</Text>
              </View>
              <Text style={styles.goalDescription}>{goal.description}</Text>
              {goal.recommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>✓ RECOMMENDED</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Custom Goal */}
          <View style={styles.customGoalCard}>
            <Text style={styles.customGoalTitle}>Custom Goal</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{customHours}h</Text>
              <Text style={styles.sliderLabel}>hours per night</Text>
              <View style={styles.sliderControls}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => setCustomHours(Math.max(4, customHours - 0.5))}
                >
                  <Text style={styles.sliderButtonText}>−</Text>
                </TouchableOpacity>
                <View style={styles.sliderTrack} />
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() =>
                    setCustomHours(Math.min(12, customHours + 0.5))
                  }
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Sleep Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Sleep Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>•</Text>
            <Text style={styles.tipText}>
              Maintain consistent sleep and wake times
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>•</Text>
            <Text style={styles.tipText}>
              Create a relaxing bedtime routine
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>•</Text>
            <Text style={styles.tipText}>Avoid screens 1 hour before bed</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>•</Text>
            <Text style={styles.tipText}>Keep your bedroom cool and dark</Text>
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

export default SleepGoalsScreen;
