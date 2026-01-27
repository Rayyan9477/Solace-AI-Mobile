/**
 * AssessmentAgeScreen Tests
 * @description Tests for age selection assessment screen with vertical picker
 * @task Task 3.4.4: Assessment Age Screen (Screen 28)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentAgeScreen } from "./AssessmentAgeScreen";

describe("AssessmentAgeScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    currentStep: 3,
    totalSteps: 14,
    onContinue: mockOnContinue,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByTestId("assessment-age-screen")).toBeTruthy();
  });

  it("displays the progress indicator", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  it("displays the header title", () => {
    const { getByText } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByText("Assessment")).toBeTruthy();
  });

  it("displays the step counter", () => {
    const { getByText } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByText("3 of 14")).toBeTruthy();
  });

  it("displays the question text", () => {
    const { getByText } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByText("What's your age?")).toBeTruthy();
  });

  it("displays the age picker", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByTestId("age-picker")).toBeTruthy();
  });

  it("displays the selected age value", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByTestId("selected-age")).toBeTruthy();
  });

  it("displays default age of 18", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    const selectedAge = getByTestId("selected-age");
    expect(selectedAge.props.children).toBe(18);
  });

  it("displays the selected age pill", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByTestId("selected-age-pill")).toBeTruthy();
  });

  it("selected age pill has green background", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    const pill = getByTestId("selected-age-pill");
    const styles = Array.isArray(pill.props.style)
      ? pill.props.style.flat()
      : [pill.props.style];
    const pillStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(pillStyles.backgroundColor).toBe("#9AAD5C");
  });

  it("displays adjacent age values", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByTestId("age-above-2")).toBeTruthy();
    expect(getByTestId("age-above-1")).toBeTruthy();
    expect(getByTestId("age-below-1")).toBeTruthy();
    expect(getByTestId("age-below-2")).toBeTruthy();
  });

  it("increments age when up button is pressed", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("increment-button"));
    const selectedAge = getByTestId("selected-age");
    expect(selectedAge.props.children).toBe(19);
  });

  it("decrements age when down button is pressed", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("decrement-button"));
    const selectedAge = getByTestId("selected-age");
    expect(selectedAge.props.children).toBe(17);
  });

  it("does not go below minimum age of 13", () => {
    const { getByTestId } = render(
      <AssessmentAgeScreen {...defaultProps} initialAge={13} />
    );
    fireEvent.press(getByTestId("decrement-button"));
    const selectedAge = getByTestId("selected-age");
    expect(selectedAge.props.children).toBe(13);
  });

  it("does not go above maximum age of 100", () => {
    const { getByTestId } = render(
      <AssessmentAgeScreen {...defaultProps} initialAge={100} />
    );
    fireEvent.press(getByTestId("increment-button"));
    const selectedAge = getByTestId("selected-age");
    expect(selectedAge.props.children).toBe(100);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinue with selected age when Continue is pressed", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith(18);
  });

  it("calls onContinue with updated age after increment", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("increment-button"));
    fireEvent.press(getByTestId("increment-button"));
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith(20);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    const container = getByTestId("assessment-age-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("increment/decrement buttons have proper accessibility", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    const incrementButton = getByTestId("increment-button");
    const decrementButton = getByTestId("decrement-button");
    expect(incrementButton.props.accessibilityRole).toBe("button");
    expect(decrementButton.props.accessibilityRole).toBe("button");
  });

  it("selected age text is large and bold", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    const selectedAge = getByTestId("selected-age");
    const styles = Array.isArray(selectedAge.props.style)
      ? selectedAge.props.style.flat()
      : [selectedAge.props.style];
    const textStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(textStyles.fontSize).toBeGreaterThanOrEqual(48);
    expect(textStyles.fontWeight).toBe("700");
  });

  it("adjacent ages have faded opacity", () => {
    const { getByTestId } = render(<AssessmentAgeScreen {...defaultProps} />);
    const ageAbove2 = getByTestId("age-above-2");
    const styles = Array.isArray(ageAbove2.props.style)
      ? ageAbove2.props.style.flat()
      : [ageAbove2.props.style];
    const textStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(textStyles.opacity).toBeLessThan(1);
  });

  it("uses custom initial age", () => {
    const { getByTestId } = render(
      <AssessmentAgeScreen {...defaultProps} initialAge={25} />
    );
    const selectedAge = getByTestId("selected-age");
    expect(selectedAge.props.children).toBe(25);
  });
});
