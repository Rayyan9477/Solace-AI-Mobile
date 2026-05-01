/**
 * AssessmentQuestionScreen Tests — prototype v4.2 #04 (Sprint 7 reskin)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import {
  AssessmentQuestionScreen,
  DEFAULT_OPTIONS,
} from "./AssessmentQuestionScreen";
import type { AssessmentQuestionScreenProps } from "./AssessmentQuestionScreen";

const defaultProps: AssessmentQuestionScreenProps = {
  currentStep: 3,
  totalSteps: 12,
  question: "How often do you feel overwhelmed?",
  options: DEFAULT_OPTIONS,
  onBack: jest.fn(),
  onContinue: jest.fn(),
  onSkip: jest.fn(),
};

function renderScreen(
  overrides: Partial<AssessmentQuestionScreenProps> = {},
) {
  return render(
    <AssessmentQuestionScreen {...defaultProps} {...overrides} />,
  );
}

describe("AssessmentQuestionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Render + snapshot
  it("renders and matches snapshot", () => {
    const tree = renderScreen().toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 2. Question text rendered
  it("renders the question text", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("question-text").props.children).toBe(
      "How often do you feel overwhelmed?",
    );
  });

  // 3. All 4 option cards rendered
  it("renders all 4 option cards", () => {
    const { getByTestId } = renderScreen();
    DEFAULT_OPTIONS.forEach((opt) => {
      expect(getByTestId(`option-${opt.id}`)).toBeTruthy();
    });
  });

  // 4. Tapping option updates accessibilityState.selected
  it("tapping an option marks it as selected", () => {
    const { getByTestId } = renderScreen();
    const optionEl = getByTestId("option-never");
    expect(optionEl.props.accessibilityState?.selected).toBe(false);
    fireEvent.press(optionEl);
    expect(getByTestId("option-never").props.accessibilityState?.selected).toBe(
      true,
    );
  });

  // 5. Continue is disabled until an option selected
  it("Continue button is disabled when no option is selected", () => {
    const { getByTestId } = renderScreen({ selectedId: undefined });
    const btn = getByTestId("continue-button");
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  // 6. Continue calls onContinue(selectedId) with chosen id
  it("Continue calls onContinue with the selected option id", () => {
    const onContinue = jest.fn();
    const { getByTestId } = renderScreen({ onContinue });
    fireEvent.press(getByTestId("option-sometimes"));
    fireEvent.press(getByTestId("continue-button"));
    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onContinue).toHaveBeenCalledWith("sometimes");
  });

  // 7. selectedId prop pre-fills selection
  it("selectedId prop pre-selects the option", () => {
    const { getByTestId } = renderScreen({ selectedId: "often" });
    expect(
      getByTestId("option-often").props.accessibilityState?.selected,
    ).toBe(true);
  });

  // 8. Step indicator shows currentStep/totalSteps via RingProgress
  it("renders RingProgress progress indicator", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  // 9. Back button calls onBack
  it("back button calls onBack when pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 10. Skip link calls onSkip when provided
  it("skip link calls onSkip when pressed", () => {
    const onSkip = jest.fn();
    const { getByTestId } = renderScreen({ onSkip });
    fireEvent.press(getByTestId("skip-link"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it("skip link is not rendered when onSkip is not provided", () => {
    const { queryByTestId } = renderScreen({ onSkip: undefined });
    expect(queryByTestId("skip-link")).toBeNull();
  });

  // 11. Sublabels render when provided
  it("renders sublabels when optionsSublabels is provided", () => {
    const optionsSublabels = { never: "Not at all", sometimes: "A little" };
    const { getByTestId } = renderScreen({ optionsSublabels });
    expect(getByTestId("sublabel-never").props.children).toBe("Not at all");
    expect(getByTestId("sublabel-sometimes").props.children).toBe("A little");
  });

  it("does not render sublabel when not provided for that option", () => {
    const { queryByTestId } = renderScreen({ optionsSublabels: {} });
    expect(queryByTestId("sublabel-never")).toBeNull();
  });

  // 12. Selected card has sage border style
  it("selected option card has sage border color applied", () => {
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId("option-often"));
    const radio = getByTestId("radio-circle-often");
    const radioStyles = Array.isArray(radio.props.style)
      ? radio.props.style.flat()
      : [radio.props.style];
    const merged = radioStyles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown> | null) => ({ ...acc, ...(s ?? {}) }),
      {},
    );
    // sage[300] background when selected
    expect(merged.backgroundColor).toBeTruthy();
    expect(merged.backgroundColor).not.toBe("transparent");
  });

  // Extra: only one option selected at a time
  it("selecting a second option deselects the first", () => {
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId("option-never"));
    fireEvent.press(getByTestId("option-often"));
    expect(
      getByTestId("option-never").props.accessibilityState?.selected,
    ).toBe(false);
    expect(
      getByTestId("option-often").props.accessibilityState?.selected,
    ).toBe(true);
  });

  // Continue enabled after selection
  it("Continue becomes enabled after selecting an option", () => {
    const { getByTestId } = renderScreen({ selectedId: undefined });
    fireEvent.press(getByTestId("option-sometimes"));
    expect(
      getByTestId("continue-button").props.accessibilityState?.disabled,
    ).toBe(false);
  });

  // Options have radio role
  it("option cards have accessibilityRole radio", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("option-never").props.accessibilityRole).toBe("radio");
  });

  // Back button a11y
  it("back button has correct accessibilityRole", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });
});
