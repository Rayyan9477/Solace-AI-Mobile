/**
 * VerificationCodeSentScreen Component
 * @description Confirmation modal showing verification code was sent
 * @task Task 3.2.4: Verification Code Sent Screen (Screen 14)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, palette } from "../../../shared/theme";

interface VerificationCodeSentScreenProps {
  maskedDestination: string;
  onResend: () => void;
  onDismiss: () => void;
  onBack: () => void;
}

export function VerificationCodeSentScreen({
  maskedDestination,
  onResend,
  onDismiss,
  onBack,
}: VerificationCodeSentScreenProps): React.ReactElement {
  return (
    <View testID="verification-code-sent-screen" style={styles.container}>
      {/* Overlay Background */}
      <View testID="overlay-background" style={styles.overlay} />

      {/* Back Button */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backButtonIcon}>{"<"}</Text>
      </TouchableOpacity>

      {/* Modal Card */}
      <View testID="modal-card" style={styles.modalCard}>
        {/* Illustration */}
        <View testID="illustration-container" style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationPlaceholder}>🔐</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>We've Sent Verification</Text>
          <Text style={styles.title}>Code to {maskedDestination}</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Didn't receive the link? Then re-send{"\n"}the password below! 🔑
        </Text>

        {/* Re-Send Password Button */}
        <TouchableOpacity
          testID="resend-button"
          style={styles.resendButton}
          onPress={onResend}
          accessibilityRole="button"
          accessibilityLabel="Re-Send Password"
        >
          <Text style={styles.resendButtonText}>Re-Send Password</Text>
          <Text style={styles.lockIcon}>🔒</Text>
        </TouchableOpacity>

        {/* Send Password Button (Disabled) */}
        <TouchableOpacity
          testID="send-password-button"
          style={styles.sendPasswordButton}
          disabled={true}
          accessibilityRole="button"
          accessibilityLabel="Send Password"
          accessibilityState={{ disabled: true }}
        >
          <Text style={styles.sendPasswordButtonText}>Send Password</Text>
          <Text style={styles.lockIconDisabled}>🔒</Text>
        </TouchableOpacity>
      </View>

      {/* Dismiss Button */}
      <TouchableOpacity
        testID="dismiss-button"
        style={styles.dismissButton}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        <Text style={styles.dismissIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: colors.border.default,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    left: 24,
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    top: 60,
    width: 40,
  },
  backButtonIcon: {
    color: colors.text.secondary,
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.background.primary,
    flex: 1,
    justifyContent: "center",
  },
  dismissButton: {
    alignItems: "center",
    backgroundColor: colors.text.primary,
    borderRadius: 28,
    bottom: 40,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    width: 56,
  },
  dismissIcon: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: "600",
  },
  illustrationCircle: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 100,
    height: 200,
    justifyContent: "center",
    width: "100%",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
    width: "100%",
  },
  illustrationPlaceholder: {
    fontSize: 64,
  },
  lockIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  lockIconDisabled: {
    fontSize: 16,
    marginLeft: 8,
    opacity: 0.5,
  },
  modalCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    marginHorizontal: 24,
    overflow: "hidden",
    paddingBottom: 24,
    width: "85%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  resendButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 24,
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  resendButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
  sendPasswordButton: {
    alignItems: "center",
    backgroundColor: colors.interactive.disabled,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 12,
    minHeight: 56,
    opacity: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sendPasswordButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
    marginHorizontal: 24,
    textAlign: "center",
  },
  title: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  titleContainer: {
    marginBottom: 12,
    marginHorizontal: 24,
  },
});

export default VerificationCodeSentScreen;
