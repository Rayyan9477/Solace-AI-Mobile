/**
 * AssessmentOtherSymptomsScreen Component
 * @description Symptoms input assessment screen with tag input and suggestions
 * @task Task 3.4.7: Assessment Other Symptoms Screen (Screen 36)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { palette } from "../../../shared/theme";

interface AssessmentOtherSymptomsScreenProps {
  currentStep: number;
  totalSteps: number;
  onContinue: (symptoms: string[]) => void;
  onBack?: () => void;
}

const MAX_TAGS = 10;

const COMMON_SYMPTOMS = [
  "Depressed",
  "Anxious",
  "Angry",
  "Hopeless",
  "Irritable",
  "Lonely",
];

export function AssessmentOtherSymptomsScreen({
  currentStep,
  totalSteps,
  onContinue,
  onBack,
}: AssessmentOtherSymptomsScreenProps): React.ReactElement {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const progress = currentStep / totalSteps;

  const addSymptom = (symptom: string) => {
    const trimmedSymptom = symptom.trim();
    if (
      trimmedSymptom &&
      symptoms.length < MAX_TAGS &&
      !symptoms.some((s) => s.toLowerCase() === trimmedSymptom.toLowerCase())
    ) {
      setSymptoms([...symptoms, trimmedSymptom]);
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptomToRemove));
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      addSymptom(inputValue);
      setInputValue("");
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    addSymptom(suggestion);
  };

  const handleContinue = () => {
    onContinue(symptoms);
  };

  const isSymptomAdded = (symptom: string) =>
    symptoms.some((s) => s.toLowerCase() === symptom.toLowerCase());

  return (
    <View testID="assessment-other-symptoms-screen" style={styles.container}>
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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>
            Do you have other mental health symptoms?
          </Text>
        </View>

        {/* Symptoms Input Area */}
        <View testID="symptoms-input-area" style={styles.inputArea}>
          <View style={styles.tagsContainer}>
            {symptoms.map((symptom) => (
              <View
                key={symptom}
                testID={`symptom-tag-${symptom.toLowerCase()}`}
                style={styles.tag}
              >
                <Text style={styles.tagText}>{symptom}</Text>
                <TouchableOpacity
                  testID={`symptom-tag-${symptom.toLowerCase()}-remove`}
                  onPress={() => removeSymptom(symptom)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${symptom}`}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.tagRemove}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TextInput
              testID="symptom-text-input"
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleInputSubmit}
              placeholder={symptoms.length === 0 ? "Type symptoms..." : ""}
              placeholderTextColor={palette.gray[500]}
              returnKeyType="done"
              editable={symptoms.length < MAX_TAGS}
            />
          </View>
          <View testID="tag-counter" style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {symptoms.length}/{MAX_TAGS}
            </Text>
          </View>
        </View>

        {/* Suggestions Section */}
        <View testID="suggestions-section" style={styles.suggestionsSection}>
          <Text style={styles.suggestionsLabel}>Most Common:</Text>
          <View style={styles.suggestionsContainer}>
            {COMMON_SYMPTOMS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                testID={`suggestion-chip-${suggestion.toLowerCase()}`}
                style={[
                  styles.suggestionChip,
                  isSymptomAdded(suggestion) && styles.suggestionChipSelected,
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
                accessibilityRole="button"
                accessibilityLabel={`Add ${suggestion}`}
                accessibilityState={{ selected: isSymptomAdded(suggestion) }}
                disabled={isSymptomAdded(suggestion) || symptoms.length >= MAX_TAGS}
              >
                <Text
                  style={[
                    styles.suggestionChipText,
                    isSymptomAdded(suggestion) && styles.suggestionChipTextSelected,
                  ]}
                >
                  {suggestion}
                </Text>
                {!isSymptomAdded(suggestion) && (
                  <Text style={styles.suggestionChipAdd}>+</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

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
  content: {
    flex: 1,
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
  counterContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  counterText: {
    color: palette.gray[400],
    fontSize: 12,
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
  inputArea: {
    borderColor: palette.olive[500],
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    marginHorizontal: 24,
    minHeight: 120,
    padding: 16,
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
  stepCounter: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 2,
  },
  suggestionChip: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 20,
    flexDirection: "row",
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionChipAdd: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  suggestionChipSelected: {
    backgroundColor: palette.brown[700],
    opacity: 0.6,
  },
  suggestionChipText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "500",
  },
  suggestionChipTextSelected: {
    color: palette.gray[400],
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  suggestionsLabel: {
    color: palette.gray[400],
    fontSize: 14,
    marginBottom: 12,
  },
  suggestionsSection: {
    paddingHorizontal: 24,
  },
  tag: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagRemove: {
    color: palette.gray[400],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 6,
  },
  tagText: {
    color: palette.white,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  textInput: {
    color: palette.white,
    flex: 1,
    fontSize: 14,
    minWidth: 100,
    paddingVertical: 4,
  },
});

export default AssessmentOtherSymptomsScreen;
