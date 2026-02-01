/**
 * RecordExpressionPrepScreen Component
 * @description Pre-camera preparation screen with requirement checklist cards,
 *   skip button, and continue button for facial expression analysis
 * @task Task 3.11.4: Record Expression Prep Screen (Screen 100)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Requirement {
  id: string;
  label: string;
  icon: string;
}

interface RecordExpressionPrepScreenProps {
  requirements: Requirement[];
  onBack: () => void;
  onSkip: () => void;
  onContinue: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  skipOrange: "#E8853A",
  continueGreen: "#9AAD5C",
  textSecondary: "rgba(255,255,255,0.6)",
  iconColor: "#E8853A",
} as const;

export function RecordExpressionPrepScreen({
  requirements,
  onBack,
  onSkip,
  onContinue,
}: RecordExpressionPrepScreenProps): React.ReactElement {
  return (
    <View testID="record-expression-prep-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u263E"}</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text testID="screen-title" style={styles.title}>
        Record Expression
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Let's analyze face expression for better stress AI analysis. Ensure the
        following:
      </Text>

      {/* Requirement Cards */}
      <View style={styles.requirementsSection}>
        {requirements.map((req) => (
          <View
            key={req.id}
            testID={`requirement-card-${req.id}`}
            style={styles.requirementCard}
          >
            <Text
              testID={`requirement-label-${req.id}`}
              style={styles.requirementLabel}
            >
              {req.label}
            </Text>
            <Text
              testID={`requirement-icon-${req.id}`}
              style={styles.requirementIcon}
            >
              {req.icon}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {/* Skip Button */}
        <TouchableOpacity
          testID="skip-button"
          style={styles.skipButton}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip this step"
          activeOpacity={0.8}
        >
          <Text style={styles.skipText}>Skip This Step {"\u2715"}</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to camera"
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue {"\u2192"}</Text>
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
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: colors.continueGreen,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  continueText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    gap: 12,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  requirementCard: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  requirementIcon: {
    fontSize: 20,
  },
  requirementLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  requirementsSection: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  skipButton: {
    alignItems: "center",
    backgroundColor: colors.skipOrange,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  skipText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    paddingHorizontal: 24,
  },
});

export default RecordExpressionPrepScreen;
