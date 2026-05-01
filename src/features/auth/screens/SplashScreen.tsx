/**
 * SplashScreen — prototype v4.2 #13 reskin (Sprint 7).
 *
 * Brand moment: midnight[950] full-screen, ConcentricRings (5 rings, sage→aurora→lavender)
 * with BreathingOrb inside, "[ SOLACE ]" peach kicker, Fraunces wordmark, aurora kicker.
 * Auto-advances after `delay` ms.
 *
 * Maps to `prototypes/screens/13-splash.js`.
 */

import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  BreathingOrb,
  ConcentricRings,
} from "@/shared/components/primitives";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface SplashScreenProps {
  /** Auto-complete delay in ms. Defaults to 2000. */
  delay?: number;
  /** Called when delay elapses */
  onComplete: () => void;
  testID?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SplashScreen({
  delay = 2000,
  onComplete,
  testID = "splash-screen",
}: SplashScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();

  // Fade-up entrance for the wordmark cluster
  const translateY = useSharedValue(reduced ? 0 : 18);
  const opacity = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (!reduced) {
      opacity.value = withTiming(1, { duration: 700 });
      translateY.value = withTiming(0, { duration: 700 });
    }
  }, [reduced, opacity, translateY]);

  // Guard: onComplete called exactly once
  const called = useRef(false);
  useEffect(() => {
    const id = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        onComplete();
      }
    }, delay);
    return () => clearTimeout(id);
  }, [delay, onComplete]);

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      {/* Rings + orb hero */}
      <View style={styles.ringsWrapper} testID="concentric-rings-wrapper">
        <ConcentricRings
          size={260}
          rings={5}
          tint="aurora"
        >
          <BreathingOrb
            testID="breathing-orb"
            size={100}
            tint="cool"
            pulsing={!reduced}
          />
        </ConcentricRings>
      </View>

      {/* Floating wordmark cluster */}
      <Animated.View style={[styles.wordmarkCluster, wordmarkStyle]}>
        <View testID="bracket-solace-wrapper">
          <BracketLabel variant="peach" style={styles.topKicker}>
            SOLACE
          </BracketLabel>
        </View>

        <Text
          testID="wordmark-text"
          accessibilityRole="header"
          accessibilityLabel="Solace AI"
          style={[styles.wordmark, { color: palette.warm[50] }]}
        >
          Solace AI
        </Text>

        <View testID="bracket-companion-wrapper">
          <BracketLabel variant="aurora" style={styles.bottomKicker}>
            MENTAL HEALTH COMPANION
          </BracketLabel>
        </View>
      </Animated.View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bottomKicker: {
    marginTop: 8,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  ringsWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  topKicker: {
    marginBottom: 8,
    textAlign: "center",
  },
  wordmark: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 48,
    letterSpacing: -1,
    lineHeight: 52,
    textAlign: "center",
  },
  wordmarkCluster: {
    alignItems: "center",
    marginTop: 32,
  },
});

export default SplashScreen;
