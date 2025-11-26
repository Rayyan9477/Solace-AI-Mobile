import { logger } from "@shared/utils/logger";

/**
 * Custom Color System
 * Allows users to customize color palettes at runtime
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CustomColorPalette {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface CustomColors {
  light?: CustomColorPalette;
  dark?: CustomColorPalette;
}

const CUSTOM_COLORS_KEY = "custom_colors";

/**
 * Save custom colors to AsyncStorage
 */
export const saveCustomColors = async (
  customColors: CustomColors,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(customColors));
  } catch (error) {
    logger.error("Failed to save custom colors:", error);
    throw error;
  }
};

/**
 * Load custom colors from AsyncStorage
 */
export const loadCustomColors = async (): Promise<CustomColors | null> => {
  try {
    const stored = await AsyncStorage.getItem(CUSTOM_COLORS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    logger.error("Failed to load custom colors:", error);
    return null;
  }
};

/**
 * Clear custom colors
 */
export const clearCustomColors = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CUSTOM_COLORS_KEY);
  } catch (error) {
    logger.error("Failed to clear custom colors:", error);
    throw error;
  }
};

/**
 * Merge custom colors with theme
 * @param baseTheme The base theme object
 * @param customColors Custom color overrides
 * @returns Merged theme with custom colors
 */
export const mergeCustomColors = (
  baseTheme: any,
  customColors: CustomColorPalette | undefined,
): any => {
  if (!customColors) return baseTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...(customColors.primary && {
        primary: customColors.primary,
        brown: {
          ...baseTheme.colors.brown,
          70: customColors.primary,
        },
      }),
      ...(customColors.secondary && {
        secondary: customColors.secondary,
      }),
      ...(customColors.accent && {
        accent: customColors.accent,
      }),
      ...(customColors.background && {
        background: {
          ...baseTheme.colors.background,
          primary: customColors.background,
        },
      }),
      ...(customColors.text && {
        text: {
          ...baseTheme.colors.text,
          primary: customColors.text,
        },
      }),
    },
  };
};

/**
 * Predefined color palette options for quick selection
 */
export const presetColorPalettes = {
  default: {
    name: "Mindful Brown (Default)",
    light: {
      primary: "#704A33",
      secondary: "#AC836C",
      accent: "#7D944D",
    },
    dark: {
      primary: "#AC836C",
      secondary: "#704A33",
      accent: "#98B068",
    },
  },
  serene: {
    name: "Serene Green",
    light: {
      primary: "#5A6838",
      secondary: "#98B068",
      accent: "#6B5FC8",
    },
    dark: {
      primary: "#98B068",
      secondary: "#5A6838",
      accent: "#8978F7",
    },
  },
  warm: {
    name: "Warm Orange",
    light: {
      primary: "#C96100",
      secondary: "#ED7E1C",
      accent: "#FFB014",
    },
    dark: {
      primary: "#ED7E1C",
      secondary: "#C96100",
      accent: "#FFCE5C",
    },
  },
  wisdom: {
    name: "Wisdom Purple",
    light: {
      primary: "#5849A5",
      secondary: "#8978F7",
      accent: "#704A33",
    },
    dark: {
      primary: "#8978F7",
      secondary: "#5849A5",
      accent: "#AC836C",
    },
  },
  sunshine: {
    name: "Sunshine Yellow",
    light: {
      primary: "#A37A00",
      secondary: "#FFB014",
      accent: "#7D944D",
    },
    dark: {
      primary: "#FFB014",
      secondary: "#A37A00",
      accent: "#98B068",
    },
  },
};
