/**
 * StressLevelStatsScreen Component
 * @description Bubble chart visualization of stress level distribution with
 *   color-coded legend, proportional bubbles, and period selector
 * @task Task 3.11.7: Stress Level Stats Screen (Screen 103)
 * Note: Fixes "Montlhy" typo to "Monthly"
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StressBubble {
  level: string;
  count: number;
  color: string;
}

interface StressLevelStatsScreenProps {
  bubbles: StressBubble[];
  selectedPeriod: string;
  onBack: () => void;
  onSettingsPress: () => void;
  onPeriodChange: () => void;
  onBubblePress: (level: string) => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  periodBg: "#2A1F18",
} as const;

// Legend items with colors
const LEGEND_ITEMS = [
  { label: "Calm", color: "#9AAD5C" },
  { label: "Normal", color: "#6B6B6B" },
  { label: "Elevated", color: "#C4A535" },
  { label: "Stressed", color: "#E8853A" },
  { label: "Extreme", color: "#7B68B5" },
];

// Bubble layout positions (percentage-based)
const BUBBLE_POSITIONS: Record<string, { left: string; top: string }> = {
  Calm: { left: "10%", top: "55%" },
  Stressed: { left: "25%", top: "10%" },
  Normal: { left: "60%", top: "25%" },
  Elevated: { left: "2%", top: "20%" },
  Extreme: { left: "65%", top: "70%" },
};

const MIN_BUBBLE_SIZE = 60;
const MAX_BUBBLE_SIZE = 200;

function getBubbleSize(count: number, maxCount: number): number {
  if (maxCount === 0) return MIN_BUBBLE_SIZE;
  const ratio = count / maxCount;
  return MIN_BUBBLE_SIZE + ratio * (MAX_BUBBLE_SIZE - MIN_BUBBLE_SIZE);
}

export function StressLevelStatsScreen({
  bubbles,
  selectedPeriod,
  onBack,
  onSettingsPress,
  onPeriodChange,
  onBubblePress,
}: StressLevelStatsScreenProps): React.ReactElement {
  const maxCount = Math.max(...bubbles.map((b) => b.count), 1);

  return (
    <View testID="stress-level-stats-screen" style={styles.container}>
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
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          testID="settings-button"
          style={styles.settingsButton}
          onPress={onSettingsPress}
          accessibilityRole="button"
          accessibilityLabel="Stress settings"
        >
          <Text style={styles.settingsIcon}>{"\u2699\uFE0F"}</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text testID="screen-title" style={styles.title}>
        Stress Level Stats
      </Text>

      {/* Legend */}
      <View testID="stress-legend" style={styles.legend}>
        <View style={styles.legendRow}>
          {LEGEND_ITEMS.slice(0, 3).map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View
                testID={`legend-dot-${item.label}`}
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legendRow}>
          {LEGEND_ITEMS.slice(3).map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View
                testID={`legend-dot-${item.label}`}
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bubble Chart */}
      <View testID="bubble-chart" style={styles.bubbleChart}>
        {bubbles.map((bubble) => {
          const size = getBubbleSize(bubble.count, maxCount);
          const position = BUBBLE_POSITIONS[bubble.level] || {
            left: "30%",
            top: "30%",
          };
          return (
            <TouchableOpacity
              key={bubble.level}
              testID={`stress-bubble-${bubble.level}`}
              style={[
                styles.bubble,
                {
                  backgroundColor: bubble.color,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  left: position.left,
                  top: position.top,
                },
              ]}
              onPress={() => onBubblePress(bubble.level)}
              accessibilityRole="button"
              accessibilityLabel={`${bubble.level}: ${bubble.count} entries`}
            >
              <Text style={styles.bubbleValue}>{bubble.count}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        <TouchableOpacity
          testID="period-selector"
          style={styles.periodSelector}
          onPress={onPeriodChange}
          accessibilityRole="button"
          accessibilityLabel={`Time period: ${selectedPeriod}`}
        >
          <Text style={styles.periodIcon}>{"\uD83D\uDCC5"}</Text>
          <Text style={styles.periodText}>{selectedPeriod}</Text>
          <Text style={styles.periodArrow}>{"\u25BE"}</Text>
        </TouchableOpacity>
      </View>
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
  bubble: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  bubbleChart: {
    flex: 1,
    position: "relative",
  },
  bubbleValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  legend: {
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginRight: 16,
  },
  legendLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "500",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  periodArrow: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  periodContainer: {
    alignItems: "center",
    paddingBottom: 48,
    paddingTop: 12,
  },
  periodIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  periodSelector: {
    alignItems: "center",
    backgroundColor: colors.periodBg,
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  periodText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  settingsButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  settingsIcon: {
    fontSize: 24,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 8,
    paddingHorizontal: 24,
  },
});

export default StressLevelStatsScreen;
