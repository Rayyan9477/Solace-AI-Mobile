/**
 * Global setup for Playwright tests
 * Prepares the environment for comprehensive Solace AI testing
 */

const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

async function globalSetup() {
  console.log("🚀 Setting up Solace AI Mobile App testing environment...");

  // Ensure test results directory exists
  const testResultsDir = path.join(__dirname, "../test-results");
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }

  // Create artifacts directory
  const artifactsDir = path.join(testResultsDir, "artifacts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  // Create screenshots directory
  const screenshotsDir = path.join(testResultsDir, "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Log environment info
  console.log("📱 Test Environment:");
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Platform: ${process.platform}`);
  console.log(`   Architecture: ${process.arch}`);
  console.log(
    `   Base URL: ${process.env.SOLACE_BASE_URL || "http://localhost:8081"}`,
  );

  // Wait a moment for any server to stabilize
  console.log("⏳ Waiting for test environment to stabilize...");
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("✅ Test environment setup complete!");

  return {
    baseURL: process.env.SOLACE_BASE_URL || "http://localhost:8081",
    timestamp: new Date().toISOString(),
  };
}

module.exports = globalSetup;
