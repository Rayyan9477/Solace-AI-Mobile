/**
 * OnboardingStep1Screen
 * @description First step of onboarding carousel - AI Personalization
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Theme: Olive Green (palette.onboarding.step1)
 * - Illustration: Concentric circles with person icon
 * - Message: Personalize Your Mental Health State With AI
 */

import React from "react";
import { OnboardingCarouselCard } from "../../../shared/components/templates/onboarding";
import type { OnboardingStepData } from "../../../shared/components/templates/onboarding";
import type { AuthScreenProps } from "../../../shared/types/navigation";
import { OnboardingIllustration } from "../../../assets/illustrations/OnboardingIllustration";
import { palette } from "../../../shared/theme";

/**
 * Step 1 configuration data
 */
const STEP_DATA: OnboardingStepData = {
  stepNumber: 1,
  stepLabel: "Step One",
  title: "Personalize Your Mental Health State With AI",
  highlightedWords: ["Health State"],
  illustrationComponent: <OnboardingIllustration step={1} />,
  backgroundColor: palette.onboarding.step1,
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
