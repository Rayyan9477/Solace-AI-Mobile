/**
 * OnboardingStep4Screen
 * @description Fourth step of onboarding carousel - Mindful Resources
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Theme: Golden/Mustard (palette.onboarding.step4)
 * - Illustration: Person spreading arms joyfully
 * - Message: Mindful Resources That Makes You Happy
 */

import React from "react";
import { OnboardingCarouselCard } from "../../../shared/components/templates/onboarding";
import type { OnboardingStepData } from "../../../shared/components/templates/onboarding";
import type { AuthScreenProps } from "../../../shared/types/navigation";
import { PlaceholderIllustration } from "../../../assets/illustrations/PlaceholderIllustration";
import { palette } from "../../../shared/theme";

/**
 * Step 4 configuration data
 * TODO: Replace PlaceholderIllustration with actual onboarding-step4.png image
 */
const STEP_DATA: OnboardingStepData = {
  stepNumber: 4,
  stepLabel: "Step Four",
  title: "Mindful Resources That Makes You Happy",
  highlightedWords: ["Resources"],
  illustrationComponent: <PlaceholderIllustration stepNumber={4} color={palette.onboarding.step4} />,
  backgroundColor: palette.onboarding.step4,
  totalSteps: 5,
};

/**
 * OnboardingStep4Screen Component
 * Fourth step in the onboarding carousel flow
 *
 * @param navigation - Navigation object from React Navigation
 * @returns Onboarding step 4 screen
 */
export function OnboardingStep4Screen({
  navigation,
}: AuthScreenProps<"OnboardingStep4">): React.ReactElement {
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
    navigation.navigate("OnboardingStep5");
  };

  return (
    <OnboardingCarouselCard
      stepData={STEP_DATA}
      onNext={handleNext}
      onBack={handleBack}
      testID="onboarding-step4-screen"
    />
  );
}

export default OnboardingStep4Screen;
