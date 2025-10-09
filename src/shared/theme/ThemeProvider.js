/**
 * ThemeProvider - Unified theme management for Solace AI
 * Provides light/dark theme switching with therapeutic colors
 */

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enhancedTheme } from './enhancedTheme';
import { modernDarkTheme } from './darkTheme';

// Create theme aliases for backward compatibility
export const lightTheme = {
  ...enhancedTheme,
  isDark: false,
  name: 'light',
};

export const darkTheme = {
  ...modernDarkTheme,
  isDark: true,
  name: 'dark',
};

export const therapeuticColors = enhancedTheme.colors.therapeutic;

// Theme Context
export const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setTheme = async (darkMode) => {
    try {
      setIsDark(darkMode);
      await AsyncStorage.setItem('app_theme', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(!isDark);
  };

  const theme = useMemo(() => isDark ? darkTheme : lightTheme, [isDark]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setTheme,
    }),
    [theme, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
