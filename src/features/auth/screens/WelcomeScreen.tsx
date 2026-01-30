/**
 * WelcomeScreen Component
 * @description Welcome screen entry point with Get Started and Sign In options
 * @task Task 3.1.5: Welcome Screen
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

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
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  brandUnderline: {
    textDecorationLine: "underline",
  },
  circle: {
    backgroundColor: "#A07856",
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  circleBottom: {
    backgroundColor: "#8B6F47",
  },
  circleLeft: {
    backgroundColor: "#8B6F47",
    marginRight: 2,
  },
  circleRight: {
    backgroundColor: "#A07856",
    marginLeft: 2,
  },
  circleTop: {
    backgroundColor: "#C19A6B",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#1C1410",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  getStartedButton: {
    alignItems: "center",
    backgroundColor: "#E8853A",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  getStartedText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
  },
  illustrationCircle: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
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
    color: "#E8853A",
    fontWeight: "600",
  },
  signInText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  titleBrand: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
});

export default WelcomeScreen;
