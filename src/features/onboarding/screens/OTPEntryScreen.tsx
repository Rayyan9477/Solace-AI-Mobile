/**
 * OTPEntryScreen Component
 * @description 4-digit OTP code entry screen
 * @task Task 3.3.5: OTP Entry Screen (Screen 19)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface OTPEntryScreenProps {
  onBack: () => void;
  onContinue: (otp: string) => void;
  onResend: () => void;
  error?: string;
}

export function OTPEntryScreen({
  onBack,
  onContinue,
  onResend,
  error,
}: OTPEntryScreenProps): React.ReactElement {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  const handleDigitChange = (text: string, index: number) => {
    // Only allow single digit
    const digit = text.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next input
    if (digit && index < 3) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === "Backspace" && !otp[index] && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View testID="otp-entry-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>OTP Setup</Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>Enter 4 digit OTP Code</Text>
        <Text style={styles.subtitle}>
          Scan your biometric fingerprint to make your{"\n"}account more secure.
        </Text>
      </View>

      {/* OTP Input Section */}
      <View testID="otp-input-container" style={styles.otpContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            testID={`digit-box-${index}`}
            style={[
              styles.digitBox,
              focusedIndex === index && styles.digitBoxFocused,
              otp[index] && styles.digitBoxFilled,
            ]}
          >
            <TextInput
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.digitInput}
              value={otp[index]}
              onChangeText={(text) => handleDigitChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e.nativeEvent.key, index)}
              onFocus={() => setFocusedIndex(index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              accessibilityLabel={`Digit ${index + 1} of 4`}
            />
          </View>
        ))}
      </View>

      {/* Error Chip */}
      {error && (
        <View testID="error-chip" style={styles.errorChip}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Continue Button */}
      <TouchableOpacity
        testID="continue-button"
        style={styles.continueButton}
        onPress={() => onContinue(otp.join(""))}
        accessibilityRole="button"
        accessibilityLabel="Continue to next step"
      >
        <Text style={styles.continueButtonText}>Continue</Text>
        <Text style={styles.continueButtonIcon}>→</Text>
      </TouchableOpacity>

      {/* Resend Link */}
      <TouchableOpacity
        testID="resend-link"
        style={styles.resendLink}
        onPress={onResend}
        accessibilityRole="link"
        accessibilityLabel="Resend OTP"
      >
        <Text style={styles.resendText}>
          Didn't receive the OTP?{" "}
          <Text style={styles.resendLinkText}>Re-send.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  contentSection: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 24,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueButtonIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  digitBox: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    height: 64,
    justifyContent: "center",
    marginHorizontal: 8,
    width: 64,
  },
  digitBoxFilled: {
    backgroundColor: palette.brown[800],
  },
  digitBoxFocused: {
    backgroundColor: palette.olive[500],
  },
  digitInput: {
    color: palette.white,
    fontSize: 32,
    fontWeight: "700",
    height: "100%",
    textAlign: "center",
    width: "100%",
  },
  errorChip: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  errorText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  resendLink: {
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 12,
  },
  resendLinkText: {
    color: palette.onboarding.step2,
    fontWeight: "600",
  },
  resendText: {
    color: palette.gray[400],
    fontSize: 14,
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    textAlign: "center",
  },
  title: {
    color: palette.white,
    fontSize: 24,
    fontStyle: "italic",
    fontWeight: "700",
  },
});

export default OTPEntryScreen;
