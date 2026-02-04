/**
 * MoodStatsScreen Component
 * @description Detailed mood statistics with line graph, time range filtering, and emoji calendar
 * @task Task 3.8.2: Mood Stats Screen (Screen 68)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface ChartDataPoint {
  date: string;
  value: number;
  emoji: string;
}

interface WeeklyEmoji {
  day: string;
  emoji: string;
}

interface MoodStatsScreenProps {
  selectedTimeRange: string;
  timeRanges: string[];
  chartData: ChartDataPoint[];
  weeklyEmojis: WeeklyEmoji[];
  sortOrder: "newest" | "oldest";
  trendDescription: string;
  onBack: () => void;
  onTimeRangeChange: (range: string) => void;
  onDataPointPress: (point: ChartDataPoint) => void;
  onSortChange: () => void;
  onAddMood: () => void;
  onDayPress: (entry: WeeklyEmoji) => void;
}

export function MoodStatsScreen({
  selectedTimeRange,
  timeRanges,
  chartData,
  weeklyEmojis,
  sortOrder,
  trendDescription,
  onBack,
  onTimeRangeChange,
  onSortChange,
  onAddMood,
  onDayPress,
}: MoodStatsScreenProps): React.ReactElement {
  return (
    <View testID="mood-stats-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Mood Statistics</Text>
        <TouchableOpacity
          testID="sort-button"
          style={styles.sortButton}
          onPress={onSortChange}
          accessibilityRole="button"
          accessibilityLabel="Change sort order"
        >
          <Text style={styles.sortIcon}>↕</Text>
          <Text style={styles.sortLabel}>
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <ScrollView
          testID="time-range-selector"
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeRangeContainer}
          contentContainerStyle={styles.timeRangeContent}
        >
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range}
              testID={`time-range-${range}`}
              style={[
                styles.timeRangeChip,
                selectedTimeRange === range && styles.timeRangeChipActive,
              ]}
              onPress={() => onTimeRangeChange(range)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${range} range`}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  selectedTimeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mood Line Chart */}
        <View testID="mood-line-chart" style={styles.chartContainer}>
          <View style={styles.chartArea}>
            {chartData.map((point, index) => (
              <TouchableOpacity
                key={point.date}
                testID={`chart-data-point-${index}`}
                style={[
                  styles.dataPoint,
                  {
                    bottom: `${point.value}%`,
                    left: `${(index / Math.max(chartData.length - 1, 1)) * 100}%`,
                  },
                ]}
                onPress={() => onDayPress}
                accessibilityLabel={`${point.date}: ${point.emoji}`}
              >
                <View style={styles.dataPointDot} />
              </TouchableOpacity>
            ))}
            {/* Gradient fill placeholder */}
            <View style={styles.chartGradient} />
          </View>
        </View>

        {/* Trend Description */}
        <View style={styles.trendContainer}>
          <Text style={styles.trendText}>{trendDescription}</Text>
        </View>

        {/* Emoji Calendar Row */}
        <View testID="emoji-calendar-row" style={styles.emojiCalendarRow}>
          {weeklyEmojis.map((entry) => (
            <TouchableOpacity
              key={entry.day}
              testID={`emoji-day-${entry.day}`}
              style={styles.emojiDayColumn}
              onPress={() => onDayPress(entry)}
              accessibilityRole="button"
              accessibilityLabel={`${entry.day}: ${entry.emoji}`}
            >
              <Text style={styles.emojiDayEmoji}>{entry.emoji}</Text>
              <Text style={styles.emojiDayLabel}>{entry.day}</Text>
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
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
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
  chartArea: {
    height: 180,
    position: "relative",
    width: "100%",
  },
  chartContainer: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
  },
  chartGradient: {
    backgroundColor: `${palette.onboarding.step2}${palette.alpha[10]}`,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    bottom: 0,
    height: "60%",
    left: 0,
    position: "absolute",
    right: 0,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  content: {
    flex: 1,
  },
  dataPoint: {
    position: "absolute",
    zIndex: 1,
  },
  dataPointDot: {
    backgroundColor: palette.onboarding.step2,
    borderColor: palette.white,
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    width: 12,
  },
  emojiCalendarRow: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
  },
  emojiDayColumn: {
    alignItems: "center",
  },
  emojiDayEmoji: {
    fontSize: 20,
  },
  emojiDayLabel: {
    color: palette.gray[400],
    fontSize: 11,
    marginTop: 4,
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
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  sortButton: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 8,
  },
  sortIcon: {
    color: palette.gray[400],
    fontSize: 14,
    marginRight: 4,
  },
  sortLabel: {
    color: palette.gray[400],
    fontSize: 14,
  },
  timeRangeChip: {
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  timeRangeChipActive: {
    backgroundColor: palette.onboarding.step2,
    borderColor: palette.onboarding.step2,
  },
  timeRangeContainer: {
    maxHeight: 60,
  },
  timeRangeContent: {
    paddingHorizontal: 24,
  },
  timeRangeText: {
    color: palette.gray[400],
    fontSize: 14,
  },
  timeRangeTextActive: {
    color: palette.white,
    fontWeight: "600",
  },
  trendContainer: {
    marginHorizontal: 24,
    marginTop: 12,
  },
  trendText: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
  },
});

export default MoodStatsScreen;
