/**
 * CbtThoughtRecordScreen — prototype v4.2 #27 CBT 5-step flow (Sprint 8).
 *
 * Editorial header with bracket kicker + Fraunces italic headline, the
 * shared CbtStepper organism for 5 segments (Situation / Thought / Emotion /
 * Reframe / Action), an optional "Previous answer" GlassCard, a peach-
 * bordered HeroCard for the current step's textarea (and on step 2,
 * cognitive-distortion chips), and a primary "Next step" CTA at the bottom.
 *
 * Maps to `prototypes/screens/27-cbt.js`.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ScreenContainer } from "@/shared/components/atoms/layout";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { Button } from "@/shared/components/atoms/buttons/Button";
import {
  BracketLabel,
  GlassCard,
  HeroCard,
} from "@/shared/components/primitives";
import { CbtStepper } from "@/shared/components/organisms/chat/CbtStepper";
import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type CbtStepIndex = 1 | 2 | 3 | 4 | 5;

export type CbtField =
  | "situation"
  | "thought"
  | "emotion"
  | "reframe"
  | "action";

export interface CbtThoughtRecordScreenProps {
  /** 1-based current step (1..5). */
  currentStep: CbtStepIndex;
  situation?: string;
  thought?: string;
  selectedDistortions?: string[];
  emotion?: string;
  reframe?: string;
  action?: string;
  onTextChange: (field: CbtField, value: string) => void;
  onToggleDistortion: (label: string) => void;
  onBack: () => void;
  onNext: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEP_LABELS: readonly string[] = [
  "Situation",
  "Thought",
  "Emotion",
  "Reframe",
  "Action",
];

const STEP_FIELDS: readonly CbtField[] = [
  "situation",
  "thought",
  "emotion",
  "reframe",
  "action",
];

interface StepCopy {
  bracket: string;
  prompt: string;
  placeholder: string;
}

const STEP_COPY: Record<CbtField, StepCopy> = {
  situation: {
    bracket: "First → what's the situation?",
    prompt: "What's happening right now?",
    placeholder: "Describe the situation in a sentence or two…",
  },
  thought: {
    bracket: "Now → what's the thought?",
    prompt: "What was running through your mind?",
    placeholder: "I'm going to mess this up and everyone will judge me…",
  },
  emotion: {
    bracket: "Then → how do you feel?",
    prompt: "What emotion is showing up, and how strong is it?",
    placeholder: "Anxious (8/10), a little frustrated…",
  },
  reframe: {
    bracket: "Reframe → a kinder lens",
    prompt: "If a friend felt this way, what would you tell them?",
    placeholder: "Even if I stumble, my team has my back…",
  },
  action: {
    bracket: "Action → one small step",
    prompt: "What is one tiny thing you can do next?",
    placeholder: "Take three slow breaths before joining the call…",
  },
};

const COGNITIVE_DISTORTIONS: readonly string[] = [
  "Catastrophizing",
  "Mind reading",
  "All-or-nothing",
  "Personalization",
  "Should statements",
];

// ---------------------------------------------------------------------------
// Distortion chip
// ---------------------------------------------------------------------------

interface DistortionChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function DistortionChip({
  label,
  selected,
  onPress,
}: DistortionChipProps): React.ReactElement {
  const { palette } = useTheme();

  const bg = selected ? `${palette.peach[300]}26` : palette.midnight[700];
  const border = selected
    ? `${palette.peach[300]}66`
    : palette.midnight[600];
  const color = selected ? palette.peach[300] : palette.warm[200];

  return (
    <TouchableOpacity
      testID={`distortion-chip-${label}`}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Cognitive distortion ${label}`}
      accessibilityState={{ selected }}
      activeOpacity={0.85}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={[
        chipStyles.chip,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      <Text style={[chipStyles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function CbtThoughtRecordScreen({
  currentStep,
  situation = "",
  thought = "",
  selectedDistortions = [],
  emotion = "",
  reframe = "",
  action = "",
  onTextChange,
  onToggleDistortion,
  onBack,
  onNext,
  testID = "cbt-thought-record-screen",
  style,
}: CbtThoughtRecordScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  useReducedMotion();

  const stepIdx = currentStep - 1;
  const currentField = STEP_FIELDS[stepIdx];
  const copy = STEP_COPY[currentField];

  const valueByField: Record<CbtField, string> = {
    situation,
    thought,
    emotion,
    reframe,
    action,
  };
  const currentValue = valueByField[currentField];

  // Previous step's data (only when currentStep > 1)
  const prevField =
    currentStep > 1 ? STEP_FIELDS[stepIdx - 1] : null;
  const prevValue = prevField ? valueByField[prevField] : "";
  const prevLabel = prevField
    ? STEP_LABELS[stepIdx - 1]
    : "";

  // Stepper data (mark steps before current as completed)
  const steps = STEP_LABELS.map((label, i) => ({
    label,
    completed: i < stepIdx,
  }));

  const peachBorder = `${palette.peach[300]}38`;
  const inputBg = `${palette.warm[50]}0A`;
  const inputBorder = `${palette.warm[50]}14`;

  const showDistortions = currentField === "thought";

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mini-header */}
        <View style={styles.miniHeader}>
          <TouchableOpacity
            testID="back-button"
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="chevron-left" size={18} color={palette.warm[100]} />
          </TouchableOpacity>

          <Text
            testID="mini-header-title"
            accessibilityRole="header"
            style={[styles.miniHeaderText, { color: palette.warm[400] }]}
          >
            Thought record
          </Text>

          <Text
            testID="step-counter"
            style={[
              styles.stepCounter,
              {
                color: palette.warm[500],
                fontFamily: typography.fontFamily.mono,
              },
            ]}
            accessibilityLabel={`Step ${currentStep} of 5`}
          >
            {`${currentStep} of 5`}
          </Text>
        </View>

        {/* Editorial kicker + headline */}
        <BracketLabel variant="aurora" style={styles.kicker}>
          Cognitive behavioral therapy
        </BracketLabel>

        <Text
          testID="headline"
          accessibilityRole="header"
          style={[
            styles.headline,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.display,
            },
          ]}
        >
          {"Let’s examine\n"}
          <Text
            style={[
              styles.headlineItalic,
              {
                color: palette.warm[50],
                fontFamily: typography.fontFamily.displayItalic,
              },
            ]}
          >
            that thought.
          </Text>
        </Text>

        {/* Stepper */}
        <View style={styles.stepperWrap}>
          <CbtStepper
            testID="cbt-stepper"
            steps={steps}
            currentIndex={stepIdx}
          />
        </View>

        {/* Previous answer card (only after step 1) */}
        {prevField && prevValue ? (
          <GlassCard
            testID="previous-answer-card"
            radius={20}
            style={styles.previousCard}
          >
            <View style={styles.previousInner}>
              <AppIcon
                name="rotate-ccw"
                size={14}
                color={palette.warm[500]}
                accessibilityLabel="Previous step"
              />
              <View style={styles.previousText}>
                <BracketLabel variant="muted">{prevLabel}</BracketLabel>
                <Text
                  style={[
                    styles.previousValue,
                    { color: palette.warm[200] },
                  ]}
                >
                  {prevValue}
                </Text>
              </View>
            </View>
          </GlassCard>
        ) : null}

        {/* Current question card */}
        <HeroCard
          testID="current-question-hero"
          radius={20}
          style={styles.questionHero}
        >
          <GlassCard
            variant="strong"
            radius={19}
            style={[
              styles.questionCard,
              { borderColor: peachBorder },
            ]}
          >
            <BracketLabel variant="peach">{copy.bracket}</BracketLabel>

            <Text
              testID="question-prompt"
              style={[styles.questionPrompt, { color: palette.warm[50] }]}
            >
              {copy.prompt}
            </Text>

            <TextInput
              testID="thought-input"
              accessibilityLabel={copy.prompt}
              value={currentValue}
              onChangeText={(value) => onTextChange(currentField, value)}
              placeholder={copy.placeholder}
              placeholderTextColor={palette.warm[500]}
              multiline
              textAlignVertical="top"
              style={[
                styles.textarea,
                {
                  backgroundColor: inputBg,
                  borderColor: inputBorder,
                  color: palette.warm[50],
                },
              ]}
            />

            {showDistortions ? (
              <View style={styles.distortionWrap}>
                <BracketLabel variant="muted">
                  Any of these feel familiar?
                </BracketLabel>

                <View
                  testID="distortion-chips"
                  accessibilityRole="radiogroup"
                  accessibilityLabel="Cognitive distortions"
                  style={styles.distortionRow}
                >
                  {COGNITIVE_DISTORTIONS.map((label) => (
                    <DistortionChip
                      key={label}
                      label={label}
                      selected={selectedDistortions.includes(label)}
                      onPress={() => onToggleDistortion(label)}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </GlassCard>
        </HeroCard>

        {/* Bottom CTA */}
        <Button
          testID="next-step-button"
          label="Next step"
          variant="primary"
          fullWidth
          onPress={onNext}
          accessibilityLabel={
            currentStep === 5 ? "Finish thought record" : "Next step"
          }
          rightIcon={
            <AppIcon
              name="arrow-right"
              size={16}
              color={palette.midnight[950]}
            />
          }
          style={{
            ...styles.primaryButton,
            backgroundColor: palette.sage[300],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  distortionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  distortionWrap: {
    marginTop: 16,
  },
  headline: {
    fontSize: 26,
    fontWeight: "300",
    lineHeight: 30,
    marginBottom: 24,
  },
  headlineItalic: {
    fontSize: 26,
    fontStyle: "italic",
    lineHeight: 30,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  kicker: {
    marginBottom: 8,
  },
  miniHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  miniHeaderText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  previousCard: {
    marginBottom: 12,
    padding: 14,
  },
  previousInner: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  previousText: {
    flex: 1,
    gap: 4,
  },
  previousValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  primaryButton: {
    borderRadius: 28,
    marginTop: 8,
  },
  questionCard: {
    borderWidth: 1,
    padding: 18,
  },
  questionHero: {
    marginBottom: 16,
  },
  questionPrompt: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  stepCounter: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  stepperWrap: {
    marginBottom: 18,
    marginHorizontal: -16,
  },
  textarea: {
    borderRadius: 12,
    borderWidth: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    minHeight: 96,
    padding: 12,
  },
});

const chipStyles = StyleSheet.create({
  chip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
});

export default CbtThoughtRecordScreen;
