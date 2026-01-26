/**
 * MoodChart Component
 * @description Bar/line chart for mood visualization
 * @task Task 2.8.3: MoodChart Component
 *
 * Features:
 * - Weekly mood bar chart with emoji indicators
 * - Period selector (1 Day, 1 Week, 1 Month, 1 Year, All Time)
 * - Color-coded bars based on mood
 * - Interactive bar selection
 * - Full accessibility support
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import type {
  MoodChartProps,
  MoodDataPoint,
  TimePeriod,
} from "./MoodChart.types";
import {
  PERIOD_LABELS,
  getMoodChartColor,
  getMoodChartEmoji,
  calculateBarHeight,
} from "./MoodChart.types";

/**
 * Get full day name from label
 */
function getDayName(label: string): string {
  const dayNames: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  return dayNames[label] || label;
}

/**
 * Get mood label with capital first letter
 */
function formatMoodLabel(mood: string): string {
  return mood.charAt(0).toUpperCase() + mood.slice(1);
}

/**
 * Period Option Component
 */
interface PeriodOptionProps {
  period: TimePeriod;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

function PeriodOption({
  period,
  isSelected,
  onPress,
  disabled,
  testID,
}: PeriodOptionProps) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Select ${PERIOD_LABELS[period]} period`}
      accessibilityState={{ selected: isSelected }}
      style={[
        styles.periodOption,
        isSelected && styles.periodOptionSelected,
      ]}
    >
      <Text
        style={[
          styles.periodOptionText,
          isSelected && styles.periodOptionTextSelected,
        ]}
      >
        {PERIOD_LABELS[period]}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Period Selector Component
 */
interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange?: (period: TimePeriod) => void;
  disabled?: boolean;
  testID?: string;
}

function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  disabled,
  testID,
}: PeriodSelectorProps) {
  const periods: TimePeriod[] = ["1day", "1week", "1month", "1year", "alltime"];

  return (
    <ScrollView
      testID={testID}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.periodSelectorContent}
      style={styles.periodSelector}
    >
      {periods.map((period) => (
        <PeriodOption
          key={period}
          testID={`${testID?.replace("-period-selector", "")}-period-${period}`}
          period={period}
          isSelected={selectedPeriod === period}
          onPress={() => onPeriodChange?.(period)}
          disabled={disabled}
        />
      ))}
    </ScrollView>
  );
}

/**
 * Bar Component
 */
interface BarProps {
  point: MoodDataPoint;
  maxHeight: number;
  showEmoji?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  emojiTestID?: string;
}

function Bar({
  point,
  maxHeight,
  showEmoji,
  onPress,
  disabled,
  testID,
  emojiTestID,
}: BarProps) {
  const color = getMoodChartColor(point.mood);
  const emoji = getMoodChartEmoji(point.mood);
  const heightPercent = calculateBarHeight(point.value);
  const barHeight = (heightPercent / 100) * maxHeight;
  const dayName = getDayName(point.label);

  return (
    <View style={styles.barContainer}>
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${dayName}, ${formatMoodLabel(point.mood)} mood`}
        style={[
          styles.bar,
          {
            height: barHeight,
            backgroundColor: color,
          },
        ]}
      >
        {showEmoji && (
          <Text testID={emojiTestID} style={styles.barEmoji}>
            {emoji}
          </Text>
        )}
      </TouchableOpacity>
      <Text style={styles.barLabel}>{point.label}</Text>
    </View>
  );
}

/**
 * Skeleton Component
 */
interface SkeletonProps {
  testID?: string;
  height: number;
}

function ChartSkeleton({ testID, height }: SkeletonProps) {
  return (
    <View testID={testID} style={[styles.skeletonContainer, { height }]}>
      {[1, 2, 3, 4, 5, 6, 7].map((index) => (
        <View key={index} style={styles.skeletonBarContainer}>
          <View
            style={[
              styles.skeletonBar,
              { height: Math.random() * (height - 40) + 40 },
            ]}
          />
          <View style={styles.skeletonLabel} />
        </View>
      ))}
    </View>
  );
}

/**
 * Empty State Component
 */
function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No mood data available</Text>
    </View>
  );
}

/**
 * MoodChart Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MoodChart
 *   data={weeklyMoodData}
 *   onDataPointPress={(point) => showDetail(point)}
 * />
 *
 * // With period selector
 * <MoodChart
 *   data={moodData}
 *   period={selectedPeriod}
 *   onPeriodChange={handlePeriodChange}
 *   showEmoji
 * />
 * ```
 */
export function MoodChart({
  data,
  type = "bar",
  period = "1week",
  onPeriodChange,
  onDataPointPress,
  showPeriodSelector = true,
  showEmoji = true,
  height = 200,
  loading = false,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: MoodChartProps): React.ReactElement {
  if (loading) {
    return (
      <View
        testID={testID}
        accessibilityLabel={accessibilityLabel || "Mood chart"}
        style={[styles.container, style]}
      >
        {showPeriodSelector && (
          <PeriodSelector
            testID={`${testID}-period-selector`}
            selectedPeriod={period}
            disabled
          />
        )}
        <ChartSkeleton testID={`${testID}-skeleton`} height={height} />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View
        testID={testID}
        accessibilityLabel={accessibilityLabel || "Mood chart"}
        style={[styles.container, style]}
      >
        {showPeriodSelector && (
          <PeriodSelector
            testID={`${testID}-period-selector`}
            selectedPeriod={period}
            onPeriodChange={onPeriodChange}
            disabled={disabled}
          />
        )}
        <EmptyState />
      </View>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Mood chart"}
      accessibilityRole="image"
      style={[styles.container, style]}
    >
      {/* Period Selector */}
      {showPeriodSelector && (
        <PeriodSelector
          testID={`${testID}-period-selector`}
          selectedPeriod={period}
          onPeriodChange={onPeriodChange}
          disabled={disabled}
        />
      )}

      {/* Chart Area */}
      <View
        testID={`${testID}-area`}
        style={[styles.chartArea, { height }]}
      >
        {/* Grid lines */}
        <View style={styles.gridLines}>
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={styles.gridLine} />
          ))}
        </View>

        {/* Bars */}
        <View testID={`${testID}-bars`} style={styles.barsContainer}>
          {data.map((point, index) => (
            <Bar
              key={point.date}
              testID={`${testID}-bar-${index}`}
              emojiTestID={`${testID}-emoji-${index}`}
              point={point}
              maxHeight={height - 30}
              showEmoji={showEmoji}
              onPress={() => onDataPointPress?.(point)}
              disabled={disabled}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "flex-start",
    minHeight: 20,
    minWidth: 28,
    paddingTop: 4,
  },
  barContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  barEmoji: {
    fontSize: 16,
  },
  barLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 8,
  },
  barsContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
    paddingHorizontal: 8,
  },
  chartArea: {
    marginTop: 16,
    position: "relative",
  },
  container: {
    backgroundColor: "#334155",
    borderRadius: 16,
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    height: 200,
    justifyContent: "center",
  },
  emptyStateText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  gridLine: {
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    height: 1,
    width: "100%",
  },
  gridLines: {
    bottom: 30,
    justifyContent: "space-between",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  periodOption: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  periodOptionSelected: {
    backgroundColor: "#9AAD5C",
  },
  periodOptionText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
  },
  periodOptionTextSelected: {
    color: "#1C1410",
  },
  periodSelector: {
    marginBottom: 8,
  },
  periodSelectorContent: {
    gap: 8,
  },
  skeletonBar: {
    backgroundColor: "#475569",
    borderRadius: 8,
    width: 28,
  },
  skeletonBarContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  skeletonContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  skeletonLabel: {
    backgroundColor: "#475569",
    borderRadius: 4,
    height: 12,
    marginTop: 8,
    width: 24,
  },
});

export default MoodChart;
