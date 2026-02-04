/**
 * CourseCompletedScreen Component
 * @description Post-completion rating screen with tree illustration,
 *   emoji-based satisfaction scale, and rate session button
 * @task Task 3.13.7: Course Completed Screen (Screen 118)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix Replaced "freudScoreEarned" with "solaceScoreEarned" in data model
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface RatingOption {
  id: string;
  emoji: string;
  color: string;
  label: string;
}

interface CourseCompletedScreenProps {
  prompt: string;
  ratingOptions: RatingOption[];
  selectedRatingId: string | null;
  onBack: () => void;
  onRatingSelect: (id: string) => void;
  onRateSession: () => void;
}

const colors = {
  background: palette.brown[900],
  white: palette.white,
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  rateButtonBg: palette.tan[500],
  selectionIndicator: palette.tan[500],
} as const;

export function CourseCompletedScreen({
  prompt,
  ratingOptions,
  selectedRatingId,
  onBack,
  onRatingSelect,
  onRateSession,
}: CourseCompletedScreenProps): React.ReactElement {
  return (
    <View testID="course-completed-screen" style={styles.container}>
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
      </View>

      {/* Illustration */}
      <View testID="completion-illustration" style={styles.illustration} />

      {/* Title & Prompt */}
      <Text style={styles.title}>Course Done!</Text>
      <Text style={styles.prompt}>{prompt}</Text>

      {/* Rating Section */}
      <View style={styles.ratingSection}>
        {/* Selection Indicator */}
        {selectedRatingId !== null && (
          <View testID="selection-indicator" style={styles.selectionIndicator}>
            <Text style={styles.selectionArrow}>{"\u25BC"}</Text>
          </View>
        )}

        {/* Emoji Row */}
        <View style={styles.emojiRow}>
          {ratingOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              testID={`rating-option-${option.id}`}
              style={[
                styles.emojiButton,
                selectedRatingId === option.id && {
                  backgroundColor: option.color,
                },
              ]}
              onPress={() => onRatingSelect(option.id)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
            >
              <Text style={styles.emoji}>{option.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rate Session Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="rate-session-button"
          style={styles.rateButton}
          onPress={onRateSession}
          accessibilityRole="button"
          accessibilityLabel="Rate Session"
        >
          <Text style={styles.rateButtonText}>Rate Session +</Text>
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
  emoji: {
    fontSize: 32,
  },
  emojiButton: {
    alignItems: "center",
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  emojiRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  illustration: {
    alignSelf: "center",
    backgroundColor: `${palette.white}${palette.alpha[5]}`,
    borderRadius: 16,
    height: 200,
    marginTop: 24,
    width: 200,
  },
  prompt: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 8,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  rateButton: {
    alignItems: "center",
    backgroundColor: colors.rateButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  rateButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  ratingSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  selectionArrow: {
    color: colors.selectionIndicator,
    fontSize: 16,
  },
  selectionIndicator: {
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 24,
    textAlign: "center",
  },
});

export default CourseCompletedScreen;
