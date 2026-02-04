/**
 * AssessmentSoundAnalysisScreen Component
 * @description Voice analysis assessment screen with concentric circle visualizer
 * @task Task 3.4.8: Assessment Sound Analysis Screen (Screen 38)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface AssessmentSoundAnalysisScreenProps {
  currentStep: number;
  totalSteps: number;
  onContinue: () => void;
  onBack?: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
  audioLevel?: number;
}

const PHRASE_HIGHLIGHTED = "I believe in";
const PHRASE_REMAINING = "Solace AI, with all my heart.";

export function AssessmentSoundAnalysisScreen({
  currentStep,
  totalSteps,
  onContinue,
  onBack,
  onStartRecording,
  onStopRecording,
  isRecording = false,
  audioLevel = 0,
}: AssessmentSoundAnalysisScreenProps): React.ReactElement {
  const progress = currentStep / totalSteps;

  const handleRecordPress = () => {
    if (isRecording) {
      onStopRecording?.();
    } else {
      onStartRecording?.();
    }
  };

  const handleSkip = () => {
    onContinue();
  };

  // Calculate circle scales based on audio level
  const getCircleScale = (baseScale: number) => {
    return baseScale + audioLevel * 0.1;
  };

  return (
    <View testID="assessment-sound-analysis-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity
              testID="back-button"
              style={styles.backButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backButtonIcon}>{"<"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress Indicator */}
        <View testID="progress-indicator" style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <View style={styles.progressInner}>
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.headerTitle}>Assessment</Text>
          <Text style={styles.stepCounter}>
            {currentStep} of {totalSteps}
          </Text>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>AI Sound Analysis</Text>
        <Text style={styles.subtitle}>
          Please say the following words below. Your voice data is processed
          securely and never stored.
        </Text>
      </View>

      {/* Voice Visualizer */}
      <View testID="voice-visualizer" style={styles.visualizerContainer}>
        <View
          testID="visualizer-outer-circle"
          style={[
            styles.visualizerCircle,
            styles.outerCircle,
            { transform: [{ scale: getCircleScale(1) }] },
          ]}
        >
          <View
            testID="visualizer-middle-circle"
            style={[
              styles.visualizerCircle,
              styles.middleCircle,
              { transform: [{ scale: getCircleScale(1) }] },
            ]}
          >
            <View
              testID="visualizer-inner-circle"
              style={[
                styles.visualizerCircle,
                styles.innerCircle,
                { transform: [{ scale: getCircleScale(1) }] },
            ]}
            >
              <View
                testID="visualizer-center-circle"
                style={[styles.visualizerCircle, styles.centerCircle]}
              />
            </View>
          </View>
        </View>
        {isRecording && (
          <View testID="recording-indicator" style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        )}
      </View>

      {/* Phrase to Read */}
      <View testID="phrase-display" style={styles.phraseContainer}>
        <View style={styles.phraseContent}>
          <View testID="phrase-highlighted" style={styles.highlightedBox}>
            <Text style={styles.highlightedText}>{PHRASE_HIGHLIGHTED}</Text>
          </View>
          <Text style={styles.remainingText}>{PHRASE_REMAINING}</Text>
        </View>
      </View>

      {/* Record Button */}
      <View style={styles.recordSection}>
        <TouchableOpacity
          testID="record-button"
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
          ]}
          onPress={handleRecordPress}
          accessibilityRole="button"
          accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
        >
          <View
            style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerActive,
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.recordHint}>
          {isRecording ? "Tap to stop" : "Tap to record"}
        </Text>
      </View>

      {/* Skip Option */}
      <TouchableOpacity
        testID="skip-button"
        style={styles.skipButton}
        onPress={handleSkip}
        accessibilityRole="button"
        accessibilityLabel="Skip voice analysis"
      >
        <Text style={styles.skipText}>Skip this step</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next question"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Text style={styles.continueButtonIcon}>→</Text>
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
  buttonSection: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  centerCircle: {
    backgroundColor: "#D4E4A5",
    height: 60,
    width: 60,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
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
  continueButtonIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  headerLeft: {
    width: 60,
  },
  headerRight: {
    alignItems: "flex-end",
    width: 80,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  highlightedBox: {
    backgroundColor: palette.onboarding.step2,
    borderRadius: 4,
    marginRight: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  highlightedText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  innerCircle: {
    backgroundColor: palette.olive[550],
    height: 100,
    width: 100,
  },
  middleCircle: {
    backgroundColor: palette.olive[700],
    height: 140,
    width: 140,
  },
  outerCircle: {
    backgroundColor: "#4A5A30",
    height: 180,
    width: 180,
  },
  phraseContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  phraseContent: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  progressCircle: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressInner: {
    alignItems: "center",
    backgroundColor: palette.brown[900],
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  progressText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600",
  },
  recordButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.onboarding.step2,
    borderRadius: 40,
    borderWidth: 3,
    height: 80,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 80,
  },
  recordButtonActive: {
    backgroundColor: palette.brown[700],
    borderColor: "#FF6B6B",
  },
  recordButtonInner: {
    backgroundColor: palette.onboarding.step2,
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  recordButtonInnerActive: {
    backgroundColor: "#FF6B6B",
    borderRadius: 4,
    height: 24,
    width: 24,
  },
  recordHint: {
    color: palette.gray[400],
    fontSize: 14,
    marginTop: 12,
  },
  recordSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  recordingDot: {
    backgroundColor: "#FF6B6B",
    borderRadius: 4,
    height: 8,
    marginRight: 8,
    width: 8,
  },
  recordingIndicator: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
  },
  recordingText: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "500",
  },
  remainingText: {
    color: palette.gray[400],
    fontSize: 16,
  },
  screenTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  skipButton: {
    alignItems: "center",
    marginBottom: 24,
    minHeight: 44,
    paddingVertical: 12,
  },
  skipText: {
    color: palette.gray[400],
    fontSize: 14,
    textDecorationLine: "underline",
  },
  stepCounter: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 2,
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  titleSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  visualizerCircle: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
  },
  visualizerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
});

export default AssessmentSoundAnalysisScreen;
