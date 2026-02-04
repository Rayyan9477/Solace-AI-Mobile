/**
 * VoiceRecordingActiveScreen Component
 * @description Active voice recording interface with waveform visualization
 * @task Task 3.7.9: Voice Recording Active Screen (Screen 61)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface VoiceRecordingActiveScreenProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingDuration: number;
  waveformData: number[];
  maxDuration: number;
  onBack: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onCancel: () => void;
}

export function VoiceRecordingActiveScreen({
  isPaused,
  recordingDuration,
  waveformData,
  maxDuration,
  onBack,
  onPause,
  onResume,
  onStop,
  onCancel,
}: VoiceRecordingActiveScreenProps): React.ReactElement {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = (recordingDuration / maxDuration) * 100;

  return (
    <View testID="voice-recording-active-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recording</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Recording Indicator */}
        {!isPaused ? (
          <View testID="recording-indicator" style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording</Text>
          </View>
        ) : (
          <View testID="paused-indicator" style={styles.pausedIndicator}>
            <Text style={styles.pausedIcon}>⏸️</Text>
            <Text style={styles.pausedText}>Paused</Text>
          </View>
        )}

        {/* Instruction Text */}
        <Text style={styles.instructionText}>
          Speak naturally and let Solace AI understand how you're feeling
        </Text>

        {/* Waveform Visualization */}
        <View testID="waveform-visualization" style={styles.waveformContainer}>
          {waveformData.map((amplitude, index) => (
            <View
              key={index}
              testID={`waveform-bar-${index}`}
              style={[
                styles.waveformBar,
                {
                  height: amplitude * 80,
                  opacity: isPaused ? 0.4 : 1,
                },
              ]}
            />
          ))}
        </View>

        {/* Recording Timer */}
        <View testID="recording-timer" style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatDuration(recordingDuration)}</Text>
          <Text style={styles.timerDivider}>/</Text>
          <Text style={styles.maxDurationText}>{formatDuration(maxDuration)}</Text>
        </View>

        {/* Progress Bar */}
        <View testID="progress-bar" style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercent}%` }]}
          />
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Cancel Button */}
        <TouchableOpacity
          testID="cancel-button"
          style={styles.cancelButton}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel recording"
        >
          <Text style={styles.cancelIcon}>✕</Text>
        </TouchableOpacity>

        {/* Pause/Resume Button */}
        {isPaused ? (
          <TouchableOpacity
            testID="resume-button"
            style={styles.pauseButton}
            onPress={onResume}
            accessibilityRole="button"
            accessibilityLabel="Resume recording"
          >
            <Text style={styles.pauseIcon}>▶️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            testID="pause-button"
            style={styles.pauseButton}
            onPress={onPause}
            accessibilityRole="button"
            accessibilityLabel="Pause recording"
          >
            <Text style={styles.pauseIcon}>⏸️</Text>
          </TouchableOpacity>
        )}

        {/* Stop Button */}
        <TouchableOpacity
          testID="stop-button"
          style={styles.stopButton}
          onPress={onStop}
          accessibilityRole="button"
          accessibilityLabel="Stop recording"
        >
          <View style={styles.stopButtonInner} />
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
    fontSize: 20,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  cancelIcon: {
    color: palette.onboarding.step2,
    fontSize: 20,
    fontWeight: "600",
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  controlsContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  instructionText: {
    color: palette.gray[400],
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 40,
    marginTop: 12,
    textAlign: "center",
  },
  maxDurationText: {
    color: palette.gray[400],
    fontSize: 14,
  },
  pauseButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 32,
    height: 64,
    justifyContent: "center",
    marginHorizontal: 24,
    minHeight: 44,
    minWidth: 44,
    width: 64,
  },
  pauseIcon: {
    fontSize: 24,
  },
  pausedIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  pausedIndicator: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pausedText: {
    color: palette.tan[500],
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    backgroundColor: palette.olive[500],
    borderRadius: 2,
    height: "100%",
  },
  progressBarContainer: {
    backgroundColor: palette.brown[800],
    borderRadius: 2,
    height: 4,
    marginTop: 16,
    overflow: "hidden",
    width: "100%",
  },
  recordingDot: {
    backgroundColor: palette.onboarding.step2,
    borderRadius: 6,
    height: 12,
    marginRight: 8,
    width: 12,
  },
  recordingIndicator: {
    alignItems: "center",
    backgroundColor: "rgba(232, 133, 58, 0.2)",
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  recordingText: {
    color: palette.onboarding.step2,
    fontSize: 14,
    fontWeight: "600",
  },
  stopButton: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 35,
    height: 70,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 70,
  },
  stopButtonInner: {
    backgroundColor: palette.white,
    borderRadius: 4,
    height: 24,
    width: 24,
  },
  timerContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    marginTop: 24,
  },
  timerDivider: {
    color: palette.gray[400],
    fontSize: 18,
    marginHorizontal: 4,
  },
  timerText: {
    color: palette.white,
    fontSize: 48,
    fontWeight: "700",
  },
  waveformBar: {
    backgroundColor: palette.olive[500],
    borderRadius: 2,
    marginHorizontal: 2,
    width: 4,
  },
  waveformContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    justifyContent: "center",
    marginTop: 40,
  },
});

export default VoiceRecordingActiveScreen;
