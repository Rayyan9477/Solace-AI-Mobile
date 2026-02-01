/**
 * StressLevelConfirmationScreen Component
 * @description Success confirmation showing stress level recorded, synced with
 *   mental health journal and AI. Removes Freud branding per project requirements.
 * @task Task 3.11.6: Stress Level Confirmation Screen (Screen 102)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StressLevelConfirmationScreenProps {
  stressLevel: number;
  onBack: () => void;
  onGotIt: () => void;
  onClose: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  gotItBg: "#C4A574",
  illustrationBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  closeBg: "rgba(255,255,255,0.12)",
  waveOrange: "#E8853A",
} as const;

export function StressLevelConfirmationScreen({
  stressLevel,
  onBack,
  onGotIt,
  onClose,
}: StressLevelConfirmationScreenProps): React.ReactElement {
  return (
    <View testID="stress-level-confirmation-screen" style={styles.container}>
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
        <Text style={styles.headerLabel}>Stress Level</Text>
      </View>

      {/* Illustration Placeholder */}
      <View style={styles.illustrationContainer}>
        <View testID="illustration-placeholder" style={styles.illustration} />
      </View>

      {/* Success Title */}
      <Text testID="success-title" style={styles.successTitle}>
        Stress Level Set to {stressLevel}
      </Text>

      {/* Success Message - No Freud branding */}
      <Text style={styles.successMessage}>
        Stress condition updated to your mental health journal. Data sent to AI.
      </Text>

      {/* Got It Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          testID="got-it-button"
          style={styles.gotItButton}
          onPress={onGotIt}
          accessibilityRole="button"
          accessibilityLabel="Got it, thanks"
          activeOpacity={0.8}
        >
          <Text style={styles.gotItText}>Got It, Thanks! {"\u2713"}</Text>
        </TouchableOpacity>
      </View>

      {/* Close Button */}
      <View style={styles.closeContainer}>
        <TouchableOpacity
          testID="close-button"
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text style={styles.closeIcon}>{"\u2715"}</Text>
        </TouchableOpacity>
      </View>

      {/* Wave Decoration */}
      <View testID="wave-decoration" style={styles.waveDecoration} />
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
  buttonContainer: {
    paddingHorizontal: 24,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: colors.closeBg,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  closeContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  closeIcon: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  gotItButton: {
    alignItems: "center",
    backgroundColor: colors.gotItBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  gotItText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLabel: {
    color: colors.waveOrange,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  illustration: {
    backgroundColor: colors.illustrationBg,
    borderRadius: 16,
    height: 180,
    width: "100%",
  },
  illustrationContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  successMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  successTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  waveDecoration: {
    backgroundColor: colors.waveOrange,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    bottom: 0,
    height: 80,
    left: 0,
    opacity: 0.3,
    position: "absolute",
    right: 0,
  },
});

export default StressLevelConfirmationScreen;
