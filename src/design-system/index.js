/**
 * Solace AI Design System
 * Modern, accessible design system for mental health applications
 * Based on UI references in /ui directory
 */

// Core Design Tokens
export const Colors = {
  // Primary Brand Colors (from UI references)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand blue
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary Colors (Mental Health Focused)
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Calming green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Therapeutic Colors
  therapeutic: {
    calm: '#6366f1',      // Indigo - calming
    warm: '#f59e0b',      // Amber - warmth
    growth: '#10b981',    // Emerald - growth
    focus: '#8b5cf6',     // Violet - focus
    energy: '#f97316',    // Orange - energy
  },

  // Neutral Grays
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Light Theme Colors
  light: {
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      quaternary: '#94a3b8',
      inverse: '#ffffff',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      focus: '#0ea5e9',
    },
  },

  // Dark Theme Colors
  dark: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      quaternary: '#64748b',
      inverse: '#0f172a',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
      focus: '#38bdf8',
    },
  },
};

// Typography System
export const Typography = {
  fontFamily: {
    primary: 'System', // Will use system font
    secondary: 'System',
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 64,
  },
  
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
};

// Spacing System (based on 4px grid)
export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
};

// Border Radius
export const BorderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Shadow System
export const Shadows = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
};

// Animation Durations
export const Animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    therapeutic: 600, // Slower for calming effect
  },
  
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    therapeutic: 'cubic-bezier(0.4, 0, 0.2, 1)', // Custom therapeutic timing
  },
};

// Component Variants
export const ComponentVariants = {
  button: {
    primary: {
      backgroundColor: Colors.primary[500],
      color: Colors.light.text.inverse,
    },
    secondary: {
      backgroundColor: Colors.secondary[500],
      color: Colors.light.text.inverse,
    },
    therapeutic: {
      backgroundColor: Colors.therapeutic.calm,
      color: Colors.light.text.inverse,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: Colors.primary[500],
      color: Colors.primary[500],
    },
    ghost: {
      backgroundColor: 'transparent',
      color: Colors.primary[500],
    },
  },
  
  card: {
    elevated: {
      backgroundColor: Colors.light.background.primary,
      ...Shadows.md,
    },
    flat: {
      backgroundColor: Colors.light.background.secondary,
      borderWidth: 1,
      borderColor: Colors.light.border.primary,
    },
    therapeutic: {
      backgroundColor: Colors.therapeutic.calm + '10', // 10% opacity
      borderWidth: 1,
      borderColor: Colors.therapeutic.calm + '20',
    },
  },
};

// Accessibility helpers
export const Accessibility = {
  minTouchTarget: 44, // iOS/Android minimum touch target
  focusRing: {
    width: 2,
    color: Colors.primary[500],
    offset: 2,
  },
  colorContrast: {
    normal: 4.5, // WCAG AA
    large: 3,    // WCAG AA for large text
    enhanced: 7, // WCAG AAA
  },
};

// Theme configurations
export const createTheme = (mode = 'light') => {
  const isLight = mode === 'light';
  
  return {
    colors: isLight ? Colors.light : Colors.dark,
    palette: Colors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    animation: Animation,
    variants: ComponentVariants,
    accessibility: Accessibility,
    mode,
    
    // Helper functions
    getColor: (path) => {
      const keys = path.split('.');
      let value = isLight ? Colors.light : Colors.dark;
      
      for (const key of keys) {
        if (value && typeof value === 'object') {
          value = value[key];
        } else {
          // Fallback to palette
          value = Colors;
          for (const key of keys) {
            if (value && typeof value === 'object') {
              value = value[key];
            } else {
              return null;
            }
          }
          break;
        }
      }
      
      return value;
    },
    
    getSpacing: (key) => Spacing[key] || 0,
    
    getShadow: (key) => Shadows[key] || Shadows.base,
  };
};

// Export default themes
export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

// Default export
export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  ComponentVariants,
  Accessibility,
  lightTheme,
  darkTheme,
  createTheme,
};
