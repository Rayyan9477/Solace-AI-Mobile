/**
 * AssessmentIntroScreen Component
 * @description Intro/welcome screen before starting mental health assessment
 * @task Task 3.4.1: Assessment Intro Screen (Screen 36)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface AssessmentIntroScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function AssessmentIntroScreen({
  onStart,
  onBack,
}: AssessmentIntroScreenProps): React.ReactElement {
  return (
    <View testID="assessment-intro-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration */}
      <View testID="assessment-illustration" style={styles.illustration}>
        <View style={styles.illustrationCircle}>
          <View style={styles.brainIcon}>
            <View style={styles.brainHalf} />
            <View style={[styles.brainHalf, styles.brainHalfRight]} />
          </View>
          <View style={styles.heartIcon}>
            <Text style={styles.heartEmoji}>❤️</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Mental Health Assessment</Text>
        <Text style={styles.description}>
          This assessment will help us understand your mental health better and
          personalize your experience.
        </Text>

        {/* Info Cards */}
        <View testID="info-cards" style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📋</Text>
            <Text style={styles.infoText}>14 questions</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoText}>5-7 minutes</Text>
          </View>
        </View>

        {/* Privacy Notice */}
        <Text style={styles.privacyNotice}>
          Your responses are private and confidential
        </Text>
      </View>

      {/* Start Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="start-button"
          style={styles.startButton}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Start the mental health assessment"
        >
          <Text style={styles.startButtonText}>Start Assessment</Text>
          <Text style={styles.startButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  brainHalf: {
    backgroundColor: palette.olive[500],
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    height: 50,
    width: 25,
  },
  brainHalfRight: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    marginLeft: 4,
  },
  brainIcon: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonSection: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  content: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 24,
  },
  description: {
    color: palette.gray[400],
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  heartEmoji: {
    fontSize: 24,
  },
  heartIcon: {
    bottom: -10,
    position: "absolute",
    right: 20,
  },
  illustration: {
    alignItems: "center",
    marginBottom: 32,
  },
  illustrationCircle: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 75,
    height: 150,
    justifyContent: "center",
    position: "relative",
    width: 150,
  },
  infoCard: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flexDirection: "row",
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoCards: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "500",
  },
  privacyNotice: {
    color: palette.gray[500],
    fontSize: 12,
    marginTop: 24,
    textAlign: "center",
  },
  startButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  startButtonIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  startButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default AssessmentIntroScreen;
