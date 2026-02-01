/**
 * NoInternetScreen Component
 * @description Friendly offline state for no internet connectivity
 * @task Task 3.18.2: NoInternet Screen (Screen 155)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface NoInternetScreenProps {
  onBack: () => void;
  onRefresh: () => void;
  onGoHome: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  illustrationBg: "#7B68B5",
  refreshBg: "#2A1F18",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
} as const;

export function NoInternetScreen({
  onBack,
  onRefresh,
  onGoHome,
}: NoInternetScreenProps): React.ReactElement {
  return (
    <View testID="no-internet-screen" style={styles.container}>
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
      <View testID="offline-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>No Internet!</Text>
        <Text style={styles.subtitle}>
          It seems you don't have active internet.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="refresh-button"
          style={styles.refreshButton}
          onPress={onRefresh}
          accessibilityRole="button"
          accessibilityLabel="Refresh or Try Again"
        >
          <Text style={styles.refreshButtonText}>
            Refresh or Try Again {"\uD83D\uDD04"}
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
  refreshButton: {
    alignItems: "center",
    backgroundColor: colors.refreshBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  refreshButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
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

export default NoInternetScreen;
