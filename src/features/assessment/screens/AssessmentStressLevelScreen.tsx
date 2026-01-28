/**
 * AssessmentStressLevelScreen Component
 * @description Stress level assessment screen with 1-5 scale selector
 * @task Task 3.4.6: Assessment Stress Level Screen (Screen 37)
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type StressLevel = 1 | 2 | 3 | 4 | 5;

interface AssessmentStressLevelScreenProps {
  currentStep: number;
  totalSteps: number;
  initialLevel?: StressLevel;
  onContinue: (level: StressLevel) => void;
  onBack?: () => void;
}

const STRESS_DESCRIPTIONS: Record<StressLevel, string> = {
  1: "You Are Completely Relaxed.",
  2: "You Are Slightly Stressed.",
  3: "You Are Moderately Stressed.",
  4: "You Are Very Stressed.",
  5: "You Are Extremely Stressed Out.",
};

const DEFAULT_LEVEL: StressLevel = 3;

export function AssessmentStressLevelScreen({
  currentStep,
  totalSteps,
  initialLevel = DEFAULT_LEVEL,
  onContinue,
  onBack,
}: AssessmentStressLevelScreenProps): React.ReactElement {
  const [selectedLevel, setSelectedLevel] = useState<StressLevel>(initialLevel);

  const progress = currentStep / totalSteps;

  const handleLevelSelect = (level: StressLevel) => {
    setSelectedLevel(level);
  };

  const handleContinue = () => {
    onContinue(selectedLevel);
  };

  const levels: StressLevel[] = [1, 2, 3, 4, 5];

  return (
    <View testID="assessment-stress-level-screen" style={styles.container}>
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
        </View>

        {/* Progress Indicator */}
        <View testID="progress-indicator" style={styles.progressContainer}>
          <View style={styles.progressCircle}>
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
        <Text style={styles.questionText}>How would you rate your stress level?</Text>
      </View>

      {/* Large Stress Number Display */}
      <View style={styles.largeNumberContainer}>
        <Text testID="large-stress-number" style={styles.largeNumber}>
          {selectedLevel}
        </Text>
      </View>

      {/* Stress Level Selector */}
      <View testID="stress-level-selector" style={styles.selectorContainer}>
        <View style={styles.selectorRow}>
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              testID={`stress-level-${level}`}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.levelButtonSelected,
              ]}
              onPress={() => handleLevelSelect(level)}
              accessibilityRole="button"
              accessibilityLabel={`Stress level ${level}`}
              accessibilityState={{ selected: selectedLevel === level }}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  selectedLevel === level && styles.levelButtonTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stress Description */}
      <View style={styles.descriptionContainer}>
        <Text testID="stress-description" style={styles.descriptionText}>
          {STRESS_DESCRIPTIONS[selectedLevel]}
        </Text>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to next question"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Text style={styles.continueButtonIcon}>→</Text>
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
  descriptionContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 24,
  },
  descriptionText: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
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
  largeNumber: {
    color: "#FFFFFF",
    fontSize: 120,
    fontWeight: "700",
  },
  largeNumberContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  levelButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 48,
  },
  levelButtonSelected: {
    backgroundColor: "#E8853A",
  },
  levelButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  levelButtonTextSelected: {
    color: "#FFFFFF",
  },
  progressCircle: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  progressContainer: {
    alignItems: "center",
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
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  selectorContainer: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  selectorRow: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepCounter: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
});

export default AssessmentStressLevelScreen;
