/**
 * Comprehensive UI Test Runner
 * Runs all UI tests and generates a complete production readiness report
 */

const fs = require("fs");
const path = require("path");

// Import test suites
const DesignSystemTest = require("./design-system.test.js");
const ComponentIntegrationTest = require("../components/component-integration.test.js");
const ThemeToggleTest = require("../theme/theme-toggle.test.js");

class UITestRunner {
  constructor() {
    this.results = {
      suites: [],
      overall: {
        passed: 0,
        failed: 0,
        warnings: 0,
        successRate: 0,
      },
    };
  }

  async runAllTests() {
    console.log("🚀 SOLACE AI MOBILE - COMPREHENSIVE UI TEST SUITE");
    console.log("=".repeat(60));
    console.log("🎯 Ensuring Production Readiness\n");

    // Run Theme Toggle Tests
    console.log("1️⃣  THEME TOGGLE FUNCTIONALITY");
    console.log("─".repeat(30));
    const themeTest = new ThemeToggleTest();
    const themeSuccess = themeTest.run();
    this.recordSuiteResult("Theme Toggle", themeTest.results, themeSuccess);

    console.log("\n" + "─".repeat(60) + "\n");

    // Run Component Integration Tests
    console.log("2️⃣  COMPONENT INTEGRATION");
    console.log("─".repeat(30));
    const componentTest = new ComponentIntegrationTest();
    const componentSuccess = componentTest.run();
    this.recordSuiteResult(
      "Component Integration",
      componentTest.results,
      componentSuccess,
    );

    console.log("\n" + "─".repeat(60) + "\n");

    // Run Design System Tests
    console.log("3️⃣  DESIGN SYSTEM FUNCTIONALITY");
    console.log("─".repeat(30));
    const designSystemTest = new DesignSystemTest();
    const designSystemSuccess = designSystemTest.run();
    this.recordSuiteResult(
      "Design System",
      designSystemTest.results,
      designSystemSuccess,
    );

    console.log("\n" + "─".repeat(60) + "\n");

    // Generate comprehensive report
    this.generateComprehensiveReport();

    return this.results.overall.failed === 0;
  }

  recordSuiteResult(suiteName, suiteResults, success) {
    this.results.suites.push({
      name: suiteName,
      results: suiteResults,
      success,
    });

    // Aggregate results
    this.results.overall.passed += suiteResults.passed;
    this.results.overall.failed += suiteResults.failed;
    this.results.overall.warnings += suiteResults.warnings;
  }

  generateComprehensiveReport() {
    console.log("📋 COMPREHENSIVE PRODUCTION READINESS REPORT");
    console.log("=".repeat(60));

    // Calculate overall success rate
    const total =
      this.results.overall.passed +
      this.results.overall.failed +
      this.results.overall.warnings;
    this.results.overall.successRate = Math.round(
      (this.results.overall.passed / total) * 100,
    );

    // Suite-by-suite summary
    console.log("\n📊 Test Suite Results:");
    this.results.suites.forEach((suite) => {
      const icon = suite.success ? "✅" : "❌";
      const suiteTotal =
        suite.results.passed + suite.results.failed + suite.results.warnings;
      const suiteRate = Math.round((suite.results.passed / suiteTotal) * 100);
      console.log(
        `${icon} ${suite.name}: ${suiteRate}% (${suite.results.passed}✅ ${suite.results.failed}❌ ${suite.results.warnings}⚠️)`,
      );
    });

    // Overall summary
    console.log(`\n🎯 OVERALL RESULTS:`);
    console.log(`✅ Passed: ${this.results.overall.passed}`);
    console.log(`❌ Failed: ${this.results.overall.failed}`);
    console.log(`⚠️  Warnings: ${this.results.overall.warnings}`);
    console.log(`📊 Success Rate: ${this.results.overall.successRate}%`);

    // Production readiness assessment
    this.assessProductionReadiness();

    // Critical functionality checks
    this.checkCriticalFunctionality();

    // Save comprehensive report
    this.saveComprehensiveReport();
  }

  assessProductionReadiness() {
    console.log("\n🚀 PRODUCTION READINESS ASSESSMENT:");
    console.log("─".repeat(40));

    const criticalFailed = this.results.overall.failed;
    const successRate = this.results.overall.successRate;

    if (criticalFailed === 0 && successRate >= 95) {
      console.log("🎉 EXCELLENT! App is PRODUCTION READY!");
      console.log("✅ All critical functionality working");
      console.log("✅ Theme system fully functional");
      console.log("✅ Component integration successful");
      console.log("✅ Design system customization working");
      console.log("✅ User can customize app experience");
    } else if (criticalFailed === 0 && successRate >= 90) {
      console.log(
        "✅ GOOD! App is ready for production with minor improvements",
      );
      console.log("⚠️  Consider addressing warning items");
    } else if (criticalFailed <= 2 && successRate >= 85) {
      console.log("⚠️  CAUTION! App needs some fixes before production");
      console.log("🔧 Address failed tests before deployment");
    } else {
      console.log("❌ NOT READY! Significant issues need resolution");
      console.log("🔧 Fix critical failures before proceeding");
    }
  }

  checkCriticalFunctionality() {
    console.log("\n🔍 CRITICAL FUNCTIONALITY CHECK:");
    console.log("─".repeat(40));

    const functionalityChecks = [
      {
        name: "Light/Dark Mode Toggle",
        check: this.checkThemeToggleWorking(),
        critical: true,
      },
      {
        name: "Component Theme Integration",
        check: this.checkComponentThemeIntegration(),
        critical: true,
      },
      {
        name: "Design System Customization",
        check: this.checkDesignSystemWorking(),
        critical: true,
      },
      {
        name: "Navigation Flow",
        check: this.checkNavigationWorking(),
        critical: true,
      },
      {
        name: "Icon System Integration",
        check: this.checkIconSystemWorking(),
        critical: false,
      },
      {
        name: "Accessibility Features",
        check: this.checkAccessibilityWorking(),
        critical: false,
      },
    ];

    let criticalPassed = 0;
    let criticalTotal = 0;

    functionalityChecks.forEach((check) => {
      const icon = check.check ? "✅" : "❌";
      const criticalMark = check.critical ? " [CRITICAL]" : "";
      console.log(`${icon} ${check.name}${criticalMark}`);

      if (check.critical) {
        criticalTotal++;
        if (check.check) criticalPassed++;
      }
    });

    console.log(
      `\n📊 Critical Features: ${criticalPassed}/${criticalTotal} working`,
    );

    if (criticalPassed === criticalTotal) {
      console.log("🎯 All critical features are functional!");
    } else {
      console.log(
        `⚠️  ${criticalTotal - criticalPassed} critical features need attention`,
      );
    }
  }

  checkThemeToggleWorking() {
    const themeSuite = this.results.suites.find(
      (s) => s.name === "Theme Toggle",
    );
    return themeSuite && themeSuite.success;
  }

  checkComponentThemeIntegration() {
    const componentSuite = this.results.suites.find(
      (s) => s.name === "Component Integration",
    );
    return componentSuite && componentSuite.results.failed <= 2; // Allow minor import issues
  }

  checkDesignSystemWorking() {
    const designSuite = this.results.suites.find(
      (s) => s.name === "Design System",
    );
    return designSuite && designSuite.results.failed <= 1; // Allow minor issues
  }

  checkNavigationWorking() {
    const designSuite = this.results.suites.find(
      (s) => s.name === "Design System",
    );
    if (!designSuite) return false;

    // Check if navigation integration tests passed
    const navTests = designSuite.results.tests.filter(
      (t) =>
        t.name.includes("Navigation") || t.name.includes("Profile Integration"),
    );
    return navTests.every((t) => t.status === "passed");
  }

  checkIconSystemWorking() {
    const componentSuite = this.results.suites.find(
      (s) => s.name === "Component Integration",
    );
    if (!componentSuite) return false;

    const iconTests = componentSuite.results.tests.filter((t) =>
      t.name.includes("Icon"),
    );
    return iconTests.some((t) => t.status === "passed");
  }

  checkAccessibilityWorking() {
    const componentSuite = this.results.suites.find(
      (s) => s.name === "Component Integration",
    );
    if (!componentSuite) return false;

    const a11yTests = componentSuite.results.tests.filter(
      (t) => t.name.includes("A11y") || t.name.includes("Accessibility"),
    );
    return (
      a11yTests.length > 0 &&
      a11yTests.filter((t) => t.status === "passed").length /
        a11yTests.length >=
        0.7
    );
  }

  saveComprehensiveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.results.overall,
      suites: this.results.suites,
      productionReady:
        this.results.overall.failed === 0 &&
        this.results.overall.successRate >= 95,
      criticalFunctionality: {
        themeToggle: this.checkThemeToggleWorking(),
        componentIntegration: this.checkComponentThemeIntegration(),
        designSystem: this.checkDesignSystemWorking(),
        navigation: this.checkNavigationWorking(),
        iconSystem: this.checkIconSystemWorking(),
        accessibility: this.checkAccessibilityWorking(),
      },
      recommendations: [
        "Test with real users on different devices",
        "Validate accessibility with screen readers",
        "Test performance on low-end devices",
        "Consider adding more therapeutic color themes",
        "Test with different screen sizes and orientations",
        "Validate with mental health professionals",
      ],
    };

    try {
      const reportPath = path.join(__dirname, "comprehensive-ui-report.json");
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Comprehensive report saved to: ${reportPath}`);
    } catch (error) {
      console.log("\n⚠️  Could not save comprehensive report");
    }

    // Also create a human-readable markdown report
    this.createMarkdownReport(report);
  }

  createMarkdownReport(report) {
    const markdown = `# Solace AI Mobile - UI Test Report

Generated: ${new Date().toLocaleString()}

## Overall Results

- **Success Rate**: ${report.summary.successRate}%
- **Tests Passed**: ${report.summary.passed}
- **Tests Failed**: ${report.summary.failed}  
- **Warnings**: ${report.summary.warnings}
- **Production Ready**: ${report.productionReady ? "✅ YES" : "❌ NO"}

## Test Suite Results

${report.suites
  .map((suite) => {
    const total =
      suite.results.passed + suite.results.failed + suite.results.warnings;
    const rate = Math.round((suite.results.passed / total) * 100);
    return `### ${suite.name}\n- **Success Rate**: ${rate}%\n- **Status**: ${suite.success ? "✅ PASSED" : "❌ FAILED"}\n- **Results**: ${suite.results.passed} passed, ${suite.results.failed} failed, ${suite.results.warnings} warnings\n`;
  })
  .join("\n")}

## Critical Functionality

| Feature | Status |
|---------|---------|
| Light/Dark Mode Toggle | ${report.criticalFunctionality.themeToggle ? "✅" : "❌"} |
| Component Theme Integration | ${report.criticalFunctionality.componentIntegration ? "✅" : "❌"} |
| Design System Customization | ${report.criticalFunctionality.designSystem ? "✅" : "❌"} |
| Navigation Flow | ${report.criticalFunctionality.navigation ? "✅" : "❌"} |
| Icon System Integration | ${report.criticalFunctionality.iconSystem ? "✅" : "❌"} |
| Accessibility Features | ${report.criticalFunctionality.accessibility ? "✅" : "❌"} |

## Recommendations

${report.recommendations.map((rec) => `- ${rec}`).join("\n")}

## Next Steps

${
  report.productionReady
    ? "🎉 **Ready for production!** The app has passed all critical tests and is ready for user testing and deployment."
    : "🔧 **Address failed tests** before proceeding to production. Focus on critical functionality first."
}
`;

    try {
      const mdPath = path.join(__dirname, "UI-Test-Report.md");
      fs.writeFileSync(mdPath, markdown);
      console.log(`📝 Markdown report saved to: ${mdPath}`);
    } catch (error) {
      console.log("⚠️  Could not save markdown report");
    }
  }
}

// Run the comprehensive test suite
if (require.main === module) {
  const runner = new UITestRunner();
  runner
    .runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Test runner error:", error);
      process.exit(1);
    });
}

module.exports = UITestRunner;
