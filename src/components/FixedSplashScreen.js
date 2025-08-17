import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Dimensions, StyleSheet, StatusBar } from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";
import GradientBackground from "./GradientBackground";
import LogoDisplay from "./LogoDisplay";
import ProgressIndicator from "./ProgressIndicator";

const { width, height } = Dimensions.get("window");

// Loading messages
const LOADING_MESSAGES = [
  "Initializing your safe space...",
  "Preparing therapeutic resources...",
  "Setting up personalized experience...",
  "Loading AI companion...",
  "Almost ready...",
];

const FixedSplashScreen = ({ onComplete = () => {} }) => {
  const { theme } = useFixedTheme();
  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start main animations
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

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(prev + increment, 100);

        // Update loading message
        const messageIndex = Math.floor(
          (newProgress / 100) * LOADING_MESSAGES.length,
        );
        setCurrentMessage(
          LOADING_MESSAGES[Math.min(messageIndex, LOADING_MESSAGES.length - 1)],
        );

        return newProgress;
      });
    }, 300);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onComplete, fadeAnim, scaleAnim]);

  const fadeStyle = {
    opacity: fadeAnim,
  };

  const logoContainerStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  return (
    <View style={styles.container}>
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
        style={styles.container}
      >
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Logo Section */}
          <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
            <LogoDisplay 
              size="large"
              showText={true}
              textStyle={{ color: "#FFFFFF" }}
            />
            
            <Animated.Text
              style={[
                styles.appSubtitle,
                { color: "#FFFFFF" },
                fadeStyle,
              ]}
            >
              Your mindful mental health AI companion
            </Animated.Text>
          </Animated.View>

          {/* Loading Section */}
          <Animated.View style={[styles.loadingContainer, fadeStyle]}>
            <Text style={[styles.loadingText, { color: "#FFFFFF" }]}>
              {currentMessage}
            </Text>

            <ProgressIndicator
              progress={progress}
              showPercentage={true}
              style={styles.progressIndicator}
              barStyle={{
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            />
          </Animated.View>
        </View>

        {/* Bottom Branding */}
        <Animated.View style={[styles.bottomContainer, fadeStyle]}>
          <Text style={styles.brandingText}>
            Powered by Therapeutic AI
          </Text>
        </Animated.View>
      </GradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
    opacity: 0.9,
    marginTop: 16,
  },
  loadingContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 280,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.8,
  },
  progressIndicator: {
    width: "100%",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  brandingText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
    color: "rgba(255,255,255,0.6)",
  },
});

export default FixedSplashScreen;