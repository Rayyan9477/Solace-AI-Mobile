/**
 * SplashScreen Component
 * @description App launch splash screen with logo and brand
 * @task Task 3.1.1: Splash Screen
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface SplashScreenProps {
  onComplete: () => void;
  delay?: number;
}

export function SplashScreen({ onComplete, delay = 2000 }: SplashScreenProps): React.ReactElement {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade-in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Auto-transition after delay
    const timer = setTimeout(() => {
      onComplete();
    }, delay);

    return () => clearTimeout(timer);
  }, [onComplete, delay, fadeAnim, scaleAnim]);

  return (
    <View testID="splash-screen" style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo - 4 circles in clover arrangement */}
        <View testID="app-logo" accessibilityLabel="Solace AI logo" style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <View style={[styles.circle, styles.circleTop]} />
          </View>
          <View style={styles.logoRow}>
            <View style={[styles.circle, styles.circleLeft]} />
            <View style={[styles.circle, styles.circleRight]} />
          </View>
          <View style={styles.logoRow}>
            <View style={[styles.circle, styles.circleBottom]} />
          </View>
        </View>

        {/* Brand Text */}
        <Text style={styles.brandText}>Solace AI</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  brandText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "400",
    letterSpacing: 1,
    marginTop: 16,
  },
  circle: {
    backgroundColor: "#A07856",
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  circleBottom: {
    backgroundColor: "#8B6F47",
  },
  circleLeft: {
    backgroundColor: "#8B6F47",
    marginRight: 4,
  },
  circleRight: {
    backgroundColor: "#A07856",
    marginLeft: 4,
  },
  circleTop: {
    backgroundColor: "#C19A6B",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#1C1410",
    flex: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
});

export default SplashScreen;
