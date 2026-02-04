/**
 * OnboardingStep5Screen
 * @description Fifth and final step of onboarding carousel - Community Support
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Theme: Purple/Lavender (palette.onboarding.step5)
 * - Illustration: Multiple hands holding heart
 * - Message: Loving & Supportive Community
 */

import React from "react";
import { OnboardingCarouselCard } from "../../../shared/components/templates/onboarding";
import type { OnboardingStepData } from "../../../shared/components/templates/onboarding";
import type { AuthScreenProps } from "../../../shared/types/navigation";
import { PlaceholderIllustration } from "../../../assets/illustrations/PlaceholderIllustration";
import { palette } from "../../../shared/theme";

/**
 * Step 5 configuration data
 * TODO: Replace PlaceholderIllustration with actual onboarding-step5.png image
 */
const STEP_DATA: OnboardingStepData = {
  stepNumber: 5,
  stepLabel: "Step Five",
  title: "Loving & Supportive Community",
  highlightedWords: ["Community"],
  illustrationComponent: <PlaceholderIllustration stepNumber={5} color={palette.onboarding.step5} />,
  backgroundColor: palette.onboarding.step5,
  totalSteps: 5,
};

/**
 * OnboardingStep5Screen Component
 * Final step in the onboarding carousel flow
 * Navigates to authentication (SignUp/SignIn) on completion
 *
 * @param navigation - Navigation object from React Navigation
 * @returns Onboarding step 5 screen
 */
export function OnboardingStep5Screen({
  navigation,
}: AuthScreenProps<"OnboardingStep5">): React.ReactElement {
  /**
   * Navigate to previous step
   */
  const handleBack = (): void => {
    navigation.goBack();
  };

  /**
   * Complete onboarding and navigate to authentication
   */
  const handleComplete = (): void => {
    navigation.navigate("SignUp");
  };

  return (
    <OnboardingCarouselCard
      stepData={STEP_DATA}
      onNext={handleComplete}
      onBack={handleBack}
      testID="onboarding-step5-screen"
    />
  );
}

export default OnboardingStep5Screen;
