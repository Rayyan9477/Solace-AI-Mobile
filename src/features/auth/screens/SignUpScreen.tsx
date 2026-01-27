/**
 * SignUpScreen Component
 * @description New user registration screen with email, password, and confirmation
 * @task Task 3.2.2: Sign Up Screen
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpScreenProps {
  onSignUp: (credentials: SignUpCredentials) => void;
  onSignIn: () => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function SignUpScreen({
  onSignUp,
  onSignIn,
}: SignUpScreenProps): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSignUp = () => {
    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Invalid Email Address!!!");
      return;
    }
    setEmailError(null);
    onSignUp({ email, password, confirmPassword });
  };

  return (
    <ScrollView
      testID="sign-up-screen"
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with curved background */}
      <View style={styles.header}>
        <View testID="sign-up-logo" style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <View style={[styles.circle, styles.circleTop]} />
          </View>
          <View style={styles.logoRow}>
            <View style={[styles.circle, styles.circleLeft]} />
            <View style={[styles.circle, styles.circleRight]} />
          </View>
          <View style={styles.logoRow}>
            <View style={[styles.circle, styles.circleBottom]} />
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Sign Up For Free</Text>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={[styles.inputContainer, emailError && styles.inputContainerError]}>
          <Text style={styles.inputIcon}>✉</Text>
          <TextInput
            testID="email-input"
            style={styles.input}
            placeholder="Enter your email..."
            placeholderTextColor="#64748B"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            accessibilityLabel="Email Address"
          />
        </View>
        {emailError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠</Text>
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        )}
      </View>

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            testID="password-input"
            style={styles.input}
            placeholder="Enter your password..."
            placeholderTextColor="#64748B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            accessibilityLabel="Password"
          />
          <TouchableOpacity
            testID="password-toggle"
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Password Confirmation Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Password Confirmation</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            testID="confirm-password-input"
            style={styles.input}
            placeholder="Enter your password..."
            placeholderTextColor="#64748B"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            accessibilityLabel="Confirm Password"
          />
          <TouchableOpacity
            testID="confirm-password-toggle"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleIcon}>{showConfirmPassword ? "👁" : "👁‍🗨"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        testID="sign-up-button"
        style={styles.signUpButton}
        onPress={handleSignUp}
        accessibilityRole="button"
        accessibilityLabel="Sign Up"
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>

      {/* Footer Links */}
      <TouchableOpacity
        testID="sign-in-link"
        style={styles.footerLink}
        onPress={onSignIn}
        accessibilityRole="link"
      >
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.linkText}>Sign In.</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  circle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  circleBottom: {
    opacity: 0.9,
  },
  circleLeft: {
    marginRight: 3,
    opacity: 0.8,
  },
  circleRight: {
    marginLeft: 3,
  },
  circleTop: {
    opacity: 0.9,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  errorIcon: {
    color: "#E8853A",
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  footerLink: {
    alignItems: "center",
    marginTop: 16,
    minHeight: 44,
    paddingVertical: 8,
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#9AAD5C",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 160,
    justifyContent: "center",
  },
  input: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#2D2420",
    borderColor: "#3D2E23",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  inputContainerError: {
    borderColor: "#E8853A",
  },
  inputGroup: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  linkText: {
    color: "#E8853A",
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  signUpButton: {
    alignItems: "center",
    backgroundColor: "#A07856",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 32,
    minHeight: 56,
    paddingVertical: 16,
  },
  signUpButtonText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "700",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  toggleButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  toggleIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
});

export default SignUpScreen;
