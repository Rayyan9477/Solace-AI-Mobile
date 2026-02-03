/**
 * OnboardingStep3Screen
 * @description Third step of onboarding carousel - AI Journaling
 *
 * Features:
 * - Theme: Gray/Muted (#6B6B6B)
 * - Illustration: Person writing in journal
 * - Message: AI Mental Journaling & AI Therapy Chatbot
 */

import React from "react";
import { OnboardingCarouselCard } from "../../../shared/components/templates/onboarding";
import type { OnboardingStepData } from "../../../shared/components/templates/onboarding";
import type { AuthScreenProps } from "../../../shared/types/navigation";
import { PlaceholderIllustration } from "../../../assets/illustrations/PlaceholderIllustration";

/**
 * Step 3 configuration data
 * TODO: Replace PlaceholderIllustration with actual onboarding-step3.png image
 */
const STEP_DATA: OnboardingStepData = {
  stepNumber: 3,
  stepLabel: "Step Three",
  title: "AI Mental Journaling & AI Therapy Chatbot",
  highlightedWords: ["Mental"],
  illustrationComponent: <PlaceholderIllustration stepNumber={3} color="#6B6B6B" />,
  backgroundColor: "#6B6B6B",
  totalSteps: 5,
};

/**
 * OnboardingStep3Screen Component
 * Third step in the onboarding carousel flow
 *
 * @param navigation - Navigation object from React Navigation
 * @returns Onboarding step 3 screen
 */
export function OnboardingStep3Screen({
  navigation,
}: AuthScreenProps<"OnboardingStep3">): React.ReactElement {
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
    navigation.navigate("OnboardingStep4");
  };

  return (
    <OnboardingCarouselCard
      stepData={STEP_DATA}
      onNext={handleNext}
      onBack={handleBack}
      testID="onboarding-step3-screen"
    />
  );
}

export default OnboardingStep3Screen;
