import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { FreudLogo } from "../components/icons/FreudIcons";
import { useTheme } from "../shared/theme/ThemeContext";
import { freudDarkTheme } from "../shared/theme/freudDarkTheme";

const { width, height } = Dimensions.get("window");

// Welcome steps data matching the design exactly
const WELCOME_STEPS = [
  {
    id: 1,
    step: "Step One",
    title: "Welcome to the ultimate freud UI Kit!",
    description:
      "Your mindful mental health AI companion for everyone, anywhere ✓",
    backgroundColor: [
      freudDarkTheme.colors.background.primary,
      freudDarkTheme.colors.background.secondary,
    ],
    textColor: freudDarkTheme.colors.text.primary,
    illustration: "welcome", // Custom illustration component
    showGetStarted: true,
  },
  {
    id: 2,
    step: "Step Two",
    title: "Personalize Your Mental Health State With AI",
    description:
      "AI-powered insights tailored to your unique mental health journey",
    backgroundColor: ["#8B9F6F", "#9CB079"], // Green gradient from design
    textColor: "#FFFFFF",
    illustration: "personalize",
    character: "🤖", // AI character
  },
  {
    id: 3,
    step: "Step Three",
    title: "Intelligent Mood Tracking & Emotion Insights",
    description:
      "Advanced mood analysis with actionable therapeutic recommendations",
    backgroundColor: ["#E67E22", "#F39C12"], // Orange gradient from design
    textColor: "#FFFFFF",
    illustration: "mood",
    character: "😔", // Sad emoji
    happyCharacter: "😊", // Happy emoji for contrast
  },
  {
    id: 4,
    step: "Step Four",
    title: "AI Mental Journaling & AI Therapy Chatbot",
    description:
      "Intelligent journaling with therapeutic AI guidance and support",
    backgroundColor: ["#2C3E50", "#34495E"], // Dark slate from design
    textColor: "#FFFFFF",
    illustration: "journal",
    features: ["✨ Sparkles", "📝 Notes", "🧠 AI Brain"],
  },
  {
    id: 5,
    step: "Step Five",
    title: "Mindful Resources That Makes You Happy",
    description:
      "Curated mindfulness content personalized for your wellness journey",
    backgroundColor: ["#F39C12", "#E67E22"], // Golden gradient from design
    textColor: "#FFFFFF",
    illustration: "mindful",
    character: "🧘", // Meditation character
  },
  {
    id: 6,
    step: "Step Six",
    title: "Loving & Supportive Community",
    description:
      "Connect with others on similar mental health journeys in a safe space",
    backgroundColor: ["#8E44AD", "#9B59B6"], // Purple gradient from design
    textColor: "#FFFFFF",
    illustration: "community",
    character: "💜", // Heart character
    supportIcons: ["👥", "💬", "🤝"],
  },
];

const DarkWelcomeScreen = ({ onComplete = () => {} }) => {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentStepData = WELCOME_STEPS[currentStep];

  useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animateToNextStep = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    Animated.sequence([
      // Slide out current
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      // Reset position and change step
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const nextStep = currentStep + 1;
      if (nextStep >= WELCOME_STEPS.length) {
        onComplete();
        return;
      }

      setCurrentStep(nextStep);

      // Slide in new
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const goToPreviousStep = () => {
    if (isAnimating || currentStep === 0) return;

    setIsAnimating(true);

    Animated.sequence([
      // Slide out current
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      // Reset position and change step
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(currentStep - 1);

      // Slide in new
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const renderIllustration = (illustration, data) => {
    switch (illustration) {
      case "welcome":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.welcomeIcons}>
              <View style={[styles.iconCircle, { backgroundColor: "#E67E22" }]}>
                <Text style={styles.iconText}>💭</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: "#8B9F6F" }]}>
                <Text style={styles.iconText}>😊</Text>
              </View>
              <View style={[styles.iconCircle, { backgroundColor: "#F39C12" }]}>
                <Text style={styles.iconText}>🧠</Text>
              </View>
            </View>
            <View
              style={[styles.mainCharacter, { backgroundColor: "#27AE60" }]}
            >
              <Text style={styles.mainCharacterText}>🤖</Text>
            </View>
          </View>
        );

      case "personalize":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.aiCharacterContainer}>
              <View style={styles.aiCharacter}>
                <Text style={styles.characterEmoji}>{data.character}</Text>
              </View>
              <View style={styles.thoughtBubbles}>
                <View style={[styles.bubble, styles.bubble1]} />
                <View style={[styles.bubble, styles.bubble2]} />
                <View style={[styles.bubble, styles.bubble3]} />
              </View>
            </View>
          </View>
        );

      case "mood":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.moodContainer}>
              <View style={styles.moodCharacter}>
                <Text style={styles.characterEmoji}>{data.character}</Text>
              </View>
              <View style={styles.moodTransition}>
                <Text style={styles.arrowText}>→</Text>
              </View>
              <View style={styles.moodCharacter}>
                <Text style={styles.characterEmoji}>{data.happyCharacter}</Text>
              </View>
            </View>
          </View>
        );

      case "journal":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.journalContainer}>
              <View style={styles.journalBook}>
                <View style={styles.journalPages}>
                  <View style={styles.journalLine} />
                  <View style={styles.journalLine} />
                  <View style={styles.journalLine} />
                </View>
              </View>
              <View style={styles.featureIcons}>
                {data.features?.map((feature, index) => (
                  <Text key={index} style={styles.featureIcon}>
                    {feature}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        );

      case "mindful":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.mindfulContainer}>
              <View style={styles.meditationFigure}>
                <Text style={styles.characterEmoji}>{data.character}</Text>
              </View>
              <View style={styles.mindfulRings}>
                <View style={[styles.ring, styles.ring1]} />
                <View style={[styles.ring, styles.ring2]} />
                <View style={[styles.ring, styles.ring3]} />
              </View>
            </View>
          </View>
        );

      case "community":
        return (
          <View style={styles.illustrationContainer}>
            <View style={styles.communityContainer}>
              <View style={styles.heartCenter}>
                <Text style={styles.characterEmoji}>{data.character}</Text>
              </View>
              <View style={styles.supportIconsContainer}>
                {data.supportIcons?.map((icon, index) => (
                  <View
                    key={index}
                    style={[
                      styles.supportIcon,
                      {
                        transform: [{ rotate: `${index * 120}deg` }],
                      },
                    ]}
                  >
                    <Text style={styles.supportIconText}>{icon}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );

      default:
        return <View style={styles.defaultIllustration} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={currentStepData.backgroundColor}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <Text style={[styles.stepText, { color: currentStepData.textColor }]}>
            {currentStepData.step}
          </Text>
        </View>

        {/* Main Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Illustration */}
          <View style={styles.illustrationSection}>
            {renderIllustration(currentStepData.illustration, currentStepData)}
          </View>

          {/* Text Content */}
          <View style={styles.textSection}>
            <Text style={[styles.title, { color: currentStepData.textColor }]}>
              {currentStepData.title}
            </Text>

            <Text
              style={[styles.description, { color: currentStepData.textColor }]}
            >
              {currentStepData.description}
            </Text>
          </View>
        </Animated.View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {/* Previous Button */}
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.prevButton}
              onPress={goToPreviousStep}
              disabled={isAnimating}
            >
              <Text style={styles.prevButtonText}>←</Text>
            </TouchableOpacity>
          )}

          {/* Next/Get Started Button */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              {
                backgroundColor:
                  currentStepData.textColor === "#FFFFFF"
                    ? "#FFFFFF20"
                    : freudDarkTheme.colors.accent.primary,
              },
            ]}
            onPress={animateToNextStep}
            disabled={isAnimating}
          >
            <Text
              style={[
                styles.nextButtonText,
                { color: currentStepData.textColor },
              ]}
            >
              {currentStepData.showGetStarted ? "Get Started" : "Continue"} →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {WELCOME_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    index === currentStep
                      ? currentStepData.textColor
                      : `${currentStepData.textColor}40`,
                },
              ]}
            />
          ))}
        </View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
          <Text
            style={[
              styles.skipButtonText,
              { color: currentStepData.textColor },
            ]}
          >
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>

        {/* Bottom Home Indicator */}
        <View style={styles.bottomIndicator}>
          <View
            style={[
              styles.homeIndicator,
              { backgroundColor: `${currentStepData.textColor}40` },
            ]}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepIndicator: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  stepText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  illustrationSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  textSection: {
    paddingBottom: 120,
    alignItems: "center",
  },
  title: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[4],
    paddingHorizontal: freudDarkTheme.spacing[4],
  },
  description: {
    fontSize: freudDarkTheme.typography.sizes.base,
    fontWeight: freudDarkTheme.typography.weights.normal,
    textAlign: "center",
    opacity: 0.9,
    paddingHorizontal: freudDarkTheme.spacing[6],
    lineHeight: freudDarkTheme.typography.sizes.base * 1.4,
  },

  // Illustration Styles
  illustrationContainer: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },

  // Welcome illustration
  welcomeIcons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  iconText: {
    fontSize: 20,
  },
  mainCharacter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  mainCharacterText: {
    fontSize: 40,
  },

  // AI Character illustration
  aiCharacterContainer: {
    position: "relative",
    alignItems: "center",
  },
  aiCharacter: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  characterEmoji: {
    fontSize: 60,
  },
  thoughtBubbles: {
    position: "absolute",
    top: -20,
    right: -30,
  },
  bubble: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    marginBottom: 5,
  },
  bubble1: {
    width: 15,
    height: 15,
  },
  bubble2: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  bubble3: {
    width: 25,
    height: 25,
    marginLeft: 5,
  },

  // Mood illustration
  moodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodCharacter: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  moodTransition: {
    marginHorizontal: 20,
  },
  arrowText: {
    fontSize: 30,
    color: "rgba(255, 255, 255, 0.7)",
  },

  // Journal illustration
  journalContainer: {
    alignItems: "center",
  },
  journalBook: {
    width: 120,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  journalPages: {
    flex: 1,
  },
  journalLine: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 8,
  },
  featureIcons: {
    flexDirection: "row",
  },
  featureIcon: {
    fontSize: 24,
    marginHorizontal: 8,
  },

  // Mindful illustration
  mindfulContainer: {
    position: "relative",
    alignItems: "center",
  },
  meditationFigure: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  mindfulRings: {
    position: "absolute",
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 100,
  },
  ring1: {
    width: 120,
    height: 120,
    top: -60,
    left: -60,
  },
  ring2: {
    width: 160,
    height: 160,
    top: -80,
    left: -80,
  },
  ring3: {
    width: 200,
    height: 200,
    top: -100,
    left: -100,
  },

  // Community illustration
  communityContainer: {
    position: "relative",
    alignItems: "center",
  },
  heartCenter: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  supportIconsContainer: {
    position: "absolute",
    width: 150,
    height: 150,
  },
  supportIcon: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    top: 10,
    left: 55,
  },
  supportIconText: {
    fontSize: 20,
  },

  // Default illustration
  defaultIllustration: {
    width: 150,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 75,
  },

  // Navigation
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingBottom: 20,
  },
  prevButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  prevButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  nextButton: {
    flex: 1,
    marginLeft: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: freudDarkTheme.borderRadius.lg,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },

  // Progress dots
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Skip button
  skipButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    fontWeight: freudDarkTheme.typography.weights.normal,
    opacity: 0.8,
  },

  // Bottom indicator
  bottomIndicator: {
    alignItems: "center",
    paddingBottom: freudDarkTheme.spacing[6],
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: freudDarkTheme.borderRadius.full,
  },
});

export default DarkWelcomeScreen;
