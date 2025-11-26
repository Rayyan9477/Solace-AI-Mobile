import { logger } from "@shared/utils/logger";

/**
 * Therapeutic Color Palette Utility
 * Provides dynamic color selection for therapeutic UI components
 */

import { colors } from "./colors";

// Map to new color structure for backwards compatibility
const enhancedColors = {
  therapeutic: colors.therapeutic,
  gradients: colors.gradients,
};

/**
 * Get therapeutic color based on mood, shade, and theme mode
 * @param {string} therapeuticColor - The therapeutic color name ('calming', 'nurturing', 'peaceful', 'grounding', 'energizing')
 * @param {number} shade - The shade level (50-950)
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {string} The hex color value
 */
export const getTherapeuticColor = (
  therapeuticColor,
  shade = 500,
  isDarkMode = false,
) => {
  // Validate therapeutic color
  if (!enhancedColors.therapeutic[therapeuticColor]) {
    logger.warn(
      `Therapeutic color '${therapeuticColor}' not found, falling back to 'calming'`,
    );
    therapeuticColor = "calming";
  }

  // Validate shade
  const validShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  if (!validShades.includes(shade)) {
    logger.warn(`Invalid shade ${shade}, using 500`);
    shade = 500;
  }

  // For dark mode, we might want to use lighter shades for better contrast
  // But for now, we'll use the same shades - this can be enhanced later
  let adjustedShade = shade;

  if (isDarkMode) {
    // In dark mode, use slightly lighter shades for better visibility
    const darkModeAdjustments = {
      900: 700,
      800: 600,
      700: 500,
      600: 400,
    };
    adjustedShade = darkModeAdjustments[shade] || shade;
  }

  return enhancedColors.therapeutic[therapeuticColor][adjustedShade];
};

/**
 * Get all shades for a therapeutic color
 * @param {string} therapeuticColor - The therapeutic color name
 * @returns {object} Object with all shade levels
 */
export const getTherapeuticColorPalette = (therapeuticColor) => {
  if (!enhancedColors.therapeutic[therapeuticColor]) {
    logger.warn(
      `Therapeutic color '${therapeuticColor}' not found, falling back to 'calming'`,
    );
    therapeuticColor = "calming";
  }

  return enhancedColors.therapeutic[therapeuticColor];
};

/**
 * Get therapeutic gradient colors
 * @param {string} gradientName - The gradient name ('morning', 'afternoon', 'evening', 'therapeutic', 'energizing', 'calming')
 * @returns {string[]} Array of hex color values for the gradient
 */
export const getTherapeuticGradient = (gradientName) => {
  if (!enhancedColors.gradients[gradientName]) {
    logger.warn(
      `Gradient '${gradientName}' not found, falling back to 'therapeutic'`,
    );
    gradientName = "therapeutic";
  }

  return enhancedColors.gradients[gradientName];
};

/**
 * Available therapeutic color names
 */
export const THERAPEUTIC_COLORS = {
  CALMING: "calming",
  NURTURING: "nurturing",
  PEACEFUL: "peaceful",
  GROUNDING: "grounding",
  ENERGIZING: "energizing",
};

/**
 * Available gradient names
 */
export const THERAPEUTIC_GRADIENTS = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
  EVENING: "evening",
  THERAPEUTIC: "therapeutic",
  ENERGIZING: "energizing",
  CALMING: "calming",
};
