/**
 * Mental Health Assessment Screen
 * 14-question comprehensive mental health evaluation
 * Matches Freud UI design
 */

import { MentalHealthIcon } from "@components/icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const QUESTIONS = [
  {
    id: 1,
    question: "What's your health goal for today?",
    type: "multi-select",
    options: [
      "Improve my fitness",
      "Boost mental clarity",
      "Enhance my sleep",
      "Learn to be kinder to myself",
    ],
  },
  {
    id: 2,
    question: "What's your official gender?",
    type: "single-select",
    options: ["I am male", "I am female"],
  },
  {
    id: 3,
    question: "What's your age?",
    type: "age-selector",
    min: 10,
    max: 100,
  },
  {
    id: 4,
    question: "What's your weight?",
    type: "weight-slider",
    min: 30,
    max: 200,
    unit: "kg",
  },
  {
    id: 5,
    question: "How would you describe your mood?",
    type: "mood-select",
    options: [
      { label: "Sad", emoji: "😢", color: "#E8A872" },
      { label: "Neutral", emoji: "😐", color: "#B8976B" },
      { label: "Happy", emoji: "😊", color: "#8FBC8F" },
    ],
  },
  {
    id: 6,
    question: "Have you sought professional help before?",
    type: "illustration-select",
    options: ["Yes", "No"],
  },
  {
    id: 7,
    question: "Are you experiencing any physical distress?",
    type: "multi-select",
    options: [
      "Yes, quite a lot",
      "Yes, but not much",
      "No, not experiencing anything physically",
    ],
  },
  {
    id: 8,
    question: "How would you rate your sleep quality?",
    type: "rating-slider",
    min: 1,
    max: 10,
    labels: ["Poor", "Fair", "Good", "Excellent"],
  },
  {
    id: 9,
    question: "Are you taking any medications?",
    type: "single-select",
    options: ["Yes", "No"],
  },
  {
    id: 10,
    question: "Please specify your medications:",
    type: "multi-select",
    options: [
      "Antidepressants",
      "Anti-anxiety",
      "Mood stabilizers",
      "Antipsychotics",
    ],
    conditional: (answers: any) => answers[9] === "Yes",
  },
  {
    id: 11,
    question: "Do you have other mental health symptoms?",
    type: "multi-select",
    options: ["Anxiety", "Depression", "Panic attacks", "Insomnia"],
  },
  {
    id: 12,
    question: "How would you rate your stress level?",
    type: "stress-slider",
    min: 1,
    max: 5,
  },
  {
    id: 13,
    question: "AI Sound Analysis",
    type: "sound-analysis",
    subtitle: "Record a short voice sample for AI analysis",
  },
  {
    id: 14,
    question: "Expression Analysis",
    type: "expression-analysis",
    subtitle: "Let AI analyze your facial expressions",
  },
];

export const AssessmentScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(50);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDark ? "#2D1B0E" : "#1A1108",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      marginRight: 40,
    },
    progressContainer: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    progressBar: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#8FBC8F",
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: "#B8A99A",
      marginTop: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    questionText: {
      fontSize: 28,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 32,
      lineHeight: 36,
    },
    optionsContainer: {
      gap: 12,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: "#6B5444",
      backgroundColor: "rgba(45, 27, 14, 0.5)",
    },
    optionButtonSelected: {
      borderColor: "#8FBC8F",
      backgroundColor: "rgba(143, 188, 143, 0.15)",
    },
    optionText: {
      flex: 1,
      fontSize: 16,
      color: "#E5DDD5",
      fontWeight: "500",
    },
    optionTextSelected: {
      color: "#FFFFFF",
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#6B5444",
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxSelected: {
      backgroundColor: "#8FBC8F",
      borderColor: "#8FBC8F",
    },
    moodContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    },
    moodOption: {
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "transparent",
      minWidth: 100,
    },
    moodOptionSelected: {
      borderColor: "#8FBC8F",
      backgroundColor: "rgba(143, 188, 143, 0.1)",
    },
    moodEmoji: {
      fontSize: 48,
      marginBottom: 8,
    },
    moodLabel: {
      fontSize: 14,
      color: "#B8A99A",
      fontWeight: "600",
    },
    sliderContainer: {
      marginTop: 40,
      alignItems: "center",
    },
    sliderValue: {
      fontSize: 72,
      fontWeight: "700",
      color: "#8FBC8F",
      marginBottom: 24,
    },
    sliderTrack: {
      width: "100%",
      height: 8,
    },
    sliderLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 12,
    },
    sliderLabel: {
      fontSize: 12,
      color: "#6B5444",
    },
    bottomContainer: {
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    continueButton: {
      backgroundColor: "#A67C52",
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    continueButtonDisabled: {
      opacity: 0.5,
    },
    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
  });

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    if (question.type === "multi-select") {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newSelection);
    } else {
      setAnswers({ ...answers, [question.id]: option });
      // Auto-advance for single-select with cleanup
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      autoAdvanceTimerRef.current = setTimeout(
        () => handleContinue(option),
        300,
      );
    }
  };

  const handleContinue = (singleAnswer?: string) => {
    const answer =
      singleAnswer ||
      (question.type === "multi-select" ? selectedOptions : sliderValue);
    setAnswers({ ...answers, [question.id]: answer });

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
      setSliderValue(50);
    } else {
      // Navigate to results
      navigation.navigate("AssessmentResults" as never, { answers } as never);
    }
  };

  const canContinue = () => {
    if (question.type === "multi-select") {
      return selectedOptions.length > 0;
    }
    if (question.type === "single-select" || question.type === "mood-select") {
      return false; // Auto-advances
    }
    return true;
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "multi-select":
      case "single-select":
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  (question.type === "multi-select"
                    ? selectedOptions.includes(option)
                    : answers[question.id] === option) &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => handleOptionSelect(option)}
              >
                {question.type === "multi-select" && (
                  <View
                    style={[
                      styles.checkbox,
                      selectedOptions.includes(option) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selectedOptions.includes(option) && (
                      <Text style={{ color: "#FFFFFF", fontSize: 14 }}>✓</Text>
                    )}
                  </View>
                )}
                <Text
                  style={[
                    styles.optionText,
                    (question.type === "multi-select"
                      ? selectedOptions.includes(option)
                      : answers[question.id] === option) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "mood-select":
        return (
          <View style={styles.moodContainer}>
            {question.options?.map((option: any, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodOption,
                  answers[question.id] === option.label &&
                    styles.moodOptionSelected,
                ]}
                onPress={() => handleOptionSelect(option.label)}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text style={styles.moodLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "age-selector":
      case "weight-slider":
      case "rating-slider":
      case "stress-slider":
        return (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {Math.round(sliderValue)}
              {question.unit || ""}
            </Text>
            <Slider
              style={styles.sliderTrack}
              minimumValue={question.min || 0}
              maximumValue={question.max || 100}
              value={sliderValue}
              onValueChange={setSliderValue}
              minimumTrackTintColor="#8FBC8F"
              maximumTrackTintColor="#6B5444"
              thumbTintColor="#8FBC8F"
            />
            {question.labels && (
              <View style={styles.sliderLabels}>
                {question.labels.map((label, index) => (
                  <Text key={index} style={styles.sliderLabel}>
                    {label}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );

      default:
        return (
          <Text style={{ color: "#B8A99A", fontSize: 16 }}>
            {question.subtitle}
          </Text>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            currentQuestion > 0
              ? setCurrentQuestion(currentQuestion - 1)
              : navigation.goBack()
          }
        >
          <Text style={{ color: "#FFFFFF", fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionText}>{question.question}</Text>
        {renderQuestion()}
      </ScrollView>

      {question.type !== "single-select" && question.type !== "mood-select" && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue() && styles.continueButtonDisabled,
            ]}
            onPress={() => handleContinue()}
            disabled={!canContinue()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AssessmentScreen;
