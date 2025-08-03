import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { useTheme } from "../../contexts/ThemeContext";
import { MentalHealthIcon } from "../icons";

const ThemeToggle = ({ style, showLabel = true }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const animatedValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const handleToggle = () => {
    // Add a subtle scale animation for user feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  const switchTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 34],
  });

  const switchBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.colors.therapeutic.calming[200],
      theme.colors.therapeutic.grounding[500],
    ],
  });

  const switchThumbColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.colors.therapeutic.energizing[500],
      theme.colors.therapeutic.peaceful[200],
    ],
  });

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.text.primary }]}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
      )}

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={handleToggle}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.toggleBackground,
              {
                backgroundColor: switchBackgroundColor,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.toggleThumb,
                {
                  backgroundColor: switchThumbColor,
                  transform: [{ translateX: switchTranslateX }],
                },
              ]}
            >
              <MentalHealthIcon
                name={isDarkMode ? "Brain" : "Heart"}
                size={14}
                color={
                  isDarkMode
                    ? theme.colors.therapeutic.grounding[700]
                    : theme.colors.therapeutic.energizing[700]
                }
                variant="filled"
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {showLabel && (
        <Text
          style={[styles.description, { color: theme.colors.text.secondary }]}
        >
          {isDarkMode
            ? "Calming dark theme for evening use"
            : "Bright theme for daytime clarity"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
    maxWidth: 200,
  },
  toggleContainer: {
    padding: 4,
  },
  toggleBackground: {
    width: 60,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    position: "relative",
  },
  toggleThumb: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});

export default ThemeToggle;
