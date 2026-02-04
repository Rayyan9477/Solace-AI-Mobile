/**
 * AssessmentExpressionAnalysisScreen Component
 * @description Expression analysis assessment screen with free text input
 * @task Task 3.4.9: Assessment Expression Analysis Screen (Screen 39)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface AssessmentExpressionAnalysisScreenProps {
  currentStep: number;
  totalSteps: number;
  onContinue: (text: string) => void;
  onBack?: () => void;
  onTextChange?: (text: string) => void;
  onVoiceInput?: () => void;
  initialText?: string;
}

const MAX_CHARACTERS = 250;

export function AssessmentExpressionAnalysisScreen({
  currentStep,
  totalSteps,
  onContinue,
  onBack,
  onTextChange,
  onVoiceInput,
  initialText = "",
}: AssessmentExpressionAnalysisScreenProps): React.ReactElement {
  const [text, setText] = useState(initialText);

  const progress = currentStep / totalSteps;
  const characterCount = text.length;

  const handleTextChange = (newText: string) => {
    const limitedText = newText.slice(0, MAX_CHARACTERS);
    setText(limitedText);
    onTextChange?.(limitedText);
  };

  const handleContinue = () => {
    onContinue(text);
  };

  const handleVoiceInput = () => {
    onVoiceInput?.();
  };

  return (
    <View
      testID="assessment-expression-analysis-screen"
      style={styles.container}
    >
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
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}%
              </Text>
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

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>Expression Analysis</Text>
        <Text style={styles.subtitle}>
          Freely write down anything that's on your mind. Solace AI is here to
          listen and understand how you're feeling.
        </Text>
      </View>

      {/* Text Input Area */}
      <View testID="text-input-area" style={styles.textInputArea}>
        <TextInput
          testID="expression-text-input"
          style={styles.textInput}
          value={text}
          onChangeText={handleTextChange}
          placeholder="Express your feelings, thoughts, or anything on your mind..."
          placeholderTextColor={palette.gray[500]}
          multiline={true}
          textAlignVertical="top"
          maxLength={MAX_CHARACTERS}
          accessibilityLabel="Expression text input"
        />
        <View testID="character-counter" style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {characterCount}/{MAX_CHARACTERS}
          </Text>
        </View>
      </View>

      {/* Voice Input Alternative */}
      <TouchableOpacity
        testID="voice-input-button"
        style={styles.voiceInputButton}
        onPress={handleVoiceInput}
        accessibilityRole="button"
        accessibilityLabel="Use voice input instead of typing"
      >
        <View style={styles.voiceIconContainer}>
          <Text style={styles.voiceIcon}>🎙</Text>
        </View>
        <Text style={styles.voiceInputText}>Use voice Instead</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Complete assessment"
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
    marginBottom: 24,
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
  screenTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  stepCounter: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 2,
  },
  subtitle: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  textInput: {
    color: palette.white,
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 150,
  },
  textInputArea: {
    borderColor: palette.olive[500],
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    marginBottom: 24,
    marginHorizontal: 24,
    maxHeight: 200,
    padding: 16,
  },
  titleSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  voiceIcon: {
    fontSize: 20,
  },
  voiceIconContainer: {
    marginRight: 8,
  },
  voiceInputButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 24,
    flexDirection: "row",
    marginBottom: 24,
    minHeight: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  voiceInputText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AssessmentExpressionAnalysisScreen;
