/**
 * CrisisModal Component
 * @description SAFETY-CRITICAL modal providing immediate crisis support resources
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * IMPORTANT SAFETY REQUIREMENTS:
 * - Highest z-index (1000) - never covered by other UI
 * - Supportive, non-judgmental language only
 * - Immediate access to 988 Suicide & Crisis Lifeline
 * - Full accessibility support (screen readers)
 * - Must not use triggering words (suicidal, kill, die, hurt yourself)
 *
 * CLINICAL REVIEW REQUIRED before production deployment
 */

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import type { CrisisModalProps, CrisisResource } from "./CrisisModal.types";
import { palette } from "../../../theme";
import { useHaptic } from "../../../hooks/useHaptic";

/**
 * Crisis support resources
 * Updated as of 2026 - verify accuracy before deployment
 */
const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "24/7 confidential support for people in distress",
    type: "phone",
    value: "988",
    buttonText: "Call 988 Now",
    available24_7: true,
    icon: "phone",
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to connect with a crisis counselor",
    type: "sms",
    value: "741741",
    buttonText: "Text HOME to 741741",
    available24_7: true,
    icon: "message",
  },
  {
    name: "International Resources",
    description: "Find crisis support in your country",
    type: "url",
    value: "https://findahelpline.com",
    buttonText: "View International Resources",
    available24_7: true,
    icon: "globe",
  },
];

/**
 * Get supportive message based on trigger source
 */
function getSupportMessage(source?: string): string {
  const messages = {
    assessment: "We noticed you might be going through a difficult time.",
    journal: "Thank you for sharing your feelings with us.",
    chat: "We're here to support you through difficult moments.",
    score: "Your wellbeing is important to us.",
    manual: "You've taken an important step by reaching out.",
  };

  return messages[source as keyof typeof messages] || messages.manual;
}

/**
 * CrisisModal Component
 * Provides immediate access to crisis support resources
 *
 * @example
 * ```tsx
 * <CrisisModal
 *   visible={showCrisisModal}
 *   onDismiss={() => setShowCrisisModal(false)}
 *   triggerSource="assessment"
 *   requireAcknowledge
 * />
 * ```
 */
export function CrisisModal({
  visible,
  onDismiss,
  requireAcknowledge = true,
  triggerSource,
  customMessage,
  testID,
  style,
}: CrisisModalProps): React.ReactElement {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const haptic = useHaptic();

  useEffect(() => {
    if (visible) {
      setHasAcknowledged(false);
      haptic.warning();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const supportMessage = customMessage || getSupportMessage(triggerSource);

  /**
   * Handle resource access
   */
  const handleResourcePress = async (resource: CrisisResource): Promise<void> => {
    try {
      let url: string;

      switch (resource.type) {
        case "phone":
          url = `tel:${resource.value}`;
          break;
        case "sms":
          url = `sms:${resource.value}?body=HOME`;
          break;
        case "url":
          url = resource.value;
          break;
        default:
          return;
      }

      if (resource.type === "phone" || resource.type === "sms") {
        // For tel: and sms: schemes, open directly (canOpenURL unreliable on Android 11+)
        await Linking.openURL(url);
      } else {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert(
            "Unable to Open",
            `Please contact ${resource.name} directly: ${resource.value}`
          );
        }
      }
    } catch (error) {
      console.error("Error opening crisis resource:", error);
      Alert.alert(
        "Error",
        "Unable to open this resource. Please try again or contact emergency services."
      );
    }
  };

  /**
   * Handle modal dismiss
   */
  const handleDismiss = (): void => {
    if (requireAcknowledge && !hasAcknowledged) {
      return; // Cannot dismiss without acknowledging
    }
    setHasAcknowledged(false); // Reset for next time
    onDismiss();
  };

  /**
   * Handle acknowledge button press
   */
  const handleAcknowledge = (): void => {
    setHasAcknowledged(true);
    if (!requireAcknowledge) {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
      statusBarTranslucent
      testID={testID}
      accessibilityViewIsModal
    >
      <View
        style={[styles.overlay, style]}
        accessibilityRole="alert"
        accessibilityLabel="Crisis support resources available"
      >
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
          >
            {/* Header with heart-pulse visual indicator */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Text style={styles.heartIcon}>❤️</Text>
              </View>
              <Text style={styles.title}>You're Not Alone</Text>
              <Text style={styles.subtitle}>{supportMessage}</Text>
            </View>

            {/* Support message */}
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                If you're experiencing thoughts of distress or need someone to talk to,
                immediate support is available 24/7.
              </Text>
              <Text style={styles.messageEmphasis}>
                You deserve support, and help is just a call or text away.
              </Text>
            </View>

            {/* Crisis resources */}
            <View style={styles.resourcesContainer}>
              {CRISIS_RESOURCES.map((resource, index) => (
                <Pressable
                  key={resource.name}
                  style={({ pressed }) => [
                    styles.resourceCard,
                    pressed && styles.resourceCardPressed,
                  ]}
                  onPress={() => handleResourcePress(resource)}
                  accessibilityRole="button"
                  accessibilityLabel={`${resource.buttonText}. ${resource.description}`}
                  accessibilityHint="Activates to connect with crisis support"
                  testID={testID ? `${testID}-resource-${index}` : undefined}
                >
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceName}>{resource.name}</Text>
                    <Text style={styles.resourceDescription}>
                      {resource.description}
                    </Text>
                    {resource.available24_7 && (
                      <View style={styles.availabilityBadge}>
                        <Text style={styles.availabilityText}>24/7 Available</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.resourceButton}>
                    <Text style={styles.resourceButtonText}>
                      {resource.buttonText}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Emergency reminder */}
            <View style={styles.emergencyContainer}>
              <Text style={styles.emergencyText}>
                If you're in immediate danger, please call{" "}
                <Text
                  style={styles.emergencyNumber}
                  onPress={() => Linking.openURL("tel:911")}
                  accessibilityRole="link"
                  accessibilityLabel="Call 911"
                  accessibilityHint="Tap to dial 911"
                >
                  911
                </Text>
                {" "}or go to your nearest emergency room.
              </Text>
            </View>

            {/* Acknowledge button */}
            {requireAcknowledge && (
              <Pressable
                style={({ pressed }) => [
                  styles.acknowledgeButton,
                  hasAcknowledged && styles.acknowledgeButtonActive,
                  pressed && styles.acknowledgeButtonPressed,
                ]}
                onPress={handleAcknowledge}
                accessibilityRole="button"
                accessibilityLabel={
                  hasAcknowledged
                    ? "Resources acknowledged. You can now close this dialog."
                    : "I understand these resources are available"
                }
                testID={testID ? `${testID}-acknowledge` : undefined}
              >
                <Text style={styles.acknowledgeButtonText}>
                  {hasAcknowledged
                    ? "✓ Resources Acknowledged"
                    : "I Understand"}
                </Text>
              </Pressable>
            )}

            {/* Close button (only enabled after acknowledge if required) */}
            {(!requireAcknowledge || hasAcknowledged) && (
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
                onPress={handleDismiss}
                accessibilityRole="button"
                accessibilityLabel="Close crisis support dialog"
                testID={testID ? `${testID}-close` : undefined}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  acknowledgeButton: {
    alignItems: "center",
    backgroundColor: `${palette.peach[500]}${palette.alpha[20]}`,
    borderColor: `${palette.peach[500]}${palette.alpha[30]}`,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  acknowledgeButtonActive: {
    backgroundColor: `${palette.green[500]}${palette.alpha[20]}`,
    borderColor: `${palette.green[500]}${palette.alpha[40]}`,
  },
  acknowledgeButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  acknowledgeButtonText: {
    color: palette.peach[500],
    fontSize: 16,
    fontWeight: "600",
  },
  availabilityBadge: {
    alignSelf: "flex-start",
    backgroundColor: `${palette.green[500]}${palette.alpha[15]}`,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availabilityText: {
    color: palette.green[500],
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: `${palette.warm[50]}${palette.alpha[5]}`,
    borderColor: `${palette.warm[50]}${palette.alpha[10]}`,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  closeButtonPressed: {
    backgroundColor: `${palette.warm[50]}${palette.alpha[10]}`,
    transform: [{ scale: 0.98 }],
  },
  closeButtonText: {
    color: palette.warm[400],
    fontSize: 16,
    fontWeight: "600",
  },
  emergencyContainer: {
    backgroundColor: `${palette.red[500]}${palette.alpha[10]}`,
    borderColor: `${palette.red[500]}${palette.alpha[30]}`,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    padding: 16,
  },
  emergencyNumber: {
    color: palette.red[500],
    fontWeight: "700",
  },
  emergencyText: {
    color: palette.red[300],
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  heartIcon: {
    fontSize: 32,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: `${palette.red[500]}${palette.alpha[15]}`,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginBottom: 16,
    width: 60,
  },
  message: {
    color: palette.warm[200],
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  messageContainer: {
    backgroundColor: `${palette.peach[500]}${palette.alpha[10]}`,
    borderLeftColor: palette.peach[500],
    borderLeftWidth: 4,
    borderRadius: 12,
    marginBottom: 24,
    padding: 16,
  },
  messageEmphasis: {
    color: palette.peach[500],
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  modalContainer: {
    backgroundColor: palette.midnight[950],
    borderRadius: 16,
    elevation: 24,
    maxHeight: "90%",
    maxWidth: 500,
    overflow: "hidden",
    shadowColor: palette.midnight[950],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    width: "100%",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: `${palette.midnight[950]}${palette.alpha[80]}`,
    flex: 1,
    justifyContent: "center",
    padding: 20,
    zIndex: 1000, // HIGHEST z-index - never covered
  },
  resourceButton: {
    alignItems: "center",
    backgroundColor: palette.red[500],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resourceButtonText: {
    color: palette.warm[50],
    fontSize: 16,
    fontWeight: "600",
  },
  resourceCard: {
    backgroundColor: `${palette.warm[50]}${palette.alpha[5]}`,
    borderColor: `${palette.warm[50]}${palette.alpha[10]}`,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  resourceCardPressed: {
    backgroundColor: `${palette.warm[50]}${palette.alpha[10]}`,
    transform: [{ scale: 0.98 }],
  },
  resourceContent: {
    marginBottom: 12,
  },
  resourceDescription: {
    color: palette.warm[400],
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  resourceName: {
    color: palette.warm[50],
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  resourcesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  scrollContent: {
    padding: 24,
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    color: palette.warm[400],
    fontSize: 16,
    textAlign: "center",
  },
  title: {
    color: palette.warm[50],
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
});

export default CrisisModal;
