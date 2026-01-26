/**
 * MoodCalendar Component
 * @description Calendar grid showing mood indicators for each day
 * @task Task 2.8.2: MoodCalendar Component
 *
 * Features:
 * - Weekly grid view
 * - Colored circles for each day status
 * - Today indicator
 * - Legend with color meanings
 * - Day selection
 * - Full accessibility support
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import type {
  MoodCalendarProps,
  CalendarDay,
  CalendarWeek,
  LegendItem,
} from "./MoodCalendar.types";
import {
  DEFAULT_LEGEND_ITEMS,
  DAY_ABBREVIATIONS_MON,
  getStatusColor,
} from "./MoodCalendar.types";

/**
 * Get month name from date
 */
function getMonthName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", { month: "long" });
}

/**
 * Day Cell Component
 */
interface DayCellProps {
  day: CalendarDay;
  isSelected: boolean;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

function DayCell({
  day,
  isSelected,
  onPress,
  disabled,
  testID,
}: DayCellProps) {
  const backgroundColor = getStatusColor(day.status);
  const monthName = getMonthName(day.date);
  const statusLabel =
    day.status === "none"
      ? "No entry"
      : `${day.status.charAt(0).toUpperCase() + day.status.slice(1)} mood`;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled || day.status === "none"}
      accessibilityRole="button"
      accessibilityLabel={`${monthName} ${day.dayOfMonth}, ${statusLabel}`}
      accessibilityState={{ selected: isSelected }}
      style={[
        styles.dayCell,
        { backgroundColor },
        day.isToday && styles.dayCellToday,
        isSelected && styles.dayCellSelected,
        !day.isCurrentMonth && styles.dayCellOtherMonth,
      ]}
    />
  );
}

/**
 * Week Row Component
 */
interface WeekRowProps {
  week: CalendarWeek;
  selectedDate?: string;
  onDayPress?: (day: CalendarDay) => void;
  disabled?: boolean;
  testID?: string;
}

function WeekRow({
  week,
  selectedDate,
  onDayPress,
  disabled,
  testID,
}: WeekRowProps) {
  return (
    <View testID={testID} style={styles.weekRow}>
      {week.days.map((day) => (
        <DayCell
          key={day.date}
          testID={`${testID?.replace(`-week-${week.weekNumber}`, "")}-day-${day.date}`}
          day={day}
          isSelected={selectedDate === day.date}
          onPress={() => onDayPress?.(day)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

/**
 * Day Headers Component
 */
function DayHeaders() {
  return (
    <View style={styles.dayHeadersRow}>
      {DAY_ABBREVIATIONS_MON.map((abbr, index) => (
        <Text key={`${abbr}-${index}`} style={styles.dayHeaderText}>
          {abbr}
        </Text>
      ))}
    </View>
  );
}

/**
 * Legend Component
 */
interface LegendProps {
  items: LegendItem[];
  testID?: string;
}

function Legend({ items, testID }: LegendProps) {
  return (
    <View testID={testID} style={styles.legendContainer}>
      {items.map((item) => (
        <View key={item.status} style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: item.color }]}
          />
          <Text style={styles.legendText}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Skeleton Component for loading state
 */
interface SkeletonProps {
  testID?: string;
}

function CalendarSkeleton({ testID }: SkeletonProps) {
  return (
    <View testID={testID} style={styles.skeletonContainer}>
      <DayHeaders />
      {[1, 2, 3, 4].map((week) => (
        <View key={week} style={styles.weekRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <View
              key={day}
              style={[styles.dayCell, styles.skeletonCell]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * MoodCalendar Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MoodCalendar
 *   weeks={calendarWeeks}
 *   onDayPress={(day) => showDayDetail(day)}
 * />
 *
 * // With selected date
 * <MoodCalendar
 *   weeks={calendarWeeks}
 *   selectedDate="2025-01-20"
 *   onDayPress={handleDaySelect}
 * />
 * ```
 */
export function MoodCalendar({
  weeks,
  onDayPress,
  selectedDate,
  showLegend = true,
  legendItems = DEFAULT_LEGEND_ITEMS,
  loading = false,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: MoodCalendarProps): React.ReactElement {
  if (loading) {
    return (
      <View
        testID={testID}
        accessibilityLabel={accessibilityLabel || "Mood calendar"}
        style={[styles.container, style]}
      >
        <CalendarSkeleton testID={`${testID}-skeleton`} />
      </View>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Mood calendar"}
      accessibilityRole="grid"
      style={[styles.container, style]}
    >
      {/* Day Headers */}
      <DayHeaders />

      {/* Calendar Grid */}
      <View style={styles.gridContainer}>
        {weeks.map((week) => (
          <WeekRow
            key={week.weekNumber}
            testID={`${testID}-week-${week.weekNumber}`}
            week={week}
            selectedDate={selectedDate}
            onDayPress={onDayPress}
            disabled={disabled}
          />
        ))}
      </View>

      {/* Legend */}
      {showLegend && (
        <Legend items={legendItems} testID={`${testID}-legend`} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#334155",
    borderRadius: 16,
    padding: 16,
  },
  dayCell: {
    alignItems: "center",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  dayCellOtherMonth: {
    opacity: 0.4,
  },
  dayCellSelected: {
    borderColor: "#FFFFFF",
    borderWidth: 2,
  },
  dayCellToday: {
    borderColor: "#F5C563",
    borderWidth: 2,
  },
  dayHeaderText: {
    color: "#94A3B8",
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  dayHeadersRow: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  gridContainer: {
    gap: 8,
  },
  legendContainer: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    marginTop: 16,
    paddingTop: 12,
  },
  legendDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  legendText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  skeletonCell: {
    backgroundColor: "#475569",
  },
  skeletonContainer: {
    gap: 8,
  },
  weekRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
});

export default MoodCalendar;
