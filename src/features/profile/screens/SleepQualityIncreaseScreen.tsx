/**
 * SleepQualityIncreaseScreen Component
 * @description Full-screen notification celebrating sleep quality improvement
 * @task Task 3.17.1: Sleep Quality Increase Screen (Screen 140)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SleepQualityIncreaseScreenProps {
  duration: string;
  percentageChange: number;
  comparisonPeriod: string;
  onBack: () => void;
  onSeeSleepQuality: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  illustrationBg: "#7B68B5",
  ctaButtonBg: "#C4A574",
  ctaButtonText: "#1C1410",
} as const;

export function SleepQualityIncreaseScreen({
  duration,
  percentageChange,
  comparisonPeriod,
  onBack,
  onSeeSleepQuality,
}: SleepQualityIncreaseScreenProps): React.ReactElement {
  return (
    <View testID="sleep-quality-increase-screen" style={styles.container}>
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
      <View testID="sleep-illustration" style={styles.illustration} />

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={styles.duration}>{duration}</Text>
        <Text style={styles.title}>Sleep Quality Increased!</Text>
        <Text style={styles.message}>
          Your sleep quality is {percentageChange}% better compared to{" "}
          {comparisonPeriod}. Keep it up! {"\uD83C\uDF1F"}
        </Text>
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="see-sleep-quality-button"
          style={styles.ctaButton}
          onPress={onSeeSleepQuality}
          accessibilityRole="button"
          accessibilityLabel="See Sleep Quality"
        >
          <Text style={styles.ctaButtonText}>
            See Sleep Quality {"\uD83D\uDCA4"}
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
  duration: {
    color: colors.white,
    fontSize: 48,
    fontWeight: "800",
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
  message: {
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
    marginTop: 8,
    textAlign: "center",
  },
});

export default SleepQualityIncreaseScreen;
