/**
 * AssessmentQuestionScreen Component
 * @description Reusable assessment question screen with single-select options
 * @task Task 3.4.2: Assessment Question Screen (Screens 26-35)
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

interface QuestionOption {
  id: string;
  icon: string;
  label: string;
}

interface AssessmentQuestionScreenProps {
  currentStep: number;
  totalSteps: number;
  question: string;
  options: QuestionOption[];
  onContinue: (selectedId: string) => void;
  onBack?: () => void;
}

export function AssessmentQuestionScreen({
  currentStep,
  totalSteps,
  question,
  options,
  onContinue,
  onBack,
}: AssessmentQuestionScreenProps): React.ReactElement {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedOption) {
      onContinue(selectedOption);
    }
  };

  const progress = currentStep / totalSteps;

  return (
    <View testID="assessment-question-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {onBack && (
            <TouchableOpacity
              testID="back-button"
              style={styles.backButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backButtonIcon}>{"<"}</Text>
            </TouchableOpacity>
          )}
          {!onBack && <View style={styles.backButtonPlaceholder} />}
        </View>

        {/* Progress Indicator */}
        <View testID="progress-indicator" style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <View
              style={[
                styles.progressFill,
                { transform: [{ rotate: `${progress * 360}deg` }] },
              ]}
            />
            <View style={styles.progressInner}>
              <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.headerTitle}>Assessment</Text>
          <Text style={styles.stepCounter}>
            {currentStep} of {totalSteps}
          </Text>
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionSection}>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {/* Options */}
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              testID={`option-${option.id}`}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedOption(option.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={option.label}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              <View
                testID={`radio-${option.id}`}
                style={[
                  styles.radioButton,
                  isSelected && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="continue-button"
          style={[
            styles.continueButton,
            !selectedOption && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedOption}
          accessibilityRole="button"
          accessibilityState={{ disabled: !selectedOption }}
          accessibilityLabel="Continue to next question"
        >
          <Text
            style={[
              styles.continueButtonText,
              !selectedOption && styles.continueButtonTextDisabled,
            ]}
          >
            Continue
          </Text>
          <Text
            style={[
              styles.continueButtonIcon,
              !selectedOption && styles.continueButtonTextDisabled,
            ]}
          >
            →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  backButtonPlaceholder: {
    width: 40,
  },
  buttonSection: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  continueButtonDisabled: {
    backgroundColor: "#3D2E23",
  },
  continueButtonIcon: {
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButtonTextDisabled: {
    color: "#64748B",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  headerLeft: {
    width: 60,
  },
  headerRight: {
    alignItems: "flex-end",
    width: 80,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  optionCard: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderColor: "#3D2E23",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionCardSelected: {
    backgroundColor: "#9AAD5C",
    borderColor: "#9AAD5C",
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionLabel: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  optionLabelSelected: {
    color: "#1C1410",
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressCircle: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    overflow: "hidden",
    width: 60,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressFill: {
    backgroundColor: "#9AAD5C",
    borderRadius: 30,
    height: 60,
    position: "absolute",
    right: 0,
    top: 0,
    width: 30,
  },
  progressInner: {
    alignItems: "center",
    backgroundColor: "#1C1410",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  progressText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  questionSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  radioButton: {
    borderColor: "#64748B",
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    width: 24,
  },
  radioButtonSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  stepCounter: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
});

export default AssessmentQuestionScreen;
