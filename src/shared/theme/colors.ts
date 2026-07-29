/**
 * Color Tokens — Cosmic Editorial Palette (prototype v4.2)
 *
 * Migration note (2026-04-22): this file was rewritten to ship the cosmic
 * editorial palette (midnight / aurora / sage / peach / lavender / warm / mist).
 * Legacy palette keys (`brown`, `tan`, `olive`, `gold`, `stone`, etc.) are
 * **retained as aliases** so the ~160 legacy consumers keep compiling, but
 * their values now render the cosmic equivalent colors. New code should import
 * cosmic families directly (`palette.midnight[950]`, `palette.sage[300]`, …).
 *
 * Dark-mode first. Body text is warm-50 (#F5F1EA), NEVER pure white (#FFFFFF).
 * Background is midnight-950 (#040818), NEVER pure black.
 *
 * @example
 *   import { colors, palette } from '@/shared/theme';
 *   const s = StyleSheet.create({
 *     bg:   { backgroundColor: palette.midnight[950] },
 *     card: { backgroundColor: colors.background.card },
 *   });
 */

// -----------------------------------------------------------------------------
// Cosmic palette (source of truth for new code)
// -----------------------------------------------------------------------------

const midnight = {
  950: "#040818", // page background — deeper/bluer than pure black
  900: "#070C20",
  800: "#0E1430", // cards, raised surfaces
  700: "#161D3D", // modals, elevated panels
  600: "#202A55",
} as const;

const aurora = {
  100: "#D6E0FF",
  300: "#8AA3FF", // cosmic blue accent — links, secondary CTAs, kickers
  500: "#6B8FFF", // primary aurora — button fills, pulse glows
  700: "#4A6FE5",
} as const;

const sage = {
  100: "#D8EADF",
  300: "#9BC4B0", // primary therapeutic accent — ring progress, primary CTAs
  500: "#7AAA94",
  700: "#5A8A78",
} as const;

const peach = {
  100: "#FCE3D4",
  300: "#F4A77E", // energy accent — FAB, user chat bubble, streaks
  500: "#E88B5A",
} as const;

const lavender = {
  100: "#E0DAF3",
  300: "#A89AE0", // mindfulness, sleep, grief
  500: "#8B7CC8",
} as const;

const warm = {
  50:  "#F5F1EA", // primary text — warm off-white (never #FFFFFF)
  100: "#EAE3D5",
  200: "#C7BEA9",
  400: "#8B95A8", // secondary text — 6.61:1 on midnight-950, 4.98:1 worst case
  // Muted / captions / labels. Retuned 2026-07-28 from #5A6478, which measured
  // 3.35:1 on the page and 2.73:1 on a focused form field — a WCAG AA failure
  // on all 7 text surfaces and on ~56 files. This value is the same hue
  // (r:g:b 90:100:120) scaled 1.38x, the smallest step that clears 4.5:1
  // everywhere `warm[500]` renders as text while staying a visible step below
  // `warm[400]`. Enforced by `__tests__/contrast.test.ts`.
  500: "#7C8AA6",
} as const;

const mist = "#BFCFE8"; // breathing-element highlight

// -----------------------------------------------------------------------------
// Legacy aliases removed in Sprint 12 (cosmic v4.2 RC)
// -----------------------------------------------------------------------------
// The brown/tan/olive/gold/stone/gray alias families and the palette.white /
// palette.black shorthands were retained through Sprint 11 to keep the ~160
// pre-cosmic consumers compiling. Sprint 12-A reskinned every consumer to
// import the cosmic families directly (midnight/aurora/sage/peach/lavender/
// warm/mist), and the legacy aliases have now been deleted from the export.
//
// New code MUST use the cosmic families directly. There is no fallback.
// -----------------------------------------------------------------------------

// Status palettes (red / green / amber / blue / indigo) keep their hues because
// semantic meaning (error, success, warning, info) is universal. They're tuned
// slightly toward the warmer end to fit the cosmic context without screaming.
const red = {
  900: "#7F1D1D", 800: "#991B1B", 700: "#B91C1C", 600: "#DC2626",
  500: "#E05D5D", // migrated from pure #EF4444 — same role, less clinical
  400: "#F87171", 300: "#FCA5A5", 200: "#FECACA", 100: "#FEE2E2",
} as const;

const green = {
  900: "#14532D", 800: "#166534", 700: "#15803D", 600: "#16A34A",
  500: sage[500], // #7AAA94 — success in cosmic parlance = sage
  450: sage[500],
  400: sage[300], 300: sage[100], 200: sage[100], 100: sage[100],
} as const;

const amber = {
  900: "#78350F", 800: "#92400E", 700: "#B45309", 600: "#D97706",
  500: peach[500], // #E88B5A — warning in cosmic = peach (warm, not alarming)
  450: peach[300],
  400: peach[300], 300: peach[300], 200: peach[100], 100: peach[100],
} as const;

const blue = {
  900: "#1E3A5F", 800: "#1E40AF", 700: "#1D4ED8", 600: "#2563EB",
  500: aurora[500], // #6B8FFF
  400: aurora[300], 300: aurora[300], 200: aurora[100], 100: aurora[100],
} as const;

const indigo = {
  500: lavender[500], // #8B7CC8 — info in cosmic = lavender
  400: lavender[300], // #A89AE0
  300: lavender[300], 200: lavender[100], 100: lavender[100],
} as const;

// Alpha hex suffixes (0-100 → hex two-digit)
const alpha = {
  5: "0D", 10: "1A", 15: "26", 20: "33", 30: "4D", 40: "66",
  50: "80", 60: "99", 70: "B3", 80: "CC", 90: "E6",
} as const;

// Onboarding step colors retuned to cosmic theme palette
const onboarding = {
  step1: sage[300],     // AI Personalization
  step2: peach[300],    // Mood tracking
  step3: warm[400],     // Journaling
  step4: aurora[500],   // Mindful resources
  step5: lavender[500], // Community
} as const;

// -----------------------------------------------------------------------------
// Complete palette export
// -----------------------------------------------------------------------------
export const palette = {
  // Cosmic families (canonical — Sprint 12 removed legacy aliases)
  midnight,
  aurora,
  sage,
  peach,
  lavender,
  warm,
  mist,

  // Status scales
  red,
  green,
  amber,
  blue,
  indigo,

  // Semantic shorthand
  success: sage[500],
  warning: peach[500],
  error: red[500],
  info: lavender[300],

  // Onboarding
  onboarding,

  // Alpha suffixes
  alpha,

  // Surface accessors (semantic — preferred over family.rung in screens)
  background: {
    primary: midnight[950],
    secondary: midnight[800],
    tertiary: midnight[700],
    quaternary: midnight[600],
    hero: midnight[800],
  },
  text: {
    primary: warm[50],      // NOT pure white — warm off-white per DESIGN.md § 1
    secondary: warm[400],
    tertiary: warm[500],
    disabled: midnight[600],
    inverse: midnight[950],
  },
  accent: {
    orange: peach[500],
    green: sage[300],
    purple: lavender[500],
  },
  opacity: {
    white04: "rgba(255, 255, 255, 0.04)",
    white05: "rgba(255, 255, 255, 0.05)",
    white06: "rgba(255, 255, 255, 0.06)",
    white08: "rgba(255, 255, 255, 0.08)",
    white10: "rgba(255, 255, 255, 0.1)",
    white12: "rgba(255, 255, 255, 0.12)",
    white15: "rgba(255, 255, 255, 0.15)",
    white18: "rgba(255, 255, 255, 0.18)",
    white20: "rgba(255, 255, 255, 0.2)",
    white30: "rgba(255, 255, 255, 0.3)",
    white40: "rgba(255, 255, 255, 0.4)",
    white60: "rgba(255, 255, 255, 0.6)",
    black50: "rgba(0, 0, 0, 0.5)",
    black60: "rgba(0, 0, 0, 0.6)",
    black70: "rgba(0, 0, 0, 0.7)",
  },
  semantic: {
    info: lavender[300],
    success: sage[500],
    warning: peach[500],
    error: red[500],
  },
} as const;

// -----------------------------------------------------------------------------
// Palette shape — widened version of `typeof palette`.
//
// The cosmic palette is declared with `as const`, which narrows every hex
// string to a specific literal type. That is great for autocomplete on
// constants but prevents alternate presets (warm-earth, ocean-calm, etc.)
// from assigning different hex values into the same shape. `PaletteShape`
// widens every string-literal to plain `string` while keeping the object
// structure stable.
// -----------------------------------------------------------------------------
type WidenHex<T> = T extends string
  ? string
  : T extends object
    ? { -readonly [K in keyof T]: WidenHex<T[K]> }
    : T;

export type PaletteShape = WidenHex<typeof palette>;

// -----------------------------------------------------------------------------
// Semantic tokens — built from a palette.
//
// `buildColors(p)` rebuilds semantic tokens from ANY palette (used by the
// runtime theme switcher in `useTheme.ts`). The exported `colors` constant is
// the cosmic default — safe for module-level imports in tests, gradients, and
// other places that must resolve at import time.
// -----------------------------------------------------------------------------
export function buildColors(p: PaletteShape) {
  return {
    background: {
      primary:   p.midnight[950],
      secondary: p.midnight[800],
      tertiary:  p.midnight[700],
      overlay:   "rgba(22,29,61,0.5)", // .glass — midnight-800 @ 50%
      elevated:  p.midnight[600],
    },
    text: {
      primary:   p.warm[50],
      secondary: p.warm[400],
      tertiary:  p.warm[500],
      inverse:   p.midnight[950],
      accent:    p.sage[300],
      disabled:  p.warm[500],
      muted:     p.warm[500],
      error:     p.red[500],
      success:   p.sage[500],
      warning:   p.peach[500],
      info:      p.lavender[300],
    },
    border: {
      default:  `${p.warm[50]}${p.alpha[10]}`,
      light:    `${p.warm[50]}${p.alpha[5]}`,
      medium:   `${p.warm[50]}${p.alpha[20]}`,
      heavy:    `${p.warm[50]}${p.alpha[30]}`,
      accent:   p.sage[300],
      error:    p.red[500],
      hairline: `${p.warm[50]}${p.alpha[5]}`,
    },
    interactive: {
      default:  p.sage[300],
      hover:    p.sage[500],
      active:   p.sage[700],
      disabled: `${p.sage[300]}${p.alpha[30]}`,
      ghost:    `${p.warm[50]}${p.alpha[5]}`,
    },
    status: {
      success: {
        background: `${p.sage[500]}${p.alpha[15]}`,
        border:     `${p.sage[500]}${p.alpha[30]}`,
        text:       p.sage[500],
      },
      warning: {
        background: `${p.peach[500]}${p.alpha[15]}`,
        border:     `${p.peach[500]}${p.alpha[30]}`,
        text:       p.peach[500],
      },
      error: {
        background: `${p.red[500]}${p.alpha[15]}`,
        border:     `${p.red[500]}${p.alpha[30]}`,
        text:       p.red[500],
      },
      info: {
        background: `${p.lavender[300]}${p.alpha[15]}`,
        border:     `${p.lavender[300]}${p.alpha[30]}`,
        text:       p.lavender[300],
      },
    },
    form: {
      background:      `${p.warm[50]}${p.alpha[5]}`,
      backgroundFocus: `${p.warm[50]}${p.alpha[10]}`,
      border:          `${p.warm[50]}${p.alpha[20]}`,
      borderFocus:     p.sage[300],
      borderError:     p.red[500],
      placeholder:     p.warm[400],
      label:           p.warm[400],
    },
    badge: {
      default: { background: p.midnight[700], text: p.warm[100] },
      success: { background: `${p.sage[500]}${p.alpha[20]}`,     text: p.sage[500] },
      warning: { background: `${p.peach[500]}${p.alpha[20]}`,    text: p.peach[500] },
      error:   { background: `${p.red[500]}${p.alpha[20]}`,      text: p.red[500] },
      info:    { background: `${p.lavender[300]}${p.alpha[20]}`, text: p.lavender[300] },
    },
    progress: {
      track:   `${p.warm[50]}${p.alpha[10]}`,
      fill:    p.sage[300],
      success: p.sage[500],
      warning: p.peach[500],
      error:   p.red[500],
    },
    crisis: {
      primary:    p.peach[500],
      background: `${p.peach[500]}${p.alpha[10]}`,
      border:     `${p.peach[500]}${p.alpha[30]}`,
      text:       p.peach[300],
    },
    onboarding: p.onboarding,
    chart: {
      primary:    p.sage[300],
      secondary:  p.aurora[500],
      tertiary:   p.peach[300],
      quaternary: p.lavender[300],
      quinary:    p.amber[500],
      grid:       `${p.warm[50]}${p.alpha[10]}`,
    },
    shadow: {
      default: p.midnight[950],
      subtle:  `${p.midnight[950]}${p.alpha[20]}`,
      medium:  `${p.midnight[950]}${p.alpha[40]}`,
      strong:  `${p.midnight[950]}${p.alpha[60]}`,
    },
  } as const;
}

export const colors = buildColors(palette as unknown as PaletteShape);

// -----------------------------------------------------------------------------
// Utility functions (unchanged API)
// -----------------------------------------------------------------------------
export const colorUtils = {
  /**
   * Add alpha channel to hex color
   * @param hexColor - Hex color string (e.g., "#FFFFFF")
   * @param alpha - Alpha value 0-100
   */
  addAlpha(hexColor: string, alpha: number): string {
    const clampedAlpha = Math.max(0, Math.min(100, alpha));
    const alphaHex = Math.round((clampedAlpha / 100) * 255).toString(16).padStart(2, "0");
    return `${hexColor}${alphaHex}`;
  },

  /**
   * Convert hex to rgba
   * @param hexColor - Hex color string
   * @param alpha - Alpha value 0-1
   */
  hexToRgba(hexColor: string, alpha: number): string {
    let cleanHex = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

// -----------------------------------------------------------------------------
// Type exports
// -----------------------------------------------------------------------------
export type ColorPalette = typeof palette;
export type SemanticColors = typeof colors;
export type ColorToken = keyof typeof colors;

export default colors;
