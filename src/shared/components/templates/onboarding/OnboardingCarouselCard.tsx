/**
 * OnboardingCarouselCard Component
 * @description Reusable template for onboarding carousel screens
 *
 * Layout:
 * - Top section (60%): Themed background with illustration and step badge
 * - Bottom section (40%): Dark brown panel with progress, title, and navigation
 */

import React from "react";
import { View, Image, StyleSheet, type ImageStyle } from "react-native";
import type { OnboardingCarouselCardProps } from "./OnboardingCarouselCard.types";
import { StepBadge } from "./StepBadge";
import { OnboardingProgressBar } from "./OnboardingProgressBar";
import { OnboardingTitle } from "./OnboardingTitle";
import { CircleArrowButton } from "./CircleArrowButton";

/**
 * OnboardingCarouselCard Component
 * Template component for all onboarding carousel screens
 *
 * @example
 * ```tsx
 * const stepData = {
 *   stepNumber: 1,
 *   stepLabel: "Step One",
 *   title: "Personalize Your Mental Health State With AI",
 *   highlightedWords: ["Health State"],
 *   illustrationSource: require("./illustrations/step1.png"),
 *   backgroundColor: "#6B7B3A",
 *   totalSteps: 5,
 * };
 *
 * <OnboardingCarouselCard
 *   stepData={stepData}
 *   onNext={handleNext}
 * />
 * ```
 */
export function OnboardingCarouselCard({
  stepData,
  onNext,
  onBack,
  testID,
  style,
}: OnboardingCarouselCardProps): React.ReactElement {
  const {
    stepNumber,
    stepLabel,
    title,
    highlightedWords,
    illustrationSource,
    illustrationComponent,
    backgroundColor,
    totalSteps,
  } = stepData;

  const isFirstStep = stepNumber === 1;
  const isLastStep = stepNumber === totalSteps;

  return (
    <View
      testID={testID}
      style={[styles.container, style]}
      accessibilityLabel={`Onboarding step ${stepNumber} of ${totalSteps}`}
    >
      {/* Illustration Section (60% height) */}
      <View
        style={[styles.illustrationSection, { backgroundColor }]}
        testID={testID ? `${testID}-illustration-section` : undefined}
      >
        {/* Step Badge */}
        <View style={styles.badgeContainer}>
          <StepBadge
            stepNumber={stepNumber}
            label={stepLabel}
            testID={testID ? `${testID}-step-badge` : undefined}
          />
        </View>

        {/* Illustration */}
        {illustrationComponent ? (
          <View
            style={styles.illustrationContainer}
            testID={testID ? `${testID}-illustration` : undefined}
          >
            {illustrationComponent}
          </View>
        ) : illustrationSource ? (
          <Image
            source={illustrationSource}
            style={styles.illustration as ImageStyle}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel={`${stepLabel} illustration`}
            testID={testID ? `${testID}-illustration` : undefined}
          />
        ) : null}
      </View>

      {/* Content Panel (40% height) */}
      <View
        style={styles.contentPanel}
        testID={testID ? `${testID}-content-panel` : undefined}
      >
        {/* Progress Bar */}
        <OnboardingProgressBar
          currentStep={stepNumber}
          totalSteps={totalSteps}
          testID={testID ? `${testID}-progress` : undefined}
        />

        {/* Title */}
        <View style={styles.titleContainer}>
          <OnboardingTitle
            text={title}
            highlightedWords={highlightedWords}
            testID={testID ? `${testID}-title` : undefined}
          />
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {/* Back Button (only show after first step) */}
          {!isFirstStep && onBack && (
            <CircleArrowButton
              onPress={onBack}
              direction="left"
              accessibilityLabel="Previous step"
              testID={testID ? `${testID}-back-button` : undefined}
              style={styles.backButton}
            />
          )}

          {/* Spacer when no back button */}
          {isFirstStep && <View style={styles.buttonSpacer} />}

          {/* Next/Complete Button */}
          <CircleArrowButton
            onPress={onNext}
            direction="right"
            variant={isLastStep ? "complete" : "next"}
            accessibilityLabel={isLastStep ? "Complete onboarding" : "Next step"}
            testID={testID ? `${testID}-next-button` : undefined}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1410",
  },
  illustrationSection: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  badgeContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  illustration: {
    width: "80%",
    height: "70%",
    marginTop: 60,
  },
  illustrationContainer: {
    width: "80%",
    height: "70%",
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  contentPanel: {
    flex: 0.4,
    backgroundColor: "#1C1410",
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    // Additional styling if needed
  },
  buttonSpacer: {
    width: 56,
  },
});

export default OnboardingCarouselCard;
