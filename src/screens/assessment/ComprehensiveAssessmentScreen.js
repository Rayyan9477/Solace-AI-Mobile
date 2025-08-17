import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions,
  Slider,
} from "react-native";

import { MentalHealthIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width, height } = Dimensions.get("window");

// Assessment questions and options
const ASSESSMENT_STEPS = [
  {
    id: 1,
    title: "What's your health goal for today?",
    type: "single_choice",
    options: [
      { id: "decrease_anxiety", label: "Decrease my Anxiety", icon: "🧘" },
      { id: "feeling_happy", label: "I want to be feeling happy", icon: "😊" },
      { id: "reduce_stress", label: "I want to reduce stress", icon: "💆" },
      {
        id: "cure_insomnia",
        label: "I am trying to cure my insomnia",
        icon: "😴",
      },
    ],
    backgroundColor: (theme) => (theme.isDark ? "#2E5234" : "#E8F5E8"),
  },
  {
    id: 2,
    title: "What's your official gender?",
    type: "single_choice",
    options: [
      { id: "male", label: "Male", icon: "👨" },
      { id: "female", label: "Female", icon: "👩" },
      { id: "non_binary", label: "Non-binary", icon: "🏳️‍⚧️" },
      { id: "prefer_not_to_say", label: "Prefer not to say", icon: "❓" },
    ],
    backgroundColor: (theme) => (theme.isDark ? "#4A2E1A" : "#FFF2E6"),
  },
  {
    id: 3,
    title: "What's your age?",
    type: "number_input",
    placeholder: "18",
    backgroundColor: (theme) => (theme.isDark ? "#2E4A2E" : "#E8F5E8"),
  },
  {
    id: 4,
    title: "What's your weight?",
    type: "weight_input",
    placeholder: "128 lb",
    backgroundColor: (theme) => (theme.isDark ? "#4A2E1A" : "#FFF8E6"),
  },
  {
    id: 5,
    title: "How would you describe your mood?",
    type: "mood_selection",
    options: [
      { id: "very_sad", emoji: "😢", label: "Very Sad", color: "#FF6B6B" },
      { id: "sad", emoji: "😞", label: "Sad", color: "#FF8E8E" },
      { id: "neutral", emoji: "😐", label: "Neutral", color: "#FFD93D" },
      { id: "happy", emoji: "😊", label: "Happy", color: "#6BCF7F" },
      { id: "very_happy", emoji: "😄", label: "Very Happy", color: "#4ECDC4" },
    ],
    backgroundColor: (theme) => (theme.isDark ? "#3A2A1A" : "#FFF8E6"),
  },
  {
    id: 6,
    title: "Have you sought professional help before?",
    type: "yes_no_maybe",
    options: [
      { id: "yes", label: "Yes", color: "#4CAF50" },
      { id: "no", label: "No", color: "#FF5722" },
      { id: "maybe", label: "Maybe", color: "#FF9800" },
    ],
    backgroundColor: (theme) => (theme.isDark ? "#2A2A2A" : "#F5F5F5"),
  },
  {
    id: 7,
    title: "Are you experiencing any physical distress?",
    type: "multiple_choice",
    options: [
      { id: "headaches", label: "Headaches" },
      { id: "muscle_tension", label: "Muscle tension" },
      { id: "fatigue", label: "Fatigue" },
      { id: "sleep_issues", label: "Sleep issues" },
      { id: "digestive_issues", label: "Digestive issues" },
      { id: "none", label: "None of the above" },
    ],
    backgroundColor: (theme) => (theme.isDark ? "#2E5234" : "#E8F5E8"),
  },
  {
    id: 8,
    title: "How would you rate your sleep quality?",
    type: "rating_scale",
    scale: { min: 1, max: 10, step: 1 },
    labels: ["Poor", "Excellent"],
    backgroundColor: (theme) => (theme.isDark ? "#4A2E1A" : "#FFF2E6"),
  },
  {
    id: 9,
    title: "Are you taking any medications?",
    type: "medication_input",
    backgroundColor: (theme) => (theme.isDark ? "#2A2A2A" : "#F5F5F5"),
  },
  {
    id: 10,
    title: "Please specify your medical conditions",
    type: "multiple_choice",
    options: [
      { id: "anxiety", label: "Anxiety disorders" },
      { id: "depression", label: "Depression" },
      { id: "bipolar", label: "Bipolar disorder" },
      { id: "adhd", label: "ADHD" },
      { id: "ptsd", label: "PTSD" },
      { id: "eating_disorders", label: "Eating disorders" },
      { id: "none", label: "None" },
    ],
    backgroundColor: (theme) => (theme.isDark ? "#3A2A4A" : "#F5F0FF"),
  },
  {
    id: 11,
    title: "Do you have other mental health symptoms?",
    type: "multiple_choice",
    options: [
      { id: "panic_attacks", label: "Panic attacks" },
      { id: "mood_swings", label: "Mood swings" },
      { id: "concentration", label: "Difficulty concentrating" },
      { id: "social_anxiety", label: "Social anxiety" },
      { id: "intrusive_thoughts", label: "Intrusive thoughts" },
      { id: "none", label: "None" },
    ],
    backgroundColor: (theme) => (theme.isDark ? "#2E4A2E" : "#E8F5E8"),
  },
  {
    id: 12,
    title: "How would you rate your stress level?",
    type: "rating_scale",
    scale: { min: 1, max: 5, step: 1 },
    labels: ["Very Low", "Very High"],
    backgroundColor: (theme) => (theme.isDark ? "#4A2E1A" : "#FFF8E6"),
  },
  {
    id: 13,
    title: "AI Sound Analysis",
    type: "sound_analysis",
    subtitle:
      "This feature can analyze your voice patterns to provide insights into your emotional state.",
    backgroundColor: (theme) => (theme.isDark ? "#2A3A2A" : "#E8F5E8"),
  },
  {
    id: 14,
    title: "Expression Analysis",
    type: "expression_analysis",
    subtitle:
      "Our AI can analyze facial expressions to better understand your current emotional state.",
    backgroundColor: (theme) => (theme.isDark ? "#3A2A1A" : "#FFF8E6"),
  },
  {
    id: 15,
    title: "Assessment Complete!",
    type: "results",
    backgroundColor: (theme) => (theme.isDark ? "#2A2A2A" : "#F5F5F5"),
  },
];

const ComprehensiveAssessmentScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentStepData = ASSESSMENT_STEPS.find(
    (step) => step.id === currentStep,
  );
  const progress = currentStep / ASSESSMENT_STEPS.length;

  useEffect(() => {
    animateStepTransition();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const animateStepTransition = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswer = (answerData) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep]: answerData,
    }));
  };

  const handleNext = () => {
    if (currentStep < ASSESSMENT_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const completeAssessment = () => {
    navigation.navigate("AssessmentResults", { answers });
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View
        style={[
          styles.progressBackground,
          {
            backgroundColor: theme.isDark
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.1)",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: theme.isDark ? "#8B4513" : "#CD853F",
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.progressText,
          { color: theme.isDark ? "#FFFFFF" : "#2D3436" },
        ]}
      >
        {currentStep} of {ASSESSMENT_STEPS.length}
      </Text>
    </View>
  );

  const renderSingleChoice = () => (
    <View style={styles.optionsContainer}>
      {currentStepData.options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.optionButton,
            {
              backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC",
              borderColor:
                answers[currentStep]?.value === option.id
                  ? "#90CDB0"
                  : "transparent",
            },
          ]}
          onPress={() => {
            handleAnswer({ value: option.id, label: option.label });
            setTimeout(handleNext, 300);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text
              style={[
                styles.optionLabel,
                { color: theme.isDark ? "#FFFFFF" : "#2D3748" },
              ]}
            >
              {option.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderNumberInput = () => (
    <View style={styles.inputContainer}>
      <View style={styles.numberInputWrapper}>
        <TextInput
          style={[
            styles.numberInput,
            {
              backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC",
              color: theme.isDark ? "#FFFFFF" : "#2D3748",
            },
          ]}
          placeholder={currentStepData.placeholder}
          placeholderTextColor={theme.isDark ? "#A0AEC0" : "#718096"}
          value={answers[currentStep]?.value || ""}
          onChangeText={(value) => handleAnswer({ value })}
          keyboardType="numeric"
          textAlign="center"
          fontSize={48}
          fontWeight="bold"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: theme.isDark ? "#8B4513" : "#CD853F" },
        ]}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMoodSelection = () => (
    <View style={styles.moodContainer}>
      <View style={styles.moodGrid}>
        {currentStepData.options.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodOption,
              {
                backgroundColor:
                  answers[currentStep]?.value === mood.id
                    ? mood.color
                    : theme.isDark
                      ? "#4A5568"
                      : "#F7FAFC",
                borderColor:
                  answers[currentStep]?.value === mood.id
                    ? mood.color
                    : "transparent",
              },
            ]}
            onPress={() => {
              handleAnswer({
                value: mood.id,
                emoji: mood.emoji,
                label: mood.label,
              });
              setTimeout(handleNext, 300);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.moodLabel,
                {
                  color:
                    answers[currentStep]?.value === mood.id
                      ? "#FFFFFF"
                      : theme.isDark
                        ? "#FFFFFF"
                        : "#2D3748",
                },
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMultipleChoice = () => (
    <View style={styles.optionsContainer}>
      {currentStepData.options.map((option) => {
        const isSelected = answers[currentStep]?.value?.includes(option.id);

        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.multiOptionButton,
              {
                backgroundColor: isSelected
                  ? "#90CDB0"
                  : theme.isDark
                    ? "#4A5568"
                    : "#F7FAFC",
                borderColor: isSelected ? "#90CDB0" : "transparent",
              },
            ]}
            onPress={() => {
              const currentValues = answers[currentStep]?.value || [];
              let newValues;

              if (option.id === "none") {
                newValues = isSelected ? [] : ["none"];
              } else {
                newValues = isSelected
                  ? currentValues.filter((v) => v !== option.id)
                  : [...currentValues.filter((v) => v !== "none"), option.id];
              }

              handleAnswer({ value: newValues });
            }}
            activeOpacity={0.8}
          >
            <View style={styles.checkboxContainer}>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                    borderColor: isSelected
                      ? "#FFFFFF"
                      : theme.isDark
                        ? "#FFFFFF"
                        : "#2D3748",
                  },
                ]}
              >
                {isSelected && (
                  <Text style={[styles.checkmark, { color: "#90CDB0" }]}>
                    ✓
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.multiOptionLabel,
                  {
                    color: isSelected
                      ? "#FFFFFF"
                      : theme.isDark
                        ? "#FFFFFF"
                        : "#2D3748",
                  },
                ]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: theme.isDark ? "#8B4513" : "#CD853F" },
        ]}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRatingScale = () => {
    const [rating, setRating] = useState(
      answers[currentStep]?.value || currentStepData.scale.min,
    );

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.ratingDisplay}>
          <Text
            style={[
              styles.ratingNumber,
              { color: theme.isDark ? "#FFFFFF" : "#2D3748" },
            ]}
          >
            {rating}
          </Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={currentStepData.scale.min}
            maximumValue={currentStepData.scale.max}
            step={currentStepData.scale.step}
            value={rating}
            onValueChange={(value) => {
              setRating(value);
              handleAnswer({ value });
            }}
            minimumTrackTintColor="#90CDB0"
            maximumTrackTintColor={
              theme.isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"
            }
            thumbStyle={{ backgroundColor: "#90CDB0", width: 24, height: 24 }}
          />

          <View style={styles.sliderLabels}>
            <Text
              style={[
                styles.sliderLabel,
                { color: theme.isDark ? "#B2BEB5" : "#636E72" },
              ]}
            >
              {currentStepData.labels[0]}
            </Text>
            <Text
              style={[
                styles.sliderLabel,
                { color: theme.isDark ? "#B2BEB5" : "#636E72" },
              ]}
            >
              {currentStepData.labels[1]}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: theme.isDark ? "#8B4513" : "#CD853F" },
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAnalysisScreen = (type) => (
    <View style={styles.analysisContainer}>
      <View style={styles.analysisIcon}>
        <View style={[styles.analysisCircle, { backgroundColor: "#90CDB0" }]}>
          <Text style={styles.analysisEmoji}>
            {type === "sound" ? "🎤" : "📷"}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.analysisSubtitle,
          { color: theme.isDark ? "#B2BEB5" : "#636E72" },
        ]}
      >
        {currentStepData.subtitle}
      </Text>

      <TouchableOpacity
        style={[
          styles.analysisButton,
          { backgroundColor: isAnalyzing ? "#A0AEC0" : "#90CDB0" },
        ]}
        onPress={() => {
          setIsAnalyzing(true);
          setTimeout(() => {
            setIsAnalyzing(false);
            handleAnswer({ value: "completed", type });
            handleNext();
          }, 3000);
        }}
        disabled={isAnalyzing}
        activeOpacity={0.8}
      >
        <Text style={styles.analysisButtonText}>
          {isAnalyzing
            ? `Analyzing ${type}...`
            : `Start ${type === "sound" ? "Voice" : "Camera"} Analysis`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.skipButtonText,
            { color: theme.isDark ? "#B2BEB5" : "#636E72" },
          ]}
        >
          Skip this step
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderResults = () => (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsIcon}>
        <View style={[styles.resultsCircle, { backgroundColor: "#4CAF50" }]}>
          <Text style={styles.resultsEmoji}>✅</Text>
        </View>
      </View>

      <Text
        style={[
          styles.resultsTitle,
          { color: theme.isDark ? "#FFFFFF" : "#2D3748" },
        ]}
      >
        Assessment Complete!
      </Text>

      <Text
        style={[
          styles.resultsSubtitle,
          { color: theme.isDark ? "#B2BEB5" : "#636E72" },
        ]}
      >
        Thank you for completing the mental health assessment. Your personalized
        insights are being prepared.
      </Text>

      <TouchableOpacity
        style={[
          styles.viewResultsButton,
          { backgroundColor: theme.isDark ? "#8B4513" : "#CD853F" },
        ]}
        onPress={() => navigation.navigate("MainApp")}
        activeOpacity={0.8}
      >
        <Text style={styles.viewResultsButtonText}>View My Results →</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStepData.type) {
      case "single_choice":
        return renderSingleChoice();
      case "number_input":
      case "weight_input":
        return renderNumberInput();
      case "mood_selection":
        return renderMoodSelection();
      case "yes_no_maybe":
        return renderSingleChoice();
      case "multiple_choice":
      case "medication_input":
        return renderMultipleChoice();
      case "rating_scale":
        return renderRatingScale();
      case "sound_analysis":
        return renderAnalysisScreen("sound");
      case "expression_analysis":
        return renderAnalysisScreen("expression");
      case "results":
        return renderResults();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={[
          currentStepData.backgroundColor(theme),
          currentStepData.backgroundColor(theme),
        ]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.backIcon,
                { color: theme.isDark ? "#FFFFFF" : "#2D3436" },
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>

          {renderProgressBar()}
        </View>

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[
                styles.questionTitle,
                { color: theme.isDark ? "#FFFFFF" : "#2D3436" },
              ]}
            >
              {currentStepData.title}
            </Text>

            {currentStepData.subtitle && (
              <Text
                style={[
                  styles.questionSubtitle,
                  { color: theme.isDark ? "#B2BEB5" : "#636E72" },
                ]}
              >
                {currentStepData.subtitle}
              </Text>
            )}

            {renderCurrentStep()}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
  },
  progressBackground: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
  },
  questionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
    alignSelf: "center",
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  inputContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  numberInputWrapper: {
    marginBottom: 40,
  },
  numberInput: {
    width: 200,
    height: 120,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 48,
    fontWeight: "bold",
  },
  moodContainer: {
    marginTop: 20,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moodOption: {
    width: "48%",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  multiOptionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 12,
    fontWeight: "bold",
  },
  multiOptionLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  ratingContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  ratingDisplay: {
    marginBottom: 40,
  },
  ratingNumber: {
    fontSize: 80,
    fontWeight: "bold",
  },
  sliderContainer: {
    width: "100%",
    marginBottom: 40,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  analysisContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  analysisIcon: {
    marginBottom: 32,
  },
  analysisCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  analysisEmoji: {
    fontSize: 40,
  },
  analysisSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 280,
  },
  analysisButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 20,
  },
  analysisButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultsContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  resultsIcon: {
    marginBottom: 32,
  },
  resultsCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsEmoji: {
    fontSize: 50,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  resultsSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 300,
  },
  viewResultsButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  viewResultsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ComprehensiveAssessmentScreen;
