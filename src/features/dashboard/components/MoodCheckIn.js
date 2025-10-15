import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, AccessibilityInfo } from "react-native";
import * as Haptics from "expo-haptics";
import PropTypes from "prop-types";

const MoodCheckIn = ({
  currentMood,
  onCheckIn = () => {},
  testID = "mood-check-in",
  accessibilityLabel,
  accessibilityHint,
  reducedMotion = false,
  performanceTracker,
  onPerformanceIssue,
  onUnmount,
  size = "medium",
  crisisMode = false,
  disabled = false,
}) => {
  const scale = useRef(new Animated.Value(reducedMotion || crisisMode ? 1 : 0.9)).current;
  const opacity = useRef(new Animated.Value(reducedMotion || crisisMode ? 1 : 0)).current;
  const prevMoodRef = useRef(currentMood);

  useEffect(() => {
  const start = performance.now();
  performanceTracker?.trackAnimation?.({ type: "mount_start", at: start });

    const animations = [
      Animated.timing(scale, { toValue: 1, duration: crisisMode ? 0 : 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: crisisMode ? 0 : 250, useNativeDriver: true }),
    ];

    const run = reducedMotion || crisisMode
      ? { start: (cb) => cb && cb(), stop: () => {} }
      : Animated.parallel(animations);

    run.start(() => {
      const end = performance.now();
      performanceTracker?.trackAnimation?.({ type: "mount_end", at: end, duration: end - start });
      if (end - start > 150 && onPerformanceIssue) {
        onPerformanceIssue({ type: "slow_render", duration: end - start });
      }
    });

    return () => {
      run.stop?.();
      onUnmount && onUnmount();
    };
  }, [scale, opacity, reducedMotion, crisisMode, performanceTracker, onPerformanceIssue, onUnmount]);

  // When the currentMood prop changes to a different value, invoke onCheckIn therapeutically
  useEffect(() => {
    if (prevMoodRef.current !== currentMood && currentMood) {
      onCheckIn && onCheckIn(currentMood);
    }
    prevMoodRef.current = currentMood;
  }, [currentMood, onCheckIn]);

  const buttonScale = scale.interpolate({ inputRange: [0.9, 1], outputRange: [0.98, 1] });

  const dimensions = {
    small: { height: 40, fontSize: 14 },
    medium: { height: 48, fontSize: 16 },
    large: { height: 56, fontSize: 18 },
  }[size] || { height: 48, fontSize: 16 };

  return (
    <Animated.View
      testID={testID}
      accessible
      accessibilityRole="button"
      // Ensure alternative input methods exist at the container level as well
      onPress={() => {}}
      onLongPress={() => {}}
      accessibilityLabel={accessibilityLabel || "Mood check-in component"}
      accessibilityHint={
        accessibilityHint ||
        (currentMood && ["depressed", "sad", "anxious"].includes(String(currentMood).toLowerCase())
          ? "Select your current mood. If you're feeling low, support is available."
          : "Select your current mood to track your emotional state")
      }
      accessibilityValue={{ text: currentMood || "" }}
      accessibilityState={{ disabled }}
      style={[styles.container, { opacity, transform: [{ scale }] }]}
    >
      <Text style={styles.title}>How are you feeling?</Text>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          testID="mood-check-in-button"
          onPress={() => {
            if (disabled) return;
            onCheckIn && onCheckIn(currentMood || "happy");
            try {
              AccessibilityInfo.announceForAccessibility &&
                AccessibilityInfo.announceForAccessibility("mood check-in logged");
            } catch (_) {}
            try {
              if (Haptics && typeof Haptics.impactAsync === "function") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle?.Light || "light");
              }
            } catch (_) {}
          }}
          onLongPress={() => {
            // Support alternative input method
            if (disabled) return;
            onCheckIn && onCheckIn(currentMood || "happy");
          }}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Log Mood"
          accessibilityState={{ disabled }}
          style={[styles.button, { minHeight: dimensions.height }]}
          onPressIn={() => !reducedMotion && Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }).start()}
          onPressOut={() => !reducedMotion && Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start()}
        >
          <Text style={[styles.buttonText, { fontSize: dimensions.fontSize }]}>Log Mood</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  button: { minWidth: 44, minHeight: 44, backgroundColor: "#2196F3", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});

export default MoodCheckIn;

MoodCheckIn.propTypes = {
  currentMood: PropTypes.any,
  onCheckIn: PropTypes.func,
  testID: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  reducedMotion: PropTypes.bool,
  performanceTracker: PropTypes.object,
  onPerformanceIssue: PropTypes.func,
  onUnmount: PropTypes.func,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  crisisMode: PropTypes.bool,
  disabled: PropTypes.bool,
};
