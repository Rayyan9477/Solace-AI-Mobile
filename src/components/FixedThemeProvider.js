/**
 * Fixed Theme Provider - Consolidates theme management
 * Resolves conflicts between ThemeContext and UnifiedThemeProvider
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { View, useColorScheme, AccessibilityInfo, Appearance } from "react-native";

// Import theme definitions
import { 
  optimizedLightTheme, 
  optimizedDarkTheme, 
  createAccessibleTheme 
} from "../theme/OptimizedTheme";

const FixedThemeContext = createContext({
  theme: optimizedLightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
  isReducedMotionEnabled: false,
  isHighContrastEnabled: false,
  fontScale: 1,
  setFontScale: () => {},
  isScreenReaderEnabled: false,
});

export const useFixedTheme = () => {
  const context = useContext(FixedThemeContext);
  if (!context) {
    throw new Error("useFixedTheme must be used within FixedThemeProvider");
  }
  return context;
};

export const FixedThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Memoized theme calculation for performance
  const theme = useMemo(() => {
    const baseTheme = isDarkMode ? optimizedDarkTheme : optimizedLightTheme;
    
    return createAccessibleTheme(baseTheme, {
      isHighContrastEnabled,
      isReducedMotionEnabled,
      fontScale,
    });
  }, [isDarkMode, isHighContrastEnabled, isReducedMotionEnabled, fontScale]);

  // Load theme preferences
  useEffect(() => {
    loadThemePreferences();
    setupAccessibilityListeners();
  }, []);

  // Sync with system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!themeLoaded) return; // Don't override saved preference
      setIsDarkMode(colorScheme === "dark");
    });

    return () => subscription?.remove();
  }, [themeLoaded]);

  const loadThemePreferences = async () => {
    try {
      const [savedTheme, savedFontScale] = await Promise.all([
        AsyncStorage.getItem("theme_preference"),
        AsyncStorage.getItem("accessibility_font_scale"),
      ]);

      if (savedTheme) {
        setIsDarkMode(savedTheme === "dark");
      }
      
      if (savedFontScale) {
        setFontScale(parseFloat(savedFontScale));
      }
      
      setThemeLoaded(true);
    } catch (error) {
      console.error("Error loading theme preferences:", error);
      setThemeLoaded(true);
    }
  };

  const setupAccessibilityListeners = async () => {
    try {
      // Check initial accessibility settings
      const [reduceMotion, screenReader] = await Promise.all([
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isScreenReaderEnabled(),
      ]);

      setIsReducedMotionEnabled(reduceMotion);
      setIsScreenReaderEnabled(screenReader);

      // Listen for changes
      const motionSubscription = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        setIsReducedMotionEnabled
      );

      const screenReaderSubscription = AccessibilityInfo.addEventListener(
        "screenReaderChanged",
        setIsScreenReaderEnabled
      );

      return () => {
        motionSubscription?.remove();
        screenReaderSubscription?.remove();
      };
    } catch (error) {
      console.log("Could not setup accessibility listeners:", error);
    }
  };

  const toggleTheme = useCallback(async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    try {
      await AsyncStorage.setItem("theme_preference", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  }, [isDarkMode]);

  const setTheme = useCallback(async (themeType) => {
    const newIsDark = themeType === "dark";
    setIsDarkMode(newIsDark);
    
    try {
      await AsyncStorage.setItem("theme_preference", themeType);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  }, []);

  const updateFontScale = useCallback(async (newFontScale) => {
    setFontScale(newFontScale);
    try {
      await AsyncStorage.setItem("accessibility_font_scale", newFontScale.toString());
    } catch (error) {
      console.error("Error saving font scale:", error);
    }
  }, []);

  // Memoized context value for performance
  const contextValue = useMemo(() => ({
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    isReducedMotionEnabled,
    isHighContrastEnabled,
    fontScale,
    setFontScale: updateFontScale,
    isScreenReaderEnabled,
  }), [
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    isReducedMotionEnabled,
    isHighContrastEnabled,
    fontScale,
    updateFontScale,
    isScreenReaderEnabled,
  ]);

  if (!themeLoaded) {
    // Render a minimal fallback to avoid a blank screen while preferences load
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  return (
    <FixedThemeContext.Provider value={contextValue}>
      {children}
    </FixedThemeContext.Provider>
  );
};

export default FixedThemeProvider;