/**
 * Playwright Global Setup
 * Runs once before all test suites.
 *
 * Metro pre-warm: the Expo dev server is single-threaded and bundles serially.
 * The first navigation in the suite triggers a 30-60s rebundle which then
 * cascades into per-test navigationTimeout failures (audit ref:
 * docs/superpowers/plans/mobile-verification.md § 6).
 *
 * We hit `localhost:8081/` once here with a generous timeout so the bundle is
 * already in Metro's in-memory cache when the first spec.test() opens its page.
 * This adds a one-time ~30-60s startup cost but eliminates the 10/15 timeout
 * cascade observed in the previous run.
 */

const SERVER_URL = process.env.SOLACE_BASE_URL || "http://localhost:8081";
const PREWARM_TIMEOUT_MS = 180_000; // 3 min — Metro's worst-case cold start
const HEALTHCHECK_INTERVAL_MS = 2_000;

/**
 * Wait until Metro responds with a 200 on /, or until timeout.
 * Returns true on success, false on timeout (we don't fail setup — let the
 * actual specs surface a clearer error if the server is genuinely down).
 */
async function waitForMetroReady() {
  // Use built-in fetch (Node >= 18) — Playwright requires Node 18+, so this is safe.
  const deadline = Date.now() + PREWARM_TIMEOUT_MS;
  let lastErr = null;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(SERVER_URL, {
        method: "GET",
        // Disable any auto-redirect handling; we only care that *some* response came back
        redirect: "manual",
      });
      if (res.status >= 200 && res.status < 500) {
        return true;
      }
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, HEALTHCHECK_INTERVAL_MS));
  }

  console.warn(
    `[Global Setup] Metro not ready after ${PREWARM_TIMEOUT_MS}ms. Last error: ${
      lastErr ? lastErr.message : "unknown"
    }. Specs will likely fail — check that 'npm run start' is running on ${SERVER_URL}.`
  );
  return false;
}

/**
 * Force Metro to compile the main bundle by requesting it directly.
 * The HTML response from `/` references `/index.bundle?platform=web&...`,
 * so hitting that URL is what actually triggers the rebundle. We don't
 * need to parse — fetching is enough to populate the cache.
 */
async function prewarmMainBundle() {
  // Mirror what Expo Web requests on first load. Adjust query params if Metro
  // changes its default scheme; the path itself is stable across Expo SDK 49-54.
  const bundleUrl = `${SERVER_URL}/index.bundle?platform=web&dev=true&hot=false&lazy=false`;
  const start = Date.now();
  try {
    const res = await fetch(bundleUrl, { method: "GET" });
    // Drain the body so the connection actually completes (otherwise Metro
    // may abort halfway through and leave the cache half-populated).
    await res.arrayBuffer();
    const elapsed = Date.now() - start;
    console.log(
      `[Global Setup] Pre-warmed main bundle in ${elapsed}ms (status ${res.status})`
    );
  } catch (err) {
    console.warn(
      `[Global Setup] Bundle pre-warm failed: ${err && err.message ? err.message : err}. ` +
        `Tests will still run but may hit per-test rebundle timeouts.`
    );
  }
}

module.exports = async function globalSetup() {
  console.log("[Global Setup] Playwright E2E tests starting...");
  console.log(`[Global Setup] Waiting for Metro at ${SERVER_URL} ...`);

  const ready = await waitForMetroReady();
  if (ready) {
    console.log("[Global Setup] Metro is up — pre-warming main bundle ...");
    await prewarmMainBundle();
    console.log("[Global Setup] Pre-warm complete. Starting test suite.");
  }
};
