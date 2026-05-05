/**
 * NotAllowed403Screen Component
 * @description Permission denied (403) error screen with contact admin option
 * @task Task 3.18.5: NotAllowed403 Screen (Screen 158)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface NotAllowed403ScreenProps {
  onBack: () => void;
  onContactAdmin: () => void;
  onGoHome: () => void;
}

const colors = {
  background: palette.midnight[950],
  white: palette.warm[50],
  textSecondary: palette.warm[400],
  illustrationBg: palette.onboarding.step2,
  contactBg: palette.midnight[800],
  ctaButtonBg: palette.peach[300],
  ctaButtonText: palette.midnight[950],
} as const;

export function NotAllowed403Screen({
  onBack,
  onContactAdmin,
  onGoHome,
}: NotAllowed403ScreenProps): React.ReactElement {
  return (
    <View testID="not-allowed-403-screen" style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        testID="back-button"
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backIcon}>{"\u2190"}</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View testID="forbidden-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>Not Allowed</Text>
        <Text style={styles.subtitle}>Hey, you don't have permission.</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="contact-admin-button"
          style={styles.contactButton}
          onPress={onContactAdmin}
          accessibilityRole="button"
          accessibilityLabel="Contact Admin"
        >
          <Text style={styles.contactButtonText}>
            Contact Admin {"\u260E\uFE0F"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="go-home-button"
          style={styles.ctaButton}
          onPress={onGoHome}
          accessibilityRole="button"
          accessibilityLabel="Take Me Home"
        >
          <Text style={styles.ctaButtonText}>
            Take Me Home {"\uD83C\uDFE0"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  contactButton: {
    alignItems: "center",
    backgroundColor: colors.contactBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  container: { backgroundColor: colors.background, flex: 1 },
  contentSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  ctaButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  ctaButtonText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    gap: 12,
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  illustration: {
    backgroundColor: colors.illustrationBg,
    borderRadius: 16,
    height: 200,
    marginHorizontal: 24,
    marginTop: 16,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 12,
    textAlign: "center",
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
});

export default NotAllowed403Screen;
