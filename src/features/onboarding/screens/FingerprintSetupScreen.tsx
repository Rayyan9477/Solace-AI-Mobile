/**
 * FingerprintSetupScreen Component
 * @description Biometric fingerprint setup screen
 * @task Task 3.3.6: Fingerprint Setup Screen (Screen 20)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface FingerprintSetupScreenProps {
  onBack: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}

export function FingerprintSetupScreen({
  onBack,
  onContinue,
  onSkip,
}: FingerprintSetupScreenProps): React.ReactElement {
  return (
    <View testID="fingerprint-setup-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fingerprint Setup</Text>
      </View>

      {/* Scanner Section */}
      <View testID="scanner-container" style={styles.scannerContainer}>
        <View testID="scanner-frame" style={styles.scannerFrame}>
          {/* Corner Brackets */}
          <View
            testID="corner-top-left"
            style={[styles.cornerBracket, styles.cornerTopLeft]}
          />
          <View
            testID="corner-top-right"
            style={[styles.cornerBracket, styles.cornerTopRight]}
          />
          <View
            testID="corner-bottom-left"
            style={[styles.cornerBracket, styles.cornerBottomLeft]}
          />
          <View
            testID="corner-bottom-right"
            style={[styles.cornerBracket, styles.cornerBottomRight]}
          />

          {/* Fingerprint Icon */}
          <View testID="fingerprint-icon" style={styles.fingerprintIcon}>
            <Text style={styles.fingerprintEmoji}>👆</Text>
            {/* Fingerprint pattern circles */}
            <View style={styles.fingerprintPattern}>
              <View style={[styles.patternCircle, styles.patternCircle1]} />
              <View style={[styles.patternCircle, styles.patternCircle2]} />
              <View style={[styles.patternCircle, styles.patternCircle3]} />
            </View>
          </View>

          {/* Scan Line */}
          <View testID="scan-line" style={styles.scanLine} />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>Fingerprint Setup</Text>
        <Text style={styles.subtitle}>
          Scan your biometric fingerprint to make your{"\n"}account more secure.
          🔑
        </Text>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Text style={styles.continueButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  buttonSection: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  contentSection: {
    alignItems: "center",
    marginTop: 32,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueButtonIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  cornerBottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    bottom: 0,
    left: 0,
  },
  cornerBottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    bottom: 0,
    right: 0,
  },
  cornerBracket: {
    borderColor: palette.white,
    height: 30,
    position: "absolute",
    width: 30,
  },
  cornerTopLeft: {
    borderLeftWidth: 3,
    borderTopWidth: 3,
    left: 0,
    top: 0,
  },
  cornerTopRight: {
    borderRightWidth: 3,
    borderTopWidth: 3,
    right: 0,
    top: 0,
  },
  fingerprintEmoji: {
    fontSize: 80,
    opacity: 0,
  },
  fingerprintIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  fingerprintPattern: {
    alignItems: "center",
    height: 120,
    justifyContent: "center",
    position: "absolute",
    width: 120,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 40,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
  },
  patternCircle: {
    borderColor: palette.white,
    borderRadius: 100,
    borderWidth: 2,
    position: "absolute",
  },
  patternCircle1: {
    height: 40,
    width: 40,
  },
  patternCircle2: {
    height: 70,
    width: 70,
  },
  patternCircle3: {
    height: 100,
    width: 100,
  },
  scanLine: {
    backgroundColor: palette.olive[500],
    height: 3,
    left: 20,
    position: "absolute",
    right: 20,
    top: "50%",
  },
  scannerContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  scannerFrame: {
    alignItems: "center",
    height: 200,
    justifyContent: "center",
    position: "relative",
    width: 200,
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    textAlign: "center",
  },
  title: {
    color: palette.white,
    fontSize: 24,
    fontStyle: "italic",
    fontWeight: "700",
  },
});

export default FingerprintSetupScreen;
