/**
 * Playwright Global Teardown
 * Runs once after all test suites
 */
module.exports = async function globalTeardown() {
  console.log("[Global Teardown] Playwright E2E tests finished.");
};
