/**
 * OnboardingProgressBar Tests
 * @description Test suite for OnboardingProgressBar component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { OnboardingProgressBar } from "./OnboardingProgressBar";

describe("OnboardingProgressBar", () => {
  describe("Rendering", () => {
    it("should render all segments", () => {
      const { getByTestId } = render(
        <OnboardingProgressBar
          currentStep={1}
          totalSteps={5}
          testID="progress"
        />
      );

      // Check all 5 segments exist
      for (let i = 1; i <= 5; i++) {
        expect(getByTestId(`progress-segment-${i}`)).toBeTruthy();
      }
    });

    it("should highlight current and previous steps", () => {
      const { getByTestId } = render(
        <OnboardingProgressBar
          currentStep={3}
          totalSteps={5}
          activeColor="#C4A574"
          inactiveColor="#4A4A4A"
          testID="progress"
        />
      );

      const segment1 = getByTestId("progress-segment-1");
      const segment2 = getByTestId("progress-segment-2");
      const segment3 = getByTestId("progress-segment-3");
      const segment4 = getByTestId("progress-segment-4");
      const segment5 = getByTestId("progress-segment-5");

      // Steps 1-3 should be active (tan color)
      expect(segment1.props.style).toContainEqual({ backgroundColor: "#C4A574" });
      expect(segment2.props.style).toContainEqual({ backgroundColor: "#C4A574" });
      expect(segment3.props.style).toContainEqual({ backgroundColor: "#C4A574" });

      // Steps 4-5 should be inactive (gray color)
      expect(segment4.props.style).toContainEqual({ backgroundColor: "#4A4A4A" });
      expect(segment5.props.style).toContainEqual({ backgroundColor: "#4A4A4A" });
    });

    it("should show all segments active when on last step", () => {
      const { getByTestId } = render(
        <OnboardingProgressBar
          currentStep={5}
          totalSteps={5}
          activeColor="#C4A574"
          testID="progress"
        />
      );

      for (let i = 1; i <= 5; i++) {
        const segment = getByTestId(`progress-segment-${i}`);
        expect(segment.props.style).toContainEqual({ backgroundColor: "#C4A574" });
      }
    });

    it("should use default colors when not provided", () => {
      const { getByTestId } = render(
        <OnboardingProgressBar
          currentStep={1}
          totalSteps={5}
          testID="progress"
        />
      );

      const activeSegment = getByTestId("progress-segment-1");
      const inactiveSegment = getByTestId("progress-segment-2");

      expect(activeSegment.props.style).toContainEqual({ backgroundColor: "#C4A574" });
      expect(inactiveSegment.props.style).toContainEqual({ backgroundColor: "#4A4A4A" });
    });
  });

  describe("Accessibility", () => {
    it("should have progressbar role", () => {
      const { getByA11yRole } = render(
        <OnboardingProgressBar currentStep={2} totalSteps={5} />
      );
      expect(getByA11yRole("progressbar")).toBeTruthy();
    });

    it("should have proper accessibility label", () => {
      const { getByLabelText } = render(
        <OnboardingProgressBar currentStep={3} totalSteps={5} />
      );
      expect(getByLabelText("Step 3 of 5")).toBeTruthy();
    });

    it("should have correct accessibility value", () => {
      const { getByA11yRole } = render(
        <OnboardingProgressBar currentStep={4} totalSteps={5} />
      );

      const progressbar = getByA11yRole("progressbar");
      expect(progressbar.props.accessibilityValue).toEqual({
        min: 1,
        max: 5,
        now: 4,
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle single segment", () => {
      const { getByTestId } = render(
        <OnboardingProgressBar
          currentStep={1}
          totalSteps={1}
          testID="progress"
        />
      );

      expect(getByTestId("progress-segment-1")).toBeTruthy();
    });

    it("should handle many segments", () => {
      const { getByTestId } = render(
        <OnboardingProgressBar
          currentStep={5}
          totalSteps={10}
          testID="progress"
        />
      );

      // Check first, middle, and last
      expect(getByTestId("progress-segment-1")).toBeTruthy();
      expect(getByTestId("progress-segment-5")).toBeTruthy();
      expect(getByTestId("progress-segment-10")).toBeTruthy();
    });
  });
});
