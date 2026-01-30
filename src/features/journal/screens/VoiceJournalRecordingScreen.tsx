/**
 * VoiceJournalRecordingScreen Component
 * @screen Screen 82: Voice Journal Recording (Active)
 * @audit batch-17-journal-continued.md
 *
 * Visual ref: Mental_Health_Journal_Screen_05.png
 * - Real-time transcription display with keyword bolding
 * - Active waveform with warm colors
 * - Timer (00:05), mic button, cancel (orange), confirm (green)
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

const colors = {
  screenBg: "#1C1410",
  white: "#FFFFFF",
  boldText: "#FFFFFF",
  normalText: "rgba(255,255,255,0.8)",
  waveformOrange: "#E8853A",
  waveformBrown: "#8B6914",
  waveformDark: "#3D2E23",
  micBg: "#FFFFFF",
  cancelBg: "#E8853A",
  confirmBg: "#9AAD5C",
  timerText: "#FFFFFF",
  bottomBar: "#2A1F19",
  backBtnBorder: "rgba(255,255,255,0.3)",
} as const;

interface VoiceJournalRecordingScreenProps {
  transcribedText: string;
  recordingDuration: string;
  isRecording: boolean;
  onBack: () => void;
  onStopRecording: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function VoiceJournalRecordingScreen({
  transcribedText,
  recordingDuration,
  onBack,
  onStopRecording,
  onCancel,
  onConfirm,
}: VoiceJournalRecordingScreenProps): React.ReactElement {
  return (
    <View testID="voice-recording-screen" style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>☽</Text>
      </TouchableOpacity>

      {/* Transcription Display */}
      <ScrollView
        style={styles.transcriptionContainer}
        contentContainerStyle={styles.transcriptionContent}
      >
        <Text style={styles.transcriptionText}>{transcribedText}</Text>
      </ScrollView>

      {/* Waveform */}
      <View testID="waveform-display" style={styles.waveformContainer}>
        {Array.from({ length: 28 }).map((_, i) => {
          const waveColors = [colors.waveformOrange, colors.waveformBrown, colors.waveformDark];
          return (
            <View
              key={i}
              style={[
                styles.waveformBar,
                {
                  height: 15 + Math.sin(i * 0.5) * 30 + 20,
                  backgroundColor: waveColors[i % 3],
                },
              ]}
            />
          );
        })}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          testID="mic-button"
          style={styles.micButton}
          onPress={onStopRecording}
          accessibilityRole="button"
          accessibilityLabel="Stop recording"
        >
          <Text style={styles.micIcon}>🎙</Text>
        </TouchableOpacity>

        <View style={styles.actionBar}>
          <TouchableOpacity
            testID="cancel-button"
            style={styles.cancelButton}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel recording"
          >
            <Text style={styles.actionIcon}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.timerText}>{recordingDuration}</Text>

          <TouchableOpacity
            testID="confirm-button"
            style={styles.confirmButton}
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel="Confirm recording"
          >
            <Text style={styles.actionIcon}>✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 24,
    width: "100%",
  },
  actionIcon: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  backButton: {
    alignItems: "center",
    borderColor: colors.backBtnBorder,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    marginLeft: 24,
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  backIcon: {
    color: colors.white,
    fontSize: 22,
  },
  bottomSection: {
    alignItems: "center",
    backgroundColor: colors.bottomBar,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
    paddingTop: 24,
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: colors.cancelBg,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.confirmBg,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  container: {
    backgroundColor: colors.screenBg,
    flex: 1,
    paddingTop: 60,
  },
  micButton: {
    alignItems: "center",
    backgroundColor: colors.micBg,
    borderRadius: 40,
    elevation: 4,
    height: 80,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: 80,
  },
  micIcon: {
    fontSize: 32,
  },
  timerText: {
    color: colors.timerText,
    fontSize: 16,
    fontWeight: "600",
  },
  transcriptionContainer: {
    flex: 1,
    paddingHorizontal: 32,
  },
  transcriptionContent: {
    justifyContent: "center",
    paddingVertical: 24,
  },
  transcriptionText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 36,
    textAlign: "center",
  },
  waveformBar: {
    borderRadius: 3,
    marginHorizontal: 2,
    width: 6,
  },
  waveformContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default VoiceJournalRecordingScreen;
