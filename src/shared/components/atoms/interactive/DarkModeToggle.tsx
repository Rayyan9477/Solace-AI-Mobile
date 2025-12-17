import { useTheme } from "@theme/ThemeProvider";
import { freudDarkTheme } from "@theme/freudDarkTheme";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
} from "react-native";
// LOW-011 FIX: Import MaterialCommunityIcons for accessible icons
import { MaterialCommunityIcons } from "../../../expo/vector-icons";

// LOW-009 FIX: Add TypeScript interface for props
interface DarkModeToggleProps {
  style?: ViewStyle;
  showLabel?: boolean;
  size?: "small" | "normal" | "large";
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  style,
  showLabel = true,
  size = "normal",
}) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const animatedValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sizes = {
    small: {
      toggleWidth: 50,
      toggleHeight: 28,
      circleSize: 22,
      padding: 3,
      fontSize: 12,
    },
    normal: {
      toggleWidth: 60,
      toggleHeight: 32,
      circleSize: 26,
      padding: 3,
      fontSize: 14,
    },
    large: {
      toggleWidth: 70,
      toggleHeight: 36,
      circleSize: 30,
      padding: 3,
      fontSize: 16,
    },
  };

  const currentSize = sizes[size];

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode]);

  const handlePress = () => {
    // Add press animation
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

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.colors?.background?.disabled || "#E5E7EB",
      freudDarkTheme.colors.accent.primary,
    ],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      currentSize.padding,
      currentSize.toggleWidth - currentSize.circleSize - currentSize.padding,
    ],
  });

  const iconOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 1],
  });

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors?.text?.primary }]}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
      )}

      {/* LOW-010 FIX: Add accessibility props for screen reader support */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={styles.touchable}
        accessibilityRole="switch"
        accessibilityLabel={`${isDarkMode ? "Dark" : "Light"} mode toggle`}
        accessibilityHint="Double tap to switch between light and dark mode"
        accessibilityState={{ checked: isDarkMode }}
      >
        <Animated.View
          style={[
            styles.toggleContainer,
            {
              width: currentSize.toggleWidth,
              height: currentSize.toggleHeight,
              backgroundColor,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.toggleCircle,
              {
                width: currentSize.circleSize,
                height: currentSize.circleSize,
                transform: [{ translateX }],
              },
            ]}
          >
            {/* LOW-011 FIX: Use MaterialCommunityIcons instead of emojis for accessibility */}
            <Animated.View
              style={[styles.iconContainer, { opacity: iconOpacity }]}
            >
              <MaterialCommunityIcons
                name={isDarkMode ? "moon-waning-crescent" : "white-balance-sunny"}
                size={currentSize.fontSize}
                color={isDarkMode ? "#5B21B6" : "#F59E0B"}
                accessibilityElementsHidden={true}
                importantForAccessibility="no-hide-descendants"
              />
            </Animated.View>
          </Animated.View>

          {/* Background icons - LOW-011 FIX: Use MaterialCommunityIcons */}
          <View style={styles.backgroundIcons}>
            <View style={[styles.backgroundIcon, styles.leftIcon]}>
              <MaterialCommunityIcons
                name="white-balance-sunny"
                size={currentSize.fontSize - 2}
                color="#FFFFFF"
                accessibilityElementsHidden={true}
              />
            </View>
            <View style={[styles.backgroundIcon, styles.rightIcon]}>
              <MaterialCommunityIcons
                name="moon-waning-crescent"
                size={currentSize.fontSize - 2}
                color="#FFFFFF"
                accessibilityElementsHidden={true}
              />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

// LOW-009 FIX: Add displayName for debugging
DarkModeToggle.displayName = "DarkModeToggle";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  touchable: {
    padding: 4, // Extra touch area
  },
  toggleContainer: {
    borderRadius: 20,
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toggleCircle: {
    position: "absolute",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    textAlign: "center",
  },
  backgroundIcons: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  backgroundIcon: {
    opacity: 0.6,
  },
  backgroundIconText: {
    color: "#FFFFFF",
  },
  leftIcon: {
    // Position for sun icon
  },
  rightIcon: {
    // Position for moon icon
  },
});

export default DarkModeToggle;
