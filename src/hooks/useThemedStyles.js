/**
 * Custom hook for optimized themed styles
 * Replaces styled-components for better bundle size and performance
 */
import { useMemo } from "react";
import { StyleSheet } from "react-native";

import { useUnifiedTheme } from "../shared/theme/UnifiedThemeProvider";
import { createStyleUtilities } from "../theme/OptimizedTheme";

/**
 * Hook to create themed styles with performance optimization
 * @param {Function} styleFunction - Function that receives theme and returns styles
 * @returns {Object} - StyleSheet object with themed styles
 */
export const useThemedStyles = (styleFunction) => {
  const { theme } = useUnifiedTheme();

  return useMemo(() => {
    const styles = styleFunction(theme);
    return StyleSheet.create(styles);
  }, [theme, styleFunction]);
};

/**
 * Hook for common style utilities
 * @returns {Object} - Pre-built common styles
 */
export const useStyleUtilities = () => {
  const { theme } = useUnifiedTheme();

  return useMemo(() => {
    return createStyleUtilities(theme);
  }, [theme]);
};

/**
 * Hook for quick theme value access
 * @returns {Object} - Theme access functions
 */
export const useThemeValues = () => {
  const { getColor, getSpacing, theme } = useUnifiedTheme();

  return useMemo(
    () => ({
      getColor,
      getSpacing,
      colors: theme.colors,
      spacing: theme.spacing,
      typography: theme.typography,
      borderRadius: theme.borderRadius,
      shadows: theme.shadows,
    }),
    [getColor, getSpacing, theme],
  );
};

/**
 * Hook for creating responsive styles
 * @param {Object} breakpoints - Breakpoint definitions
 * @returns {Function} - Function to create responsive styles
 */
export const useResponsiveStyles = (breakpoints = {}) => {
  const { theme } = useUnifiedTheme();

  return useMemo(() => {
    return (styleFunction) => {
      const styles = styleFunction(theme, breakpoints);
      return StyleSheet.create(styles);
    };
  }, [theme, breakpoints]);
};

/**
 * Hook for animation styles with reduced motion support
 * @returns {Object} - Animation utilities
 */
export const useAnimationStyles = () => {
  const { theme, isReducedMotionEnabled } = useUnifiedTheme();

  return useMemo(() => {
    const duration = isReducedMotionEnabled ? 0 : theme.animation.timing.normal;

    return {
      fadeIn: {
        opacity: 1,
        transition: `opacity ${duration}ms ${theme.animation.easing.easeOut}`,
      },
      slideUp: {
        transform: "translateY(0)",
        transition: `transform ${duration}ms ${theme.animation.easing.easeOut}`,
      },
      scale: {
        transform: "scale(1)",
        transition: `transform ${duration}ms ${theme.animation.easing.easeOut}`,
      },
    };
  }, [theme, isReducedMotionEnabled]);
};

export default useThemedStyles;
