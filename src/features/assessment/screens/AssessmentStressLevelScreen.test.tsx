/**
 * AssessmentStressLevelScreen Tests
 * @description Tests for stress level assessment screen with 1-5 scale
 * @task Task 3.4.6: Assessment Stress Level Screen (Screen 37)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentStressLevelScreen } from "./AssessmentStressLevelScreen";

describe("AssessmentStressLevelScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    currentStep: 12,
    totalSteps: 14,
    onContinue: mockOnContinue,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("assessment-stress-level-screen")).toBeTruthy();
  });

  it("displays the progress indicator", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  it("displays the header title", () => {
    const { getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByText("Assessment")).toBeTruthy();
  });

  it("displays the step counter", () => {
    const { getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByText("12 of 14")).toBeTruthy();
  });

  it("displays the question text", () => {
    const { getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByText("How would you rate your stress level?")).toBeTruthy();
  });

  it("displays the stress level selector", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("stress-level-selector")).toBeTruthy();
  });

  it("displays all 5 level options", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("stress-level-1")).toBeTruthy();
    expect(getByTestId("stress-level-2")).toBeTruthy();
    expect(getByTestId("stress-level-3")).toBeTruthy();
    expect(getByTestId("stress-level-4")).toBeTruthy();
    expect(getByTestId("stress-level-5")).toBeTruthy();
  });

  it("displays the large stress number", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("large-stress-number")).toBeTruthy();
  });

  it("defaults to stress level 3", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    const largeNumber = getByTestId("large-stress-number");
    expect(largeNumber.props.children).toBe(3);
  });

  it("displays the stress description label", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("stress-description")).toBeTruthy();
  });

  it("displays moderate stress description by default", () => {
    const { getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByText(/Moderately Stressed/i)).toBeTruthy();
  });

  it("updates stress level when option is pressed", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("stress-level-5"));
    const largeNumber = getByTestId("large-stress-number");
    expect(largeNumber.props.children).toBe(5);
  });

  it("updates description when level 1 is selected", () => {
    const { getByTestId, getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("stress-level-1"));
    expect(getByText(/Completely Relaxed/i)).toBeTruthy();
  });

  it("updates description when level 2 is selected", () => {
    const { getByTestId, getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("stress-level-2"));
    expect(getByText(/Slightly Stressed/i)).toBeTruthy();
  });

  it("updates description when level 4 is selected", () => {
    const { getByTestId, getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("stress-level-4"));
    expect(getByText(/Very Stressed/i)).toBeTruthy();
  });

  it("updates description when level 5 is selected", () => {
    const { getByTestId, getByText } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("stress-level-5"));
    expect(getByText(/Extremely Stressed/i)).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinue with selected level when Continue is pressed", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith(3);
  });

  it("calls onContinue with updated level after selection", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("stress-level-5"));
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith(5);
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    const container = getByTestId("assessment-stress-level-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("selected level has orange/highlighted style", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    const level3 = getByTestId("stress-level-3");
    const styles = Array.isArray(level3.props.style)
      ? level3.props.style.flat()
      : [level3.props.style];
    const levelStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(levelStyles.backgroundColor).toBe("#E8853A");
  });

  it("unselected levels have default style", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    const level1 = getByTestId("stress-level-1");
    const styles = Array.isArray(level1.props.style)
      ? level1.props.style.flat()
      : [level1.props.style];
    const levelStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(levelStyles.backgroundColor).not.toBe("#E8853A");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("stress level buttons have proper accessibility", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    const level1 = getByTestId("stress-level-1");
    expect(level1.props.accessibilityRole).toBe("button");
  });

  it("large stress number is prominently sized", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} />
    );
    const largeNumber = getByTestId("large-stress-number");
    const styles = Array.isArray(largeNumber.props.style)
      ? largeNumber.props.style.flat()
      : [largeNumber.props.style];
    const textStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(textStyles.fontSize).toBeGreaterThanOrEqual(64);
    expect(textStyles.fontWeight).toBe("700");
  });

  it("uses custom initial stress level", () => {
    const { getByTestId } = render(
      <AssessmentStressLevelScreen {...defaultProps} initialLevel={5} />
    );
    const largeNumber = getByTestId("large-stress-number");
    expect(largeNumber.props.children).toBe(5);
  });
});
