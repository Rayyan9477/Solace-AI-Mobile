/**
 * NotFound404Screen — prototype v4.2 #42 reskin (Sprint 9 Batch B).
 *
 * Editorial 404 with cosmic warmth. Decorative BreathingOrb top-third,
 * top-left back IconButton, ghost giant "404" Fraunces wordmark, sage-tinted
 * BreathingOrb compass overlay, "[ This page doesn't exist ]" aurora bracket,
 * Fraunces "Let's get you / back to calm." headline, supporting copy, and a
 * sage "Back home" Button.
 *
 * Maps to `prototypes/screens/42-not-found.js`.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  BreathingOrb,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface NotFound404ScreenProps {
  onBack: () => void;
  onBackHome: () => void;
  testID?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NotFound404Screen({
  onBack,
  onBackHome,
  testID = "not-found-404-screen",
}: NotFound404ScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Ambient orb top-third */}
      <View
        style={styles.ambientOrbWrap}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        testID="not-found-ambient-orb-wrap"
      >
        <BreathingOrb
          testID="not-found-ambient-orb"
          size={288}
          tint="cool"
          pulsing={!reducedMotion}
        />
      </View>

      {/* Header: back button left */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="not-found-back-button"
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 404 hero stack */}
        <View
          style={styles.heroStack}
          accessibilityRole="image"
          accessibilityLabel="Page not found"
          testID="not-found-hero"
        >
          <Text
            testID="not-found-ghost-404"
            style={[styles.ghost404, { color: palette.warm[50] }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            404
          </Text>

          <View
            style={styles.compassWrap}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <BreathingOrb
              testID="not-found-compass"
              size={144}
              tint="cool"
              pulsing={!reducedMotion}
            />
          </View>
        </View>

        {/* Bracket */}
        <View testID="not-found-bracket">
          <BracketLabel variant="aurora" style={styles.bracket}>
            This page doesn&apos;t exist
          </BracketLabel>
        </View>

        {/* Headline */}
        <Text
          testID="not-found-headline"
          accessibilityRole="header"
          style={[styles.headline, { color: palette.warm[50] }]}
        >
          {"Let's get you\n"}
          <Text style={styles.headlineItalic}>back to calm.</Text>
        </Text>

        {/* Subtitle */}
        <Text
          testID="not-found-subtitle"
          style={[styles.subtitle, { color: palette.warm[400] }]}
          accessibilityRole="text"
        >
          The page you&apos;re looking for has moved, or perhaps it was never here.
        </Text>

        {/* Back home CTA */}
        <Button
          testID="not-found-home-button"
          label="Back home"
          variant="primary"
          fullWidth
          onPress={onBackHome}
          accessibilityLabel="Back home"
          leftIcon={
            <AppIcon
              name="home"
              size={16}
              color={palette.midnight[950]}
            />
          }
          style={{
            ...styles.homeButton,
            backgroundColor: palette.sage[300],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  ambientOrbWrap: {
    alignItems: "center",
    left: 0,
    opacity: 0.45,
    position: "absolute",
    right: 0,
    top: 80,
  },
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bracket: {
    marginBottom: 8,
    textAlign: "center",
  },
  compassWrap: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  ghost404: {
    fontFamily: "Fraunces_300Light",
    fontSize: 120,
    letterSpacing: -4,
    lineHeight: 120,
    opacity: 0.06,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headline: {
    fontFamily: "Fraunces_300Light",
    fontSize: 26,
    lineHeight: 30,
    marginBottom: 12,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  heroStack: {
    alignItems: "center",
    height: 160,
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 8,
    position: "relative",
    width: "100%",
  },
  homeButton: {
    borderRadius: 28,
    marginTop: 8,
    maxWidth: 320,
    width: "100%",
  },
  screen: {
    flex: 1,
  },
  scroll: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 24,
    maxWidth: 260,
    textAlign: "center",
  },
});

export default NotFound404Screen;
