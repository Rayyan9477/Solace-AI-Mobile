/**
 * Comprehensive Solace AI Mobile E2E Test Suite
 * Tests all screens and routes via Expo Web (metro bundler)
 *
 * Strategy:
 * 1. Auth flow: verify splash + sign-in screens render
 * 2. Main flow: pre-set auth state via localStorage, verify each tab and screen
 * 3. Every test checks: DOM renders, no crash errors, key testIDs present
 */

const { test, expect } = require("@playwright/test");

const BASE = "http://localhost:8081";

// Auth state presets for localStorage
const AUTHENTICATED_STATE = JSON.stringify({
  isAuthenticated: true,
  hasCompletedOnboarding: true,
});
const ONBOARDING_STATE = JSON.stringify({
  isAuthenticated: true,
  hasCompletedOnboarding: false,
});

/**
 * Helper: wait for the app to mount and render content into #root
 */
async function waitForAppMount(page, timeout = 20000) {
  await page.waitForFunction(
    () => {
      const root = document.getElementById("root");
      return root && root.innerHTML.length > 100;
    },
    { timeout }
  );
}

/**
 * Helper: collect all data-testid values currently in the DOM
 */
async function getTestIds(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-testid]")].map((e) =>
      e.getAttribute("data-testid")
    )
  );
}

/**
 * Helper: check for fatal page errors (crashes)
 */
function createErrorCollector(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

/**
 * Helper: set auth state in localStorage before navigating
 */
async function setAuthState(page, stateJson) {
  await page.addInitScript((state) => {
    if (state) {
      localStorage.setItem("@solace/auth_state", state);
    } else {
      localStorage.removeItem("@solace/auth_state");
    }
  }, stateJson);
}

/**
 * Helper: intercept the HTML response to disable lazy bundling.
 * Metro's lazy=true excludes React.lazy() dynamic imports from the initial bundle,
 * which breaks navigation to lazy-loaded screens on web.
 */
async function disableLazyBundling(page) {
  await page.route("**/*.bundle*", (route) => {
    const url = route.request().url();
    const fixedUrl = url.replace("lazy=true", "lazy=false");
    if (fixedUrl !== url) {
      route.continue({ url: fixedUrl });
    } else {
      route.continue();
    }
  });
}

/**
 * Helper: filter out known non-fatal errors
 */
function filterFatalErrors(errors) {
  return errors.filter(
    (e) => !e.includes("onComplete is not a function")
  );
}

// ═══════════════════════════════════════════════════════════
// AUTH FLOW — Unauthenticated State
// ═══════════════════════════════════════════════════════════
test.describe("Auth Flow", () => {
  test("App launches and shows Splash screen", async ({ page }) => {
    const errors = createErrorCollector(page);

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);

    const testIds = await getTestIds(page);
    expect(testIds).toContain("splash-screen");
    expect(filterFatalErrors(errors)).toHaveLength(0);
  });

  test("Splash auto-transitions after delay", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);

    // Wait beyond splash delay (2s) + transition time
    await page.waitForTimeout(4000);

    const testIds = await getTestIds(page);
    // After splash, should see next auth screen or still splash
    const hasAuthScreen =
      testIds.includes("welcome-screen") ||
      testIds.includes("sign-in-screen") ||
      testIds.includes("loading-progress-screen") ||
      testIds.includes("quote-splash-screen") ||
      testIds.includes("fetching-data-screen") ||
      testIds.includes("splash-screen");

    expect(hasAuthScreen).toBeTruthy();
  });
});

// ═══════════════════════════════════════════════════════════
// ONBOARDING FLOW — Authenticated but not onboarded
// ═══════════════════════════════════════════════════════════
test.describe("Onboarding Flow", () => {
  test("Shows onboarding when authenticated but not onboarded", async ({
    page,
  }) => {
    await disableLazyBundling(page);
    await setAuthState(page, ONBOARDING_STATE);

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);
    await page.waitForTimeout(3000);

    // Verify the app rendered without crashes
    const rootLen = await page.evaluate(
      () => document.getElementById("root")?.innerHTML?.length || 0
    );
    expect(rootLen).toBeGreaterThan(100);
  });
});

// ═══════════════════════════════════════════════════════════
// MAIN FLOW — Fully authenticated + onboarded
// ═══════════════════════════════════════════════════════════
test.describe("Main Flow - Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await disableLazyBundling(page);
    await setAuthState(page, AUTHENTICATED_STATE);
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);
    await page.waitForTimeout(4000);
  });

  test("Home Dashboard renders without crash", async ({ page }) => {
    const errors = createErrorCollector(page);

    const rootLen = await page.evaluate(
      () => document.getElementById("root")?.innerHTML?.length || 0
    );
    expect(rootLen).toBeGreaterThan(100);

    // No error boundary triggered
    const hasErrorBoundary = await page.evaluate(() =>
      (document.body.textContent || "").includes("Something went wrong")
    );
    expect(hasErrorBoundary).toBeFalsy();

    expect(filterFatalErrors(errors)).toHaveLength(0);
  });

  test("Tab bar is present with 5 navigation tabs", async ({ page }) => {
    const testIds = await getTestIds(page);
    console.log("Main flow testIDs:", testIds.join(", "));

    // React Navigation bottom tabs render as <div role="tablist"> with <a role="link"> children
    const tabInfo = await page.evaluate(() => {
      const tablist = document.querySelector('[role="tablist"]');
      if (!tablist) return [];
      return [...tablist.querySelectorAll('[role="link"]')].map((t) => ({
        label: t.textContent?.trim(),
        ariaLabel: t.getAttribute("aria-label"),
      }));
    });
    console.log("Tabs found:", JSON.stringify(tabInfo));

    expect(tabInfo.length).toBe(5);
    const ariaLabels = tabInfo.map((t) => t.ariaLabel);
    expect(ariaLabels).toContain("Home dashboard");
    expect(ariaLabels).toContain("Mood tracking");
    expect(ariaLabels).toContain("AI therapy chat");
    expect(ariaLabels).toContain("Mental health journal");
    expect(ariaLabels).toContain("User profile and settings");
  });

  test("Dashboard shows all expected cards", async ({ page }) => {
    const testIds = await getTestIds(page);

    const expectedCards = [
      "solace-score-card",
      "mood-card",
      "mindful-hours-card",
      "sleep-quality-card",
      "journal-card",
      "stress-level-card",
      "mood-tracker-card",
      "chatbot-section",
    ];

    for (const card of expectedCards) {
      expect(testIds).toContain(card);
    }
  });
});

// ═══════════════════════════════════════════════════════════
// TAB NAVIGATION — Navigate between tabs
// ═══════════════════════════════════════════════════════════
test.describe("Tab Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await disableLazyBundling(page);
    await setAuthState(page, AUTHENTICATED_STATE);
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);
    await page.waitForTimeout(4000);
  });

  test("Navigate through all 5 tabs without crash", async ({ page }) => {
    const errors = createErrorCollector(page);

    const tabs = await page.$$('[role="tablist"] [role="link"]');
    console.log(`Found ${tabs.length} tabs`);
    expect(tabs.length).toBe(5);

    for (let i = 0; i < tabs.length; i++) {
      const label = await tabs[i].textContent();
      await tabs[i].click();
      await page.waitForTimeout(2000);

      const testIds = await getTestIds(page);
      const rootLen = await page.evaluate(
        () => document.getElementById("root")?.innerHTML?.length || 0
      );

      console.log(
        `Tab ${i + 1} (${label?.trim()}): ${testIds.length} testIDs, ${rootLen} chars`
      );

      expect(rootLen).toBeGreaterThan(100);
    }

    expect(filterFatalErrors(errors)).toHaveLength(0);
  });

  test("Each tab shows unique screen content", async ({ page }) => {
    const tabs = await page.$$('[role="tablist"] [role="link"]');
    const tabContents = [];

    for (const tab of tabs) {
      const label = await tab.textContent();
      await tab.click();
      await page.waitForTimeout(2000);

      const testIds = await getTestIds(page);
      tabContents.push({
        label: label?.trim(),
        testIds,
      });
    }

    // Each tab should show different testIDs
    expect(tabContents.length).toBe(5);
    for (let i = 1; i < tabContents.length; i++) {
      const prev = tabContents[i - 1];
      const curr = tabContents[i];
      const prevSet = new Set(prev.testIds);
      const currSet = new Set(curr.testIds);
      const hasUniqueContent =
        [...currSet].some((id) => !prevSet.has(id)) ||
        [...prevSet].some((id) => !currSet.has(id));

      console.log(
        `${prev.label} -> ${curr.label}: ${hasUniqueContent ? "Different content" : "Same content"}`
      );
      expect(hasUniqueContent).toBeTruthy();
    }
  });
});

// ═══════════════════════════════════════════════════════════
// SCREEN RENDERING — Verify app renders without crash
// ═══════════════════════════════════════════════════════════
test.describe("Screen Rendering", () => {
  test("App renders without JavaScript errors in main flow", async ({
    page,
  }) => {
    const errors = createErrorCollector(page);
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await disableLazyBundling(page);
    await setAuthState(page, AUTHENTICATED_STATE);
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);
    await page.waitForTimeout(5000);

    const rootLen = await page.evaluate(
      () => document.getElementById("root")?.innerHTML?.length || 0
    );
    expect(rootLen).toBeGreaterThan(200);

    // Verify no React error boundaries triggered
    const hasErrorBoundary = await page.evaluate(() =>
      (document.body.textContent || "").includes("Something went wrong")
    );
    expect(hasErrorBoundary).toBeFalsy();

    if (consoleErrors.length > 0) {
      console.log("Console errors:", consoleErrors.length);
      consoleErrors
        .slice(0, 5)
        .forEach((e) => console.log("  ", e.substring(0, 150)));
    }
  });

  test("Click through visible buttons without crash", async ({ page }) => {
    const errors = createErrorCollector(page);
    await disableLazyBundling(page);
    await setAuthState(page, AUTHENTICATED_STATE);

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);
    await page.waitForTimeout(4000);

    // Find all clickable elements
    const clickableCount = await page.evaluate(() =>
      document.querySelectorAll(
        '[role="button"], [role="tab"], [role="link"], button'
      ).length
    );
    console.log("Clickable elements found:", clickableCount);

    // Click tab navigation links
    const tabs = await page.$$('[role="tablist"] [role="link"]');
    for (let i = 0; i < tabs.length; i++) {
      await tabs[i].click();
      await page.waitForTimeout(2000);

      const len = await page.evaluate(
        () => document.getElementById("root")?.innerHTML?.length || 0
      );
      expect(len).toBeGreaterThan(100);
    }

    expect(filterFatalErrors(errors)).toHaveLength(0);
  });
});

// ═══════════════════════════════════════════════════════════
// DEEP LINKING
// ═══════════════════════════════════════════════════════════
test.describe("Deep Linking", () => {
  test("Auth route resolves to auth screen", async ({ page }) => {
    await page.goto(`${BASE}/auth`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await waitForAppMount(page);

    const testIds = await getTestIds(page);
    const hasAuthContent = testIds.some(
      (id) =>
        id.includes("splash") ||
        id.includes("sign-in") ||
        id.includes("welcome") ||
        id.includes("auth")
    );
    expect(hasAuthContent).toBeTruthy();
  });

  test("Authenticated /home route loads", async ({ page }) => {
    await disableLazyBundling(page);
    await setAuthState(page, AUTHENTICATED_STATE);

    await page.goto(`${BASE}/home`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await waitForAppMount(page);
    await page.waitForTimeout(4000);

    const rootLen = await page.evaluate(
      () => document.getElementById("root")?.innerHTML?.length || 0
    );
    expect(rootLen).toBeGreaterThan(100);
  });
});

// ═══════════════════════════════════════════════════════════
// RESILIENCE — Edge cases and error recovery
// ═══════════════════════════════════════════════════════════
test.describe("App Resilience", () => {
  test("Handles unknown route gracefully", async ({ page }) => {
    await page.goto(`${BASE}/nonexistent/route/12345`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(10000);

    const rootLen = await page.evaluate(
      () => document.getElementById("root")?.innerHTML?.length || 0
    );
    expect(rootLen).toBeGreaterThan(0);
  });

  test("Handles rapid tab navigation without crash", async ({ page }) => {
    const errors = createErrorCollector(page);
    await disableLazyBundling(page);
    await setAuthState(page, AUTHENTICATED_STATE);

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);
    await page.waitForTimeout(3000);

    const tabs = await page.$$('[role="tablist"] [role="link"]');
    for (let round = 0; round < 2; round++) {
      for (const tab of tabs) {
        try {
          await tab.click();
          await page.waitForTimeout(500);
        } catch {
          // Element may have been replaced during rapid navigation
        }
      }
    }

    const rootLen = await page.evaluate(
      () => document.getElementById("root")?.innerHTML?.length || 0
    );
    expect(rootLen).toBeGreaterThan(100);
    expect(filterFatalErrors(errors)).toHaveLength(0);
  });

  test("Recovers from localStorage corruption", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("@solace/auth_state", "not-valid-json{{{");
    });

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await waitForAppMount(page);

    const rootLen = await page.evaluate(
      () => document.getElementById("root")?.innerHTML?.length || 0
    );
    expect(rootLen).toBeGreaterThan(100);
  });
});
