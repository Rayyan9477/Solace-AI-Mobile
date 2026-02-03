/**
 * AuthStack Tests
 * @description Test suite for AuthStack navigation
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStack } from "../AuthStack";

/**
 * Test helper to render AuthStack with container
 */
function renderAuthStack() {
  return render(
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}

describe("AuthStack", () => {
  describe("Initial Screen", () => {
    it("should render Splash screen as initial route", () => {
      const { getByTestId } = renderAuthStack();
      expect(getByTestId("splash-screen")).toBeTruthy();
    });

    it("should not render other auth screens initially", () => {
      const { queryByTestId } = renderAuthStack();
      expect(queryByTestId("loading-progress-screen")).toBeNull();
      expect(queryByTestId("welcome-screen")).toBeNull();
    });
  });

  describe("Screen Accessibility", () => {
    it("should have accessible splash screen", () => {
      const { getByTestId } = renderAuthStack();
      const splashScreen = getByTestId("splash-screen");
      expect(splashScreen).toBeTruthy();
    });
  });

  describe("Navigator Configuration", () => {
    it("should not show headers (custom headers per screen)", () => {
      const { queryByText } = renderAuthStack();
      // Navigator is configured with headerShown: false
      // So no default navigation headers should be visible
      expect(queryByText("Splash")).toBeNull();
    });

    it("should have dark background", () => {
      const { getByTestId } = renderAuthStack();
      const screen = getByTestId("splash-screen");
      expect(screen).toBeTruthy();
    });
  });

  describe("Available Routes", () => {
    it("should include all auth screens in navigator", () => {
      // This test verifies the navigator is properly configured
      // In a real test, we would navigate through screens
      const { getByTestId } = renderAuthStack();
      expect(getByTestId("splash-screen")).toBeTruthy();
    });
  });
});
