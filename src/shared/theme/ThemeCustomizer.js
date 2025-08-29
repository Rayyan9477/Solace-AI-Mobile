// Theme Customizer - Easy UI Component Theming
// Provides utilities for customizing the Freud Design System

import { FreudColorPalette, LightTheme, DarkTheme, getTherapeuticColor } from './ColorPalette';

/**
 * Theme Customizer Class
 * Provides methods for easily customizing the design system
 */
export class ThemeCustomizer {
  constructor(baseTheme = 'light') {
    this.baseTheme = baseTheme === 'dark' ? DarkTheme : LightTheme;
    this.customizations = {};
  }

  /**
   * Set custom therapeutic colors
   * @param {string} colorName - Name of the therapeutic color
   * @param {object} colorScale - Color scale object with 50-900 values
   */
  setTherapeuticColor(colorName, colorScale) {
    if (!this.customizations.therapeutic) {
      this.customizations.therapeutic = { ...FreudColorPalette.therapeutic };
    }
    
    this.customizations.therapeutic[colorName] = {
      50: colorScale[50] || colorScale.lightest,
      100: colorScale[100] || colorScale.lighter,
      200: colorScale[200] || colorScale.light,
      300: colorScale[300] || colorScale.lightMedium,
      400: colorScale[400] || colorScale.medium,
      500: colorScale[500] || colorScale.primary || colorScale.main,
      600: colorScale[600] || colorScale.mediumDark,
      700: colorScale[700] || colorScale.dark,
      800: colorScale[800] || colorScale.darker,
      900: colorScale[900] || colorScale.darkest,
    };
    
    return this;
  }

  /**
   * Set component defaults
   * @param {string} component - Component name
   * @param {object} defaults - Default props for the component
   */
  setComponentDefaults(component, defaults) {
    if (!this.customizations.components) {
      this.customizations.components = {};
    }
    
    this.customizations.components[component] = {
      ...this.customizations.components[component],
      ...defaults,
    };
    
    return this;
  }

  /**
   * Set global theme overrides
   * @param {object} overrides - Theme property overrides
   */
  setThemeOverrides(overrides) {
    this.customizations.theme = {
      ...this.customizations.theme,
      ...overrides,
    };
    
    return this;
  }

  /**
   * Generate the final customized theme
   * @returns {object} Customized theme object
   */
  build() {
    const customPalette = {
      ...FreudColorPalette,
      therapeutic: {
        ...FreudColorPalette.therapeutic,
        ...this.customizations.therapeutic,
      },
    };

    const customTheme = {
      ...this.baseTheme,
      colors: {
        ...this.baseTheme.colors,
        palette: customPalette,
        therapeutic: {
          ...this.baseTheme.colors.therapeutic,
          ...this.customizations.therapeutic,
        },
        ...this.customizations.theme?.colors,
      },
      components: this.customizations.components || {},
      ...this.customizations.theme,
    };

    return customTheme;
  }

  /**
   * Create a themed component variant
   * @param {string} therapeuticColor - Therapeutic color name
   * @param {object} additionalProps - Additional props to merge
   */
  createVariant(therapeuticColor, additionalProps = {}) {
    return {
      therapeuticColor,
      ...additionalProps,
    };
  }
}

/**
 * Pre-built theme configurations for common mental health app types
 */
export const ThemePresets = {
  // Anxiety & Stress Relief App
  anxietyRelief: () => new ThemeCustomizer('light')
    .setComponentDefaults('Button', {
      therapeuticColor: 'calming',
      variant: 'outline',
    })
    .setComponentDefaults('Input', {
      therapeuticColor: 'calming',
      variant: 'floating',
    })
    .setComponentDefaults('Card', {
      therapeuticColor: 'peaceful',
      variant: 'therapeutic',
    }),

  // Depression Support App
  depressionSupport: () => new ThemeCustomizer('light')
    .setComponentDefaults('Button', {
      therapeuticColor: 'nurturing',
      variant: 'filled',
    })
    .setComponentDefaults('Input', {
      therapeuticColor: 'nurturing',
      variant: 'filled',
    })
    .setComponentDefaults('Card', {
      therapeuticColor: 'nurturing',
      variant: 'therapeutic',
    }),

  // Meditation & Mindfulness App
  mindfulness: () => new ThemeCustomizer('light')
    .setComponentDefaults('Button', {
      therapeuticColor: 'peaceful',
      variant: 'ghost',
    })
    .setComponentDefaults('Input', {
      therapeuticColor: 'peaceful',
      variant: 'underline',
    })
    .setComponentDefaults('Card', {
      therapeuticColor: 'peaceful',
      variant: 'subtle',
    }),

  // Crisis Intervention App
  crisisIntervention: () => new ThemeCustomizer('light')
    .setComponentDefaults('Button', {
      therapeuticColor: 'energizing',
      variant: 'filled',
      size: 'large',
    })
    .setComponentDefaults('Card', {
      therapeuticColor: 'energizing',
      variant: 'therapeutic',
    }),

  // General Mental Health App
  generalMentalHealth: () => new ThemeCustomizer('light')
    .setComponentDefaults('Button', {
      therapeuticColor: 'calming',
    })
    .setComponentDefaults('Input', {
      therapeuticColor: 'calming',
    })
    .setComponentDefaults('Card', {
      therapeuticColor: 'calming',
      variant: 'therapeutic',
    }),
};

/**
 * Color palette generators for different mental health conditions
 */
export const ConditionPalettes = {
  anxiety: {
    primary: '#4F46E5',    // Calming indigo
    secondary: '#06B6D4',  // Soothing cyan
    accent: '#10B981',     // Growth green
    background: '#F8FAFC', // Very light blue-gray
    surface: '#FFFFFF',
    text: '#1E293B',
  },

  depression: {
    primary: '#7C3AED',    // Uplifting purple
    secondary: '#F59E0B',  // Warm amber
    accent: '#EF4444',     // Energizing red
    background: '#FFFBEB', // Warm off-white
    surface: '#FFFFFF',
    text: '#374151',
  },

  stress: {
    primary: '#059669',    // Peaceful green
    secondary: '#0891B2',  // Cool blue
    accent: '#DC2626',     // Alert red for urgent actions
    background: '#F0FDF4', // Very light green
    surface: '#FFFFFF',
    text: '#064E3B',
  },

  ptsd: {
    primary: '#1F2937',    // Grounding dark gray
    secondary: '#6B7280',  // Neutral medium gray
    accent: '#F59E0B',     // Gentle amber for hope
    background: '#F9FAFB', // Clean light gray
    surface: '#FFFFFF',
    text: '#111827',
  },

  bipolar: {
    primary: '#8B5CF6',    // Balanced purple
    secondary: '#06B6D4',  // Stable cyan
    accent: '#F59E0B',     // Energy yellow
    background: '#FEFCE8', // Very light yellow
    surface: '#FFFFFF',
    text: '#1F2937',
  },
};

/**
 * Accessibility-focused theme utilities
 */
export const AccessibilityThemes = {
  highContrast: () => new ThemeCustomizer('light')
    .setThemeOverrides({
      colors: {
        text: {
          primary: '#000000',
          secondary: '#333333',
          tertiary: '#666666',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
        },
        border: {
          primary: '#000000',
          secondary: '#333333',
        },
      },
    }),

  lowVision: () => new ThemeCustomizer('light')
    .setComponentDefaults('Button', {
      size: 'large',
    })
    .setComponentDefaults('Input', {
      size: 'large',
    })
    .setComponentDefaults('Tag', {
      size: 'large',
    })
    .setThemeOverrides({
      typography: {
        baseFontSize: 18,
        scaleFactor: 1.2,
      },
    }),

  colorBlind: () => new ThemeCustomizer('light')
    .setTherapeuticColor('calming', {
      500: '#0066CC', // Blue that works for color blindness
    })
    .setTherapeuticColor('energizing', {
      500: '#FF6600', // Orange that works for color blindness
    }),
};

/**
 * Component style generators
 */
export const ComponentStyleGenerators = {
  /**
   * Generate button styles for a specific therapeutic purpose
   */
  generateButtonStyles: (purpose, isDarkMode = false) => {
    const purposeMap = {
      emergency: { therapeuticColor: 'energizing', variant: 'filled', size: 'large' },
      calming: { therapeuticColor: 'calming', variant: 'outline', size: 'medium' },
      supportive: { therapeuticColor: 'nurturing', variant: 'filled', size: 'medium' },
      neutral: { therapeuticColor: 'peaceful', variant: 'ghost', size: 'medium' },
    };

    return purposeMap[purpose] || purposeMap.neutral;
  },

  /**
   * Generate card styles based on content type
   */
  generateCardStyles: (contentType, isDarkMode = false) => {
    const contentMap = {
      journal: { therapeuticColor: 'nurturing', variant: 'therapeutic' },
      progress: { therapeuticColor: 'grounding', variant: 'elevated' },
      insight: { therapeuticColor: 'calming', variant: 'subtle' },
      alert: { therapeuticColor: 'energizing', variant: 'outlined' },
    };

    return contentMap[contentType] || contentMap.insight;
  },
};

/**
 * Theme validation utilities
 */
export const ThemeValidator = {
  /**
   * Validate color contrast ratios for accessibility
   */
  validateContrast: (foreground, background) => {
    // Implementation would use actual contrast calculation
    // For now, return a placeholder
    return {
      ratio: 4.5,
      passes: true,
      level: 'AA',
    };
  },

  /**
   * Validate therapeutic color appropriateness
   */
  validateTherapeuticColors: (theme) => {
    const warnings = [];
    
    // Check if energizing colors are used appropriately
    if (theme.components?.Button?.therapeuticColor === 'energizing' && 
        !theme.components?.Button?.size === 'large') {
      warnings.push('Energizing buttons should typically be large for crisis situations');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  },
};

/**
 * Usage examples and documentation
 */
export const UsageExamples = {
  // Basic customization
  basicCustomization: `
    const customTheme = new ThemeCustomizer('light')
      .setTherapeuticColor('brand', {
        500: '#4F46E5',
        400: '#6366F1',
        600: '#4338CA',
      })
      .setComponentDefaults('Button', {
        therapeuticColor: 'brand',
        size: 'medium',
      })
      .build();
  `,

  // Preset usage
  presetUsage: `
    const anxietyTheme = ThemePresets.anxietyRelief().build();
    const depressionTheme = ThemePresets.depressionSupport().build();
  `,

  // Accessibility theme
  accessibilityUsage: `
    const highContrastTheme = AccessibilityThemes.highContrast().build();
    const lowVisionTheme = AccessibilityThemes.lowVision().build();
  `,
};

export default ThemeCustomizer;