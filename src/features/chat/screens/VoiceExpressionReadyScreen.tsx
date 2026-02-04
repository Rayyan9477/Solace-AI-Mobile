/**
 * VoiceExpressionReadyScreen Component
 * @description Voice expression ready/landing screen before recording begins
 * @task Task 3.7.8: Voice Expression Ready Screen (Screen 60)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { palette } from "../../../shared/theme";

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface VoiceExpressionReadyScreenProps {
  microphonePermissionGranted: boolean;
  tips: Tip[];
  onBack: () => void;
  onStartRecording: () => void;
  onSkip: () => void;
  onRequestPermission: () => void;
}

export function VoiceExpressionReadyScreen({
  microphonePermissionGranted,
  tips,
  onBack,
  onStartRecording,
  onSkip,
  onRequestPermission,
}: VoiceExpressionReadyScreenProps): React.ReactElement {
  const getTipIcon = (iconType: string): string => {
    switch (iconType) {
      case "quiet":
        return "🤫";
      case "speak":
        return "🗣️";
      case "express":
        return "💭";
      default:
        return "💡";
    }
  };

  return (
    <View testID="voice-expression-ready-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Voice Analysis</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Microphone Icon */}
        <View testID="microphone-icon" style={styles.microphoneContainer}>
          <View style={styles.microphoneCircle}>
            <Text style={styles.microphoneIcon}>🎙️</Text>
          </View>
          <View style={styles.microphonePulse} />
        </View>

        {/* Title and Subtitle */}
        <Text style={styles.title}>Ready to record</Text>
        <Text style={styles.subtitle}>
          Solace AI will analyze your voice to understand how you're feeling
        </Text>

        {/* Permission Required State */}
        {!microphonePermissionGranted && (
          <View testID="permission-required" style={styles.permissionContainer}>
            <View style={styles.permissionBanner}>
              <Text style={styles.permissionIcon}>🔒</Text>
              <View style={styles.permissionTextContainer}>
                <Text style={styles.permissionTitle}>
                  Microphone Access Required
                </Text>
                <Text style={styles.permissionDescription}>
                  To analyze your voice, Solace AI needs microphone access
                </Text>
              </View>
            </View>
            <TouchableOpacity
              testID="grant-permission-button"
              style={styles.grantPermissionButton}
              onPress={onRequestPermission}
              accessibilityRole="button"
              accessibilityLabel="Grant microphone permission"
            >
              <Text style={styles.grantPermissionText}>
                Grant Microphone Access
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tips Section */}
        <View testID="tips-section" style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for best results</Text>
          {tips.map((tip) => (
            <View
              key={tip.id}
              testID={`tip-item-${tip.id}`}
              style={styles.tipCard}
            >
              <View style={styles.tipIconContainer}>
                <Text style={styles.tipIcon}>{getTipIcon(tip.icon)}</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {microphonePermissionGranted ? (
          <TouchableOpacity
            testID="start-recording-button"
            style={styles.startButton}
            onPress={onStartRecording}
            accessibilityRole="button"
            accessibilityLabel="Start recording"
          >
            <Text style={styles.startButtonIcon}>🎤</Text>
            <Text style={styles.startButtonText}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.disabledButton}>
            <Text style={styles.disabledButtonIcon}>🎤</Text>
            <Text style={styles.disabledButtonText}>Start Recording</Text>
          </View>
        )}

        <TouchableOpacity
          testID="skip-button"
          style={styles.skipButton}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip voice analysis"
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
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
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  disabledButton: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    opacity: 0.5,
    paddingVertical: 16,
  },
  disabledButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  disabledButtonText: {
    color: palette.gray[400],
    fontSize: 16,
    fontWeight: "600",
  },
  grantPermissionButton: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 12,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 14,
  },
  grantPermissionText: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "600",
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
  microphoneCircle: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  microphoneContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    marginTop: 40,
    position: "relative",
  },
  microphoneIcon: {
    fontSize: 40,
  },
  microphonePulse: {
    borderColor: palette.olive[500],
    borderRadius: 70,
    borderWidth: 2,
    height: 140,
    opacity: 0.3,
    position: "absolute",
    width: 140,
  },
  permissionBanner: {
    backgroundColor: palette.brown[700],
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
  },
  permissionContainer: {
    marginBottom: 24,
  },
  permissionDescription: {
    color: palette.gray[400],
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  permissionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  skipButton: {
    alignItems: "center",
    marginTop: 12,
    minHeight: 44,
    paddingVertical: 12,
  },
  skipButtonText: {
    color: palette.gray[400],
    fontSize: 14,
    fontWeight: "500",
  },
  startButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingVertical: 16,
  },
  startButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  startButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipDescription: {
    color: palette.gray[400],
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipIconContainer: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    marginRight: 12,
    width: 40,
  },
  tipTitle: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
  },
  tipsSection: {
    marginTop: 8,
  },
  tipsTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  title: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default VoiceExpressionReadyScreen;
