/**
 * SleepingScreen Component
 * @description Active sleep tracking screen with alarm badge, greeting, time display,
 *   duration badge, illustration placeholder, and swipe-to-wake bar
 * @task Task 3.10.6: Sleeping Screen (Screen 92)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SleepingScreenProps {
  alarmTime: string;
  userName: string;
  currentTime: string;
  durationHours: number;
  durationMinutes: number;
  onSwipeToWake: () => void;
}

const colors = {
  background: "#1C1410",
  badgeBg: "#2A1F18",
  badgeBorder: "rgba(255,255,255,0.1)",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  swipeBarBg: "rgba(255,255,255,0.12)",
  illustrationBg: "#2A1F18",
  durationBg: "#3D2E23",
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
    backgroundColor: colors.badgeBg,
    borderColor: colors.badgeBorder,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  alarmBadgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  currentTime: {
    color: colors.white,
    fontSize: 64,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  durationBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.durationBg,
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
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  durationValue: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  gestureIcon: {
    color: colors.textSecondary,
    fontSize: 16,
    marginRight: 8,
  },
  greeting: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  illustration: {
    backgroundColor: colors.illustrationBg,
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
    backgroundColor: colors.swipeBarBg,
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
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  topSection: {
    alignItems: "center",
    paddingTop: 24,
  },
});

export default SleepingScreen;
