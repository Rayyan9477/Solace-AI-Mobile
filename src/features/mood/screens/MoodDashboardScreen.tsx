/**
 * MoodDashboardScreen Component
 * @description Main mood tracking dashboard with current mood hero and weekly chart
 * @task Task 3.8.1: Mood Dashboard Screen (Screen 67)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface MoodData {
  emoji: string;
  label: string;
  color: string;
}

interface WeeklyMoodEntry {
  day: string;
  emoji: string;
  value: number;
  color: string;
}

interface MoodDashboardScreenProps {
  currentMood: MoodData;
  weeklyData: WeeklyMoodEntry[];
  onBack: () => void;
  onFilter: () => void;
  onStatistics: () => void;
  onSelectMood: () => void;
  onDayPress: (entry: WeeklyMoodEntry) => void;
  onAddMood: () => void;
}

export function MoodDashboardScreen({
  currentMood,
  weeklyData,
  onBack,
  onFilter,
  onStatistics,
  onDayPress,
  onAddMood,
}: MoodDashboardScreenProps): React.ReactElement {
  return (
    <View
      testID="mood-dashboard-screen"
      style={styles.container}
    >
      {/* Hero Section */}
      <View
        testID="mood-hero-section"
        style={[styles.heroSection, { backgroundColor: currentMood.color }]}
      >
        {/* Decorative Circles */}
        <View testID="decorative-circles" style={styles.decorativeCircles}>
          <View style={[styles.circle, styles.circleOne]} />
          <View style={[styles.circle, styles.circleTwo]} />
          <View style={[styles.circle, styles.circleThree]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backButtonIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood Tracker</Text>
          <TouchableOpacity
            testID="statistics-button"
            style={styles.statisticsButton}
            onPress={onStatistics}
            accessibilityRole="button"
            accessibilityLabel="View mood statistics"
          >
            <Text style={styles.statisticsIcon}>📊</Text>
          </TouchableOpacity>
        </View>

        {/* Large Mood Display */}
        <View style={styles.moodDisplay}>
          <Text style={styles.moodEmoji}>{currentMood.emoji}</Text>
          <Text style={styles.moodLabel}>{currentMood.label}</Text>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <Text style={styles.sectionHeader}>Weekly Mood</Text>
          <TouchableOpacity
            testID="filter-button"
            style={styles.filterButton}
            onPress={onFilter}
            accessibilityRole="button"
            accessibilityLabel="Filter moods"
          >
            <Text style={styles.filterIcon}>🔍</Text>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Mood Chart */}
        <View testID="weekly-mood-chart" style={styles.chartContainer}>
          {weeklyData.map((entry) => (
            <TouchableOpacity
              key={entry.day}
              testID={`mood-bar-${entry.day}`}
              style={styles.barColumn}
              onPress={() => onDayPress(entry)}
              accessibilityRole="button"
              accessibilityLabel={`${entry.day}: ${entry.emoji}`}
            >
              <Text
                testID={`mood-bar-emoji-${entry.day}`}
                style={styles.barEmoji}
              >
                {entry.emoji}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${entry.value}%`,
                      backgroundColor: entry.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barDayLabel}>{entry.day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        testID="add-mood-button"
        style={styles.fab}
        onPress={onAddMood}
        accessibilityRole="button"
        accessibilityLabel="Add mood entry"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
  },
  barDayLabel: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 6,
  },
  barEmoji: {
    fontSize: 16,
    marginBottom: 6,
  },
  barFill: {
    borderRadius: 4,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  barTrack: {
    backgroundColor: palette.brown[800],
    borderRadius: 4,
    height: 100,
    overflow: "hidden",
    position: "relative",
    width: 24,
  },
  chartContainer: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    marginHorizontal: 24,
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  circle: {
    borderColor: `${palette.white}${palette.alpha[15]}`,
    borderRadius: 100,
    borderWidth: 1,
    position: "absolute",
  },
  circleOne: {
    height: 200,
    right: -50,
    top: -30,
    width: 200,
  },
  circleThree: {
    bottom: -40,
    height: 120,
    left: 40,
    width: 120,
  },
  circleTwo: {
    height: 150,
    left: -40,
    top: 40,
    width: 150,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  decorativeCircles: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  fab: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 28,
    bottom: 32,
    elevation: 4,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    right: 24,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 56,
  },
  fabIcon: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "600",
  },
  filterButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    color: palette.white,
    fontSize: 14,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  heroSection: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    paddingBottom: 32,
  },
  moodDisplay: {
    alignItems: "center",
    marginTop: 20,
  },
  moodEmoji: {
    fontSize: 64,
  },
  moodLabel: {
    color: palette.white,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  sectionHeader: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  statisticsButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  statisticsIcon: {
    fontSize: 18,
  },
});

export default MoodDashboardScreen;
