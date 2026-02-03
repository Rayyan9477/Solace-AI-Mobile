/**
 * OnboardingStep1Screen
 * @description First step of onboarding carousel - AI Personalization
 *
 * Features:
 * - Theme: Olive Green (#6B7B3A)
 * - Illustration: Person meditating
 * - Message: Personalize Your Mental Health State With AI
 */

import React from "react";
import { OnboardingCarouselCard } from "../../../shared/components/templates/onboarding";
import type { OnboardingStepData } from "../../../shared/components/templates/onboarding";
import type { AuthScreenProps } from "../../../shared/types/navigation";
import { PlaceholderIllustration } from "../../../assets/illustrations/PlaceholderIllustration";

/**
 * Step 1 configuration data
 * TODO: Replace PlaceholderIllustration with actual onboarding-step1.png image
 */
const STEP_DATA: OnboardingStepData = {
  stepNumber: 1,
  stepLabel: "Step One",
  title: "Personalize Your Mental Health State With AI",
  highlightedWords: ["Health State"],
  illustrationComponent: <PlaceholderIllustration stepNumber={1} color="#6B7B3A" />,
  backgroundColor: "#6B7B3A",
  totalSteps: 5,
};

/**
 * OnboardingStep1Screen Component
 * First step in the onboarding carousel flow
 *
 * @param navigation - Navigation object from React Navigation
 * @returns Onboarding step 1 screen
 */
export function OnboardingStep1Screen({
  navigation,
}: AuthScreenProps<"OnboardingStep1">): React.ReactElement {
  /**
   * Navigate to next onboarding step
   */
  const handleNext = (): void => {
    navigation.navigate("OnboardingStep2");
  };

  return (
    <OnboardingCarouselCard
      stepData={STEP_DATA}
      onNext={handleNext}
      testID="onboarding-step1-screen"
    />
  );
}

export default OnboardingStep1Screen;
