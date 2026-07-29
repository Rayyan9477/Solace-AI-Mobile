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

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";

import { AssessmentIntroScreen } from "../../features/assessment/screens/AssessmentIntroScreen";
import { AssessmentQuestionScreen } from "../../features/assessment/screens/AssessmentQuestionScreen";
import { AssessmentResultsScreen } from "../../features/assessment/screens/AssessmentResultsScreen";
import { calculateSolaceScore } from "../../features/assessment/utils/scoreCalculator";
import { useAuth } from "../AuthContext";
import type { AssessmentAnswers } from "../../features/assessment/utils/scoreCalculator";
import { useRepositories } from "../providers/RepositoryProvider";
import { ProfileSetupDetailsScreen } from "../../features/onboarding/screens/ProfileSetupDetailsScreen";
import { EmergencyContactScreen } from "../../features/crisis/screens/EmergencyContactScreen";
import { FingerprintSetupScreen } from "../../features/onboarding/screens/FingerprintSetupScreen";
import { GoalsPickerScreen } from "../../features/onboarding/screens/GoalsPickerScreen";
import type { GoalId } from "../../features/onboarding/screens/GoalsPickerScreen";
import { ThemePickerScreen } from "../../features/onboarding/screens/ThemePickerScreen";
import { NotificationPrimerScreen } from "../../features/onboarding/screens/NotificationPrimerScreen";
import { OnboardingCarouselScreen } from "../../features/onboarding/screens/OnboardingCarouselScreen";
import { colors } from "../../shared/theme";
import type { ThemeId } from "../../shared/theme/presets";
import { useTheme } from "../../shared/theme/useTheme";
import { useWriteFailureToast } from "../../shared/utils/useWriteFailureToast";
import type {
  OnboardingScreenProps,
  OnboardingStackParamList,
} from "../../shared/types/navigation";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const TOTAL_ASSESSMENT_STEPS = 5;

/**
 * One assessment question, plus the mapping from its own option vocabulary
 * into the scoring model's.
 *
 * That mapping is the point of this type. The questions and
 * {@link calculateSolaceScore} were written with different vocabularies — the
 * questions offer "good"/"stressed"/"weekly", the scorer expects
 * "happy"/"sad"/"often" — so simply forwarding the chosen option id would have
 * scored 0 for almost every answer even after the answers were threaded
 * through. Declaring `field` and `values` beside the options makes the two
 * impossible to drift apart.
 */
interface AssessmentQuestionConfig {
  readonly question: string;
  /** Which {@link AssessmentAnswers} field the chosen option fills. */
  readonly field: keyof AssessmentAnswers;
  readonly options: readonly { id: string; label: string }[];
  /** Option id → value written into `field`. */
  readonly values: Readonly<Record<string, string | number>>;
}

const ASSESSMENT_QUESTIONS: readonly AssessmentQuestionConfig[] = [
  {
    question: "What's your primary concern right now?",
    // Captured for later personalisation, not scored: "what brings you here"
    // routes content, it does not measure severity.
    field: "primaryConcern",
    options: [
      { id: "anxiety", label: "Anxiety" },
      { id: "low-mood", label: "Low mood" },
      { id: "sleep", label: "Sleep difficulties" },
      { id: "focus", label: "Focus and clarity" },
    ],
    values: {
      anxiety: "anxiety",
      "low-mood": "low-mood",
      sleep: "sleep",
      focus: "focus",
    },
  },
  {
    question: "How have you been feeling lately?",
    field: "moodLevel",
    options: [
      { id: "good", label: "Mostly good" },
      { id: "neutral", label: "Neutral" },
      { id: "stressed", label: "Stressed" },
      { id: "low", label: "Low mood" },
    ],
    values: {
      good: "happy",
      neutral: "neutral",
      stressed: "sad",
      low: "depressed",
    },
  },
  {
    question: "How would you describe your current mental state?",
    // Mapped onto the scorer's existing sadness-frequency weights rather than
    // inventing new ones. The mapping itself is a clinical judgement and is
    // on the list for the licensed-clinician review.
    field: "sadnessFrequency",
    options: [
      { id: "steady", label: "Mostly steady" },
      { id: "mixed", label: "Mixed throughout the day" },
      { id: "low", label: "Mostly low" },
    ],
    values: { steady: "rarely", mixed: "sometimes", low: "often" },
  },
  {
    question: "How often have you felt overwhelmed in the last two weeks?",
    field: "stressLevel",
    options: [
      { id: "rare", label: "Rarely" },
      { id: "sometimes", label: "Sometimes" },
      { id: "often", label: "Often" },
      { id: "daily", label: "Nearly every day" },
    ],
    values: { rare: 2, sometimes: 3, often: 4, daily: 5 },
  },
  {
    question: "How often do you exercise?",
    field: "exerciseFrequency",
    options: [
      { id: "daily", label: "Daily" },
      { id: "weekly", label: "A few times a week" },
      { id: "rarely", label: "Rarely" },
      { id: "never", label: "Never" },
    ],
    values: {
      daily: "daily",
      weekly: "often",
      rarely: "rarely",
      never: "never",
    },
  },
];

/** Chosen option id per 1-based question step. */
type AssessmentSelections = Readonly<Record<number, string>>;

/**
 * Translate the user's option choices into the scorer's answer shape.
 *
 * @param selections - option id per 1-based step
 * @returns answers ready for {@link calculateSolaceScore}
 */
function answersFrom(selections: AssessmentSelections): AssessmentAnswers {
  const answers: Record<string, string | number> = {};
  ASSESSMENT_QUESTIONS.forEach((config, index) => {
    const chosen = selections[index + 1];
    if (chosen === undefined) return;
    const value = config.values[chosen];
    if (value === undefined) return;
    answers[config.field] = value;
  });
  return answers as AssessmentAnswers;
}

interface AssessmentState {
  readonly selections: AssessmentSelections;
  readonly select: (step: number, optionId: string) => void;
}

/**
 * Holds the assessment answers for the length of the flow.
 *
 * Each question is its own screen, so the choices have to live above them.
 * They previously lived nowhere at all: the adapter dropped the `answerId`
 * that `AssessmentQuestionScreen` handed it and scored `{}` every time.
 */
const AssessmentContext = React.createContext<AssessmentState | null>(null);

function useAssessment(): AssessmentState {
  const ctx = React.useContext(AssessmentContext);
  if (!ctx) {
    throw new Error("useAssessment must be used inside OnboardingStack");
  }
  return ctx;
}

function AssessmentProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [selections, setSelections] = useState<AssessmentSelections>({});
  const select = useCallback((step: number, optionId: string) => {
    setSelections((prev) => ({ ...prev, [step]: optionId }));
  }, []);
  const value = React.useMemo(
    () => ({ selections, select }),
    [selections, select],
  );
  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

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
  const idx = Math.max(
    0,
    Math.min(currentStep - 1, ASSESSMENT_QUESTIONS.length - 1),
  );
  const config = ASSESSMENT_QUESTIONS[idx];
  const { selections, select } = useAssessment();

  return (
    <AssessmentQuestionScreen
      currentStep={currentStep}
      totalSteps={totalSteps}
      question={config.question}
      options={config.options as { id: string; label: string }[]}
      selectedId={selections[currentStep]}
      onBack={() => navigation.goBack()}
      onContinue={(answerId) => {
        // `select` lands on the next render, so merge here — the final step
        // scores immediately and would otherwise miss the last answer.
        const chosen = answerId ?? selections[currentStep];
        if (chosen !== undefined) select(currentStep, chosen);
        const merged =
          chosen === undefined
            ? selections
            : { ...selections, [currentStep]: chosen };

        if (currentStep >= totalSteps) {
          const result = calculateSolaceScore(answersFrom(merged));
          navigation.replace("AssessmentResults", {
            completedAt: Date.now(),
            freudScore: result.score,
          });
          return;
        }

        // `push`, not `navigate`: navigating to a route name already on the
        // stack updates its params instead of adding an entry, so all five
        // questions shared one entry and Back jumped straight out of the
        // questionnaire to the intro.
        navigation.push("AssessmentQuestion", {
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
  const { reportWriteFailure, failureToast } = useWriteFailureToast();
  const { selections } = useAssessment();

  // One source of truth: score, breakdown and recommendations all come from
  // the same answers. Previously the score came from a route param while the
  // breakdown and recommendations came from `calculateSolaceScore({})`, so a
  // high scorer was still shown the base breakdown and the "unstable" advice.
  const result = calculateSolaceScore(answersFrom(selections));
  const answered = Object.keys(selections).length > 0;
  const score = answered
    ? result.score
    : (route.params?.freudScore ?? result.score);
  const category =
    score >= 70 ? "healthy" : score >= 40 ? "unstable" : "critical";

  // Sprint 11: persist the score the moment we render the results so the
  // value survives an app restart. Phase 1.6: a rejected write no longer
  // vanishes — Home reads this key back for its score tile, so losing it
  // silently means the user's assessment result quietly disappears at the
  // next launch with nothing to explain it.
  React.useEffect(() => {
    if (!isReady) return;
    void settings
      .set({ key: "solaceScore", value: String(score) })
      .catch((error: unknown) => {
        reportWriteFailure({
          operation: "settings.set",
          error,
          message:
            "We couldn't save your result. It's shown below, but it may not be here next time.",
          context: { key: "solaceScore" },
        });
      });
  }, [isReady, reportWriteFailure, score, settings]);

  return (
    <>
      <AssessmentResultsScreen
        score={score}
        category={category}
        breakdown={result.breakdown}
        recommendations={result.recommendations}
        onContinue={() => navigation.navigate("GoalsPicker")}
        onViewDetails={() => {}}
      />
      {failureToast}
    </>
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
  const { settings } = useRepositories();
  const { reportWriteFailure, failureToast } = useWriteFailureToast();

  const handleChange = useCallback(
    (id: ThemeId) => {
      void setTheme(id);
    },
    [setTheme],
  );

  // Sprint 11: persist the picked theme on continue/skip so the next launch
  // can restore it from disk. Phase 1.6: advance only once the write lands.
  // The toast carries a "Continue" action so a broken settings table can
  // never trap someone inside onboarding over a cosmetic preference.
  const persistThenAdvance = useCallback(
    (id: ThemeId): void => {
      const advance = (): void => {
        navigation.navigate("NotificationPrimer");
      };
      void settings
        .set({ key: "preferredTheme", value: id })
        .then(advance)
        .catch((error: unknown) => {
          reportWriteFailure({
            operation: "settings.set",
            error,
            message:
              "We couldn't save your theme. It's applied for now, but the next launch won't remember it.",
            context: { key: "preferredTheme" },
            action: { label: "Continue", onPress: advance },
          });
        });
    },
    [navigation, reportWriteFailure, settings],
  );

  return (
    <>
      <ThemePickerScreen
        selectedThemeId={currentThemeId}
        onThemeChange={handleChange}
        onBack={() => navigation.goBack()}
        onSkip={() => persistThenAdvance(currentThemeId)}
        onContinue={() => persistThenAdvance(currentThemeId)}
        onSystemDefault={() => {
          void setTheme("cosmic");
        }}
        stepLabel="Step 2 of 4"
      />
      {failureToast}
    </>
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
    <AssessmentProvider>
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
    </AssessmentProvider>
  );
}
