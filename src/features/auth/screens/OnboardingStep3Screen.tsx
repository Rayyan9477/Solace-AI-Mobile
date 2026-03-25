/**
 * OnboardingStep3Screen
 * @description Third step of onboarding carousel - AI Journaling
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Theme: Gray/Muted (palette.onboarding.step3)
 * - Illustration: Concentric circles with journal icon
 * - Message: AI Mental Journaling & AI Therapy Chatbot
 */

import React from "react";
import { OnboardingCarouselCard } from "../../../shared/components/templates/onboarding";
import type { OnboardingStepData } from "../../../shared/components/templates/onboarding";
import type { AuthScreenProps } from "../../../shared/types/navigation";
import { OnboardingIllustration } from "../../../assets/illustrations/OnboardingIllustration";
import { palette } from "../../../shared/theme";

/**
 * Step 3 configuration data
 */
const STEP_DATA: OnboardingStepData = {
  stepNumber: 3,
  stepLabel: "Step Three",
  title: "AI Mental Journaling & AI Therapy Chatbot",
  highlightedWords: ["Mental"],
  illustrationComponent: <OnboardingIllustration step={3} />,
  backgroundColor: palette.onboarding.step3,
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
