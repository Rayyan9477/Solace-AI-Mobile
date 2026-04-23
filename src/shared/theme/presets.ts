/**
 * Theme Presets — 5 runtime-switchable palettes (prototype v4.2)
 *
 * The "cosmic" preset is the default and matches `colors.ts` exactly. The
 * other 4 override `midnight` (page/card backgrounds) and re-tune `aurora` +
 * `sage` accents. Peach / lavender / warm / mist stay consistent so brand
 * tone remains recognizable across themes (warm off-white text, peach energy).
 *
 * User selection persists via `ThemeProvider` (see `useTheme.ts`).
 */

import { palette as cosmicPalette, type PaletteShape } from "./colors";

export type { PaletteShape };

export type ThemeId = "cosmic" | "warmEarth" | "oceanCalm" | "deepForest" | "softRose";

export interface ThemePreset {
  id: ThemeId;
  label: string;
  /** One-line summary shown under the preset name in the theme picker */
  description: string;
  /** Palette object — same shape as `palette` from `colors.ts`, with widened hex strings */
  palette: PaletteShape;
}

/** Build a preset by overriding only the families that change; everything else
 *  falls back to the cosmic defaults so shape stays stable. */
function makePreset(
  id: ThemeId,
  label: string,
  description: string,
  overrides: {
    midnight: { 950: string; 900: string; 800: string; 700: string; 600: string };
    aurora: { 100: string; 300: string; 500: string; 700: string };
    sage: { 100: string; 300: string; 500: string; 700: string };
  }
): ThemePreset {
  return {
    id,
    label,
    description,
    palette: {
      ...(cosmicPalette as unknown as PaletteShape),
      midnight: overrides.midnight,
      aurora: overrides.aurora,
      sage: overrides.sage,
    },
  };
}

export const presets: Readonly<Record<ThemeId, ThemePreset>> = {
  cosmic: {
    id: "cosmic",
    label: "Cosmic Night",
    description: "Deep midnight, aurora glow",
    palette: cosmicPalette as unknown as PaletteShape,
  },

  warmEarth: makePreset(
    "warmEarth",
    "Warm Earth",
    "Walnut brown, terracotta, olive",
    {
      midnight: { 950: "#0F0B08", 900: "#1A130D", 800: "#2A1F15", 700: "#3D2D20", 600: "#5A4430" },
      aurora:   { 100: "#F3E3D4", 300: "#E5B089", 500: "#D4915E", 700: "#A66F45" },
      sage:     { 100: "#D9E2CC", 300: "#8BA67A", 500: "#6D895F", 700: "#526B47" },
    },
  ),

  oceanCalm: makePreset(
    "oceanCalm",
    "Ocean Calm",
    "Deep sea, teal, seafoam",
    {
      midnight: { 950: "#030D14", 900: "#04141F", 800: "#0A2333", 700: "#10334A", 600: "#1A4860" },
      aurora:   { 100: "#CCECF2", 300: "#7FCAD8", 500: "#5BB8C9", 700: "#3F93A2" },
      sage:     { 100: "#D1ECE0", 300: "#6EC5A8", 500: "#53A58A", 700: "#3E836B" },
    },
  ),

  deepForest: makePreset(
    "deepForest",
    "Deep Forest",
    "Emerald, warm amber",
    {
      midnight: { 950: "#040E08", 900: "#071A10", 800: "#0D2B1B", 700: "#144028", 600: "#1F5838" },
      aurora:   { 100: "#F5E6C4", 300: "#DFB771", 500: "#D4A545", 700: "#A9802D" },
      sage:     { 100: "#CFE7D7", 300: "#68B088", 500: "#4F926D", 700: "#3A7254" },
    },
  ),

  softRose: makePreset(
    "softRose",
    "Soft Rose",
    "Plum, dusty rose, gold",
    {
      midnight: { 950: "#0E0610", 900: "#180A1A", 800: "#2A1226", 700: "#3E1C37", 600: "#582A4C" },
      aurora:   { 100: "#F2D7E1", 300: "#E39CB2", 500: "#D4789A", 700: "#A85478" },
      sage:     { 100: "#E7D6D9", 300: "#B8909A", 500: "#976E79", 700: "#74545C" },
    },
  ),
};

/** Ordered list for iteration (theme switcher UI) */
export const presetList: readonly ThemePreset[] = [
  presets.cosmic,
  presets.warmEarth,
  presets.oceanCalm,
  presets.deepForest,
  presets.softRose,
];

export const DEFAULT_THEME_ID: ThemeId = "cosmic";
