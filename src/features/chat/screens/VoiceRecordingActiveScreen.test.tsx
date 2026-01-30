/**
 * VoiceRecordingActiveScreen Tests
 * @description Tests for active voice recording interface with waveform
 * @task Task 3.7.9: Voice Recording Active Screen (Screen 61)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VoiceRecordingActiveScreen } from "./VoiceRecordingActiveScreen";

describe("VoiceRecordingActiveScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnPause = jest.fn();
  const mockOnResume = jest.fn();
  const mockOnStop = jest.fn();
  const mockOnCancel = jest.fn();

  const mockWaveformData = [0.3, 0.5, 0.8, 0.4, 0.6, 0.9, 0.2, 0.7, 0.5, 0.4];

  const defaultProps = {
    isRecording: true,
    isPaused: false,
    recordingDuration: 45,
    waveformData: mockWaveformData,
    maxDuration: 120,
    onBack: mockOnBack,
    onPause: mockOnPause,
    onResume: mockOnResume,
    onStop: mockOnStop,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("voice-recording-active-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getAllByText } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    const recordingElements = getAllByText("Recording");
    expect(recordingElements.length).toBeGreaterThan(0);
  });

  it("displays recording indicator when recording", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("recording-indicator")).toBeTruthy();
  });

  it("displays waveform visualization", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("waveform-visualization")).toBeTruthy();
  });

  it("displays waveform bars", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("waveform-bar-0")).toBeTruthy();
    expect(getByTestId("waveform-bar-5")).toBeTruthy();
  });

  it("displays recording timer", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("recording-timer")).toBeTruthy();
  });

  it("displays formatted duration", () => {
    const { getByText } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByText("0:45")).toBeTruthy();
  });

  it("displays max duration indicator", () => {
    const { getByText } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByText(/2:00/)).toBeTruthy();
  });

  it("displays pause button when recording", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("pause-button")).toBeTruthy();
  });

  it("calls onPause when pause button is pressed", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("pause-button"));
    expect(mockOnPause).toHaveBeenCalledTimes(1);
  });

  it("displays resume button when paused", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} isPaused={true} />
    );
    expect(getByTestId("resume-button")).toBeTruthy();
  });

  it("calls onResume when resume button is pressed", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} isPaused={true} />
    );
    fireEvent.press(getByTestId("resume-button"));
    expect(mockOnResume).toHaveBeenCalledTimes(1);
  });

  it("displays stop button", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("stop-button")).toBeTruthy();
  });

  it("calls onStop when stop button is pressed", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("stop-button"));
    expect(mockOnStop).toHaveBeenCalledTimes(1);
  });

  it("displays cancel button", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("cancel-button")).toBeTruthy();
  });

  it("calls onCancel when cancel button is pressed", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("cancel-button"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("displays paused indicator when paused", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} isPaused={true} />
    );
    expect(getByTestId("paused-indicator")).toBeTruthy();
  });

  it("displays progress bar", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByTestId("progress-bar")).toBeTruthy();
  });

  it("displays instruction text", () => {
    const { getByText } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByText(/speak/i)).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    const container = getByTestId("voice-recording-active-screen");
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
      <VoiceRecordingActiveScreen {...defaultProps} />
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

  it("stop button has minimum touch target size", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    const button = getByTestId("stop-button");
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
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("pause button has proper accessibility", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    const button = getByTestId("pause-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Pause recording");
  });

  it("stop button has proper accessibility", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    const button = getByTestId("stop-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Stop recording");
  });

  it("cancel button has proper accessibility", () => {
    const { getByTestId } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    const button = getByTestId("cancel-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Cancel recording");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("uses Solace branding", () => {
    const { getByText } = render(
      <VoiceRecordingActiveScreen {...defaultProps} />
    );
    expect(getByText(/Solace/)).toBeTruthy();
  });
});
