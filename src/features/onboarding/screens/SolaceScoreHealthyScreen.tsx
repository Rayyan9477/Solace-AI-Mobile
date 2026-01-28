/**
 * SolaceScoreHealthyScreen Component
 * @description Displays Solace score for healthy category (70+)
 * @task Task 3.3.9: Solace Score Healthy Screen (Screen 23)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
    backgroundColor: "#4A9E8C",
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  continueButtonText: {
    color: "#1C1410",
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  primaryMessage: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  scheduleButton: {
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.5)",
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scoreCircle: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
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
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "700",
  },
  secondaryMessage: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SolaceScoreHealthyScreen;
