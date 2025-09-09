/**
 * Navigation Testing Utility
 * Tools for testing and debugging navigation flows
 */

import { Platform } from "react-native";

export const NavigationTester = {
  /**
   * Test if a screen component is valid and can be rendered
   */
  testScreenComponent: (component, screenName) => {
    try {
      if (!component) {
        console.error(`❌ Screen component missing: ${screenName}`);
        return false;
      }

      if (typeof component !== "function" && typeof component !== "object") {
        console.error(
          `❌ Invalid screen component type for ${screenName}: ${typeof component}`,
        );
        return false;
      }

      console.log(`✅ Screen component valid: ${screenName}`);
      return true;
    } catch (error) {
      console.error(`❌ Error testing screen component ${screenName}:`, error);
      return false;
    }
  },

  /**
   * Test all navigation routes for a tab navigator
   */
  testTabRoutes: (routes) => {
    const results = [];

    routes.forEach((route) => {
      const isValid = NavigationTester.testScreenComponent(
        route.component,
        route.name,
      );
      results.push({
        name: route.name,
        isValid,
        component: route.component?.name || "Anonymous",
      });
    });

    console.log("📊 Tab Route Test Results:", results);
    return results;
  },

  /**
   * Test theme-aware screen pairs
   */
  testThemeAwareScreens: (lightScreen, darkScreen, screenName) => {
    const lightValid = NavigationTester.testScreenComponent(
      lightScreen,
      `${screenName} (Light)`,
    );
    const darkValid = NavigationTester.testScreenComponent(
      darkScreen,
      `${screenName} (Dark)`,
    );

    if (!lightValid && !darkValid) {
      console.error(`❌ Both theme variants missing for ${screenName}`);
      return false;
    }

    if (!lightValid) {
      console.warn(
        `⚠️ Light theme missing for ${screenName}, dark theme will be used as fallback`,
      );
    }

    if (!darkValid) {
      console.warn(
        `⚠️ Dark theme missing for ${screenName}, light theme will be used as fallback`,
      );
    }

    return lightValid || darkValid;
  },

  /**
   * Test navigation state structure
   */
  testNavigationState: (authState) => {
    const tests = [
      {
        name: "Auth state exists",
        test: () => authState !== null && authState !== undefined,
        required: true,
      },
      {
        name: "isAuthenticated defined",
        test: () => typeof authState?.isAuthenticated === "boolean",
        required: true,
      },
      {
        name: "onboardingCompleted defined",
        test: () => typeof authState?.onboardingCompleted === "boolean",
        required: true,
      },
      {
        name: "isLoading defined",
        test: () => typeof authState?.isLoading === "boolean",
        required: true,
      },
    ];

    const results = tests.map((test) => ({
      name: test.name,
      passed: test.test(),
      required: test.required,
    }));

    const criticalFailures = results.filter((r) => r.required && !r.passed);

    if (criticalFailures.length > 0) {
      console.error(
        "❌ Critical navigation state test failures:",
        criticalFailures,
      );
      return false;
    }

    const warnings = results.filter((r) => !r.required && !r.passed);
    if (warnings.length > 0) {
      console.warn("⚠️ Navigation state warnings:", warnings);
    }

    console.log("✅ Navigation state tests passed");
    return true;
  },

  /**
   * Test theme context availability
   */
  testThemeContext: (themeContext) => {
    const tests = [
      {
        name: "Theme context exists",
        test: () => themeContext !== null && themeContext !== undefined,
      },
      {
        name: "isDarkMode defined",
        test: () => typeof themeContext?.isDarkMode === "boolean",
      },
      {
        name: "theme object exists",
        test: () =>
          themeContext?.theme && typeof themeContext.theme === "object",
      },
      {
        name: "theme colors exist",
        test: () =>
          themeContext?.theme?.colors &&
          typeof themeContext.theme.colors === "object",
      },
    ];

    const results = tests.map((test) => ({
      name: test.name,
      passed: test.test(),
    }));

    const failures = results.filter((r) => !r.passed);

    if (failures.length > 0) {
      console.error("❌ Theme context test failures:", failures);
      return false;
    }

    console.log("✅ Theme context tests passed");
    return true;
  },

  /**
   * Run comprehensive navigation tests
   */
  runNavigationTests: (authState, themeContext, routes = []) => {
    console.log("🧪 Running comprehensive navigation tests...");

    const results = {
      authState: NavigationTester.testNavigationState(authState),
      themeContext: NavigationTester.testThemeContext(themeContext),
      routes: routes.length > 0 ? NavigationTester.testTabRoutes(routes) : null,
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
    };

    const overallSuccess = results.authState && results.themeContext;

    console.log(
      overallSuccess
        ? "✅ Navigation tests passed"
        : "❌ Navigation tests failed",
    );
    console.log("📊 Test Results:", results);

    return results;
  },
};

export default NavigationTester;
