/**
 * AssessmentQuestionScreen — prototype v4.2 #04 AssessmentQuestion (Sprint 7 reskin).
 *
 * Single-question radio card screen used in the GAD-7 / PHQ-9 / PSS check-in
 * flow. midnight[950] bg. Header: back + RingProgress + skip. Sticky sage CTA.
 *
 * Maps to `prototypes/screens/04-assessment.js`.
 */

import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import {
  BracketLabel,
  GlassCard,
  RingProgress,
} from "@/shared/components/primitives";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface AssessmentQuestionOption {
  id: string;
  label: string;
  /** Lucide icon name for left-side icon (legacy) — optional */
  icon?: string;
}

export interface AssessmentQuestionScreenProps {
  currentStep: number;
  totalSteps: number;
  question: string;
  options: AssessmentQuestionOption[];
  onBack: () => void;
  onContinue: (answerId?: string) => void;
  onSkip?: () => void;
  /** Pre-selected option id (controlled) */
  selectedId?: string;
  /** Optional sublabel under each option's label */
  optionsSublabels?: Record<string, string>;
  testID?: string;
}

// ─── Default options ──────────────────────────────────────────────────────────

export const DEFAULT_OPTIONS: AssessmentQuestionOption[] = [
  { id: "never", label: "Never" },
  { id: "sometimes", label: "Sometimes" },
  { id: "often", label: "Often" },
  { id: "almost-always", label: "Almost always" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function AssessmentQuestionScreen({
  currentStep,
  totalSteps,
  question,
  options,
  onBack,
  onContinue,
  onSkip,
  selectedId,
  optionsSublabels,
  testID = "assessment-question-screen",
}: AssessmentQuestionScreenProps): React.ReactElement {
  const { palette } = useTheme();
  // Acknowledge reduced motion — passed to RingProgress internally
  useReducedMotion();

  const [internalSelected, setInternalSelected] = useState<string | undefined>(
    selectedId,
  );

  // Keep internal state in sync when controlled value changes
  React.useEffect(() => {
    setInternalSelected(selectedId);
  }, [selectedId]);

  const activeId = internalSelected;
  const isContinueEnabled = activeId !== undefined;

  const ringValue = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  const handleContinue = (): void => {
    onContinue(activeId);
  };

  const handleSelect = (id: string): void => {
    setInternalSelected(id);
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        {/* Back button */}
        <TouchableOpacity
          testID="back-button"
          style={[
            styles.backButton,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="arrow-left" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        {/* RingProgress step indicator */}
        <View
          testID="progress-indicator"
          style={styles.progressWrapper}
        >
          <RingProgress
            value={ringValue}
            size={36}
            strokeWidth={4}
            variant="sage"
            accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}
          />
        </View>

        {/* Skip link */}
        {onSkip ? (
          <TouchableOpacity
            testID="skip-link"
            style={styles.skipLink}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip this question"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.skipText, { color: palette.warm[400] }]}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Bracket step label */}
        <BracketLabel variant="muted" style={styles.stepBracket}>
          {`STEP ${currentStep} OF ${totalSteps}`}
        </BracketLabel>

        {/* Question */}
        <Text
          testID="question-text"
          accessibilityRole="header"
          style={[styles.question, { color: palette.warm[50] }]}
        >
          {question}
        </Text>

        {/* Options */}
        <View
          testID="options-list"
          accessibilityRole="radiogroup"
          style={styles.optionsList}
        >
          {options.map((option) => {
            const isSelected = activeId === option.id;
            const sublabel = optionsSublabels?.[option.id];

            return (
              <TouchableOpacity
                key={option.id}
                testID={`option-${option.id}`}
                style={styles.optionTouchable}
                onPress={() => handleSelect(option.id)}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ selected: isSelected }}
                activeOpacity={0.8}
                hitSlop={{ top: 4, bottom: 4, left: 0, right: 0 }}
              >
                <GlassCard
                  style={[
                    styles.optionCard,
                    isSelected && {
                      borderColor: palette.sage[300],
                      borderWidth: 1.5,
                      backgroundColor: `${palette.sage[300]}0F`,
                    },
                  ]}
                  radius={14}
                >
                  <View style={styles.optionInner}>
                    {/* Radio circle */}
                    <View
                      testID={`radio-circle-${option.id}`}
                      style={[
                        styles.radioCircle,
                        isSelected
                          ? {
                              backgroundColor: palette.sage[300],
                              borderColor: palette.sage[300],
                            }
                          : {
                              backgroundColor: "transparent",
                              borderColor: palette.warm[500],
                            },
                      ]}
                    >
                      {isSelected && (
                        <AppIcon
                          name="check"
                          size={12}
                          color={palette.midnight[950]}
                        />
                      )}
                    </View>

                    {/* Labels */}
                    <View style={styles.optionLabels}>
                      <Text
                        style={[styles.optionLabel, { color: palette.warm[50] }]}
                      >
                        {option.label}
                      </Text>
                      {sublabel ? (
                        <Text
                          testID={`sublabel-${option.id}`}
                          style={[
                            styles.optionSublabel,
                            { color: palette.warm[400] },
                          ]}
                        >
                          {sublabel}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.bottomArea}>
        <Button
          testID="continue-button"
          label="Continue"
          variant="primary"
          fullWidth
          disabled={!isContinueEnabled}
          onPress={handleContinue}
          accessibilityLabel="Continue to next question"
          accessibilityState={{ disabled: !isContinueEnabled }}
          style={{
            ...styles.continueButton,
            backgroundColor: isContinueEnabled
              ? palette.sage[500]
              : palette.midnight[700],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />
      </View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bottomArea: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  continueButton: {
    borderRadius: 28,
    minHeight: 56,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  optionCard: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionInner: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  optionLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 20,
  },
  optionLabels: {
    flex: 1,
  },
  optionSublabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  optionTouchable: {
    marginBottom: 10,
    minHeight: 56,
  },
  optionsList: {
    paddingTop: 8,
  },
  progressWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  question: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 16,
    marginTop: 20,
  },
  radioCircle: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    flexShrink: 0,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  skipLink: {
    alignItems: "flex-end",
    height: 44,
    justifyContent: "center",
    minWidth: 44,
    paddingHorizontal: 4,
  },
  skipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  stepBracket: {
    marginBottom: 4,
  },
});

export default AssessmentQuestionScreen;
