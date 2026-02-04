/**
 * DurationPickerScreen Component
 * @description Second step of new exercise wizard with large duration display,
 *   sound preview button, and continue button
 * @task Task 3.12.4: Duration Picker Screen (Screen 107)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface DurationPickerScreenProps {
  duration: string;
  soundName: string;
  stepLabel: string;
  onBack: () => void;
  onDurationPress: () => void;
  onSoundPress: () => void;
  onContinue: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  durationBg: palette.accent.green,
  continueBg: palette.primary.gold,
  soundPillBg: palette.background.secondary,
  textSecondary: palette.text.secondary,
  stepIndicator: palette.accent.green,
} as const;

export function DurationPickerScreen({
  duration,
  soundName,
  stepLabel,
  onBack,
  onDurationPress,
  onSoundPress,
  onContinue,
}: DurationPickerScreenProps): React.ReactElement {
  return (
    <View testID="duration-picker-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>New Exercise</Text>
        <View style={styles.headerSpacer} />
        <Text testID="step-indicator" style={styles.stepIndicator}>
          {stepLabel}
        </Text>
      </View>

      {/* Question Title */}
      <Text testID="question-title" style={styles.questionTitle}>
        How much time do you have for exercise?
      </Text>

      {/* Duration Display */}
      <View style={styles.durationSection}>
        <TouchableOpacity
          testID="duration-display"
          style={styles.durationDisplay}
          onPress={onDurationPress}
          accessibilityRole="button"
          accessibilityLabel={`Select duration: ${duration} minutes`}
        >
          <Text testID="duration-value" style={styles.durationValue}>
            {duration}
          </Text>
        </TouchableOpacity>
        <Text style={styles.minutesLabel}>Minutes</Text>
      </View>

      {/* Sound Preview Button */}
      <View style={styles.soundSection}>
        <TouchableOpacity
          testID="sound-preview-button"
          style={styles.soundPreviewButton}
          onPress={onSoundPress}
          accessibilityRole="button"
          accessibilityLabel={`Change sound: ${soundName}`}
        >
          <Text style={styles.soundIcon}>{"\uD83D\uDD0A"}</Text>
          <Text style={styles.soundText}>Sound: {soundName}</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue {"\u2192"}</Text>
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
  continueButton: {
    alignItems: "center",
    backgroundColor: colors.continueBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  continueText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  durationDisplay: {
    alignItems: "center",
    backgroundColor: colors.durationBg,
    borderRadius: 40,
    justifyContent: "center",
    paddingHorizontal: 48,
    paddingVertical: 32,
  },
  durationSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  durationValue: {
    color: colors.white,
    fontSize: 64,
    fontWeight: "800",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  minutesLabel: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 12,
  },
  questionTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  soundIcon: {
    fontSize: 16,
  },
  soundPreviewButton: {
    alignItems: "center",
    backgroundColor: colors.soundPillBg,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  soundSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  soundText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  stepIndicator: {
    color: colors.stepIndicator,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DurationPickerScreen;
