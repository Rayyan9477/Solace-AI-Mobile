import { logger } from "@shared/utils/logger";

/**
 * ThemeProvider - Unified theme management for Solace AI
 * Provides light/dark theme switching with therapeutic colors
 * Supports custom color palettes
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";

import {
  CustomColors,
  loadCustomColors,
  mergeCustomColors,
} from "./customColors";
import { lightTheme, darkTheme } from "./theme";

// Re-export themes for convenience
export { lightTheme, darkTheme } from "./theme";
export { colors, therapeuticColors } from "./colors";
export * from "./customColors";

// Theme Context
interface ThemeContextType {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (darkMode: boolean) => void;
  customColors: CustomColors | null;
  setCustomColors: (colors: CustomColors) => void;
  resetCustomColors: () => void;
}

// HIGH-019 FIX: Use undefined as default to properly detect usage outside provider
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");
  const [customColors, setCustomColorsState] = useState<CustomColors | null>(
    null,
  );

  // Load saved theme preference and custom colors
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load theme mode
        const savedTheme = await AsyncStorage.getItem("app_theme");
        if (savedTheme) {
          setIsDark(savedTheme === "dark");
        }

        // Load custom colors
        const savedCustomColors = await loadCustomColors();
        if (savedCustomColors) {
          setCustomColorsState(savedCustomColors);
        }
      } catch (error) {
        logger.error("Failed to load theme preferences:", error);
      }
    };
    loadPreferences();
  }, []);

  // Save theme preference
  const setTheme = async (darkMode: boolean) => {
    try {
      setIsDark(darkMode);
      await AsyncStorage.setItem("app_theme", darkMode ? "dark" : "light");
    } catch (error) {
      logger.error("Failed to save theme preference:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(!isDark);
  };

  // Set custom colors
  const setCustomColors = async (colors: CustomColors) => {
    setCustomColorsState(colors);
    try {
      await AsyncStorage.setItem("custom_colors", JSON.stringify(colors));
    } catch (error) {
      logger.error("Failed to save custom colors:", error);
    }
  };

  // Reset to default colors
  const resetCustomColors = async () => {
    setCustomColorsState(null);
    try {
      await AsyncStorage.removeItem("custom_colors");
    } catch (error) {
      logger.error("Failed to reset custom colors:", error);
    }
  };

  // Apply custom colors to theme
  const theme = useMemo(() => {
    const baseTheme = isDark ? darkTheme : lightTheme;
    const customPalette = isDark ? customColors?.dark : customColors?.light;
    return mergeCustomColors(baseTheme, customPalette);
  }, [isDark, customColors]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setTheme,
      customColors,
      setCustomColors,
      resetCustomColors,
    }),
    [theme, isDark, customColors],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Hook to use theme
// HIGH-019 FIX: Now properly detects usage outside ThemeProvider
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
