/**
 * Professional Onboarding Screen - Simplified version without styled-components
 * Clean onboarding interface for professional users
 */

import { completeOnboarding } from "@app/store/slices/authSlice";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";

const { width, height } = Dimensions.get("window");

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Solace AI",
    description: "Your professional mental health companion",
    emoji: "🧠",
    color: "#007AFF",
  },
  {
    id: 2,
    title: "AI-Powered Insights",
    description: "Get personalized mental health recommendations",
    emoji: "🤖",
    color: "#34C759",
  },
  {
    id: 3,
    title: "Professional Support",
    description: "Access evidence-based therapeutic tools",
    emoji: "👨‍⚕️",
    color: "#FF9500",
  },
];

const ProfessionalOnboardingScreen = ({ navigation }) => {
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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    illustrationText: {
      fontSize: 80,
      color: "#FFFFFF",
    },
    titleText: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.colors?.text?.primary || "#2D3748",
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitleText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors?.text?.secondary || "#718096",
      textAlign: "center",
      opacity: 0.8,
    },
    descriptionText: {
      fontSize: 16,
      color: theme.colors?.text?.secondary || "#718096",
      textAlign: "center",
      lineHeight: 24,
      maxWidth: 300,
      marginTop: 16,
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
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

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
            <Text style={styles.subtitleText}>Professional Edition</Text>
            <Text style={styles.descriptionText}>{step.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.paginationContainer}>
          {/* LOW-NEW-002 FIX: Use descriptive key instead of index */}
          {onboardingSteps.map((_, index) => (
            <View
              key={`pro-onboard-dot-${index}`}
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
ProfessionalOnboardingScreen.displayName = 'ProfessionalOnboardingScreen';

export default ProfessionalOnboardingScreen;
