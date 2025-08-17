import React, { useEffect, useRef, useState } from "react";
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

import { useFixedTheme } from "./FixedThemeProvider";
import GradientBackground from "./GradientBackground";
import LogoDisplay from "./LogoDisplay";
import FeatureCard from "./FeatureCard";
import AnimatedButton from "./AnimatedButton";

const { width, height } = Dimensions.get("window");

const FixedCoverScreen = ({ onGetStarted = () => {}, onLearnMore = () => {} }) => {
  const { theme } = useFixedTheme();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Feature highlights for the cover page
  const features = [
    {
      id: 1,
      icon: "🧠",
      title: "AI-Powered Support",
      description: "Intelligent conversations that understand your emotions",
      color: theme.colors.therapeutic?.empathy?.[500] || "#C96100",
    },
    {
      id: 2,
      icon: "💚",
      title: "Mental Wellness",
      description: "Track your mood and build healthy mental habits",
      color: theme.colors.therapeutic?.zen?.[500] || "#EDA600",
    },
    {
      id: 3,
      icon: "🔒",
      title: "Private & Secure",
      description: "Your conversations remain completely confidential",
      color: theme.colors.therapeutic?.kind?.[500] || "#6C53F3",
    },
    {
      id: 4,
      icon: "📊",
      title: "Progress Insights",
      description: "Beautiful analytics to track your mental health journey",
      color: theme.colors.primary || "#926247",
    },
  ];

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

    // Auto-cycle through features
    const featureCycleInterval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);

    return () => {
      clearInterval(featureCycleInterval);
    };
  }, [fadeAnim, slideAnim, scaleAnim, features.length]);

  const currentFeature = features[currentFeatureIndex];

  const animatedHeaderStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
  };

  const animatedContentStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <GradientBackground
        colors={[
          theme.colors.therapeutic?.empathy?.[600] || "#C96100",
          theme.colors.therapeutic?.zen?.[500] || "#EDA600",
          theme.colors.therapeutic?.kind?.[400] || "#9654F5",
        ]}
        style={styles.gradientBackground}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <Animated.View style={[styles.heroSection, animatedHeaderStyle]}>
            <LogoDisplay 
              size="large"
              showText={true}
              textStyle={{ color: "#FFFFFF" }}
              style={styles.logoContainer}
            />

            <Text style={[styles.appSubtitle, { color: "#FFFFFF" }]}>
              Your Empathetic Digital Companion
            </Text>

            <Text style={[styles.appDescription, { color: "#FFFFFF" }]}>
              Experience personalized mental health support powered by advanced AI technology
            </Text>
          </Animated.View>

          {/* Feature Highlight */}
          <Animated.View style={[styles.featureSection, animatedContentStyle]}>
            <FeatureCard
              icon={currentFeature.icon}
              title={currentFeature.title}
              description={currentFeature.description}
              color={currentFeature.color}
              style={[
                styles.featureCard,
                { backgroundColor: theme.colors.background?.primary || "#FFFFFF" },
              ]}
            />

            {/* Feature Dots Indicator */}
            <View style={styles.dotsContainer}>
              {features.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentFeatureIndex
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.4)",
                    },
                  ]}
                  onPress={() => setCurrentFeatureIndex(index)}
                />
              ))}
            </View>
          </Animated.View>

          {/* Call-to-Action Section */}
          <Animated.View style={[styles.ctaSection, animatedContentStyle]}>
            <AnimatedButton
              title="Get Started"
              onPress={onGetStarted}
              variant="primary"
              size="large"
              animated={true}
              style={styles.primaryButton}
            />

            <AnimatedButton
              title="Learn More"
              onPress={onLearnMore}
              variant="secondary"
              size="large"
              animated={false}
              style={styles.secondaryButton}
            />
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, animatedContentStyle]}>
            <Text style={styles.footerText}>
              Start your mental wellness journey today
            </Text>
          </Animated.View>
        </ScrollView>
      </GradientBackground>
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
  },
  appSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
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
    marginBottom: 24,
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
    marginBottom: 16,
  },
  secondaryButton: {
    width: width * 0.8,
  },
  footer: {
    alignItems: "center",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
  },
});

export default FixedCoverScreen;