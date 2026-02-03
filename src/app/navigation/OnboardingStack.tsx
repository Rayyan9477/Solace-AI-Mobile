/**
 * Onboarding Stack Navigator
 * @description Navigation stack for first-time user onboarding flow
 * @module Navigation
 *
 * Handles screens 15-39 in the user journey:
 * Profile Setup (11 screens) → Mental Health Assessment (14 screens)
 *
 * This stack is shown after successful authentication for first-time users.
 * After completion, the user proceeds to the main app (MainFlow).
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { OnboardingStackParamList } from "../../shared/types/navigation";

// Profile Setup Screens
import { ProfileSetupDetailsScreen } from "../../features/onboarding/screens/ProfileSetupDetailsScreen";
import { ProfileSetupAvatarScreen } from "../../features/onboarding/screens/ProfileSetupAvatarScreen";
import { PasswordSetupScreen } from "../../features/onboarding/screens/PasswordSetupScreen";
import { OTPSetupScreen } from "../../features/onboarding/screens/OTPSetupScreen";
import { OTPEntryScreen } from "../../features/onboarding/screens/OTPEntryScreen";
import { FingerprintSetupScreen } from "../../features/onboarding/screens/FingerprintSetupScreen";
import { VerificationSetupScreen } from "../../features/onboarding/screens/VerificationSetupScreen";

// Assessment Screens
import { AssessmentIntroScreen } from "../../features/assessment/screens/AssessmentIntroScreen";
import { AssessmentQuestionScreen } from "../../features/assessment/screens/AssessmentQuestionScreen";
import { AssessmentAgeScreen } from "../../features/assessment/screens/AssessmentAgeScreen";
import { AssessmentGenderScreen } from "../../features/assessment/screens/AssessmentGenderScreen";
import { AssessmentStressLevelScreen } from "../../features/assessment/screens/AssessmentStressLevelScreen";
import { AssessmentOtherSymptomsScreen } from "../../features/assessment/screens/AssessmentOtherSymptomsScreen";
import { AssessmentExpressionAnalysisScreen } from "../../features/assessment/screens/AssessmentExpressionAnalysisScreen";
import { AssessmentSoundAnalysisScreen } from "../../features/assessment/screens/AssessmentSoundAnalysisScreen";
import { AssessmentResultsScreen } from "../../features/assessment/screens/AssessmentResultsScreen";

// Score Display Screens
import { CompilingDataScreen } from "../../features/onboarding/screens/CompilingDataScreen";
import { SolaceScoreHealthyScreen } from "../../features/onboarding/screens/SolaceScoreHealthyScreen";
import { SolaceScoreUnstableScreen } from "../../features/onboarding/screens/SolaceScoreUnstableScreen";
import { SolaceScoreCriticalScreen } from "../../features/onboarding/screens/SolaceScoreCriticalScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

/**
 * OnboardingStack Navigator Component
 * @description Stack navigator for first-time user onboarding
 * @returns {React.ReactElement} Onboarding stack navigator
 */
export function OnboardingStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="AssessmentIntro"
      screenOptions={{
        headerShown: false, // All onboarding screens have custom headers
        animation: "slide_from_right", // Consistent forward navigation
        gestureEnabled: false, // Prevent skipping onboarding steps
        contentStyle: {
          backgroundColor: "#1C1410", // Dark brown background (theme primary)
        },
      }}
    >
      {/* Profile Setup Flow (Screens 15-25) */}

      {/* Screen 15: Profile Setup Welcome - TODO: Create this screen */}
      {/* <Stack.Screen
        name="ProfileSetupWelcome"
        component={ProfileSetupWelcomeScreen}
        options={{
          animation: "fade",
        }}
      /> */}

      {/* Screen 16-18: Name, Birth Date, Gender - TODO: Consolidate into ProfileDetails */}

      {/* Screen 19-20: Location, Occupation - TODO: Add to ProfileDetails */}

      {/* Screen 21: Avatar Selection */}
      <Stack.Screen
        name="ProfileAvatar"
        component={ProfileSetupAvatarScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 22: Password Setup */}
      <Stack.Screen
        name="ProfilePasswordSetup"
        component={PasswordSetupScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 23: OTP Verification */}
      <Stack.Screen
        name="ProfileOTPVerification"
        component={OTPEntryScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 24: Emergency Contact - TODO: Create this screen */}
      {/* <Stack.Screen
        name="ProfileEmergencyContact"
        component={ProfileEmergencyContactScreen}
        options={{
          animation: "slide_from_right",
        }}
      /> */}

      {/* Screen 25: Biometric Security Setup */}
      <Stack.Screen
        name="ProfileBiometricSetup"
        component={FingerprintSetupScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Mental Health Assessment Flow (Screens 26-39) */}

      {/* Screen 26: Assessment Intro */}
      <Stack.Screen
        name="AssessmentIntro"
        component={AssessmentIntroScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 27: Primary Concern */}
      <Stack.Screen
        name="AssessmentPrimaryConcern"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "primary-concern",
        }}
      />

      {/* Screen 28: Age Entry */}
      <Stack.Screen
        name="AssessmentAge"
        component={AssessmentAgeScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 29: Weight Entry */}
      <Stack.Screen
        name="AssessmentWeight"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "weight",
        }}
      />

      {/* Screen 30: Mood Selection */}
      <Stack.Screen
        name="AssessmentMood"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "mood",
        }}
      />

      {/* Screen 31: Stress Triggers */}
      <Stack.Screen
        name="AssessmentStressTriggers"
        component={AssessmentStressLevelScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 32: Mental State */}
      <Stack.Screen
        name="AssessmentMentalState"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "mental-state",
        }}
      />

      {/* Screen 33: Sadness Frequency */}
      <Stack.Screen
        name="AssessmentSadnessFrequency"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "sadness-frequency",
        }}
      />

      {/* Screen 34: Medications Question */}
      <Stack.Screen
        name="AssessmentMedicationsQuestion"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "medications",
        }}
      />

      {/* Screen 35: Medication Details */}
      <Stack.Screen
        name="AssessmentMedicationDetails"
        component={AssessmentOtherSymptomsScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 36: Have Therapist */}
      <Stack.Screen
        name="AssessmentTherapist"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "therapist",
        }}
      />

      {/* Screen 37: Exercise Frequency */}
      <Stack.Screen
        name="AssessmentExercise"
        component={AssessmentQuestionScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          questionType: "exercise",
        }}
      />

      {/* Screen 38: Score Analysis (Loading) */}
      <Stack.Screen
        name="AssessmentScoreAnalysis"
        component={CompilingDataScreen}
        options={{
          animation: "fade",
          gestureEnabled: false, // No going back during analysis
        }}
      />

      {/* Screen 39: Results Display */}
      <Stack.Screen
        name="AssessmentResults"
        component={AssessmentResultsScreen}
        options={{
          animation: "fade",
          gestureEnabled: false, // No going back from results
        }}
      />

      {/* Additional Assessment Screens (Expression/Sound Analysis) */}
      <Stack.Screen
        name="AssessmentExpressionAnalysis"
        component={AssessmentExpressionAnalysisScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="AssessmentSoundAnalysis"
        component={AssessmentSoundAnalysisScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Score Result Screens (Based on score value) */}
      <Stack.Screen
        name="SolaceScoreHealthy"
        component={SolaceScoreHealthyScreen}
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="SolaceScoreUnstable"
        component={SolaceScoreUnstableScreen}
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="SolaceScoreCritical"
        component={SolaceScoreCriticalScreen}
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
