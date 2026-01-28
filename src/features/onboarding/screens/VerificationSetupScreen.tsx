/**
 * VerificationSetupScreen Component
 * @description Verification setup with biometric and notification options
 * @task Task 3.3.7: Verification Setup Screen (Screen 21)
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface VerificationPreferences {
  biometricEnabled: boolean;
  notificationEnabled: boolean;
}

interface VerificationSetupScreenProps {
  onBack: () => void;
  onContinue: (preferences: VerificationPreferences) => void;
}

export function VerificationSetupScreen({
  onBack,
  onContinue,
}: VerificationSetupScreenProps): React.ReactElement {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const handleContinue = () => {
    onContinue({
      biometricEnabled,
      notificationEnabled,
    });
  };

  return (
    <View testID="verification-setup-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Setup</Text>
      </View>

      {/* Illustration */}
      <View testID="illustration-container" style={styles.illustrationContainer}>
        <View testID="document-illustration" style={styles.documentIllustration}>
          {/* ID Card representation */}
          <View style={styles.idCard}>
            <View style={styles.idCardHeader} />
            <View style={styles.idCardPhoto} />
            <View style={styles.idCardLines}>
              <View style={styles.idCardLine} />
              <View style={[styles.idCardLine, styles.idCardLineShort]} />
            </View>
          </View>
          {/* Checkmark overlay */}
          <View style={styles.checkmarkOverlay}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </View>
      </View>

      {/* Options Section */}
      <View style={styles.optionsContainer}>
        {/* Biometric Checkbox */}
        <TouchableOpacity
          testID="biometric-checkbox"
          style={styles.checkboxRow}
          onPress={() => setBiometricEnabled(!biometricEnabled)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: biometricEnabled }}
          accessibilityLabel="Biometric Verification"
        >
          <View
            style={[
              styles.checkbox,
              biometricEnabled && styles.checkboxChecked,
            ]}
          >
            {biometricEnabled && (
              <Text testID="biometric-checkmark" style={styles.checkboxCheckmark}>
                ✓
              </Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>Biometric Verification</Text>
        </TouchableOpacity>

        {/* Notification Checkbox */}
        <TouchableOpacity
          testID="notification-checkbox"
          style={styles.checkboxRow}
          onPress={() => setNotificationEnabled(!notificationEnabled)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: notificationEnabled }}
          accessibilityLabel="Enable Notification"
        >
          <View
            style={[
              styles.checkbox,
              notificationEnabled && styles.checkboxChecked,
            ]}
          >
            {notificationEnabled && (
              <Text testID="notification-checkmark" style={styles.checkboxCheckmark}>
                ✓
              </Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>Enable Notification</Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Text style={styles.continueButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonSection: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  checkbox: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 4,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    marginRight: 16,
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: "#9AAD5C",
    borderColor: "#9AAD5C",
  },
  checkboxCheckmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  checkboxRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 16,
    minHeight: 44,
    paddingVertical: 8,
  },
  checkmarkIcon: {
    color: "#9AAD5C",
    fontSize: 24,
    fontWeight: "700",
  },
  checkmarkOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(154, 173, 92, 0.2)",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: -10,
    top: -10,
    width: 40,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueButtonIcon: {
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
  },
  documentIllustration: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 40,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  idCard: {
    backgroundColor: "#2A1F19",
    borderColor: "#3D2E23",
    borderRadius: 12,
    borderWidth: 1,
    height: 140,
    padding: 16,
    width: 200,
  },
  idCardHeader: {
    backgroundColor: "#3D2E23",
    borderRadius: 4,
    height: 8,
    marginBottom: 12,
    width: "60%",
  },
  idCardLine: {
    backgroundColor: "#3D2E23",
    borderRadius: 2,
    height: 6,
    marginBottom: 6,
    width: "100%",
  },
  idCardLineShort: {
    width: "70%",
  },
  idCardLines: {
    flex: 1,
    justifyContent: "flex-end",
  },
  idCardPhoto: {
    backgroundColor: "#3D2E23",
    borderRadius: 8,
    height: 50,
    position: "absolute",
    right: 16,
    top: 30,
    width: 40,
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 48,
  },
  optionsContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
});

export default VerificationSetupScreen;
