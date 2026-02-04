/**
 * GoalSelectionScreen Component
 * @description First step of new exercise wizard with 2-column goal card grid,
 *   radio selection, step indicator, and continue button
 * @task Task 3.12.3: Goal Selection Screen (Screen 106)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface GoalOption {
  id: string;
  label: string;
  icon: string;
}

interface GoalSelectionScreenProps {
  goals: GoalOption[];
  selectedGoalId: string | null;
  stepLabel: string;
  onBack: () => void;
  onGoalSelect: (id: string) => void;
  onContinue: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  cardBg: palette.background.secondary,
  selectedGreen: palette.accent.green,
  continueBg: palette.primary.gold,
  textSecondary: palette.text.secondary,
  stepIndicator: palette.accent.green,
  radioBorder: palette.opacity.white40,
  dotInactive: palette.opacity.white30,
} as const;

export function GoalSelectionScreen({
  goals,
  selectedGoalId,
  stepLabel,
  onBack,
  onGoalSelect,
  onContinue,
}: GoalSelectionScreenProps): React.ReactElement {
  return (
    <View testID="goal-selection-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u263E"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Exercise</Text>
        <View style={styles.headerSpacer} />
        <Text testID="step-indicator" style={styles.stepIndicator}>
          {stepLabel}
        </Text>
      </View>

      {/* Question Title */}
      <Text testID="question-title" style={styles.questionTitle}>
        What's your mindful exercise goal?
      </Text>

      {/* Goal Grid */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View testID="goal-grid" style={styles.goalGrid}>
          {goals.map((goal) => {
            const isSelected = goal.id === selectedGoalId;
            return (
              <TouchableOpacity
                key={goal.id}
                testID={`goal-card-${goal.id}`}
                style={[
                  styles.goalCard,
                  isSelected
                    ? styles.goalCardSelected
                    : styles.goalCardUnselected,
                ]}
                onPress={() => onGoalSelect(goal.id)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${goal.label}`}
              >
                {/* Radio Indicator */}
                <View
                  testID={`radio-${goal.id}`}
                  style={[styles.radio, isSelected && styles.radioSelected]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>

                {/* Goal Icon */}
                <Text testID={`goal-icon-${goal.id}`} style={styles.goalIcon}>
                  {goal.icon}
                </Text>

                {/* Goal Label */}
                <Text
                  style={[
                    styles.goalLabel,
                    isSelected
                      ? styles.goalLabelSelected
                      : styles.goalLabelUnselected,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>Continue {"\u2192"}</Text>
        </TouchableOpacity>

        {/* Progress Dots */}
        <View testID="progress-dots" style={styles.progressDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: colors.continueBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  continueText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  dot: {
    backgroundColor: colors.dotInactive,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: colors.white,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  goalCard: {
    borderRadius: 16,
    padding: 16,
    width: "48%",
  },
  goalCardSelected: {
    backgroundColor: colors.selectedGreen,
  },
  goalCardUnselected: {
    backgroundColor: colors.cardBg,
  },
  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  goalIcon: {
    fontSize: 36,
    marginTop: 16,
    textAlign: "center",
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },
  goalLabelSelected: {
    color: colors.background,
  },
  goalLabelUnselected: {
    color: colors.white,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressDots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  questionTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  radio: {
    borderColor: colors.radioBorder,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    width: 24,
  },
  radioInner: {
    backgroundColor: colors.background,
    borderRadius: 6,
    height: 12,
    left: 4,
    position: "absolute",
    top: 4,
    width: 12,
  },
  radioSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  scrollArea: {
    flex: 1,
    marginTop: 24,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  stepIndicator: {
    color: colors.stepIndicator,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default GoalSelectionScreen;
