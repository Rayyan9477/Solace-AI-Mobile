/*
  Generates consolidated documentation from:
  - docs/ui-audit-results.json (from src/scripts/uiAudit.js)
  - test-results/jest-output.txt (captured Jest output)

  Outputs:
  - docs/JEST_FAILURES.md
  - docs/IMPLEMENTATION_STATUS_REPORT.md

  Usage:
    node src/scripts/generateStatusReport.js
*/

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DOCS_DIR = path.join(REPO_ROOT, "docs");

const UI_AUDIT_JSON = path.join(DOCS_DIR, "ui-audit-results.json");
const UI_AUDIT_MD = path.join(DOCS_DIR, "UI_IMPLEMENTATION_AUDIT.md");

const JEST_OUTPUT_TXT = path.join(REPO_ROOT, "test-results", "jest-output.txt");

function toWorkspaceRelative(absolutePath) {
  return path.relative(REPO_ROOT, absolutePath).split(path.sep).join("/");
}

function stripAnsi(text) {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\u001b\[[0-9;]*m/g, "");
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function parseUiAudit() {
  if (!fs.existsSync(UI_AUDIT_JSON)) {
    return {
      ok: false,
      error: `Missing ${toWorkspaceRelative(UI_AUDIT_JSON)}. Run node src/scripts/uiAudit.js first.`,
    };
  }

  const raw = fs.readFileSync(UI_AUDIT_JSON, "utf8");
  const parsed = JSON.parse(raw);
  const audited = parsed.audited || [];

  const byFeature = new Map();
  const issueCounts = new Map();

  for (const row of audited) {
    byFeature.set(row.feature, (byFeature.get(row.feature) || 0) + 1);
    for (const issue of row.issues || []) {
      const key = `${issue.id}::${issue.severity}`;
      issueCounts.set(key, (issueCounts.get(key) || 0) + 1);
    }
  }

  const topScreens = [...audited].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 25);
  const featuresSorted = [...byFeature.entries()].sort((a, b) => b[1] - a[1]);
  const issuesSorted = [...issueCounts.entries()].sort((a, b) => b[1] - a[1]);

  return {
    ok: true,
    generatedAt: parsed.generatedAt,
    totalAudited: parsed.totalAudited || audited.length,
    audited,
    featuresSorted,
    issuesSorted,
    topScreens,
  };
}

function parseJestOutput() {
  if (!fs.existsSync(JEST_OUTPUT_TXT)) {
    return {
      ok: false,
      error: `Missing ${toWorkspaceRelative(JEST_OUTPUT_TXT)}. Capture it with: npm test -- --silent --runInBand 2>&1 | Tee-Object -FilePath test-results\\jest-output.txt`,
    };
  }

  const raw = stripAnsi(fs.readFileSync(JEST_OUTPUT_TXT, "utf8"));
  const lines = raw.split(/\r?\n/);

  // Suite header variants:
  // - FAIL test/foo.test.js
  // - node.exe : FAIL test/foo.test.js (22.9 s)
  const suiteHeader = /^(?:node\.exe\s*:\s*)?(FAIL|PASS)\s+(.+?)(?:\s+\(|$)/;
  const testCaseHeader = /^\s*(?:●|ΓùÅ)\s+(.+?)\s*$/;

  const suites = new Map();
  let currentSuite = null;

  const fatalErrors = [];

  for (const line of lines) {
    const suiteMatch = line.match(suiteHeader);
    if (suiteMatch) {
      const status = suiteMatch[1];
      const name = suiteMatch[2].trim();
      currentSuite = name;
      if (!suites.has(name)) {
        suites.set(name, {
          name,
          status,
          testCases: [],
          rawSnippets: [],
        });
      } else {
        // Keep first status if it was FAIL, otherwise update.
        const existing = suites.get(name);
        if (existing.status !== "FAIL") existing.status = status;
      }
      continue;
    }

    const testMatch = line.match(testCaseHeader);
    if (testMatch && currentSuite) {
      const testName = testMatch[1].trim();
      suites.get(currentSuite).testCases.push(testName);
      continue;
    }

    // Capture fatal crash markers which prevent summary.
    if (/^Error:\s+/.test(line) || /Jest worker encountered/.test(line) || /Command exited with code/.test(line)) {
      fatalErrors.push(line.trim());
    }

    // Save a small snippet around failures for context (bounded).
    if (currentSuite && suites.get(currentSuite)?.status === "FAIL") {
      const suite = suites.get(currentSuite);
      if (suite.rawSnippets.length < 40 && line.trim()) suite.rawSnippets.push(line);
    }
  }

  const allSuites = [...suites.values()];
  const failedSuites = allSuites.filter((s) => s.status === "FAIL");
  const passedSuites = allSuites.filter((s) => s.status === "PASS");

  // Extract failing test cases from FAIL suites only.
  const failingCases = failedSuites.flatMap((s) => s.testCases.map((t) => ({ suite: s.name, test: t })));

  // Category buckets (helps explain "why so many")
  const categories = {
    themeProviderMissing: 0,
    jestEsmTransform: 0,
    moduleNotFound: 0,
    assertionMismatch: 0,
    unhandledErrorCrash: 0,
    other: 0,
  };

  for (const s of failedSuites) {
    const blob = s.rawSnippets.join("\n");
    if (/useTheme must be used within ThemeProvider/.test(blob)) categories.themeProviderMissing += 1;
    if (/Unexpected token 'export'|immer\.legacy-esm\.js/.test(blob)) categories.jestEsmTransform += 1;
    if (/Cannot find module|Unable to find module/.test(blob)) categories.moduleNotFound += 1;
    if (/expect\(/.test(blob)) categories.assertionMismatch += 1;
    if (/Error:\s+Network error/.test(blob) || /Node\.js v/.test(blob)) categories.unhandledErrorCrash += 1;
  }

  // If we saw fatal errors but no suite-level marker, still flag.
  if (fatalErrors.some((l) => /Error:\s+Network error/.test(l))) {
    categories.unhandledErrorCrash = Math.max(categories.unhandledErrorCrash, 1);
  }

  const categorizedSum = Object.values(categories).reduce((a, b) => a + b, 0);
  if (categorizedSum === 0 && failedSuites.length > 0) categories.other = failedSuites.length;

  return {
    ok: true,
    suiteCount: allSuites.length,
    failedSuites,
    passedSuites,
    failingCases,
    fatalErrors: uniq(fatalErrors).slice(0, 30),
    categories,
  };
}

function writeJestFailuresMd(jest) {
  const outPath = path.join(DOCS_DIR, "JEST_FAILURES.md");

  const lines = [];
  lines.push("# Jest Failures (Captured Output)\n");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Source: ${toWorkspaceRelative(JEST_OUTPUT_TXT)}\n`);

  if (!jest.ok) {
    lines.push("## Status\n");
    lines.push(`- ${jest.error}`);
    fs.writeFileSync(outPath, lines.join("\n"));
    return outPath;
  }

  lines.push("## Summary\n");
  lines.push(`- Suites observed (PASS/FAIL lines): **${jest.suiteCount}**`);
  lines.push(`- Failed suites: **${jest.failedSuites.length}**`);
  lines.push(`- Passed suites: **${jest.passedSuites.length}**`);
  lines.push(`- Failing test cases extracted (heuristic): **${jest.failingCases.length}**\n`);

  lines.push("## Failure categories (why things are failing)\n");
  for (const [k, v] of Object.entries(jest.categories)) {
    lines.push(`- ${k}: ${v}`);
  }

  if (jest.fatalErrors.length) {
    lines.push("\n## Fatal / run-aborting errors\n");
    for (const e of jest.fatalErrors) lines.push(`- ${e}`);
  }

  lines.push("\n## Failed suites and failing test cases\n");
  for (const suite of jest.failedSuites) {
    lines.push(`### ${suite.name}`);

    const tests = uniq(suite.testCases);
    if (tests.length) {
      for (const t of tests) lines.push(`- ${t}`);
    } else {
      lines.push("- (No individual test case markers found; likely suite-level crash or transform error)");
    }

    // Provide a short error excerpt for quick scanning.
    const excerpt = suite.rawSnippets
      .filter((l) => l.trim())
      .slice(0, 18)
      .join("\n");

    if (excerpt) {
      lines.push("\nExcerpt:");
      lines.push("```text");
      lines.push(excerpt);
      lines.push("```\n");
    }
  }

  fs.writeFileSync(outPath, lines.join("\n"));
  return outPath;
}

function writeImplementationStatusReport(ui, jest) {
  const outPath = path.join(DOCS_DIR, "IMPLEMENTATION_STATUS_REPORT.md");

  const lines = [];
  lines.push("# Implementation Status Report (UI + Tests)\n");
  lines.push(`Generated: ${new Date().toISOString()}\n`);

  lines.push("## Artifacts\n");
  lines.push(`- UI audit (human): ${toWorkspaceRelative(UI_AUDIT_MD)}`);
  lines.push(`- UI audit (data): ${toWorkspaceRelative(UI_AUDIT_JSON)}`);
  lines.push(`- Jest raw output: ${toWorkspaceRelative(JEST_OUTPUT_TXT)}`);
  lines.push(`- Jest failures (human): docs/JEST_FAILURES.md\n`);

  lines.push("## UI audit summary\n");
  if (!ui.ok) {
    lines.push(`- ${ui.error}`);
  } else {
    lines.push(`- Audited files: **${ui.totalAudited}**`);
    lines.push(`- Audit generated at: ${ui.generatedAt}`);

    lines.push("\nTop recurring gap signals (id + severity):");
    for (const [key, count] of ui.issuesSorted.slice(0, 20)) {
      const [id, severity] = key.split("::");
      lines.push(`- ${id} (${severity}): ${count}`);
    }

    lines.push("\nHighest-risk screens (top 25 by heuristic score):");
    for (const s of ui.topScreens) {
      const issues = (s.issues || []).slice(0, 5).map((i) => `${i.id}:${i.severity}`).join(", ");
      lines.push(`- ${s.score} — ${s.relPath} (${s.feature}) — ${issues}`);
    }

    lines.push("\nFeature inventory:");
    for (const [feature, count] of ui.featuresSorted) {
      lines.push(`- ${feature}: ${count}`);
    }
  }

  lines.push("\n## Test status (Jest)\n");
  if (!jest.ok) {
    lines.push(`- ${jest.error}`);
  } else {
    lines.push(`- Failed suites: **${jest.failedSuites.length}**`);
    lines.push(`- Passed suites: **${jest.passedSuites.length}**`);
    lines.push("\nTop failure causes observed:");
    const sortedCats = Object.entries(jest.categories).sort((a, b) => b[1] - a[1]);
    for (const [k, v] of sortedCats) {
      if (v > 0) lines.push(`- ${k}: ${v}`);
    }

    lines.push("\nSee full list in docs/JEST_FAILURES.md.");
  }

  fs.writeFileSync(outPath, lines.join("\n"));
  return outPath;
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

  const ui = parseUiAudit();
  const jest = parseJestOutput();

  const jestMd = writeJestFailuresMd(jest);
  const statusMd = writeImplementationStatusReport(ui, jest);

  // eslint-disable-next-line no-console
  console.log("Generated:");
  // eslint-disable-next-line no-console
  console.log(`- ${toWorkspaceRelative(jestMd)}`);
  // eslint-disable-next-line no-console
  console.log(`- ${toWorkspaceRelative(statusMd)}`);
}

main();
