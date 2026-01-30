/**
 * VoiceExpressionReadyScreen Tests
 * @description Tests for voice expression ready/landing screen before recording
 * @task Task 3.7.8: Voice Expression Ready Screen (Screen 60)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VoiceExpressionReadyScreen } from "./VoiceExpressionReadyScreen";

describe("VoiceExpressionReadyScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnStartRecording = jest.fn();
  const mockOnSkip = jest.fn();
  const mockOnRequestPermission = jest.fn();

  const mockTips = [
    {
      id: "1",
      title: "Find a quiet space",
      description: "Background noise can affect analysis accuracy",
      icon: "quiet",
    },
    {
      id: "2",
      title: "Speak naturally",
      description: "Talk as you normally would in conversation",
      icon: "speak",
    },
    {
      id: "3",
      title: "Express yourself",
      description: "Share how you're feeling today",
      icon: "express",
    },
  ];

  const defaultProps = {
    microphonePermissionGranted: true,
    tips: mockTips,
    onBack: mockOnBack,
    onStartRecording: mockOnStartRecording,
    onSkip: mockOnSkip,
    onRequestPermission: mockOnRequestPermission,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByTestId("voice-expression-ready-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByText("Voice Analysis")).toBeTruthy();
  });

  it("displays subtitle text", () => {
    const { getByText } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByText(/Solace AI/)).toBeTruthy();
  });

  it("displays microphone icon", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByTestId("microphone-icon")).toBeTruthy();
  });

  it("displays instruction text", () => {
    const { getByText } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByText("Ready to record")).toBeTruthy();
  });

  it("displays tips section", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByTestId("tips-section")).toBeTruthy();
  });

  it("displays all tip items", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByTestId("tip-item-1")).toBeTruthy();
    expect(getByTestId("tip-item-2")).toBeTruthy();
    expect(getByTestId("tip-item-3")).toBeTruthy();
  });

  it("displays tip titles", () => {
    const { getByText } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByText("Find a quiet space")).toBeTruthy();
    expect(getByText("Speak naturally")).toBeTruthy();
    expect(getByText("Express yourself")).toBeTruthy();
  });

  it("displays tip descriptions", () => {
    const { getByText } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByText(/Background noise/)).toBeTruthy();
    expect(getByText(/Talk as you normally would/)).toBeTruthy();
  });

  it("displays start recording button when permission granted", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByTestId("start-recording-button")).toBeTruthy();
  });

  it("calls onStartRecording when start button is pressed", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("start-recording-button"));
    expect(mockOnStartRecording).toHaveBeenCalledTimes(1);
  });

  it("displays skip button", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(getByTestId("skip-button")).toBeTruthy();
  });

  it("calls onSkip when skip button is pressed", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("skip-button"));
    expect(mockOnSkip).toHaveBeenCalledTimes(1);
  });

  it("displays permission required state when permission not granted", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen
        {...defaultProps}
        microphonePermissionGranted={false}
      />
    );
    expect(getByTestId("permission-required")).toBeTruthy();
  });

  it("displays grant permission button when permission not granted", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen
        {...defaultProps}
        microphonePermissionGranted={false}
      />
    );
    expect(getByTestId("grant-permission-button")).toBeTruthy();
  });

  it("calls onRequestPermission when grant button is pressed", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen
        {...defaultProps}
        microphonePermissionGranted={false}
      />
    );
    fireEvent.press(getByTestId("grant-permission-button"));
    expect(mockOnRequestPermission).toHaveBeenCalledTimes(1);
  });

  it("displays permission explanation text when permission not granted", () => {
    const { getByText } = render(
      <VoiceExpressionReadyScreen
        {...defaultProps}
        microphonePermissionGranted={false}
      />
    );
    expect(getByText("Microphone Access Required")).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    const container = getByTestId("voice-expression-ready-screen");
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
      <VoiceExpressionReadyScreen {...defaultProps} />
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

  it("start recording button has minimum touch target size", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    const button = getByTestId("start-recording-button");
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
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("start recording button has proper accessibility", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    const button = getByTestId("start-recording-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Start recording");
  });

  it("skip button has proper accessibility", () => {
    const { getByTestId } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    const button = getByTestId("skip-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Skip voice analysis");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <VoiceExpressionReadyScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
