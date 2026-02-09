/**
 * ExerciseCompletedModal Component
 * @description Success modal after completing a mindful exercise, showing rewards
 *   and encouragement message with got-it and close actions
 * @task Task 3.12.8: Exercise Completed Modal (Screen 111)
 * @audit-fix Replaced "Freud Score" with "Solace Score" per branding guidelines
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ExerciseCompletedModalProps {
  scoreEarned: string;
  stressReduction: string;
  message: string;
  onGotIt: () => void;
  onClose: () => void;
}

const localColors = {
  overlay: "rgba(28,20,16,0.85)",
  cardBg: palette.brown[900],
  white: palette.white,
  dark: palette.brown[900],
  buttonBg: palette.tan[500],
  badgeBg: "rgba(255,255,255,0.1)",
  illustrationBg: palette.brown[800],
  closeBg: "rgba(255,255,255,0.15)",
  scoreColor: palette.olive[500],
  stressColor: palette.accent.orange,
} as const;

export function ExerciseCompletedModal({
  scoreEarned,
  stressReduction,
  message,
  onGotIt,
  onClose,
}: ExerciseCompletedModalProps): React.ReactElement {
  return (
    <View testID="exercise-completed-modal" style={styles.container}>
      {/* Modal Card */}
      <View testID="modal-card" style={styles.modalCard}>
        {/* Illustration */}
        <View testID="illustration" style={styles.illustration}>
          <Text style={styles.illustrationPlaceholder}>{"\uD83E\uDDD8"}</Text>
        </View>

        {/* Title */}
        <Text testID="completion-title" style={styles.title}>
          Exercise Completed!
        </Text>

        {/* Reward Badges */}
        <View style={styles.badgesRow}>
          <View testID="score-badge" style={styles.badge}>
            <Text style={styles.scoreIcon}>{"\u2728"}</Text>
            <Text style={styles.badgeText}>{scoreEarned} Solace Score</Text>
          </View>
          <View testID="stress-badge" style={styles.badge}>
            <Text style={styles.stressIcon}>{"\uD83D\uDE0C"}</Text>
            <Text style={styles.badgeText}>{stressReduction} Stress Level</Text>
          </View>
        </View>

        {/* Congratulations Message */}
        <Text style={styles.message}>
          {message} {"\uD83C\uDF89"}
        </Text>

        {/* Got It Button */}
        <TouchableOpacity
          testID="got-it-button"
          style={styles.gotItButton}
          onPress={onGotIt}
          accessibilityRole="button"
          accessibilityLabel="Dismiss and continue"
          activeOpacity={0.8}
        >
          <Text style={styles.gotItText}>Got it, thanks! {"\u2713"}</Text>
        </TouchableOpacity>
      </View>

      {/* Close Button */}
      <TouchableOpacity
        testID="close-button"
        style={styles.closeButton}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close modal"
      >
        <Text style={styles.closeIcon}>{"\u2715"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    backgroundColor: localColors.badgeBg,
    borderRadius: 16,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: localColors.white,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: localColors.closeBg,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  closeIcon: {
    color: localColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    backgroundColor: localColors.overlay,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  gotItButton: {
    alignItems: "center",
    backgroundColor: localColors.buttonBg,
    borderRadius: 28,
    justifyContent: "center",
    marginTop: 20,
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  gotItText: {
    color: localColors.dark,
    fontSize: 16,
    fontWeight: "700",
  },
  illustration: {
    alignItems: "center",
    backgroundColor: localColors.illustrationBg,
    borderRadius: 16,
    height: 180,
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  illustrationPlaceholder: {
    fontSize: 64,
  },
  message: {
    color: localColors.white,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: "center",
  },
  modalCard: {
    alignItems: "center",
    backgroundColor: localColors.cardBg,
    borderRadius: 24,
    padding: 24,
    width: "100%",
  },
  scoreIcon: {
    fontSize: 14,
  },
  stressIcon: {
    fontSize: 14,
  },
  title: {
    color: localColors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
});

export default ExerciseCompletedModal;
