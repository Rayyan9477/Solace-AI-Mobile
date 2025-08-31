/**
 * Freud Theme Provider with Material Design Integration
 * Provides comprehensive theming based on Freud UI Kit design system
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StatusBar, useColorScheme } from 'react-native';
import { FreudColors, FreudTypography, FreudSpacing } from '../../shared/theme/FreudDesignSystem';

// Enhanced Theme Context
const FreudThemeContext = createContext({
  therapeutic: 'balanced',
  mood: null,
  timeBasedTheme: true,
  setTherapeutic: () => {},
  setMood: () => {},
  setTimeBasedTheme: () => {},
  getMoodBasedColors: () => ({}),
  getTimeBasedColors: () => ({}),
});

// Therapeutic theme configurations
const THERAPEUTIC_THEMES = {
  calming: {
    primary: FreudColors.serenityGreen[60],
    secondary: FreudColors.serenityGreen[40],
    accent: FreudColors.mindfulBrown[50],
    background: FreudColors.serenityGreen[10],
    surface: '#FFFFFF',
  },
  nurturing: {
    primary: FreudColors.empathyOrange[50],
    secondary: FreudColors.empathyOrange[30],
    accent: FreudColors.zenYellow[60],
    background: FreudColors.empathyOrange[10],
    surface: '#FFFFFF',
  },
  peaceful: {
    primary: FreudColors.optimisticGray[60],
    secondary: FreudColors.optimisticGray[40],
    accent: FreudColors.serenityGreen[50],
    background: FreudColors.optimisticGray[10],
    surface: '#FFFFFF',
  },
  grounding: {
    primary: FreudColors.mindfulBrown[70],
    secondary: FreudColors.mindfulBrown[50],
    accent: FreudColors.empathyOrange[60],
    background: FreudColors.mindfulBrown[10],
    surface: '#FFFFFF',
  },
  energizing: {
    primary: FreudColors.zenYellow[60],
    secondary: FreudColors.zenYellow[40],
    accent: FreudColors.kindPurple[60],
    background: FreudColors.zenYellow[10],
    surface: '#FFFFFF',
  },
  zen: {
    primary: FreudColors.kindPurple[60],
    secondary: FreudColors.kindPurple[40],
    accent: FreudColors.serenityGreen[60],
    background: FreudColors.kindPurple[10],
    surface: '#FFFFFF',
  },
  balanced: {
    primary: FreudColors.mindfulBrown[80],
    secondary: FreudColors.serenityGreen[60],
    accent: FreudColors.empathyOrange[50],
    background: '#FFFFFF',
    surface: FreudColors.optimisticGray[10],
  },
};

// Mood-based color mappings
const MOOD_COLORS = {
  happy: FreudColors.zenYellow,
  sad: FreudColors.optimisticGray,
  stressed: FreudColors.empathyOrange,
  calm: FreudColors.serenityGreen,
  anxious: FreudColors.kindPurple,
  neutral: FreudColors.mindfulBrown,
  excited: FreudColors.zenYellow,
  tired: FreudColors.optimisticGray,
  content: FreudColors.serenityGreen,
};

// Time-based theme variations
const getTimeBasedTheme = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    // Morning - Energizing
    return 'energizing';
  } else if (hour >= 12 && hour < 17) {
    // Afternoon - Balanced
    return 'balanced';
  } else if (hour >= 17 && hour < 21) {
    // Evening - Calming
    return 'calming';
  } else {
    // Night - Peaceful
    return 'peaceful';
  }
};

// Enhanced Material Design Theme Builder
const buildMaterialTheme = (therapeuticTheme, isDark = false) => {
  const therapeutic = THERAPEUTIC_THEMES[therapeuticTheme] || THERAPEUTIC_THEMES.balanced;
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: therapeutic.primary,
      onPrimary: isDark ? FreudColors.optimisticGray[10] : '#FFFFFF',
      primaryContainer: therapeutic.secondary,
      onPrimaryContainer: isDark ? FreudColors.optimisticGray[10] : FreudColors.mindfulBrown[90],
      
      secondary: therapeutic.accent,
      onSecondary: '#FFFFFF',
      secondaryContainer: therapeutic.accent + '20',
      onSecondaryContainer: FreudColors.mindfulBrown[90],
      
      tertiary: FreudColors.kindPurple[60],
      onTertiary: '#FFFFFF',
      tertiaryContainer: FreudColors.kindPurple[20],
      onTertiaryContainer: FreudColors.mindfulBrown[90],
      
      background: isDark ? FreudColors.optimisticGray[100] : therapeutic.background,
      onBackground: isDark ? FreudColors.optimisticGray[10] : FreudColors.mindfulBrown[90],
      
      surface: isDark ? FreudColors.optimisticGray[90] : therapeutic.surface,
      onSurface: isDark ? FreudColors.optimisticGray[10] : FreudColors.mindfulBrown[90],
      surfaceVariant: isDark ? FreudColors.optimisticGray[80] : FreudColors.optimisticGray[20],
      onSurfaceVariant: isDark ? FreudColors.optimisticGray[30] : FreudColors.optimisticGray[70],
      
      outline: isDark ? FreudColors.optimisticGray[70] : FreudColors.optimisticGray[40],
      outlineVariant: isDark ? FreudColors.optimisticGray[80] : FreudColors.optimisticGray[30],
      
      error: FreudColors.empathyOrange[70],
      onError: '#FFFFFF',
      errorContainer: FreudColors.empathyOrange[20],
      onErrorContainer: FreudColors.empathyOrange[90],
      
      // Therapeutic status colors
      success: FreudColors.serenityGreen[60],
      onSuccess: '#FFFFFF',
      warning: FreudColors.zenYellow[60],
      onWarning: FreudColors.mindfulBrown[90],
      info: FreudColors.kindPurple[60],
      onInfo: '#FFFFFF',
      
      // Surface elevations
      elevation: {
        level0: 'transparent',
        level1: isDark ? FreudColors.optimisticGray[90] : '#FFFFFF',
        level2: isDark ? FreudColors.optimisticGray[85] : '#FAFAFA',
        level3: isDark ? FreudColors.optimisticGray[80] : '#F5F5F5',
        level4: isDark ? FreudColors.optimisticGray[75] : '#F0F0F0',
        level5: isDark ? FreudColors.optimisticGray[70] : '#EEEEEE',
      },
      
      // Therapeutic gradients
      therapeuticGradients: {
        calming: [FreudColors.serenityGreen[20], FreudColors.serenityGreen[10]],
        nurturing: [FreudColors.empathyOrange[20], FreudColors.empathyOrange[10]],
        peaceful: [FreudColors.optimisticGray[20], FreudColors.optimisticGray[10]],
        grounding: [FreudColors.mindfulBrown[20], FreudColors.mindfulBrown[10]],
        energizing: [FreudColors.zenYellow[20], FreudColors.zenYellow[10]],
        zen: [FreudColors.kindPurple[20], FreudColors.kindPurple[10]],
      },
    },
    
    // Enhanced typography with Freud system
    fonts: {
      ...baseTheme.fonts,
      displayLarge: {
        ...baseTheme.fonts.displayLarge,
        fontFamily: FreudTypography.fontFamily.primary,
        fontSize: FreudTypography.sizes['4xl'],
        fontWeight: FreudTypography.weights.bold,
      },
      displayMedium: {
        ...baseTheme.fonts.displayMedium,
        fontFamily: FreudTypography.fontFamily.primary,
        fontSize: FreudTypography.sizes['3xl'],
        fontWeight: FreudTypography.weights.bold,
      },
      displaySmall: {
        ...baseTheme.fonts.displaySmall,
        fontFamily: FreudTypography.fontFamily.primary,
        fontSize: FreudTypography.sizes['2xl'],
        fontWeight: FreudTypography.weights.semiBold,
      },
      headlineLarge: {
        ...baseTheme.fonts.headlineLarge,
        fontFamily: FreudTypography.fontFamily.primary,
        fontSize: FreudTypography.sizes.xl,
        fontWeight: FreudTypography.weights.semiBold,
      },
      headlineMedium: {
        ...baseTheme.fonts.headlineMedium,
        fontFamily: FreudTypography.fontFamily.primary,
        fontSize: FreudTypography.sizes.lg,
        fontWeight: FreudTypography.weights.medium,
      },
      titleLarge: {
        ...baseTheme.fonts.titleLarge,
        fontFamily: FreudTypography.fontFamily.primary,
        fontSize: FreudTypography.sizes.base,
        fontWeight: FreudTypography.weights.medium,
      },
      bodyLarge: {
        ...baseTheme.fonts.bodyLarge,
        fontFamily: FreudTypography.fontFamily.secondary,
        fontSize: FreudTypography.sizes.base,
        fontWeight: FreudTypography.weights.normal,
        lineHeight: FreudTypography.sizes.base * FreudTypography.lineHeights.relaxed,
      },
      bodyMedium: {
        ...baseTheme.fonts.bodyMedium,
        fontFamily: FreudTypography.fontFamily.secondary,
        fontSize: FreudTypography.sizes.sm,
        fontWeight: FreudTypography.weights.normal,
        lineHeight: FreudTypography.sizes.sm * FreudTypography.lineHeights.normal,
      },
      labelLarge: {
        ...baseTheme.fonts.labelLarge,
        fontFamily: FreudTypography.fontFamily.secondary,
        fontSize: FreudTypography.sizes.sm,
        fontWeight: FreudTypography.weights.medium,
      },
    },
    
    // Therapeutic spacing system
    spacing: FreudSpacing,
  };
};

/**
 * Freud Theme Provider Component
 */
export const FreudThemeProvider = ({ 
  children, 
  initialTheme = { therapeutic: 'balanced', mood: null, timeBasedTheme: true } 
}) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [therapeutic, setTherapeutic] = useState(initialTheme.therapeutic);
  const [mood, setMood] = useState(initialTheme.mood);
  const [timeBasedTheme, setTimeBasedTheme] = useState(initialTheme.timeBasedTheme);

  // Auto-adjust theme based on time if enabled
  useEffect(() => {
    if (timeBasedTheme) {
      const timeTheme = getTimeBasedTheme();
      setTherapeutic(timeTheme);
    }
  }, [timeBasedTheme]);

  // React to system theme changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Get mood-based colors
  const getMoodBasedColors = useMemo(() => (currentMood) => {
    if (!currentMood || !MOOD_COLORS[currentMood]) {
      return THERAPEUTIC_THEMES[therapeutic];
    }
    
    const moodColorPalette = MOOD_COLORS[currentMood];
    return {
      primary: moodColorPalette[60],
      secondary: moodColorPalette[40],
      accent: moodColorPalette[80],
      background: moodColorPalette[10],
      surface: '#FFFFFF',
    };
  }, [therapeutic]);

  // Get time-based colors
  const getTimeBasedColors = useMemo(() => () => {
    const timeTheme = getTimeBasedTheme();
    return THERAPEUTIC_THEMES[timeTheme];
  }, []);

  // Build final Material Design theme
  const materialTheme = useMemo(() => {
    const activeTherapeutic = mood ? 
      Object.keys(THERAPEUTIC_THEMES).find(t => 
        THERAPEUTIC_THEMES[t].primary === MOOD_COLORS[mood]?.[60]
      ) || therapeutic : 
      therapeutic;
      
    return buildMaterialTheme(activeTherapeutic, isDarkMode);
  }, [therapeutic, mood, isDarkMode]);

  // Theme context value
  const themeContextValue = useMemo(() => ({
    therapeutic,
    mood,
    timeBasedTheme,
    isDarkMode,
    setTherapeutic,
    setMood,
    setTimeBasedTheme,
    setIsDarkMode,
    getMoodBasedColors,
    getTimeBasedColors,
    therapeuticThemes: THERAPEUTIC_THEMES,
    moodColors: MOOD_COLORS,
  }), [therapeutic, mood, timeBasedTheme, isDarkMode, getMoodBasedColors, getTimeBasedColors]);

  return (
    <FreudThemeContext.Provider value={themeContextValue}>
      <PaperProvider theme={materialTheme}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />
        {children}
      </PaperProvider>
    </FreudThemeContext.Provider>
  );
};

// Hook to use Freud Theme
export const useFreudTheme = () => {
  const context = useContext(FreudThemeContext);
  if (!context) {
    throw new Error('useFreudTheme must be used within a FreudThemeProvider');
  }
  return context;
};

// HOC for components that need therapeutic theming
export const withFreudTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = useFreudTheme();
    return <Component {...props} theme={theme} />;
  };
};

export default FreudThemeProvider;