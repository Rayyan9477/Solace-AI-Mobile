/**
 * AssessmentGenderScreen Tests
 * @description Tests for gender selection assessment screen
 * @task Task 3.4.3: Assessment Gender Screen (Screen 27)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentGenderScreen } from "./AssessmentGenderScreen";

describe("AssessmentGenderScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnSkip = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    currentStep: 2,
    totalSteps: 14,
    onContinue: mockOnContinue,
    onSkip: mockOnSkip,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("assessment-gender-screen")).toBeTruthy();
  });

  it("displays the progress indicator", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  it("displays the header title", () => {
    const { getByText } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByText("Assessment")).toBeTruthy();
  });

  it("displays the step counter", () => {
    const { getByText } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByText("2 of 14")).toBeTruthy();
  });

  it("displays the question text", () => {
    const { getByText } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByText("What's your official gender?")).toBeTruthy();
  });

  it("displays the male gender card", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("gender-card-male")).toBeTruthy();
  });

  it("displays the female gender card", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("gender-card-female")).toBeTruthy();
  });

  it("displays I am Male label", () => {
    const { getByText } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByText("I am Male")).toBeTruthy();
  });

  it("displays I am Female label", () => {
    const { getByText } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByText("I am Female")).toBeTruthy();
  });

  it("displays male gender symbol", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("male-symbol")).toBeTruthy();
  });

  it("displays female gender symbol", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("female-symbol")).toBeTruthy();
  });

  it("displays the skip button", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("skip-button")).toBeTruthy();
  });

  it("displays skip button text", () => {
    const { getByText } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByText("Prefer to skip, thanks")).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("selects male card when pressed", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    fireEvent.press(getByTestId("gender-card-male"));
    const card = getByTestId("gender-card-male");
    expect(card.props.accessibilityState?.selected).toBe(true);
  });

  it("selects female card when pressed", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    fireEvent.press(getByTestId("gender-card-female"));
    const card = getByTestId("gender-card-female");
    expect(card.props.accessibilityState?.selected).toBe(true);
  });

  it("only one gender can be selected at a time", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    fireEvent.press(getByTestId("gender-card-male"));
    fireEvent.press(getByTestId("gender-card-female"));
    expect(getByTestId("gender-card-male").props.accessibilityState?.selected).toBe(false);
    expect(getByTestId("gender-card-female").props.accessibilityState?.selected).toBe(true);
  });

  it("calls onContinue with selected gender when Continue is pressed", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    fireEvent.press(getByTestId("gender-card-male"));
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith("male");
  });

  it("calls onSkip when skip button is pressed", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    fireEvent.press(getByTestId("skip-button"));
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it("Continue button works even without selection (allows skip)", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith(null);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    const container = getByTestId("assessment-gender-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("gender cards have proper accessibility role", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    const maleCard = getByTestId("gender-card-male");
    expect(maleCard.props.accessibilityRole).toBe("radio");
  });

  it("skip button has proper accessibility", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    const button = getByTestId("skip-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("skip button has green background", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    const button = getByTestId("skip-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.backgroundColor).toBe("#9AAD5C");
  });

  it("displays illustration in gender cards", () => {
    const { getByTestId } = render(<AssessmentGenderScreen {...defaultProps} />);
    expect(getByTestId("male-illustration")).toBeTruthy();
    expect(getByTestId("female-illustration")).toBeTruthy();
  });
});
