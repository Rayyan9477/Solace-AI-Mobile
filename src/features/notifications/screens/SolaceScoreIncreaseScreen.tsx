/**
 * SolaceScoreIncreaseScreen Component
 * @description Full-screen notification celebrating Solace Score increase
 * @task Task 3.16.2: Solace Score Increase Screen (Screen 135)
 * @audit-fix "Freud Score Increased" → "Solace Score Increased"
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface SolaceScoreIncreaseScreenProps {
  scoreChange: number;
  percentageChange: number;
  currentScore: number;
  comparisonPeriod: string;
  onBack: () => void;
  onSeeScore: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  textSecondary: palette.text.secondary,
  illustrationBg: palette.accent.green,
  scoreBadgeBg: palette.background.secondary,
  ctaButtonBg: palette.primary.gold,
  ctaButtonText: palette.background.primary,
} as const;

export function SolaceScoreIncreaseScreen({
  scoreChange,
  percentageChange,
  currentScore,
  comparisonPeriod,
  onBack,
  onSeeScore,
}: SolaceScoreIncreaseScreenProps): React.ReactElement {
  return (
    <View testID="solace-score-increase-screen" style={styles.container}>
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
      <View testID="score-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.scoreChange}>+{scoreChange}</Text>
        <Text style={styles.title}>Solace Score Increased</Text>
        <Text style={styles.message}>
          You're {percentageChange}% happier compared to {comparisonPeriod}.
          Congrats! {"\uD83D\uDE4C"}
        </Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Score Now:</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{currentScore}</Text>
          </View>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="see-score-button"
          style={styles.ctaButton}
          onPress={onSeeScore}
          accessibilityRole="button"
          accessibilityLabel="See Score"
        >
          <Text style={styles.ctaButtonText}>
            See Score {"\uD83D\uDD10"}
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
  scoreBadge: {
    backgroundColor: colors.scoreBadgeBg,
    borderRadius: 12,
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  scoreBadgeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  scoreChange: {
    color: colors.illustrationBg,
    fontSize: 48,
    fontWeight: "800",
  },
  scoreLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  scoreRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
});

export default SolaceScoreIncreaseScreen;
