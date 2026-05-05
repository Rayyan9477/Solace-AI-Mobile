/**
 * Onboarding Stack Navigator
 * @description Navigation stack for first-time user onboarding flow.
 *
 * Sprint 7 final flow (prototype v4.2):
 *   ProfileDetails
 *     → AssessmentIntro
 *       → AssessmentQuestion (×N internal pager)
 *         → AssessmentResults
 *           → GoalsPicker
 *             → ThemePicker
 *               → NotificationPrimer
 *                 → ProfileBiometricSetup (Face ID primer)
 *                   → OnboardingCarousel (4-step)
 *                     → completeOnboarding() → MainFlow
 *
 * Adapter components own local state per the Sprint 6 stack-adapter pattern.
 */

import React, { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type {
  OnboardingScreenProps,
  OnboardingStackParamList,
} from "../../shared/types/navigation";
import { colors } from "../../shared/theme";
import { useTheme } from "../../shared/theme/useTheme";
import type { ThemeId } from "../../shared/theme/presets";
import { useAuth } from "../AuthContext";
import { calculateSolaceScore } from "../../features/assessment/utils/scoreCalculator";
import { useRepositories } from "../providers/RepositoryProvider";

import { ProfileSetupDetailsScreen } from "../../features/onboarding/screens/ProfileSetupDetailsScreen";
import { EmergencyContactScreen } from "../../features/crisis/screens/EmergencyContactScreen";
import { FingerprintSetupScreen } from "../../features/onboarding/screens/FingerprintSetupScreen";
import { GoalsPickerScreen } from "../../features/onboarding/screens/GoalsPickerScreen";
import type { GoalId } from "../../features/onboarding/screens/GoalsPickerScreen";
import { ThemePickerScreen } from "../../features/onboarding/screens/ThemePickerScreen";
import { NotificationPrimerScreen } from "../../features/onboarding/screens/NotificationPrimerScreen";
import { OnboardingCarouselScreen } from "../../features/onboarding/screens/OnboardingCarouselScreen";
import { AssessmentIntroScreen } from "../../features/assessment/screens/AssessmentIntroScreen";
import { AssessmentQuestionScreen } from "../../features/assessment/screens/AssessmentQuestionScreen";
import { AssessmentResultsScreen } from "../../features/assessment/screens/AssessmentResultsScreen";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const TOTAL_ASSESSMENT_STEPS = 5;

const ASSESSMENT_QUESTIONS: { question: string; options: { id: string; label: string }[] }[] = [
  {
    question: "What's your primary concern right now?",
    options: [
      { id: "anxiety", label: "Anxiety" },
      { id: "low-mood", label: "Low mood" },
      { id: "sleep", label: "Sleep difficulties" },
      { id: "focus", label: "Focus and clarity" },
    ],
  },
  {
    question: "How have you been feeling lately?",
    options: [
      { id: "good", label: "Mostly good" },
      { id: "neutral", label: "Neutral" },
      { id: "stressed", label: "Stressed" },
      { id: "low", label: "Low mood" },
    ],
  },
  {
    question: "How would you describe your current mental state?",
    options: [
      { id: "steady", label: "Mostly steady" },
      { id: "mixed", label: "Mixed throughout the day" },
      { id: "low", label: "Mostly low" },
    ],
  },
  {
    question: "How often have you felt overwhelmed in the last two weeks?",
    options: [
      { id: "rare", label: "Rarely" },
      { id: "sometimes", label: "Sometimes" },
      { id: "often", label: "Often" },
      { id: "daily", label: "Nearly every day" },
    ],
  },
  {
    question: "How often do you exercise?",
    options: [
      { id: "daily", label: "Daily" },
      { id: "weekly", label: "A few times a week" },
      { id: "rarely", label: "Rarely" },
      { id: "never", label: "Never" },
    ],
  },
];

function ProfileDetailsRoute({
  navigation,
}: OnboardingScreenProps<"ProfileDetails">): React.ReactElement {
  return (
    <ProfileSetupDetailsScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("AssessmentIntro")}
      onEditPhoto={() => {}}
      onGenderPress={() => {}}
      onLocationPress={() => {}}
    />
  );
}

function AssessmentIntroRoute({
  navigation,
}: OnboardingScreenProps<"AssessmentIntro">): React.ReactElement {
  return (
    <AssessmentIntroScreen
      onBack={() => navigation.goBack()}
      onStart={() =>
        navigation.navigate("AssessmentQuestion", {
          currentStep: 1,
          totalSteps: TOTAL_ASSESSMENT_STEPS,
        })
      }
    />
  );
}

function AssessmentQuestionRoute({
  navigation,
  route,
}: OnboardingScreenProps<"AssessmentQuestion">): React.ReactElement {
  const { currentStep, totalSteps } = route.params;
  const idx = Math.max(0, Math.min(currentStep - 1, ASSESSMENT_QUESTIONS.length - 1));
  const config = ASSESSMENT_QUESTIONS[idx];

  return (
    <AssessmentQuestionScreen
      currentStep={currentStep}
      totalSteps={totalSteps}
      question={config.question}
      options={config.options}
      onBack={() => navigation.goBack()}
      onContinue={() => {
        if (currentStep >= totalSteps) {
          const result = calculateSolaceScore({});
          navigation.replace("AssessmentResults", {
            completedAt: Date.now(),
            freudScore: result.score,
          });
          return;
        }
        navigation.navigate("AssessmentQuestion", {
          currentStep: currentStep + 1,
          totalSteps,
        });
      }}
    />
  );
}

function AssessmentResultsRoute({
  navigation,
  route,
}: OnboardingScreenProps<"AssessmentResults">): React.ReactElement {
  const { settings, isReady } = useRepositories();
  const score = route.params?.freudScore ?? 50;
  const category = score >= 70 ? "healthy" : score >= 40 ? "unstable" : "critical";
  const result = calculateSolaceScore({});

  // Sprint 11: persist the score the moment we render the results so the
  // value survives an app restart. We fire-and-forget — failure must not
  // block the onboarding flow.
  React.useEffect(() => {
    if (!isReady) return;
    void settings
      .set({ key: "solaceScore", value: String(score) })
      .catch(() => undefined);
  }, [isReady, score, settings]);

  return (
    <AssessmentResultsScreen
      score={score}
      category={category}
      breakdown={result.breakdown}
      recommendations={result.recommendations}
      onContinue={() => navigation.navigate("GoalsPicker")}
      onViewDetails={() => {}}
    />
  );
}

function GoalsPickerRoute({
  navigation,
}: OnboardingScreenProps<"GoalsPicker">): React.ReactElement {
  const [selected, setSelected] = useState<GoalId[]>([]);
  return (
    <GoalsPickerScreen
      selectedGoals={selected}
      onGoalsChange={setSelected}
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate("ThemePicker")}
      onContinue={() => navigation.navigate("ThemePicker")}
      stepLabel="Step 1 of 4"
    />
  );
}

function ThemePickerRoute({
  navigation,
}: OnboardingScreenProps<"ThemePicker">): React.ReactElement {
  const { id: currentThemeId, setTheme } = useTheme();
  const { settings, isReady } = useRepositories();

  const handleChange = useCallback(
    (id: ThemeId) => {
      void setTheme(id);
    },
    [setTheme],
  );

  // Sprint 11: persist the picked theme on continue/skip so the next launch
  // can restore it from disk.
  const persist = useCallback(
    (id: ThemeId): void => {
      if (!isReady) return;
      void settings
        .set({ key: "preferredTheme", value: id })
        .catch(() => undefined);
    },
    [isReady, settings],
  );

  return (
    <ThemePickerScreen
      selectedThemeId={currentThemeId}
      onThemeChange={handleChange}
      onBack={() => navigation.goBack()}
      onSkip={() => {
        persist(currentThemeId);
        navigation.navigate("NotificationPrimer");
      }}
      onContinue={() => {
        persist(currentThemeId);
        navigation.navigate("NotificationPrimer");
      }}
      onSystemDefault={() => {
        void setTheme("cosmic");
      }}
      stepLabel="Step 2 of 4"
    />
  );
}

function NotificationPrimerRoute({
  navigation,
}: OnboardingScreenProps<"NotificationPrimer">): React.ReactElement {
  return (
    <NotificationPrimerScreen
      onBack={() => navigation.goBack()}
      onAllow={() => navigation.navigate("ProfileBiometricSetup")}
      onSkip={() => navigation.navigate("ProfileBiometricSetup")}
    />
  );
}

function ProfileBiometricRoute({
  navigation,
}: OnboardingScreenProps<"ProfileBiometricSetup">): React.ReactElement {
  return (
    <FingerprintSetupScreen
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate("OnboardingCarousel")}
      onSkip={() => navigation.navigate("OnboardingCarousel")}
    />
  );
}

function OnboardingCarouselRoute(): React.ReactElement {
  const { completeOnboarding } = useAuth();
  return (
    <OnboardingCarouselScreen
      onComplete={() => completeOnboarding()}
      onSkip={() => completeOnboarding()}
    />
  );
}

/** OnboardingStack Navigator Component */
export function OnboardingStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="ProfileDetails"
      screenOptions={{
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileDetails" component={ProfileDetailsRoute} />
      <Stack.Screen
        name="ProfileEmergencyContact"
        component={EmergencyContactScreen}
      />
      <Stack.Screen name="AssessmentIntro" component={AssessmentIntroRoute} />
      <Stack.Screen
        name="AssessmentQuestion"
        component={AssessmentQuestionRoute}
      />
      <Stack.Screen
        name="AssessmentResults"
        component={AssessmentResultsRoute}
        options={{ animation: "fade" }}
      />
      <Stack.Screen name="GoalsPicker" component={GoalsPickerRoute} />
      <Stack.Screen name="ThemePicker" component={ThemePickerRoute} />
      <Stack.Screen
        name="NotificationPrimer"
        component={NotificationPrimerRoute}
      />
      <Stack.Screen
        name="ProfileBiometricSetup"
        component={ProfileBiometricRoute}
      />
      <Stack.Screen
        name="OnboardingCarousel"
        component={OnboardingCarouselRoute}
        options={{ animation: "fade" }}
      />
    </Stack.Navigator>
  );
}
