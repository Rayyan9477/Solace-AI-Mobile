/**
 * NotFound404Screen Component
 * @description Friendly 404 error page for non-existent routes
 * @task Task 3.18.1: NotFound404 Screen (Screen 154)
 * @audit-fix "Dr. F" → "Solace" (branding)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface NotFound404ScreenProps {
  onBack: () => void;
  onGoHome: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  illustrationBg: "#E8853A",
  badgeBg: "#2A1F18",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
} as const;

export function NotFound404Screen({
  onBack,
  onGoHome,
}: NotFound404ScreenProps): React.ReactElement {
  return (
    <View testID="not-found-404-screen" style={styles.container}>
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
      <View testID="lost-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>Not Found</Text>
        <Text style={styles.subtitle}>
          Whoops! Solace can't find this page :(
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>Status Code: 404</Text>
        </View>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
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
  statusBadge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
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

export default NotFound404Screen;
