/**
 * VoiceJournalReadyScreen Tests
 * @screen Screen 81: Voice Journal Ready
 * @audit batch-17-journal-continued.md
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VoiceJournalReadyScreen } from "./VoiceJournalReadyScreen";

describe("VoiceJournalReadyScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnStartRecording = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onStartRecording: mockOnStartRecording,
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders the screen container", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("voice-journal-ready-screen")).toBeTruthy();
  });

  it("uses dark background", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("voice-journal-ready-screen").props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  it("displays the prompt text", () => {
    const { getByText } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByText(/Say anything that's on your mind/)).toBeTruthy();
  });

  it("displays back button", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays waveform visualization", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("waveform-display")).toBeTruthy();
  });

  it("displays microphone button", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("mic-button")).toBeTruthy();
  });

  it("calls onStartRecording when mic button is pressed", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    fireEvent.press(getByTestId("mic-button"));
    expect(mockOnStartRecording).toHaveBeenCalledTimes(1);
  });

  it("displays 'Ready' status label", () => {
    const { getByText } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByText("Ready")).toBeTruthy();
  });

  it("displays cancel button", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("cancel-button")).toBeTruthy();
  });

  it("calls onCancel when cancel button is pressed", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    fireEvent.press(getByTestId("cancel-button"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("displays confirm button", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("confirm-button")).toBeTruthy();
  });

  it("calls onConfirm when confirm button is pressed", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    fireEvent.press(getByTestId("confirm-button"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
    expect(btn.props.style).toEqual(expect.objectContaining({ minHeight: 44 }));
  });

  it("mic button has proper accessibility", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    const btn = getByTestId("mic-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Start recording");
  });

  it("cancel and confirm buttons meet touch targets", () => {
    const { getByTestId } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(getByTestId("cancel-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
    expect(getByTestId("confirm-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<VoiceJournalReadyScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
