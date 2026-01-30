/**
 * CrisisSupportAlertScreen Component
 * @screen Screen 86: Crisis Support Alert
 * @audit batch-18-journal-final-sleep-start.md
 * @fixes CRITICAL #86-1: Uses safe, empathetic language — "Crisis Pattern Detected"
 *        instead of the original harmful "Suicidal Mental Pattern Detected by AI!"
 * @fixes #86-2: "multiple account" → "multiple instances" (grammar fix)
 *
 * Visual ref: Mental_Health_Journal_Screen_09.png
 * - Full-screen modal overlay
 * - Illustration area (person with anxious expression)
 * - SAFE crisis title: "Crisis Pattern Detected"
 * - Empathetic description
 * - "Crisis Support Now Active." primary button (⚠️ icon)
 * - "Call For Help!" secondary button (📞 icon)
 * - Dismiss (brown dot) and Close (✕) bottom buttons
 *
 * SAFETY NOTE: This screen deals with crisis detection. All copy uses
 * supportive, non-triggering language per clinical best practices.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const colors = {
  backdrop: "rgba(0, 0, 0, 0.7)",
  modalBg: "#1C1410",
  white: "#FFFFFF",
  subtitle: "#94A3B8",
  illustrationBg: "#F5EDE3",
  primaryBtnBg: "#4A3A7A",
  secondaryBtnBg: "#6B5B9A",
  dismissBg: "#3D2E23",
  closeBg: "rgba(255,255,255,0.15)",
  titleText: "#FFFFFF",
  bodyText: "#94A3B8",
  plantGreen: "#6B8E5A",
} as const;

interface CrisisSupportAlertScreenProps {
  visible: boolean;
  onCrisisSupport: () => void;
  onCallForHelp: () => void;
  onDismiss: () => void;
  onClose: () => void;
}

export function CrisisSupportAlertScreen({
  visible,
  onCrisisSupport,
  onCallForHelp,
  onDismiss,
  onClose,
}: CrisisSupportAlertScreenProps): React.ReactElement | null {
  if (!visible) {
    return null;
  }

  return (
    <View testID="crisis-support-alert-screen" style={styles.container}>
      {/* Backdrop */}
      <View testID="modal-backdrop" style={styles.backdrop} />

      {/* Modal Card */}
      <View style={styles.modalCard}>
        {/* Illustration */}
        <View testID="crisis-illustration" style={styles.illustration}>
          <View style={styles.plantLeft} />
          <View style={styles.plantRight} />
          <View style={styles.personCircle}>
            <Text style={styles.personEmoji}>😰</Text>
          </View>
        </View>

        {/* Title — SAFE language per audit fix #86-1 */}
        <Text style={styles.title}>
          Crisis Pattern Detected
        </Text>

        {/* Description — empathetic, no triggering language */}
        <Text style={styles.body}>
          Our AI noticed patterns in your journal that suggest you may be going
          through a difficult time. Crisis support is now active.
        </Text>

        {/* Crisis Support Button */}
        <TouchableOpacity
          testID="crisis-support-button"
          style={styles.primaryButton}
          onPress={onCrisisSupport}
          accessibilityRole="button"
          accessibilityLabel="Access crisis support"
        >
          <Text style={styles.primaryButtonIcon}>⚠️</Text>
          <Text style={styles.primaryButtonText}>
            Crisis Support Now Active.
          </Text>
        </TouchableOpacity>

        {/* Call For Help Button */}
        <TouchableOpacity
          testID="call-for-help-button"
          style={styles.secondaryButton}
          onPress={onCallForHelp}
          accessibilityRole="button"
          accessibilityLabel="Call for help"
        >
          <Text style={styles.secondaryButtonText}>Call For Help!</Text>
          <Text style={styles.secondaryButtonIcon}>📞</Text>
        </TouchableOpacity>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            testID="dismiss-button"
            style={styles.dismissButton}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss alert"
          >
            <View style={styles.dismissDot} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="close-button"
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close alert"
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.backdrop,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  body: {
    color: colors.bodyText,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  bottomActions: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 32,
    width: "100%",
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: colors.closeBg,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  closeIcon: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  dismissButton: {
    alignItems: "center",
    backgroundColor: colors.dismissBg,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  dismissDot: {
    backgroundColor: colors.white,
    borderRadius: 5,
    height: 10,
    opacity: 0.5,
    width: 10,
  },
  illustration: {
    alignItems: "center",
    backgroundColor: colors.illustrationBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 200,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  modalCard: {
    alignItems: "center",
    backgroundColor: colors.modalBg,
    borderRadius: 24,
    marginHorizontal: 24,
    overflow: "hidden",
    paddingBottom: 24,
    width: "90%",
  },
  personCircle: {
    alignItems: "center",
    backgroundColor: "#E8B86D",
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  personEmoji: {
    fontSize: 48,
  },
  plantLeft: {
    backgroundColor: colors.plantGreen,
    borderRadius: 20,
    height: 60,
    left: 10,
    opacity: 0.6,
    position: "absolute",
    top: 20,
    transform: [{ rotate: "-30deg" }],
    width: 30,
  },
  plantRight: {
    backgroundColor: colors.plantGreen,
    borderRadius: 20,
    height: 60,
    opacity: 0.6,
    position: "absolute",
    right: 10,
    top: 10,
    transform: [{ rotate: "20deg" }],
    width: 30,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primaryBtnBg,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 20,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "85%",
  },
  primaryButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.secondaryBtnBg,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 12,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "85%",
  },
  secondaryButtonIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  title: {
    color: colors.titleText,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    paddingHorizontal: 24,
    textAlign: "center",
  },
});

export default CrisisSupportAlertScreen;
