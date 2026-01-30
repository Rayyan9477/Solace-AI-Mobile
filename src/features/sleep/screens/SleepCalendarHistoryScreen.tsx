/**
 * SleepCalendarHistoryScreen Component
 * @description Sleep calendar with month navigation, day selection, legend, AI suggestions card, and sleep history list
 * @task Task 3.10.3: Sleep Calendar History Screen (Screen 89)
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

interface CalendarDay {
  date: number;
  isSelected: boolean;
  isToday: boolean;
  hasSchedule: boolean;
  hasAutomatic: boolean;
  hasRemSleep: boolean;
}

interface SleepHistoryEntry {
  id: string;
  month: string;
  day: number;
  duration: number;
  qualityBadge: { label: string; color: string };
  suggestionsCount: number;
  heartRate?: number;
  hasIrregularity: boolean;
}

interface SleepCalendarHistoryScreenProps {
  monthLabel: string;
  calendarDays: CalendarDay[];
  weekDays: string[];
  sleepHistory: SleepHistoryEntry[];
  suggestionsCount: number;
  onBack: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayPress: (date: number) => void;
  onSuggestionsSeeAll: () => void;
  onHistorySeeAll: () => void;
  onHistoryItemPress: (id: string) => void;
  onSuggestionsCardPress: () => void;
  onAddSleep: () => void;
}

const colors = {
  background: "#1C1410",
  cardBg: "#2A1F19",
  border: "#3D2E23",
  white: "#FFFFFF",
  gray: "#94A3B8",
  tan: "#C4A574",
  green: "#9AAD5C",
  orange: "#E8853A",
  fabGreen: "#9AAD5C",
  insomniacPurple: "#7B68B5",
  coreGray: "#6B6B6B",
} as const;

const legendItems = [
  { key: "schedule", label: "Schedule", color: colors.green },
  { key: "automatic", label: "Automatic", color: colors.orange },
  { key: "rem-sleep", label: "REM Sleep", color: colors.insomniacPurple },
] as const;

export function SleepCalendarHistoryScreen({
  monthLabel,
  calendarDays,
  weekDays,
  sleepHistory,
  suggestionsCount,
  onBack,
  onPrevMonth,
  onNextMonth,
  onDayPress,
  onSuggestionsSeeAll,
  onHistorySeeAll,
  onHistoryItemPress,
  onSuggestionsCardPress,
  onAddSleep,
}: SleepCalendarHistoryScreenProps): React.ReactElement {
  return (
    <View testID="sleep-calendar-history-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>☽</Text>
          </TouchableOpacity>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNavRow}>
          <TouchableOpacity
            testID="prev-month-button"
            style={styles.monthNavButton}
            onPress={onPrevMonth}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
          >
            <Text style={styles.monthNavArrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <TouchableOpacity
            testID="next-month-button"
            style={styles.monthNavButton}
            onPress={onNextMonth}
            accessibilityRole="button"
            accessibilityLabel="Next month"
          >
            <Text style={styles.monthNavArrow}>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View testID="calendar-grid" style={styles.calendarGrid}>
          {/* Weekday Headers */}
          <View style={styles.weekDayRow}>
            {weekDays.map((day) => (
              <View key={day} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Day Cells */}
          <View style={styles.daysContainer}>
            {calendarDays.map((calDay) => (
              <TouchableOpacity
                key={calDay.date}
                testID={`calendar-day-${calDay.date}`}
                style={[
                  styles.dayCell,
                  calDay.isSelected ? styles.dayCellSelected : styles.dayCellDefault,
                ]}
                onPress={() => onDayPress(calDay.date)}
                accessibilityRole="button"
                accessibilityLabel={`Day ${calDay.date}${calDay.isSelected ? ", selected" : ""}${calDay.isToday ? ", today" : ""}`}
              >
                <Text
                  style={[
                    styles.dayText,
                    calDay.isSelected ? styles.dayTextSelected : styles.dayTextDefault,
                  ]}
                >
                  {calDay.date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Calendar Legend */}
        <View style={styles.legendContainer}>
          {legendItems.map((item) => (
            <View key={item.key} style={styles.legendItem}>
              <View
                testID={`legend-dot-${item.key}`}
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Sleep AI Suggestions Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderText}>Sleep AI Suggestions</Text>
            <TouchableOpacity
              testID="suggestions-see-all"
              onPress={onSuggestionsSeeAll}
              accessibilityRole="button"
              accessibilityLabel="See all sleep AI suggestions"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            testID="suggestions-card"
            style={styles.suggestionsCard}
            onPress={onSuggestionsCardPress}
            accessibilityRole="button"
            accessibilityLabel={`${suggestionsCount}+ Sleep Patterns`}
          >
            <View style={styles.suggestionsCardContent}>
              <View style={styles.suggestionsTextContainer}>
                <Text style={styles.suggestionsCountText}>{`${suggestionsCount}+`}</Text>
                <Text style={styles.suggestionsTitleText}>Sleep Patterns</Text>
              </View>
              <Text style={styles.suggestionsArrow}>{">"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sleep History Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderText}>Sleep History</Text>
            <TouchableOpacity
              testID="history-see-all"
              onPress={onHistorySeeAll}
              accessibilityRole="button"
              accessibilityLabel="See all sleep history"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {sleepHistory.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              testID={`history-item-${entry.id}`}
              style={styles.historyItem}
              onPress={() => onHistoryItemPress(entry.id)}
              accessibilityRole="button"
              accessibilityLabel={`Sleep entry ${entry.month} ${entry.day}, ${entry.duration} hours, ${entry.qualityBadge.label}`}
            >
              {/* Date Column */}
              <View style={styles.historyDateColumn}>
                <Text style={styles.historyDateText}>{`${entry.month} ${entry.day}`}</Text>
              </View>

              {/* Details Column */}
              <View style={styles.historyDetailsColumn}>
                <Text style={styles.historyDurationText}>
                  {`You slept for ${entry.duration}h`}
                </Text>
                <View style={styles.historyMetaRow}>
                  <Text style={styles.historySuggestionsText}>
                    {entry.suggestionsCount > 0
                      ? `${entry.suggestionsCount} Suggestions`
                      : "No Suggestions"}
                  </Text>
                  {entry.heartRate !== undefined && (
                    <Text style={styles.historyHeartRateText}>
                      {`${entry.heartRate} bpm`}
                    </Text>
                  )}
                </View>
              </View>

              {/* Quality Badge */}
              <View
                testID={`quality-badge-${entry.id}`}
                style={[styles.qualityBadge, { backgroundColor: entry.qualityBadge.color }]}
              >
                <Text style={styles.qualityBadgeText}>{entry.qualityBadge.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacer for FAB */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        testID="add-sleep-button"
        style={styles.fab}
        onPress={onAddSleep}
        accessibilityRole="button"
        accessibilityLabel="Add sleep entry"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backIcon: {
    color: colors.white,
    fontSize: 20,
  },
  bottomSpacer: {
    height: 80,
  },
  calendarGrid: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  dayCell: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginBottom: 4,
    marginHorizontal: 4,
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  dayCellDefault: {
    backgroundColor: "transparent",
  },
  dayCellSelected: {
    backgroundColor: colors.green,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dayTextDefault: {
    color: colors.white,
  },
  dayTextSelected: {
    color: colors.white,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fab: {
    alignItems: "center",
    backgroundColor: colors.fabGreen,
    borderRadius: 28,
    bottom: 32,
    elevation: 4,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    right: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 56,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  historyDateColumn: {
    marginRight: 12,
    minWidth: 48,
  },
  historyDateText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  historyDetailsColumn: {
    flex: 1,
  },
  historyDurationText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  historyHeartRateText: {
    color: colors.gray,
    fontSize: 12,
    marginLeft: 12,
  },
  historyItem: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  historyMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  },
  historySuggestionsText: {
    color: colors.gray,
    fontSize: 12,
  },
  legendContainer: {
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    marginRight: 6,
    width: 10,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 20,
  },
  legendLabel: {
    color: colors.gray,
    fontSize: 12,
  },
  monthLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  monthNavArrow: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  monthNavButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  monthNavRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  qualityBadge: {
    borderRadius: 12,
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qualityBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionHeaderText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllText: {
    color: colors.tan,
    fontSize: 14,
    fontWeight: "600",
  },
  suggestionsArrow: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  suggestionsCard: {
    backgroundColor: colors.cardBg,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  suggestionsCardContent: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  suggestionsCountText: {
    color: colors.green,
    fontSize: 24,
    fontWeight: "800",
  },
  suggestionsTextContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  suggestionsTitleText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  weekDayCell: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 8,
  },
  weekDayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDayText: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SleepCalendarHistoryScreen;
