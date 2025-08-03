/**
 * Component Integration Test Suite
 * Tests that all components work together without broken imports or references
 */

const fs = require("fs");
const path = require("path");

class ComponentIntegrationTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: [],
    };
    this.componentPaths = [];
    this.screenPaths = [];
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

  discoverComponents() {
    console.log("\n🔍 Discovering Components and Screens...");

    const srcPath = path.join(__dirname, "../../src");

    // Discover components
    const componentsPath = path.join(srcPath, "components");
    this.walkDirectory(componentsPath, (filePath) => {
      if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
        this.componentPaths.push(filePath);
      }
    });

    // Discover screens
    const screensPath = path.join(srcPath, "screens");
    this.walkDirectory(screensPath, (filePath) => {
      if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
        this.screenPaths.push(filePath);
      }
    });

    console.log(`   Found ${this.componentPaths.length} components`);
    console.log(`   Found ${this.screenPaths.length} screens`);
  }

  walkDirectory(dir, callback) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.walkDirectory(filePath, callback);
      } else {
        callback(filePath);
      }
    });
  }

  testImports() {
    console.log("\n📦 Testing Import Statements...");

    const allFiles = [...this.componentPaths, ...this.screenPaths];
    let validImports = 0;
    let totalImports = 0;

    allFiles.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const imports = this.extractImports(content);
        const fileName = path.basename(filePath);

        imports.forEach((importStatement) => {
          totalImports++;
          const isValid = this.validateImport(importStatement, filePath);
          if (isValid) {
            validImports++;
          } else {
            this.addResult(
              `Import in ${fileName}`,
              "failed",
              `Invalid import: ${importStatement}`,
            );
          }
        });
      } catch (error) {
        this.addResult(
          path.basename(filePath),
          "failed",
          "Error reading file",
          error.message,
        );
      }
    });

    const importSuccessRate = Math.round((validImports / totalImports) * 100);
    if (importSuccessRate >= 95) {
      this.addResult(
        "Import Validation",
        "passed",
        `${importSuccessRate}% of imports are valid`,
      );
    } else {
      this.addResult(
        "Import Validation",
        "failed",
        `Only ${importSuccessRate}% of imports are valid`,
      );
    }
  }

  extractImports(content) {
    const imports = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("import ") && trimmed.includes("from ")) {
        imports.push(trimmed);
      }
    }

    return imports;
  }

  validateImport(importStatement, filePath) {
    // Extract the import path
    const match = importStatement.match(/from\s+['"](.*)['"]/);
    if (!match) return false;

    const importPath = match[1];

    // Skip validation for node_modules imports
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      return true;
    }

    // Resolve relative path
    const fileDir = path.dirname(filePath);
    const resolvedPath = path.resolve(fileDir, importPath);

    // Try different extensions
    const extensions = ["", ".js", ".jsx", "/index.js"];
    for (const ext of extensions) {
      const testPath = resolvedPath + ext;
      if (fs.existsSync(testPath)) {
        return true;
      }
    }

    return false;
  }

  testComponentExports() {
    console.log("\n📤 Testing Component Exports...");

    this.componentPaths.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const fileName = path.basename(filePath, ".js");

        // Check for default export
        if (content.includes("export default")) {
          this.addResult(`${fileName} Export`, "passed", "Has default export");
        } else {
          this.addResult(
            `${fileName} Export`,
            "warnings",
            "No default export found",
          );
        }
      } catch (error) {
        this.addResult(
          path.basename(filePath),
          "failed",
          "Error reading file",
          error.message,
        );
      }
    });
  }

  testThemeIntegration() {
    console.log("\n🎨 Testing Theme Integration...");

    const allFiles = [...this.componentPaths, ...this.screenPaths];
    let themeAwareFiles = 0;

    allFiles.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const fileName = path.basename(filePath);

        if (content.includes("useTheme") || content.includes("ThemeProvider")) {
          themeAwareFiles++;

          // Check if properly using theme
          if (content.includes("theme.colors")) {
            this.addResult(
              `${fileName} Theme`,
              "passed",
              "Properly uses theme colors",
            );
          } else {
            this.addResult(
              `${fileName} Theme`,
              "warnings",
              "Imports theme but may not use colors",
            );
          }
        }
      } catch (error) {
        this.addResult(
          path.basename(filePath),
          "failed",
          "Error checking theme integration",
        );
      }
    });

    const themePercentage = Math.round(
      (themeAwareFiles / allFiles.length) * 100,
    );
    this.addResult(
      "Theme Coverage",
      "passed",
      `${themePercentage}% of files use theme system`,
    );
  }

  testIconIntegration() {
    console.log("\n🎯 Testing Icon System Integration...");

    const allFiles = [...this.componentPaths, ...this.screenPaths];
    let iconAwareFiles = 0;

    allFiles.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const fileName = path.basename(filePath);

        if (
          content.includes("MentalHealthIcon") ||
          content.includes("ActionIcon") ||
          content.includes("NavigationIcon")
        ) {
          iconAwareFiles++;
          this.addResult(
            `${fileName} Icons`,
            "passed",
            "Uses modern icon system",
          );
        } else if (
          content.includes("MaterialIcons") ||
          content.includes("Ionicons")
        ) {
          this.addResult(
            `${fileName} Icons`,
            "warnings",
            "Uses legacy icon system",
          );
        }
      } catch (error) {
        this.addResult(
          path.basename(filePath),
          "failed",
          "Error checking icon integration",
        );
      }
    });

    if (iconAwareFiles > 0) {
      this.addResult(
        "Icon System",
        "passed",
        `${iconAwareFiles} files use modern icon system`,
      );
    } else {
      this.addResult(
        "Icon System",
        "warnings",
        "No files using modern icon system",
      );
    }
  }

  testAccessibilityCompliance() {
    console.log("\n♿ Testing Accessibility Compliance...");

    const allFiles = [...this.componentPaths, ...this.screenPaths];
    let accessibleFiles = 0;

    allFiles.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const fileName = path.basename(filePath);

        let accessibilityScore = 0;
        const maxScore = 4;

        // Check for accessibility props
        if (content.includes("accessibilityLabel")) accessibilityScore++;
        if (content.includes("accessibilityRole")) accessibilityScore++;
        if (content.includes("accessibilityHint")) accessibilityScore++;
        if (content.includes("accessible={true}")) accessibilityScore++;

        if (accessibilityScore >= 2) {
          accessibleFiles++;
          this.addResult(
            `${fileName} A11y`,
            "passed",
            `Good accessibility support (${accessibilityScore}/${maxScore})`,
          );
        } else if (accessibilityScore > 0) {
          this.addResult(
            `${fileName} A11y`,
            "warnings",
            `Basic accessibility support (${accessibilityScore}/${maxScore})`,
          );
        }
      } catch (error) {
        this.addResult(
          path.basename(filePath),
          "failed",
          "Error checking accessibility",
        );
      }
    });

    const a11yPercentage = Math.round(
      (accessibleFiles / allFiles.length) * 100,
    );
    if (a11yPercentage >= 70) {
      this.addResult(
        "Accessibility Coverage",
        "passed",
        `${a11yPercentage}% of files have good accessibility`,
      );
    } else {
      this.addResult(
        "Accessibility Coverage",
        "warnings",
        `Only ${a11yPercentage}% of files have good accessibility`,
      );
    }
  }

  testDesignSystemIntegration() {
    console.log("\n🎨 Testing Design System Integration...");

    try {
      // Test main design system files
      const designSystemFiles = [
        "src/design-system/DesignTokens.js",
        "src/design-system/DesignSystemContext.js",
        "src/design-system/ColorCustomizer.js",
        "src/design-system/ComponentCustomizer.js",
        "src/screens/DesignSystemScreen.js",
      ];

      designSystemFiles.forEach((file) => {
        const filePath = path.join(__dirname, "../../", file);
        if (fs.existsSync(filePath)) {
          this.addResult(
            path.basename(file),
            "passed",
            "Design system file exists",
          );
        } else {
          this.addResult(
            path.basename(file),
            "failed",
            "Design system file missing",
          );
        }
      });

      // Test integration in App.js
      const appPath = path.join(__dirname, "../../App.js");
      const appContent = fs.readFileSync(appPath, "utf8");

      if (appContent.includes("DesignSystemProvider")) {
        this.addResult(
          "App Integration",
          "passed",
          "DesignSystemProvider integrated in App.js",
        );
      } else {
        this.addResult(
          "App Integration",
          "failed",
          "DesignSystemProvider not integrated in App.js",
        );
      }
    } catch (error) {
      this.addResult(
        "Design System",
        "failed",
        "Error testing design system integration",
      );
    }
  }

  printSummary() {
    console.log("\n" + "=".repeat(60));
    console.log("🧩 COMPONENT INTEGRATION TEST RESULTS");
    console.log("=".repeat(60));

    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);

    const total =
      this.results.passed + this.results.failed + this.results.warnings;
    const successRate = Math.round((this.results.passed / total) * 100);

    console.log(`\n📊 Success Rate: ${successRate}%`);
    console.log(`📁 Components Tested: ${this.componentPaths.length}`);
    console.log(`📱 Screens Tested: ${this.screenPaths.length}`);

    if (this.results.failed === 0) {
      console.log("\n🎉 All critical integration tests passed!");
      console.log("🚀 Components are production ready!");
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
        componentsCount: this.componentPaths.length,
        screensCount: this.screenPaths.length,
      },
      tests: this.results.tests,
    };

    try {
      const reportPath = path.join(
        __dirname,
        "component-integration-report.json",
      );
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    } catch (error) {
      console.log("\n⚠️  Could not save detailed report");
    }

    return this.results.failed === 0;
  }

  run() {
    console.log("🚀 Starting Component Integration Test Suite...\n");

    this.discoverComponents();
    this.testImports();
    this.testComponentExports();
    this.testThemeIntegration();
    this.testIconIntegration();
    this.testAccessibilityCompliance();
    this.testDesignSystemIntegration();

    return this.printSummary();
  }
}

// Run the test if called directly
if (require.main === module) {
  const test = new ComponentIntegrationTest();
  const success = test.run();
  process.exit(success ? 0 : 1);
}

module.exports = ComponentIntegrationTest;
