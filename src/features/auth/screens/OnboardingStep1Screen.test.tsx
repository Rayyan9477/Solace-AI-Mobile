/**
 * OnboardingStep1Screen Tests
 * @description Test suite for OnboardingStep1Screen component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingStep1Screen } from "./OnboardingStep1Screen";
import type { AuthStackParamList } from "../../../shared/types/navigation";

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Test wrapper with navigation
function renderWithNavigation() {
  const navigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  return {
    ...render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="OnboardingStep1">
            {(props) => (
              <OnboardingStep1Screen
                {...props}
                navigation={navigation as any}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    ),
    navigation,
  };
}

describe("OnboardingStep1Screen", () => {
  describe("Content", () => {
    it("should render step 1 content", () => {
      const { getByText } = renderWithNavigation();

      // Title
      expect(getByText(/Personalize Your Mental/)).toBeTruthy();
      expect(getByText(/Health State/)).toBeTruthy();
      expect(getByText(/With AI/)).toBeTruthy();
    });

    it("should render Step One badge", () => {
      const { getByText } = renderWithNavigation();

      expect(getByText("Step One")).toBeTruthy();
    });

    it("should show step 1 of 5 progress", () => {
      const { getByLabelText } = renderWithNavigation();

      expect(getByLabelText("Step 1 of 5")).toBeTruthy();
    });

    it("should have olive green background", () => {
      const { getByTestId } = renderWithNavigation();

      const illustrationSection = getByTestId(
        "onboarding-step1-screen-illustration-section"
      );
      expect(illustrationSection.props.style).toContainEqual({
        backgroundColor: "#6B7B3A",
      });
    });
  });

  describe("Navigation", () => {
    it("should not show back button on first step", () => {
      const { queryByLabelText } = renderWithNavigation();

      expect(queryByLabelText("Previous step")).toBeNull();
    });

    it("should show next button", () => {
      const { getByLabelText } = renderWithNavigation();

      expect(getByLabelText("Next step")).toBeTruthy();
    });

    it("should navigate to step 2 when next button pressed", () => {
      const { getByLabelText, navigation } = renderWithNavigation();

      const nextButton = getByLabelText("Next step");
      fireEvent.press(nextButton);

      expect(navigation.navigate).toHaveBeenCalledWith("OnboardingStep2");
    });
  });

  describe("Accessibility", () => {
    it("should have proper screen label", () => {
      const { getByLabelText } = renderWithNavigation();

      expect(getByLabelText("Onboarding step 1 of 5")).toBeTruthy();
    });

    it("should have accessible title with highlighted words", () => {
      const { getByLabelText } = renderWithNavigation();

      expect(
        getByLabelText("Personalize Your Mental Health State With AI")
      ).toBeTruthy();
    });

    it("should have accessible progress bar", () => {
      const { getByA11yRole } = renderWithNavigation();

      const progressBar = getByA11yRole("progressbar");
      expect(progressBar.props.accessibilityValue).toEqual({
        min: 1,
        max: 5,
        now: 1,
      });
    });
  });

  describe("TestID", () => {
    it("should render with screen testID", () => {
      const { getByTestId } = renderWithNavigation();

      expect(getByTestId("onboarding-step1-screen")).toBeTruthy();
    });
  });

  describe("Illustration", () => {
    it("should render placeholder illustration", () => {
      const { getByTestId } = renderWithNavigation();

      expect(getByTestId("onboarding-step1-screen-illustration")).toBeTruthy();
    });

    it("should show placeholder with correct step number", () => {
      const { getByText } = renderWithNavigation();

      expect(getByText("Step 1")).toBeTruthy();
    });
  });

  describe("Theme", () => {
    it("should highlight correct keywords", () => {
      const { getByText } = renderWithNavigation();

      // "Health State" should be highlighted
      expect(getByText(/Health/)).toBeTruthy();
      expect(getByText(/State/)).toBeTruthy();
    });

    it("should use step 1 theme color", () => {
      const { getByTestId } = renderWithNavigation();

      const section = getByTestId("onboarding-step1-screen-illustration-section");
      expect(section.props.style).toContainEqual({
        backgroundColor: "#6B7B3A", // Olive green
      });
    });
  });
});
