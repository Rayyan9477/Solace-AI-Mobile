/**
 * Unified Theme Provider - Solves double nesting and performance issues
 * Combines ThemeContext + DesignSystemContext into single optimized provider
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useColorScheme, AccessibilityInfo, Appearance } from "react-native";

// Import optimized theme definitions
import { 
  optimizedLightTheme, 
  optimizedDarkTheme, 
  figmaAlignedColors,
  createAccessibleTheme 
} from "./OptimizedTheme";

const UnifiedThemeContext = createContext({
  // Theme state
  theme: optimizedLightTheme,
  isDarkMode: false,
  
  // Theme controls
  toggleTheme: () => {},
  setTheme: () => {},
  
  // Accessibility
  isReducedMotionEnabled: false,
  isHighContrastEnabled: false,
  fontScale: 1,
  
  // Performance optimized getters
  getThemeValue: () => {},
  getColor: () => {},
  getSpacing: () => {},
  
  // Bundle optimization
  styles: {},
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

  // Performance-optimized theme value getter
  const getThemeValue = useCallback((path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], theme);
  }, [theme]);

  // Quick color access
  const getColor = useCallback((colorPath) => {
    return getThemeValue(`colors.${colorPath}`) || colorPath;
  }, [getThemeValue]);

  // Quick spacing access  
  const getSpacing = useCallback((spacingKey) => {
    return getThemeValue(`spacing.${spacingKey}`) || 0;
  }, [getThemeValue]);

  // Optimized styled component replacement
  const createThemedStyles = useCallback((styleFunction) => {
    return styleFunction(theme);
  }, [theme]);

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
        setIsReducedMotionEnabled
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

  // Memoized context value for performance
  const contextValue = useMemo(() => ({
    // Theme state
    theme,
    isDarkMode,
    
    // Theme controls
    toggleTheme,
    setTheme,
    
    // Accessibility
    isReducedMotionEnabled,
    isHighContrastEnabled,
    fontScale,
    setFontScale: setFontScaleValue,
    
    // Performance optimized getters
    getThemeValue,
    getColor,
    getSpacing,
    
    // Bundle optimization
    createThemedStyles,
  }), [
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
    isReducedMotionEnabled,
    isHighContrastEnabled,
    fontScale,
    setFontScaleValue,
    getThemeValue,
    getColor,
    getSpacing,
    createThemedStyles,
  ]);

  if (!themeLoaded) {
    return null; // or loading component
  }

  return (
    <UnifiedThemeContext.Provider value={contextValue}>
      {children}
    </UnifiedThemeContext.Provider>
  );
};

export default UnifiedThemeProvider;