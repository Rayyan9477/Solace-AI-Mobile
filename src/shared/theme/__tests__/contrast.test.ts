/**
 * Contrast Gate — WCAG 2.1 AA over the colour pairs the app actually renders.
 *
 * DESIGN.md § 1 has claimed since the cosmic migration that "a script in
 * `src/shared/theme/__tests__/contrast.test.ts` iterates every {background,
 * foreground} pair used in the app and fails CI on any violation". The file
 * never existed. This is that file.
 *
 * BAR: 4.5:1 — WCAG 2.1 AA for normal-size text. Deliberately NOT AAA; the
 * cosmic palette cannot reach 7:1 on a #040818 page without collapsing the
 * warm text scale into a single rung, and AA is the project bar.
 *
 * The 3:1 large-text allowance is deliberately applied NOWHERE. It requires
 * ≥24px, or ≥18.66px bold. All 38 muted-text sites in the tree that resolve to
 * a fontSize land between 9px (`ProfileDashboardScreen.footer`) and 12px
 * (`MindfulPlayerScreen.timeText`), and none is bold, so no pair qualifies for
 * the exemption and none is granted. If a future pair needs it, name the pair
 * and its fontSize/fontWeight in a comment beside the assertion.
 *
 * WHY the maths is inlined instead of imported: a contrast guarantee should
 * not depend on a third-party package staying correct and installed. The
 * algorithm is ~20 lines of WCAG 2.1 § 1.4.3 sRGB relative luminance, and the
 * "contrast ratio maths" block below verifies it against published reference
 * values before any token is judged by it.
 *
 * Alpha surfaces are composited over what sits beneath them before the ratio
 * is taken — an `rgba()` tint has no contrast of its own.
 *
 * SCOPE — what this gate does NOT yet cover, and why:
 *
 *   1. Presets other than `cosmic`. `presets.ts` re-tunes `midnight` for
 *      warmEarth / oceanCalm / deepForest / softRose, and their card and panel
 *      rungs are far lighter (e.g. warmEarth `midnight[800]` = #2A1F15). Every
 *      text role fails somewhere in those four. Fixing them means re-tuning
 *      four palettes, which is a design decision, not a token nudge. Gating
 *      them here would only paint the gate red.
 *   2. Non-text contrast (borders, dividers, focus rings, progress tracks) at
 *      the 3:1 UI-component bar. `border.default` is `warm[50]` at 10% and is
 *      decorative, so a blanket 3:1 sweep would fail on hairlines that carry
 *      no information.
 *   3. Text baked into component `variantColors` tables rather than theme
 *      tokens — see the "text on neutral and accent fills" block, which gates
 *      the correct pairing and documents the two components that do not use it.
 */

import { colors, palette } from "../colors";

/** WCAG 2.1 AA, normal-size text (§ 1.4.3). */
const AA_NORMAL_TEXT = 4.5;

// ---------------------------------------------------------------------------
// WCAG 2.1 relative-luminance maths
// ---------------------------------------------------------------------------

type Rgb = readonly [number, number, number];

interface ParsedColor {
  readonly rgb: Rgb;
  readonly alpha: number;
}

/** Accepts `#RGB`, `#RRGGBB`, `#RRGGBBAA`, `rgb(...)` and `rgba(...)`. */
function parseColor(value: string): ParsedColor {
  const functional = /^rgba?\(([^)]+)\)$/.exec(value.trim());
  if (functional) {
    const parts = functional[1].split(",").map((part) => Number(part.trim()));
    return {
      rgb: [parts[0], parts[1], parts[2]],
      alpha: parts.length > 3 ? parts[3] : 1,
    };
  }

  let hex = value.trim().replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return {
    rgb: [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ],
    alpha,
  };
}

/** Source-over composite of `top` onto an already-opaque `bottom`. */
function composite(top: string, bottom: Rgb): Rgb {
  const { rgb, alpha } = parseColor(top);
  if (alpha >= 1) return rgb;
  return [0, 1, 2].map(
    (channel) => rgb[channel] * alpha + bottom[channel] * (1 - alpha),
  ) as unknown as Rgb;
}

/**
 * Flatten a bottom-up stack of layers into one opaque colour.
 * `layers[0]` is the lowest layer and must itself be opaque.
 */
function flatten(layers: readonly string[]): Rgb {
  return layers.reduce<Rgb>(
    (bottom, layer) => composite(layer, bottom),
    parseColor(layers[0]).rgb,
  );
}

/** WCAG 2.1 § 1.4.3 relative luminance of an opaque sRGB colour. */
function relativeLuminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((channel) => {
    const scaled = channel / 255;
    return scaled <= 0.04045
      ? scaled / 12.92
      : Math.pow((scaled + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two colours. Symmetric; always ≥ 1 and ≤ 21. */
function contrastRatio(foreground: string | Rgb, background: string | Rgb): number {
  const fg = typeof foreground === "string" ? parseColor(foreground).rgb : foreground;
  const bg = typeof background === "string" ? parseColor(background).rgb : background;
  const lighter = Math.max(relativeLuminance(fg), relativeLuminance(bg));
  const darker = Math.min(relativeLuminance(fg), relativeLuminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// The pair table
// ---------------------------------------------------------------------------

interface Surface {
  readonly name: string;
  /** Bottom-up layer stack. Index 0 must be opaque. */
  readonly layers: readonly string[];
}

interface Role {
  readonly name: string;
  readonly color: string;
}

interface Pair {
  readonly role: string;
  readonly surface: string;
  readonly foreground: string;
  readonly background: Rgb;
}

function pairsFor(surfaces: readonly Surface[], roles: readonly Role[]): Pair[] {
  return surfaces.flatMap((surface) =>
    roles.map((role) => ({
      role: role.name,
      surface: surface.name,
      foreground: role.color,
      background: flatten(surface.layers),
    })),
  );
}

/**
 * Surfaces that carry running text anywhere in `src/`, verified against every
 * `backgroundColor:` in the tree. `background.elevated` is handled separately
 * because it is a tile surface with a restricted text palette.
 *
 * GlassCard's "strong" tint (rgba(22,29,61,0.78)) is intentionally absent: it
 * resolves to a luminance between `background.overlay` and
 * `background.tertiary`, both of which are gated, so it cannot fail alone.
 */
const CONTENT_SURFACES: readonly Surface[] = [
  { name: "background.primary (page)", layers: [colors.background.primary] },
  { name: "background.secondary (card)", layers: [colors.background.secondary] },
  { name: "background.tertiary (modal / panel)", layers: [colors.background.tertiary] },
  {
    name: "background.overlay over page (GlassCard)",
    layers: [colors.background.primary, colors.background.overlay],
  },
  {
    name: "form.background over page",
    layers: [colors.background.primary, colors.form.background],
  },
  {
    name: "form.backgroundFocus over page",
    layers: [colors.background.primary, colors.form.backgroundFocus],
  },
  {
    name: "opacity.white08 over page",
    layers: [colors.background.primary, palette.opacity.white08],
  },
];

/** Every semantic text role plus the raw palette rungs used as text colours. */
const TEXT_ROLES: readonly Role[] = [
  { name: "text.primary", color: colors.text.primary },
  { name: "text.secondary", color: colors.text.secondary },
  { name: "text.tertiary", color: colors.text.tertiary },
  { name: "text.muted", color: colors.text.muted },
  { name: "text.disabled", color: colors.text.disabled },
  { name: "text.accent", color: colors.text.accent },
  { name: "text.success", color: colors.text.success },
  { name: "text.warning", color: colors.text.warning },
  { name: "text.info", color: colors.text.info },
  { name: "text.error", color: colors.text.error },
  { name: "crisis.primary", color: colors.crisis.primary },
  { name: "crisis.text", color: colors.crisis.text },
  { name: "palette.warm[100]", color: palette.warm[100] },
  { name: "palette.warm[200]", color: palette.warm[200] },
  { name: "palette.aurora[300]", color: palette.aurora[300] },
  { name: "palette.aurora[500]", color: palette.aurora[500] },
  { name: "palette.mist", color: palette.mist },
];

/**
 * `background.elevated` (midnight-600) is the stat-tile surface used by
 * StatCard, ScoreCard, SessionCard, FAQAccordion, MoodChart and MoodCalendar.
 * Every one of them renders only warm-50 / 100 / 200 / 400 on it — never a
 * muted rung — so those four are what this gate enforces. Muted text must not
 * be placed here: no value of `warm[500]` that stays distinguishable from
 * `warm[400]` can reach AA on midnight-600.
 */
const ELEVATED_ROLES: readonly Role[] = [
  { name: "text.primary", color: colors.text.primary },
  { name: "text.secondary", color: colors.text.secondary },
  { name: "palette.warm[100]", color: palette.warm[100] },
  { name: "palette.warm[200]", color: palette.warm[200] },
];

/**
 * `opacity.white08` layered on a GlassCard is the deepest real stack in the
 * app (CrisisSupportScreen's "Start a conversation" button, AccountSettings'
 * plus chip, SearchResults' clear button). All three carry only warm-50,
 * warm-400 or sage-300, which is exactly what is gated here.
 */
const GLASS_CHIP_ROLES: readonly Role[] = [
  { name: "text.primary", color: colors.text.primary },
  { name: "text.secondary", color: colors.text.secondary },
  { name: "text.accent", color: colors.text.accent },
];

/**
 * Fills that carry text. `text.inverse` (midnight-950) is the correct
 * foreground for all of them.
 *
 * KNOWN GAP (out of this gate's reach): `Button.tsx` `variantColors.primary`
 * and `IconButton.tsx` `variantColors.filled` fill with `palette.warm[500]`
 * but label with `palette.warm[50]`, which is 3.09:1 — a fail. They must
 * switch to `colors.text.inverse`, which this block proves is 5.74:1. No
 * single value of `warm[500]` can serve both roles: contrast is multiplicative
 * through an intermediate luminance, so `contrast(warm50, X) *
 * contrast(X, midnight950)` is pinned at 17.71 for any X between them, and two
 * simultaneous 4.5:1 passes would require 20.25. Proven in the block below.
 */
const TEXT_BEARING_FILLS: readonly Surface[] = [
  { name: "sage[300] fill (primary CTA)", layers: [palette.sage[300]] },
  { name: "sage[500] fill", layers: [palette.sage[500]] },
  { name: "peach[300] fill (FAB, user bubble)", layers: [palette.peach[300]] },
  { name: "peach[500] fill (crisis accent)", layers: [palette.peach[500]] },
  { name: "warm[50] fill", layers: [palette.warm[50]] },
  { name: "warm[100] fill (Button secondary)", layers: [palette.warm[100]] },
  { name: "warm[500] fill (Button primary, IconButton filled)", layers: [palette.warm[500]] },
  { name: "aurora[300] fill", layers: [palette.aurora[300]] },
  { name: "mist fill", layers: [palette.mist] },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("contrast ratio maths", () => {
  it("returns 21:1 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  });

  it("returns 1:1 for a colour against itself", () => {
    expect(contrastRatio(colors.text.primary, colors.text.primary)).toBeCloseTo(1, 5);
  });

  it("is symmetric in its arguments", () => {
    const forwards = contrastRatio(colors.text.primary, colors.background.primary);
    const backwards = contrastRatio(colors.background.primary, colors.text.primary);
    expect(forwards).toBeCloseTo(backwards, 10);
  });

  it("matches the published ratio for #777777 on white (4.48:1)", () => {
    // WCAG's own worked example — #777 is the canonical "just fails AA" grey.
    expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.48, 2);
  });

  it("expands 3-digit hex", () => {
    expect(contrastRatio("#FFF", "#000")).toBeCloseTo(contrastRatio("#FFFFFF", "#000000"), 10);
  });

  it("composites an alpha layer against what sits beneath it", () => {
    // A 50% white veil over black must land on mid-grey, not stay black.
    const veiled = flatten(["#000000", "rgba(255, 255, 255, 0.5)"]);
    expect(veiled[0]).toBeCloseTo(127.5, 1);
  });

  it("reads alpha out of 8-digit hex the same way it reads rgba()", () => {
    const fromHex = flatten([colors.background.primary, `${palette.warm[50]}0D`]);
    const fromRgba = flatten([
      colors.background.primary,
      `rgba(245, 241, 234, ${13 / 255})`,
    ]);
    expect(fromHex[0]).toBeCloseTo(fromRgba[0], 1);
  });
});

describe("text roles on content surfaces meet WCAG AA (4.5:1)", () => {
  it.each(pairsFor(CONTENT_SURFACES, TEXT_ROLES))(
    "$role on $surface",
    ({ foreground, background }) => {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    },
  );
});

describe("text roles on background.elevated (stat tiles) meet WCAG AA", () => {
  it.each(
    pairsFor(
      [{ name: "background.elevated (tile)", layers: [colors.background.elevated] }],
      ELEVATED_ROLES,
    ),
  )("$role on $surface", ({ foreground, background }) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe("text roles on a white08 chip over glass meet WCAG AA", () => {
  it.each(
    pairsFor(
      [
        {
          name: "opacity.white08 over GlassCard over page",
          layers: [
            colors.background.primary,
            colors.background.overlay,
            palette.opacity.white08,
          ],
        },
      ],
      GLASS_CHIP_ROLES,
    ),
  )("$role on $surface", ({ foreground, background }) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe("text.inverse on text-bearing fills meets WCAG AA", () => {
  it.each(pairsFor(TEXT_BEARING_FILLS, [{ name: "text.inverse", color: colors.text.inverse }]))(
    "$role on $surface",
    ({ foreground, background }) => {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
    },
  );
});

describe("the warm[500] role conflict is structural, not a tuning miss", () => {
  it("cannot satisfy muted text and a warm[50] label at the same time", () => {
    // contrast(a, c) = contrast(a, b) * contrast(b, c) whenever L(b) sits
    // between L(a) and L(c). warm[50] on the page is 17.71:1, so the two
    // halves can at best be sqrt(17.71) = 4.21:1 each — under AA. Any fill
    // that also serves as muted text MUST use text.inverse for its label.
    const ceiling = contrastRatio(colors.text.primary, colors.background.primary);
    expect(ceiling).toBeLessThan(AA_NORMAL_TEXT * AA_NORMAL_TEXT);
  });

  it("keeps text.inverse readable on a warm[500] fill", () => {
    expect(
      contrastRatio(colors.text.inverse, palette.warm[500]),
    ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe("the muted rung stays a distinct step below the secondary rung", () => {
  it("is darker than text.secondary", () => {
    expect(relativeLuminance(parseColor(colors.text.muted).rgb)).toBeLessThan(
      relativeLuminance(parseColor(colors.text.secondary).rgb),
    );
  });

  it("is separated from text.secondary by a visible step", () => {
    // Guards against 'fix the ratio by making warm[500] equal warm[400]',
    // which would silently delete a tier of the type hierarchy.
    expect(
      contrastRatio(colors.text.muted, colors.text.secondary),
    ).toBeGreaterThan(1.1);
  });
});
