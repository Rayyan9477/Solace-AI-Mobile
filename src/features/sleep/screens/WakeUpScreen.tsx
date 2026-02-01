/**
 * WakeUpScreen Component
 * @description Morning wake-up screen with greeting, time display, duration badge,
 *   illustration placeholder, and swipe-to-wake confirmation bar
 * @task Task 3.10.5: Wake Up Screen (Screen 93)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface WakeUpScreenProps {
  userName: string;
  wakeTime: string;
  durationHours: number;
  durationMinutes: number;
  onSwipeToWake: () => void;
}

const colors = {
  background: "#1C1410",
  badgeBg: "#3D2E23",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  swipeBarBg: "rgba(255,255,255,0.12)",
  illustrationBg: "#2A1F18",
} as const;

function formatDuration(hours: number, minutes: number): string {
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  return `${h}h ${m}m`;
}

export function WakeUpScreen({
  userName,
  wakeTime,
  durationHours,
  durationMinutes,
  onSwipeToWake,
}: WakeUpScreenProps): React.ReactElement {
  return (
    <View testID="wake-up-screen" style={styles.container}>
      {/* Morning Badge */}
      <View style={styles.topSection}>
        <View testID="morning-badge" style={styles.morningBadge}>
          <Text style={styles.morningBadgeText}>GOOD MORNING!</Text>
        </View>
      </View>

      {/* Greeting */}
      <Text testID="greeting-text" style={styles.greeting}>
        Wake Up, {userName}!
      </Text>

      {/* Wake Time Display */}
      <Text testID="time-display" style={styles.timeDisplay}>
        {wakeTime}
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
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  durationBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.badgeBg,
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
  morningBadge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  morningBadgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
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
  timeDisplay: {
    color: colors.white,
    fontSize: 64,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  topSection: {
    alignItems: "center",
    paddingTop: 24,
  },
});

export default WakeUpScreen;
