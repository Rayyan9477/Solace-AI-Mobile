/**
 * Color Contrast Validation Utility
 * Provides WCAG 2.1 AA/AAA compliant color contrast validation
 * Specialized for mental health app accessibility requirements
 */

import { Platform } from 'react-native';

// WCAG 2.1 Color Contrast Standards
export const WCAG_STANDARDS = {
  AA: {
    NORMAL_TEXT: 4.5,      // 4.5:1 for normal text
    LARGE_TEXT: 3.0,       // 3.0:1 for large text (18pt+ or 14pt+ bold)
    NON_TEXT: 3.0,         // 3.0:1 for non-text elements
  },
  AAA: {
    NORMAL_TEXT: 7.0,      // 7.0:1 for normal text
    LARGE_TEXT: 4.5,       // 4.5:1 for large text
    NON_TEXT: 4.5,         // 4.5:1 for non-text elements
  },
  MENTAL_HEALTH: {
    CRISIS_ELEMENTS: 7.0,  // Higher contrast for crisis/emergency elements
    MOOD_INDICATORS: 4.5,  // Standard for mood selection elements
    THERAPEUTIC_TEXT: 7.0, // Higher contrast for therapeutic content
  }
};

// Convert hex color to RGB
export const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
};

// Convert RGB to relative luminance
export const getRelativeLuminance = (r, g, b) => {
  // Normalize RGB values
  const normalize = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const rNorm = normalize(r);
  const gNorm = normalize(g);
  const bNorm = normalize(b);

  // Calculate relative luminance using WCAG formula
  return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1, color2) => {
  const rgb1 = typeof color1 === 'string' ? hexToRgb(color1) : color1;
  const rgb2 = typeof color2 === 'string' ? hexToRgb(color2) : color2;

  if (!rgb1 || !rgb2) {
    console.warn('Invalid color format provided to getContrastRatio');
    return 1; // Worst case scenario
  }

  const lum1 = getRelativeLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getRelativeLuminance(rgb2[0], rgb2[1], rgb2[2]);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Check WCAG compliance for color combination
export const checkWCAGCompliance = (
  textColor, 
  backgroundColor, 
  options = {}
) => {
  const {
    textSize = 'normal',        // 'normal', 'large'
    level = 'AA',               // 'AA', 'AAA'
    context = 'general',        // 'general', 'crisis', 'mood', 'therapeutic'
    isNonText = false          // true for UI elements, false for text
  } = options;

  const ratio = getContrastRatio(textColor, backgroundColor);
  
  // Determine minimum ratio based on context and requirements
  let minimumRatio;
  
  if (context === 'crisis') {
    minimumRatio = WCAG_STANDARDS.MENTAL_HEALTH.CRISIS_ELEMENTS;
  } else if (context === 'therapeutic') {
    minimumRatio = WCAG_STANDARDS.MENTAL_HEALTH.THERAPEUTIC_TEXT;
  } else if (context === 'mood') {
    minimumRatio = WCAG_STANDARDS.MENTAL_HEALTH.MOOD_INDICATORS;
  } else if (isNonText) {
    minimumRatio = WCAG_STANDARDS[level].NON_TEXT;
  } else {
    minimumRatio = textSize === 'large' 
      ? WCAG_STANDARDS[level].LARGE_TEXT 
      : WCAG_STANDARDS[level].NORMAL_TEXT;
  }

  const isCompliant = ratio >= minimumRatio;
  const aaCompliant = ratio >= (textSize === 'large' ? 3.0 : 4.5);
  const aaaCompliant = ratio >= (textSize === 'large' ? 4.5 : 7.0);

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    isCompliant,
    level: aaaCompliant ? 'AAA' : (aaCompliant ? 'AA' : 'FAIL'),
    minimumRequired: minimumRatio,
    recommendation: !isCompliant 
      ? `Increase contrast ratio to at least ${minimumRatio.toFixed(1)}:1`
      : 'Contrast meets accessibility standards',
    severity: getSeverityLevel(ratio, minimumRatio, context),
    suggestions: generateContrastSuggestions(textColor, backgroundColor, minimumRatio)
  };
};

// Get severity level for contrast issues
const getSeverityLevel = (actualRatio, requiredRatio, context) => {
  const difference = requiredRatio - actualRatio;
  
  if (actualRatio >= requiredRatio) return 'PASS';
  if (context === 'crisis' && difference > 2) return 'CRITICAL';
  if (difference > 1.5) return 'HIGH';
  if (difference > 0.5) return 'MEDIUM';
  return 'LOW';
};

// Generate suggestions for improving contrast
const generateContrastSuggestions = (textColor, backgroundColor, minimumRatio) => {
  const currentRatio = getContrastRatio(textColor, backgroundColor);
  
  if (currentRatio >= minimumRatio) {
    return ['Contrast is already compliant'];
  }

  const suggestions = [];
  const neededImprovement = minimumRatio / currentRatio;

  if (neededImprovement > 1.5) {
    suggestions.push('Consider using a completely different color combination');
    suggestions.push('Use high contrast color pairs (e.g., black on white)');
  } else {
    suggestions.push('Darken the text color or lighten the background');
    suggestions.push('Consider using a darker shade of the current text color');
    suggestions.push('Consider using a lighter shade of the current background');
  }

  return suggestions;
};

// Validate entire theme for accessibility compliance
export const validateThemeAccessibility = (theme) => {
  const issues = [];
  const validations = [];

  // Check primary text combinations
  const textCombinations = [
    {
      name: 'Primary text on primary background',
      text: theme.colors.text.primary,
      background: theme.colors.background.primary,
      context: 'general'
    },
    {
      name: 'Secondary text on primary background',
      text: theme.colors.text.secondary,
      background: theme.colors.background.primary,
      context: 'general'
    },
    {
      name: 'Primary text on secondary background',
      text: theme.colors.text.primary,
      background: theme.colors.background.secondary,
      context: 'general'
    }
  ];

  // Check mood colors
  if (theme.colors.mood) {
    Object.entries(theme.colors.mood).forEach(([moodName, moodColor]) => {
      textCombinations.push({
        name: `${moodName} mood indicator`,
        text: theme.colors.text.primary,
        background: moodColor,
        context: 'mood'
      });
    });
  }

  // Check therapeutic colors
  if (theme.colors.therapeutic) {
    Object.entries(theme.colors.therapeutic).forEach(([therapeuticName, therapeuticColors]) => {
      if (typeof therapeuticColors === 'object') {
        Object.entries(therapeuticColors).forEach(([shade, color]) => {
          textCombinations.push({
            name: `${therapeuticName} ${shade} therapeutic color`,
            text: theme.colors.text.primary,
            background: color,
            context: 'therapeutic'
          });
        });
      }
    });
  }

  // Validate each combination
  textCombinations.forEach(combination => {
    const result = checkWCAGCompliance(
      combination.text,
      combination.background,
      { context: combination.context }
    );

    const validation = {
      ...combination,
      ...result
    };

    validations.push(validation);

    if (!result.isCompliant) {
      issues.push({
        component: combination.name,
        severity: result.severity,
        colors: `${combination.text} on ${combination.background}`,
        ratio: result.ratio,
        required: result.minimumRequired,
        recommendation: result.recommendation,
        suggestions: result.suggestions
      });
    }
  });

  return {
    issues,
    validations,
    summary: {
      total: validations.length,
      passing: validations.filter(v => v.isCompliant).length,
      failing: issues.length,
      critical: issues.filter(i => i.severity === 'CRITICAL').length,
      high: issues.filter(i => i.severity === 'HIGH').length
    }
  };
};

// Real-time contrast checker for development
export const useContrastChecker = () => {
  const checkContrast = (textColor, backgroundColor, options = {}) => {
    if (Platform.OS === 'web' && __DEV__) {
      const result = checkWCAGCompliance(textColor, backgroundColor, options);
      if (!result.isCompliant) {
        console.warn(`❌ Contrast Issue: ${result.recommendation}`, {
          ratio: result.ratio,
          required: result.minimumRequired,
          colors: `${textColor} on ${backgroundColor}`
        });
      } else {
        console.log(`✅ Contrast OK: ${result.ratio}:1 (${result.level})`, {
          colors: `${textColor} on ${backgroundColor}`
        });
      }
      return result;
    }
    return checkWCAGCompliance(textColor, backgroundColor, options);
  };

  return { checkContrast };
};

// Mental health app specific contrast validators
export const MentalHealthContrastValidators = {
  // Validate crisis/emergency element contrast
  validateCrisisElement: (textColor, backgroundColor) => {
    return checkWCAGCompliance(textColor, backgroundColor, {
      context: 'crisis',
      level: 'AAA'
    });
  },

  // Validate mood indicator contrast
  validateMoodIndicator: (moodColor, textColor = '#000000') => {
    return checkWCAGCompliance(textColor, moodColor, {
      context: 'mood',
      level: 'AA'
    });
  },

  // Validate therapeutic content contrast
  validateTherapeuticContent: (textColor, backgroundColor) => {
    return checkWCAGCompliance(textColor, backgroundColor, {
      context: 'therapeutic',
      level: 'AAA'
    });
  },

  // Validate button contrast
  validateButtonContrast: (buttonColor, textColor, isEmergency = false) => {
    return checkWCAGCompliance(textColor, buttonColor, {
      context: isEmergency ? 'crisis' : 'general',
      level: isEmergency ? 'AAA' : 'AA',
      isNonText: false
    });
  }
};

export default {
  WCAG_STANDARDS,
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  checkWCAGCompliance,
  validateThemeAccessibility,
  useContrastChecker,
  MentalHealthContrastValidators
};