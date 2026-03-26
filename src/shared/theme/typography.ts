/**
 * Typography Tokens
 * Defines the complete type scale, font families, weights, and letter spacing.
 */

export const fontFamily = {
  /** System font - used until a custom font is loaded */
  sans: undefined as string | undefined, // undefined = system default (SF Pro / Roboto)
  mono: "monospace",
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
} as const;

/** Extended type scale including display sizes for scores/counters */
export const typeScale = {
  // Display sizes (large numbers, scores, counters)
  display1: { fontSize: 80, lineHeight: 88, fontWeight: fontWeight.extraBold },
  display2: { fontSize: 64, lineHeight: 72, fontWeight: fontWeight.extraBold },
  display3: { fontSize: 48, lineHeight: 56, fontWeight: fontWeight.bold },
  display4: { fontSize: 36, lineHeight: 44, fontWeight: fontWeight.bold },
  // Headings
  h1: { fontSize: 32, lineHeight: 40, fontWeight: fontWeight.bold },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: fontWeight.bold },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: fontWeight.semibold },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: fontWeight.semibold },
  h5: { fontSize: 18, lineHeight: 24, fontWeight: fontWeight.semibold },
  h6: { fontSize: 16, lineHeight: 22, fontWeight: fontWeight.semibold },
  // Body
  body1: { fontSize: 16, lineHeight: 24, fontWeight: fontWeight.regular },
  body2: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.regular },
  // Utility
  caption: { fontSize: 12, lineHeight: 16, fontWeight: fontWeight.regular },
  overline: { fontSize: 10, lineHeight: 14, fontWeight: fontWeight.medium, letterSpacing: letterSpacing.wider },
  button: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.semibold },
  link: { fontSize: 14, lineHeight: 20, fontWeight: fontWeight.medium },
} as const;

export type TypeScaleKey = keyof typeof typeScale;
export type FontWeightKey = keyof typeof fontWeight;
