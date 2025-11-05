import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";

// Mock accessibility hook
const useAccessibility = () => ({});

const { width, height } = Dimensions.get("window");

const LoadingScreen = ({
  message = "Loading...",
  showProgress = true,
  variant = "default",
  onComplete = () => {},
  testID = "loading-screen",
}) => {
  const { theme } = useTheme();
  const { isReduceMotionEnabled } = useAccessibility();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const circleAnim1 = useRef(new Animated.Value(0)).current;
  const circleAnim2 = useRef(new Animated.Value(0)).current;

  // Get variant-specific styling
  const getVariantStyles = () => {
    const darkMode = theme.isDark;

    switch (variant) {
      case "therapeutic":
        return {
          gradientColors: darkMode
            ? ["#2D3748", "#4A5568", "#718096"]
            : ["#E5EAD7", "#F2F5EB", "#FFF6E2"],
          showProgress: true,
          therapeutic: true,
        };
      case "crisis":
        return {
          gradientColors: darkMode
            ? ["#742A2A", "#C53030", "#E53E3E"]
            : ["#FED7D7", "#FEB2B2", "#FC8181"],
          showProgress: false,
          crisis: true,
        };
      case "minimal":
        return {
          gradientColors: [
            theme.colors.background || "#FFFFFF",
            theme.colors.background || "#FFFFFF",
          ],
          showProgress: false,
          minimal: true,
        };
      default:
        return {
          gradientColors: darkMode
            ? ["#2D3748", "#4A5568", "#718096"]
            : ["#F7FAFC", "#EDF2F7", "#E2E8F0"],
          showProgress: true,
          therapeutic: false,
        };
    }
  };

  const variantStyles = getVariantStyles();

  useEffect(() => {
    let isMounted = true;

    if (isReduceMotionEnabled) {
      // Skip animations for reduced motion
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
      pulseAnim.setValue(1);
      return;
    }

    // Start entrance animations
    if (isMounted) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Gentle pulse animation for therapeutic effect
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    if (isMounted) {
      pulseAnimation.start();
    }

    // Progress simulation - more realistic timing for therapeutic apps
    let progressInterval;
    if (showProgress) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (!isMounted) return prev;

          if (prev >= 95) {
            clearInterval(progressInterval);
            setTimeout(() => {
              if (isMounted) onComplete();
            }, 800);
            return 95;
          }
          return Math.min(prev + Math.random() * 5 + 1, 95);
        });
      }, 300);
    }

    return () => {
      isMounted = false;
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      pulseAnimation.stop();
    };
  }, [variant, showProgress, onComplete, isReduceMotionEnabled]);

  // Show error state if there's an error
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Something went wrong
          </Text>
          <Text
            style={[styles.errorMessage, { color: theme.colors.onSurface }]}
          >
            {error.message || "Please try again"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={variantStyles.gradientColors}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={`Loading: ${message}`}
          accessibilityValue={
            showProgress ? { now: progress, min: 0, max: 100 } : undefined
          }
          testID={testID}
        >
          {/* Main Loading Section */}
          <Animated.View style={styles.logoSection}>
            {/* Loading Indicator */}
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {variantStyles.minimal ? (
                <ActivityIndicator
                  size="large"
                  color={theme.colors.primary}
                  accessibilityLabel="Loading indicator"
                />
              ) : (
                <View style={styles.logoGrid}>
                  <View
                    style={[
                      styles.logoCircle,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.logoCircle,
                      {
                        backgroundColor:
                          theme.colors.primaryDark || theme.colors.primary,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.logoCircle,
                      {
                        backgroundColor:
                          theme.colors.primaryDark || theme.colors.primary,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.logoCircle,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                </View>
              )}
            </Animated.View>

            {/* Progress Display */}
            {showProgress && variant !== "minimal" && (
              <Text
                style={[styles.progressText, { color: theme.colors.onSurface }]}
              >
                {Math.round(progress)}%
              </Text>
            )}
          </Animated.View>

          {/* Loading Message */}
          <Animated.Text
            style={[
              styles.messageText,
              {
                color: theme.colors.onSurface,
                opacity: fadeAnim,
              },
            ]}
            accessibilityLiveRegion="polite"
          >
            {message}
          </Animated.Text>

          {/* Progress Bar */}
          {showProgress && variant !== "minimal" && (
            <View
              style={[
                styles.progressContainer,
                {
                  backgroundColor:
                    theme.colors.surfaceVariant || "rgba(0,0,0,0.1)",
                },
              ]}
            >
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${progress}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
          )}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
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
  progressText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
  },
  messageText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  progressContainer: {
    width: 220,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});

// Export different loading variants for therapeutic contexts
export const TherapeuticLoadingScreen = (props) => (
  <LoadingScreen {...props} variant="therapeutic" />
);

export const CrisisLoadingScreen = (props) => (
  <LoadingScreen
    {...props}
    variant="crisis"
    message="Connecting to emergency support..."
    showProgress={false}
  />
);

export const MinimalLoadingScreen = (props) => (
  <LoadingScreen {...props} variant="minimal" showProgress={false} />
);

export default LoadingScreen;
