/**
 * PasswordSetupScreen Component
 * @description Password setup with strength indicator and requirements
 * @task Task 3.3.3: Password Setup Screen (Screen 17)
 */

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

interface PasswordSetupScreenProps {
  onBack: () => void;
  onContinue: (password: string) => void;
}

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: "uppercase",
    label: "Must have A-Z",
    validator: (p) => /[A-Z]/.test(p),
  },
  {
    id: "number",
    label: "Must Have 0-9",
    validator: (p) => /[0-9]/.test(p),
  },
];

function calculateStrength(password: string): {
  strength: "weak" | "medium" | "strong";
  percentage: number;
  message: string;
} {
  if (!password) {
    return { strength: "weak", percentage: 0, message: "Enter a password" };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  const score = [
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isLongEnough,
  ].filter(Boolean).length;

  if (score <= 2) {
    return {
      strength: "weak",
      percentage: (score / 5) * 100,
      message: "Weak!! Increase strength 💪",
    };
  } else if (score <= 3) {
    return {
      strength: "medium",
      percentage: (score / 5) * 100,
      message: "Getting better! Keep going 👍",
    };
  } else {
    return {
      strength: "strong",
      percentage: (score / 5) * 100,
      message: "Strong password! 🎉",
    };
  }
}

export function PasswordSetupScreen({
  onBack,
  onContinue,
}: PasswordSetupScreenProps): React.ReactElement {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strengthResult = useMemo(() => calculateStrength(password), [password]);

  const requirementsMet = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.validator(password),
    }));
  }, [password]);

  const getStrengthColor = () => {
    switch (strengthResult.strength) {
      case "weak":
        return "#E8853A";
      case "medium":
        return "#FFD93D";
      case "strong":
        return "#9AAD5C";
      default:
        return "#E8853A";
    }
  };

  return (
    <View testID="password-setup-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Password Setup</Text>
      </View>

      {/* Password Input Section */}
      <View style={styles.inputSection}>
        <View
          testID="password-input-container"
          style={[styles.passwordContainer, password && styles.passwordContainerFocused]}
        >
          <TextInput
            testID="password-input"
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Enter password"
            placeholderTextColor="#8A8A8A"
            accessibilityLabel="Password input"
          />
          <TouchableOpacity
            testID="password-toggle"
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Text style={styles.toggleIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Strength Indicator Section */}
      <View style={styles.strengthSection}>
        <Text style={styles.strengthLabel}>Password Strength</Text>
        <View testID="strength-bar" style={styles.strengthBar}>
          <View
            style={[
              styles.strengthFill,
              {
                width: `${strengthResult.percentage}%`,
                backgroundColor: getStrengthColor(),
              },
            ]}
          />
        </View>
        <Text
          testID="strength-message"
          style={[styles.strengthMessage, { color: getStrengthColor() }]}
        >
          {strengthResult.message}
        </Text>
      </View>

      {/* Requirements Section */}
      <View testID="requirements-list" style={styles.requirementsSection}>
        {requirementsMet.map((req) => (
          <View
            key={req.id}
            style={[
              styles.requirementChip,
              req.met && styles.requirementChipMet,
            ]}
          >
            <Text style={styles.requirementIcon}>{req.met ? "✓" : "⚠"}</Text>
            <Text
              style={[
                styles.requirementText,
                req.met && styles.requirementTextMet,
              ]}
            >
              {req.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={() => onContinue(password)}
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
  inputSection: {
    marginBottom: 32,
  },
  passwordContainer: {
    alignItems: "center",
    backgroundColor: "#2A2220",
    borderColor: "#3D2E23",
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    height: 64,
    paddingHorizontal: 20,
  },
  passwordContainerFocused: {
    borderColor: "#E8853A",
  },
  passwordInput: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 24,
    letterSpacing: 4,
  },
  requirementChip: {
    alignItems: "center",
    borderColor: "#E8853A",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  requirementChipMet: {
    borderColor: "#9AAD5C",
  },
  requirementIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  requirementText: {
    color: "#E8853A",
    fontSize: 12,
    fontWeight: "500",
  },
  requirementTextMet: {
    color: "#9AAD5C",
  },
  requirementsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  strengthBar: {
    backgroundColor: "#3D2E23",
    borderRadius: 4,
    height: 8,
    marginBottom: 8,
    overflow: "hidden",
    width: "100%",
  },
  strengthFill: {
    borderRadius: 4,
    height: 8,
  },
  strengthLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  strengthMessage: {
    fontSize: 14,
    fontWeight: "500",
  },
  strengthSection: {
    marginBottom: 24,
  },
  toggleButton: {
    alignItems: "center",
    backgroundColor: "#8B6F47",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  toggleIcon: {
    fontSize: 18,
  },
});

export default PasswordSetupScreen;
