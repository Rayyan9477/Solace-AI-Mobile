/**
 * SleepInsightsScreen Component
 * @description Sleep analytics dashboard with time range tabs, timeline chart,
 *   chart legend, and AI-powered suggestion cards
 * @task Task 3.10.7: Sleep Insights Screen (Screen 95)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface Suggestion {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

interface SleepInsightsScreenProps {
  selectedRange: string;
  suggestions: Suggestion[];
  onBack: () => void;
  onRangeChange: (range: string) => void;
  onSuggestionPress: (id: string) => void;
  onSeeAllPress: () => void;
}

const colors = {
  background: "#1C1410",
  cardBg: "#2A1F18",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  tabBorder: "rgba(255,255,255,0.3)",
  selectedTabBorder: "#FFFFFF",
  coreGreen: "#9AAD5C",
  remOrange: "#E8853A",
  postREM: "#C4A535",
  seeAllColor: "#4A9E8C",
  chevronColor: "rgba(255,255,255,0.3)",
  chartBarBg: "#3D2E23",
} as const;

const TIME_RANGES = ["1 Day", "1 Week", "1 Month", "1 Year", "All Time"];
const TIME_LABELS = ["11:00", "12:00", "13:00", "14:00", "15:00"];

const LEGEND_ITEMS = [
  { label: "Core", color: colors.coreGreen },
  { label: "REM", color: colors.remOrange },
  { label: "Post-REM", color: colors.postREM },
];

export function SleepInsightsScreen({
  selectedRange,
  suggestions,
  onBack,
  onRangeChange,
  onSuggestionPress,
  onSeeAllPress,
}: SleepInsightsScreenProps): React.ReactElement {
  return (
    <View testID="sleep-insights-screen" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>{"\u263E"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Sleep Insights</Text>

        {/* Time Range Selector */}
        <View testID="time-range-selector" style={styles.timeRangeSelector}>
          {TIME_RANGES.map((range) => {
            const isSelected = range === selectedRange;
            return (
              <TouchableOpacity
                key={range}
                testID={`time-range-tab-${range}`}
                style={[
                  styles.timeRangeTab,
                  isSelected && styles.timeRangeTabSelected,
                ]}
                onPress={() => onRangeChange(range)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${range} range`}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    isSelected && styles.timeRangeTextSelected,
                  ]}
                >
                  {range}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sleep Timeline Chart */}
        <View testID="sleep-timeline-chart" style={styles.chartCard}>
          {/* Irregularity Marker */}
          <View testID="irregularity-marker" style={styles.irregularityMarker}>
            <Text style={styles.irregularityText}>Sleep Irregularity</Text>
          </View>

          {/* Chart Bars */}
          <View style={styles.chartBars}>
            <View
              style={[
                styles.chartBar,
                { backgroundColor: colors.coreGreen, width: "60%" },
              ]}
            />
            <View
              style={[
                styles.chartBar,
                {
                  backgroundColor: colors.remOrange,
                  width: "30%",
                  marginLeft: "60%",
                },
              ]}
            />
            <View
              style={[
                styles.chartBar,
                {
                  backgroundColor: colors.postREM,
                  width: "20%",
                  marginLeft: "70%",
                },
              ]}
            />
          </View>

          {/* Time Axis */}
          <View style={styles.timeAxis}>
            {TIME_LABELS.map((label) => (
              <Text key={label} style={styles.timeLabel}>
                {label}
              </Text>
            ))}
          </View>

          {/* Legend */}
          <View testID="chart-legend" style={styles.legend}>
            {LEGEND_ITEMS.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Suggestions Header */}
        <View style={styles.suggestionsHeader}>
          <Text style={styles.suggestionsTitle}>AI Suggestions</Text>
          <TouchableOpacity
            testID="see-all-button"
            onPress={onSeeAllPress}
            accessibilityRole="button"
            accessibilityLabel="See all suggestions"
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestion Cards */}
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            testID={`suggestion-card-${suggestion.id}`}
            style={styles.suggestionCard}
            onPress={() => onSuggestionPress(suggestion.id)}
            accessibilityRole="button"
            accessibilityLabel={`${suggestion.title}: ${suggestion.description}`}
          >
            <View
              testID={`suggestion-icon-${suggestion.id}`}
              style={[
                styles.suggestionIconBadge,
                { backgroundColor: suggestion.iconColor },
              ]}
            >
              <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            </View>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionDescription}>
                {suggestion.description}
              </Text>
            </View>
            <Text
              testID={`suggestion-chevron-${suggestion.id}`}
              style={styles.chevron}
            >
              {"\u203A"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  chartBar: {
    borderRadius: 4,
    height: 12,
    marginBottom: 4,
    position: "absolute",
  },
  chartBars: {
    height: 48,
    marginTop: 16,
    position: "relative",
  },
  chartCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 20,
    padding: 16,
  },
  chevron: {
    color: colors.chevronColor,
    fontSize: 24,
    fontWeight: "300",
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  irregularityMarker: {
    alignSelf: "flex-end",
    backgroundColor: colors.chartBarBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  irregularityText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginTop: 12,
  },
  legendDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: 48,
  },
  scrollView: {
    flex: 1,
  },
  seeAllText: {
    color: colors.seeAllColor,
    fontSize: 14,
    fontWeight: "600",
  },
  suggestionCard: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 24,
    paddingVertical: 14,
  },
  suggestionContent: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  suggestionIcon: {
    fontSize: 16,
  },
  suggestionIconBadge: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  suggestionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  suggestionsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    paddingHorizontal: 24,
  },
  suggestionsTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  timeAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  timeRangeSelector: {
    flexDirection: "row",
    gap: 4,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  timeRangeTab: {
    borderColor: "transparent",
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeRangeTabSelected: {
    borderColor: colors.selectedTabBorder,
    borderWidth: 1,
  },
  timeRangeText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  timeRangeTextSelected: {
    color: colors.white,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    paddingHorizontal: 24,
  },
});

export default SleepInsightsScreen;
