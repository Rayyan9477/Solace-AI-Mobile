/**
 * MeditationReminderScreen Component
 * @description Full-screen reminder for daily meditation session
 * @task Task 3.16.6: Meditation Reminder Screen (Screen 139)
 * @audit-fix "mediation" → "meditation" (Issue #33)
 * @audit-fix "Pelase" → "Please" (Issue #33)
 * @audit-fix "Dr Freud AI" → "Dr Solace AI"
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface MeditationReminderScreenProps {
  recommendedDuration: number;
  onBack: () => void;
  onStartMeditation: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  textSecondary: palette.text.secondary,
  illustrationBg: palette.background.tertiary,
  ctaButtonBg: palette.primary.gold,
  ctaButtonText: palette.background.primary,
} as const;

export function MeditationReminderScreen({
  recommendedDuration,
  onBack,
  onStartMeditation,
}: MeditationReminderScreenProps): React.ReactElement {
  return (
    <View testID="meditation-reminder-screen" style={styles.container}>
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
      <View testID="meditation-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>It's Time!</Text>
        <Text style={styles.subtitle}>Time for meditation session.</Text>
        <Text style={styles.message}>
          Dr Solace AI said you need to do it today. Please do{" "}
          {recommendedDuration}m session.
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="start-meditation-button"
          style={styles.ctaButton}
          onPress={onStartMeditation}
          accessibilityRole="button"
          accessibilityLabel="Start meditation"
        >
          <Text style={styles.ctaButtonText}>
            Let's Meditate {"\u2192"}
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
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
});

export default MeditationReminderScreen;
