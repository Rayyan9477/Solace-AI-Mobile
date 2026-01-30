/**
 * VoiceMessageSentScreen Tests
 * @description Tests for voice message sent confirmation screen
 * @task Task 3.7.10: Voice Message Sent Screen (Screen 62)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VoiceMessageSentScreen } from "./VoiceMessageSentScreen";

describe("VoiceMessageSentScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnContinueToChat = jest.fn();
  const mockOnRecordAnother = jest.fn();
  const mockOnPlayRecording = jest.fn();
  const mockOnPauseRecording = jest.fn();

  const defaultProps = {
    recordingDuration: 45,
    isAnalyzing: false,
    analysisComplete: true,
    isPlaying: false,
    playbackProgress: 0,
    detectedMood: "Calm",
    confidenceScore: 85,
    onBack: mockOnBack,
    onContinueToChat: mockOnContinueToChat,
    onRecordAnother: mockOnRecordAnother,
    onPlayRecording: mockOnPlayRecording,
    onPauseRecording: mockOnPauseRecording,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("voice-message-sent-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays success icon", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("success-icon")).toBeTruthy();
  });

  it("displays success message", () => {
    const { getByText } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByText(/sent/i)).toBeTruthy();
  });

  it("displays recording duration", () => {
    const { getByText } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByText(/0:45/)).toBeTruthy();
  });

  it("displays audio playback controls", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("audio-playback-container")).toBeTruthy();
  });

  it("displays play button when not playing", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("play-button")).toBeTruthy();
  });

  it("calls onPlayRecording when play button is pressed", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("play-button"));
    expect(mockOnPlayRecording).toHaveBeenCalledTimes(1);
  });

  it("displays pause button when playing", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} isPlaying={true} />
    );
    expect(getByTestId("pause-button")).toBeTruthy();
  });

  it("calls onPauseRecording when pause button is pressed", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} isPlaying={true} />
    );
    fireEvent.press(getByTestId("pause-button"));
    expect(mockOnPauseRecording).toHaveBeenCalledTimes(1);
  });

  it("displays analysis result section when analysis complete", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("analysis-result")).toBeTruthy();
  });

  it("displays detected mood", () => {
    const { getByText } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByText("Calm")).toBeTruthy();
  });

  it("displays confidence score", () => {
    const { getByText } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByText(/85%/)).toBeTruthy();
  });

  it("displays analyzing indicator when still analyzing", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen
        {...defaultProps}
        isAnalyzing={true}
        analysisComplete={false}
      />
    );
    expect(getByTestId("analyzing-indicator")).toBeTruthy();
  });

  it("displays analyzing text when still analyzing", () => {
    const { getByText } = render(
      <VoiceMessageSentScreen
        {...defaultProps}
        isAnalyzing={true}
        analysisComplete={false}
      />
    );
    expect(getByText(/Analyzing/)).toBeTruthy();
  });

  it("displays continue to chat button", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinueToChat when continue button is pressed", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinueToChat).toHaveBeenCalledTimes(1);
  });

  it("displays record another button", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByTestId("record-another-button")).toBeTruthy();
  });

  it("calls onRecordAnother when record another button is pressed", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("record-another-button"));
    expect(mockOnRecordAnother).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    const container = getByTestId("voice-message-sent-screen");
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
      <VoiceMessageSentScreen {...defaultProps} />
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
      <VoiceMessageSentScreen {...defaultProps} />
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
      <VoiceMessageSentScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Continue to chat");
  });

  it("play button has proper accessibility", () => {
    const { getByTestId } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    const button = getByTestId("play-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Play recording");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("uses Solace branding", () => {
    const { getByText } = render(
      <VoiceMessageSentScreen {...defaultProps} />
    );
    expect(getByText(/Solace/)).toBeTruthy();
  });
});
