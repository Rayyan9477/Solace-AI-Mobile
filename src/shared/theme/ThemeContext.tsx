/**
 * Compatibility Theme Context for Solace AI
 * Provides a backward-compatible API expected by existing tests and code:
 * - useTheme() returns { theme, colors, isReducedMotionEnabled, toggleTheme, setTheme }
 * - ThemeProvider supports props: theme ("light"|"dark"), value={{ theme }}, crisisMode, moodContext
 * Internally composes the new base ThemeProvider for persistence and system scheme.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AccessibilityInfo } from "react-native";

import {
  ThemeProvider as BaseThemeProvider,
  useTheme as useBaseTheme,
  lightTheme as baseLightTheme,
  darkTheme as baseDarkTheme,
} from "./ThemeProvider";
import { lightTheme as enhancedTheme } from "./theme"; // Use new unified theme

// Derive therapeutic color arrays from theme tokens or fallbacks
const deriveTherapeuticColors = (theme) => {
  const therapeutic =
    theme?.colors?.therapeutic || enhancedTheme.colors.therapeutic;
  const toArray = (obj) =>
    Array.isArray(obj) ? obj : Object.values(obj || {});
  return {
    calming: toArray(therapeutic.calming),
    nurturing: toArray(therapeutic.nurturing),
    peaceful: toArray(therapeutic.peaceful),
    grounding: toArray(therapeutic.grounding),
    energizing: toArray(therapeutic.energizing),
  };
};

// Add common spacing aliases (sm, md, lg, xl) if missing
const withSpacingAliases = (theme) => {
  const spacing = theme?.spacing || {};
  const hasAliases = typeof spacing.md !== "undefined";
  if (hasAliases) return theme;

  // Reasonable defaults (4px grid)
  const aliasSpacing = {
    sm: spacing[2] ?? 8,
    md: spacing[4] ?? 16,
    lg: spacing[6] ?? 24,
    xl: spacing[8] ?? 32,
  };

  return {
    ...theme,
    spacing: {
      ...spacing,
      ...aliasSpacing,
    },
  };
};

export const ThemeContext = createContext({
  theme: baseLightTheme,
  colors: deriveTherapeuticColors(baseLightTheme),
  isReducedMotionEnabled: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

const CompatBridge = ({ children, theme: forcedTheme, value }) => {
  const base = useBaseTheme();

  // Determine active theme (forced via prop, explicit via value, or from base provider)
  let activeTheme = base?.theme || baseLightTheme;
  if (forcedTheme === "light") activeTheme = baseLightTheme;
  if (forcedTheme === "dark") activeTheme = baseDarkTheme;
  if (value?.theme) activeTheme = value.theme;

  // Ensure required tokens/aliases exist
  const adaptedTheme = withSpacingAliases(activeTheme || baseLightTheme);

  // Accessibility: reduced motion
  const [isReducedMotionEnabled, setReducedMotion] = useState(false);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const fn = AccessibilityInfo?.isReduceMotionEnabled;
        if (typeof fn === "function") {
          const value = await fn();
          if (mounted) setReducedMotion(!!value);
        }
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const colors = useMemo(
    () => deriveTherapeuticColors(adaptedTheme),
    [adaptedTheme],
  );

  const contextValue = useMemo(
    () => ({
      theme: adaptedTheme,
      colors,
      isReducedMotionEnabled,
      toggleTheme: base?.toggleTheme || (() => {}),
      setTheme: base?.setTheme || (() => {}),
    }),
    [
      adaptedTheme,
      colors,
      isReducedMotionEnabled,
      base?.toggleTheme,
      base?.setTheme,
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeProvider = ({ children, ...props }) => (
  <BaseThemeProvider>
    <CompatBridge {...props}>{children}</CompatBridge>
  </BaseThemeProvider>
);

export const useTheme = () => useContext(ThemeContext);

// Re-export legacy names for convenience
export const lightTheme = baseLightTheme;
export const darkTheme = baseDarkTheme;
export const therapeuticColors = enhancedTheme.colors.therapeutic;

export default ThemeProvider;
