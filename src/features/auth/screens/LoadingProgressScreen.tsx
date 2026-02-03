/**
 * LoadingProgressScreen Component
 * @description Loading screen with progress percentage and decorative circles
 * @task Task 3.1.2: Loading Progress Screen
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../shared/theme";

interface LoadingProgressScreenProps {
  progress: number;
  onComplete: () => void;
}

export function LoadingProgressScreen({
  progress,
  onComplete,
}: LoadingProgressScreenProps): React.ReactElement {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  useEffect(() => {
    if (clampedProgress >= 100) {
      onComplete();
    }
  }, [clampedProgress, onComplete]);

  return (
    <View testID="loading-progress-screen" style={styles.container}>
      {/* Decorative Circles */}
      <View testID="decorative-circles" style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.circleTopLeft]} />
        <View style={[styles.circle, styles.circleTopRight]} />
        <View style={[styles.circle, styles.circleLeftCenter]} />
        <View style={[styles.circle, styles.circleBottomLeft]} />
        <View style={[styles.circle, styles.circleBottomCenter]} />
      </View>

      {/* Progress Percentage */}
      <Text style={styles.progressText}>{clampedProgress}%</Text>
    </View>
  );
}

const CIRCLE_SIZE = 400;

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.background.tertiary,
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    opacity: 0.5,
    position: "absolute",
    width: CIRCLE_SIZE,
  },
  circleBottomCenter: {
    bottom: -CIRCLE_SIZE / 2,
    left: "50%",
    marginLeft: -CIRCLE_SIZE / 2,
  },
  circleBottomLeft: {
    bottom: -CIRCLE_SIZE / 2,
    left: -CIRCLE_SIZE / 2,
  },
  circleLeftCenter: {
    left: -CIRCLE_SIZE / 2,
    top: "40%",
  },
  circleTopLeft: {
    left: -CIRCLE_SIZE / 3,
    top: -CIRCLE_SIZE / 2,
  },
  circleTopRight: {
    right: -CIRCLE_SIZE / 2,
    top: -CIRCLE_SIZE / 3,
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.background.primary,
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  decorativeCircles: {
    ...StyleSheet.absoluteFillObject,
  },
  progressText: {
    color: colors.text.primary,
    fontSize: 64,
    fontWeight: "700",
    zIndex: 10,
  },
});

export default LoadingProgressScreen;
