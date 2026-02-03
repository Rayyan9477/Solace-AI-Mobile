/**
 * WelcomeScreen Component
 * @description Welcome screen entry point with Get Started and Sign In options
 * @task Task 3.1.5: Welcome Screen
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { colors, palette } from "../../../shared/theme";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function WelcomeScreen({
  onGetStarted,
  onSignIn,
}: WelcomeScreenProps): React.ReactElement {
  return (
    <View testID="welcome-screen" style={styles.container}>
      {/* Logo */}
      <View testID="welcome-logo" style={styles.logoContainer}>
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

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to the ultimate</Text>
        <Text style={styles.titleBrand}>
          <Text style={styles.brandUnderline}>Solace</Text>
          <Text> UI Kit!</Text>
        </Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Your mindful mental health AI companion{"\n"}for everyone, anywhere 🌿
      </Text>

      {/* Illustration */}
      <View testID="illustration-container" style={styles.illustrationContainer}>
        <View style={styles.illustrationCircle}>
          {/* Placeholder for mascot illustration */}
          <Text style={styles.mascotPlaceholder}>🤖</Text>
        </View>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        testID="get-started-button"
        style={styles.getStartedButton}
        onPress={onGetStarted}
        accessibilityRole="button"
        accessibilityLabel="Get Started"
      >
        <Text style={styles.getStartedText}>Get Started</Text>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <TouchableOpacity
        testID="sign-in-link"
        style={styles.signInContainer}
        onPress={onSignIn}
        accessibilityRole="link"
        accessibilityLabel="Sign In to existing account"
      >
        <Text style={styles.signInText}>
          Already have an account? <Text style={styles.signInLink}>Sign In.</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    color: colors.text.inverse,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  brandUnderline: {
    textDecorationLine: "underline",
  },
  circle: {
    backgroundColor: palette.tan[500],
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  circleBottom: {
    backgroundColor: palette.brown[600],
  },
  circleLeft: {
    backgroundColor: palette.brown[600],
    marginRight: 2,
  },
  circleRight: {
    backgroundColor: palette.tan[500],
    marginLeft: 2,
  },
  circleTop: {
    backgroundColor: palette.tan[400],
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.background.primary,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  getStartedButton: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  getStartedText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
  illustrationCircle: {
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    borderRadius: 120,
    height: 240,
    justifyContent: "center",
    width: 240,
  },
  illustrationContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginVertical: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: "row",
    marginVertical: 1,
  },
  mascotPlaceholder: {
    fontSize: 80,
  },
  signInContainer: {
    marginBottom: 32,
    marginTop: 16,
    minHeight: 44,
    paddingVertical: 12,
  },
  signInLink: {
    color: palette.onboarding.step2,
    fontWeight: "600",
  },
  signInText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  titleBrand: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
});

export default WelcomeScreen;
