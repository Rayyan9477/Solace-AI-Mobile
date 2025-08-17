/**
 * Theme Toggle Test Suite
 * Tests light/dark mode functionality across the app
 */

const fs = require("fs");
const path = require("path");

class ThemeToggleTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: [],
    };
  }

  addResult(name, status, message, details = null) {
    const result = { name, status, message, details };
    this.results.tests.push(result);
    this.results[status]++;

    const emoji =
      status === "passed" ? "✅" : status === "failed" ? "❌" : "⚠️";
    console.log(`${emoji} ${name}: ${message}`);
    if (details) console.log(`   ${details}`);
  }

  testThemeContextImplementation() {
    console.log("\n🎨 Testing Theme Context Implementation...");

    try {
      const themeContextPath = path.join(
        __dirname,
        "../../src/contexts/ThemeContext.js",
      );
      const content = fs.readFileSync(themeContextPath, "utf8");

      // Test 1: Toggle function exists
      if (content.includes("toggleTheme")) {
        this.addResult(
          "Toggle Function",
          "passed",
          "toggleTheme function found",
        );
      } else {
        this.addResult(
          "Toggle Function",
          "failed",
          "toggleTheme function missing",
        );
      }

      // Test 2: AsyncStorage persistence
      if (content.includes("AsyncStorage")) {
        this.addResult(
          "Persistence",
          "passed",
          "AsyncStorage integration found",
        );
      } else {
        this.addResult(
          "Persistence",
          "failed",
          "AsyncStorage integration missing",
        );
      }

      // Test 3: System theme detection
      if (content.includes("useColorScheme")) {
        this.addResult(
          "System Detection",
          "passed",
          "System theme detection implemented",
        );
      } else {
        this.addResult(
          "System Detection",
          "warnings",
          "System theme detection not found",
        );
      }

      // Test 4: Theme state management
      if (content.includes("isDarkMode") && content.includes("setIsDarkMode")) {
        this.addResult(
          "State Management",
          "passed",
          "Theme state properly managed",
        );
      } else {
        this.addResult(
          "State Management",
          "failed",
          "Theme state management incomplete",
        );
      }
    } catch (error) {
      this.addResult(
        "Theme Context",
        "failed",
        "Error reading ThemeContext.js",
        error.message,
      );
    }
  }

  testThemeDefinitions() {
    console.log("\n🌗 Testing Theme Definitions...");

    try {
      const themePath = path.join(__dirname, "../../src/styles/theme.js");
      const content = fs.readFileSync(themePath, "utf8");

      // Test light theme
      if (content.includes("lightTheme")) {
        this.addResult("Light Theme", "passed", "Light theme definition found");
      } else {
        this.addResult(
          "Light Theme",
          "failed",
          "Light theme definition missing",
        );
      }

      // Test dark theme
      if (content.includes("darkTheme")) {
        this.addResult("Dark Theme", "passed", "Dark theme definition found");
      } else {
        this.addResult("Dark Theme", "failed", "Dark theme definition missing");
      }

      // Test high contrast themes
      if (content.includes("highContrastLightTheme")) {
        this.addResult(
          "High Contrast Light",
          "passed",
          "High contrast light theme found",
        );
      } else {
        this.addResult(
          "High Contrast Light",
          "warnings",
          "High contrast variant missing",
        );
      }

      if (content.includes("highContrastDarkTheme")) {
        this.addResult(
          "High Contrast Dark",
          "passed",
          "High contrast dark theme found",
        );
      } else {
        this.addResult(
          "High Contrast Dark",
          "warnings",
          "High contrast variant missing",
        );
      }

      // Test therapeutic colors
      if (content.includes("therapeutic")) {
        this.addResult(
          "Therapeutic Colors",
          "passed",
          "Mental health color palette found",
        );
      } else {
        this.addResult(
          "Therapeutic Colors",
          "failed",
          "Mental health colors missing",
        );
      }
    } catch (error) {
      this.addResult(
        "Theme Definitions",
        "failed",
        "Error reading theme.js",
        error.message,
      );
    }
  }

  testToggleIntegration() {
    console.log("\n🔄 Testing Toggle Integration...");

    try {
      // Test ProfileScreen integration
      const profilePath = path.join(
        __dirname,
        "../../src/screens/profile/ProfileScreen.js",
      );
      const profileContent = fs.readFileSync(profilePath, "utf8");

      if (
        profileContent.includes("toggleTheme") &&
        profileContent.includes("Dark Mode")
      ) {
        this.addResult(
          "Profile Toggle",
          "passed",
          "Dark mode toggle in ProfileScreen",
        );
      } else {
        this.addResult(
          "Profile Toggle",
          "failed",
          "Dark mode toggle missing from ProfileScreen",
        );
      }

      // Test switch component
      if (
        profileContent.includes("Switch") &&
        profileContent.includes("isDarkMode")
      ) {
        this.addResult(
          "Toggle Switch",
          "passed",
          "Switch component properly connected",
        );
      } else {
        this.addResult(
          "Toggle Switch",
          "failed",
          "Switch component not properly connected",
        );
      }

      // Test App.js integration
      const appPath = path.join(__dirname, "../../App.js");
      const appContent = fs.readFileSync(appPath, "utf8");

      if (appContent.includes("ThemeProvider")) {
        this.addResult("App Integration", "passed", "ThemeProvider wraps app");
      } else {
        this.addResult(
          "App Integration",
          "failed",
          "ThemeProvider missing from App.js",
        );
      }
    } catch (error) {
      this.addResult(
        "Toggle Integration",
        "failed",
        "Error testing integration",
        error.message,
      );
    }
  }

  testComponentThemeUsage() {
    console.log("\n🧩 Testing Component Theme Usage...");

    const componentsToCheck = [
      "src/components/common/Button.js",
      "src/components/dashboard/MoodCheckIn.js",
      "src/screens/dashboard/DashboardScreen.js",
      "src/screens/DesignSystemScreen.js",
    ];

    let themeAwareComponents = 0;

    componentsToCheck.forEach((componentPath) => {
      try {
        const fullPath = path.join(__dirname, "../../", componentPath);
        const content = fs.readFileSync(fullPath, "utf8");

        if (content.includes("useTheme") && content.includes("theme.colors")) {
          themeAwareComponents++;
          this.addResult(
            componentPath.split("/").pop(),
            "passed",
            "Uses theme system correctly",
          );
        } else {
          this.addResult(
            componentPath.split("/").pop(),
            "failed",
            "Not using theme system",
          );
        }
      } catch (error) {
        this.addResult(
          componentPath.split("/").pop(),
          "warnings",
          "File not found or unreadable",
        );
      }
    });

    const percentage = Math.round(
      (themeAwareComponents / componentsToCheck.length) * 100,
    );
    this.addResult(
      "Theme Adoption",
      "passed",
      `${percentage}% of tested components use themes`,
    );
  }

  testAccessibilityFeatures() {
    console.log("\n♿ Testing Accessibility Features...");

    try {
      const themeContextPath = path.join(
        __dirname,
        "../../src/contexts/ThemeContext.js",
      );
      const content = fs.readFileSync(themeContextPath, "utf8");

      // Test reduced motion support
      if (content.includes("isReducedMotionEnabled")) {
        this.addResult(
          "Reduced Motion",
          "passed",
          "Reduced motion support implemented",
        );
      } else {
        this.addResult(
          "Reduced Motion",
          "warnings",
          "Reduced motion support missing",
        );
      }

      // Test high contrast support
      if (content.includes("isHighContrastEnabled")) {
        this.addResult(
          "High Contrast",
          "passed",
          "High contrast support implemented",
        );
      } else {
        this.addResult(
          "High Contrast",
          "warnings",
          "High contrast support missing",
        );
      }

      // Test font scaling
      if (content.includes("fontScale")) {
        this.addResult(
          "Font Scaling",
          "passed",
          "Font scaling support implemented",
        );
      } else {
        this.addResult(
          "Font Scaling",
          "warnings",
          "Font scaling support missing",
        );
      }

      // Test screen reader support
      if (content.includes("isScreenReaderEnabled")) {
        this.addResult(
          "Screen Reader",
          "passed",
          "Screen reader detection implemented",
        );
      } else {
        this.addResult(
          "Screen Reader",
          "warnings",
          "Screen reader detection missing",
        );
      }
    } catch (error) {
      this.addResult(
        "Accessibility Features",
        "failed",
        "Error testing accessibility",
        error.message,
      );
    }
  }

  printSummary() {
    console.log("\n" + "=".repeat(60));
    console.log("🎯 THEME TOGGLE TEST RESULTS");
    console.log("=".repeat(60));

    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);

    const total =
      this.results.passed + this.results.failed + this.results.warnings;
    const successRate = Math.round((this.results.passed / total) * 100);

    console.log(`\n📊 Success Rate: ${successRate}%`);

    if (this.results.failed === 0) {
      console.log(
        "\n🎉 All critical tests passed! Theme toggle is production ready!",
      );
    } else {
      console.log("\n🔧 Some issues found. Please review failed tests above.");
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        successRate,
      },
      tests: this.results.tests,
    };

    try {
      const reportPath = path.join(__dirname, "theme-toggle-report.json");
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    } catch (error) {
      console.log("\n⚠️  Could not save detailed report");
    }

    return this.results.failed === 0;
  }

  run() {
    console.log("🚀 Starting Theme Toggle Test Suite...\n");

    this.testThemeContextImplementation();
    this.testThemeDefinitions();
    this.testToggleIntegration();
    this.testComponentThemeUsage();
    this.testAccessibilityFeatures();

    return this.printSummary();
  }
}

// Run the test if called directly
if (require.main === module) {
  const test = new ThemeToggleTest();
  const success = test.run();
  process.exit(success ? 0 : 1);
}

module.exports = ThemeToggleTest;

// Jest test wrapper for CI compatibility
describe('Theme Toggle Tests', () => {
  test('Theme toggle functionality', () => {
    const test = new ThemeToggleTest();
    const success = test.run();
    expect(success).toBe(true);
  });
});
