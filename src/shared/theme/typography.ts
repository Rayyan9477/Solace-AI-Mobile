/**
 * Typography Tokens — Cosmic Editorial (prototype v4.2)
 *
 * The three-voice editorial system:
 *   Fraunces   (serif, variable)     — display headlines, italic accents, brand voice
 *   Inter      (sans)                — body, labels, UI
 *   Fira Code  (mono)                — numerical data, [ BRACKET LABELS ], timestamps
 *
 * Fonts load via `@expo-google-fonts/*` in `App.tsx`. When `fontsLoaded === false`
 * the splash screen stays visible, so these fontFamily strings are always valid
 * by the time any component renders.
 *
 * Legacy typeScale keys (display1-4, h1-6, body1-2, caption, overline, button,
 * link) are retained so existing consumers keep compiling. New editorial keys
 * (displayXL/L/M, bodyL/M/S, mono, label) are added per DESIGN.md § 2.
 */

/**
 * Canonical font family names (match the keys exported by @expo-google-fonts).
 * Use these via `fontFamily.<role>` — never hard-code the raw string.
 */
export const fontFamily = {
  /** Default sans — maps to `Inter_400Regular`. Legacy key kept (was `undefined`). */
  sans: "Inter_400Regular",
  /** Inter variants */
  sansMedium: "Inter_500Medium",
  sansSemibold: "Inter_600SemiBold",

  /** Display serif — Fraunces regular/medium/semibold + italic accent */
  display: "Fraunces_500Medium",
  displayBold: "Fraunces_600SemiBold",
  displayItalic: "Fraunces_400Regular_Italic",
  displayRegular: "Fraunces_400Regular",

  /** Monospace — numbers, brackets, versions */
  mono: "FiraCode_400Regular",
  monoMedium: "FiraCode_500Medium",
} as const;

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extraBold: "800" as const,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  /** Editorial uppercase tracking — used on bracket labels */
  ultraWide: 1.5,
} as const;

/**
 * Type scale — numbers are point sizes (fontSize) and leadings (lineHeight).
 *
 * Legacy keys (display1-4, h1-h6, body1-2, caption, overline, button, link)
 * are kept pointing to sensible cosmic-editorial values so existing screens
 * keep rendering without change. New screens should prefer the editorial
 * keys (displayXL/L/M, bodyL/M/S, mono, label).
 */
export const typeScale = {
  // ---- Editorial (cosmic v4.2 — use these in new code) --------------------
  displayXL: { fontSize: 52, lineHeight: 55, fontFamily: fontFamily.displayItalic },
  displayL:  { fontSize: 36, lineHeight: 40, fontFamily: fontFamily.display },
  displayM:  { fontSize: 24, lineHeight: 29, fontFamily: fontFamily.display },
  bodyL:     { fontSize: 17, lineHeight: 26, fontFamily: fontFamily.sans },
  bodyM:     { fontSize: 14, lineHeight: 21, fontFamily: fontFamily.sans },
  bodyS:     { fontSize: 12, lineHeight: 17, fontFamily: fontFamily.sansMedium },
  mono:      { fontSize: 14, lineHeight: 14, fontFamily: fontFamily.mono },
  label:     {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: fontFamily.monoMedium,
    letterSpacing: letterSpacing.ultraWide,
    textTransform: "uppercase" as const,
  },

  // ---- Legacy scale (kept so existing screens compile; retuned to Fraunces) ---
  display1: { fontSize: 80, lineHeight: 88, fontWeight: fontWeight.extraBold, fontFamily: fontFamily.display },
  display2: { fontSize: 64, lineHeight: 72, fontWeight: fontWeight.extraBold, fontFamily: fontFamily.display },
  display3: { fontSize: 48, lineHeight: 56, fontWeight: fontWeight.bold,      fontFamily: fontFamily.display },
  display4: { fontSize: 36, lineHeight: 44, fontWeight: fontWeight.bold,      fontFamily: fontFamily.display },

  h1: { fontSize: 32, lineHeight: 40, fontWeight: fontWeight.bold,      fontFamily: fontFamily.display },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: fontWeight.bold,      fontFamily: fontFamily.displayBold },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: fontWeight.semibold,  fontFamily: fontFamily.displayBold },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: fontWeight.semibold,  fontFamily: fontFamily.sansSemibold },
  h5: { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold,  fontFamily: fontFamily.sansSemibold },
  h6: { fontSize: 16, lineHeight: 22, fontWeight: fontWeight.semibold,  fontFamily: fontFamily.sansSemibold },

  body1: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular, fontFamily: fontFamily.sans },
  body2: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular, fontFamily: fontFamily.sans },

  caption:  { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular, fontFamily: fontFamily.sans },
  overline: {
    fontSize: 10, lineHeight: 14,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.monoMedium,
    letterSpacing: letterSpacing.wider,
  },
  button: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.semibold, fontFamily: fontFamily.sansSemibold },
  link:   { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.medium,   fontFamily: fontFamily.sansMedium },
} as const;

export type TypeScaleKey = keyof typeof typeScale;
export type FontWeightKey = keyof typeof fontWeight;
