/**
 * WelcomeScreen — prototype v4.2 #01 reskin (Sprint 7).
 *
 * midnight[950] bg with layered BreathingOrb + SmokeBlob ambiance.
 * Editorial Fraunces headline, trust-row bracket chips, primary CTA
 * and Sign In link.
 *
 * Maps to `prototypes/screens/01-welcome.js`.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenContainer } from "@/shared/components/atoms/layout";
import { Button } from "@/shared/components/atoms/buttons/Button";
import {
  BracketLabel,
  BreathingOrb,
  SmokeBlob,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

export interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  testID?: string;
}

const TRUST_CHIPS: readonly string[] = [
  "AAA accessible",
  "Privacy first",
  "Therapeutic",
] as const;

export function WelcomeScreen({
  onGetStarted,
  onSignIn,
  testID = "welcome-screen",
}: WelcomeScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Ambient depth layer */}
      <SmokeBlob
        tint="aurora"
        size={320}
        opacity={0.18}
        style={styles.smokeBlob}
      />

      {/* Breathing orb — centered hero background */}
      <View style={styles.orbContainer} pointerEvents="none">
        <BreathingOrb
          testID="breathing-orb"
          size={280}
          tint="cool"
          pulsing={!reducedMotion}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Wordmark */}
        <BracketLabel
          variant="peach"
          style={styles.wordmark}
          announceAsLabel
        >
          SOLACE AI
        </BracketLabel>

        {/* Hero headline */}
        <Text
          accessibilityRole="header"
          style={[styles.headline, { color: palette.warm[50] }]}
        >
          {"Welcome to "}
          <Text
            style={[
              styles.headlineItalic,
              { color: palette.warm[50] },
            ]}
          >
            Solace
          </Text>
        </Text>

        {/* Subtitle */}
        <Text
          style={[styles.subtitle, { color: palette.warm[400] }]}
          accessibilityRole="text"
        >
          Your mindful companion for daily mental wellness
        </Text>

        {/* Trust row */}
        <View style={styles.trustRow} accessibilityLabel="Trust signals">
          {TRUST_CHIPS.map((chip) => (
            <View
              key={chip}
              style={[
                styles.trustChip,
                { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
              ]}
            >
              <View
                style={[styles.trustDot, { backgroundColor: palette.sage[300] }]}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              />
              <BracketLabel variant="sage" announceAsLabel={false}>
                {chip}
              </BracketLabel>
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Primary CTA */}
        <Button
          testID="get-started-button"
          label="Get Started →"
          variant="primary"
          fullWidth
          onPress={onGetStarted}
          accessibilityLabel="Get Started"
          style={{
            ...styles.ctaButton,
            backgroundColor: palette.peach[300],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />

        {/* Sign In link */}
        <TouchableOpacity
          testID="sign-in-link"
          style={styles.signInLink}
          onPress={onSignIn}
          accessibilityRole="link"
          accessibilityLabel="Already have an account? Sign In"
          hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
        >
          <Text style={[styles.signInText, { color: palette.warm[400] }]}>
            {"Already have an account? "}
            <Text style={[styles.signInHighlight, { color: palette.peach[300] }]}>
              Sign In.
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ctaButton: {
    borderRadius: 28,
    marginBottom: 4,
  },
  headline: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 32,
    lineHeight: 38,
    marginBottom: 12,
    marginTop: 16,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  orbContainer: {
    alignItems: "center",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 60,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  signInHighlight: {
    fontFamily: "Inter_500Medium",
    textDecorationLine: "underline",
  },
  signInLink: {
    alignItems: "center",
    marginTop: 16,
    minHeight: 44,
    paddingVertical: 10,
  },
  signInText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  smokeBlob: {
    left: -60,
    position: "absolute",
    top: -40,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 280,
    textAlign: "center",
  },
  trustChip: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  trustDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  trustRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 32,
  },
  wordmark: {
    marginBottom: 4,
    textAlign: "center",
  },
});

export default WelcomeScreen;
