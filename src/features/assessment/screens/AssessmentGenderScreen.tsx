/**
 * AssessmentGenderScreen Component
 * @description Gender selection assessment screen with illustrated cards
 * @task Task 3.4.3: Assessment Gender Screen (Screen 27)
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Gender = "male" | "female";

interface AssessmentGenderScreenProps {
  currentStep: number;
  totalSteps: number;
  onContinue: (gender: Gender | null) => void;
  onSkip: () => void;
  onBack?: () => void;
}

export function AssessmentGenderScreen({
  currentStep,
  totalSteps,
  onContinue,
  onSkip,
  onBack,
}: AssessmentGenderScreenProps): React.ReactElement {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const progress = currentStep / totalSteps;

  const handleContinue = () => {
    onContinue(selectedGender);
  };

  return (
    <View testID="assessment-gender-screen" style={styles.container}>
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
        <Text style={styles.questionText}>What's your official gender?</Text>
      </View>

      {/* Gender Cards */}
      <View style={styles.cardsContainer}>
        {/* Male Card */}
        <TouchableOpacity
          testID="gender-card-male"
          style={[
            styles.genderCard,
            selectedGender === "male" && styles.genderCardSelected,
          ]}
          onPress={() => setSelectedGender("male")}
          accessibilityRole="radio"
          accessibilityState={{ selected: selectedGender === "male" }}
          accessibilityLabel="Select male gender"
        >
          <Text style={styles.genderLabel}>I am Male</Text>
          <View testID="male-illustration" style={styles.illustration}>
            <View style={styles.personHead} />
            <View style={styles.personBody} />
            <View style={styles.personBeard} />
          </View>
          <Text testID="male-symbol" style={styles.genderSymbol}>
            ♂
          </Text>
        </TouchableOpacity>

        {/* Female Card */}
        <TouchableOpacity
          testID="gender-card-female"
          style={[
            styles.genderCard,
            styles.genderCardFemale,
            selectedGender === "female" && styles.genderCardSelected,
          ]}
          onPress={() => setSelectedGender("female")}
          accessibilityRole="radio"
          accessibilityState={{ selected: selectedGender === "female" }}
          accessibilityLabel="Select female gender"
        >
          <Text style={styles.genderLabel}>I am Female</Text>
          <View testID="female-illustration" style={styles.illustration}>
            <View style={[styles.personHead, styles.personHeadFemale]} />
            <View style={[styles.personBody, styles.personBodyFemale]} />
            <View style={styles.personHair} />
          </View>
          <Text testID="female-symbol" style={styles.genderSymbol}>
            ♀
          </Text>
        </TouchableOpacity>
      </View>

      {/* Skip Button */}
      <TouchableOpacity
        testID="skip-button"
        style={styles.skipButton}
        onPress={onSkip}
        accessibilityRole="button"
        accessibilityLabel="Skip this question"
      >
        <Text style={styles.skipButtonText}>Prefer to skip, thanks</Text>
        <Text style={styles.skipButtonIcon}>✕</Text>
      </TouchableOpacity>

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
  cardsContainer: {
    flex: 1,
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
  genderCard: {
    backgroundColor: "#9AAD5C",
    borderRadius: 24,
    height: 140,
    marginBottom: 16,
    overflow: "hidden",
    padding: 16,
    position: "relative",
  },
  genderCardFemale: {
    backgroundColor: "#E8853A",
  },
  genderCardSelected: {
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  genderLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  genderSymbol: {
    bottom: 16,
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 32,
    left: 16,
    position: "absolute",
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
  illustration: {
    alignItems: "center",
    position: "absolute",
    right: 24,
    top: "50%",
    transform: [{ translateY: -30 }],
  },
  personBeard: {
    backgroundColor: "#3D2E23",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: 10,
    marginTop: -5,
    width: 20,
  },
  personBody: {
    backgroundColor: "#4A9E8C",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 30,
    width: 40,
  },
  personBodyFemale: {
    backgroundColor: "#E8853A",
  },
  personHair: {
    backgroundColor: "#3D2E23",
    borderRadius: 20,
    height: 40,
    position: "absolute",
    top: -5,
    width: 40,
  },
  personHead: {
    backgroundColor: "#C4A574",
    borderRadius: 20,
    height: 35,
    marginBottom: 4,
    width: 35,
  },
  personHeadFemale: {
    zIndex: 1,
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
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  questionText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  skipButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#9AAD5C",
    borderRadius: 24,
    flexDirection: "row",
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipButtonIcon: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 8,
  },
  skipButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  stepCounter: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
});

export default AssessmentGenderScreen;
