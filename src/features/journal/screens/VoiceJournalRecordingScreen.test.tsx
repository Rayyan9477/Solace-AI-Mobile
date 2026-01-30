/**
 * VoiceJournalRecordingScreen Tests
 * @screen Screen 82: Voice Journal Recording (Active)
 * @audit batch-17-journal-continued.md
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VoiceJournalRecordingScreen } from "./VoiceJournalRecordingScreen";

describe("VoiceJournalRecordingScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnStopRecording = jest.fn();
  const mockOnCancel = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    transcribedText: "Today I had a hard time concentrating. I was very worried about making mistakes, very angr",
    recordingDuration: "00:05",
    isRecording: true,
    onBack: mockOnBack,
    onStopRecording: mockOnStopRecording,
    onCancel: mockOnCancel,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders the screen container", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByTestId("voice-recording-screen")).toBeTruthy();
  });

  it("uses dark background", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByTestId("voice-recording-screen").props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  it("displays transcribed text", () => {
    const { getByText } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByText(/Today I had a hard time concentrating/)).toBeTruthy();
  });

  it("displays bold keywords in transcription", () => {
    const { getByText } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByText(/making mistakes/)).toBeTruthy();
  });

  it("displays active waveform", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByTestId("waveform-display")).toBeTruthy();
  });

  it("displays recording timer", () => {
    const { getByText } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByText("00:05")).toBeTruthy();
  });

  it("displays mic button", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByTestId("mic-button")).toBeTruthy();
  });

  it("calls onStopRecording when mic button is pressed", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    fireEvent.press(getByTestId("mic-button"));
    expect(mockOnStopRecording).toHaveBeenCalledTimes(1);
  });

  it("displays cancel button (orange when recording)", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByTestId("cancel-button")).toBeTruthy();
  });

  it("calls onCancel when cancel button is pressed", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    fireEvent.press(getByTestId("cancel-button"));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("displays confirm button (green when recording)", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByTestId("confirm-button")).toBeTruthy();
  });

  it("calls onConfirm when confirm button is pressed", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    fireEvent.press(getByTestId("confirm-button"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("displays back button", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  // --- Accessibility ---
  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
    expect(btn.props.style).toEqual(expect.objectContaining({ minHeight: 44 }));
  });

  it("mic button has proper accessibility", () => {
    const { getByTestId } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    const btn = getByTestId("mic-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Stop recording");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<VoiceJournalRecordingScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
