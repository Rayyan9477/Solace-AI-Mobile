/**
 * MoodSuggestionResolvedModal Tests
 * @description Tests for the success celebration modal after resolving mood suggestions
 * @task Task 3.8.7: Mood Suggestion Resolved Modal (Screen 77)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodSuggestionResolvedModal } from "./MoodSuggestionResolvedModal";

describe("MoodSuggestionResolvedModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    visible: true,
    scoreReward: 3,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the modal when visible", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByTestId("mood-suggestion-resolved-modal")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} visible={false} />
    );
    expect(queryByTestId("mood-suggestion-resolved-modal")).toBeNull();
  });

  // --- Modal Overlay ---
  it("displays dimmed backdrop overlay", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByTestId("modal-backdrop")).toBeTruthy();
  });

  // --- Success Card ---
  it("displays the success card", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByTestId("success-card")).toBeTruthy();
  });

  it("displays mood transformation illustration", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByTestId("transformation-illustration")).toBeTruthy();
  });

  // --- Title & Content ---
  it("displays resolved title", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByText("Mood Suggestion Resolved!")).toBeTruthy();
  });

  it("displays score reward text with Solace Score branding", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByText("+3 Solace Score received.")).toBeTruthy();
  });

  it("displays congratulatory message", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByText(/Great job/)).toBeTruthy();
  });

  it("displays celebration emoji", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByText("🙌")).toBeTruthy();
  });

  // --- Dynamic Score ---
  it("renders correct reward amount when different", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} scoreReward={5} />
    );
    expect(getByText("+5 Solace Score received.")).toBeTruthy();
  });

  // --- Close Button ---
  it("displays close button", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByTestId("close-button")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    fireEvent.press(getByTestId("close-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // --- Confirm Button ---
  it("displays confirm button with text", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByText("Great, thanks!")).toBeTruthy();
  });

  it("calls onConfirm when confirm button is pressed", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    fireEvent.press(getByTestId("confirm-button"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  // --- Calendar Strip ---
  it("displays background calendar strip", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByTestId("calendar-strip")).toBeTruthy();
  });

  it("displays day labels in calendar strip", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Sun")).toBeTruthy();
  });

  // --- Accessibility ---
  it("close button has proper accessibility", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    const btn = getByTestId("close-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Close modal");
  });

  it("confirm button has proper accessibility", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    const btn = getByTestId("confirm-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Confirm and close");
  });

  it("close button meets minimum touch target", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    const btn = getByTestId("close-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("confirm button meets minimum touch target", () => {
    const { getByTestId } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    const btn = getByTestId("confirm-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(queryByText(/Freud/)).toBeNull();
  });

  it("uses Solace Score branding", () => {
    const { getByText } = render(
      <MoodSuggestionResolvedModal {...defaultProps} />
    );
    expect(getByText(/Solace Score/)).toBeTruthy();
  });
});
