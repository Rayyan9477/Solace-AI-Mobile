/**
 * Onboarding Stack Navigator
 * @description Navigation stack for first-time user onboarding flow.
 *
 * Sprint 4 (prototype v4.2): collapsed to the minimum survivor chain:
 * ProfileDetails → ProfileEmergencyContact → ProfileBiometricSetup →
 * AssessmentIntro → AssessmentResults → completeOnboarding().
 *
 * The 14 per-question assessment routes and their wiring were deleted; S6
 * rebuilds AssessmentQuestionScreen with internal pagination and S7 wires
 * the goals picker, theme picker, notification primer, and 4-step carousel.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type {
  OnboardingScreenProps,
  OnboardingStackParamList,
} from "../../shared/types/navigation";
import { colors } from "../../shared/theme";
import { useAuth } from "../AuthContext";
import { calculateSolaceScore } from "../../features/assessment/utils/scoreCalculator";

import { ProfileSetupDetailsScreen } from "../../features/onboarding/screens/ProfileSetupDetailsScreen";
import { ProfileEmergencyContactScreen } from "../../features/onboarding/screens/ProfileEmergencyContactScreen";
import { FingerprintSetupScreen } from "../../features/onboarding/screens/FingerprintSetupScreen";
import { AssessmentIntroScreen } from "../../features/assessment/screens/AssessmentIntroScreen";
import { AssessmentResultsScreen } from "../../features/assessment/screens/AssessmentResultsScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

function ProfileDetailsRoute({
  navigation,
}: OnboardingScreenProps<"ProfileDetails">): React.ReactElement {
  return (
    <ProfileSetupDetailsScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("ProfileBiometricSetup")}
      onEditPhoto={() => {}}
      onGenderPress={() => {}}
      onLocationPress={() => {}}
    />
  );
}

function ProfileBiometricRoute({
  navigation,
}: OnboardingScreenProps<"ProfileBiometricSetup">): React.ReactElement {
  return (
    <FingerprintSetupScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("AssessmentIntro")}
      onSkip={() => navigation.navigate("AssessmentIntro")}
    />
  );
}

function AssessmentIntroRoute({
  navigation,
}: OnboardingScreenProps<"AssessmentIntro">): React.ReactElement {
  return (
    <AssessmentIntroScreen
      onBack={() => navigation.goBack()}
      onStart={() => {
        const result = calculateSolaceScore({});
        navigation.replace("AssessmentResults", {
          completedAt: Date.now(),
          freudScore: result.score,
        });
      }}
    />
  );
}

function AssessmentResultsRoute({
  route,
}: OnboardingScreenProps<"AssessmentResults">): React.ReactElement {
  const { completeOnboarding } = useAuth();
  const score = route.params?.freudScore ?? 50;
  const category = score >= 70 ? "healthy" : score >= 40 ? "unstable" : "critical";
  const result = calculateSolaceScore({});

  return (
    <AssessmentResultsScreen
      score={score}
      category={category}
      breakdown={result.breakdown}
      recommendations={result.recommendations}
      onContinue={() => completeOnboarding()}
      onViewDetails={() => {}}
    />
  );
}

/**
 * OnboardingStack Navigator Component
 */
export function OnboardingStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="ProfileDetails"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen name="ProfileDetails" component={ProfileDetailsRoute} />
      <Stack.Screen
        name="ProfileEmergencyContact"
        component={ProfileEmergencyContactScreen}
      />
      <Stack.Screen
        name="ProfileBiometricSetup"
        component={ProfileBiometricRoute}
      />
      <Stack.Screen name="AssessmentIntro" component={AssessmentIntroRoute} />
      <Stack.Screen
        name="AssessmentResults"
        component={AssessmentResultsRoute}
        options={{ animation: "fade", gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
