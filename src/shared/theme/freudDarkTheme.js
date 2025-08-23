// Freud AI Dark Theme - Based on UI Design References
// Matches the Dark-mode folder designs exactly

export const freudDarkColors = {
  // Primary background colors - Deep brown/chocolate theme
  background: {
    primary: '#2D1B14',        // Deep chocolate brown
    secondary: '#3D2518',       // Rich warm brown
    tertiary: '#4D2F1C',       // Medium brown surface
    surface: '#1A0F0A',        // Darkest surface
    elevated: '#3D2518',       // Elevated cards
    modal: '#2D1B14E6',        // Modal backdrop
    overlay: '#00000080',      // Overlay
  },

  // Header colors - Green gradient theme
  header: {
    primary: '#8B9F6F',        // Sage green
    secondary: '#9CB079',       // Light sage
    gradient: ['#8B9F6F', '#9CB079'], // Green gradient
  },

  // Text colors optimized for dark brown backgrounds
  text: {
    primary: '#F8F6F0',        // Warm white
    secondary: '#E8E0D2',      // Soft cream
    tertiary: '#D0C4A8',       // Muted beige
    quaternary: '#B8A886',     // Subtle tan
    inverse: '#2D1B14',        // Dark text for light surfaces
    accent: '#E67E22',         // Orange accent
    link: '#E67E22',           // Orange links
    placeholder: '#9B8B6F',    // Placeholder text
  },

  // Border colors
  border: {
    primary: '#5A3D28',        // Lighter brown
    secondary: '#4A2F1E',      // Subtle brown
    accent: '#E67E2250',       // Orange tinted
    light: '#6B4A33',          // Light border
    focus: '#E67E22',          // Focus border
  },

  // Accent colors - Orange theme from designs
  accent: {
    primary: '#E67E22',        // Main orange
    secondary: '#D35400',      // Darker orange
    tertiary: '#F39C12',       // Bright orange
    light: '#F4A460',          // Light orange
    lighter: '#FFE4B5',       // Very light orange
    dark: '#B8651A',          // Dark orange
  },

  // Status colors adapted for dark theme
  status: {
    success: '#27AE60',        // Green success
    warning: '#F39C12',        // Orange warning
    error: '#E74C3C',          // Red error
    info: '#3498DB',           // Blue info
  },

  // Input field colors
  input: {
    background: '#4A2F1E',     // Brown input background
    border: '#5A3D28',         // Brown border
    focus: '#E67E22',          // Orange focus
    text: '#F8F6F0',           // White text
    placeholder: '#9B8B6F',    // Placeholder
    invalid: '#E74C3C',        // Error state
  },

  // Button colors
  button: {
    // Primary orange button
    primary: {
      background: '#E67E22',
      text: '#FFFFFF',
      hover: '#D35400',
      pressed: '#B8651A',
      disabled: '#5A3D28',
      disabledText: '#9B8B6F',
    },
    // Secondary button
    secondary: {
      background: 'transparent',
      text: '#E67E22',
      border: '#E67E22',
      hover: '#E67E2220',
      pressed: '#E67E2240',
    },
    // Tertiary button
    tertiary: {
      background: '#4A2F1E',
      text: '#F8F6F0',
      hover: '#5A3D28',
      pressed: '#3A251A',
    },
  },

  // Card colors
  card: {
    background: '#3D2518',     // Brown card
    border: '#5A3D28',         // Border
    shadow: '#00000040',       // Shadow
    elevated: '#4D2F1C',       // Elevated card
  },

  // Mood tracking colors
  mood: {
    excellent: '#27AE60',      // Green
    good: '#2ECC71',           // Light green
    neutral: '#F39C12',        // Orange
    bad: '#E67E22',            // Orange-red
    terrible: '#E74C3C',       // Red
  },

  // Assessment colors
  assessment: {
    progress: '#E67E22',       // Orange progress
    background: '#3D2518',     // Brown background
    selected: '#E67E22',       // Orange selected
    unselected: '#5A3D28',     // Brown unselected
  },

  // Glass morphism effects
  glass: {
    light: 'rgba(248, 246, 240, 0.1)',
    medium: 'rgba(248, 246, 240, 0.15)',
    heavy: 'rgba(248, 246, 240, 0.2)',
    tinted: 'rgba(230, 126, 34, 0.1)',
  },

  // Gradient collections
  gradients: {
    // Header gradient
    header: ['#8B9F6F', '#9CB079'],
    
    // Background gradients
    primary: ['#2D1B14', '#3D2518'],
    surface: ['#3D2518', '#4D2F1C'],
    
    // Accent gradients
    accent: ['#E67E22', '#F39C12'],
    warm: ['#D35400', '#E67E22', '#F39C12'],
    
    // Mood gradients
    positive: ['#27AE60', '#2ECC71'],
    neutral: ['#F39C12', '#E67E22'],
    negative: ['#E67E22', '#E74C3C'],
    
    // Special effects
    glow: ['#E67E2200', '#E67E2260', '#E67E2200'],
    overlay: ['#2D1B14', '#3D2518', '#4D2F1C'],
  },
};

// Typography matching the designs
export const freudDarkTypography = {
  fontFamily: {
    primary: 'System',
    secondary: 'System',
    mono: 'Courier',
  },

  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Spacing system
export const freudDarkSpacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
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

// Border radius system
export const freudDarkBorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 999,
};

// Shadow system for dark theme
export const freudDarkShadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: '#E67E22',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Animation timing
export const freudDarkAnimations = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: [0.25, 0.46, 0.45, 0.94],
    easeIn: [0.55, 0.055, 0.675, 0.19],
    easeInOut: [0.645, 0.045, 0.355, 1],
  },
};

// Complete Freud Dark Theme
export const freudDarkTheme = {
  colors: freudDarkColors,
  typography: freudDarkTypography,
  spacing: freudDarkSpacing,
  borderRadius: freudDarkBorderRadius,
  shadows: freudDarkShadows,
  animations: freudDarkAnimations,
  isDark: true,
  name: 'freudDark',
};