/**
 * RootNavigator Tests
 * @description Test suite for RootNavigator component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "../RootNavigator";

/**
 * Test helper to render navigator with container
 */
function renderNavigator(props: { isAuthenticated: boolean; hasCompletedOnboarding: boolean }) {
  return render(
    <NavigationContainer>
      <RootNavigator {...props} />
    </NavigationContainer>
  );
}

describe("RootNavigator", () => {
  describe("Authentication State", () => {
    it("should render AuthFlow when user is not authenticated", () => {
      const { getByTestId } = renderNavigator({
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      });

      // Splash screen should be visible (initial screen of AuthFlow)
      expect(getByTestId("splash-screen")).toBeTruthy();
    });

    it("should render OnboardingFlow when user is authenticated but not onboarded", () => {
      const { getByTestId } = renderNavigator({
        isAuthenticated: true,
        hasCompletedOnboarding: false,
      });

      // Assessment intro screen should be visible (initial screen of OnboardingFlow)
      expect(getByTestId("assessment-intro-screen")).toBeTruthy();
    });

    it("should render MainFlow when user is authenticated and onboarded", () => {
      const { getByTestId } = renderNavigator({
        isAuthenticated: true,
        hasCompletedOnboarding: true,
      });

      // Main app should be visible (tab navigator)
      // Check for bottom navigation
      expect(() => getByTestId("splash-screen")).toThrow();
      expect(() => getByTestId("assessment-intro-screen")).toThrow();
    });
  });

  describe("Navigation State Transitions", () => {
    it("should not show onboarding to authenticated users who completed it", () => {
      const { queryByTestId } = renderNavigator({
        isAuthenticated: true,
        hasCompletedOnboarding: true,
      });

      expect(queryByTestId("assessment-intro-screen")).toBeNull();
    });

    it("should not show auth screens to authenticated users", () => {
      const { queryByTestId } = renderNavigator({
        isAuthenticated: true,
        hasCompletedOnboarding: false,
      });

      expect(queryByTestId("splash-screen")).toBeNull();
    });
  });

  describe("Initial Route Determination", () => {
    it("should start at AuthFlow for unauthenticated users", () => {
      const { getByTestId } = renderNavigator({
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      });

      expect(getByTestId("splash-screen")).toBeTruthy();
    });

    it("should start at OnboardingFlow for authenticated but not onboarded users", () => {
      const { getByTestId } = renderNavigator({
        isAuthenticated: true,
        hasCompletedOnboarding: false,
      });

      expect(getByTestId("assessment-intro-screen")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should be accessible for screen readers", () => {
      const { getByTestId } = renderNavigator({
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      });

      const splashScreen = getByTestId("splash-screen");
      expect(splashScreen.props.accessibilityRole).toBeDefined();
    });
  });
});
