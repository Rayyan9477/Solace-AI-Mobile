import { useTheme } from "@theme/ThemeProvider";
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
import { FreudLogo } from "../components/icons/FreudIcons";
import { colors } from "../shared/theme/colors";
import {
  spacing,
  typography,
  borderRadius,
  shadows,
} from "../shared/theme/theme";

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

  // CRITICAL FIX: Use imported colors instead of undefined freudtheme variable
  // Get theme-appropriate gradient colors following Freud design references
  const getGradientColors = (): string[] => {
    if (showQuote) {
      return [
        colors.orange?.[50] || "#FFF7ED", // Empathy Orange from design reference
        colors.orange?.[40] || "#FFEDD5",
      ];
    }
    return [
      "#FFFFFF", // Clean white background like design reference
      colors.gray?.[10] || "#F9FAFB",
    ];
  };

  useEffect(() => {
    // LOW-016 FIX: Store timeout IDs for proper cleanup
    let rotationTimeoutId: NodeJS.Timeout | null = null;
    let completionTimeoutId: NodeJS.Timeout | null = null;

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

    // LOW-016 FIX: Store timeout ID for cleanup
    // Start rotation after initial animation
    rotationTimeoutId = setTimeout(() => rotateAnimation.start(), 1000);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // LOW-016 FIX: Store completion timeout ID for cleanup
          completionTimeoutId = setTimeout(onComplete, 500);
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

    // LOW-016 FIX: Comprehensive cleanup for all timers
    return () => {
      clearInterval(progressInterval);
      rotateAnimation.stop();
      if (rotationTimeoutId) {
        clearTimeout(rotationTimeoutId);
      }
      if (completionTimeoutId) {
        clearTimeout(completionTimeoutId);
      }
    };
  }, [showQuote, onComplete]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={showQuote ? "light-content" : "dark-content"}
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
          {/* Logo Section - Freud Design System */}
          {/* CRITICAL FIX: Use theme from useTheme() instead of undefined freudTheme */}
          <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
            <FreudLogo size={80} primaryColor={colors.brown?.[80] || "#78350F"} />

            <Animated.Text
              style={[
                styles.appTitle,
                {
                  color: showQuote
                    ? "#FFFFFF"
                    : theme.colors?.text?.primary || "#1F2937",
                },
                fadeStyle,
              ]}
            >
              freud.ai
            </Animated.Text>

            {!showQuote && (
              <Animated.Text
                style={[
                  styles.appSubtitle,
                  { color: theme.colors?.text?.secondary || "#6B7280" },
                  fadeStyle,
                ]}
              >
                Your mindful mental health AI companion for everyone, anywhere ✓
              </Animated.Text>
            )}
          </Animated.View>

          {/* Quote Section - Orange Background like Design Reference */}
          {showQuote && (
            <Animated.View style={[styles.quoteContainer, quoteFadeStyle]}>
              <FreudLogo
                size={48}
                primaryColor="#FFFFFF"
              />
              <Text
                style={[
                  styles.quoteText,
                  {
                    color: "#FFFFFF",
                  },
                ]}
              >
                "{currentQuote.text}"
              </Text>
              <Text
                style={[
                  styles.quoteAuthor,
                  {
                    color: "#FFFFFF",
                    opacity: 0.9,
                  },
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
                  { color: theme.colors.text.secondary },
                ]}
              >
                {currentMessage}
              </Text>

              <View
                style={[
                  styles.progressContainer,
                  {
                    backgroundColor: theme.colors.background.disabled,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressBar,
                    progressBarStyle,
                    { backgroundColor: theme.colors.primary["500"] },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.progressText,
                  { color: theme.colors.text.secondary },
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
              { color: theme.colors.text.quaternary },
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
    paddingHorizontal: spacing[10],
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing[15],
  },
  logoIcon: {
    marginBottom: spacing[6],
  },
  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: spacing[11],
    height: spacing[11],
    justifyContent: "space-between",
  },
  logoCircle: {
    width: spacing[5],
    height: spacing[5],
    borderRadius: borderRadius.full,
    marginBottom: spacing[1],
  },
  // CRITICAL FIX: Use imported typography and spacing instead of undefined freudTheme
  appTitle: {
    fontSize: typography.sizes.heading2xl?.fontSize || 30,
    fontWeight: typography.weights.bold || "700",
    fontFamily: typography.fontFamily.primary,
    textAlign: "center",
    marginTop: spacing[6],
    marginBottom: spacing[2],
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: typography.sizes.textMd?.fontSize || 16,
    fontWeight: typography.weights.medium || "500",
    fontFamily: typography.fontFamily.primary,
    textAlign: "center",
    maxWidth: 280,
    opacity: 0.9,
  },
  quoteContainer: {
    alignItems: "center",
    maxWidth: 300,
    marginBottom: spacing[10],
  },
  quoteIcon: {
    marginBottom: spacing[4],
  },
  quoteText: {
    fontSize: typography.sizes.headingLg?.fontSize || 20,
    fontWeight: typography.weights.medium || "500",
    fontFamily: typography.fontFamily.primary,
    textAlign: "center",
    lineHeight: typography.sizes.headingLg?.lineHeight || 28,
    marginTop: spacing[8],
    marginBottom: spacing[6],
    paddingHorizontal: spacing[12],
  },
  quoteAuthor: {
    fontSize: typography.sizes.textSm?.fontSize || 14,
    fontWeight: typography.weights.semibold || "600",
    fontFamily: typography.fontFamily.primary,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: spacing[70],
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    textAlign: "center",
    marginBottom: spacing[6],
    opacity: 0.8,
  },
  progressContainer: {
    width: "100%",
    height: spacing[1],
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    marginBottom: spacing[3],
  },
  progressBar: {
    height: "100%",
    borderRadius: borderRadius.sm,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    opacity: 0.7,
  },
  bottomContainer: {
    position: "absolute",
    bottom: spacing[12],
    left: 0,
    right: 0,
    alignItems: "center",
  },
  brandingText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    letterSpacing: 0.5,
  },
});

// LOW-013 FIX: Add TypeScript interface for props
interface SplashScreenProps {
  showQuote?: boolean;
  onComplete?: () => void;
}

// LOW-013 FIX: Add displayName for main component
SplashScreen.displayName = "SplashScreen";

// Export variations with proper TypeScript types
export const QuoteSplashScreen: React.FC<Omit<SplashScreenProps, "showQuote">> = (props) => (
  <SplashScreen {...props} showQuote />
);
QuoteSplashScreen.displayName = "QuoteSplashScreen";

export const LoadingSplashScreen: React.FC<Omit<SplashScreenProps, "showQuote">> = (props) => (
  <SplashScreen {...props} showQuote={false} />
);
LoadingSplashScreen.displayName = "LoadingSplashScreen";

export default SplashScreen;
