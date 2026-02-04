/**
 * SolaceScoreCriticalScreen Component
 * @description Displays Solace score for critical category (<30) with crisis resources
 * @task Task 3.3.11: Solace Score Critical Screen (Screen 25)
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * SAFETY-CRITICAL: Integrated with CrisisModal for immediate crisis support
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CrisisModal } from "../../../shared/components/organisms/crisis";
import { palette } from "../../../shared/theme";

interface SolaceScoreCriticalScreenProps {
  score: number;
  onCallHotline?: () => void; // Now optional, CrisisModal handles this
  onContinue: () => void;
}

export function SolaceScoreCriticalScreen({
  score,
  onCallHotline,
  onContinue,
}: SolaceScoreCriticalScreenProps): React.ReactElement {
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  /**
   * Handle crisis hotline button press
   * Shows CrisisModal with comprehensive crisis resources
   */
  const handleCallHotline = (): void => {
    setShowCrisisModal(true);
    onCallHotline?.(); // Call optional callback if provided
  };

  return (
    <View
      testID="solace-score-critical-screen"
      style={styles.container}
      accessibilityLabel="Your Solace Score result, you need immediate support, please call hotline or loved ones"
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
        <Text style={styles.primaryMessage}>You need immediate support</Text>
        <Text style={styles.secondaryMessage}>
          Please call hotline or loved ones
        </Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="call-hotline-button"
          style={styles.callHotlineButton}
          onPress={handleCallHotline}
          accessibilityRole="button"
          accessibilityLabel="Access crisis support resources including 988 hotline"
        >
          <Text testID="phone-icon" style={styles.phoneIcon}>
            📞
          </Text>
          <Text style={styles.callHotlineButtonText}>Access Crisis Support</Text>
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

      {/* Crisis Support Modal */}
      <CrisisModal
        visible={showCrisisModal}
        onDismiss={() => setShowCrisisModal(false)}
        triggerSource="score"
        requireAcknowledge
        testID="crisis-modal-score"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonSection: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    width: "100%",
  },
  callHotlineButton: {
    alignItems: "center",
    backgroundColor: palette.white,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  callHotlineButtonText: {
    color: palette.onboarding.step5,
    fontSize: 16,
    fontWeight: "700",
  },
  container: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step5,
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[50]}`,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  continueButtonText: {
    color: palette.white,
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
  phoneIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  primaryMessage: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
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

export default SolaceScoreCriticalScreen;
