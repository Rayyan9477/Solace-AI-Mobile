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

import { useTheme } from "../design-system/theme/ThemeProvider";

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
        color: theme.colors.primary || "#C96100", // Fallback to primary color
      },
      {
        id: 2,
        icon: "💚",
        title: "Mental Wellness",
        description: "Track your mood and build healthy mental habits",
        color: theme.colors.secondary || "#7DD44D", // Fallback to secondary color
      },
      {
        id: 3,
        icon: "🔒",
        title: "Private & Secure",
        description: "Your conversations remain completely confidential",
        color: theme.colors.tertiary || "#8965FF", // Fallback to tertiary color
      },
      {
        id: 4,
        icon: "📊",
        title: "Progress Insights",
        description: "Beautiful analytics to track your mental health journey",
        color: theme.colors.success || "#22C55E", // Fallback to success color
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

      {/* Theme Toggle - Simplified */}
      <View style={styles.themeToggleContainer}>
        <Text style={{ color: "#FFF", fontSize: 16 }}>🌙</Text>
      </View>

      <LinearGradient
        colors={[
          theme.colors.primary || "#926247",
          theme.colors.secondary || "#7DD44D",
          theme.colors.tertiary || "#8965FF",
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
                  theme.colors.surface || "#FFFFFF",
                  theme.colors.background?.secondary || "#F9FAFB",
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
                  color: theme.colors.onSurface || "#FFFFFF",
                  textShadowColor: "rgba(0,0,0,0.3)",
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
                  color: theme.colors.onSurface || "#FFFFFF",
                  textShadowColor: "rgba(0,0,0,0.3)",
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
                  color: theme.colors.onSurface || "#FFFFFF",
                  textShadowColor: "rgba(0,0,0,0.3)",
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
                { backgroundColor: theme.colors.surface || "#FFFFFF" },
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
                  { color: theme.colors.onSurface || "#111827" },
                ]}
                accessibilityRole="header"
              >
                {currentFeature.title}
              </Text>

              <Text
                style={[
                  styles.featureDescription,
                  { color: theme.colors.onSurfaceVariant || "#6B7280" },
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
                          ? theme.colors.onSurface || "#FFFFFF"
                          : (theme.colors.onSurface || "#FFFFFF") + "40",
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
                  { backgroundColor: theme.colors.surface || "#FFFFFF" },
                  shadows.md,
                ]}
                onPress={handleGetStarted}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Get started with Solace AI"
                accessibilityHint="Begin your mental wellness journey"
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.colors.primary || "#926247" },
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
                  borderColor: (theme.colors.onSurface || "#FFFFFF") + "60",
                  backgroundColor: (theme.colors.surface || "#FFFFFF") + "20",
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
                  { color: theme.colors.onSurface || "#FFFFFF" },
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
                { color: (theme.colors.onSurface || "#FFFFFF") + "80" },
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 32,
    minHeight: height * 0.5,
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 64,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  appSubtitle: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.9,
  },
  appDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.8,
    maxWidth: width * 0.85,
    paddingHorizontal: 16,
  },
  featureSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  featureCard: {
    width: width * 0.85,
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  featureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 48,
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: width * 0.7,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ctaSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  primaryButton: {
    width: width * 0.8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    width: width * 0.8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default CoverPageScreen;
