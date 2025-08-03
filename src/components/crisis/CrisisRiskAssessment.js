import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

import { useTheme } from "../../contexts/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../styles/theme";
import { MentalHealthAccessibility } from "../../utils/accessibility";
import { MentalHealthIcon, ActionIcon } from "../icons";

const CrisisRiskAssessment = ({ visible, onClose, onRiskLevelDetermined }) => {
  const { theme } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});

  const crisisQuestions = [
    {
      id: "suicidal_ideation",
      question:
        "Are you having thoughts of hurting yourself or ending your life?",
      type: "yes_no",
      weight: 5,
      riskLevel: "critical",
    },
    {
      id: "self_harm_intent",
      question: "Do you have a plan to hurt yourself?",
      type: "yes_no",
      weight: 5,
      condition: (responses) => responses.suicidal_ideation === true,
      riskLevel: "critical",
    },
    {
      id: "hopelessness",
      question: "Do you feel hopeless about the future?",
      type: "scale",
      scale: ["Not at all", "Slightly", "Moderately", "Very much", "Extremely"],
      weight: 3,
    },
    {
      id: "support_system",
      question: "Do you have people you can turn to for support?",
      type: "yes_no",
      weight: -2, // Negative weight as it's protective
      inverted: true,
    },
    {
      id: "recent_loss",
      question: "Have you experienced a significant loss or trauma recently?",
      type: "yes_no",
      weight: 2,
    },
  ];

  const getCurrentQuestion = () => {
    const question = crisisQuestions[currentQuestion];
    if (question.condition && !question.condition(responses)) {
      // Skip conditional questions
      return getNextAvailableQuestion();
    }
    return question;
  };

  const getNextAvailableQuestion = () => {
    for (let i = currentQuestion + 1; i < crisisQuestions.length; i++) {
      const question = crisisQuestions[i];
      if (!question.condition || question.condition(responses)) {
        return question;
      }
    }
    return null;
  };

  const handleResponse = useCallback(
    (questionId, response) => {
      const newResponses = { ...responses, [questionId]: response };
      setResponses(newResponses);

      // Check for immediate crisis indicators
      const question = crisisQuestions.find((q) => q.id === questionId);
      if (question?.riskLevel === "critical" && response === true) {
        // Immediate crisis intervention
        handleCrisisIntervention("critical");
        return;
      }

      // Move to next question
      const nextQuestion = getNextAvailableQuestion();
      if (nextQuestion) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Assessment complete
        calculateRiskLevel(newResponses);
      }
    },
    [responses, currentQuestion],
  );

  const calculateRiskLevel = (finalResponses) => {
    let totalScore = 0;
    let hasCriticalIndicators = false;

    crisisQuestions.forEach((question) => {
      const response = finalResponses[question.id];
      if (response !== undefined) {
        if (question.riskLevel === "critical" && response === true) {
          hasCriticalIndicators = true;
        }

        let score = 0;
        if (question.type === "yes_no") {
          score = response ? question.weight : 0;
          if (question.inverted)
            score = response ? 0 : Math.abs(question.weight);
        } else if (question.type === "scale") {
          score = (response * question.weight) / (question.scale.length - 1);
        }
        totalScore += score;
      }
    });

    let riskLevel = "low";
    if (hasCriticalIndicators || totalScore >= 12) {
      riskLevel = "critical";
    } else if (totalScore >= 8) {
      riskLevel = "high";
    } else if (totalScore >= 4) {
      riskLevel = "moderate";
    }

    handleCrisisIntervention(riskLevel);
  };

  const handleCrisisIntervention = (riskLevel) => {
    const interventions = {
      critical: {
        title: "Immediate Support Needed",
        message:
          "Your responses indicate you may be in crisis. Please reach out for immediate support.",
        actions: [
          {
            text: "Call 988 (Crisis Line)",
            onPress: () => Linking.openURL("tel:988"),
            style: "destructive",
          },
          {
            text: "Text Crisis Line",
            onPress: () => Linking.openURL("sms:741741?body=HOME"),
            style: "default",
          },
          {
            text: "Emergency Services",
            onPress: () => Linking.openURL("tel:911"),
            style: "destructive",
          },
        ],
      },
      high: {
        title: "High Risk Detected",
        message:
          "Your responses suggest you may be at elevated risk. Consider reaching out to a mental health professional.",
        actions: [
          {
            text: "Contact Crisis Line",
            onPress: () => Linking.openURL("tel:988"),
            style: "default",
          },
          {
            text: "Find Resources",
            onPress: () => onRiskLevelDetermined?.(riskLevel, "resources"),
            style: "default",
          },
        ],
      },
      moderate: {
        title: "Increased Concern",
        message:
          "Your responses indicate some concerning thoughts. Consider speaking with a counselor or trusted person.",
        actions: [
          {
            text: "View Coping Strategies",
            onPress: () => onRiskLevelDetermined?.(riskLevel, "coping"),
            style: "default",
          },
          {
            text: "Crisis Resources",
            onPress: () => onRiskLevelDetermined?.(riskLevel, "resources"),
            style: "default",
          },
        ],
      },
    };

    const intervention = interventions[riskLevel];
    if (intervention) {
      Alert.alert(intervention.title, intervention.message, [
        ...intervention.actions,
        { text: "OK", style: "cancel", onPress: () => onClose?.() },
      ]);
    }

    onRiskLevelDetermined?.(riskLevel);
  };

  const currentQ = getCurrentQuestion();
  if (!currentQ || !visible) return null;

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        {/* Header */}
        <LinearGradient
          colors={[theme.colors.error[100], theme.colors.warning[100]]}
          style={styles.header}
        >
          <MentalHealthIcon name="Heart" size="lg" colorScheme="error" />
          <Text
            style={[styles.headerTitle, { color: theme.colors.error[700] }]}
          >
            Safety Check
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: theme.colors.error[600] }]}
          >
            Your wellbeing is our priority
          </Text>
        </LinearGradient>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.gray[200] },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.error[500],
                  width: `${((currentQuestion + 1) / crisisQuestions.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Question {currentQuestion + 1} of {crisisQuestions.length}
          </Text>
        </View>

        {/* Question */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.questionContainer}>
            <Text
              style={[styles.question, { color: theme.colors.text.primary }]}
            >
              {currentQ.question}
            </Text>

            {currentQ.type === "yes_no" && (
              <View style={styles.yesNoContainer}>
                <TouchableOpacity
                  style={[
                    styles.yesNoButton,
                    {
                      backgroundColor: theme.colors.error[100],
                      borderColor: theme.colors.error[500],
                    },
                  ]}
                  onPress={() => handleResponse(currentQ.id, true)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Yes"
                >
                  <Text
                    style={[
                      styles.yesNoText,
                      { color: theme.colors.error[700] },
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.yesNoButton,
                    {
                      backgroundColor: theme.colors.success[100],
                      borderColor: theme.colors.success[500],
                    },
                  ]}
                  onPress={() => handleResponse(currentQ.id, false)}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="No"
                >
                  <Text
                    style={[
                      styles.yesNoText,
                      { color: theme.colors.success[700] },
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {currentQ.type === "scale" && (
              <View style={styles.scaleContainer}>
                {currentQ.scale.map((label, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.scaleButton,
                      {
                        backgroundColor: theme.colors.gray[100],
                        borderColor: theme.colors.gray[300],
                      },
                    ]}
                    onPress={() => handleResponse(currentQ.id, index)}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`${label}, option ${index + 1} of ${currentQ.scale.length}`}
                  >
                    <Text
                      style={[
                        styles.scaleText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Crisis Resources Always Visible */}
            <View
              style={[
                styles.crisisBox,
                { backgroundColor: theme.colors.error[50] },
              ]}
            >
              <Text
                style={[styles.crisisTitle, { color: theme.colors.error[700] }]}
              >
                🆘 Need Immediate Help?
              </Text>
              <Text
                style={[styles.crisisText, { color: theme.colors.error[600] }]}
              >
                If you're in crisis, don't wait - reach out now:
              </Text>
              <TouchableOpacity
                style={[
                  styles.crisisButton,
                  { backgroundColor: theme.colors.error[500] },
                ]}
                onPress={() => Linking.openURL("tel:988")}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Call 988 Crisis Line"
              >
                <Text style={styles.crisisButtonText}>
                  Call 988 - Crisis Lifeline
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.skipButton,
              { backgroundColor: theme.colors.gray[200] },
            ]}
            onPress={onClose}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Skip assessment"
          >
            <Text
              style={[styles.skipText, { color: theme.colors.text.secondary }]}
            >
              Skip for Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    justifyContent: "center",
    paddingHorizontal: spacing[4],
  },
  container: {
    borderRadius: borderRadius.lg,
    maxHeight: "80%",
    ...shadows.lg,
  },
  header: {
    padding: spacing[6],
    alignItems: "center",
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginTop: spacing[2],
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    marginTop: spacing[1],
    textAlign: "center",
  },
  progressContainer: {
    padding: spacing[4],
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: spacing[2],
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[4],
  },
  questionContainer: {
    paddingBottom: spacing[6],
  },
  question: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing[6],
    textAlign: "center",
  },
  yesNoContainer: {
    flexDirection: "row",
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  yesNoButton: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: "center",
    minHeight: 44,
  },
  yesNoText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
  },
  scaleContainer: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  scaleButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: "center",
    minHeight: 44,
  },
  scaleText: {
    fontSize: typography.sizes.base,
  },
  crisisBox: {
    padding: spacing[4],
    borderRadius: borderRadius.md,
    marginTop: spacing[4],
  },
  crisisTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  crisisText: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing[3],
    textAlign: "center",
  },
  crisisButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  crisisButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  footer: {
    padding: spacing[4],
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  skipButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  skipText: {
    fontSize: typography.sizes.sm,
  },
});

export default CrisisRiskAssessment;
