import React, { createContext, useContext, useState } from 'react';

// Import our theme
const colors = {
  // Primary Colors - Soft therapeutic blues inspired by Freud UI Kit
  primary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Secondary Colors - Warm sage greens for mental wellness
  secondary: {
    50: '#F6F8F6',
    100: '#E7F0E7',
    200: '#D1E7DD',
    300: '#B8D4C4',
    400: '#9CC5A8',
    500: '#7FB08A',
    600: '#6B9B75',
    700: '#5A8562',
    800: '#486C50',
    900: '#3A5540',
  },
  
  // Success Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Mood Colors
  mood: {
    happy: '#FEF08A',
    calm: '#BAE6FD',
    anxious: '#E0E7FF',
    sad: '#DBEAFE',
    angry: '#FED7D7',
    neutral: '#F3F4F6',
    excited: '#FDF2F8',
    tired: '#F9FAFB',
    stressed: '#FEF3C7',
    content: '#DCFCE7',
  },
  
  // Light Mode Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#6B7280',
    inverse: '#FFFFFF',
  },
  
  border: {
    primary: '#E5E7EB',
    secondary: '#F3F4F6',
  },
  
  // Dark Mode Colors
  dark: {
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#E2E8F0',
      tertiary: '#CBD5E1',
      inverse: '#0F172A',
    },
    border: {
      primary: '#475569',
      secondary: '#334155',
    },
  },
};

const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
};

const lightTheme = {
  colors: {
    ...colors,
    background: colors.background,
    text: colors.text,
    border: colors.border,
  },
  spacing,
};

const darkTheme = {
  colors: {
    ...colors,
    background: colors.dark.background,
    text: colors.dark.text,
    border: colors.dark.border,
  },
  spacing,
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { lightTheme, darkTheme };
