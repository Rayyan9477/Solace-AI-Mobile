/**
 * useTheme Hook + ThemeProvider
 *
 * Runtime theme switching across 5 presets (Cosmic Night, Warm Earth,
 * Ocean Calm, Deep Forest, Soft Rose). User selection persists to AsyncStorage.
 *
 * The hook's return shape is BACKWARD-COMPATIBLE with the original static
 * theme object — existing consumers that destructure `{ colors, palette,
 * shadows, gradients, zIndex, animations, spacing }` keep working unchanged.
 * New fields added: `id`, `setTheme`, `preset`, `typography`.
 *
 * @example
 *   // Legacy (still works)
 *   const { colors, palette } = useTheme();
 *
 *   // New: read/change active preset
 *   const { id, setTheme } = useTheme();
 *   await setTheme('softRose');
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { buildColors, type PaletteShape } from "./colors";
import { shadows } from "./shadows";
import { gradients } from "./gradients";
import { zIndex } from "./zIndex";
import { animations } from "./animationTimings";
import { spacing } from "./spacing";
import { borderRadius } from "./borderRadius";
import {
  fontFamily,
  fontWeight,
  letterSpacing,
  typeScale,
} from "./typography";
import {
  DEFAULT_THEME_ID,
  presets,
  type ThemeId,
  type ThemePreset,
} from "./presets";

/** AsyncStorage key for persisted theme selection */
const STORAGE_KEY = "@solace/theme";

export interface Theme {
  /** Active preset id — 'cosmic' | 'warmEarth' | 'oceanCalm' | 'deepForest' | 'softRose' */
  id: ThemeId;
  /** Full preset metadata (label, description, palette) */
  preset: ThemePreset;
  /** Palette families for the active preset */
  palette: PaletteShape;
  /** Semantic color tokens rebuilt against the active palette */
  colors: ReturnType<typeof buildColors>;
  /** Swap to another preset — persists to AsyncStorage. Returns the new id. */
  setTheme: (next: ThemeId) => Promise<ThemeId>;

  // Static design tokens (don't change per-preset)
  shadows: typeof shadows;
  gradients: typeof gradients;
  zIndex: typeof zIndex;
  animations: typeof animations;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: {
    fontFamily: typeof fontFamily;
    fontWeight: typeof fontWeight;
    letterSpacing: typeof letterSpacing;
    typeScale: typeof typeScale;
  };
}

/** Default/fallback theme used outside a <ThemeProvider> and during SSR/tests. */
export const theme: Theme = {
  id: DEFAULT_THEME_ID,
  preset: presets[DEFAULT_THEME_ID],
  palette: presets[DEFAULT_THEME_ID].palette,
  colors: buildColors(presets[DEFAULT_THEME_ID].palette),
  setTheme: async (next) => next, // no-op fallback
  shadows,
  gradients,
  zIndex,
  animations,
  spacing,
  borderRadius,
  typography: { fontFamily, fontWeight, letterSpacing, typeScale },
};

const ThemeContext = createContext<Theme>(theme);

/**
 * ThemeProvider wraps the app and owns the active preset state. On mount it
 * hydrates the persisted selection from AsyncStorage; invalid/missing values
 * fall back to DEFAULT_THEME_ID silently (no crash in tests / cold start).
 */
export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [id, setId] = useState<ThemeId>(DEFAULT_THEME_ID);

  // Hydrate persisted theme on mount. Uses a simple .then chain so callers
  // can .await flushing in tests with a single `waitFor`.
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY).then(
      (stored) => {
        if (cancelled) return;
        if (stored && stored in presets) {
          setId(stored as ThemeId);
        }
      },
      () => {
        // Swallow — AsyncStorage hydration failures are not fatal; the user
        // will just see the default theme until next app launch.
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const setTheme = useCallback(async (next: ThemeId): Promise<ThemeId> => {
    if (!(next in presets)) {
      // Defensive: reject unknown ids rather than setting a broken theme.
      // Functional setState form keeps `id` out of deps so this callback is
      // stable across renders.
      let current: ThemeId = DEFAULT_THEME_ID;
      setId((prev) => {
        current = prev;
        return prev;
      });
      return current;
    }
    setId(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence failed — theme still applied in-session. A mental-wellness
      // app should never crash for a cosmetic preference.
    }
    return next;
  }, []);

  const value = useMemo<Theme>(() => {
    const preset = presets[id];
    return {
      id,
      preset,
      palette: preset.palette,
      colors: buildColors(preset.palette),
      setTheme,
      shadows,
      gradients,
      zIndex,
      animations,
      spacing,
      borderRadius,
      typography: { fontFamily, fontWeight, letterSpacing, typeScale },
    };
  }, [id, setTheme]);

  return React.createElement(ThemeContext.Provider, { value }, children);
}

/**
 * useTheme — returns the active theme (colors/palette/spacing/etc.).
 * Safe to call outside a <ThemeProvider>; falls back to the static `theme`.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export default useTheme;
