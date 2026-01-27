/**
 * AssessmentQuestionScreen Tests
 * @description Tests for reusable assessment question screen with single-select options
 * @task Task 3.4.2: Assessment Question Screen (Screens 26-35)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentQuestionScreen } from "./AssessmentQuestionScreen";

const mockOptions = [
  { id: "option1", icon: "❤️", label: "I wanna reduce stress" },
  { id: "option2", icon: "💬", label: "I wanna try AI Therapy" },
  { id: "option3", icon: "🚩", label: "I want to cope with trauma" },
  { id: "option4", icon: "😊", label: "I want to be a better person" },
];

describe("AssessmentQuestionScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    currentStep: 1,
    totalSteps: 14,
    question: "What's your health goal for today?",
    options: mockOptions,
    onContinue: mockOnContinue,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByTestId("assessment-question-screen")).toBeTruthy();
  });

  it("displays the progress indicator", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  it("displays the header title", () => {
    const { getByText } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByText("Assessment")).toBeTruthy();
  });

  it("displays the step counter", () => {
    const { getByText } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByText("1 of 14")).toBeTruthy();
  });

  it("displays custom step counter", () => {
    const { getByText } = render(
      <AssessmentQuestionScreen {...defaultProps} currentStep={5} totalSteps={14} />
    );
    expect(getByText("5 of 14")).toBeTruthy();
  });

  it("displays the question text", () => {
    const { getByText } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByText("What's your health goal for today?")).toBeTruthy();
  });

  it("displays all options", () => {
    const { getByText } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByText("I wanna reduce stress")).toBeTruthy();
    expect(getByText("I wanna try AI Therapy")).toBeTruthy();
    expect(getByText("I want to cope with trauma")).toBeTruthy();
    expect(getByText("I want to be a better person")).toBeTruthy();
  });

  it("displays option icons", () => {
    const { getByText } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByText("❤️")).toBeTruthy();
    expect(getByText("💬")).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("Continue button is disabled when no option selected", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it("selects option when pressed", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("option-option1"));
    const option = getByTestId("option-option1");
    expect(option.props.accessibilityState?.selected).toBe(true);
  });

  it("only one option can be selected at a time", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("option-option1"));
    fireEvent.press(getByTestId("option-option2"));
    expect(getByTestId("option-option1").props.accessibilityState?.selected).toBe(false);
    expect(getByTestId("option-option2").props.accessibilityState?.selected).toBe(true);
  });

  it("Continue button is enabled when option is selected", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("option-option1"));
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityState?.disabled).toBe(false);
  });

  it("calls onContinue with selected option when Continue is pressed", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("option-option2"));
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith("option2");
  });

  it("does not call onContinue when no option selected", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).not.toHaveBeenCalled();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    const container = getByTestId("assessment-question-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("selected option has green background", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("option-option1"));
    const option = getByTestId("option-option1");
    const styles = Array.isArray(option.props.style)
      ? option.props.style.flat()
      : [option.props.style];
    const optionStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(optionStyles.backgroundColor).toBe("#9AAD5C");
  });

  it("options have proper accessibility role", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    const option = getByTestId("option-option1");
    expect(option.props.accessibilityRole).toBe("radio");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("options have minimum touch target size", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    const option = getByTestId("option-option1");
    const styles = Array.isArray(option.props.style)
      ? option.props.style.flat()
      : [option.props.style];
    const optionStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(optionStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("displays radio button indicator", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    expect(getByTestId("radio-option1")).toBeTruthy();
  });

  it("radio button shows checked state when selected", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("option-option1"));
    const radio = getByTestId("radio-option1");
    const styles = Array.isArray(radio.props.style)
      ? radio.props.style.flat()
      : [radio.props.style];
    const radioStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(radioStyles.backgroundColor).toBe("#FFFFFF");
  });

  it("calls onBack when back pressed (optional)", () => {
    const { getByTestId } = render(
      <AssessmentQuestionScreen {...defaultProps} />
    );
    // Back button might be in header
    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
