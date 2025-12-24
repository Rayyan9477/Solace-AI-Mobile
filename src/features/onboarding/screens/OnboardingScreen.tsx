/**
 * Onboarding Screen - User Onboarding Flow
 * Simple onboarding interface without styled-components
 */

import { completeOnboarding } from "@app/store/slices/authSlice";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";

const { width, height } = Dimensions.get("window");

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Solace AI",
    description:
      "Your mental health companion is here to support you on your wellness journey.",
    emoji: "🧠",
    color: "#007AFF",
  },
  {
    id: 2,
    title: "Track Your Mood",
    description:
      "Monitor your emotional patterns and gain insights into your mental health.",
    emoji: "😊",
    color: "#34C759",
  },
  {
    id: 3,
    title: "AI Therapy Chat",
    description: "Get personalized support and guidance from our AI therapist.",
    emoji: "💬",
    color: "#FF9500",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dispatch(completeOnboarding());
      navigation.navigate("Login");
    }
  };

  const handleSkip = () => {
    dispatch(completeOnboarding());
    navigation.navigate("Login");
  };

  const currentStepData = onboardingSteps[currentStep];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors?.background?.primary || "#F7FAFC",
    },
    slideContainer: {
      width,
      height,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    illustrationContainer: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: currentStepData.color,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    illustrationText: {
      fontSize: 80,
      color: "#FFFFFF",
    },
    titleText: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors?.text?.primary || "#2D3748",
      textAlign: "center",
      marginBottom: 16,
    },
    descriptionText: {
      fontSize: 16,
      color: theme.colors?.text?.secondary || "#718096",
      textAlign: "center",
      lineHeight: 24,
      maxWidth: 300,
    },
    navigationContainer: {
      position: "absolute",
      bottom: 60,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
    },
    skipButton: {
      backgroundColor: "transparent",
    },
    skipButtonText: {
      color: theme.colors?.text?.secondary || "#718096",
      fontSize: 16,
    },
    nextButton: {
      backgroundColor: currentStepData.color,
    },
    nextButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    paginationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    paginationDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: currentStepData.color,
    },
    inactiveDot: {
      backgroundColor: theme.colors?.text?.tertiary || "#CBD5E1",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentStep(newIndex);
        }}
      >
        {onboardingSteps.map((step, index) => (
          <View key={step.id} style={styles.slideContainer}>
            <View style={styles.illustrationContainer}>
              <Text style={styles.illustrationText}>{step.emoji}</Text>
            </View>
            <Text style={styles.titleText}>{step.title}</Text>
            <Text style={styles.descriptionText}>{step.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.paginationContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={`onboarding-step-${index}`}
              style={[
                styles.paginationDot,
                index === currentStep ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
OnboardingScreen.displayName = 'OnboardingScreen';

export default OnboardingScreen;
