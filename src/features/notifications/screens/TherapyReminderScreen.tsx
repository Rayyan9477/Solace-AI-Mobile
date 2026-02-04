/**
 * TherapyReminderScreen Component
 * @description Full-screen reminder for upcoming therapy session
 * @task Task 3.16.4: Therapy Reminder Screen (Screen 137)
 * @audit-fix "Dr. Freud AI" → "Dr. Solace AI"
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface TherapyReminderScreenProps {
  sessionTime: string;
  sessionTitle: string;
  countdownHours: number;
  countdownMinutes: number;
  onBack: () => void;
  onSeeSchedule: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  textSecondary: palette.text.secondary,
  illustrationBg: palette.accent.orange,
  ctaButtonBg: palette.primary.gold,
  ctaButtonText: palette.background.primary,
} as const;

export function TherapyReminderScreen({
  sessionTime,
  sessionTitle,
  countdownHours,
  countdownMinutes,
  onBack,
  onSeeSchedule,
}: TherapyReminderScreenProps): React.ReactElement {
  return (
    <View testID="therapy-reminder-screen" style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>{"\u2190"}</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View testID="therapy-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.timeDisplay}>{sessionTime}</Text>
        <Text style={styles.title}>{sessionTitle}</Text>
        <Text style={styles.message}>
          You have a therapy session with Dr. Solace AI in {countdownHours}h{" "}
          {countdownMinutes}m from now.
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="see-schedule-button"
          style={styles.ctaButton}
          onPress={onSeeSchedule}
          accessibilityRole="button"
          accessibilityLabel="See Schedule"
        >
          <Text style={styles.ctaButtonText}>
            See Schedule {"\uD83D\uDCC5"}
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  contentSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  ctaButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  illustration: {
    backgroundColor: colors.illustrationBg,
    borderRadius: 16,
    height: 200,
    marginHorizontal: 24,
    marginTop: 16,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  timeDisplay: {
    color: colors.white,
    fontSize: 48,
    fontWeight: "800",
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
});

export default TherapyReminderScreen;
