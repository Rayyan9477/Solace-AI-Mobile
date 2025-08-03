import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
} from "react-native";

import { MentalHealthIcon } from "../components/icons";
import { useTheme } from "../contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

// Inspirational quotes for loading states
const INSPIRATIONAL_QUOTES = [
  {
    text: "In the midst of winter, I found there was within me an invincible summer.",
    author: "ALBERT CAMUS",
  },
  {
    text: "The only way out is through.",
    author: "ROBERT FROST",
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "RALPH WALDO EMERSON",
  },
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. MILNE",
  },
];

// Loading messages
const LOADING_MESSAGES = [
  "Initializing your safe space...",
  "Preparing therapeutic resources...",
  "Setting up personalized experience...",
  "Fetching Data...",
  "Almost ready...",
];

const SplashScreen = ({ showQuote = false, onComplete = () => {} }) => {
  const { theme } = useTheme();
  const [currentQuote] = useState(
    () =>
      INSPIRATIONAL_QUOTES[
        Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)
      ],
  );
  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const quoteFadeAnim = useRef(new Animated.Value(0)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  // Animated styles
  const logoContainerStyle = useMemo(
    () => ({
      opacity: fadeAnim,
      transform: [
        { scale: scaleAnim },
        {
          rotate: logoRotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
          }),
        },
      ],
    }),
    [fadeAnim, scaleAnim, logoRotateAnim],
  );

  const fadeStyle = useMemo(
    () => ({
      opacity: fadeAnim,
    }),
    [fadeAnim],
  );

  const quoteFadeStyle = useMemo(
    () => ({
      opacity: quoteFadeAnim,
    }),
    [quoteFadeAnim],
  );

  const progressBarStyle = useMemo(
    () => ({
      width: progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
      }),
    }),
    [progressAnim],
  );

  // Get theme-appropriate gradient colors
  const getGradientColors = () => {
    if (showQuote) {
      return theme.isDark
        ? ["#8B4513", "#A0522D", "#CD853F"] // Dark orange theme
        : ["#FF8C00", "#FFA500", "#FFB84D"]; // Light orange theme
    }
    return theme.isDark
      ? ["#2E3B4E", "#1A1A1A", "#0A0A0A"] // Dark theme
      : ["#F8F9FA", "#E9ECEF", "#DEE2E6"]; // Light theme
  };

  useEffect(() => {
    // Start main animations
    Animated.sequence([
      // Logo entrance
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
      ]),
      // Quote fade in (if showing quote)
      ...(showQuote
        ? [
            Animated.timing(quoteFadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]
        : []),
    ]).start();

    // Logo rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    );

    // Start rotation after initial animation
    setTimeout(() => rotateAnimation.start(), 1000);

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

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    return () => {
      clearInterval(progressInterval);
      rotateAnimation.stop();
    };
  }, [showQuote, onComplete]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Logo Section */}
          <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
            {/* freud.ai Logo - 4 circles */}
            <View style={styles.logoIcon}>
              <View style={[styles.logoGrid]}>
                <View
                  style={[
                    styles.logoCircle,
                    { backgroundColor: theme.isDark ? "#8B4513" : "#CD853F" },
                  ]}
                />
                <View
                  style={[
                    styles.logoCircle,
                    { backgroundColor: theme.isDark ? "#A0522D" : "#8B4513" },
                  ]}
                />
                <View
                  style={[
                    styles.logoCircle,
                    { backgroundColor: theme.isDark ? "#A0522D" : "#8B4513" },
                  ]}
                />
                <View
                  style={[
                    styles.logoCircle,
                    { backgroundColor: theme.isDark ? "#8B4513" : "#CD853F" },
                  ]}
                />
              </View>
            </View>

            <Animated.Text
              style={[
                styles.appTitle,
                { color: theme.isDark ? "#FFFFFF" : "#2D3436" },
                fadeStyle,
              ]}
            >
              freud.ai
            </Animated.Text>

            {!showQuote && (
              <Animated.Text
                style={[
                  styles.appSubtitle,
                  { color: theme.isDark ? "#B2BEB5" : "#636E72" },
                  fadeStyle,
                ]}
              >
                Your mindful mental health AI companion for everyone, anywhere ✓
              </Animated.Text>
            )}
          </Animated.View>

          {/* Quote Section (for loading with quote) */}
          {showQuote && (
            <Animated.View style={[styles.quoteContainer, quoteFadeStyle]}>
              <View style={styles.quoteIcon}>
                <MentalHealthIcon
                  name="mindfulness"
                  size={24}
                  color={theme.isDark ? "#FFFFFF" : "#2D3436"}
                />
              </View>
              <Text
                style={[
                  styles.quoteText,
                  { color: theme.isDark ? "#FFFFFF" : "#2D3436" },
                ]}
              >
                "{currentQuote.text}"
              </Text>
              <Text
                style={[
                  styles.quoteAuthor,
                  { color: theme.isDark ? "#B2BEB5" : "#636E72" },
                ]}
              >
                — {currentQuote.author}
              </Text>
            </Animated.View>
          )}

          {/* Loading Section */}
          {!showQuote && (
            <Animated.View style={[styles.loadingContainer, fadeStyle]}>
              <Text
                style={[
                  styles.loadingText,
                  { color: theme.isDark ? "#B2BEB5" : "#636E72" },
                ]}
              >
                {currentMessage}
              </Text>

              <View
                style={[
                  styles.progressContainer,
                  {
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBar,
                    progressBarStyle,
                    { backgroundColor: theme.isDark ? "#FFFFFF" : "#2D3436" },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.progressText,
                  { color: theme.isDark ? "#B2BEB5" : "#636E72" },
                ]}
              >
                {Math.round(progress)}%
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Bottom Branding */}
        <Animated.View style={[styles.bottomContainer, fadeStyle]}>
          <Text
            style={[
              styles.brandingText,
              {
                color: theme.isDark
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(0,0,0,0.6)",
              },
            ]}
          >
            Powered by Therapeutic AI
          </Text>
        </Animated.View>
      </LinearGradient>
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
  logoIcon: {
    marginBottom: 24,
  },
  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 44,
    height: 44,
    justifyContent: "space-between",
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
    opacity: 0.9,
  },
  quoteContainer: {
    alignItems: "center",
    maxWidth: 300,
    marginBottom: 40,
  },
  quoteIcon: {
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 16,
    fontStyle: "italic",
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "center",
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
  progressContainer: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.7,
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
  },
});

// Export variations
export const QuoteSplashScreen = (props) => (
  <SplashScreen {...props} showQuote />
);

export const LoadingSplashScreen = (props) => (
  <SplashScreen {...props} showQuote={false} />
);

export default SplashScreen;
