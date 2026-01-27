/**
 * QuoteSplashScreen Component
 * @description Inspirational quote interstitial screen
 * @task Task 3.1.3: Quote Splash Screen
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface QuoteSplashScreenProps {
  quote: string;
  author: string;
  onComplete: () => void;
  delay?: number;
}

export function QuoteSplashScreen({
  quote,
  author,
  onComplete,
  delay = 3000,
}: QuoteSplashScreenProps): React.ReactElement {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Auto-transition after delay
    const timer = setTimeout(() => {
      onComplete();
    }, delay);

    return () => clearTimeout(timer);
  }, [onComplete, delay, fadeAnim]);

  return (
    <View testID="quote-splash-screen" style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Small Logo */}
        <View testID="quote-logo" style={styles.logoContainer}>
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

        {/* Quote Text */}
        <Text
          testID="quote-text"
          style={styles.quoteText}
          accessibilityLabel={`Quote: ${quote}`}
          accessibilityRole="text"
        >
          "{quote}"
        </Text>

        {/* Author Attribution */}
        <Text style={styles.authorText}>— {author.toUpperCase()}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  authorText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: 32,
  },
  circle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 16,
    width: 16,
  },
  circleBottom: {
    opacity: 0.9,
  },
  circleLeft: {
    marginRight: 2,
    opacity: 0.8,
  },
  circleRight: {
    marginLeft: 2,
  },
  circleTop: {
    opacity: 0.9,
  },
  container: {
    backgroundColor: "#E8853A",
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
    paddingTop: 120,
  },
  logoContainer: {
    alignItems: "flex-start",
    marginBottom: 48,
  },
  logoRow: {
    flexDirection: "row",
    marginVertical: 1,
  },
  quoteText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontStyle: "italic",
    fontWeight: "700",
    lineHeight: 44,
  },
});

export default QuoteSplashScreen;
