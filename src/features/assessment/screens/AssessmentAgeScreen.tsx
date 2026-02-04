/**
 * AssessmentAgeScreen Component
 * @description Age selection assessment screen with vertical picker
 * @task Task 3.4.4: Assessment Age Screen (Screen 28)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface AssessmentAgeScreenProps {
  currentStep: number;
  totalSteps: number;
  initialAge?: number;
  onContinue: (age: number) => void;
  onBack?: () => void;
}

const MIN_AGE = 13;
const MAX_AGE = 100;
const DEFAULT_AGE = 18;

export function AssessmentAgeScreen({
  currentStep,
  totalSteps,
  initialAge = DEFAULT_AGE,
  onContinue,
  onBack,
}: AssessmentAgeScreenProps): React.ReactElement {
  const [selectedAge, setSelectedAge] = useState(initialAge);

  const progress = currentStep / totalSteps;

  const handleIncrement = () => {
    if (selectedAge < MAX_AGE) {
      setSelectedAge(selectedAge + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedAge > MIN_AGE) {
      setSelectedAge(selectedAge - 1);
    }
  };

  const handleContinue = () => {
    onContinue(selectedAge);
  };

  // Get adjacent ages for display
  const getAdjacentAges = () => {
    return {
      above2: selectedAge + 2 <= MAX_AGE ? selectedAge + 2 : null,
      above1: selectedAge + 1 <= MAX_AGE ? selectedAge + 1 : null,
      below1: selectedAge - 1 >= MIN_AGE ? selectedAge - 1 : null,
      below2: selectedAge - 2 >= MIN_AGE ? selectedAge - 2 : null,
    };
  };

  const adjacentAges = getAdjacentAges();

  return (
    <View testID="assessment-age-screen" style={styles.container}>
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
        <Text style={styles.questionText}>What's your age?</Text>
      </View>

      {/* Age Picker */}
      <View testID="age-picker" style={styles.pickerContainer}>
        {/* Increment Button */}
        <TouchableOpacity
          testID="increment-button"
          style={styles.pickerButton}
          onPress={handleIncrement}
          accessibilityRole="button"
          accessibilityLabel="Increase age"
        >
          <Text style={styles.pickerButtonIcon}>▲</Text>
        </TouchableOpacity>

        {/* Age Display */}
        <View style={styles.ageDisplay}>
          {adjacentAges.above2 !== null && (
            <Text testID="age-above-2" style={[styles.adjacentAge, styles.farthestAge]}>
              {adjacentAges.above2}
            </Text>
          )}
          {adjacentAges.above1 !== null && (
            <Text testID="age-above-1" style={[styles.adjacentAge, styles.nearAge]}>
              {adjacentAges.above1}
            </Text>
          )}

          {/* Selected Age Pill */}
          <View testID="selected-age-pill" style={styles.selectedAgePill}>
            <Text testID="selected-age" style={styles.selectedAgeText}>
              {selectedAge}
            </Text>
          </View>

          {adjacentAges.below1 !== null && (
            <Text testID="age-below-1" style={[styles.adjacentAge, styles.nearAge]}>
              {adjacentAges.below1}
            </Text>
          )}
          {adjacentAges.below2 !== null && (
            <Text testID="age-below-2" style={[styles.adjacentAge, styles.farthestAge]}>
              {adjacentAges.below2}
            </Text>
          )}
        </View>

        {/* Decrement Button */}
        <TouchableOpacity
          testID="decrement-button"
          style={styles.pickerButton}
          onPress={handleDecrement}
          accessibilityRole="button"
          accessibilityLabel="Decrease age"
        >
          <Text style={styles.pickerButtonIcon}>▼</Text>
        </TouchableOpacity>
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
  adjacentAge: {
    color: palette.gray[400],
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  ageDisplay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  buttonSection: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: "100%",
  },
  continueButtonIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  farthestAge: {
    fontSize: 20,
    opacity: 0.3,
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
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  nearAge: {
    fontSize: 28,
    opacity: 0.5,
  },
  pickerButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  pickerButtonIcon: {
    color: palette.gray[400],
    fontSize: 24,
  },
  pickerContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  progressCircle: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
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
    backgroundColor: palette.brown[900],
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  progressText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600",
  },
  questionSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  questionText: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  selectedAgePill: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 40,
    justifyContent: "center",
    marginVertical: 16,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  selectedAgeText: {
    color: palette.white,
    fontSize: 64,
    fontWeight: "700",
  },
  stepCounter: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 2,
  },
});

export default AssessmentAgeScreen;
