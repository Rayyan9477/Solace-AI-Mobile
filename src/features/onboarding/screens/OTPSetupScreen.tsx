/**
 * OTPSetupScreen Component
 * @description Phone number entry screen for OTP verification
 * @task Task 3.3.4: OTP Setup Screen (Screen 18)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface OTPSetupScreenProps {
  onBack: () => void;
  onSendOTP: (phoneNumber: string) => void;
  onCountryPress: () => void;
}

export function OTPSetupScreen({
  onBack,
  onSendOTP,
  onCountryPress,
}: OTPSetupScreenProps): React.ReactElement {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode] = useState("+1");

  const formatPhoneNumber = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = `(${countryCode}) `;
      if (cleaned.length <= 3) {
        formatted += cleaned;
      } else if (cleaned.length <= 6) {
        formatted += `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      } else {
        formatted += `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      }
    }
    return formatted;
  };

  const handlePhoneChange = (text: string) => {
    // Extract just the numbers
    const numbers = text.replace(/\D/g, "");
    setPhoneNumber(formatPhoneNumber(numbers));
  };

  const handleCopy = () => {
    // Clipboard functionality would be implemented here
  };

  return (
    <View testID="otp-setup-screen" style={styles.container}>
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

      {/* Illustration Section */}
      <View testID="illustration" style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
            <Text style={styles.checkEmoji}>✓</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          We will send a one time SMS message.{"\n"}Carrier rates may apply.
        </Text>
      </View>

      {/* Phone Input Section */}
      <View testID="phone-input-container" style={styles.phoneInputContainer}>
        {/* Country Selector */}
        <TouchableOpacity
          testID="country-selector"
          style={styles.countrySelector}
          onPress={onCountryPress}
          accessibilityRole="button"
          accessibilityLabel="Select country"
        >
          <Text testID="country-flag" style={styles.countryFlag}>🇺🇸</Text>
          <Text testID="country-chevron" style={styles.countryChevron}>▼</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Phone Input */}
        <TextInput
          testID="phone-input"
          style={styles.phoneInput}
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          placeholder={`(${countryCode}) XXX-XXX-XXXX`}
          placeholderTextColor={palette.gray[450]}
          keyboardType="phone-pad"
          accessibilityLabel="Phone number input"
        />

        {/* Copy Button */}
        <TouchableOpacity
          testID="copy-button"
          style={styles.copyButton}
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copy phone number"
        >
          <Text style={styles.copyIcon}>📋</Text>
        </TouchableOpacity>
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        testID="send-otp-button"
        style={styles.sendOTPButton}
        onPress={() => onSendOTP(phoneNumber)}
        accessibilityRole="button"
        accessibilityLabel="Send OTP"
      >
        <Text style={styles.sendOTPButtonText}>Send OTP</Text>
        <Text style={styles.sendOTPButtonIcon}>→</Text>
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
  checkEmoji: {
    bottom: 10,
    color: palette.white,
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    right: 15,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  contentSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  copyButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  copyIcon: {
    fontSize: 20,
  },
  countryChevron: {
    color: palette.gray[450],
    fontSize: 10,
    marginLeft: 4,
  },
  countryFlag: {
    fontSize: 24,
  },
  countrySelector: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  divider: {
    backgroundColor: palette.brown[700],
    height: 30,
    marginHorizontal: 8,
    width: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 24,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  illustration: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 100,
    height: 200,
    justifyContent: "center",
    width: 200,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 24,
  },
  phoneInput: {
    color: palette.white,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  phoneInputContainer: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderColor: palette.olive[500],
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: "row",
    height: 56,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  sendOTPButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  sendOTPButtonIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  sendOTPButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  shieldEmoji: {
    fontSize: 80,
  },
  shieldIcon: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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

export default OTPSetupScreen;
