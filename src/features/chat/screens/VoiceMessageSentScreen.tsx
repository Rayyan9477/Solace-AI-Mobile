/**
 * VoiceMessageSentScreen Component
 * @description Confirmation screen after voice message has been recorded and sent
 * @task Task 3.7.10: Voice Message Sent Screen (Screen 62)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { palette } from "../../../shared/theme";

interface VoiceMessageSentScreenProps {
  recordingDuration: number;
  isAnalyzing: boolean;
  analysisComplete: boolean;
  isPlaying: boolean;
  playbackProgress: number;
  detectedMood: string;
  confidenceScore: number;
  onBack: () => void;
  onContinueToChat: () => void;
  onRecordAnother: () => void;
  onPlayRecording: () => void;
  onPauseRecording: () => void;
}

export function VoiceMessageSentScreen({
  recordingDuration,
  isAnalyzing,
  analysisComplete,
  isPlaying,
  playbackProgress,
  detectedMood,
  confidenceScore,
  onBack,
  onContinueToChat,
  onRecordAnother,
  onPlayRecording,
  onPauseRecording,
}: VoiceMessageSentScreenProps): React.ReactElement {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View testID="voice-message-sent-screen" style={styles.container}>
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
        <View style={styles.headerSpacer} />
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Success Icon */}
        <View testID="success-icon" style={styles.successIconContainer}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Voice Message Sent</Text>
        <Text style={styles.successSubtitle}>
          Solace AI is processing your voice to understand your emotional state
        </Text>

        {/* Audio Playback Controls */}
        <View testID="audio-playback-container" style={styles.audioContainer}>
          <View style={styles.audioCard}>
            {isPlaying ? (
              <TouchableOpacity
                testID="pause-button"
                style={styles.playPauseButton}
                onPress={onPauseRecording}
                accessibilityRole="button"
                accessibilityLabel="Pause recording"
              >
                <Text style={styles.playPauseIcon}>⏸️</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                testID="play-button"
                style={styles.playPauseButton}
                onPress={onPlayRecording}
                accessibilityRole="button"
                accessibilityLabel="Play recording"
              >
                <Text style={styles.playPauseIcon}>▶️</Text>
              </TouchableOpacity>
            )}

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${playbackProgress * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.durationText}>
                {formatDuration(recordingDuration)}
              </Text>
            </View>
          </View>
        </View>

        {/* Analysis Status */}
        {isAnalyzing && !analysisComplete ? (
          <View testID="analyzing-indicator" style={styles.analyzingContainer}>
            <ActivityIndicator size="small" color={palette.olive[500]} />
            <Text style={styles.analyzingText}>
              Analyzing your voice pattern...
            </Text>
          </View>
        ) : (
          analysisComplete && (
            <View testID="analysis-result" style={styles.analysisContainer}>
              <Text style={styles.analysisTitle}>Analysis Complete</Text>
              <View style={styles.analysisCard}>
                <View style={styles.moodResult}>
                  <Text style={styles.moodLabel}>Detected Mood</Text>
                  <Text style={styles.moodValue}>{detectedMood}</Text>
                </View>
                <View style={styles.confidenceResult}>
                  <Text style={styles.confidenceLabel}>Confidence</Text>
                  <Text style={styles.confidenceValue}>{confidenceScore}%</Text>
                </View>
              </View>
            </View>
          )
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinueToChat}
          accessibilityRole="button"
          accessibilityLabel="Continue to chat"
        >
          <Text style={styles.continueButtonText}>Continue to Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="record-another-button"
          style={styles.recordAnotherButton}
          onPress={onRecordAnother}
          accessibilityRole="button"
          accessibilityLabel="Record another message"
        >
          <Text style={styles.recordAnotherText}>Record Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: palette.brown[900],
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  analysisCard: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    padding: 20,
  },
  analysisContainer: {
    marginTop: 32,
    width: "100%",
  },
  analysisTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  analyzingContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 32,
  },
  analyzingText: {
    color: palette.gray[400],
    fontSize: 14,
    marginLeft: 12,
  },
  audioCard: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    padding: 16,
    width: "100%",
  },
  audioContainer: {
    marginTop: 32,
    width: "100%",
  },
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
  confidenceLabel: {
    color: palette.gray[400],
    fontSize: 12,
    marginBottom: 4,
  },
  confidenceResult: {
    alignItems: "flex-end",
    flex: 1,
  },
  confidenceValue: {
    color: palette.olive[500],
    fontSize: 24,
    fontWeight: "700",
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
    paddingTop: 40,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 56,
    paddingVertical: 16,
  },
  continueButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  durationText: {
    color: palette.gray[400],
    fontSize: 12,
    marginLeft: 8,
    minWidth: 35,
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
  moodLabel: {
    color: palette.gray[400],
    fontSize: 12,
    marginBottom: 4,
  },
  moodResult: {
    flex: 1,
  },
  moodValue: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
  },
  playPauseButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginRight: 16,
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  playPauseIcon: {
    fontSize: 20,
  },
  progressBar: {
    backgroundColor: palette.brown[700],
    borderRadius: 2,
    flex: 1,
    height: 4,
    overflow: "hidden",
  },
  progressContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  progressFill: {
    backgroundColor: palette.olive[500],
    borderRadius: 2,
    height: "100%",
  },
  recordAnotherButton: {
    alignItems: "center",
    marginTop: 12,
    minHeight: 44,
    paddingVertical: 12,
  },
  recordAnotherText: {
    color: palette.tan[500],
    fontSize: 14,
    fontWeight: "500",
  },
  successIcon: {
    color: palette.white,
    fontSize: 40,
    fontWeight: "700",
  },
  successIconCircle: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  successIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successSubtitle: {
    color: palette.gray[400],
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  successTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
});

export default VoiceMessageSentScreen;
