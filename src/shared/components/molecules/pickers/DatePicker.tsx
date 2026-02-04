/**
 * DatePicker Component
 * @description Calendar-based date picker with single, range, and multiple selection modes
 * @task Task 2.6.1: DatePicker Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Single date selection
 * - Date range selection
 * - Multiple dates selection
 * - Quick select options (Today, This Week, Yesterday)
 * - Min/max date constraints
 * - Disabled dates support
 * - Full accessibility support
 * - Dark mode first design
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { Calendar, type DateData } from "react-native-calendars";

import type {
  DatePickerProps,
  DateRange,
  QuickSelectOption,
} from "./DatePicker.types";
import { defaultQuickSelectOptions } from "./DatePicker.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  // Background colors
  background: palette.gray[900],
  surface: palette.gray[700],
  surfaceLight: palette.gray[600],

  // Text colors
  text: palette.gray[100],
  textSecondary: palette.gray[400],
  textDisabled: palette.gray[500],

  // Selection colors
  selected: palette.olive[500],
  selectedText: palette.gray[900],
  today: palette.tan[500],
  todayText: palette.gray[900],
  inRange: `${palette.olive[500]}${palette.alpha[30]}`,

  // Border colors
  border: palette.gray[600],

  // Button colors
  buttonPrimary: palette.tan[500],
  buttonPrimaryText: palette.gray[900],
  buttonSecondary: "transparent",
  buttonSecondaryText: palette.tan[500],
};

/**
 * Format date to YYYY-MM-DD string for react-native-calendars
 */
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date
 */
function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * DatePicker Component
 *
 * @example
 * ```tsx
 * // Single date selection
 * <DatePicker
 *   value={selectedDate}
 *   onDateChange={setSelectedDate}
 *   mode="single"
 * />
 *
 * // Date range selection
 * <DatePicker
 *   range={dateRange}
 *   onRangeChange={setDateRange}
 *   mode="range"
 *   showQuickSelect
 * />
 * ```
 */
export function DatePicker({
  value,
  range,
  selectedDates = [],
  onDateChange,
  onRangeChange,
  onMultipleDatesChange,
  mode = "single",
  minDate,
  maxDate,
  disabledDates = [],
  showQuickSelect = true,
  quickSelectOptions,
  showApplyButton = true,
  onApply,
  onCancel,
  initialMonth,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: DatePickerProps): React.ReactElement {
  // Internal state for range selection
  const [rangeStart, setRangeStart] = useState<Date | null>(
    range?.startDate || null,
  );
  const [rangeEnd, setRangeEnd] = useState<Date | null>(range?.endDate || null);

  // Get quick select options
  const options = quickSelectOptions || defaultQuickSelectOptions;

  // Build marked dates object for calendar
  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};

    // Add disabled dates
    disabledDates.forEach((date) => {
      const dateStr = formatDateString(date);
      marked[dateStr] = {
        ...marked[dateStr],
        disabled: true,
        disableTouchEvent: true,
      };
    });

    // Handle single mode
    if (mode === "single" && value) {
      const dateStr = formatDateString(value);
      marked[dateStr] = {
        ...marked[dateStr],
        selected: true,
        selectedColor: colors.selected,
        selectedTextColor: colors.selectedText,
      };
    }

    // Handle range mode
    if (mode === "range") {
      const start = rangeStart || range?.startDate;
      const end = rangeEnd || range?.endDate;

      if (start) {
        const startStr = formatDateString(start);
        marked[startStr] = {
          ...marked[startStr],
          startingDay: true,
          color: colors.selected,
          textColor: colors.selectedText,
        };
      }

      if (end) {
        const endStr = formatDateString(end);
        marked[endStr] = {
          ...marked[endStr],
          endingDay: true,
          color: colors.selected,
          textColor: colors.selectedText,
        };
      }

      // Fill in-between dates
      if (start && end) {
        const current = new Date(start);
        current.setDate(current.getDate() + 1);
        while (current < end) {
          const dateStr = formatDateString(current);
          marked[dateStr] = {
            ...marked[dateStr],
            color: colors.inRange,
            textColor: colors.text,
          };
          current.setDate(current.getDate() + 1);
        }
      }
    }

    // Handle multiple mode
    if (mode === "multiple") {
      selectedDates.forEach((date) => {
        const dateStr = formatDateString(date);
        marked[dateStr] = {
          ...marked[dateStr],
          selected: true,
          selectedColor: colors.selected,
          selectedTextColor: colors.selectedText,
        };
      });
    }

    // Mark today
    const todayStr = formatDateString(new Date());
    if (!marked[todayStr]?.selected) {
      marked[todayStr] = {
        ...marked[todayStr],
        marked: true,
        dotColor: colors.today,
      };
    }

    return marked;
  }, [value, range, rangeStart, rangeEnd, selectedDates, disabledDates, mode]);

  // Handle day press
  const handleDayPress = useCallback(
    (day: DateData) => {
      if (disabled) return;

      const selectedDate = parseDateString(day.dateString);

      // Check min/max constraints
      if (minDate && selectedDate < minDate) return;
      if (maxDate && selectedDate > maxDate) return;

      // Check if date is disabled
      if (disabledDates.some((d) => isSameDay(d, selectedDate))) {
        return;
      }

      switch (mode) {
        case "single":
          onDateChange?.(selectedDate);
          break;

        case "range":
          if (!rangeStart || (rangeStart && rangeEnd)) {
            // Start new range
            setRangeStart(selectedDate);
            setRangeEnd(null);
            onRangeChange?.({ startDate: selectedDate, endDate: null });
          } else {
            // Complete range
            if (selectedDate < rangeStart) {
              // If selected date is before start, swap
              setRangeEnd(rangeStart);
              setRangeStart(selectedDate);
              onRangeChange?.({ startDate: selectedDate, endDate: rangeStart });
            } else {
              setRangeEnd(selectedDate);
              onRangeChange?.({ startDate: rangeStart, endDate: selectedDate });
            }
          }
          break;

        case "multiple":
          const exists = selectedDates.some((d) => isSameDay(d, selectedDate));
          if (exists) {
            // Remove date
            const newDates = selectedDates.filter(
              (d) => !isSameDay(d, selectedDate),
            );
            onMultipleDatesChange?.(newDates);
          } else {
            // Add date
            onMultipleDatesChange?.([...selectedDates, selectedDate]);
          }
          break;
      }
    },
    [
      disabled,
      mode,
      rangeStart,
      rangeEnd,
      selectedDates,
      minDate,
      maxDate,
      disabledDates,
      onDateChange,
      onRangeChange,
      onMultipleDatesChange,
    ],
  );

  // Handle quick select press
  const handleQuickSelect = useCallback(
    (option: QuickSelectOption) => {
      if (disabled) return;

      const result = option.getValue();

      if (result instanceof Date) {
        // Single date
        onDateChange?.(result);
      } else {
        // Date range
        setRangeStart(result.startDate);
        setRangeEnd(result.endDate);
        onRangeChange?.(result);
      }
    },
    [disabled, onDateChange, onRangeChange],
  );

  // Calendar theme (dark mode)
  const calendarTheme = useMemo(
    () => ({
      backgroundColor: colors.background,
      calendarBackground: colors.background,
      textSectionTitleColor: colors.textSecondary,
      selectedDayBackgroundColor: colors.selected,
      selectedDayTextColor: colors.selectedText,
      todayTextColor: colors.today,
      dayTextColor: colors.text,
      textDisabledColor: colors.textDisabled,
      dotColor: colors.today,
      selectedDotColor: colors.selectedText,
      arrowColor: colors.text,
      disabledArrowColor: colors.textDisabled,
      monthTextColor: colors.text,
      indicatorColor: colors.selected,
      textDayFontWeight: "400" as const,
      textMonthFontWeight: "600" as const,
      textDayHeaderFontWeight: "500" as const,
      textDayFontSize: 16,
      textMonthFontSize: 18,
      textDayHeaderFontSize: 14,
    }),
    [],
  );

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Date picker"}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      {/* Quick Select Options */}
      {showQuickSelect && options.length > 0 && (
        <View style={styles.quickSelectContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              testID={`${testID}-quick-${option.id}`}
              style={styles.quickSelectButton}
              onPress={() => handleQuickSelect(option)}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityLabel={`Select ${option.label}`}
            >
              <Text style={styles.quickSelectText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Calendar */}
      <Calendar
        testID={`${testID}-calendar`}
        current={initialMonth ? formatDateString(initialMonth) : undefined}
        minDate={minDate ? formatDateString(minDate) : undefined}
        maxDate={maxDate ? formatDateString(maxDate) : undefined}
        markedDates={markedDates}
        markingType={mode === "range" ? "period" : "dot"}
        onDayPress={handleDayPress}
        theme={calendarTheme}
        enableSwipeMonths
        style={styles.calendar}
      />

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {onCancel && (
          <TouchableOpacity
            testID={`${testID}-cancel`}
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Cancel date selection"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {showApplyButton && (
          <TouchableOpacity
            testID={`${testID}-apply`}
            style={[styles.applyButton, disabled && styles.buttonDisabled]}
            onPress={onApply}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Apply date selection"
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    padding: 12,
  },
  applyButton: {
    alignItems: "center",
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
    minWidth: 100,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  applyButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  calendar: {
    backgroundColor: colors.background,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: colors.buttonSecondary,
    borderColor: colors.buttonPrimary,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: colors.buttonSecondaryText,
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.5,
  },
  quickSelectButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickSelectContainer: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
  },
  quickSelectText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default DatePicker;
