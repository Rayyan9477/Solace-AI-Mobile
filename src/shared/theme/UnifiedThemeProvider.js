/**
 * Unified Theme Provider - Backward Compatible
 * Combines ThemeContext + FreudThemeProvider APIs into single provider
 * Provides both useTheme() and useFreudTheme() hooks for seamless migration
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  useColorScheme,
  AccessibilityInfo,
  Appearance,
} from "react-native";

// Import optimized theme definitions
import {
  optimizedLightTheme,
  optimizedDarkTheme,
  figmaAlignedColors,
  createAccessibleTheme,
} from "./OptimizedTheme";

const UnifiedThemeContext = createContext({
  // Original ThemeContext API
  theme: optimizedLightTheme,
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

  // FreudThemeProvider API
  therapeutic: "balanced",
  mood: null,
  timeBasedTheme: true,
  setTherapeutic: () => {},
  setMood: () => {},
  setTimeBasedTheme: () => {},
  getMoodBasedColors: () => ({}),
  getTimeBasedColors: () => ({}),
  therapeuticThemes: {},

  // Performance optimized getters
  getThemeValue: () => {},
  getColor: () => {},
  getSpacing: () => {},
  createThemedStyles: () => {},
});

export const useUnifiedTheme = () => {
  const context = useContext(UnifiedThemeContext);
  if (!context) {
    throw new Error("useUnifiedTheme must be used within UnifiedThemeProvider");
  }
  return context;
};

export const UnifiedThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [themeLoaded, setThemeLoaded] = useState(true); // Start with true to prevent blank screens

  // FreudThemeProvider state
  const [therapeutic, setTherapeutic] = useState("balanced");
  const [mood, setMood] = useState(null);
  const [timeBasedTheme, setTimeBasedTheme] = useState(true);
  const [fontSize, setFontSize] = useState("normal");
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({});

  // Memoized theme calculation for performance
  const theme = useMemo(() => {
    const baseTheme = isDarkMode ? optimizedDarkTheme : optimizedLightTheme;

    return createAccessibleTheme(baseTheme, {
      isHighContrastEnabled,
      isReducedMotionEnabled,
      fontScale,
    });
  }, [isDarkMode, isHighContrastEnabled, isReducedMotionEnabled, fontScale]);

  // Performance-optimized theme value getter
  const getThemeValue = useCallback(
    (path) => {
      return path.split(".").reduce((obj, key) => obj?.[key], theme);
    },
    [theme],
  );

  // Quick color access
  const getColor = useCallback(
    (colorPath) => {
      return getThemeValue(`colors.${colorPath}`) || colorPath;
    },
    [getThemeValue],
  );

  // Quick spacing access
  const getSpacing = useCallback(
    (spacingKey) => {
      return getThemeValue(`spacing.${spacingKey}`) || 0;
    },
    [getThemeValue],
  );

  // Optimized styled component replacement
  const createThemedStyles = useCallback(
    (styleFunction) => {
      return styleFunction(theme);
    },
    [theme],
  );

  // Persisted setters defined at top-level (Hooks cannot be called inside useMemo)
  const setFontScaleValue = useCallback(async (scale) => {
    setFontScale(scale);
    try {
      await AsyncStorage.setItem("accessibility_font_scale", scale.toString());
    } catch (error) {
      console.error("Error saving font scale:", error);
    }
  }, []);

  // Load saved preferences
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
      const [reduceMotion, highContrast] = await Promise.all([
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isInvertColorsEnabled?.() || Promise.resolve(false),
      ]);

      setIsReducedMotionEnabled(reduceMotion);
      setIsHighContrastEnabled(highContrast);

      // Listen for changes
      const motionSubscription = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        setIsReducedMotionEnabled,
      );

      return () => {
        motionSubscription?.remove();
      };
    } catch (error) {
      console.log("Could not setup accessibility listeners:", error);
    }
  };

  const toggleTheme = useCallback(async () => {
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

  // Therapeutic theme functions
  const getMoodBasedColors = useCallback(
    (currentMood) => {
      // Simple mood to theme mapping for basic functionality
      return theme.colors || {};
    },
    [theme],
  );

  const getTimeBasedColors = useCallback(() => {
    return theme.colors || {};
  }, [theme]);

  const updateAccessibilitySettings = useCallback(
    async (newSettings) => {
      setAccessibilitySettings({ ...accessibilitySettings, ...newSettings });
      try {
        await AsyncStorage.setItem(
          "accessibility_settings",
          JSON.stringify({ ...accessibilitySettings, ...newSettings }),
        );
      } catch (error) {
        console.error("Error saving accessibility settings:", error);
      }
    },
    [accessibilitySettings],
  );

  const updateFontSize = useCallback(async (newFontSize) => {
    setFontSize(newFontSize);
    try {
      await AsyncStorage.setItem("accessibility_font_size", newFontSize);
    } catch (error) {
      console.error("Error saving font size preference:", error);
    }
  }, []);

  // Memoized context value for performance
  const contextValue = useMemo(
    () => ({
      // Original ThemeContext API
      theme,
      isDarkMode,
      toggleTheme,
      setTheme,
      isReducedMotionEnabled,
      isHighContrastEnabled,
      fontSize,
      setFontSize: updateFontSize,
      fontScale,
      setFontScale: setFontScaleValue,
      isScreenReaderEnabled,
      accessibilitySettings,
      updateAccessibilitySettings,

      // FreudThemeProvider API
      therapeutic,
      mood,
      timeBasedTheme,
      setTherapeutic,
      setMood,
      setTimeBasedTheme,
      getMoodBasedColors,
      getTimeBasedColors,
      therapeuticThemes: {},

      // Performance optimized getters
      getThemeValue,
      getColor,
      getSpacing,
      createThemedStyles,
    }),
    [
      theme,
      isDarkMode,
      toggleTheme,
      setTheme,
      isReducedMotionEnabled,
      isHighContrastEnabled,
      fontSize,
      updateFontSize,
      fontScale,
      setFontScaleValue,
      isScreenReaderEnabled,
      accessibilitySettings,
      updateAccessibilitySettings,
      therapeutic,
      mood,
      timeBasedTheme,
      getMoodBasedColors,
      getTimeBasedColors,
      getThemeValue,
      getColor,
      getSpacing,
      createThemedStyles,
    ],
  );

  // Always render children immediately to prevent blank screens
  // Theme preferences will load asynchronously without blocking UI

  return (
    <UnifiedThemeContext.Provider value={contextValue}>
      {children}
    </UnifiedThemeContext.Provider>
  );
};

// Backward compatibility hooks
export const useTheme = () => {
  const context = useContext(UnifiedThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a UnifiedThemeProvider");
  }
  return context;
};

export const useFreudTheme = () => {
  const context = useContext(UnifiedThemeContext);
  if (!context) {
    throw new Error("useFreudTheme must be used within a UnifiedThemeProvider");
  }
  return context;
};

// Export provider with multiple names for compatibility
export { UnifiedThemeProvider as ThemeProvider };
export { UnifiedThemeProvider as FreudThemeProvider };
export default UnifiedThemeProvider;
