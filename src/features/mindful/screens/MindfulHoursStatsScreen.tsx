/**
 * MindfulHoursStatsScreen Component
 * @description Analytics view with donut chart, total hours, category breakdown,
 *   settings/download buttons, and FAB
 * @task Task 3.12.2: Mindful Hours Stats Screen (Screen 105)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface CategoryStat {
  category: string;
  hours: string;
  percentage: string;
  color: string;
}

interface MindfulHoursStatsScreenProps {
  totalHours: string;
  categories: CategoryStat[];
  onBack: () => void;
  onSettingsPress: () => void;
  onDownloadPress: () => void;
  onAddPress: () => void;
  onCategoryPress: (category: string) => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  chartTrack: "#2A1F18",
  fabBg: "#5C4A2A",
  buttonBorder: "rgba(255,255,255,0.2)",
} as const;

export function MindfulHoursStatsScreen({
  totalHours,
  categories,
  onBack,
  onSettingsPress,
  onDownloadPress,
  onAddPress,
  onCategoryPress,
}: MindfulHoursStatsScreenProps): React.ReactElement {
  return (
    <View testID="mindful-hours-stats-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Mindful Hours Stats</Text>
      </View>

      {/* Donut Chart */}
      <View testID="donut-chart" style={styles.donutChart}>
        {/* Chart segments (visual placeholders) */}
        {categories.map((cat) => (
          <View
            key={cat.category}
            testID={`chart-segment-${cat.category}`}
            style={[styles.chartSegment, { borderColor: cat.color }]}
          />
        ))}

        {/* Center Display */}
        <View style={styles.chartCenter}>
          <Text testID="chart-total-hours" style={styles.chartTotalHours}>
            {totalHours}
          </Text>
          <Text style={styles.chartTotalLabel}>Total</Text>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          testID="settings-button"
          style={styles.actionButton}
          onPress={onSettingsPress}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Text style={styles.actionIcon}>{"\u2699\uFE0F"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="download-button"
          style={styles.actionButton}
          onPress={onDownloadPress}
          accessibilityRole="button"
          accessibilityLabel="Download data"
        >
          <Text style={styles.actionIcon}>{"\u2B07\uFE0F"}</Text>
        </TouchableOpacity>
      </View>

      {/* Category Breakdown */}
      <ScrollView
        style={styles.categoryList}
        contentContainerStyle={styles.categoryListContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.category}
            testID={`category-row-${cat.category}`}
            style={styles.categoryRow}
            onPress={() => onCategoryPress(cat.category)}
            accessibilityRole="button"
            accessibilityLabel={`${cat.category}: ${cat.hours}, ${cat.percentage}`}
          >
            <View
              testID={`category-dot-${cat.category}`}
              style={[styles.categoryDot, { backgroundColor: cat.color }]}
            />
            <Text style={styles.categoryLabel}>{cat.category}</Text>
            <Text style={styles.categoryHours}>{cat.hours}</Text>
            <Text style={styles.categoryPercent}>{cat.percentage}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          testID="add-button"
          style={styles.fabButton}
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel="Add new exercise"
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderColor: colors.buttonBorder,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
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
  categoryDot: {
    borderRadius: 5,
    height: 10,
    marginRight: 12,
    width: 10,
  },
  categoryHours: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  categoryLabel: {
    color: colors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  categoryList: {
    flex: 1,
    marginTop: 16,
  },
  categoryListContent: {
    paddingBottom: 80,
    paddingHorizontal: 24,
  },
  categoryPercent: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  categoryRow: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  chartCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartSegment: {
    borderRadius: 4,
    borderWidth: 2,
    height: 8,
    position: "absolute",
    width: 8,
  },
  chartTotalHours: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "800",
  },
  chartTotalLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  donutChart: {
    alignItems: "center",
    height: 240,
    justifyContent: "center",
    marginTop: 16,
  },
  fabButton: {
    alignItems: "center",
    backgroundColor: colors.fabBg,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  fabContainer: {
    alignItems: "center",
    bottom: 32,
    left: 0,
    position: "absolute",
    right: 0,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default MindfulHoursStatsScreen;
