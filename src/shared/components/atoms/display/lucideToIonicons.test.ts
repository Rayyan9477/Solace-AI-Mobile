import fs from "fs";
import path from "path";

import { LUCIDE_TO_IONICON, resolveIconName } from "./lucideToIonicons";

describe("lucideToIonicons", () => {
  describe("LUCIDE_TO_IONICON map", () => {
    it("maps canonical Lucide names to Ionicons equivalents", () => {
      expect(LUCIDE_TO_IONICON["heart"]).toBe("heart-outline");
      expect(LUCIDE_TO_IONICON["chevron-right"]).toBe("chevron-forward");
      expect(LUCIDE_TO_IONICON["arrow-left"]).toBe("arrow-back");
      expect(LUCIDE_TO_IONICON["x"]).toBe("close");
      expect(LUCIDE_TO_IONICON["check"]).toBe("checkmark");
      expect(LUCIDE_TO_IONICON["plus"]).toBe("add");
    });

    it("covers the wellness-critical icons used across prototype hero screens", () => {
      expect(LUCIDE_TO_IONICON["sparkles"]).toBe("sparkles-outline");
      expect(LUCIDE_TO_IONICON["shield-check"]).toBe("shield-checkmark-outline");
      expect(LUCIDE_TO_IONICON["moon"]).toBe("moon-outline");
      expect(LUCIDE_TO_IONICON["flame"]).toBe("flame-outline");
      expect(LUCIDE_TO_IONICON["phone"]).toBe("call-outline");
      expect(LUCIDE_TO_IONICON["book-open"]).toBe("book-outline");
    });

    it("never maps to a value that starts with 'lucide-' or any non-Ionicons prefix", () => {
      Object.entries(LUCIDE_TO_IONICON).forEach(([key, value]) => {
        expect(value).not.toMatch(/^lucide-/);
        expect(value).not.toMatch(/^feather-/);
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe("resolveIconName", () => {
    it("translates known Lucide names", () => {
      expect(resolveIconName("heart")).toBe("heart-outline");
      expect(resolveIconName("pen-line")).toBe("create-outline");
    });

    it("passes Ionicons names through unchanged", () => {
      expect(resolveIconName("chevron-forward")).toBe("chevron-forward");
      expect(resolveIconName("heart-outline")).toBe("heart-outline");
      expect(resolveIconName("locate-outline")).toBe("locate-outline");
    });

    it("passes unknown names through unchanged (consumer responsibility)", () => {
      expect(resolveIconName("totally-made-up-icon")).toBe("totally-made-up-icon");
    });
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * Repo-wide icon guard
 *
 * An unmapped Lucide name does not throw. `resolveIconName()` hands it straight
 * to Ionicons, which renders an empty "missing glyph" box — silent in tests,
 * invisible in review, and already shipped twice in this repo. Reviewing icon
 * names by hand has failed, so the tree checks itself.
 *
 * `src/shared/content/catalog.test.ts` does this for one module; the block below
 * generalises it to every icon name written anywhere under `src/`.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Repo `src/` root — this file lives at `src/shared/components/atoms/display`. */
const SRC_ROOT = path.resolve(__dirname, "..", "..", "..", "..");

/**
 * The glyph table the app actually renders from.
 *
 * `AppIcon` imports `react-native-vector-icons/Ionicons`, but `jest-expo`
 * remaps that module to `@expo/vector-icons`, whose vendored glyph map is a
 * strict superset (1357 names against 1338). Asserting through the mapped
 * module would let those extra names pass here and render a missing glyph on
 * device, so the shipped table is read straight off disk instead of imported.
 */
const IONICONS_GLYPHS = JSON.parse(
  fs.readFileSync(
    path.resolve(
      SRC_ROOT,
      "..",
      "node_modules",
      "react-native-vector-icons",
      "glyphmaps",
      "Ionicons.json",
    ),
    "utf8",
  ),
) as Record<string, number>;

/** True when `name` is a glyph the bundled Ionicons font can draw. */
function isIoniconsGlyph(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(IONICONS_GLYPHS, name);
}

/**
 * Every syntax through which a *static* icon name reaches Ionicons here:
 *
 *  1. `<AppIcon name=…>`  — translated by `resolveIconName()`.
 *  2. `<Icon name=…>`     — `react-native-vector-icons/Ionicons` rendered
 *                           directly, so the name must already be a glyph.
 *  3. `iconName` prop or object field — the house convention for a name that is
 *     forwarded to `AppIcon`/`IconTile` (`catalog.ts`, `SettingsRow`, …).
 *  4. `icon` prop or object field holding a string literal.
 *
 * Capture group 1 is a bare string literal; group 2 is a `{…}` expression, from
 * which only ternary *branches* are read. Reading every literal in the
 * expression would also pick up comparison operands — `name={sender === "ai" ?
 * "hardware-chip-outline" : "person-circle-outline"}` would yield a phantom
 * `"ai"` icon. Pattern 4 deliberately accepts only a quoted value so that
 * `icon: { alignItems: "center" }` StyleSheet keys are not mistaken for names.
 */
const ICON_NAME_PATTERNS: readonly string[] = [
  '<AppIcon\\b[\\s\\S]{0,400}?\\bname=(?:"([^"]+)"|\\{([^{}]*)\\})',
  '<Icon\\b[\\s\\S]{0,400}?\\bname=(?:"([^"]+)"|\\{([^{}]*)\\})',
  '\\biconName\\s*[:=]\\s*(?:"([^"]+)"|\\{([^{}]*)\\})',
  '\\bicon\\s*[:=]\\s*"([^"]+)"',
];

/** One statically-declared icon name and the `src/`-relative site it came from. */
interface IconSite {
  readonly name: string;
  readonly location: string;
}

/** Result of a full sweep of the source tree. */
interface IconScan {
  /** Number of source files read. */
  readonly fileCount: number;
  /** Every static icon name found, one entry per call site. */
  readonly sites: readonly IconSite[];
  /**
   * Call sites whose name is computed at runtime (`name={item.iconName}`,
   * `PROVIDER_ICON[provider]`, `getIconName()`), so no literal is recoverable
   * from the source text. Reported, never asserted — the literals that feed most
   * of them are caught at their own declaration site by pattern 3.
   */
  readonly dynamicSites: readonly string[];
}

/**
 * Recursively list the `.ts`/`.tsx` sources that ship in the app bundle.
 *
 * Tests and snapshots are excluded: they deliberately contain invalid names
 * (`"totally-made-up-icon"` above) and record already-rendered output.
 */
function listSourceFiles(dir: string, acc: string[] = []): string[] {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "__snapshots__" && entry.name !== "__mocks__") {
        listSourceFiles(full, acc);
      }
    } else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      acc.push(full);
    }
  });
  return acc;
}

/**
 * Blank out comments so a JSDoc `@example` cannot invent a call site, while
 * preserving the line count so reported locations stay accurate.
 *
 * Only whole-line `//` comments are removed — a trailing `// approximation`
 * note cannot declare an icon name, and leaving trailing comments alone avoids
 * mangling any `https://` inside a string literal.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ""))
    .replace(/^[ \t]*\/\/.*$/gm, "");
}

/** Sweep `src/` for every statically-declared icon name. */
function scanForIconNames(): IconScan {
  const files = listSourceFiles(SRC_ROOT);
  const sites: IconSite[] = [];
  const dynamicSites: string[] = [];

  files.forEach((file) => {
    const source = stripComments(fs.readFileSync(file, "utf8"));
    const relative = path.relative(SRC_ROOT, file).split(path.sep).join("/");

    ICON_NAME_PATTERNS.forEach((pattern) => {
      const matcher = new RegExp(pattern, "g");
      let match = matcher.exec(source);
      while (match !== null) {
        const line = source.slice(0, match.index).split("\n").length;
        const location = `src/${relative}:${line}`;
        const names = match[1]
          ? [match[1]]
          : Array.from((match[2] ?? "").matchAll(/[?:]\s*"([^"]+)"/g)).map(
              (branch) => branch[1] as string,
            );

        if (names.length === 0) {
          dynamicSites.push(location);
        } else {
          names.forEach((name) => sites.push({ location, name }));
        }
        match = matcher.exec(source);
      }
    });
  });

  return { dynamicSites, fileCount: files.length, sites };
}

const ICON_SCAN = scanForIconNames();

describe("repo-wide icon guard", () => {
  // Without this the guard could go green by scanning nothing — a regex that
  // stops matching after a refactor, or a moved glyph map, would look exactly
  // like a clean bill of health.
  it("actually reaches the source tree and the glyph table", () => {
    expect(ICON_SCAN.fileCount).toBeGreaterThan(150);
    expect(new Set(ICON_SCAN.sites.map((site) => site.name)).size).toBeGreaterThan(
      50,
    );
    expect(Object.keys(IONICONS_GLYPHS).length).toBeGreaterThan(1000);
  });

  it("renders only icon names that resolve to a real Ionicons glyph", () => {
    const unresolved = ICON_SCAN.sites
      .filter((site) => !isIoniconsGlyph(resolveIconName(site.name)))
      .map((site) => `${site.name} -> ${resolveIconName(site.name)} @ ${site.location}`);

    expect(unresolved).toEqual([]);
  });

  it("maps every Lucide alias onto a real Ionicons glyph", () => {
    const brokenTargets = Object.entries(LUCIDE_TO_IONICON)
      .filter(([, ionicon]) => !isIoniconsGlyph(ionicon))
      .map(([lucide, ionicon]) => `${lucide} -> ${ionicon}`);

    expect(brokenTargets).toEqual([]);
  });
});
