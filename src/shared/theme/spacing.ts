/**
 * Spacing System for Solace AI Mental Health App
 * Based on 8pt grid system
 * Provides consistent spacing throughout the app
 */

// Base unit: 8px (most common spacing unit)
const BASE_UNIT = 8;

export const spacing = {
  // Core spacing scale (8pt grid)
  none: 0,
  xs: BASE_UNIT / 2,      // 4px - Very tight spacing
  sm: BASE_UNIT,          // 8px - Tight spacing
  md: BASE_UNIT * 2,      // 16px - Default spacing
  lg: BASE_UNIT * 3,      // 24px - Comfortable spacing
  xl: BASE_UNIT * 4,      // 32px - Loose spacing
  xxl: BASE_UNIT * 6,     // 48px - Very loose spacing
  xxxl: BASE_UNIT * 8,    // 64px - Extra loose spacing

  // Semantic spacing (for specific use cases)
  component: BASE_UNIT * 2,    // 16px - Between components
  section: BASE_UNIT * 4,      // 32px - Between sections
  screen: BASE_UNIT * 3,       // 24px - Screen padding
  card: BASE_UNIT * 2,         // 16px - Card padding
  button: BASE_UNIT * 1.5,     // 12px - Button padding

  // Layout spacing
  layoutXs: BASE_UNIT,         // 8px
  layoutSm: BASE_UNIT * 2,     // 16px
  layoutMd: BASE_UNIT * 3,     // 24px
  layoutLg: BASE_UNIT * 4,     // 32px
  layoutXl: BASE_UNIT * 6,     // 48px
};

// Border radius scale
export const borderRadius = {
  none: 0,
  xs: 4,      // Small elements like chips
  sm: 8,      // Buttons, inputs
  md: 12,     // Cards, containers
  lg: 16,     // Large cards, modals
  xl: 24,     // Extra large containers
  full: 9999, // Fully rounded (pills, avatars)
};

// Elevation/Shadow system
export const elevation = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Icon sizes
export const iconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
};

// Avatar sizes
export const avatarSize = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  xxl: 120,
};

// Container widths (for responsive design)
export const containerWidth = {
  sm: 640,   // Mobile landscape
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
  xxl: 1536, // Extra large desktop
};

// Helper function to get spacing value
export const getSpacing = (multiplier: number): number => {
  return BASE_UNIT * multiplier;
};

// Helper function for consistent padding
export const getPadding = (
  vertical: keyof typeof spacing,
  horizontal: keyof typeof spacing
) => {
  return {
    paddingVertical: spacing[vertical],
    paddingHorizontal: spacing[horizontal],
  };
};

// Helper function for consistent margin
export const getMargin = (
  vertical: keyof typeof spacing,
  horizontal: keyof typeof spacing
) => {
  return {
    marginVertical: spacing[vertical],
    marginHorizontal: spacing[horizontal],
  };
};

export default spacing;
