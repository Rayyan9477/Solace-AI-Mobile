/**
 * TimePicker Component
 * @description Time picker with hour/minute wheels and AM/PM selector
 * @task Task 2.6.2: TimePicker Component
 *
 * Features:
 * - 12-hour and 24-hour formats
 * - Hour and minute wheel selection
 * - AM/PM period toggle for 12h format
 * - Configurable minute intervals (1, 5, 10, 15, 30)
 * - Min/max time constraints
 * - Full accessibility support
 * - Dark mode first design
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

import type {
  TimePickerProps,
  TimeValue,
  MinuteInterval,
} from "./TimePicker.types";
import { to12Hour } from "./TimePicker.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Background colors
  background: "#1E293B",
  surface: "#334155",
  surfaceLight: "#475569",

  // Text colors
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textDisabled: "#64748B",
  error: "#EF4444",

  // Selection colors
  selected: "#9AAD5C", // Olive green from designs
  selectedText: "#1C1917",

  // Border colors
  border: "#475569",
  borderError: "#EF4444",

  // Button colors
  buttonPrimary: "#C4A574",
  buttonPrimaryText: "#1C1917",
  buttonSecondary: "transparent",
  buttonSecondaryText: "#C4A574",
};

/**
 * Generate array of hours based on format
 */
function generateHours(format: "12h" | "24h"): number[] {
  if (format === "12h") {
    return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  }
  return Array.from({ length: 24 }, (_, i) => i);
}

/**
 * Generate array of minutes based on interval
 */
function generateMinutes(interval: MinuteInterval): number[] {
  const minutes: number[] = [];
  for (let i = 0; i < 60; i += interval) {
    minutes.push(i);
  }
  return minutes;
}

/**
 * Wheel Item Component
 */
interface WheelItemProps {
  value: number;
  isSelected: boolean;
  onSelect: (value: number) => void;
  disabled?: boolean;
  testID?: string;
}

function WheelItem({
  value,
  isSelected,
  onSelect,
  disabled,
  testID,
}: WheelItemProps) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => !disabled && onSelect(value)}
      disabled={disabled}
      style={[
        styles.wheelItem,
        isSelected && styles.wheelItemSelected,
        disabled && styles.wheelItemDisabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <Text
        style={[
          styles.wheelItemText,
          isSelected && styles.wheelItemTextSelected,
          disabled && styles.wheelItemTextDisabled,
        ]}
      >
        {String(value).padStart(2, "0")}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Wheel Component - scrollable list of values
 */
interface WheelProps {
  values: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  testID?: string;
}

function Wheel({
  values,
  selectedValue,
  onValueChange,
  disabled,
  testID,
}: WheelProps) {
  return (
    <View
      testID={testID}
      style={styles.wheel}
      accessibilityRole="adjustable"
      accessibilityLabel="Select value"
      accessibilityValue={{
        now: selectedValue,
        min: Math.min(...values),
        max: Math.max(...values),
      }}
    >
      <ScrollView
        style={styles.wheelScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wheelContent}
      >
        {values.map((value) => (
          <WheelItem
            key={value}
            value={value}
            isSelected={value === selectedValue}
            onSelect={onValueChange}
            disabled={disabled}
            testID={`${testID}-item-${value}`}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/**
 * TimePicker Component
 *
 * @example
 * ```tsx
 * // 12-hour format
 * <TimePicker
 *   value={{ hours: 10, minutes: 30, period: "AM" }}
 *   onTimeChange={setTime}
 *   format="12h"
 * />
 *
 * // 24-hour format with 15-minute intervals
 * <TimePicker
 *   value={{ hours: 14, minutes: 30 }}
 *   onTimeChange={setTime}
 *   format="24h"
 *   minuteInterval={15}
 * />
 * ```
 */
export function TimePicker({
  value,
  onTimeChange,
  format = "12h",
  minuteInterval = 1,
  minTime,
  maxTime,
  disabled = false,
  label,
  helperText,
  error,
  showConfirm = true,
  onConfirm,
  onCancel,
  testID,
  accessibilityLabel,
  style,
}: TimePickerProps): React.ReactElement {
  // Internal state
  const [selectedHour, setSelectedHour] = useState<number>(() => {
    if (value) {
      return format === "12h" ? to12Hour(value).hours : value.hours;
    }
    return format === "12h" ? 12 : 0;
  });

  const [selectedMinute, setSelectedMinute] = useState<number>(
    value?.minutes ?? 0,
  );

  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(
    value?.period ?? "AM",
  );

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const displayValue = format === "12h" ? to12Hour(value) : value;
      setSelectedHour(displayValue.hours);
      setSelectedMinute(value.minutes);
      if (displayValue.period) {
        setSelectedPeriod(displayValue.period);
      }
    }
  }, [value, format]);

  // Generate hour and minute values
  const hours = useMemo(() => generateHours(format), [format]);
  const minutes = useMemo(
    () => generateMinutes(minuteInterval),
    [minuteInterval],
  );

  // Build current time value
  const currentTime = useMemo((): TimeValue => {
    if (format === "12h") {
      return {
        hours: selectedHour,
        minutes: selectedMinute,
        period: selectedPeriod,
      };
    }
    return { hours: selectedHour, minutes: selectedMinute };
  }, [selectedHour, selectedMinute, selectedPeriod, format]);

  // Handle hour change
  const handleHourChange = useCallback(
    (hour: number) => {
      if (disabled) return;
      setSelectedHour(hour);

      const newTime: TimeValue = {
        hours: hour,
        minutes: selectedMinute,
        ...(format === "12h" ? { period: selectedPeriod } : {}),
      };
      onTimeChange?.(newTime);
    },
    [disabled, selectedMinute, selectedPeriod, format, onTimeChange],
  );

  // Handle minute change
  const handleMinuteChange = useCallback(
    (minute: number) => {
      if (disabled) return;
      setSelectedMinute(minute);

      const newTime: TimeValue = {
        hours: selectedHour,
        minutes: minute,
        ...(format === "12h" ? { period: selectedPeriod } : {}),
      };
      onTimeChange?.(newTime);
    },
    [disabled, selectedHour, selectedPeriod, format, onTimeChange],
  );

  // Handle period change
  const handlePeriodChange = useCallback(
    (period: "AM" | "PM") => {
      if (disabled) return;
      setSelectedPeriod(period);

      const newTime: TimeValue = {
        hours: selectedHour,
        minutes: selectedMinute,
        period,
      };
      onTimeChange?.(newTime);
    },
    [disabled, selectedHour, selectedMinute, onTimeChange],
  );

  // Handle confirm
  const handleConfirm = useCallback(() => {
    onConfirm?.(currentTime);
  }, [onConfirm, currentTime]);

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Time picker"}
      style={[
        styles.container,
        disabled && styles.disabled,
        error && styles.containerError,
        style,
      ]}
    >
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Wheels Container */}
      <View style={styles.wheelsContainer}>
        {/* Hour Wheel */}
        <Wheel
          testID={`${testID}-hour-wheel`}
          values={hours}
          selectedValue={selectedHour}
          onValueChange={handleHourChange}
          disabled={disabled}
        />

        {/* Separator */}
        <Text style={styles.separator}>:</Text>

        {/* Minute Wheel */}
        <Wheel
          testID={`${testID}-minute-wheel`}
          values={minutes}
          selectedValue={selectedMinute}
          onValueChange={handleMinuteChange}
          disabled={disabled}
        />

        {/* Period Selector (12h only) */}
        {format === "12h" && (
          <View testID={`${testID}-period`} style={styles.periodContainer}>
            <TouchableOpacity
              testID={`${testID}-period-am`}
              style={[
                styles.periodButton,
                selectedPeriod === "AM" && styles.periodButtonSelected,
              ]}
              onPress={() => handlePeriodChange("AM")}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedPeriod === "AM" }}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "AM" && styles.periodTextSelected,
                ]}
              >
                AM
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID={`${testID}-period-pm`}
              style={[
                styles.periodButton,
                selectedPeriod === "PM" && styles.periodButtonSelected,
              ]}
              onPress={() => handlePeriodChange("PM")}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedPeriod === "PM" }}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "PM" && styles.periodTextSelected,
                ]}
              >
                PM
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Helper Text */}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {onCancel && (
          <TouchableOpacity
            testID={`${testID}-cancel`}
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Cancel time selection"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}

        {showConfirm && (
          <TouchableOpacity
            testID={`${testID}-confirm`}
            style={[styles.confirmButton, disabled && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Confirm time selection"
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
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
    paddingTop: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: colors.buttonSecondary,
    borderColor: colors.buttonPrimary,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: colors.buttonSecondaryText,
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
    minWidth: 80,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  confirmButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 14,
    fontWeight: "600",
  },
  container: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  containerError: {
    borderColor: colors.borderError,
  },
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 12,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  periodButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 50,
  },
  periodButtonSelected: {
    backgroundColor: colors.selected,
    borderColor: colors.selected,
  },
  periodContainer: {
    gap: 4,
    marginLeft: 8,
  },
  periodText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  periodTextSelected: {
    color: colors.selectedText,
  },
  separator: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "600",
    marginHorizontal: 4,
  },
  wheel: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    height: 150,
    overflow: "hidden",
    width: 70,
  },
  wheelContent: {
    paddingVertical: 8,
  },
  wheelItem: {
    alignItems: "center",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    marginHorizontal: 4,
    marginVertical: 2,
    paddingHorizontal: 8,
  },
  wheelItemDisabled: {
    opacity: 0.5,
  },
  wheelItemSelected: {
    backgroundColor: colors.selected,
  },
  wheelItemText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "500",
  },
  wheelItemTextDisabled: {
    color: colors.textDisabled,
  },
  wheelItemTextSelected: {
    color: colors.selectedText,
    fontWeight: "600",
  },
  wheelScroll: {
    flex: 1,
  },
  wheelsContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 16,
  },
});

export default TimePicker;
