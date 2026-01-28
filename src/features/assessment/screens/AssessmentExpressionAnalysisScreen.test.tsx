/**
 * AssessmentExpressionAnalysisScreen Tests
 * @description Tests for expression analysis assessment screen with free text input
 * @task Task 3.4.9: Assessment Expression Analysis Screen (Screen 39)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentExpressionAnalysisScreen } from "./AssessmentExpressionAnalysisScreen";

describe("AssessmentExpressionAnalysisScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnBack = jest.fn();
  const mockOnTextChange = jest.fn();
  const mockOnVoiceInput = jest.fn();

  const defaultProps = {
    currentStep: 14,
    totalSteps: 14,
    onContinue: mockOnContinue,
    onBack: mockOnBack,
    onTextChange: mockOnTextChange,
    onVoiceInput: mockOnVoiceInput,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("assessment-expression-analysis-screen")).toBeTruthy();
  });

  it("displays the progress indicator", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  it("displays the header title", () => {
    const { getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("Assessment")).toBeTruthy();
  });

  it("displays the step counter", () => {
    const { getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("14 of 14")).toBeTruthy();
  });

  it("displays the screen title", () => {
    const { getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("Expression Analysis")).toBeTruthy();
  });

  it("displays the supportive subtitle", () => {
    const { getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(
      getByText(/Freely write down anything that's on your mind/i)
    ).toBeTruthy();
  });

  it("displays the text input area", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("expression-text-input")).toBeTruthy();
  });

  it("displays the character counter", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("character-counter")).toBeTruthy();
  });

  it("shows 0/250 counter initially", () => {
    const { getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("0/250")).toBeTruthy();
  });

  it("updates character count when text is entered", () => {
    const { getByTestId, getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const input = getByTestId("expression-text-input");
    fireEvent.changeText(input, "Hello world");
    expect(getByText("11/250")).toBeTruthy();
  });

  it("limits text to 250 characters", () => {
    const { getByTestId, getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const input = getByTestId("expression-text-input");
    const longText = "a".repeat(300);
    fireEvent.changeText(input, longText);
    expect(getByText("250/250")).toBeTruthy();
  });

  it("calls onTextChange when text is entered", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const input = getByTestId("expression-text-input");
    fireEvent.changeText(input, "Test message");
    expect(mockOnTextChange).toHaveBeenCalledWith("Test message");
  });

  it("displays the voice input button", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("voice-input-button")).toBeTruthy();
  });

  it("displays voice input button text", () => {
    const { getByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("Use voice Instead")).toBeTruthy();
  });

  it("calls onVoiceInput when voice button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("voice-input-button"));
    expect(mockOnVoiceInput).toHaveBeenCalledTimes(1);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinue with text when Continue is pressed", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const input = getByTestId("expression-text-input");
    fireEvent.changeText(input, "My expression");
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith("My expression");
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const container = getByTestId("assessment-expression-analysis-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("text input area has olive green border", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const inputArea = getByTestId("text-input-area");
    const styles = Array.isArray(inputArea.props.style)
      ? inputArea.props.style.flat()
      : [inputArea.props.style];
    const areaStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(areaStyles.borderColor).toBe("#9AAD5C");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("voice input button has proper accessibility", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const voiceButton = getByTestId("voice-input-button");
    expect(voiceButton.props.accessibilityRole).toBe("button");
  });

  it("text input is multiline", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const input = getByTestId("expression-text-input");
    expect(input.props.multiline).toBe(true);
  });

  it("subtitle uses Solace AI branding (not Freud)", () => {
    const { queryByText } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    // Should NOT contain Freud
    expect(queryByText(/freud/i)).toBeNull();
    // Should contain Solace
    expect(queryByText(/solace/i)).toBeTruthy();
  });

  it("allows empty text submission", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith("");
  });

  it("displays placeholder text", () => {
    const { getByTestId } = render(
      <AssessmentExpressionAnalysisScreen {...defaultProps} />
    );
    const input = getByTestId("expression-text-input");
    expect(input.props.placeholder).toBeTruthy();
  });

  it("uses initial text value when provided", () => {
    const { getByTestId, getByText } = render(
      <AssessmentExpressionAnalysisScreen
        {...defaultProps}
        initialText="Initial thoughts"
      />
    );
    const input = getByTestId("expression-text-input");
    expect(input.props.value).toBe("Initial thoughts");
    expect(getByText("16/250")).toBeTruthy();
  });
});
