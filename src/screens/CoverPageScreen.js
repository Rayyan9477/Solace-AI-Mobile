import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState, useMemo } from "react";
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
} from "react-native";

import ThemeToggle from "../components/common/ThemeToggle";
import { useTheme } from "../shared/theme/ThemeContext";
import {
  spacing,
  typography,
  borderRadius,
  shadows,
} from "../shared/theme/theme";
import { MentalHealthAccessibility } from "../shared/utils/accessibility";

const { width, height } = Dimensions.get("window");

const CoverPageScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Feature highlights for the cover page
  const features = useMemo(
    () => [
      {
        id: 1,
        icon: "🧠",
        title: "AI-Powered Support",
        description: "Intelligent conversations that understand your emotions",
        color: theme.colors.therapeutic.empathy[500],
      },
      {
        id: 2,
        icon: "💚",
        title: "Mental Wellness",
        description: "Track your mood and build healthy mental habits",
        color: theme.colors.therapeutic.zen[500],
      },
      {
        id: 3,
        icon: "🔒",
        title: "Private & Secure",
        description: "Your conversations remain completely confidential",
        color: theme.colors.therapeutic.kind[500],
      },
      {
        id: 4,
        icon: "📊",
        title: "Progress Insights",
        description: "Beautiful analytics to track your mental health journey",
        color: theme.colors.therapeutic.optimistic[500],
      },
    ],
    [theme],
  );

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulsing animation for CTA button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    // Auto-cycle through features
    const featureCycleInterval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);

    return () => {
      pulseAnimation.stop();
      clearInterval(featureCycleInterval);
    };
  }, [fadeAnim, slideAnim, scaleAnim, pulseAnim, features.length]);

  const currentFeature = features[currentFeatureIndex];

  const handleGetStarted = () => {
    navigation.navigate("Home");
  };

  const handleLearnMore = () => {
    navigation.navigate("Onboarding");
  };

  const animatedHeaderStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
  };

  const animatedContentStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  const animatedButtonStyle = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Theme Toggle */}
      <View style={styles.themeToggleContainer}>
        <ThemeToggle showLabel={false} />
      </View>

      <LinearGradient
        colors={[
          theme.colors.therapeutic.empathy[600],
          theme.colors.therapeutic.zen[500],
          theme.colors.therapeutic.kind[400],
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          accessibilityRole="scrollbar"
          accessibilityLabel="Cover page content"
        >
          {/* Hero Section */}
          <Animated.View style={[styles.heroSection, animatedHeaderStyle]}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[
                  theme.colors.background.primary,
                  theme.colors.background.surface,
                ]}
                style={styles.logoCircle}
              >
                <Text style={styles.logoEmoji}>🧠</Text>
              </LinearGradient>
            </View>

            <Text
              style={[
                styles.appTitle,
                {
                  color: theme.colors.text.inverse,
                  textShadowColor: theme.colors.background.overlay,
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                },
              ]}
              accessibilityRole="header"
              accessibilityLabel="Solace AI"
            >
              Solace AI
            </Text>

            <Text
              style={[
                styles.appSubtitle,
                {
                  color: theme.colors.text.inverse,
                  textShadowColor: theme.colors.background.overlay,
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                },
              ]}
              accessibilityLabel="Your empathetic digital companion for mental wellness"
            >
              Your Empathetic Digital Companion
            </Text>

            <Text
              style={[
                styles.appDescription,
                {
                  color: theme.colors.text.inverse,
                  textShadowColor: theme.colors.background.overlay,
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
              accessibilityLabel="Experience personalized mental health support powered by advanced AI technology"
            >
              Experience personalized mental health support powered by advanced
              AI technology
            </Text>
          </Animated.View>

          {/* Feature Highlight */}
          <Animated.View style={[styles.featureSection, animatedContentStyle]}>
            <View
              style={[
                styles.featureCard,
                { backgroundColor: theme.colors.background.primary },
                shadows.lg,
              ]}
            >
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: currentFeature.color + "20" },
                ]}
              >
                <Text style={styles.featureIcon}>{currentFeature.icon}</Text>
              </View>

              <Text
                style={[
                  styles.featureTitle,
                  { color: theme.colors.text.primary },
                ]}
                accessibilityRole="header"
              >
                {currentFeature.title}
              </Text>

              <Text
                style={[
                  styles.featureDescription,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {currentFeature.description}
              </Text>
            </View>

            {/* Feature Dots Indicator */}
            <View style={styles.dotsContainer} accessibilityRole="tablist">
              {features.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentFeatureIndex
                          ? theme.colors.text.inverse
                          : theme.colors.text.inverse + "40",
                    },
                  ]}
                  onPress={() => setCurrentFeatureIndex(index)}
                  accessibilityRole="tab"
                  accessibilityLabel={`Feature ${index + 1}`}
                  accessibilityState={{
                    selected: index === currentFeatureIndex,
                  }}
                />
              ))}
            </View>
          </Animated.View>

          {/* Call-to-Action Section */}
          <Animated.View style={[styles.ctaSection, animatedContentStyle]}>
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.colors.background.primary },
                  shadows.md,
                ]}
                onPress={handleGetStarted}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Get started with Solace AI"
                accessibilityHint="Begin your mental wellness journey"
                {...MentalHealthAccessibility.buttons.primary("Get Started")}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.colors.primary[600] },
                  ]}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  borderColor: theme.colors.text.inverse + "60",
                  backgroundColor: theme.colors.background.surface + "20",
                },
              ]}
              onPress={handleLearnMore}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Learn more about Solace AI"
              accessibilityHint="View introduction and features"
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                Learn More
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, animatedContentStyle]}>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.text.inverse + "80" },
              ]}
            >
              Start your mental wellness journey today
            </Text>
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
  themeToggleContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[10],
  },
  heroSection: {
    alignItems: "center",
    paddingTop: spacing[16],
    paddingBottom: spacing[8],
    minHeight: height * 0.5,
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: spacing[6],
    alignItems: "center",
  },
  logoCircle: {
    width: spacing[30],
    height: spacing[30],
    borderRadius: spacing[15],
    justifyContent: "center",
    alignItems: "center",
    ...shadows.xl,
  },
  logoEmoji: {
    fontSize: typography.sizes["6xl"],
  },
  appTitle: {
    fontSize: typography.sizes["5xl"],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights["5xl"],
    textAlign: "center",
    marginBottom: spacing[3],
  },
  appSubtitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.xl,
    textAlign: "center",
    marginBottom: spacing[4],
    opacity: 0.9,
  },
  appDescription: {
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.lg,
    textAlign: "center",
    opacity: 0.8,
    maxWidth: width * 0.85,
    paddingHorizontal: spacing[4],
  },
  featureSection: {
    alignItems: "center",
    marginBottom: spacing[10],
  },
  featureCard: {
    width: width * 0.85,
    padding: spacing[6],
    borderRadius: borderRadius.xl,
    alignItems: "center",
    marginBottom: spacing[6],
  },
  featureIconContainer: {
    width: spacing[20],
    height: spacing[20],
    borderRadius: spacing[10],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing[4],
  },
  featureIcon: {
    fontSize: typography.sizes["5xl"],
  },
  featureTitle: {
    fontSize: typography.sizes["2xl"],
    fontWeight: typography.weights.bold,
    textAlign: "center",
    marginBottom: spacing[3],
  },
  featureDescription: {
    fontSize: typography.sizes.base,
    lineHeight: typography.lineHeights.lg,
    textAlign: "center",
    maxWidth: width * 0.7,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing[2],
  },
  dot: {
    width: spacing[2],
    height: spacing[2],
    borderRadius: spacing[1],
  },
  ctaSection: {
    alignItems: "center",
    paddingHorizontal: spacing[4],
    marginBottom: spacing[8],
  },
  primaryButton: {
    width: width * 0.8,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: borderRadius.xl,
    alignItems: "center",
    marginBottom: spacing[4],
  },
  primaryButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
  },
  secondaryButton: {
    width: width * 0.8,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    borderRadius: borderRadius.xl,
    alignItems: "center",
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  footer: {
    alignItems: "center",
    paddingTop: spacing[6],
  },
  footerText: {
    fontSize: typography.sizes.sm,
    textAlign: "center",
  },
});

export default CoverPageScreen;
