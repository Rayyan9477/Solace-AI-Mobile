// e2e/theme-preview.spec.js
const { test, expect } = require("@playwright/test");

test.describe("Theme Preview UI", () => {
  test("homepage loads and has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Solace AI|Theme Preview/i);
  });

  test("theme toggle button is visible", async ({ page }) => {
    await page.goto("/");
    // Try to find a button or toggle for theme switching
    const toggle = await page
      .locator('button, [role="switch"], [aria-label*="theme" i]')
      .first();
    await expect(toggle).toBeVisible();
  });
});
