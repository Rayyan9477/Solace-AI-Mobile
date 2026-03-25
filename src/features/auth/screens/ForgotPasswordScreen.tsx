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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors, palette } from "../../../shared/theme";
import { ScreenContainer } from "../../../shared/components/atoms/layout";

type RecoveryMethod = "2fa" | "password" | "google";

interface ForgotPasswordScreenProps {
  onBack?: () => void;
  onSendPassword?: (method: RecoveryMethod) => void;
}

export function ForgotPasswordScreen({
  onBack,
  onSendPassword,
}: ForgotPasswordScreenProps): React.ReactElement {
  const navigation = useNavigation<any>();
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod>("password");

  const handleBack = () => {
    if (onBack) onBack(); else navigation.goBack();
  };

  const handleSendPassword = () => {
    if (onSendPassword) onSendPassword(selectedMethod);
  };

  const renderMethodOption = (
    method: RecoveryMethod,
    label: string,
    icon: React.ReactElement
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
          {icon}
        </View>
        <Text style={styles.methodLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer testID="forgot-password-screen" backgroundColor={colors.background.primary}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Back Button */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={handleBack}
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
        {renderMethodOption("2fa", "Use 2FA", <Icon name="shield-checkmark-outline" size={28} color={palette.tan[400]} />)}
        {renderMethodOption("password", "Password", <Icon name="key-outline" size={28} color={palette.tan[400]} />)}
        {renderMethodOption("google", "Google Authenticator", <Icon name="lock-closed-outline" size={28} color={palette.tan[400]} />)}
      </View>

      {/* Send Password Button */}
      <TouchableOpacity
        testID="send-password-button"
        style={styles.sendButton}
        onPress={handleSendPassword}
        accessibilityRole="button"
        accessibilityLabel="Send Reset Link"
      >
        <Text style={styles.sendButtonText}>Send Reset Link</Text>
        <Icon name="lock-closed-outline" size={18} color={palette.tan[500]} style={styles.sendButtonIcon} />
      </TouchableOpacity>
    </ScrollView>
    </ScreenContainer>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  methodIcon: {},
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
