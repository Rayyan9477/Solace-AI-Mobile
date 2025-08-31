import { useMemo } from "react";

/**
 * Hook for memoizing styles to prevent recalculation on every render
 * This is especially useful for complex style objects or when styles depend on theme
 */
export const useMemoizedStyles = (styleFactory, dependencies = []) => {
  return useMemo(styleFactory, dependencies);
};

/**
 * Hook for memoizing callbacks with stable references
 * Prevents child components from re-rendering due to new function references
 */
export const useMemoizedCallback = (callback, dependencies = []) => {
  return useMemo(() => callback, dependencies);
};

/**
 * Hook for creating stable object references
 * Prevents re-renders when passing objects as props
 */
export const useMemoizedObject = (obj, dependencies = []) => {
  return useMemo(() => obj, dependencies);
};

export default {
  useMemoizedStyles,
  useMemoizedCallback,
  useMemoizedObject,
};
