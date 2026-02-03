/**
 * SignInScreen Component
 * @description User authentication screen with email/password and social login
 * @task Task 3.2.1: Sign In Screen
 * @phase Phase 3C: Refactored to use theme tokens
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
import { colors, palette } from "../../../shared/theme";

interface SignInCredentials {
  email: string;
  password: string;
}

type SocialProvider = "facebook" | "google" | "instagram";

interface SignInScreenProps {
  onSignIn: (credentials: SignInCredentials) => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
  onSocialLogin: (provider: SocialProvider) => void;
}

export function SignInScreen({
  onSignIn,
  onSignUp,
  onForgotPassword,
  onSocialLogin,
}: SignInScreenProps): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    onSignIn({ email, password });
  };

  return (
    <ScrollView
      testID="sign-in-screen"
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with curved background */}
      <View style={styles.header}>
        <View testID="sign-in-logo" style={styles.logoContainer}>
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
      <Text style={styles.title}>Sign In To Solace AI</Text>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={[styles.inputContainer, email && styles.inputContainerFocused]}>
          <Text style={styles.inputIcon}>✉</Text>
          <TextInput
            testID="email-input"
            style={styles.input}
            placeholder="Enter your email..."
            placeholderTextColor={colors.form.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            accessibilityLabel="Email Address"
          />
        </View>
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
            placeholderTextColor={colors.form.placeholder}
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
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Text style={styles.toggleIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity
        testID="sign-in-button"
        style={styles.signInButton}
        onPress={handleSignIn}
        accessibilityRole="button"
        accessibilityLabel="Sign In"
      >
        <Text style={styles.signInButtonText}>Sign In</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          testID="facebook-login"
          style={styles.socialButton}
          onPress={() => onSocialLogin("facebook")}
          accessibilityLabel="Sign in with Facebook"
        >
          <Text style={styles.socialIcon}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="google-login"
          style={styles.socialButton}
          onPress={() => onSocialLogin("google")}
          accessibilityLabel="Sign in with Google"
        >
          <Text style={styles.socialIcon}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="instagram-login"
          style={styles.socialButton}
          onPress={() => onSocialLogin("instagram")}
          accessibilityLabel="Sign in with Instagram"
        >
          <Text style={styles.socialIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Links */}
      <TouchableOpacity
        testID="sign-up-link"
        style={styles.footerLink}
        onPress={onSignUp}
        accessibilityRole="link"
      >
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.linkText}>Sign Up.</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="forgot-password-link"
        style={styles.footerLink}
        onPress={onForgotPassword}
        accessibilityRole="link"
      >
        <Text style={styles.linkText}>Forgot Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  circle: {
    backgroundColor: palette.white,
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
    backgroundColor: colors.background.primary,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  footerLink: {
    alignItems: "center",
    marginTop: 16,
    minHeight: 44,
    paddingVertical: 8,
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.interactive.default,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: 160,
    justifyContent: "center",
  },
  input: {
    color: colors.text.primary,
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: colors.form.background,
    borderColor: colors.form.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: colors.form.borderFocus,
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
    color: colors.form.label,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  linkText: {
    color: colors.interactive.default,
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  signInButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 32,
    minHeight: 56,
    paddingVertical: 16,
  },
  signInButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
  socialButton: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginHorizontal: 8,
    width: 48,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  socialIcon: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontStyle: "italic",
    fontWeight: "700",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  toggleButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
});

export default SignInScreen;
