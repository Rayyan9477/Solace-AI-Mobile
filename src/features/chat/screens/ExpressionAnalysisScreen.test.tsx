/**
 * ExpressionAnalysisScreen Tests
 * @description Tests for facial expression analysis results interface
 * @task Task 3.7.7: Expression Analysis Screen (Screen 59)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ExpressionAnalysisScreen } from "./ExpressionAnalysisScreen";

describe("ExpressionAnalysisScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnRetake = jest.fn();
  const mockOnContinue = jest.fn();
  const mockOnSaveAnalysis = jest.fn();

  const mockEmotionData = [
    { emotion: "Calm", confidence: 85, color: "#9AAD5C" },
    { emotion: "Content", confidence: 72, color: "#C4A574" },
    { emotion: "Focused", confidence: 65, color: "#7B9AAD" },
    { emotion: "Neutral", confidence: 45, color: "#94A3B8" },
  ];

  const mockInsights = [
    {
      id: "1",
      title: "Relaxed State Detected",
      description:
        "Your facial expression indicates a calm and relaxed state, which is positive for your mental wellbeing.",
      icon: "peaceful",
    },
    {
      id: "2",
      title: "Good Eye Contact",
      description:
        "You maintained steady eye contact during the capture, suggesting confidence and presence.",
      icon: "eye",
    },
  ];

  const defaultProps = {
    capturedImageUri: "file://captured-image.jpg",
    analysisComplete: true,
    overallMoodScore: 78,
    emotionData: mockEmotionData,
    insights: mockInsights,
    analysisTimestamp: new Date("2024-01-15T10:00:00"),
    onBack: mockOnBack,
    onRetake: mockOnRetake,
    onContinue: mockOnContinue,
    onSaveAnalysis: mockOnSaveAnalysis,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("expression-analysis-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("Expression Analysis")).toBeTruthy();
  });

  it("displays captured image preview", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("captured-image-preview")).toBeTruthy();
  });

  it("displays overall mood score", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("overall-mood-score")).toBeTruthy();
  });

  it("displays mood score value", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("78")).toBeTruthy();
  });

  it("displays emotion breakdown section", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("emotion-breakdown")).toBeTruthy();
  });

  it("displays all emotion items", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("emotion-item-0")).toBeTruthy();
    expect(getByTestId("emotion-item-1")).toBeTruthy();
    expect(getByTestId("emotion-item-2")).toBeTruthy();
    expect(getByTestId("emotion-item-3")).toBeTruthy();
  });

  it("displays emotion names", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("Calm")).toBeTruthy();
    expect(getByText("Content")).toBeTruthy();
    expect(getByText("Focused")).toBeTruthy();
    expect(getByText("Neutral")).toBeTruthy();
  });

  it("displays emotion confidence percentages", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("85%")).toBeTruthy();
    expect(getByText("72%")).toBeTruthy();
  });

  it("displays insights section", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("insights-section")).toBeTruthy();
  });

  it("displays insight cards", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("insight-card-1")).toBeTruthy();
    expect(getByTestId("insight-card-2")).toBeTruthy();
  });

  it("displays insight titles", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText("Relaxed State Detected")).toBeTruthy();
    expect(getByText("Good Eye Contact")).toBeTruthy();
  });

  it("displays insight descriptions", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText(/calm and relaxed state/)).toBeTruthy();
    expect(getByText(/maintained steady eye contact/)).toBeTruthy();
  });

  it("displays retake button", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("retake-button")).toBeTruthy();
  });

  it("calls onRetake when retake button is pressed", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("retake-button"));
    expect(mockOnRetake).toHaveBeenCalledTimes(1);
  });

  it("displays continue button", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinue when continue button is pressed", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("displays save button", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("save-button")).toBeTruthy();
  });

  it("calls onSaveAnalysis when save button is pressed", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("save-button"));
    expect(mockOnSaveAnalysis).toHaveBeenCalledTimes(1);
  });

  it("displays loading state when analysis not complete", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} analysisComplete={false} />
    );
    expect(getByTestId("analysis-loading")).toBeTruthy();
  });

  it("displays analyzing text when analysis not complete", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} analysisComplete={false} />
    );
    expect(getByText(/Analyzing/)).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    const container = getByTestId("expression-analysis-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Continue");
  });

  it("retake button has proper accessibility", () => {
    const { getByTestId } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    const button = getByTestId("retake-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Retake photo");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("uses Solace branding", () => {
    const { getByText } = render(
      <ExpressionAnalysisScreen {...defaultProps} />
    );
    expect(getByText(/Solace/)).toBeTruthy();
  });
});
