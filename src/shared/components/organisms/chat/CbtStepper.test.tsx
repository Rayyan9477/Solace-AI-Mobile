jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { CbtStepper } from "./CbtStepper";
import type { CbtStep } from "./CbtStepper";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const STEPS: CbtStep[] = [
  { label: "Situation", completed: true },
  { label: "Thought", completed: true },
  { label: "Emotion", completed: false },
  { label: "Evidence", completed: false },
  { label: "Reframe", completed: false },
];

describe("CbtStepper", () => {
  it("renders without crashing", () => {
    expect(() =>
      renderWithTheme(
        <CbtStepper steps={STEPS} currentIndex={2} testID="stepper" />,
      ),
    ).not.toThrow();
  });

  it("renders a stable snapshot at step 0", () => {
    const { toJSON } = renderWithTheme(
      <CbtStepper steps={STEPS} currentIndex={0} testID="stepper" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot at step 2 (middle)", () => {
    const { toJSON } = renderWithTheme(
      <CbtStepper steps={STEPS} currentIndex={2} testID="stepper" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot at last step", () => {
    const allDone: CbtStep[] = STEPS.map((s, i) => ({
      ...s,
      completed: i < 4,
    }));
    const { toJSON } = renderWithTheme(
      <CbtStepper steps={allDone} currentIndex={4} testID="stepper" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("accessibility", () => {
    it("container has accessibilityRole=progressbar", () => {
      const { getByTestId } = renderWithTheme(
        <CbtStepper steps={STEPS} currentIndex={2} testID="stepper" />,
      );
      const node = getByTestId("stepper");
      expect(node.props.accessibilityRole).toBe("progressbar");
    });

    it("accessibilityValue reflects currentIndex", () => {
      const { getByTestId } = renderWithTheme(
        <CbtStepper steps={STEPS} currentIndex={2} testID="stepper" />,
      );
      const node = getByTestId("stepper");
      expect(node.props.accessibilityValue).toEqual({
        now: 3,
        min: 1,
        max: 5,
      });
    });

    it("accessibilityValue.now is 1 when currentIndex=0", () => {
      const { getByTestId } = renderWithTheme(
        <CbtStepper steps={STEPS} currentIndex={0} testID="stepper" />,
      );
      const node = getByTestId("stepper");
      expect(node.props.accessibilityValue.now).toBe(1);
    });
  });

  describe("step rendering", () => {
    it("renders correct number of step containers", () => {
      const { getByTestId } = renderWithTheme(
        <CbtStepper steps={STEPS} currentIndex={2} testID="stepper" />,
      );
      // Each step gets testID stepper-step-0 through stepper-step-4
      // Some steps are hidden from a11y (pending/completed Views) — use includeHiddenElements
      STEPS.forEach((_, i) => {
        expect(getByTestId(`stepper-step-${i}`, { includeHiddenElements: true })).toBeTruthy();
      });
    });

    it("shows current step label", () => {
      const { getAllByText } = renderWithTheme(
        <CbtStepper steps={STEPS} currentIndex={2} testID="stepper" />,
      );
      // current step label is in the tree (may be inside a hidden-from-a11y container)
      expect(
        getAllByText("Emotion", { includeHiddenElements: true }).length,
      ).toBeGreaterThan(0);
    });

    it("does not show non-current step labels", () => {
      const { queryByText } = renderWithTheme(
        <CbtStepper steps={STEPS} currentIndex={2} testID="stepper" />,
      );
      expect(queryByText("Situation")).toBeNull();
      expect(queryByText("Evidence")).toBeNull();
    });
  });

  describe("interactions", () => {
    it("calls onStepPress with correct index when a completed step is tapped", () => {
      const onStepPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <CbtStepper
          steps={STEPS}
          currentIndex={2}
          onStepPress={onStepPress}
          testID="stepper"
        />,
      );
      // Step 0 is completed — should be pressable
      fireEvent.press(getByTestId("stepper-step-0"));
      expect(onStepPress).toHaveBeenCalledWith(0);
    });

    it("calls onStepPress with index 2 when current step is tapped", () => {
      const onStepPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <CbtStepper
          steps={STEPS}
          currentIndex={2}
          onStepPress={onStepPress}
          testID="stepper"
        />,
      );
      fireEvent.press(getByTestId("stepper-step-2"));
      expect(onStepPress).toHaveBeenCalledWith(2);
    });

    it("does NOT call onStepPress when a pending step is pressed (plain View)", () => {
      const onStepPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <CbtStepper
          steps={STEPS}
          currentIndex={2}
          onStepPress={onStepPress}
          testID="stepper"
        />,
      );
      // Step 4 is pending — fireEvent on a View does nothing for onPress
      // but we can assert onStepPress was NOT called if we fire it
      try {
        fireEvent.press(getByTestId("stepper-step-4"));
      } catch {
        // View has no onPress — fireEvent may throw or no-op
      }
      expect(onStepPress).not.toHaveBeenCalledWith(4);
    });
  });
});
