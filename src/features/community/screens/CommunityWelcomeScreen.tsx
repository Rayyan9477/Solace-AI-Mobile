/**
 * CommunityWelcomeScreen Component
 * @description Onboarding welcome screen for community feature with
 *   illustration, value proposition, CTA, and legal links
 * @task Task 3.14.1: Community Welcome Screen (Screen 119)
 * @audit-fix Replaced "freud.ai" branding with "Solace" branding
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CommunityWelcomeScreenProps {
  title: string;
  description: string;
  onStartPosting: () => void;
  onPrivacyPolicy: () => void;
  onTerms: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
  logoBg: "#E8853A",
  linkText: "rgba(255,255,255,0.5)",
} as const;

export function CommunityWelcomeScreen({
  title,
  description,
  onStartPosting,
  onPrivacyPolicy,
  onTerms,
}: CommunityWelcomeScreenProps): React.ReactElement {
  return (
    <View testID="community-welcome-screen" style={styles.container}>
      {/* Illustration */}
      <View testID="welcome-illustration" style={styles.illustration} />

      {/* Brand Logo */}
      <View testID="brand-logo" style={styles.brandLogo}>
        <Text style={styles.brandLogoText}>S</Text>
      </View>

      {/* Title & Description */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Start Posting Button */}
      <TouchableOpacity
        testID="start-posting-button"
        style={styles.ctaButton}
        onPress={onStartPosting}
        accessibilityRole="button"
        accessibilityLabel="Start Posting"
      >
        <Text style={styles.ctaButtonText}>Start Posting {"\u2192"}</Text>
      </TouchableOpacity>

      {/* Footer Links */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="privacy-policy-link"
          onPress={onPrivacyPolicy}
          accessibilityRole="link"
          accessibilityLabel="Privacy Policy"
        >
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>{"\u00B7"}</Text>
        <TouchableOpacity
          testID="terms-link"
          onPress={onTerms}
          accessibilityRole="link"
          accessibilityLabel="Terms and Conditions"
        >
          <Text style={styles.linkText}>Terms & Conditions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandLogo: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.logoBg,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginTop: 16,
    width: 40,
  },
  brandLogoText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    marginTop: 32,
    minHeight: 44,
    paddingVertical: 16,
  },
  ctaButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  illustration: {
    alignSelf: "center",
    borderRadius: 24,
    height: 200,
    width: 200,
  },
  linkText: {
    color: colors.linkText,
    fontSize: 13,
  },
  separator: {
    color: colors.linkText,
    fontSize: 13,
    marginHorizontal: 8,
  },
  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 24,
    textAlign: "center",
  },
});

export default CommunityWelcomeScreen;
