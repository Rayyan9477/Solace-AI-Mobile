/**
 * Freud Design System Colors v1.2
 * Based on ui-designs/Design System and Components/Color Palette.png
 *
 * Primary therapeutic color palettes for mental health application
 */

export const colors = {
  /**
   * Mindful Brown - Primary brand color
   * Use for: Primary actions, brand identity, grounding elements
   */
  brown: {
    100: "#372315", // Darkest - text on light
    90: "#372315",
    80: "#4F3422",
    70: "#704A33",
    60: "#926247",
    50: "#AC836C",
    40: "#C0A091",
    30: "#DDC2B8",
    20: "#E8D0D9",
    10: "#F7F4F2", // Lightest - backgrounds
  },

  /**
   * Optimistic Gray - Neutral foundation
   * Use for: Text, borders, surfaces
   */
  gray: {
    100: "#161513", // Darkest
    90: "#292723",
    80: "#3F3C38",
    70: "#5A554E",
    60: "#736B66",
    50: "#928D88",
    40: "#ACABA6",
    30: "#C9C7C5",
    20: "#E1E1E0",
    10: "#F5F5F5", // Lightest
  },

  /**
   * Serenity Green - Calming & healing
   * Use for: Success states, growth indicators, wellness
   */
  green: {
    100: "#1F1E10", // Darkest
    90: "#29321A",
    80: "#3D4A26",
    70: "#5A6838",
    60: "#7D944D",
    50: "#98B068",
    40: "#B4C48D",
    30: "#CFD9B5",
    20: "#E5EAD7",
    10: "#F2F5EB", // Lightest
  },

  /**
   * Empathy Orange - Warmth & connection
   * Use for: Notifications, highlights, energizing elements
   */
  orange: {
    100: "#2E1200", // Darkest
    90: "#432500",
    80: "#663600",
    70: "#894700",
    60: "#AA5500",
    50: "#C96100",
    40: "#ED7E1C",
    30: "#FD6A3D",
    20: "#FF6A3D",
    10: "#FFEEE2", // Lightest
  },

  /**
   * Zen Yellow - Optimism & clarity
   * Use for: Highlights, positive reinforcement
   */
  yellow: {
    100: "#2E2500", // Darkest
    90: "#4D3C00",
    80: "#705600",
    70: "#A37A00",
    60: "#E0A500",
    50: "#FFB014",
    40: "#FFCE5C",
    30: "#FFD88F",
    20: "#FFE8C2",
    10: "#FFF4E0", // Lightest
  },

  /**
   * Kind Purple - Wisdom & stability
   * Use for: Premium features, insights, depth
   */
  purple: {
    100: "#161324", // Darkest
    90: "#29205D",
    80: "#3C357C",
    70: "#5849A5",
    60: "#6B5FC8",
    50: "#8978F7",
    40: "#A594FF",
    30: "#C2B1FF",
    20: "#DDD0FF",
    10: "#F0F1FF", // Lightest
  },

  /**
   * Alert Red - Urgency & crisis
   * Use for: Crisis alerts, errors, urgent actions
   */
  red: {
    100: "#2E0A0A", // Darkest
    90: "#5C0F0F",
    80: "#8B1A1A",
    70: "#B32424",
    60: "#DC2626",
    50: "#EF4444",
    40: "#F87171",
    30: "#FCA5A5",
    20: "#FECACA",
    10: "#FEE2E2", // Lightest
  },

  /**
   * Calm Blue - Trust & stability
   * Use for: Information, links, calming elements
   */
  blue: {
    100: "#0A1929", // Darkest
    90: "#0F2942",
    80: "#1E3A5F",
    70: "#2E4F7C",
    60: "#3B82F6",
    50: "#60A5FA",
    40: "#93C5FD",
    30: "#BFDBFE",
    20: "#DBEAFE",
    10: "#EFF6FF", // Lightest
  },

  /**
   * Nurture Pink - Compassion & care
   * Use for: Emotional support, gentle actions
   */
  pink: {
    100: "#2E0A1F", // Darkest
    90: "#4A0F33",
    80: "#6B1A47",
    70: "#9D2965",
    60: "#DB2777",
    50: "#EC4899",
    40: "#F472B6",
    30: "#F9A8D4",
    20: "#FBCFE8",
    10: "#FCE7F3", // Lightest
  },

  /**
   * Mindful Teal - Focus & clarity
   * Use for: Meditation, focus features, clarity
   */
  teal: {
    100: "#042F2E", // Darkest
    90: "#0F4C4A",
    80: "#115E59",
    70: "#0D9488",
    60: "#14B8A6",
    50: "#2DD4BF",
    40: "#5EEAD4",
    30: "#99F6E4",
    20: "#CCFBF1",
    10: "#F0FDFA", // Lightest
  },

  /**
   * Insight Indigo - Depth & understanding
   * Use for: Analysis, insights, deep features
   */
  indigo: {
    100: "#0F1433", // Darkest
    90: "#1E2252",
    80: "#2E3370",
    70: "#4338CA",
    60: "#4F46E5",
    50: "#6366F1",
    40: "#818CF8",
    30: "#A5B4FC",
    20: "#C7D2FE",
    10: "#E0E7FF", // Lightest
  },

  // Semantic colors mapped to design system
  semantic: {
    // Brand
    primary: "#704A33", // brown-70
    primaryDark: "#4F3422", // brown-80
    primaryLight: "#AC836C", // brown-50

    // Status
    success: "#7D944D", // green-60
    successDark: "#5A6838", // green-70
    successLight: "#98B068", // green-50

    warning: "#E0A500", // yellow-60
    warningDark: "#A37A00", // yellow-70
    warningLight: "#FFB014", // yellow-50

    error: "#ED7E1C", // orange-40
    errorDark: "#C96100", // orange-50
    errorLight: "#FD6A3D", // orange-30

    info: "#6B5FC8", // purple-60
    infoDark: "#5849A5", // purple-70
    infoLight: "#8978F7", // purple-50

    // Surface colors
    background: "#FFFFFF",
    surface: "#F7F4F2", // brown-10
    surfaceVariant: "#F5F5F5", // gray-10

    // Text colors
    onPrimary: "#FFFFFF",
    onSurface: "#161513", // gray-100
    onSurfaceVariant: "#5A554E", // gray-70
    onDisabled: "#ACABA6", // gray-40

    // Interactive
    disabled: "#E1E1E0", // gray-20
    outline: "#C9C7C5", // gray-30
    outlineVariant: "#E1E1E0", // gray-20

    // Overlay
    scrim: "rgba(22, 21, 19, 0.32)", // gray-100 at 32%
    shadow: "rgba(22, 21, 19, 0.08)", // gray-100 at 8%
  },

  // Gradient presets for therapeutic moods
  gradients: {
    morning: ["#FFF4E0", "#F2F5EB", "#F0F1FF"], // yellow-10, green-10, purple-10
    calming: ["#E5EAD7", "#DDD0FF", "#F7F4F2"], // green-20, purple-20, brown-10
    energizing: ["#FFEEE2", "#FFE8C2", "#FFD88F"], // orange-10, yellow-20, yellow-30
    grounding: ["#F7F4F2", "#E8D0D9", "#DDC2B8"], // brown shades
    therapeutic: ["#F2F5EB", "#F0F1FF", "#F7F4F2"], // multi-palette calm
  },
};

// Color aliases for backward compatibility
export const therapeuticColors = {
  calming: colors.green,
  nurturing: colors.green,
  peaceful: colors.gray,
  grounding: colors.purple,
  energizing: colors.orange,
  mindful: colors.brown,
  zen: colors.yellow,
};

// HIGH-009 FIX: Utility function to apply opacity to hex colors
// Properly converts hex to rgba format instead of concatenating opacity string
export const colorWithOpacity = (hexColor: string, opacity: number): string => {
  // Handle already rgba colors
  if (hexColor.startsWith("rgba")) {
    return hexColor;
  }

  // Handle rgb colors - convert to rgba
  if (hexColor.startsWith("rgb(")) {
    const rgbMatch = hexColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity})`;
    }
    return hexColor;
  }

  // Handle hex colors
  let hex = hexColor.replace("#", "");

  // Handle shorthand hex (#RGB -> #RRGGBB)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Handle 8-character hex (already has alpha)
  if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }

  // Validate hex length
  if (hex.length !== 6) {
    return hexColor; // Return original if invalid
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Validate parsed values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return hexColor; // Return original if parsing failed
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default colors;
