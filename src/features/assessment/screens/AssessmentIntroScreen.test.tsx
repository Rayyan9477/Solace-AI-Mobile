/**
 * AssessmentIntroScreen Tests
 * @description Tests for assessment intro/welcome screen
 * @task Task 3.4.1: Assessment Intro Screen (Screen 36)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentIntroScreen } from "./AssessmentIntroScreen";

describe("AssessmentIntroScreen", () => {
  const mockOnStart = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    onStart: mockOnStart,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("assessment-intro-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the illustration", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("assessment-illustration")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText("Mental Health Assessment")).toBeTruthy();
  });

  it("displays the description text", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText(/help us understand/i)).toBeTruthy();
  });

  it("displays the estimated time", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText(/minutes/i)).toBeTruthy();
  });

  it("displays the total questions count", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText(/14 questions/i)).toBeTruthy();
  });

  it("displays the Start Assessment button", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("start-button")).toBeTruthy();
  });

  it("displays the Start Assessment button text", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText(/Start Assessment/i)).toBeTruthy();
  });

  it("calls onStart when Start Assessment button is pressed", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    fireEvent.press(getByTestId("start-button"));
    expect(mockOnStart).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const container = getByTestId("assessment-intro-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("Start button has proper accessibility", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const button = getByTestId("start-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Start button has minimum touch target size", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    const button = getByTestId("start-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("displays info cards", () => {
    const { getByTestId } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByTestId("info-cards")).toBeTruthy();
  });

  it("displays privacy notice", () => {
    const { getByText } = render(<AssessmentIntroScreen {...defaultProps} />);
    expect(getByText(/private|confidential/i)).toBeTruthy();
  });
});
