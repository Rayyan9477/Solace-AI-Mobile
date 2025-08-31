import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

const { width, height } = Dimensions.get("window");

// Assessment questions based on the design
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    title: "What's your health goal for today?",
    type: "selection",
    options: [
      {
        id: 1,
        text: "Improve my mental health",
        emoji: "🧠",
        color: "#27AE60",
      },
      { id: 2, text: "Track my mood better", emoji: "😊", color: "#E67E22" },
      {
        id: 3,
        text: "Reduce stress and anxiety",
        emoji: "😌",
        color: "#3498DB",
      },
      { id: 4, text: "Better sleep quality", emoji: "😴", color: "#9B59B6" },
      { id: 5, text: "Just checking in", emoji: "👋", color: "#F39C12" },
    ],
  },
  {
    id: 2,
    title: "What's your official gender?",
    type: "selection",
    character: "🧑‍⚕️",
    options: [
      { id: 1, text: "Male", emoji: "👨" },
      { id: 2, text: "Female", emoji: "👩" },
      { id: 3, text: "Non-binary", emoji: "🏳️‍⚧️" },
      { id: 4, text: "Prefer not to say", emoji: "🤐" },
    ],
  },
  {
    id: 3,
    title: "What's your age?",
    type: "number_selection",
    character: "🎂",
    options: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      text: `${(i + 1) * 5 + 10}`,
      range: `${(i + 1) * 5 + 10}-${(i + 1) * 5 + 14}`,
    })),
  },
  {
    id: 4,
    title: "What's your weight?",
    type: "weight_input",
    character: "⚖️",
    defaultValue: 128,
    unit: "lb",
  },
  {
    id: 5,
    title: "How would you describe your mood?",
    type: "mood_selection",
    options: [
      { id: 1, emoji: "😢", text: "Very Sad", color: "#E74C3C" },
      { id: 2, emoji: "😞", text: "Sad", color: "#F39C12" },
      { id: 3, emoji: "😐", text: "Neutral", color: "#95A5A6" },
      { id: 4, emoji: "😊", text: "Happy", color: "#2ECC71" },
      { id: 5, emoji: "😁", text: "Very Happy", color: "#27AE60" },
    ],
  },
  {
    id: 6,
    title: "Have you sought professional help before?",
    type: "yes_no",
    character: "👩‍⚕️",
    options: [
      { id: 1, text: "Yes", emoji: "✅" },
      { id: 2, text: "No", emoji: "❌" },
    ],
  },
  {
    id: 7,
    title: "Are you experiencing any physical distress?",
    type: "selection",
    subtitle: "This will help us track your progress over time",
    character: "🏥",
    options: [
      { id: 1, text: "Headaches", emoji: "🤕" },
      { id: 2, text: "Muscle tension", emoji: "💪" },
      { id: 3, text: "Fatigue", emoji: "😴" },
      { id: 4, text: "Stomach issues", emoji: "🤢" },
      { id: 5, text: "None of the above", emoji: "✅" },
    ],
  },
  {
    id: 8,
    title: "How would you rate your sleep quality?",
    type: "rating_scale",
    character: "😴",
    scale: {
      min: 1,
      max: 10,
      labels: ["Poor", "Excellent"],
    },
  },
  {
    id: 9,
    title: "Are you taking any medications?",
    type: "medication_selection",
    options: [
      { id: 1, text: "Antidepressants", emoji: "💊", color: "#3498DB" },
      { id: 2, text: "Anxiety medication", emoji: "💊", color: "#E67E22" },
      { id: 3, text: "Sleep aids", emoji: "💊", color: "#9B59B6" },
      { id: 4, text: "Other medication", emoji: "💊", color: "#95A5A6" },
      { id: 5, text: "No medications", emoji: "✅", color: "#27AE60" },
    ],
  },
  {
    id: 10,
    title: "Please specify your medications:",
    type: "text_input",
    placeholder: "List your current medications...",
    condition: (answers) => {
      const medAnswer = answers[8]; // Previous question
      return medAnswer && medAnswer.some((option) => option.id !== 5);
    },
  },
  {
    id: 11,
    title: "Do you have other mental health symptoms?",
    type: "multi_selection",
    options: [
      { id: 1, text: "Anxiety", emoji: "😰" },
      { id: 2, text: "Depression", emoji: "😞" },
      { id: 3, text: "PTSD", emoji: "💥" },
      { id: 4, text: "Bipolar disorder", emoji: "⚡" },
      { id: 5, text: "OCD", emoji: "🔄" },
      { id: 6, text: "Other", emoji: "❓" },
    ],
  },
  {
    id: 12,
    title: "How would you rate your stress level?",
    type: "stress_meter",
    scale: {
      min: 1,
      max: 5,
      labels: ["Very Low", "Low", "Medium", "High", "Very High"],
      colors: ["#27AE60", "#F39C12", "#E67E22", "#E74C3C", "#8E44AD"],
    },
  },
  {
    id: 13,
    title: "AI Sound Analysis",
    type: "sound_analysis",
    subtitle: "Dr. Freud would like to analyze your voice for stress patterns",
    character: "🔊",
  },
  {
    id: 14,
    title: "Expression Analysis",
    type: "expression_analysis",
    subtitle: "We'll analyze your current mood and expression",
    character: "😊",
    progress: 100,
  },
];

const DarkComprehensiveAssessmentScreen = ({
  navigation,
  onComplete = () => {},
}) => {
  const { isDarkMode } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentQuestionData = ASSESSMENT_QUESTIONS[currentQuestion];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = (currentQuestion + 1) / totalQuestions;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const goToNextQuestion = () => {
    if (isAnimating) return;

    // Check if current question should be skipped
    const nextIndex = currentQuestion + 1;
    if (nextIndex >= totalQuestions) {
      onComplete(answers);
      return;
    }

    const nextQuestion = ASSESSMENT_QUESTIONS[nextIndex];
    if (nextQuestion.condition && !nextQuestion.condition(answers)) {
      setCurrentQuestion(nextIndex + 1);
      return;
    }

    animateToQuestion(nextIndex);
  };

  const goToPreviousQuestion = () => {
    if (isAnimating || currentQuestion === 0) return;
    animateToQuestion(currentQuestion - 1);
  };

  const animateToQuestion = (questionIndex) => {
    setIsAnimating(true);

    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: questionIndex > currentQuestion ? -width : width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: questionIndex > currentQuestion ? width : -width,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentQuestion(questionIndex);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const renderQuestionContent = () => {
    const question = currentQuestionData;
    const currentAnswer = answers[currentQuestion];

    switch (question.type) {
      case "selection":
        return renderSelectionQuestion(question, currentAnswer);
      case "mood_selection":
        return renderMoodSelection(question, currentAnswer);
      case "rating_scale":
        return renderRatingScale(question, currentAnswer);
      case "weight_input":
        return renderWeightInput(question, currentAnswer);
      case "multi_selection":
        return renderMultiSelection(question, currentAnswer);
      case "stress_meter":
        return renderStressMeter(question, currentAnswer);
      case "sound_analysis":
        return renderSoundAnalysis(question, currentAnswer);
      case "expression_analysis":
        return renderExpressionAnalysis(question, currentAnswer);
      default:
        return renderSelectionQuestion(question, currentAnswer);
    }
  };

  const renderSelectionQuestion = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      {question.character && (
        <Text style={styles.questionCharacter}>{question.character}</Text>
      )}
      <Text style={styles.questionTitle}>{question.title}</Text>
      {question.subtitle && (
        <Text style={styles.questionSubtitle}>{question.subtitle}</Text>
      )}

      <View style={styles.optionsContainer}>
        {question.options?.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              currentAnswer?.id === option.id && styles.optionButtonSelected,
              option.color && { borderColor: option.color },
            ]}
            onPress={() => handleAnswer(option)}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  currentAnswer?.id === option.id && styles.optionTextSelected,
                ]}
              >
                {option.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMoodSelection = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      <Text style={styles.questionTitle}>{question.title}</Text>

      <View style={styles.moodContainer}>
        {question.options?.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.moodOption,
              currentAnswer?.id === option.id && [
                styles.moodOptionSelected,
                { backgroundColor: option.color },
              ],
            ]}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.moodEmoji}>{option.emoji}</Text>
            <Text
              style={[
                styles.moodText,
                currentAnswer?.id === option.id && styles.moodTextSelected,
              ]}
            >
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderRatingScale = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      <Text style={styles.questionCharacter}>{question.character}</Text>
      <Text style={styles.questionTitle}>{question.title}</Text>

      <View style={styles.ratingContainer}>
        <View style={styles.ratingLabels}>
          <Text style={styles.ratingLabel}>{question.scale.labels[0]}</Text>
          <Text style={styles.ratingLabel}>{question.scale.labels[1]}</Text>
        </View>

        <View style={styles.ratingScale}>
          {Array.from({ length: question.scale.max }, (_, i) => (
            <TouchableOpacity
              key={i + 1}
              style={[
                styles.ratingDot,
                currentAnswer === i + 1 && styles.ratingDotSelected,
              ]}
              onPress={() => handleAnswer(i + 1)}
            >
              <Text style={styles.ratingNumber}>{i + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderWeightInput = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      <Text style={styles.questionCharacter}>{question.character}</Text>
      <Text style={styles.questionTitle}>{question.title}</Text>

      <View style={styles.weightInputContainer}>
        <Text style={styles.weightValue}>
          {currentAnswer || question.defaultValue}
        </Text>
        <Text style={styles.weightUnit}>{question.unit}</Text>
      </View>

      <View style={styles.weightControls}>
        <TouchableOpacity
          style={styles.weightButton}
          onPress={() =>
            handleAnswer(
              Math.max(50, (currentAnswer || question.defaultValue) - 1),
            )
          }
        >
          <Text style={styles.weightButtonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.weightButton}
          onPress={() =>
            handleAnswer(
              Math.min(500, (currentAnswer || question.defaultValue) + 1),
            )
          }
        >
          <Text style={styles.weightButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMultiSelection = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      <Text style={styles.questionTitle}>{question.title}</Text>

      <View style={styles.optionsContainer}>
        {question.options?.map((option) => {
          const isSelected = currentAnswer?.some(
            (item) => item.id === option.id,
          );

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.multiOptionButton,
                isSelected && styles.multiOptionButtonSelected,
              ]}
              onPress={() => {
                const newAnswer = currentAnswer || [];
                const updatedAnswer = isSelected
                  ? newAnswer.filter((item) => item.id !== option.id)
                  : [...newAnswer, option];
                handleAnswer(updatedAnswer);
              }}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.text}
                </Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStressMeter = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      <Text style={styles.questionTitle}>{question.title}</Text>

      <View style={styles.stressMeterContainer}>
        {question.scale.labels.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stressOption,
              { backgroundColor: question.scale.colors[index] },
              currentAnswer === index + 1 && styles.stressOptionSelected,
            ]}
            onPress={() => handleAnswer(index + 1)}
          >
            <Text style={styles.stressLevel}>{index + 1}</Text>
            <Text style={styles.stressLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSoundAnalysis = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      <Text style={styles.questionCharacter}>{question.character}</Text>
      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.questionSubtitle}>{question.subtitle}</Text>

      <View style={styles.analysisContainer}>
        <View style={styles.soundWaveContainer}>
          {Array.from({ length: 20 }, (_, i) => (
            <View
              key={i}
              style={[styles.soundWave, { height: Math.random() * 60 + 20 }]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.recordButton,
            currentAnswer && styles.recordButtonActive,
          ]}
          onPress={() =>
            handleAnswer({ recorded: true, timestamp: Date.now() })
          }
        >
          <Text style={styles.recordButtonText}>
            {currentAnswer ? "✓ Recorded" : "🎤 Start Recording"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExpressionAnalysis = (question, currentAnswer) => (
    <View style={styles.questionContent}>
      <Text style={styles.questionTitle}>{question.title}</Text>
      <Text style={styles.questionSubtitle}>{question.subtitle}</Text>

      <View style={styles.analysisContainer}>
        <View style={styles.expressionAnalysis}>
          <View style={styles.progressRing}>
            <Text style={styles.progressPercentage}>5</Text>
          </View>

          <View style={styles.analysisResults}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisNumber}>1</Text>
              <Text style={styles.analysisText}>2</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisNumber}>3</Text>
              <Text style={styles.analysisText}>4</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisNumber}>5</Text>
              <Text style={styles.analysisText}>6</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.analyzeButton,
            currentAnswer && styles.analyzeButtonActive,
          ]}
          onPress={() => handleAnswer({ analyzed: true, score: 85 })}
        >
          <Text style={styles.analyzeButtonText}>
            {currentAnswer ? "✓ Analysis Complete" : "🔍 Analyze Expression"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goToPreviousQuestion}
          disabled={currentQuestion === 0}
        >
          <Text
            style={[
              styles.backButtonText,
              currentQuestion === 0 && styles.backButtonDisabled,
            ]}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Assessment</Text>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} of {totalQuestions}
        </Text>
      </View>

      {/* Question Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.questionContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {renderQuestionContent()}
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !answers[currentQuestion] && styles.continueButtonDisabled,
          ]}
          onPress={goToNextQuestion}
          disabled={!answers[currentQuestion]}
        >
          <Text style={styles.continueButtonText}>
            {currentQuestion === totalQuestions - 1 ? "Complete" : "Continue"} →
          </Text>
        </TouchableOpacity>

        {/* Home Indicator */}
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingBottom: freudDarkTheme.spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  backButtonDisabled: {
    color: freudDarkTheme.colors.text.quaternary,
  },
  headerTitle: {
    fontSize: freudDarkTheme.typography.sizes.xl,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    color: freudDarkTheme.colors.text.primary,
  },
  skipButton: {
    paddingHorizontal: freudDarkTheme.spacing[4],
    paddingVertical: freudDarkTheme.spacing[2],
  },
  skipButtonText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },

  // Progress
  progressContainer: {
    paddingHorizontal: freudDarkTheme.spacing[6],
    marginBottom: freudDarkTheme.spacing[6],
  },
  progressBackground: {
    height: 6,
    backgroundColor: freudDarkTheme.colors.border.primary,
    borderRadius: freudDarkTheme.borderRadius.full,
    overflow: "hidden",
    marginBottom: freudDarkTheme.spacing[2],
  },
  progressBar: {
    height: "100%",
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderRadius: freudDarkTheme.borderRadius.full,
  },
  progressText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
    textAlign: "center",
  },

  // Content
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  questionContainer: {
    minHeight: height * 0.5,
  },
  questionContent: {
    alignItems: "center",
  },
  questionCharacter: {
    fontSize: 80,
    marginBottom: freudDarkTheme.spacing[4],
  },
  questionTitle: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: freudDarkTheme.colors.text.primary,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[4],
  },
  questionSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[6],
    paddingHorizontal: freudDarkTheme.spacing[4],
  },

  // Options
  optionsContainer: {
    width: "100%",
  },
  optionButton: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    marginBottom: freudDarkTheme.spacing[3],
    borderWidth: 2,
    borderColor: "transparent",
    ...freudDarkTheme.shadows.sm,
  },
  optionButtonSelected: {
    borderColor: freudDarkTheme.colors.accent.primary,
    backgroundColor: `${freudDarkTheme.colors.accent.primary}20`,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: freudDarkTheme.spacing[3],
  },
  optionText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
    flex: 1,
  },
  optionTextSelected: {
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },

  // Multi-selection
  multiOptionButton: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    marginBottom: freudDarkTheme.spacing[3],
    borderWidth: 2,
    borderColor: "transparent",
  },
  multiOptionButtonSelected: {
    borderColor: freudDarkTheme.colors.accent.primary,
    backgroundColor: `${freudDarkTheme.colors.accent.primary}15`,
  },
  checkmark: {
    fontSize: 20,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },

  // Mood selection
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: freudDarkTheme.spacing[3],
  },
  moodOption: {
    width: 80,
    height: 80,
    borderRadius: freudDarkTheme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: freudDarkTheme.colors.card.background,
  },
  moodOptionSelected: {
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: freudDarkTheme.spacing[1],
  },
  moodText: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: "center",
  },
  moodTextSelected: {
    color: "#FFFFFF",
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },

  // Rating scale
  ratingContainer: {
    width: "100%",
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: freudDarkTheme.spacing[4],
  },
  ratingLabel: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
  },
  ratingScale: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: freudDarkTheme.colors.border.primary,
  },
  ratingDotSelected: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  ratingNumber: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },

  // Weight input
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: freudDarkTheme.spacing[6],
  },
  weightValue: {
    fontSize: freudDarkTheme.typography.sizes["6xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: freudDarkTheme.colors.text.primary,
    marginRight: freudDarkTheme.spacing[2],
  },
  weightUnit: {
    fontSize: freudDarkTheme.typography.sizes.xl,
    color: freudDarkTheme.colors.text.tertiary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  weightControls: {
    flexDirection: "row",
    gap: freudDarkTheme.spacing[4],
  },
  weightButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: freudDarkTheme.colors.border.primary,
  },
  weightButtonText: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },

  // Stress meter
  stressMeterContainer: {
    width: "100%",
    gap: freudDarkTheme.spacing[3],
  },
  stressOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
    marginBottom: freudDarkTheme.spacing[2],
  },
  stressOptionSelected: {
    transform: [{ scale: 1.02 }],
    ...freudDarkTheme.shadows.lg,
  },
  stressLevel: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: "#FFFFFF",
    marginRight: freudDarkTheme.spacing[4],
    width: 40,
    textAlign: "center",
  },
  stressLabel: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.medium,
    color: "#FFFFFF",
  },

  // Analysis components
  analysisContainer: {
    width: "100%",
    alignItems: "center",
  },
  soundWaveContainer: {
    flexDirection: "row",
    alignItems: "end",
    justifyContent: "center",
    height: 80,
    marginBottom: freudDarkTheme.spacing[6],
    gap: 2,
  },
  soundWave: {
    width: 4,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderRadius: 2,
  },
  recordButton: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    paddingVertical: freudDarkTheme.spacing[4],
    paddingHorizontal: freudDarkTheme.spacing[6],
    borderWidth: 2,
    borderColor: freudDarkTheme.colors.border.primary,
  },
  recordButtonActive: {
    borderColor: freudDarkTheme.colors.accent.primary,
    backgroundColor: `${freudDarkTheme.colors.accent.primary}20`,
  },
  recordButtonText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.medium,
    color: freudDarkTheme.colors.text.primary,
  },
  expressionAnalysis: {
    alignItems: "center",
    marginBottom: freudDarkTheme.spacing[6],
  },
  progressRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: freudDarkTheme.spacing[4],
  },
  progressPercentage: {
    fontSize: freudDarkTheme.typography.sizes["3xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: "#FFFFFF",
  },
  analysisResults: {
    flexDirection: "row",
    gap: freudDarkTheme.spacing[4],
  },
  analysisItem: {
    alignItems: "center",
  },
  analysisNumber: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: freudDarkTheme.colors.text.primary,
  },
  analysisText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
  },
  analyzeButton: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    paddingVertical: freudDarkTheme.spacing[4],
    paddingHorizontal: freudDarkTheme.spacing[6],
    borderWidth: 2,
    borderColor: freudDarkTheme.colors.border.primary,
  },
  analyzeButtonActive: {
    borderColor: freudDarkTheme.colors.accent.primary,
    backgroundColor: `${freudDarkTheme.colors.accent.primary}20`,
  },
  analyzeButtonText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.medium,
    color: freudDarkTheme.colors.text.primary,
  },

  // Bottom section
  bottomContainer: {
    padding: freudDarkTheme.spacing[6],
  },
  continueButton: {
    backgroundColor: freudDarkTheme.colors.button.primary.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    paddingVertical: freudDarkTheme.spacing[4],
    alignItems: "center",
    marginBottom: freudDarkTheme.spacing[6],
    ...freudDarkTheme.shadows.md,
  },
  continueButtonDisabled: {
    backgroundColor: freudDarkTheme.colors.card.background,
    ...freudDarkTheme.shadows.sm,
  },
  continueButtonText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    color: freudDarkTheme.colors.button.primary.text,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: `${freudDarkTheme.colors.text.primary}40`,
    borderRadius: freudDarkTheme.borderRadius.full,
    alignSelf: "center",
  },
});

export default DarkComprehensiveAssessmentScreen;
