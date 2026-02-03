/**
 * ForgotPasswordScreen Component
 * @description Password recovery method selection screen
 * @task Task 3.2.3: Forgot Password Screen
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors, palette } from "../../../shared/theme";

type RecoveryMethod = "2fa" | "password" | "google";

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSendPassword: (method: RecoveryMethod) => void;
}

export function ForgotPasswordScreen({
  onBack,
  onSendPassword,
}: ForgotPasswordScreenProps): React.ReactElement {
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod>("password");

  const handleSendPassword = () => {
    onSendPassword(selectedMethod);
  };

  const renderMethodOption = (
    method: RecoveryMethod,
    label: string,
    icon: string
  ) => {
    const isSelected = selectedMethod === method;
    return (
      <TouchableOpacity
        testID={`method-${method}`}
        style={[styles.methodOption, isSelected && styles.methodOptionSelected]}
        onPress={() => setSelectedMethod(method)}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${label} recovery method`}
      >
        <View style={styles.methodIconContainer}>
          <Text style={styles.methodIcon}>{icon}</Text>
        </View>
        <Text style={styles.methodLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      testID="forgot-password-screen"
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Back Button */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Select contact details where you want to reset your password.
      </Text>

      {/* Recovery Method Options */}
      <View style={styles.methodsContainer}>
        {renderMethodOption("2fa", "Use 2FA", "🔐")}
        {renderMethodOption("password", "Password", "🔑")}
        {renderMethodOption("google", "Google Authenticator", "🔒")}
      </View>

      {/* Send Password Button */}
      <TouchableOpacity
        testID="send-password-button"
        style={styles.sendButton}
        onPress={handleSendPassword}
        accessibilityRole="button"
        accessibilityLabel="Send Password"
      >
        <Text style={styles.sendButtonText}>Send Password</Text>
        <Text style={styles.sendButtonIcon}>🔒</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: colors.border.default,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    marginBottom: 24,
    width: 48,
  },
  backIcon: {
    color: colors.text.primary,
    fontSize: 20,
  },
  container: {
    backgroundColor: colors.background.primary,
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  methodIcon: {
    fontSize: 32,
  },
  methodIconContainer: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    borderRadius: 16,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  methodLabel: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
  },
  methodOption: {
    alignItems: "center",
    backgroundColor: colors.form.background,
    borderColor: colors.form.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 80,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  methodOptionSelected: {
    borderColor: colors.interactive.default,
    borderWidth: 2,
  },
  methodsContainer: {
    marginTop: 32,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    minHeight: 56,
    paddingVertical: 16,
  },
  sendButtonIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  sendButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  title: {
    color: colors.text.primary,
    fontSize: 32,
    fontStyle: "italic",
    fontWeight: "700",
  },
});

export default ForgotPasswordScreen;
