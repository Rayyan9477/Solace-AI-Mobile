/**
 * OnboardingStep2Screen
 * @description Second step of onboarding carousel - Mood Tracking
 *
 * Features:
 * - Theme: Orange/Amber (#E8853A)
 * - Illustration: Person with emotion faces
 * - Message: Intelligent Mood Tracking & Emotion Insights
 */

import React from "react";
import { OnboardingCarouselCard } from "../../../shared/components/templates/onboarding";
import type { OnboardingStepData } from "../../../shared/components/templates/onboarding";
import type { AuthScreenProps } from "../../../shared/types/navigation";
import { PlaceholderIllustration } from "../../../assets/illustrations/PlaceholderIllustration";

/**
 * Step 2 configuration data
 * TODO: Replace PlaceholderIllustration with actual onboarding-step2.png image
 */
const STEP_DATA: OnboardingStepData = {
  stepNumber: 2,
  stepLabel: "Step Two",
  title: "Intelligent Mood Tracking & Emotion Insights",
  highlightedWords: ["Intelligent"],
  illustrationComponent: <PlaceholderIllustration stepNumber={2} color="#E8853A" />,
  backgroundColor: "#E8853A",
  totalSteps: 5,
};

/**
 * OnboardingStep2Screen Component
 * Second step in the onboarding carousel flow
 *
 * @param navigation - Navigation object from React Navigation
 * @returns Onboarding step 2 screen
 */
export function OnboardingStep2Screen({
  navigation,
}: AuthScreenProps<"OnboardingStep2">): React.ReactElement {
  /**
   * Navigate to previous step
   */
  const handleBack = (): void => {
    navigation.goBack();
  };

  /**
   * Navigate to next onboarding step
   */
  const handleNext = (): void => {
    navigation.navigate("OnboardingStep3");
  };

  return (
    <OnboardingCarouselCard
      stepData={STEP_DATA}
      onNext={handleNext}
      onBack={handleBack}
      testID="onboarding-step2-screen"
    />
  );
}

export default OnboardingStep2Screen;
