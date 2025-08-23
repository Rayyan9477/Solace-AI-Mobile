import React, { useEffect, useRef, useMemo, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
} from "react-native";

import { FreudLogo } from "../components/icons/FreudIcons";
import { useTheme } from "../shared/theme/ThemeContext";
import { freudDarkTheme } from "../shared/theme/freudDarkTheme";

const { width, height } = Dimensions.get("window");

// Inspirational quotes for dark mode (matching design)
const DARK_INSPIRATIONAL_QUOTES = [
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
  {
    text: "The wound is the place where the Light enters you.",
    author: "RUMI",
  },
];

// Loading messages for dark mode
const DARK_LOADING_MESSAGES = [
  "Initializing your safe space...",
  "Preparing therapeutic resources...",
  "Setting up personalized experience...",
  "Fetching Data...",
  "🔗 Shake screen to interact!",
  "Almost ready...",
];

// Splash screen variants based on design reference
export const DarkSplashVariants = {
  LOGO: 'logo',           // Dark chocolate with logo
  PROGRESS: 'progress',   // Dark chocolate with circular progress
  QUOTE: 'quote',         // Orange background with quote
  LOADING: 'loading',     // Green background with "Fetching Data..."
};

const DarkSplashScreen = ({ 
  variant = DarkSplashVariants.LOGO, 
  onComplete = () => {},
  duration = 3000 
}) => {
  const { isDarkMode } = useTheme();
  const [currentQuote] = useState(
    () =>
      DARK_INSPIRATIONAL_QUOTES[
        Math.floor(Math.random() * DARK_INSPIRATIONAL_QUOTES.length)
      ],
  );
  const [currentMessage, setCurrentMessage] = useState(DARK_LOADING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const quoteFadeAnim = useRef(new Animated.Value(0)).current;
  const circularProgressAnim = useRef(new Animated.Value(0)).current;

  // Get variant-specific styling
  const getVariantConfig = () => {
    switch (variant) {
      case DarkSplashVariants.LOGO:
        return {
          gradient: [freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary],
          textColor: freudDarkTheme.colors.text.primary,
          logoColor: freudDarkTheme.colors.accent.primary,
          showLogo: true,
          showProgress: false,
          showQuote: false,
          statusBarStyle: 'light-content',
        };
      
      case DarkSplashVariants.PROGRESS:
        return {
          gradient: [freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary],
          textColor: freudDarkTheme.colors.text.primary,
          logoColor: freudDarkTheme.colors.accent.primary,
          showLogo: false,
          showProgress: true,
          showQuote: false,
          statusBarStyle: 'light-content',
        };
      
      case DarkSplashVariants.QUOTE:
        return {
          gradient: ['#E67E22', '#F39C12'],  // Orange gradient from design
          textColor: '#FFFFFF',
          logoColor: '#FFFFFF',
          showLogo: false,
          showProgress: false,
          showQuote: true,
          statusBarStyle: 'light-content',
        };
      
      case DarkSplashVariants.LOADING:
        return {
          gradient: ['#8B9F6F', '#9CB079'],  // Green gradient from design
          textColor: '#FFFFFF',
          logoColor: '#FFFFFF',
          showLogo: false,
          showProgress: false,
          showQuote: false,
          statusBarStyle: 'light-content',
        };
      
      default:
        return {
          gradient: [freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary],
          textColor: freudDarkTheme.colors.text.primary,
          logoColor: freudDarkTheme.colors.accent.primary,
          showLogo: true,
          showProgress: false,
          showQuote: false,
          statusBarStyle: 'light-content',
        };
    }
  };

  const config = getVariantConfig();

  // Animated styles
  const logoContainerStyle = useMemo(
    () => ({
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
    }),
    [fadeAnim, scaleAnim],
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

  const circularProgressStyle = useMemo(
    () => ({
      transform: [{
        rotate: circularProgressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      }],
    }),
    [circularProgressAnim],
  );

  useEffect(() => {
    // Start main animations
    Animated.sequence([
      // Initial fade in
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
      ...(config.showQuote
        ? [
            Animated.timing(quoteFadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]
        : []),
    ]).start();

    // Circular progress animation for progress variant
    if (config.showProgress) {
      Animated.loop(
        Animated.timing(circularProgressAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    }

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
          (newProgress / 100) * DARK_LOADING_MESSAGES.length,
        );
        setCurrentMessage(
          DARK_LOADING_MESSAGES[Math.min(messageIndex, DARK_LOADING_MESSAGES.length - 1)],
        );

        return newProgress;
      });
    }, 300);

    // Animate progress bar
    if (variant !== DarkSplashVariants.PROGRESS) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start();
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [variant, onComplete, duration]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={config.statusBarStyle}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Main Content */}
        <View style={styles.contentContainer}>
          
          {/* Logo Variant */}
          {config.showLogo && (
            <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
              <View style={styles.logoGrid}>
                <View style={[styles.logoCircle, { backgroundColor: config.logoColor }]} />
                <View style={[styles.logoCircle, { backgroundColor: config.logoColor, opacity: 0.7 }]} />
                <View style={[styles.logoCircle, { backgroundColor: config.logoColor, opacity: 0.5 }]} />
                <View style={[styles.logoCircle, { backgroundColor: config.logoColor, opacity: 0.3 }]} />
              </View>

              <Animated.Text
                style={[
                  styles.appTitle,
                  { color: config.textColor },
                  fadeStyle,
                ]}
              >
                freud.ai
              </Animated.Text>
            </Animated.View>
          )}

          {/* Progress Variant - Circular Progress */}
          {config.showProgress && (
            <Animated.View style={[styles.progressContainer, logoContainerStyle]}>
              <View style={styles.circularProgressContainer}>
                <Animated.View 
                  style={[styles.circularProgress, circularProgressStyle]}
                >
                  {/* Create circular progress rings */}
                  <View style={[styles.progressRing, styles.outerRing]} />
                  <View style={[styles.progressRing, styles.middleRing]} />
                  <View style={[styles.progressRing, styles.innerRing]} />
                </Animated.View>
                
                <View style={styles.progressCenter}>
                  <Text style={[styles.progressPercentage, { color: config.textColor }]}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Quote Variant */}
          {config.showQuote && (
            <Animated.View style={[styles.quoteContainer, quoteFadeStyle]}>
              <FreudLogo 
                size={48} 
                primaryColor={config.logoColor} 
              />
              <Text
                style={[
                  styles.quoteText,
                  { color: config.textColor },
                ]}
              >
                "{currentQuote.text}"
              </Text>
              <Text
                style={[
                  styles.quoteAuthor,
                  { color: config.textColor },
                ]}
              >
                — {currentQuote.author}
              </Text>
            </Animated.View>
          )}

          {/* Loading Variant */}
          {variant === DarkSplashVariants.LOADING && (
            <Animated.View style={[styles.loadingContainer, fadeStyle]}>
              <Text
                style={[
                  styles.loadingTitle,
                  { color: config.textColor },
                ]}
              >
                Fetching Data...
              </Text>
              <Text
                style={[
                  styles.loadingSubtitle,
                  { color: config.textColor },
                ]}
              >
                🔗 Shake screen to interact!
              </Text>
              
              {/* Animated dots loading indicator */}
              <View style={styles.dotsContainer}>
                <View style={[styles.dot, { backgroundColor: config.textColor }]} />
                <View style={[styles.dot, { backgroundColor: config.textColor }]} />
                <View style={[styles.dot, { backgroundColor: config.textColor }]} />
              </View>
            </Animated.View>
          )}

          {/* Standard Loading with Progress Bar */}
          {!config.showQuote && !config.showProgress && variant !== DarkSplashVariants.LOADING && (
            <Animated.View style={[styles.standardLoadingContainer, fadeStyle]}>
              <Text
                style={[
                  styles.loadingText,
                  { color: config.textColor },
                ]}
              >
                {currentMessage}
              </Text>

              <View
                style={[
                  styles.progressBarContainer,
                  {
                    backgroundColor: `${config.textColor}20`,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBar,
                    progressBarStyle,
                    { backgroundColor: config.logoColor },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.progressText,
                  { color: config.textColor },
                ]}
              >
                {Math.round(progress)}%
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Bottom Indicator */}
        <Animated.View style={[styles.bottomContainer, fadeStyle]}>
          <View style={[styles.homeIndicator, { backgroundColor: `${config.textColor}40` }]} />
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
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  
  // Logo variant styles
  logoContainer: {
    alignItems: "center",
  },
  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 60,
    height: 60,
    justifyContent: "space-between",
    marginBottom: freudDarkTheme.spacing[8],
  },
  logoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: freudDarkTheme.spacing[1],
  },
  appTitle: {
    fontSize: freudDarkTheme.typography.sizes["5xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    textAlign: "center",
    letterSpacing: -0.5,
  },

  // Progress variant styles
  progressContainer: {
    alignItems: "center",
  },
  circularProgressContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circularProgress: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  progressRing: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#5A3D28",
  },
  outerRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    top: 0,
    left: 0,
  },
  middleRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 25,
    left: 25,
  },
  innerRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    top: 50,
    left: 50,
  },
  progressCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
  },

  // Quote variant styles
  quoteContainer: {
    alignItems: "center",
    maxWidth: width - 80,
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  quoteText: {
    fontSize: freudDarkTheme.typography.sizes.xl,
    fontWeight: freudDarkTheme.typography.weights.medium,
    textAlign: "center",
    lineHeight: freudDarkTheme.typography.sizes.xl * 1.4,
    marginVertical: freudDarkTheme.spacing[6],
  },
  quoteAuthor: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    letterSpacing: 1.2,
    textAlign: "center",
    opacity: 0.9,
  },

  // Loading variant styles
  loadingContainer: {
    alignItems: "center",
  },
  loadingTitle: {
    fontSize: freudDarkTheme.typography.sizes["3xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[2],
  },
  loadingSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    fontWeight: freudDarkTheme.typography.weights.medium,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: freudDarkTheme.spacing[8],
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Standard loading styles
  standardLoadingContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
  },
  loadingText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.normal,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[6],
    opacity: 0.8,
  },
  progressBarContainer: {
    width: "100%",
    height: 4,
    borderRadius: freudDarkTheme.borderRadius.sm,
    overflow: "hidden",
    marginBottom: freudDarkTheme.spacing[3],
  },
  progressBar: {
    height: "100%",
    borderRadius: freudDarkTheme.borderRadius.sm,
  },
  progressText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    opacity: 0.7,
  },

  // Bottom container
  bottomContainer: {
    position: "absolute",
    bottom: freudDarkTheme.spacing[8],
    left: 0,
    right: 0,
    alignItems: "center",
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: freudDarkTheme.borderRadius.full,
  },
});

// Export all variants
export const LogoDarkSplashScreen = (props) => (
  <DarkSplashScreen {...props} variant={DarkSplashVariants.LOGO} />
);

export const ProgressDarkSplashScreen = (props) => (
  <DarkSplashScreen {...props} variant={DarkSplashVariants.PROGRESS} />
);

export const QuoteDarkSplashScreen = (props) => (
  <DarkSplashScreen {...props} variant={DarkSplashVariants.QUOTE} />
);

export const LoadingDarkSplashScreen = (props) => (
  <DarkSplashScreen {...props} variant={DarkSplashVariants.LOADING} />
);

export default DarkSplashScreen;