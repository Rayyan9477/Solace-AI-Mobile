/**
 * StepBadge Tests
 * @description Test suite for StepBadge component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { StepBadge } from "./StepBadge";

describe("StepBadge", () => {
  describe("Rendering", () => {
    it("should render with step number", () => {
      const { getByText } = render(<StepBadge stepNumber={1} />);
      expect(getByText("Step One")).toBeTruthy();
    });

    it("should render custom label when provided", () => {
      const { getByText } = render(
        <StepBadge stepNumber={1} label="Custom Step" />
      );
      expect(getByText("Custom Step")).toBeTruthy();
    });

    it("should auto-generate labels for steps 1-5", () => {
      const labels = ["Step One", "Step Two", "Step Three", "Step Four", "Step Five"];

      labels.forEach((label, index) => {
        const { getByText } = render(<StepBadge stepNumber={index + 1} />);
        expect(getByText(label)).toBeTruthy();
      });
    });

    it("should handle steps beyond 5", () => {
      const { getByText } = render(<StepBadge stepNumber={6} />);
      expect(getByText("Step 6")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have text role", () => {
      const { getByA11yRole } = render(<StepBadge stepNumber={1} />);
      expect(getByA11yRole("text")).toBeTruthy();
    });

    it("should have proper accessibility label", () => {
      const { getByLabelText } = render(<StepBadge stepNumber={3} />);
      expect(getByLabelText("Step Three of 5")).toBeTruthy();
    });
  });

  describe("TestID", () => {
    it("should render with custom testID", () => {
      const { getByTestId } = render(
        <StepBadge stepNumber={1} testID="custom-badge" />
      );
      expect(getByTestId("custom-badge")).toBeTruthy();
    });
  });
});
