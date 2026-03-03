/**
 * SleepingScreen Component
 * @description Active sleep tracking screen with alarm badge, greeting, time display,
 *   duration badge, illustration placeholder, and swipe-to-wake bar
 * @task Task 3.10.6: Sleeping Screen (Screen 92)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface SleepingScreenProps {
  alarmTime: string;
  userName: string;
  currentTime: string;
  durationHours: number;
  durationMinutes: number;
  onSwipeToWake: () => void;
}

const localColors = {
  background: palette.brown[900],
  badgeBg: palette.brown[800],
  badgeBorder: "rgba(255,255,255,0.1)",
  white: palette.white,
  textSecondary: "rgba(255,255,255,0.6)",
  swipeBarBg: "rgba(255,255,255,0.12)",
  illustrationBg: palette.brown[800],
  durationBg: palette.brown[700],
} as const;

function formatDuration(hours: number, minutes: number): string {
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  return `${h}h ${m}m`;
}

export function SleepingScreen({
  alarmTime,
  userName,
  currentTime,
  durationHours,
  durationMinutes,
  onSwipeToWake,
}: SleepingScreenProps): React.ReactElement {
  return (
    <View testID="sleeping-screen" style={styles.container}>
      {/* Alarm Badge */}
      <View style={styles.topSection}>
        <View testID="alarm-badge" style={styles.alarmBadge}>
          <Text style={styles.alarmBadgeText}>ALARM AT {alarmTime}</Text>
        </View>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Good Night, {userName}!</Text>

      {/* Current Time Display */}
      <Text testID="current-time-display" style={styles.currentTime}>
        {currentTime}
      </Text>

      {/* Duration Badge */}
      <View testID="duration-badge" style={styles.durationBadge}>
        <Text testID="duration-clock-icon" style={styles.durationIcon}>
          {"\u23F1\uFE0F"}
        </Text>
        <Text style={styles.durationLabel}>Duration</Text>
        <Text style={styles.durationValue}>
          {formatDuration(durationHours, durationMinutes)}
        </Text>
      </View>

      {/* Illustration Placeholder */}
      <View style={styles.illustrationContainer}>
        <View testID="illustration-placeholder" style={styles.illustration} />
      </View>

      {/* Swipe to Wake Bar */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="swipe-to-wake-bar"
          style={styles.swipeBar}
          onPress={onSwipeToWake}
          accessibilityRole="button"
          accessibilityLabel="Swipe to wake up"
          activeOpacity={0.8}
        >
          <Text testID="swipe-gesture-icon" style={styles.gestureIcon}>
            )) ))
          </Text>
          <Text style={styles.swipeText}>Swipe to Wake Up!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alarmBadge: {
    backgroundColor: localColors.badgeBg,
    borderColor: localColors.badgeBorder,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  alarmBadgeText: {
    color: localColors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  container: {
    backgroundColor: localColors.background,
    flex: 1,
  },
  currentTime: {
    color: localColors.white,
    fontSize: 64,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  durationBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: localColors.durationBg,
    borderRadius: 20,
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  durationIcon: {
    fontSize: 14,
  },
  durationLabel: {
    color: localColors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  durationValue: {
    color: localColors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  gestureIcon: {
    color: localColors.textSecondary,
    fontSize: 16,
    marginRight: 8,
  },
  greeting: {
    color: localColors.white,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  illustration: {
    backgroundColor: localColors.illustrationBg,
    borderRadius: 16,
    height: 200,
    width: "100%",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  swipeBar: {
    alignItems: "center",
    backgroundColor: localColors.swipeBarBg,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: "100%",
  },
  swipeText: {
    color: localColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  topSection: {
    alignItems: "center",
    paddingTop: 24,
  },
});

export default SleepingScreen;
