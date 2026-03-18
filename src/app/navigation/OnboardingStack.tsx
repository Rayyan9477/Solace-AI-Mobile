/**
 * Onboarding Stack Navigator
 * @description Navigation stack for first-time user onboarding flow
 * @module Navigation
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Handles screens 15-39 in the user journey:
 * Profile Setup (11 screens) → Mental Health Assessment (14 screens)
 *
 * This stack is shown after successful authentication for first-time users.
 * After completion, the user proceeds to the main app (MainFlow).
 */

import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { OnboardingScreenProps, OnboardingStackParamList } from "../../shared/types/navigation";
import { colors } from "../../shared/theme";
import { useAuth } from "../AuthContext";
import { calculateSolaceScore } from "../../features/assessment/utils/scoreCalculator";

// Profile Setup Screens
import { ProfileSetupDetailsScreen } from "../../features/onboarding/screens/ProfileSetupDetailsScreen";
import { ProfileSetupAvatarScreen } from "../../features/onboarding/screens/ProfileSetupAvatarScreen";
import { PasswordSetupScreen } from "../../features/onboarding/screens/PasswordSetupScreen";
import { OTPEntryScreen } from "../../features/onboarding/screens/OTPEntryScreen";
import { FingerprintSetupScreen } from "../../features/onboarding/screens/FingerprintSetupScreen";
import { ProfileSetupWelcomeScreen } from "../../features/onboarding/screens/ProfileSetupWelcomeScreen";
import { ProfileEmergencyContactScreen } from "../../features/onboarding/screens/ProfileEmergencyContactScreen";

// Assessment Screens
import { AssessmentIntroScreen } from "../../features/assessment/screens/AssessmentIntroScreen";
import { AssessmentQuestionScreen } from "../../features/assessment/screens/AssessmentQuestionScreen";
import { AssessmentAgeScreen } from "../../features/assessment/screens/AssessmentAgeScreen";
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

const TOTAL_ASSESSMENT_STEPS = 14;

interface QuestionOption {
  icon: string;
  id: string;
  label: string;
}

type AssessmentQuestionRoute =
  | "AssessmentPrimaryConcern"
  | "AssessmentWeight"
  | "AssessmentMood"
  | "AssessmentMentalState"
  | "AssessmentSadnessFrequency"
  | "AssessmentMedicationsQuestion"
  | "AssessmentTherapist"
  | "AssessmentExercise";

const ASSESSMENT_QUESTION_CONFIG: Record<
  AssessmentQuestionRoute,
  {
    currentStep: number;
    nextRoute: keyof OnboardingStackParamList;
    options: QuestionOption[];
    question: string;
  }
> = {
  AssessmentExercise: {
    currentStep: 11,
    nextRoute: "AssessmentExpressionAnalysis",
    options: [
      { icon: "fitness-outline", id: "daily", label: "Daily" },
      { icon: "calendar-outline", id: "weekly", label: "A few times a week" },
      { icon: "moon-outline", id: "rarely", label: "Rarely" },
      { icon: "ban-outline", id: "never", label: "Never" },
    ],
    question: "How often do you exercise?",
  },
  AssessmentMedicationsQuestion: {
    currentStep: 8,
    nextRoute: "AssessmentMedicationDetails",
    options: [
      { icon: "medical-outline", id: "yes", label: "Yes, currently" },
      { icon: "clipboard-outline", id: "past", label: "In the past" },
      { icon: "checkmark-circle-outline", id: "no", label: "No" },
    ],
    question: "Are you taking any medications for mental health?",
  },
  AssessmentMentalState: {
    currentStep: 6,
    nextRoute: "AssessmentSadnessFrequency",
    options: [
      { icon: "partly-sunny-outline", id: "steady", label: "Mostly steady" },
      { icon: "cloudy-outline", id: "mixed", label: "Mixed throughout the day" },
      { icon: "rainy-outline", id: "low", label: "Mostly low" },
    ],
    question: "How would you describe your current mental state?",
  },
  AssessmentMood: {
    currentStep: 4,
    nextRoute: "AssessmentStressTriggers",
    options: [
      { icon: "happy-outline", id: "good", label: "Mostly good" },
      { icon: "remove-circle-outline", id: "neutral", label: "Neutral" },
      { icon: "sad-outline", id: "stressed", label: "Stressed" },
      { icon: "sad-outline", id: "low", label: "Low mood" },
    ],
    question: "How have you been feeling lately?",
  },
  AssessmentPrimaryConcern: {
    currentStep: 1,
    nextRoute: "AssessmentAge",
    options: [
      { icon: "alert-circle-outline", id: "anxiety", label: "Anxiety" },
      { icon: "sad-outline", id: "low-mood", label: "Low mood" },
      { icon: "bed-outline", id: "sleep", label: "Sleep difficulties" },
      { icon: "hardware-chip-outline", id: "focus", label: "Focus and clarity" },
    ],
    question: "What's your primary concern right now?",
  },
  AssessmentSadnessFrequency: {
    currentStep: 7,
    nextRoute: "AssessmentMedicationsQuestion",
    options: [
      { icon: "sunny-outline", id: "rare", label: "Rarely" },
      { icon: "partly-sunny-outline", id: "sometimes", label: "Sometimes" },
      { icon: "rainy-outline", id: "often", label: "Often" },
      { icon: "thunderstorm-outline", id: "daily", label: "Nearly every day" },
    ],
    question: "How often have you felt sad in the last two weeks?",
  },
  AssessmentTherapist: {
    currentStep: 10,
    nextRoute: "AssessmentExercise",
    options: [
      { icon: "people-outline", id: "yes", label: "Yes" },
      { icon: "help-circle-outline", id: "considering", label: "Considering it" },
      { icon: "close-circle-outline", id: "no", label: "No" },
    ],
    question: "Do you currently have a therapist?",
  },
  AssessmentWeight: {
    currentStep: 3,
    nextRoute: "AssessmentMood",
    options: [
      { icon: "scale-outline", id: "stable", label: "Stable" },
      { icon: "arrow-up-outline", id: "gain", label: "Recent weight gain" },
      { icon: "arrow-down-outline", id: "loss", label: "Recent weight loss" },
      { icon: "help-circle-outline", id: "unsure", label: "Unsure" },
    ],
    question: "How would you describe your recent weight trend?",
  },
};

function ProfileDetailsRoute({ navigation }: OnboardingScreenProps<"ProfileNameInput">): React.ReactElement {
  return (
    <ProfileSetupDetailsScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("ProfileAvatar")}
      onEditPhoto={() => navigation.navigate("ProfileAvatar")}
      onGenderPress={() => navigation.navigate("ProfileGender")}
      onLocationPress={() => navigation.navigate("ProfileLocation")}
    />
  );
}

function ProfileAvatarRoute({ navigation }: OnboardingScreenProps<"ProfileAvatar">): React.ReactElement {
  return (
    <ProfileSetupAvatarScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("ProfilePasswordSetup")}
      onUpload={() => {}}
    />
  );
}

function ProfilePasswordRoute({ navigation }: OnboardingScreenProps<"ProfilePasswordSetup">): React.ReactElement {
  return (
    <PasswordSetupScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("ProfileOTPVerification", { phoneNumber: "" })}
    />
  );
}

function ProfileOTPRoute({ navigation }: OnboardingScreenProps<"ProfileOTPVerification">): React.ReactElement {
  return (
    <OTPEntryScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("ProfileBiometricSetup")}
      onResend={() => {}}
    />
  );
}

function ProfileBiometricRoute({ navigation }: OnboardingScreenProps<"ProfileBiometricSetup">): React.ReactElement {
  return (
    <FingerprintSetupScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("ProfileEmergencyContact")}
      onSkip={() => navigation.navigate("ProfileEmergencyContact")}
    />
  );
}

function AssessmentIntroRoute({ navigation }: OnboardingScreenProps<"AssessmentIntro">): React.ReactElement {
  return (
    <AssessmentIntroScreen
      onBack={() => navigation.goBack()}
      onStart={() => navigation.navigate("AssessmentPrimaryConcern")}
    />
  );
}

function AssessmentQuestionRouteScreen(
  props: OnboardingScreenProps<AssessmentQuestionRoute>,
): React.ReactElement {
  const { navigation, route } = props;
  const config = ASSESSMENT_QUESTION_CONFIG[route.name];

  return (
    <AssessmentQuestionScreen
      currentStep={config.currentStep}
      totalSteps={TOTAL_ASSESSMENT_STEPS}
      question={config.question}
      options={config.options}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate(config.nextRoute)}
    />
  );
}

function AssessmentAgeRoute({ navigation }: OnboardingScreenProps<"AssessmentAge">): React.ReactElement {
  return (
    <AssessmentAgeScreen
      currentStep={2}
      totalSteps={TOTAL_ASSESSMENT_STEPS}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("AssessmentWeight")}
    />
  );
}

function AssessmentStressRoute({ navigation }: OnboardingScreenProps<"AssessmentStressTriggers">): React.ReactElement {
  return (
    <AssessmentStressLevelScreen
      currentStep={5}
      totalSteps={TOTAL_ASSESSMENT_STEPS}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("AssessmentMentalState")}
    />
  );
}

function AssessmentMedicationDetailsRoute({
  navigation,
}: OnboardingScreenProps<"AssessmentMedicationDetails">): React.ReactElement {
  return (
    <AssessmentOtherSymptomsScreen
      currentStep={9}
      totalSteps={TOTAL_ASSESSMENT_STEPS}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("AssessmentTherapist")}
    />
  );
}

function AssessmentExpressionRoute({
  navigation,
}: OnboardingScreenProps<"AssessmentExpressionAnalysis">): React.ReactElement {
  return (
    <AssessmentExpressionAnalysisScreen
      currentStep={12}
      totalSteps={TOTAL_ASSESSMENT_STEPS}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("AssessmentSoundAnalysis")}
    />
  );
}

function AssessmentSoundRoute({
  navigation,
}: OnboardingScreenProps<"AssessmentSoundAnalysis">): React.ReactElement {
  return (
    <AssessmentSoundAnalysisScreen
      currentStep={13}
      totalSteps={TOTAL_ASSESSMENT_STEPS}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("AssessmentScoreAnalysis")}
    />
  );
}

function AssessmentScoreAnalysisRoute({
  navigation,
}: OnboardingScreenProps<"AssessmentScoreAnalysis">): React.ReactElement {
  useEffect(() => {
    const result = calculateSolaceScore({});
    const timer = setTimeout(() => {
      navigation.replace("AssessmentResults", {
        completedAt: Date.now(),
        freudScore: result.score,
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return <CompilingDataScreen />;
}

function AssessmentResultsRoute({
  navigation,
  route,
}: OnboardingScreenProps<"AssessmentResults">): React.ReactElement {
  const score = route.params?.freudScore ?? 50;
  const category = score >= 70 ? "healthy" : score >= 40 ? "unstable" : "critical";

  const result = calculateSolaceScore({});

  return (
    <AssessmentResultsScreen
      score={score}
      category={category}
      breakdown={result.breakdown}
      recommendations={result.recommendations}
      onContinue={() => {
        const target = category === "healthy" ? "SolaceScoreHealthy" : category === "unstable" ? "SolaceScoreUnstable" : "SolaceScoreCritical";
        navigation.replace(target, { score });
      }}
      onViewDetails={() => {}}
    />
  );
}

function SolaceScoreHealthyRoute({ route }: OnboardingScreenProps<"SolaceScoreHealthy">): React.ReactElement {
  const { completeOnboarding } = useAuth();
  const score = route.params?.score ?? 72;

  return (
    <SolaceScoreHealthyScreen
      score={score}
      onScheduleAppointment={() => {}}
      onContinue={() => {
        completeOnboarding();
      }}
    />
  );
}

function SolaceScoreUnstableRoute({ route }: OnboardingScreenProps<"SolaceScoreUnstable">): React.ReactElement {
  const { completeOnboarding } = useAuth();
  const score = route.params?.score ?? 50;

  return (
    <SolaceScoreUnstableScreen
      score={score}
      onScheduleAppointment={() => {}}
      onContinue={() => {
        completeOnboarding();
      }}
    />
  );
}

function SolaceScoreCriticalRoute({ route }: OnboardingScreenProps<"SolaceScoreCritical">): React.ReactElement {
  const { completeOnboarding } = useAuth();
  const score = route.params?.score ?? 20;

  return (
    <SolaceScoreCriticalScreen
      score={score}
      onContinue={() => {
        completeOnboarding();
      }}
    />
  );
}

/**
 * OnboardingStack Navigator Component
 * @description Stack navigator for first-time user onboarding
 * @returns {React.ReactElement} Onboarding stack navigator
 */
export function OnboardingStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="ProfileSetupWelcome"
      screenOptions={{
        headerShown: false, // All onboarding screens have custom headers
        animation: "slide_from_right", // Consistent forward navigation
        gestureEnabled: false, // Prevent skipping onboarding steps
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      {/* Profile Setup Flow (Screens 15-25) */}

      {/* Screen 15: Profile Setup Welcome */}
      <Stack.Screen
        name="ProfileSetupWelcome"
        component={ProfileSetupWelcomeScreen}
        options={{
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="ProfileNameInput"
        component={ProfileDetailsRoute}
      />

      <Stack.Screen
        name="ProfileBirthDate"
        component={ProfileDetailsRoute}
      />

      <Stack.Screen
        name="ProfileGender"
        component={ProfileDetailsRoute}
      />

      <Stack.Screen
        name="ProfileLocation"
        component={ProfileDetailsRoute}
      />

      <Stack.Screen
        name="ProfileOccupation"
        component={ProfileDetailsRoute}
      />

      {/* Screen 16-18: Name, Birth Date, Gender - TODO: Consolidate into ProfileDetails */}

      {/* Screen 19-20: Location, Occupation - TODO: Add to ProfileDetails */}

      {/* Screen 21: Avatar Selection */}
      <Stack.Screen
        name="ProfileAvatar"
        component={ProfileAvatarRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 22: Password Setup */}
      <Stack.Screen
        name="ProfilePasswordSetup"
        component={ProfilePasswordRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 23: OTP Verification */}
      <Stack.Screen
        name="ProfileOTPVerification"
        component={ProfileOTPRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 24: Emergency Contact */}
      <Stack.Screen
        name="ProfileEmergencyContact"
        component={ProfileEmergencyContactScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 25: Biometric Security Setup */}
      <Stack.Screen
        name="ProfileBiometricSetup"
        component={ProfileBiometricRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Mental Health Assessment Flow (Screens 26-39) */}

      {/* Screen 26: Assessment Intro */}
      <Stack.Screen
        name="AssessmentIntro"
        component={AssessmentIntroRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 27: Primary Concern */}
      <Stack.Screen
        name="AssessmentPrimaryConcern"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 28: Age Entry */}
      <Stack.Screen
        name="AssessmentAge"
        component={AssessmentAgeRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 29: Weight Entry */}
      <Stack.Screen
        name="AssessmentWeight"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 30: Mood Selection */}
      <Stack.Screen
        name="AssessmentMood"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 31: Stress Triggers */}
      <Stack.Screen
        name="AssessmentStressTriggers"
        component={AssessmentStressRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 32: Mental State */}
      <Stack.Screen
        name="AssessmentMentalState"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 33: Sadness Frequency */}
      <Stack.Screen
        name="AssessmentSadnessFrequency"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 34: Medications Question */}
      <Stack.Screen
        name="AssessmentMedicationsQuestion"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 35: Medication Details */}
      <Stack.Screen
        name="AssessmentMedicationDetails"
        component={AssessmentMedicationDetailsRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 36: Have Therapist */}
      <Stack.Screen
        name="AssessmentTherapist"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 37: Exercise Frequency */}
      <Stack.Screen
        name="AssessmentExercise"
        component={AssessmentQuestionRouteScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 38: Score Analysis (Loading) */}
      <Stack.Screen
        name="AssessmentScoreAnalysis"
        component={AssessmentScoreAnalysisRoute}
        options={{
          animation: "fade",
          gestureEnabled: false, // No going back during analysis
        }}
      />

      {/* Screen 39: Results Display */}
      <Stack.Screen
        name="AssessmentResults"
        component={AssessmentResultsRoute}
        options={{
          animation: "fade",
          gestureEnabled: false, // No going back from results
        }}
      />

      {/* Additional Assessment Screens (Expression/Sound Analysis) */}
      <Stack.Screen
        name="AssessmentExpressionAnalysis"
        component={AssessmentExpressionRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="AssessmentSoundAnalysis"
        component={AssessmentSoundRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Score Result Screens (Based on score value) */}
      <Stack.Screen
        name="SolaceScoreHealthy"
        component={SolaceScoreHealthyRoute}
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="SolaceScoreUnstable"
        component={SolaceScoreUnstableRoute}
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="SolaceScoreCritical"
        component={SolaceScoreCriticalRoute}
        options={{
          animation: "fade",
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
