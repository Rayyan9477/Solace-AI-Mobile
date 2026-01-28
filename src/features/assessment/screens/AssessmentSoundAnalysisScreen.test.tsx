/**
 * AssessmentSoundAnalysisScreen Tests
 * @description Tests for voice analysis assessment screen with concentric circle visualizer
 * @task Task 3.4.8: Assessment Sound Analysis Screen (Screen 38)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentSoundAnalysisScreen } from "./AssessmentSoundAnalysisScreen";

describe("AssessmentSoundAnalysisScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnBack = jest.fn();
  const mockOnStartRecording = jest.fn();
  const mockOnStopRecording = jest.fn();

  const defaultProps = {
    currentStep: 13,
    totalSteps: 14,
    onContinue: mockOnContinue,
    onBack: mockOnBack,
    onStartRecording: mockOnStartRecording,
    onStopRecording: mockOnStopRecording,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("assessment-sound-analysis-screen")).toBeTruthy();
  });

  it("displays the progress indicator", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  it("displays the header title", () => {
    const { getByText } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByText("Assessment")).toBeTruthy();
  });

  it("displays the step counter", () => {
    const { getByText } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByText("13 of 14")).toBeTruthy();
  });

  it("displays the screen title", () => {
    const { getByText } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByText("AI Sound Analysis")).toBeTruthy();
  });

  it("displays the privacy disclaimer subtitle", () => {
    const { getByText } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(
      getByText(/Please say the following words below/i)
    ).toBeTruthy();
  });

  it("displays the voice visualizer", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("voice-visualizer")).toBeTruthy();
  });

  it("displays concentric circles in the visualizer", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("visualizer-outer-circle")).toBeTruthy();
    expect(getByTestId("visualizer-middle-circle")).toBeTruthy();
    expect(getByTestId("visualizer-inner-circle")).toBeTruthy();
    expect(getByTestId("visualizer-center-circle")).toBeTruthy();
  });

  it("displays the phrase to read", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("phrase-display")).toBeTruthy();
  });

  it("displays the highlighted portion of the phrase", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("phrase-highlighted")).toBeTruthy();
  });

  it("displays the record button", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("record-button")).toBeTruthy();
  });

  it("calls onStartRecording when record button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("record-button"));
    expect(mockOnStartRecording).toHaveBeenCalledTimes(1);
  });

  it("shows recording state when isRecording is true", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} isRecording={true} />
    );
    expect(getByTestId("recording-indicator")).toBeTruthy();
  });

  it("calls onStopRecording when stop button is pressed during recording", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} isRecording={true} />
    );
    fireEvent.press(getByTestId("record-button"));
    expect(mockOnStopRecording).toHaveBeenCalledTimes(1);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinue when Continue is pressed", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    const container = getByTestId("assessment-sound-analysis-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("visualizer circles have olive green tones", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    const outerCircle = getByTestId("visualizer-outer-circle");
    const styles = Array.isArray(outerCircle.props.style)
      ? outerCircle.props.style.flat()
      : [outerCircle.props.style];
    const circleStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    // Olive green tones - should be a valid hex color
    expect(circleStyles.backgroundColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    // Verify it's an olive green color
    expect(circleStyles.backgroundColor).toBe("#4A5A30");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("record button has proper accessibility", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    const recordButton = getByTestId("record-button");
    expect(recordButton.props.accessibilityRole).toBe("button");
  });

  it("phrase display uses Solace AI branding (not Freud)", () => {
    const { queryByText } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    // Should NOT contain Freud
    expect(queryByText(/freud/i)).toBeNull();
    // Should contain Solace
    expect(queryByText(/solace/i)).toBeTruthy();
  });

  it("displays skip option for users who cannot use voice", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    expect(getByTestId("skip-button")).toBeTruthy();
  });

  it("calls onContinue when skip is pressed", () => {
    const { getByTestId } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("skip-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("updates visualizer animation level when audioLevel prop changes", () => {
    const { getByTestId, rerender } = render(
      <AssessmentSoundAnalysisScreen {...defaultProps} audioLevel={0} />
    );
    const visualizer = getByTestId("voice-visualizer");
    expect(visualizer).toBeTruthy();

    rerender(
      <AssessmentSoundAnalysisScreen {...defaultProps} audioLevel={0.8} />
    );
    // Visualizer should still be present with new audio level
    expect(getByTestId("voice-visualizer")).toBeTruthy();
  });
});
