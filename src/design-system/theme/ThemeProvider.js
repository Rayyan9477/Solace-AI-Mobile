/**
 * Unified Theme Provider
 * Single source of truth for theming across the app
 * Replaces all previous theme providers
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  useColorScheme,
  AccessibilityInfo,
  Appearance,
} from 'react-native';

import { lightTheme, darkTheme } from '../index';

const ThemeContext = createContext({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
  themeLoaded: true,
  
  // Accessibility features
  isReducedMotionEnabled: false,
  fontScale: 1,
  setFontScale: () => {},
  
  // Helper functions
  getColor: () => null,
  getSpacing: () => 0,
  getShadow: () => ({}),
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn('useTheme must be used within ThemeProvider');
    return {
      theme: lightTheme,
      isDarkMode: false,
      toggleTheme: () => {},
      setTheme: () => {},
      themeLoaded: true,
      isReducedMotionEnabled: false,
      fontScale: 1,
      setFontScale: () => {},
      getColor: () => null,
      getSpacing: () => 0,
      getShadow: () => ({}),
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  const [fontScale, setFontScale] = useState(1);

  // Memoized theme object
  const theme = useMemo(() => {
    const baseTheme = isDarkMode ? darkTheme : lightTheme;
    
    // Apply font scale
    if (fontScale !== 1) {
      const scaledTypography = { ...baseTheme.typography };
      Object.keys(scaledTypography.fontSize).forEach(key => {
        scaledTypography.fontSize[key] *= fontScale;
      });
      
      return {
        ...baseTheme,
        typography: scaledTypography,
      };
    }
    
    return baseTheme;
  }, [isDarkMode, fontScale]);

  // Load saved preferences
  useEffect(() => {
    loadThemePreferences();
    setupAccessibilityListeners();
  }, []);

  // Sync with system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const [savedTheme, savedFontScale] = await Promise.all([
        AsyncStorage.getItem('@solace_theme_mode'),
        AsyncStorage.getItem('@solace_font_scale'),
      ]);

      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }

      if (savedFontScale) {
        setFontScale(parseFloat(savedFontScale));
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    } finally {
      setThemeLoaded(true);
    }
  };

  const setupAccessibilityListeners = async () => {
    try {
      const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
      setIsReducedMotionEnabled(reduceMotion);

      const motionSubscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        setIsReducedMotionEnabled,
      );

      return () => motionSubscription?.remove();
    } catch (error) {
      console.log('Could not setup accessibility listeners:', error);
    }
  };

  const toggleTheme = useCallback(async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    try {
      await AsyncStorage.setItem(
        '@solace_theme_mode',
        newTheme ? 'dark' : 'light',
      );
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [isDarkMode]);

  const setTheme = useCallback(async (themeType) => {
    const newIsDark = themeType === 'dark';
    setIsDarkMode(newIsDark);

    try {
      await AsyncStorage.setItem('@solace_theme_mode', themeType);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);

  const updateFontScale = useCallback(async (scale) => {
    setFontScale(scale);
    
    try {
      await AsyncStorage.setItem('@solace_font_scale', scale.toString());
    } catch (error) {
      console.error('Error saving font scale:', error);
    }
  }, []);

  // Helper functions
  const getColor = useCallback((path) => {
    return theme.getColor(path);
  }, [theme]);

  const getSpacing = useCallback((key) => {
    return theme.getSpacing(key);
  }, [theme]);

  const getShadow = useCallback((key) => {
    return theme.getShadow(key);
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      isDarkMode,
      toggleTheme,
      setTheme,
      themeLoaded,
      isReducedMotionEnabled,
      fontScale,
      setFontScale: updateFontScale,
      getColor,
      getSpacing,
      getShadow,
    }),
    [
      theme,
      isDarkMode,
      toggleTheme,
      setTheme,
      themeLoaded,
      isReducedMotionEnabled,
      fontScale,
      updateFontScale,
      getColor,
      getSpacing,
      getShadow,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export context for advanced usage
export { ThemeContext };

// Default export
export default ThemeProvider;
