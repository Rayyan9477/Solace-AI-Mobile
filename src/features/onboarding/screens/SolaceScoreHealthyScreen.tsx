/**
 * SolaceScoreHealthyScreen Component
 * @description Displays Solace score for healthy category (70+)
 * @task Task 3.3.9: Solace Score Healthy Screen (Screen 23)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface SolaceScoreHealthyScreenProps {
  score: number;
  onScheduleAppointment: () => void;
  onContinue: () => void;
}

export function SolaceScoreHealthyScreen({
  score,
  onScheduleAppointment,
  onContinue,
}: SolaceScoreHealthyScreenProps): React.ReactElement {
  return (
    <View
      testID="solace-score-healthy-screen"
      style={styles.container}
      accessibilityLabel="Your Solace Score result, you are mentally healthy"
    >
      {/* Page Title */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Your Solace Score</Text>
      </View>

      {/* Score Display */}
      <View style={styles.scoreSection}>
        <View testID="score-circle" style={styles.scoreCircle}>
          <Text testID="score-text" style={styles.scoreText}>
            {score}
          </Text>
        </View>
      </View>

      {/* Message Section */}
      <View style={styles.messageSection}>
        <Text style={styles.primaryMessage}>You're mentally healthy</Text>
        <Text style={styles.secondaryMessage}>Are you ready?</Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="schedule-button"
          style={styles.scheduleButton}
          onPress={onScheduleAppointment}
          accessibilityRole="button"
          accessibilityLabel="Schedule appointment"
        >
          <Text style={styles.scheduleButtonText}>Schedule appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to main app"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonSection: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    width: "100%",
  },
  container: {
    alignItems: "center",
    backgroundColor: palette.green[450],
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  continueButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  messageSection: {
    alignItems: "center",
    flex: 1,
    marginTop: 32,
  },
  pageTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  primaryMessage: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  scheduleButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[50]}`,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: "center",
    marginBottom: 12,
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  scheduleButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  scoreCircle: {
    alignItems: "center",
    backgroundColor: `${palette.white}${palette.alpha[20]}`,
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 80,
    borderWidth: 4,
    height: 160,
    justifyContent: "center",
    width: 160,
  },
  scoreSection: {
    alignItems: "center",
    marginTop: 40,
  },
  scoreText: {
    color: palette.white,
    fontSize: 64,
    fontWeight: "700",
  },
  secondaryMessage: {
    color: `${palette.white}${palette.alpha[80]}`,
    fontSize: 16,
    textAlign: "center",
  },
});

export default SolaceScoreHealthyScreen;
