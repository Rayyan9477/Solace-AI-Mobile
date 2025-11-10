/**
 * useResponsive Hook
 * Provides responsive design utilities for web and mobile
 * Handles breakpoints, platform detection, and responsive values
 */

import { useState, useEffect } from "react";
import { Dimensions, Platform } from "react-native";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export type Breakpoint = keyof typeof breakpoints;
export type ResponsiveValue<T> = {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
};

/**
 * Hook to get responsive values based on screen size
 */
export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(() => Dimensions.get("window"));

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const width = dimensions.width;
  const height = dimensions.height;
  const isWeb = Platform.OS === "web";
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  // Determine current breakpoint
  const getCurrentBreakpoint = (): Breakpoint | "base" => {
    if (width >= breakpoints.xxl) return "xxl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    return "base";
  };

  const currentBreakpoint = getCurrentBreakpoint();

  // Check if screen matches breakpoint
  const isBreakpoint = (breakpoint: Breakpoint): boolean => {
    return width >= breakpoints[breakpoint];
  };

  /**
   * Get responsive value based on current screen size
   * @param values Object with breakpoint keys
   * @returns The appropriate value for current screen size
   */
  const getResponsiveValue = <T>(values: ResponsiveValue<T>): T | undefined => {
    // Web-specific handling
    if (isWeb) {
      if (width >= breakpoints.xxl && values.xxl !== undefined)
        return values.xxl;
      if (width >= breakpoints.xl && values.xl !== undefined) return values.xl;
      if (width >= breakpoints.lg && values.lg !== undefined) return values.lg;
      if (width >= breakpoints.md && values.md !== undefined) return values.md;
      if (width >= breakpoints.sm && values.sm !== undefined) return values.sm;
    }

    return values.base;
  };

  /**
   * Get maximum content width for web layouts
   */
  const getMaxContentWidth = (): number => {
    if (!isWeb) return width;
    if (width >= breakpoints.xxl) return 1280;
    if (width >= breakpoints.xl) return 1024;
    if (width >= breakpoints.lg) return 768;
    if (width >= breakpoints.md) return 640;
    return width;
  };

  /**
   * Get responsive padding for containers
   */
  const getContainerPadding = (): number => {
    if (!isWeb) return 20;
    if (width >= breakpoints.xl) return 48;
    if (width >= breakpoints.lg) return 32;
    if (width >= breakpoints.md) return 24;
    return 20;
  };

  return {
    width,
    height,
    isWeb,
    isMobile,
    breakpoints,
    currentBreakpoint,
    isBreakpoint,
    getResponsiveValue,
    getMaxContentWidth,
    getContainerPadding,
    // Convenience flags
    isSm: isBreakpoint("sm"),
    isMd: isBreakpoint("md"),
    isLg: isBreakpoint("lg"),
    isXl: isBreakpoint("xl"),
    isXxl: width >= breakpoints.xxl,
  };
};

export default useResponsive;
