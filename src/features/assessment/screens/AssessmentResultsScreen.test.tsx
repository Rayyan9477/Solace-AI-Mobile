/**
 * AssessmentResultsScreen Tests
 * @description Tests for assessment results display screen
 * @task Task 3.4.5: Assessment Results Screen (Screen 39)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentResultsScreen } from "./AssessmentResultsScreen";

describe("AssessmentResultsScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnViewDetails = jest.fn();

  const defaultProps = {
    score: 72,
    category: "healthy" as const,
    breakdown: [
      { label: "Stress Level", score: 75, color: "#9AAD5C" },
      { label: "Sleep Quality", score: 68, color: "#E8853A" },
      { label: "Mood", score: 80, color: "#9AAD5C" },
      { label: "Anxiety", score: 65, color: "#E8853A" },
    ],
    recommendations: [
      "Continue your current wellness routine",
      "Consider adding meditation to your daily practice",
    ],
    onContinue: mockOnContinue,
    onViewDetails: mockOnViewDetails,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByTestId("assessment-results-screen")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByText("Assessment Complete")).toBeTruthy();
  });

  it("displays the score circle", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByTestId("score-circle")).toBeTruthy();
  });

  it("displays the score value", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByText("72")).toBeTruthy();
  });

  it("displays the score label", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByText(/Mental Health Score/i)).toBeTruthy();
  });

  it("displays the category badge", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByTestId("category-badge")).toBeTruthy();
  });

  it("displays healthy category text", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByText(/Healthy/i)).toBeTruthy();
  });

  it("displays unstable category when provided", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} category="unstable" score={45} />
    );
    expect(getByText(/Unstable/i)).toBeTruthy();
  });

  it("displays critical category when provided", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} category="critical" score={20} />
    );
    expect(getByText(/Critical/i)).toBeTruthy();
  });

  it("displays breakdown section", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByTestId("breakdown-section")).toBeTruthy();
  });

  it("displays all breakdown categories", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByText("Stress Level")).toBeTruthy();
    expect(getByText("Sleep Quality")).toBeTruthy();
    expect(getByText("Mood")).toBeTruthy();
    expect(getByText("Anxiety")).toBeTruthy();
  });

  it("displays breakdown scores", () => {
    const { getAllByText } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getAllByText(/75|68|80|65/).length).toBeGreaterThan(0);
  });

  it("displays recommendations section", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByTestId("recommendations-section")).toBeTruthy();
  });

  it("displays recommendation items", () => {
    const { getByText } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByText(/Continue your current wellness routine/i)).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays View Details button", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    expect(getByTestId("view-details-button")).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("calls onViewDetails when View Details button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("view-details-button"));
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    const container = getByTestId("assessment-results-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("score circle has category-appropriate color", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    const circle = getByTestId("score-circle");
    const styles = Array.isArray(circle.props.style)
      ? circle.props.style.flat()
      : [circle.props.style];
    const circleStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(circleStyles.borderColor).toBe("#9AAD5C");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("score text is large and bold", () => {
    const { getByTestId } = render(
      <AssessmentResultsScreen {...defaultProps} />
    );
    const scoreText = getByTestId("score-value");
    const styles = Array.isArray(scoreText.props.style)
      ? scoreText.props.style.flat()
      : [scoreText.props.style];
    const textStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(textStyles.fontSize).toBeGreaterThanOrEqual(48);
    expect(textStyles.fontWeight).toBe("700");
  });
});
