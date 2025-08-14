import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";

import { useTheme } from "../../contexts/ThemeContext";
import { MentalHealthAccessibility } from "../../utils/accessibility";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Onboarding steps based on Figma design
  const onboardingSteps = useMemo(
    () => [
      {
        id: 1,
        title: "Welcome to the ultimate freud UI Kit!",
        subtitle:
          "Your mindful mental health AI companion for everyone, anywhere ✨",
        illustration: "🧠",
        backgroundColor: [theme.colors.primary[100], theme.colors.primary[50]],
        buttonText: "Get Started",
        stepLabel: "Step One",
      },
      {
        id: 2,
        title: "Personalize Your Mental Health State With AI",
        subtitle:
          "AI-powered insights to understand your mental wellness journey",
        illustration: "🌱",
        backgroundColor: [
          theme.colors.secondary[100],
          theme.colors.secondary[50],
        ],
        buttonText: "Continue",
        stepLabel: "Step Two",
      },
      {
        id: 3,
        title: "Intelligent Mood Tracking & AI Emotion Insights",
        subtitle:
          "Track your emotions with advanced AI analysis and personalized recommendations",
        illustration: "🎯",
        backgroundColor: [
          theme.colors.therapeutic.empathy[100],
          theme.colors.therapeutic.empathy[50],
        ],
        buttonText: "Continue",
        stepLabel: "Step Three",
      },
      {
        id: 4,
        title: "AI Mental Journaling & AI Therapy Chatbot",
        subtitle:
          "Experience intelligent journaling with AI-powered therapy conversations",
        illustration: "📝",
        backgroundColor: [
          theme.colors.therapeutic.zen[100],
          theme.colors.therapeutic.zen[50],
        ],
        buttonText: "Continue",
        stepLabel: "Step Four",
      },
      {
        id: 5,
        title: "Mindful Resources That Makes You Happy",
        subtitle:
          "Discover curated mindfulness resources and practices for your wellbeing",
        illustration: "🧘‍♀️",
        backgroundColor: [
          theme.colors.therapeutic.kind[100],
          theme.colors.therapeutic.kind[50],
        ],
        buttonText: "Continue",
        stepLabel: "Step Five",
      },
      {
        id: 6,
        title: "Loving & Supportive Community",
        subtitle:
          "Connect with a caring community that understands your journey",
        illustration: "💝",
        backgroundColor: [
          theme.colors.therapeutic.optimistic[100],
          theme.colors.therapeutic.optimistic[50],
        ],
        buttonText: "Get Started",
        stepLabel: "Step Six",
      },
    ],
    [theme],
  );

  useEffect(() => {
    // Animate step transition
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep, fadeAnim, slideAnim, scaleAnim]);

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.9);
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to main app
      navigation.navigate("SignIn");
    }
  };

  const handleSkip = () => {
    navigation.navigate("SignIn");
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
  };

  // Create dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing[5],
      paddingTop: theme.spacing[8],
      paddingBottom: theme.spacing[4],
    },
    stepIndicator: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
      borderRadius: theme.borderRadius.full,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    stepLabel: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
    },
    skipButton: {
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[1],
    },
    skipText: {
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.medium,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing[5],
      justifyContent: "space-between",
    },
    illustrationSection: {
      alignItems: "center",
      paddingVertical: theme.spacing[12],
      flex: 1,
      justifyContent: "center",
    },
    illustrationContainer: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      justifyContent: "center",
      alignItems: "center",
      ...theme.shadows.lg,
    },
    contentSection: {
      alignItems: "center",
      paddingVertical: theme.spacing[8],
    },
    title: {
      fontSize: theme.typography.sizes["3xl"],
      fontWeight: theme.typography.weights.bold,
      lineHeight: theme.typography.lineHeights["3xl"],
      textAlign: "center",
      marginBottom: theme.spacing[4],
      maxWidth: width * 0.9,
    },
    subtitle: {
      fontSize: theme.typography.sizes.lg,
      lineHeight: theme.typography.lineHeights.xl,
      textAlign: "center",
      maxWidth: width * 0.85,
      opacity: 0.8,
    },
    navigationSection: {
      alignItems: "center",
      paddingVertical: theme.spacing[8],
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing[2],
      marginBottom: theme.spacing[8],
    },
    actionButton: {
      width: width * 0.8,
      paddingVertical: theme.spacing[4],
      paddingHorizontal: theme.spacing[8],
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      ...theme.shadows.md,
    },
    actionButtonText: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semiBold,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={currentStepData.backgroundColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        {/* Header with Step Indicator */}
        <View style={dynamicStyles.header}>
          <View style={dynamicStyles.stepIndicator}>
            <Text
              style={[dynamicStyles.stepLabel, { color: theme.colors.text.tertiary }]}
            >
              {currentStepData.stepLabel}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSkip}
            style={dynamicStyles.skipButton}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <Text
              style={[dynamicStyles.skipText, { color: theme.colors.text.secondary }]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={dynamicStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityRole="scrollbar"
        >
          {/* Illustration Section */}
          <Animated.View style={[dynamicStyles.illustrationSection, animatedStyle]}>
            <View style={dynamicStyles.illustrationContainer}>
              <Text style={styles.illustration}>
                {currentStepData.illustration}
              </Text>
            </View>
          </Animated.View>

          {/* Content Section */}
          <Animated.View style={[dynamicStyles.contentSection, animatedStyle]}>
            <Text
              style={[dynamicStyles.title, { color: theme.colors.text.primary }]}
              accessibilityRole="header"
            >
              {currentStepData.title}
            </Text>

            <Text
              style={[dynamicStyles.subtitle, { color: theme.colors.text.secondary }]}
            >
              {currentStepData.subtitle}
            </Text>
          </Animated.View>

          {/* Navigation Section */}
          <Animated.View style={[dynamicStyles.navigationSection, animatedStyle]}>
            {/* Step Dots */}
            <View style={dynamicStyles.dotsContainer} accessibilityRole="tablist">
              {onboardingSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentStep
                          ? theme.colors.primary[500]
                          : theme.colors.primary[200],
                      width: index === currentStep ? 24 : 8,
                    },
                  ]}
                  accessibilityRole="tab"
                  accessibilityLabel={`Step ${index + 1}`}
                  accessibilityState={{ selected: index === currentStep }}
                />
              ))}
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={[
                dynamicStyles.actionButton,
                { backgroundColor: theme.colors.primary[500] },
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={currentStepData.buttonText}
              {...MentalHealthAccessibility.buttons.primary(
                currentStepData.buttonText,
              )}
            >
              <Text
                style={[
                  dynamicStyles.actionButtonText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {currentStepData.buttonText}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  illustration: {
    fontSize: 80,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
