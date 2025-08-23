import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
} from "react-native";

import { MentalHealthIcon } from "../components/icons";
import { useTheme } from "../shared/theme/ThemeContext";

const { width, height } = Dimensions.get("window");

const LoadingScreen = ({
  message = "Fetching Data...",
  showProgress = true,
  variant = "default",
  onComplete = () => {},
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [progress, setProgress] = useState(0);
  const [shakeToInteract, setShakeToInteract] = useState(false);

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
    switch (variant) {
      case "percentage":
        return {
          gradientColors: theme.isDark
            ? ["#4A5568", "#2D3748", "#1A202C"]
            : ["#E2E8F0", "#CBD5E0", "#A0AEC0"],
          showCircles: true,
          showShake: false,
        };
      case "quote":
        return {
          gradientColors: theme.isDark
            ? ["#8B4513", "#A0522D", "#CD853F"]
            : ["#FF8C00", "#FFA500", "#FFB84D"],
          showCircles: false,
          showShake: false,
        };
      case "shake":
        return {
          gradientColors: theme.isDark
            ? ["#4A5568", "#2D3748", "#1A202C"]
            : ["#90CDB0", "#A8E6CF", "#7FCDCD"],
          showCircles: false,
          showShake: true,
        };
      default:
        return {
          gradientColors: theme.isDark
            ? ["#2D3748", "#4A5568", "#718096"]
            : ["#F7FAFC", "#EDF2F7", "#E2E8F0"],
          showCircles: false,
          showShake: false,
        };
    }
  };

  const variantStyles = getVariantStyles();

  useEffect(() => {
    if (isReducedMotionEnabled) {
      // Skip animations for reduced motion
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
      pulseAnim.setValue(1);
      return;
    }

    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    // Circle animations for percentage variant
    const circleAnimation1 = Animated.loop(
      Animated.timing(circleAnim1, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    );

    const circleAnimation2 = Animated.loop(
      Animated.timing(circleAnim2, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    );

    // Shake animation for interactive variant
    const shakeAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ]),
    );

    pulseAnimation.start();
    if (variantStyles.showCircles) {
      circleAnimation1.start();
      circleAnimation2.start();
    }
    if (variantStyles.showShake) {
      setShakeToInteract(true);
      setTimeout(() => shakeAnimation.start(), 2000);
    }

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 99;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);

    // Progress bar animation
    if (showProgress) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();
    }

    return () => {
      clearInterval(progressInterval);
      pulseAnimation.stop();
      circleAnimation1.stop();
      circleAnimation2.stop();
      shakeAnimation.stop();
    };
  }, [variant, showProgress, onComplete]);

  // Animation interpolations
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const shakeTransform = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-5, 0, 5],
  });

  const circle1Transform = circleAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 30, 0],
  });

  const circle2Transform = circleAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -20, 0],
  });

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
        {/* Background animated circles for percentage variant */}
        {variantStyles.showCircles && (
          <>
            <Animated.View
              style={[
                styles.backgroundCircle,
                styles.circle1,
                {
                  transform: [{ translateY: circle1Transform }],
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            />
            <Animated.View
              style={[
                styles.backgroundCircle,
                styles.circle2,
                {
                  transform: [{ translateY: circle2Transform }],
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
                },
              ]}
            />
          </>
        )}

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Main Loading Section */}
          <Animated.View
            style={[
              styles.logoSection,
              variantStyles.showShake && {
                transform: [{ translateX: shakeTransform }],
              },
            ]}
          >
            {/* freud.ai Logo */}
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.logoGrid}>
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
            </Animated.View>

            {/* Percentage Display for percentage variant */}
            {variant === "percentage" && (
              <Animated.Text
                style={[
                  styles.percentageText,
                  { color: theme.isDark ? "#FFFFFF" : "#2D3436" },
                ]}
              >
                {Math.round(progress)}%
              </Animated.Text>
            )}
          </Animated.View>

          {/* Loading Message */}
          <Animated.Text
            style={[
              styles.messageText,
              {
                color: theme.isDark ? "#FFFFFF" : "#2D3436",
                opacity: fadeAnim,
              },
            ]}
          >
            {message}
          </Animated.Text>

          {/* Shake to interact message */}
          {shakeToInteract && (
            <Animated.View
              style={[styles.shakeContainer, { opacity: fadeAnim }]}
            >
              <View style={styles.shakeIcon}>
                <Text style={styles.shakeEmoji}>📱</Text>
              </View>
              <Text
                style={[
                  styles.shakeText,
                  { color: theme.isDark ? "#B2BEB5" : "#636E72" },
                ]}
              >
                🔐 Shake screen to interact!
              </Text>
            </Animated.View>
          )}

          {/* Progress Bar */}
          {showProgress && variant !== "percentage" && (
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
                  {
                    width: progressWidth,
                    backgroundColor: theme.isDark ? "#FFFFFF" : "#2D3436",
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

const LoadingDot = ({ delay, color }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [delay]);

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
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
  percentageText: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
  },
  messageText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
    lineHeight: 24,
  },
  shakeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  shakeIcon: {
    marginBottom: 8,
  },
  shakeEmoji: {
    fontSize: 24,
  },
  shakeText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
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
  backgroundCircle: {
    position: "absolute",
    borderRadius: 150,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    left: -50,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    right: -30,
  },
});

// Export different loading variants
export const PercentageLoadingScreen = (props) => (
  <LoadingScreen {...props} variant="percentage" message="99%" />
);

export const QuoteLoadingScreen = (props) => (
  <LoadingScreen {...props} variant="quote" showProgress={false} />
);

export const ShakeLoadingScreen = (props) => (
  <LoadingScreen {...props} variant="shake" message="Fetching Data..." />
);

export default LoadingScreen;
