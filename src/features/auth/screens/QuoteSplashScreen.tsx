/**
 * QuoteSplashScreen — prototype v4.2 #14 reskin (Sprint 7).
 *
 * Editorial loading moment: midnight[950] full-screen, "[ A REMINDER ]" peach
 * kicker, Fraunces italic quote, Fira Code author attribution, sage→aurora
 * gradient progress bar animating left→right over `delay` ms.
 * Auto-advances after `delay` ms.
 *
 * Maps to `prototypes/screens/14-quote.js`.
 */

import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { BracketLabel } from "@/shared/components/primitives";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface QuoteSplashScreenProps {
  quote: string;
  author: string;
  /** Auto-complete delay in ms. Defaults to 3000. */
  delay?: number;
  onComplete: () => void;
  testID?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function QuoteSplashScreen({
  quote,
  author,
  delay = 3000,
  onComplete,
  testID = "quote-splash-screen",
}: QuoteSplashScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();

  // Progress bar: width fraction 0 → 1 over `delay` ms (or instant when reduced)
  const progressFraction = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    progressFraction.value = withTiming(1, {
      duration: reduced ? 0 : delay,
    });
  }, [reduced, delay, progressFraction]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressFraction.value * 100}%` as unknown as number,
  }));

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

  // Content fade-in entrance
  const contentOpacity = useSharedValue(reduced ? 1 : 0);
  useEffect(() => {
    if (!reduced) {
      contentOpacity.value = withTiming(1, { duration: 600 });
    }
  }, [reduced, contentOpacity]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, contentStyle]}>
        {/* Top kicker */}
        <View testID="bracket-reminder-wrapper">
          <BracketLabel variant="peach" style={styles.kicker}>
            A REMINDER
          </BracketLabel>
        </View>

        {/* Quote */}
        <Text
          testID="quote-text"
          accessibilityRole="text"
          accessibilityLabel={`Quote: ${quote}`}
          style={[styles.quoteText, { color: palette.warm[50] }]}
        >
          {quote}
        </Text>

        {/* Author */}
        <Text
          testID="author-text"
          accessibilityRole="text"
          style={[styles.authorText, { color: palette.aurora[300] }]}
        >
          {`— ${author}`}
        </Text>
      </Animated.View>

      {/* Progress bar track */}
      <View
        testID="progress-bar-track"
        style={[
          styles.progressTrack,
          { backgroundColor: `${palette.warm[50]}0D` },
        ]}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading progress"
        accessibilityValue={{ min: 0, max: 100, now: 0 }}
      >
        <Animated.View style={[styles.progressBarFill, progressBarStyle]}>
          <LinearGradient
            testID="progress-bar"
            colors={[palette.sage[300], palette.aurora[300]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>

      <BracketLabel variant="muted" style={styles.loadingLabel}>
        Preparing your space
      </BracketLabel>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  authorText: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 13,
    letterSpacing: 0.4,
    marginTop: 20,
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
    paddingTop: 40,
    width: "100%",
  },
  kicker: {
    marginBottom: 28,
    textAlign: "center",
  },
  loadingLabel: {
    marginBottom: 48,
    textAlign: "center",
  },
  progressBarFill: {
    height: "100%",
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
  },
  progressTrack: {
    borderRadius: 2,
    height: 2,
    marginBottom: 12,
    overflow: "hidden",
    width: 200,
  },
  quoteText: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 28,
    fontStyle: "italic",
    lineHeight: 36,
    textAlign: "center",
  },
});

export default QuoteSplashScreen;
