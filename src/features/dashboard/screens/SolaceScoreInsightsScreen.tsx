/**
 * SolaceScoreInsightsScreen Component
 * @description Analytics view for Solace score trends and insights
 * @task Task 3.5.3: Solace Score Insights Screen (Screen 42)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { palette } from "../../../shared/theme";

type PeriodType = "Weekly" | "Monthly" | "Yearly";
type MoodType = "happy" | "sad" | "neutral" | "angry" | "meh";

interface ChartDataPoint {
  date: Date;
  positive: number;
  negative: number;
}

interface WeeklyMood {
  day: string;
  mood: MoodType;
}

interface SolaceScoreInsightsScreenProps {
  chartData: ChartDataPoint[];
  selectedPeriod: PeriodType;
  dateRange: {
    start: Date;
    end: Date;
  };
  weeklyMoods: WeeklyMood[];
  onBack: () => void;
  onToggleDarkMode: () => void;
  onHelpPress: () => void;
  onPeriodChange: (period: PeriodType) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
  onMoodHistoryOptions: () => void;
  onSwipeForSuggestions: () => void;
}

const formatDateLabel = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day} ${months[date.getMonth()]}`;
};

const getMoodEmoji = (mood: MoodType): string => {
  switch (mood) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "neutral":
      return "😐";
    case "angry":
      return "😤";
    case "meh":
      return "😑";
    default:
      return "😐";
  }
};

export function SolaceScoreInsightsScreen({
  chartData,
  selectedPeriod,
  dateRange,
  weeklyMoods,
  onBack,
  onToggleDarkMode,
  onHelpPress,
  onPeriodChange,
  onMoodHistoryOptions,
  onSwipeForSuggestions,
}: SolaceScoreInsightsScreenProps): React.ReactElement {
  const maxValue = Math.max(
    ...chartData.map((d) => d.positive + d.negative),
    100
  );

  return (
    <View testID="solace-score-insights-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="dark-mode-toggle"
          style={styles.darkModeToggle}
          onPress={onToggleDarkMode}
          accessibilityRole="button"
          accessibilityLabel="Toggle dark mode"
        >
          <Text style={styles.darkModeIcon}>🌙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.screenTitle}>Solace Score</Text>
              <Text style={styles.subtitle}>
                See your mental score insights
              </Text>
            </View>
            <TouchableOpacity
              testID="help-button"
              style={styles.helpButton}
              onPress={onHelpPress}
              accessibilityRole="button"
              accessibilityLabel="Get help"
            >
              <Text style={styles.helpButtonText}>?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Section */}
        <View testID="chart-section" style={styles.chartSection}>
          {/* Legend */}
          <View testID="chart-legend" style={styles.chartLegend}>
            <View style={styles.legendItems}>
              <View testID="legend-positive" style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
                />
                <Text style={styles.legendText}>Positive</Text>
              </View>
              <View testID="legend-negative" style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#E8853A" }]}
                />
                <Text style={styles.legendText}>Negative</Text>
              </View>
            </View>

            <TouchableOpacity
              testID="period-dropdown"
              style={styles.periodDropdown}
              onPress={() => onPeriodChange(selectedPeriod)}
              accessibilityRole="button"
              accessibilityLabel="Select period"
            >
              <Text style={styles.periodText}>{selectedPeriod}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Stacked Bar Chart */}
          <View testID="stacked-bar-chart" style={styles.barChart}>
            {chartData.map((point, index) => {
              const positiveHeight = (point.positive / maxValue) * 120;
              const negativeHeight = (point.negative / maxValue) * 120;
              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.bar}>
                    <View
                      style={[
                        styles.barPositive,
                        { height: positiveHeight },
                      ]}
                    />
                    <View
                      style={[
                        styles.barNegative,
                        { height: negativeHeight },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Timeline Scrubber */}
          <View testID="timeline-scrubber" style={styles.timelineScrubber}>
            <View style={styles.scrubberTrack}>
              <View style={styles.scrubberThumb} />
            </View>
          </View>

          {/* Date Range Labels */}
          <View style={styles.dateRangeLabels}>
            <Text style={styles.dateLabel}>
              {formatDateLabel(dateRange.start)}
            </Text>
            <Text style={styles.dateLabel}>
              {formatDateLabel(dateRange.end)}
            </Text>
          </View>
        </View>

        {/* Mood History Section */}
        <View style={styles.moodHistorySection}>
          <View style={styles.moodHistoryHeader}>
            <Text style={styles.moodHistoryTitle}>Mood History</Text>
            <TouchableOpacity
              testID="mood-history-options"
              style={styles.optionsButton}
              onPress={onMoodHistoryOptions}
              accessibilityRole="button"
              accessibilityLabel="Mood history options"
            >
              <Text style={styles.optionsIcon}>⋯</Text>
            </TouchableOpacity>
          </View>

          <View testID="weekly-mood-row" style={styles.weeklyMoodRow}>
            {weeklyMoods.map((item, index) => (
              <View key={index} style={styles.moodDay}>
                <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
                <Text style={styles.dayLabel}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* AI Suggestions Button */}
      <TouchableOpacity
        testID="ai-suggestions-button"
        style={styles.aiSuggestionsButton}
        onPress={onSwipeForSuggestions}
        accessibilityRole="button"
        accessibilityLabel="Swipe for AI suggestions"
      >
        <Text style={styles.swipeIcon}>》</Text>
        <Text style={styles.aiSuggestionsText}>Swipe for AI suggestions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  aiSuggestionsButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
    marginTop: 16,
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "90%",
  },
  aiSuggestionsText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
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
    fontSize: 18,
    fontWeight: "600",
  },
  bar: {
    alignItems: "flex-end",
    flexDirection: "column",
    height: 120,
    justifyContent: "flex-end",
    width: 32,
  },
  barChart: {
    alignItems: "flex-end",
    flexDirection: "row",
    height: 140,
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
  },
  barNegative: {
    backgroundColor: "#E8853A",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: "100%",
  },
  barPositive: {
    backgroundColor: "#4CAF50",
    width: "100%",
  },
  chartLegend: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  chartSection: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    marginBottom: 24,
    marginHorizontal: 24,
    padding: 16,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  content: {
    flex: 1,
  },
  darkModeIcon: {
    fontSize: 20,
  },
  darkModeToggle: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  dateLabel: {
    color: palette.gray[400],
    fontSize: 12,
  },
  dateRangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayLabel: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 4,
  },
  dropdownArrow: {
    color: palette.white,
    fontSize: 10,
    marginLeft: 4,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  helpButton: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 32,
  },
  helpButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  legendDot: {
    borderRadius: 4,
    height: 8,
    marginRight: 6,
    width: 8,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 16,
  },
  legendItems: {
    flexDirection: "row",
  },
  legendText: {
    color: palette.white,
    fontSize: 12,
  },
  moodDay: {
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodHistoryHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  moodHistorySection: {
    marginHorizontal: 24,
  },
  moodHistoryTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  optionsButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  optionsIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  periodDropdown: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  periodText: {
    color: palette.white,
    fontSize: 12,
  },
  screenTitle: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  scrubberThumb: {
    backgroundColor: palette.tan[500],
    borderRadius: 8,
    height: 16,
    width: 80,
  },
  scrubberTrack: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 4,
    height: 8,
    justifyContent: "center",
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 14,
  },
  swipeIcon: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "700",
  },
  timelineScrubber: {
    marginBottom: 8,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  weeklyMoodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SolaceScoreInsightsScreen;
