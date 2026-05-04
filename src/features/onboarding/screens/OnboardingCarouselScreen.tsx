/**
 * OnboardingCarouselScreen — prototype v4.2 #03 OnboardingCarousel (Sprint 7).
 *
 * 4-step internal pager introducing Solace's core pillars. midnight[950] bg
 * with subtle SmokeBlob decoration, ConcentricRings + BreathingOrb hero per
 * step, pager dots, and a sticky sage CTA.
 *
 * Maps to `prototypes/screens/03-onboarding.js`.
 */

import React, { useState } from "react";
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
  ConcentricRings,
  IconTile,
  SmokeBlob,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface OnboardingCarouselScreenProps {
  /** Called when user taps "Get started" on the last step */
  onComplete: () => void;
  /** Called when user taps "Skip" */
  onSkip?: () => void;
  /** Initial step index 0-3 (uncontrolled — internal state owns pager) */
  initialStep?: number;
  testID?: string;
}

// ─── Step definitions ────────────────────────────────────────────────────────

interface StepDefinition {
  bracket: string;
  titleStart: string;
  titleItalic: string;
  titleEnd?: string;
  body: string;
  iconName: string;
}

const STEPS: StepDefinition[] = [
  {
    bracket: "WELCOME",
    titleStart: "Meet Solace, your AI ",
    titleItalic: "companion",
    titleEnd: ".",
    body: "Always-on emotional support, grounded in CBT and mindfulness.",
    iconName: "sparkles",
  },
  {
    bracket: "DAILY MOMENTS",
    titleStart: "Quick check-ins, ",
    titleItalic: "deep insights",
    titleEnd: ".",
    body: "A 30-second mood log unlocks weekly patterns and personalized practices.",
    iconName: "heart",
  },
  {
    bracket: "JOURNAL & REFLECT",
    titleStart: "Your private journal, ",
    titleItalic: "AI-enriched",
    titleEnd: ".",
    body: "Solace notices patterns in your writing and offers gentle reframes.",
    iconName: "book-open",
  },
  {
    bracket: "CALM YOUR MIND",
    titleStart: "Breathing, sleep, ",
    titleItalic: "mindful audio",
    titleEnd: ".",
    body: "An ever-growing library of practices for your nervous system.",
    iconName: "moon",
  },
];

const STEP_COUNT = STEPS.length;

// ─── Component ───────────────────────────────────────────────────────────────

export function OnboardingCarouselScreen({
  onComplete,
  onSkip,
  initialStep = 0,
  testID = "onboarding-carousel-screen",
}: OnboardingCarouselScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();

  const clampedInitial = Math.max(0, Math.min(STEP_COUNT - 1, initialStep));
  const [currentStep, setCurrentStep] = useState<number>(clampedInitial);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEP_COUNT - 1;
  const ctaLabel = isLastStep ? "Get started" : "Continue";

  const handleContinue = (): void => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Skip link — top right */}
      <View style={styles.skipRow}>
        <View style={styles.skipSpacer} />
        {onSkip ? (
          <TouchableOpacity
            testID="skip-link"
            style={styles.skipLink}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.skipText, { color: palette.warm[400] }]}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipSpacer} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Hero illustration */}
        <View
          style={styles.heroArea}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {/* Ambient SmokeBlob */}
          <SmokeBlob
            style={styles.smokeBlob}
            tint="aurora"
          />

          {/* ConcentricRings with BreathingOrb + IconTile centered */}
          <ConcentricRings
            size={220}
            rings={4}
            tint="aurora"
            testID={`concentric-rings-step-${currentStep}`}
          >
            <BreathingOrb
              size={100}
              tint="cool"
              pulsing={!reducedMotion}
              testID={`breathing-orb-step-${currentStep}`}
            />
            <View style={styles.iconTileCenter}>
              <IconTile
                iconName={step.iconName}
                size={44}
                hue="sage"
                variant="solid"
              />
            </View>
          </ConcentricRings>
        </View>

        {/* Step copy */}
        <View style={styles.copy}>
          <BracketLabel variant="peach" style={styles.bracket}>
            {step.bracket}
          </BracketLabel>

          <Text
            testID={`step-title-${currentStep}`}
            accessibilityRole="header"
            style={[styles.title, { color: palette.warm[50] }]}
          >
            {step.titleStart}
            <Text style={styles.titleItalic}>{step.titleItalic}</Text>
            {step.titleEnd ?? ""}
          </Text>

          <Text
            style={[styles.body, { color: palette.warm[400] }]}
            accessibilityRole="text"
          >
            {step.body}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={styles.bottomArea}>
        {/* Pager dots */}
        <View
          style={styles.dotsRow}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: STEP_COUNT - 1, now: currentStep }}
          accessibilityLabel={`Step ${currentStep + 1} of ${STEP_COUNT}`}
        >
          {STEPS.map((_, i) => {
            const isActive = i === currentStep;
            return (
              <View
                key={i}
                testID={`pager-dot-${i}`}
                style={[
                  styles.dot,
                  isActive
                    ? [styles.dotActive, { backgroundColor: palette.sage[300] }]
                    : [styles.dotInactive, { borderColor: palette.warm[500] }],
                ]}
              />
            );
          })}
        </View>

        {/* Position counter */}
        <Text
          testID="position-counter"
          accessibilityRole="text"
          accessibilityLiveRegion="polite"
          style={[styles.positionCounter, { color: palette.warm[500] }]}
        >
          {`${currentStep + 1} / ${STEP_COUNT}`}
        </Text>

        {/* CTA */}
        <Button
          testID="continue-button"
          label={ctaLabel}
          variant="primary"
          fullWidth
          onPress={handleContinue}
          accessibilityLabel={isLastStep ? "Get started with Solace" : "Continue to next step"}
          style={{
            ...styles.ctaButton,
            backgroundColor: palette.sage[500],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 320,
    textAlign: "center",
  },
  bottomArea: {
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  bracket: {
    marginBottom: 10,
    textAlign: "center",
  },
  copy: {
    alignItems: "center",
    paddingBottom: 8,
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  ctaButton: {
    borderRadius: 28,
    marginTop: 16,
    minHeight: 56,
  },
  dot: {
    borderRadius: 4,
    borderWidth: 1.5,
    height: 8,
    width: 8,
  },
  dotActive: {
    borderWidth: 0,
  },
  dotInactive: {
    backgroundColor: "transparent",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 8,
  },
  heroArea: {
    alignItems: "center",
    height: 280,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  iconTileCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  positionCounter: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  skipLink: {
    alignItems: "flex-end",
    height: 44,
    justifyContent: "center",
    minWidth: 44,
    paddingHorizontal: 4,
  },
  skipRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  skipSpacer: {
    height: 44,
    width: 44,
  },
  skipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  smokeBlob: {
    left: -40,
    opacity: 0.6,
    position: "absolute",
    top: 0,
  },
  title: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 38,
    marginBottom: 12,
    textAlign: "center",
  },
  titleItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
});

export default OnboardingCarouselScreen;
