/**
 * NewSleepScheduleScreen Component
 * @description Sleep schedule configuration screen with time pickers, snooze slider,
 *   day selector, toggle switches, and submit button
 * @task Task 3.10.4: New Sleep Schedule Screen (Screen 91)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface NewSleepScheduleScreenProps {
  sleepTime: string;
  wakeTime: string;
  snoozeCount: number;
  selectedDays: string[];
  autoDisplayStats: boolean;
  autoSetAlarm: boolean;
  onBack: () => void;
  onSleepTimePress: () => void;
  onWakeTimePress: () => void;
  onSnoozeChange: (value: number) => void;
  onDayToggle: (day: string) => void;
  onAutoDisplayStatsToggle: () => void;
  onAutoSetAlarmToggle: () => void;
  onSetSchedule: () => void;
}

const colors = {
  background: "#1C1410",
  cardBg: "#2A1F18",
  selectedGreen: "#9AAD5C",
  toggleOff: "#3D2E23",
  submitOrange: "#E8853A",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  borderColor: "rgba(255,255,255,0.1)",
  sliderTrack: "#3D2E23",
  sliderFill: "#9AAD5C",
  chipUnselected: "#2A1F18",
} as const;

const DAYS: { short: string; full: string }[] = [
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
  { short: "Sun", full: "Sunday" },
];

export function NewSleepScheduleScreen({
  sleepTime,
  wakeTime,
  snoozeCount,
  selectedDays,
  autoDisplayStats,
  autoSetAlarm,
  onBack,
  onSleepTimePress,
  onWakeTimePress,
  onSnoozeChange,
  onDayToggle,
  onAutoDisplayStatsToggle,
  onAutoSetAlarmToggle,
  onSetSchedule,
}: NewSleepScheduleScreenProps): React.ReactElement {
  const sliderPosition = ((snoozeCount - 1) / 4) * 100;

  return (
    <View testID="new-sleep-schedule-screen" style={styles.container}>
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
          <Text style={styles.title}>New Sleep Schedule</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Time Pickers */}
        <View style={styles.timePickersRow}>
          <TouchableOpacity
            testID="sleep-time-picker"
            style={styles.timeCard}
            onPress={onSleepTimePress}
            accessibilityRole="button"
            accessibilityLabel="Select sleep time"
          >
            <Text style={styles.timeCardIcon}>{"\uD83D\uDECF\uFE0F"}</Text>
            <Text style={styles.timeCardLabel}>Sleep At</Text>
            <Text style={styles.timeCardValue}>{sleepTime}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="wake-time-picker"
            style={styles.timeCard}
            onPress={onWakeTimePress}
            accessibilityRole="button"
            accessibilityLabel="Select wake up time"
          >
            <Text style={styles.timeCardIcon}>{"\u23F0"}</Text>
            <Text style={styles.timeCardLabel}>Wake Up At</Text>
            <Text style={styles.timeCardValue}>{wakeTime}</Text>
          </TouchableOpacity>
        </View>

        {/* Snooze Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Repeat Snooze</Text>
            <Text testID="snooze-value" style={styles.snoozeValueText}>
              {snoozeCount}
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderMinMax}>1</Text>
            <View testID="snooze-slider" style={styles.sliderTrack}>
              <View
                style={[styles.sliderFill, { width: `${sliderPosition}%` }]}
              />
              <View
                style={[styles.sliderThumb, { left: `${sliderPosition}%` }]}
              />
            </View>
            <Text style={styles.sliderMinMax}>5</Text>
          </View>
        </View>

        {/* Day Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Auto Repeat Every</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day.short);
              return (
                <TouchableOpacity
                  key={day.short}
                  testID={`day-chip-${day.short}`}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isSelected
                        ? colors.selectedGreen
                        : colors.chipUnselected,
                    },
                  ]}
                  onPress={() => onDayToggle(day.short)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${day.full}`}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      isSelected && styles.dayChipTextSelected,
                    ]}
                  >
                    {day.short}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Toggle Switches */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Auto Display Sleep Stats</Text>
            <TouchableOpacity
              testID="auto-display-stats-toggle"
              style={styles.toggleTouchable}
              onPress={onAutoDisplayStatsToggle}
              accessibilityRole="button"
              accessibilityLabel="Toggle auto display sleep stats"
            >
              <View
                testID="auto-display-stats-track"
                style={[
                  styles.toggleTrack,
                  {
                    backgroundColor: autoDisplayStats
                      ? colors.selectedGreen
                      : colors.toggleOff,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    autoDisplayStats
                      ? styles.toggleThumbOn
                      : styles.toggleThumbOff,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Auto Set Alarm</Text>
            <TouchableOpacity
              testID="auto-set-alarm-toggle"
              style={styles.toggleTouchable}
              onPress={onAutoSetAlarmToggle}
              accessibilityRole="button"
              accessibilityLabel="Toggle auto set alarm"
            >
              <View
                testID="auto-set-alarm-track"
                style={[
                  styles.toggleTrack,
                  {
                    backgroundColor: autoSetAlarm
                      ? colors.selectedGreen
                      : colors.toggleOff,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    autoSetAlarm ? styles.toggleThumbOn : styles.toggleThumbOff,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="set-schedule-button"
          style={styles.submitButton}
          onPress={onSetSchedule}
          accessibilityRole="button"
          accessibilityLabel="Set sleep schedule"
        >
          <Text style={styles.submitButtonText}>Set Sleep Schedule +</Text>
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
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  dayChip: {
    alignItems: "center",
    borderRadius: 20,
    justifyContent: "center",
    minHeight: 40,
    minWidth: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dayChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  dayChipTextSelected: {
    color: colors.white,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSpacer: {
    minHeight: 44,
    minWidth: 44,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 24,
  },
  sectionHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  sliderContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  sliderFill: {
    backgroundColor: colors.sliderFill,
    borderRadius: 3,
    height: 6,
    left: 0,
    position: "absolute",
    top: 0,
  },
  sliderMinMax: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  sliderThumb: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 20,
    marginLeft: -10,
    marginTop: -7,
    position: "absolute",
    width: 20,
  },
  sliderTrack: {
    backgroundColor: colors.sliderTrack,
    borderRadius: 3,
    flex: 1,
    height: 6,
    position: "relative",
  },
  snoozeValueText: {
    backgroundColor: colors.selectedGreen,
    borderRadius: 12,
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
    textAlign: "center",
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.submitOrange,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  timeCard: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderColor: colors.borderColor,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  timeCardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  timeCardLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  timeCardValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  timePickersRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.white,
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  toggleLabel: {
    color: colors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  toggleThumb: {
    backgroundColor: colors.white,
    borderRadius: 11,
    height: 22,
    position: "absolute",
    top: 2,
    width: 22,
  },
  toggleThumbOff: {
    left: 2,
  },
  toggleThumbOn: {
    right: 2,
  },
  toggleTouchable: {
    justifyContent: "center",
    minHeight: 44,
  },
  toggleTrack: {
    borderRadius: 13,
    height: 26,
    position: "relative",
    width: 48,
  },
});

export default NewSleepScheduleScreen;
