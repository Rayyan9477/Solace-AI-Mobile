/*
  Static UI implementation audit for Solace-AI-Mobile.

  Goals:
  - Inventory screen files
  - Identify common design-system gaps (hardcoded colors, missing theme usage,
    typography token bypass, accessibility omissions, small touch targets, etc.)
  - Output machine-readable JSON and a human-readable Markdown report

  Usage:
    node src/scripts/uiAudit.js

  Outputs:
    - docs/UI_IMPLEMENTATION_AUDIT.md
    - docs/ui-audit-results.json
*/

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SRC_ROOT = path.join(REPO_ROOT, "src");
const DOCS_DIR = path.join(REPO_ROOT, "docs");

const IGNORED_DIR_NAMES = new Set([
  "node_modules",
  "android",
  "ios",
  "coverage",
  "test",
  "tests",
  "dist",
  "build",
]);

function isIgnoredPath(absolutePath) {
  const normalized = absolutePath.split(path.sep).join("/");
  return (
    normalized.includes("/node_modules/") ||
    normalized.includes("/android/") ||
    normalized.includes("/ios/") ||
    normalized.includes("/coverage/") ||
    normalized.includes("/test/") ||
    normalized.includes("/tests/") ||
    normalized.includes("/dist/") ||
    normalized.includes("/build/")
  );
}

function walkDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIR_NAMES.has(entry.name)) continue;
      if (isIgnoredPath(full)) continue;
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function toWorkspaceRelative(absolutePath) {
  return path.relative(REPO_ROOT, absolutePath).split(path.sep).join("/");
}

function getFeatureFromPath(relPath) {
  // Typical: src/features/<feature>/screens/...
  const parts = relPath.split("/");
  const featuresIndex = parts.indexOf("features");
  if (featuresIndex >= 0 && parts.length > featuresIndex + 1) {
    return parts[featuresIndex + 1];
  }
  if (parts[0] === "src" && parts[1] === "screens") return "app";
  return "other";
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function auditFile(relPath, contents) {
  const touchableRegex = /(TouchableOpacity|Pressable|TouchableWithoutFeedback|TouchableHighlight)\b/g;
  const hasTouchables = touchableRegex.test(contents);

  const hexColors = contents.match(/#[0-9a-fA-F]{3,8}\b/g) || [];

  // Emoji heuristic: wide range; catches most UI emoji usage.
  const emojiMatches = contents.match(/[\u{1F300}-\u{1FAFF}]/gu) || [];

  const hasUseTheme = /\buseTheme\s*\(/.test(contents) || /\bThemeContext\b/.test(contents);
  const importsThemeColors = /shared\/theme|theme\/colors|theme\.colors/.test(contents);

  const usesTypographyComponent =
    /<Typography\b/.test(contents) ||
    /from\s+["'].*shared\/components\/Typography["']/.test(contents) ||
    /from\s+["'].*shared\/components["'][\s\S]*Typography/.test(contents);

  const hasFontFamily = /\bfontFamily\s*:/.test(contents);

  const hasInlineStyleObject = /\bstyle\s*=\s*\{\s*\{/.test(contents);

  const hasKeyIndex = /key\s*=\s*\{\s*index\s*\}/.test(contents);

  const hasAccessibilityLabel = /\baccessibilityLabel\s*=/.test(contents);
  const hasAccessibilityRole = /\baccessibilityRole\s*=/.test(contents);
  const hasTestId = /\btestID\s*=/.test(contents);

  const smallDimMatches = [];
  for (const m of contents.matchAll(/\b(minWidth|minHeight|width|height)\s*:\s*(\d+)\b/g)) {
    const dim = Number(m[2]);
    if (Number.isFinite(dim) && dim > 0 && dim < 44) {
      smallDimMatches.push(`${m[1]}:${dim}`);
    }
  }

  const hasStyleSheetCreate = /StyleSheet\.create\s*\(/.test(contents);

  const usesDesignSystemAtoms =
    /shared\/components\/atoms\//.test(contents) ||
    /shared\/components\/molecules\//.test(contents) ||
    /shared\/components\/organisms\//.test(contents);

  // Score: higher = more likely off-design / low quality.
  // This is a heuristic to help triage, not a truth metric.
  let score = 0;
  const issues = [];

  if (hexColors.length >= 5) {
    score += 3;
    issues.push({
      id: "hardcoded-colors",
      severity: "high",
      detail: `${hexColors.length} hex color literals found` ,
    });
  } else if (hexColors.length > 0) {
    score += 1;
    issues.push({
      id: "hardcoded-colors",
      severity: "medium",
      detail: `${hexColors.length} hex color literals found`,
    });
  }

  if (!hasUseTheme) {
    score += 2;
    issues.push({ id: "missing-theme-hook", severity: "high", detail: "No useTheme() usage detected" });
  } else if (!importsThemeColors) {
    score += 1;
    issues.push({
      id: "weak-theme-usage",
      severity: "medium",
      detail: "useTheme() present but theme token usage is unclear",
    });
  }

  if (!usesTypographyComponent && !hasFontFamily) {
    score += 2;
    issues.push({
      id: "typography-not-tokenized",
      severity: "high",
      detail: "No Typography component or fontFamily usage detected (likely bypassing typography system)",
    });
  } else if (!usesTypographyComponent && hasFontFamily) {
    score += 1;
    issues.push({
      id: "typography-custom-font",
      severity: "medium",
      detail: "fontFamily used without Typography component (risk: inconsistent scale)",
    });
  }

  if (emojiMatches.length > 0) {
    score += 2;
    issues.push({
      id: "emoji-in-ui",
      severity: "high",
      detail: `${uniq(emojiMatches).slice(0, 12).join(" ")}${uniq(emojiMatches).length > 12 ? " …" : ""}`,
    });
  }

  if (hasTouchables && (!hasAccessibilityLabel || !hasAccessibilityRole)) {
    score += 2;
    issues.push({
      id: "accessibility-missing-label-role",
      severity: "high",
      detail: "Interactive elements detected but accessibilityLabel/accessibilityRole appear incomplete",
    });
  }

  if (hasTouchables && !hasTestId) {
    score += 1;
    issues.push({
      id: "test-automation-coverage",
      severity: "low",
      detail: "No testID attributes found (harder to automate UI tests)",
    });
  }

  if (hasInlineStyleObject) {
    score += 1;
    issues.push({ id: "inline-styles", severity: "medium", detail: "Inline style objects detected" });
  }

  if (hasKeyIndex) {
    score += 1;
    issues.push({ id: "index-as-key", severity: "medium", detail: "key={index} detected" });
  }

  const smallDimsUnique = uniq(smallDimMatches);
  if (smallDimsUnique.length > 0) {
    score += 2;
    issues.push({
      id: "touch-target-risk",
      severity: "high",
      detail: `Found <44px dimensions: ${smallDimsUnique.slice(0, 12).join(", ")}${smallDimsUnique.length > 12 ? " …" : ""}`,
    });
  }

  if (hasStyleSheetCreate && hasInlineStyleObject) {
    score += 1;
    issues.push({
      id: "mixed-styling-patterns",
      severity: "low",
      detail: "Both StyleSheet.create and inline styles used (inconsistency risk)",
    });
  }

  if (!usesDesignSystemAtoms) {
    score += 1;
    issues.push({
      id: "design-system-underuse",
      severity: "medium",
      detail: "No shared atoms/molecules/organisms imports detected (likely bespoke UI)",
    });
  }

  return {
    relPath,
    feature: getFeatureFromPath(relPath),
    score,
    signals: {
      touchables: countMatches(contents, touchableRegex),
      hexColorCount: hexColors.length,
      emojiCount: uniq(emojiMatches).length,
      hasUseTheme,
      importsThemeColors,
      usesTypographyComponent,
      hasFontFamily,
      hasInlineStyleObject,
      hasAccessibilityLabel,
      hasAccessibilityRole,
      hasTestId,
      hasKeyIndex,
      hasStyleSheetCreate,
      usesDesignSystemAtoms,
      smallDimensionSamples: smallDimsUnique.slice(0, 20),
    },
    issues,
  };
}

function buildMarkdownReport({ audited, baselineNotes }) {
  const byFeature = new Map();
  const issueCounts = new Map();

  for (const row of audited) {
    byFeature.set(row.feature, (byFeature.get(row.feature) || 0) + 1);
    for (const issue of row.issues) {
      const key = `${issue.id}::${issue.severity}`;
      issueCounts.set(key, (issueCounts.get(key) || 0) + 1);
    }
  }

  const topScreens = [...audited]
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  const featuresSorted = [...byFeature.entries()].sort((a, b) => b[1] - a[1]);
  const issuesSorted = [...issueCounts.entries()].sort((a, b) => b[1] - a[1]);

  const lines = [];
  lines.push("# UI Implementation Audit (Auto-generated)\n");
  lines.push(`Generated: ${new Date().toISOString()}\n`);
  lines.push("This report is generated by `src/scripts/uiAudit.js` and is based on static analysis heuristics (regex + file inventory).\n");
  lines.push("## Baseline run status\n");
  for (const note of baselineNotes) lines.push(`- ${note}`);

  lines.push("\n## Inventory\n");
  lines.push(`- Total audited files: **${audited.length}**`);
  lines.push("- Breakdown by feature:");
  for (const [feature, count] of featuresSorted) {
    lines.push(`  - ${feature}: ${count}`);
  }

  lines.push("\n## Most common gap signals\n");
  lines.push("(Counts represent how many audited files triggered the signal.)\n");
  for (const [key, count] of issuesSorted.slice(0, 20)) {
    const [id, severity] = key.split("::");
    lines.push(`- ${id} (${severity}): ${count}`);
  }

  lines.push("\n## Triage list (highest-risk screens)\n");
  lines.push("Highest `score` screens based on combined heuristics. Use this as a starting point for visual QA and design system refactors.\n");
  for (const s of topScreens) {
    const issueTags = s.issues
      .slice(0, 5)
      .map((i) => `${i.id}:${i.severity}`)
      .join(", ");
    lines.push(`- **${s.score}** — ${s.relPath} (${s.feature}) — ${issueTags}`);
  }

  lines.push("\n## Full per-screen audit\n");
  lines.push("Columns: score | file | key issues | notable signals\n");

  const sortedAll = [...audited].sort((a, b) => b.score - a.score);
  for (const s of sortedAll) {
    const keyIssues = s.issues
      .filter((i) => i.severity === "high")
      .slice(0, 6)
      .map((i) => i.id)
      .join(", ") ||
      s.issues
        .slice(0, 6)
        .map((i) => i.id)
        .join(", ") ||
      "(none)";

    const signals = [];
    if (s.signals.hexColorCount) signals.push(`hex:${s.signals.hexColorCount}`);
    if (s.signals.touchables) signals.push(`touch:${s.signals.touchables}`);
    if (s.signals.emojiCount) signals.push(`emoji:${s.signals.emojiCount}`);
    if (!s.signals.hasUseTheme) signals.push("noTheme");
    if (!s.signals.usesTypographyComponent) signals.push("noTypography");
    if (s.signals.smallDimensionSamples.length) signals.push("<44px");

    lines.push(`- **${s.score}** | ${s.relPath} | ${keyIssues} | ${signals.join(" ")}`);
  }

  lines.push("\n## Notes / limitations\n");
  lines.push("- This audit does **not** perform pixel-perfect comparison against `ui-designs/` images; it flags likely gaps via code patterns.");
  lines.push("- Some findings are false positives/negatives (e.g., accessibilityLabel may be added via wrapper components).");
  lines.push("- Treat `score` as a prioritization heuristic, not a quality grade.");

  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

  const allFiles = walkDir(SRC_ROOT);

  const candidateScreens = allFiles.filter((abs) => {
    if (isIgnoredPath(abs)) return false;
    if (!/\.(ts|tsx)$/.test(abs)) return false;

    const rel = toWorkspaceRelative(abs);

    // Primary screen conventions
    if (/\/screens\//.test(rel) && /\.(ts|tsx)$/.test(rel)) return true;
    if (/Screen\.(ts|tsx)$/.test(rel)) return true;
    if (/Screen[A-Za-z0-9_]*\.(ts|tsx)$/.test(rel)) return true;

    // Fallback: top-level app screens folder
    if (/^src\/screens\//.test(rel) && /\.(ts|tsx)$/.test(rel)) return true;

    return false;
  });

  const audited = [];
  for (const abs of candidateScreens) {
    const relPath = toWorkspaceRelative(abs);
    let contents;
    try {
      contents = fs.readFileSync(abs, "utf8");
    } catch (e) {
      audited.push({
        relPath,
        feature: getFeatureFromPath(relPath),
        score: 999,
        signals: {},
        issues: [{ id: "read-failed", severity: "high", detail: String(e) }],
      });
      continue;
    }

    audited.push(auditFile(relPath, contents));
  }

  const baselineNotes = [
    "Full Jest suite currently fails (missing expo-camera in Jest + failing/missing mocks).",
    "Focused Jest tasks reference non-existent test paths (0 matches).",
  ];

  const jsonOut = path.join(DOCS_DIR, "ui-audit-results.json");
  fs.writeFileSync(jsonOut, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalAudited: audited.length,
    audited,
  }, null, 2));

  const mdOut = path.join(DOCS_DIR, "UI_IMPLEMENTATION_AUDIT.md");
  const md = buildMarkdownReport({ audited, baselineNotes });
  fs.writeFileSync(mdOut, md);

  // eslint-disable-next-line no-console
  console.log(`UI audit complete. Audited: ${audited.length}`);
  // eslint-disable-next-line no-console
  console.log(`Wrote: ${toWorkspaceRelative(jsonOut)}`);
  // eslint-disable-next-line no-console
  console.log(`Wrote: ${toWorkspaceRelative(mdOut)}`);
}

main();
