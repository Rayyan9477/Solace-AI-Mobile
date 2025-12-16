import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

// HIGH-008 FIX: Import useTheme from correct location (was importing non-existent useFixedTheme)
import { useTheme } from "@shared/theme/ThemeContext";

const ProgressIndicator = ({
  progress = 0,
  showPercentage = true,
  label = "",
  style = {},
  barStyle = {},
  ...props
}) => {
  const { theme } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const progressBarStyle = {
    width: progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    }),
  };

  return (
    <View style={[styles.container, style]} {...props}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.colors.text?.secondary || "#6B7280" },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.progressContainer,
          {
            backgroundColor: theme.colors.background?.tertiary || "#F3F4F6",
          },
          barStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            progressBarStyle,
            { backgroundColor: theme.colors.primary || "#926247" },
          ]}
        />
      </View>

      {showPercentage && (
        <Text
          style={[
            styles.percentage,
            { color: theme.colors.text?.secondary || "#6B7280" },
          ]}
        >
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  progressContainer: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProgressIndicator;
