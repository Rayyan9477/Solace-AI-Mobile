/**
 * CrisisModal Component
 * @description SAFETY-CRITICAL modal providing immediate crisis support resources
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

import React, { useState } from "react";
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

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Unable to Open",
          `Please contact ${resource.name} directly: ${resource.value}`
        );
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
        accessibilityLiveRegion="assertive"
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
                <Text style={styles.emergencyNumber}>911</Text> or go to your
                nearest emergency room.
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000, // HIGHEST z-index - never covered
  },
  modalContainer: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    backgroundColor: "#1C1410",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heartIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "rgba(196, 165, 116, 0.1)",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#C4A574",
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: "#E2E8F0",
    marginBottom: 12,
  },
  messageEmphasis: {
    fontSize: 15,
    lineHeight: 22,
    color: "#C4A574",
    fontWeight: "600",
  },
  resourcesContainer: {
    marginBottom: 24,
    gap: 12,
  },
  resourceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resourceCardPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: [{ scale: 0.98 }],
  },
  resourceContent: {
    marginBottom: 12,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 8,
  },
  availabilityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#22C55E",
  },
  resourceButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  resourceButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emergencyContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  emergencyText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FCA5A5",
    textAlign: "center",
  },
  emergencyNumber: {
    fontWeight: "700",
    color: "#EF4444",
  },
  acknowledgeButton: {
    backgroundColor: "rgba(196, 165, 116, 0.2)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(196, 165, 116, 0.3)",
  },
  acknowledgeButtonActive: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    borderColor: "rgba(34, 197, 94, 0.4)",
  },
  acknowledgeButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  acknowledgeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C4A574",
  },
  closeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  closeButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    transform: [{ scale: 0.98 }],
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
  },
});

export default CrisisModal;
