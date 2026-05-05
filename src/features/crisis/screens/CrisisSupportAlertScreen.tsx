/**
 * CrisisSupportAlertScreen Component
 * @screen Screen 86: Crisis Support Alert
 * @audit batch-18-journal-final-sleep-start.md
 * @phase Phase 3C: Refactored to use theme tokens
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

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { palette } from "../../../shared/theme";

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
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  if (!visible) {
    return null;
  }

  const handleCallForHelp = (): void => {
    Linking.openURL("tel:988");
    onCallForHelp();
  };

  const handleDismiss = (): void => {
    if (!hasAcknowledged) return;
    onDismiss();
  };

  const handleClose = (): void => {
    if (!hasAcknowledged) return;
    onClose();
  };

  return (
    <View
      testID="crisis-support-alert-screen"
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      {/* Backdrop */}
      <View testID="modal-backdrop" style={styles.backdrop} />

      {/* Modal Card */}
      <View style={styles.modalCard}>
        {/* Illustration */}
        <View testID="crisis-illustration" style={styles.illustration}>
          <View style={styles.plantLeft} />
          <View style={styles.plantRight} />
          <View style={styles.personCircle}>
            <Icon name="alert-circle-outline" size={48} color={palette.warm[50]} />
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
          <Icon name="warning-outline" size={16} color={palette.warm[50]} style={styles.primaryButtonIcon} />
          <Text style={styles.primaryButtonText}>
            Crisis Support Now Active.
          </Text>
        </TouchableOpacity>

        {/* Call For Help Button */}
        <TouchableOpacity
          testID="call-for-help-button"
          style={styles.secondaryButton}
          onPress={handleCallForHelp}
          accessibilityRole="button"
          accessibilityLabel="Call 988 for help"
        >
          <Text style={styles.secondaryButtonText}>Call For Help!</Text>
          <Icon name="call-outline" size={16} color={palette.warm[50]} style={styles.secondaryButtonIcon} />
        </TouchableOpacity>

        {/* Acknowledge Button */}
        {!hasAcknowledged && (
          <TouchableOpacity
            testID="acknowledge-button"
            style={styles.acknowledgeButton}
            onPress={() => setHasAcknowledged(true)}
            accessibilityRole="button"
            accessibilityLabel="I understand these resources are available"
          >
            <Text style={styles.acknowledgeButtonText}>I Understand</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            testID="dismiss-button"
            style={[styles.dismissButton, !hasAcknowledged && styles.disabledButton]}
            onPress={handleDismiss}
            disabled={!hasAcknowledged}
            accessibilityRole="button"
            accessibilityLabel="Dismiss alert"
          >
            <View style={styles.dismissDot} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="close-button"
            style={[styles.closeButton, !hasAcknowledged && styles.disabledButton]}
            onPress={handleClose}
            disabled={!hasAcknowledged}
            accessibilityRole="button"
            accessibilityLabel="Close alert"
          >
            <Icon name="close-outline" size={18} color={palette.warm[50]} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  acknowledgeButton: {
    alignItems: "center",
    backgroundColor: `${palette.peach[500]}${palette.alpha[20]}`,
    borderColor: `${palette.peach[500]}${palette.alpha[30]}`,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 12,
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "85%",
  },
  acknowledgeButtonText: {
    color: palette.peach[300],
    fontSize: 15,
    fontWeight: "700",
  },
  backdrop: {
    backgroundColor: `${palette.midnight[950]}${palette.alpha[70]}`,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  body: {
    color: palette.warm[400],
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
    backgroundColor: `${palette.warm[50]}${palette.alpha[15]}`,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  closeIcon: {
    color: palette.warm[50],
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
  dismissButton: {
    alignItems: "center",
    backgroundColor: palette.midnight[700],
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  dismissDot: {
    backgroundColor: palette.warm[50],
    borderRadius: 5,
    height: 10,
    opacity: 0.5,
    width: 10,
  },
  illustration: {
    alignItems: "center",
    backgroundColor: palette.midnight[800],
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
    backgroundColor: palette.midnight[950],
    borderRadius: 24,
    marginHorizontal: 24,
    overflow: "hidden",
    paddingBottom: 24,
    width: "90%",
  },
  personCircle: {
    alignItems: "center",
    backgroundColor: palette.peach[300],
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  personEmoji: {
    fontSize: 48,
  },
  plantLeft: {
    backgroundColor: palette.sage[700],
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
    backgroundColor: palette.sage[700],
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
    backgroundColor: palette.onboarding.step5,
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
    color: palette.warm[50],
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step5,
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
    color: palette.warm[50],
    fontSize: 15,
    fontWeight: "700",
  },
  title: {
    color: palette.warm[50],
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
    paddingHorizontal: 24,
    textAlign: "center",
  },
});

export default CrisisSupportAlertScreen;
