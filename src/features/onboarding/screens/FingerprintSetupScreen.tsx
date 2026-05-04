/**
 * FingerprintSetupScreen — prototype v4.2 #16 FaceId Primer (Sprint 7 reskin).
 *
 * Optional biometric enrolment step. Soft privacy framing with scan-frame
 * illustration and BreathingOrb decorative halo. File name kept as
 * FingerprintSetupScreen.tsx for OnboardingStack import compatibility.
 *
 * Maps to `prototypes/screens/16-biometric.js`.
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { BracketLabel, BreathingOrb } from "@/shared/components/primitives";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface FingerprintSetupScreenProps {
  onBack: () => void;
  /** Tapped "Enable Face ID" — maps to onContinue for stack compat */
  onContinue: () => void;
  /** Tapped "Maybe later" */
  onSkip: () => void;
  testID?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FingerprintSetupScreen({
  onBack,
  onContinue,
  onSkip,
  testID = "fingerprint-setup-screen",
}: FingerprintSetupScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Header row: back · bracket · skip link */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="back-button"
          style={[
            styles.backButton,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="arrow-left" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <BracketLabel variant="peach" style={styles.headerLabel}>
          FACE ID
        </BracketLabel>

        <TouchableOpacity
          testID="header-skip-link"
          style={styles.headerSkipLink}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip Face ID setup"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.headerSkipText, { color: palette.warm[400] }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        {/* Decorative BreathingOrb behind the scan frame */}
        <View style={styles.orbWrapper}>
          <BreathingOrb
            testID="breathing-orb"
            size={280}
            tint="cool"
            pulsing={!reduced}
          />
        </View>

        {/* Scan frame — 220×220 with corner brackets + face icon */}
        <View
          testID="scan-frame"
          style={[
            styles.scanFrame,
            { borderColor: palette.sage[300] },
          ]}
        >
          {/* Corner brackets */}
          <View
            testID="corner-top-left"
            style={[
              styles.corner,
              styles.cornerTopLeft,
              { borderColor: palette.sage[300] },
            ]}
          />
          <View
            testID="corner-top-right"
            style={[
              styles.corner,
              styles.cornerTopRight,
              { borderColor: palette.sage[300] },
            ]}
          />
          <View
            testID="corner-bottom-left"
            style={[
              styles.cornerBottomLeft,
              styles.corner,
              { borderColor: palette.sage[300] },
            ]}
          />
          <View
            testID="corner-bottom-right"
            style={[
              styles.corner,
              styles.cornerBottomRight,
              { borderColor: palette.sage[300] },
            ]}
          />

          {/* Face silhouette icon */}
          <View
            testID="face-icon-wrapper"
            style={styles.faceIconWrapper}
          >
            <AppIcon
              name="scan-face"
              size={64}
              color={palette.warm[100]}
              accessibilityLabel="Face ID scan area"
            />
          </View>
        </View>

        {/* Bracket kicker */}
        <BracketLabel
          variant="muted"
          style={styles.optionalKicker}
        >
          OPTIONAL · 2 SECONDS
        </BracketLabel>

        {/* Headline */}
        <Text
          testID="headline"
          accessibilityRole="header"
          style={[styles.headline, { color: palette.warm[50] }]}
        >
          Sign in with{" "}
          <Text style={styles.headlineItalic}>a glance.</Text>
        </Text>

        {/* Subtitle */}
        <Text
          style={[styles.subtitle, { color: palette.warm[400] }]}
          accessibilityRole="text"
        >
          Use Face ID to unlock without typing your password each time.
        </Text>
      </View>

      {/* Sticky bottom CTAs */}
      <View style={styles.bottomActions}>
        <Button
          testID="continue-button"
          label="Enable Face ID"
          variant="primary"
          fullWidth
          onPress={onContinue}
          accessibilityLabel="Enable Face ID"
          style={{ ...styles.enableButton, backgroundColor: palette.sage[500] }}
          labelStyle={{ color: palette.midnight[950] }}
        />

        <TouchableOpacity
          testID="skip-link"
          style={styles.skipLink}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Maybe later, skip Face ID"
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        >
          <Text style={[styles.skipText, { color: palette.warm[400] }]}>
            Maybe later
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bottomActions: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  corner: {
    height: 28,
    position: "absolute",
    width: 28,
  },
  cornerBottomLeft: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    bottom: 0,
    left: 0,
  },
  cornerBottomRight: {
    borderBottomWidth: 2,
    borderRightWidth: 2,
    bottom: 0,
    right: 0,
  },
  cornerTopLeft: {
    borderLeftWidth: 2,
    borderTopWidth: 2,
    left: 0,
    top: 0,
  },
  cornerTopRight: {
    borderRightWidth: 2,
    borderTopWidth: 2,
    right: 0,
    top: 0,
  },
  enableButton: {
    borderRadius: 28,
    marginBottom: 4,
  },
  faceIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerLabel: {
    textAlign: "center",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSkipLink: {
    alignItems: "flex-end",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerSkipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  headline: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 12,
    marginTop: 16,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  hero: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  optionalKicker: {
    marginTop: 24,
    textAlign: "center",
  },
  orbWrapper: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  scanFrame: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 0,
    height: 220,
    justifyContent: "center",
    width: 220,
  },
  screen: {
    flex: 1,
  },
  skipLink: {
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 10,
  },
  skipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
    textAlign: "center",
  },
});

export default FingerprintSetupScreen;
