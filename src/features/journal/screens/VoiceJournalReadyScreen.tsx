/**
 * VoiceJournalReadyScreen Component
 * @screen Screen 81: Voice Journal Ready
 * @audit batch-17-journal-continued.md
 *
 * Visual ref: Mental_Health_Journal_Screen_04.png
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const colors = {
  screenBg: "#1C1410",
  white: "#FFFFFF",
  promptText: "#FFFFFF",
  waveformBar: "#3D2E23",
  waveformBarAlt: "#4A3728",
  micBg: "#FFFFFF",
  micIcon: "#1C1410",
  cancelBg: "#3D2E23",
  confirmBg: "#3D2E23",
  statusText: "#FFFFFF",
  bottomBar: "#2A1F19",
  backBtnBorder: "rgba(255,255,255,0.3)",
} as const;

interface VoiceJournalReadyScreenProps {
  onBack: () => void;
  onStartRecording: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function VoiceJournalReadyScreen({
  onBack,
  onStartRecording,
  onCancel,
  onConfirm,
}: VoiceJournalReadyScreenProps): React.ReactElement {
  return (
    <View testID="voice-journal-ready-screen" style={styles.container}>
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

      {/* Prompt */}
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>
          Say anything that's{"\n"}on your mind!
        </Text>
      </View>

      {/* Waveform */}
      <View testID="waveform-display" style={styles.waveformContainer}>
        {Array.from({ length: 24 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.waveformBar,
              { height: 20 + Math.random() * 30 },
            ]}
          />
        ))}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Mic Button */}
        <TouchableOpacity
          testID="mic-button"
          style={styles.micButton}
          onPress={onStartRecording}
          accessibilityRole="button"
          accessibilityLabel="Start recording"
        >
          <Text style={styles.micIcon}>🎙</Text>
        </TouchableOpacity>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            testID="cancel-button"
            style={styles.cancelButton}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel recording"
          >
            <Text style={styles.cancelIcon}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.statusLabel}>Ready</Text>

          <TouchableOpacity
            testID="confirm-button"
            style={styles.confirmButton}
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel="Confirm recording"
          >
            <Text style={styles.confirmIcon}>✓</Text>
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
  cancelIcon: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
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
  confirmIcon: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
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
  promptContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  promptText: {
    color: colors.promptText,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  statusLabel: {
    color: colors.statusText,
    fontSize: 16,
    fontWeight: "600",
  },
  waveformBar: {
    backgroundColor: colors.waveformBar,
    borderRadius: 3,
    marginHorizontal: 2,
    width: 6,
  },
  waveformContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});

export default VoiceJournalReadyScreen;
