/**
 * InternalError500Screen Component
 * @description Server error (500) page with navigation home
 * @task Task 3.18.3: InternalError500 Screen (Screen 156)
 * @audit-fix "seems to error" → "seems to have encountered an error" (Issue #42)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface InternalError500ScreenProps {
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

export function InternalError500Screen({
  onBack,
  onGoHome,
}: InternalError500ScreenProps): React.ReactElement {
  return (
    <View testID="internal-error-500-screen" style={styles.container}>
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
      <View testID="server-error-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>Internal Error</Text>
        <Text style={styles.subtitle}>
          Whoops! Our server seems to have encountered an error :(
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>Status Code: 500</Text>
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

export default InternalError500Screen;
