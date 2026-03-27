/**
 * JournalProgressScreen Component
 * @description Full-screen notification showing journal completion progress
 * @task Task 3.16.3: Journal Progress Screen (Screen 136)
 * @audit-fix "9 daily journal" → "9 daily journals" (Issue #31 - plural)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette, colors } from "../../../shared/theme";

interface JournalProgressScreenProps {
  completedCount: number;
  targetCount: number;
  remainingCount: number;
  onBack: () => void;
  onSeeJournal: () => void;
}


export function JournalProgressScreen({
  completedCount,
  targetCount,
  remainingCount,
  onBack,
  onSeeJournal,
}: JournalProgressScreenProps): React.ReactElement {
  const journalWord = remainingCount === 1 ? "journal" : "journals";

  return (
    <View testID="journal-progress-screen" style={styles.container}>
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
      <View testID="journal-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.progressFraction}>
          {completedCount}/{targetCount}
        </Text>
        <Text style={styles.title}>Journal Completed</Text>
        <Text style={styles.message}>
          {remainingCount === 0
            ? "Congratulations! You've completed all your daily journals this month!"
            : `You still need to complete ${remainingCount} daily ${journalWord} this month. Keep it up!`}
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="see-journal-button"
          style={styles.ctaButton}
          onPress={onSeeJournal}
          accessibilityRole="button"
          accessibilityLabel="See Journal"
        >
          <Text style={styles.ctaButtonText}>
            See Journal {"\uD83D\uDD10"}
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
  backIcon: { color: colors.text.primary, fontSize: 24 },
  container: { backgroundColor: colors.background.primary, flex: 1 },
  contentSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: palette.primary.gold,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  ctaButtonText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  illustration: {
    backgroundColor: palette.primary.gold,
    borderRadius: 16,
    height: 200,
    marginHorizontal: 24,
    marginTop: 16,
  },
  message: {
    color: colors.text.secondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  progressFraction: {
    color: colors.text.primary,
    fontSize: 48,
    fontWeight: "800",
  },
  title: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
});

export default JournalProgressScreen;
