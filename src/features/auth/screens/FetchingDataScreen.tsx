/**
 * FetchingDataScreen Component
 * @description Data fetching screen with shake hint and decorative circles
 * @task Task 3.1.4: Fetching Data Screen
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors, palette } from "../../../shared/theme";

interface FetchingDataScreenProps {
  onComplete: () => void;
  delay?: number;
}

export function FetchingDataScreen({
  onComplete,
  delay = 2500,
}: FetchingDataScreenProps): React.ReactElement {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Pulse animation for dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-transition after delay
    const timer = setTimeout(() => {
      onComplete();
    }, delay);

    return () => clearTimeout(timer);
  }, [onComplete, delay, fadeAnim, pulseAnim]);

  return (
    <View
      testID="fetching-data-screen"
      style={styles.container}
      accessibilityLabel="Fetching data, please wait"
    >
      {/* Decorative Circles */}
      <View testID="decorative-circles" style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.circleTopRight]} />
        <View style={[styles.circle, styles.circleMiddleRight]} />
        <View style={[styles.circle, styles.circleBottomLeft]} />
        <View style={[styles.circle, styles.circleBottomCenter]} />
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.fetchingText}>Fetching Data...</Text>

        <View style={styles.hintContainer}>
          <View testID="shake-icon" style={styles.shakeIcon}>
            <Text style={styles.shakeIconText}>📱</Text>
          </View>
          <Text style={styles.hintText}>Shake screen to interact!</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const CIRCLE_SIZE = 300;

const styles = StyleSheet.create({
  circle: {
    backgroundColor: palette.olive[600],
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    opacity: 0.6,
    position: "absolute",
    width: CIRCLE_SIZE,
  },
  circleBottomCenter: {
    bottom: -CIRCLE_SIZE / 3,
    left: "30%",
  },
  circleBottomLeft: {
    bottom: -CIRCLE_SIZE / 4,
    left: -CIRCLE_SIZE / 3,
  },
  circleMiddleRight: {
    right: -CIRCLE_SIZE / 3,
    top: "45%",
  },
  circleTopRight: {
    right: -CIRCLE_SIZE / 3,
    top: -CIRCLE_SIZE / 3,
  },
  container: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
    zIndex: 10,
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
  },
  fetchingText: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 16,
  },
  hintContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  hintText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  shakeIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  shakeIconText: {
    fontSize: 20,
  },
});

export default FetchingDataScreen;
