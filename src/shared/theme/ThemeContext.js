import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import { View, Platform, useColorScheme } from "react-native";

import { freudDarkTheme } from "./freudDarkTheme";
import {
  lightTheme,
  darkTheme,
  highContrastLightTheme,
  highContrastDarkTheme,
} from "./theme";

// Web-safe AccessibilityInfo import
let AccessibilityInfo;
if (Platform.OS === "web") {
  // Web fallback for AccessibilityInfo
  AccessibilityInfo = {
    isReduceMotionEnabled: () => Promise.resolve(false),
    isScreenReaderEnabled: () => Promise.resolve(false),
    isInvertColorsEnabled: () => Promise.resolve(false),
    addEventListener: () => ({ remove: () => {} }),
  };
} else {
  AccessibilityInfo = require("react-native").AccessibilityInfo;
}

const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
  isReducedMotionEnabled: false,
  isHighContrastEnabled: false,
  fontSize: "normal",
  setFontSize: () => {},
  fontScale: 1,
  setFontScale: () => {},
  isScreenReaderEnabled: false,
  accessibilitySettings: {},
  updateAccessibilitySettings: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [themeLoaded, setThemeLoaded] = useState(true); // Set to true immediately for testing
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [fontScale, setFontScale] = useState(1);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({});

  useEffect(() => {
    // For immediate rendering, we'll load preferences asynchronously
    loadThemePreference().catch(console.warn);
    checkAccessibilitySettings().catch(console.warn);
    loadAccessibilityPreferences().catch(console.warn);

    // Listen for accessibility changes
    const reducedMotionSubscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setIsReducedMotionEnabled,
    );

    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled,
    );

    return () => {
      reducedMotionSubscription?.remove();
      screenReaderSubscription?.remove();
    };
  }, []);

  const checkAccessibilitySettings = async () => {
    try {
      const [
        isReduceMotionEnabled,
        isScreenReaderEnabled,
        isHighContrastEnabled,
      ] = await Promise.all([
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isInvertColorsEnabled
          ? AccessibilityInfo.isInvertColorsEnabled()
          : Promise.resolve(false),
      ]);

      setIsReducedMotionEnabled(isReduceMotionEnabled);
      setIsScreenReaderEnabled(isScreenReaderEnabled);
      setIsHighContrastEnabled(isHighContrastEnabled);

      setAccessibilitySettings({
        isReduceMotionEnabled,
        isScreenReaderEnabled,
        isHighContrastEnabled,
      });
    } catch (error) {
      console.log("Could not check accessibility settings:", error);
    }
  };

  const loadAccessibilityPreferences = async () => {
    try {
      const [savedFontSize, savedFontScale] = await Promise.all([
        AsyncStorage.getItem("accessibility_font_size"),
        AsyncStorage.getItem("accessibility_font_scale"),
      ]);

      if (savedFontSize) {
        setFontSize(savedFontSize);
      }

      if (savedFontScale) {
        setFontScale(parseFloat(savedFontScale));
      }
    } catch (error) {
      console.error("Error loading accessibility preferences:", error);
    }
  };

  const updateFontSize = async (newFontSize) => {
    setFontSize(newFontSize);
    try {
      await AsyncStorage.setItem("accessibility_font_size", newFontSize);
    } catch (error) {
      console.error("Error saving font size preference:", error);
    }
  };

  const updateFontScale = async (newFontScale) => {
    setFontScale(newFontScale);
    try {
      await AsyncStorage.setItem(
        "accessibility_font_scale",
        newFontScale.toString(),
      );
    } catch (error) {
      console.error("Error saving font scale preference:", error);
    }
  };

  const updateAccessibilitySettings = async (newSettings) => {
    setAccessibilitySettings({ ...accessibilitySettings, ...newSettings });
    try {
      await AsyncStorage.setItem(
        "accessibility_settings",
        JSON.stringify({
          ...accessibilitySettings,
          ...newSettings,
        }),
      );
    } catch (error) {
      console.error("Error saving accessibility settings:", error);
    }
  };

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme_preference");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      } else {
        // Default to system preference if no saved preference
        setIsDarkMode(systemColorScheme === "dark");
      }
      // We don't need to set themeLoaded to true since we start with true
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem(
        "theme_preference",
        newTheme ? "dark" : "light",
      );
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const setTheme = async (themeType) => {
    const newTheme = themeType === "dark";
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem("theme_preference", themeType);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Create a theme with accessibility adjustments
  const getAccessibleTheme = (baseTheme) => {
    let adjustedTheme = { ...baseTheme };

    // Apply high contrast theme if enabled
    if (isHighContrastEnabled) {
      if (isDarkMode) {
        adjustedTheme = { ...highContrastDarkTheme };
      } else {
        adjustedTheme = { ...highContrastLightTheme };
      }
    } else {
      // Use Freud dark theme for better design consistency
      adjustedTheme = isDarkMode ? freudDarkTheme : lightTheme;
    }

    // Apply font scaling
    if (fontScale !== 1) {
      adjustedTheme = {
        ...adjustedTheme,
        typography: {
          ...adjustedTheme.typography,
          sizes: Object.fromEntries(
            Object.entries(adjustedTheme.typography.sizes).map(
              ([key, value]) => [key, Math.round(value * fontScale)],
            ),
          ),
        },
      };
    }

    // Apply reduced motion settings
    if (isReducedMotionEnabled) {
      adjustedTheme = {
        ...adjustedTheme,
        animation: {
          ...adjustedTheme.animation,
          duration: {
            fast: 0,
            normal: 0,
            slow: 0,
          },
        },
      };
    }

    return adjustedTheme;
  };

  const currentTheme = getAccessibleTheme(
    isDarkMode ? freudDarkTheme : lightTheme,
  );

  // Enhanced debugging for web
  React.useEffect(() => {
    if (Platform.OS === "web") {
      console.log("🎨 ThemeProvider: Initializing...");
      console.log("🎨 ThemeProvider: System color scheme:", systemColorScheme);
      console.log("🎨 ThemeProvider: isDarkMode:", isDarkMode);
      console.log("🎨 ThemeProvider: currentTheme available:", !!currentTheme);
      console.log(
        "🎨 ThemeProvider: Theme colors available:",
        !!currentTheme?.colors,
      );
      console.log("🎨 ThemeProvider: Theme loaded successfully");
    }
  }, [systemColorScheme, isDarkMode, currentTheme]);

  // Always render children, don't wait for theme loading
  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        isDarkMode,
        toggleTheme,
        setTheme,
        isReducedMotionEnabled,
        isHighContrastEnabled,
        fontSize,
        setFontSize: updateFontSize,
        fontScale,
        setFontScale: updateFontScale,
        isScreenReaderEnabled,
        accessibilitySettings,
        updateAccessibilitySettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Hot reload compatibility: export both named and default
export { ThemeProvider as default };
