import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme, AccessibilityInfo } from "react-native";

import {
  lightTheme,
  darkTheme,
  highContrastLightTheme,
  highContrastDarkTheme,
} from "../styles/theme";

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
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [fontScale, setFontScale] = useState(1);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({});

  useEffect(() => {
    loadThemePreference();
    checkAccessibilitySettings();
    loadAccessibilityPreferences();

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
      setThemeLoaded(true);
    } catch (error) {
      console.error("Error loading theme preference:", error);
      setThemeLoaded(true);
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
      adjustedTheme = isDarkMode ? darkTheme : lightTheme;
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

  const currentTheme = getAccessibleTheme(isDarkMode ? darkTheme : lightTheme);

  if (!themeLoaded) {
    return null; // or a loading component
  }

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

export default ThemeProvider;
