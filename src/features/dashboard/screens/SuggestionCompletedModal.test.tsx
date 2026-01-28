/**
 * SuggestionCompletedModal Tests
 * @description Tests for suggestion completion success modal
 * @task Task 3.5.7: Suggestion Completed Modal (Screen 46)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SuggestionCompletedModal } from "./SuggestionCompletedModal";

describe("SuggestionCompletedModal", () => {
  const mockOnBack = jest.fn();
  const mockOnDismiss = jest.fn();
  const mockOnSwipeToNext = jest.fn();

  const defaultProps = {
    isVisible: true,
    pointsAdded: 5,
    newScore: 88,
    suggestionTitle: "Daily Meditation Routine",
    hasMoreSuggestions: true,
    onBack: mockOnBack,
    onDismiss: mockOnDismiss,
    onSwipeToNext: mockOnSwipeToNext,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal when visible", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByTestId("suggestion-completed-modal")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} isVisible={false} />
    );
    expect(queryByTestId("suggestion-completed-modal")).toBeNull();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the illustration card", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByTestId("illustration-card")).toBeTruthy();
  });

  it("displays the success title", () => {
    const { getByText } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByText("AI Suggestion Completed.")).toBeTruthy();
  });

  it("displays the score increase with Solace (not Freud)", () => {
    const { getByText, queryByText } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByText(/\+5 Solace Score Added/)).toBeTruthy();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("displays the new score message with Solace", () => {
    const { getByText } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByText(/Your Solace score has increased to 88!/i)).toBeTruthy();
  });

  it("displays the dismiss button", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByTestId("dismiss-button")).toBeTruthy();
  });

  it("displays Great, Thanks! text on dismiss button", () => {
    const { getByText } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByText("Great, Thanks!")).toBeTruthy();
  });

  it("calls onDismiss when dismiss button is pressed", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    fireEvent.press(getByTestId("dismiss-button"));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it("displays the swipe indicator when there are more suggestions", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByTestId("swipe-indicator")).toBeTruthy();
  });

  it("hides the swipe indicator when there are no more suggestions", () => {
    const { queryByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} hasMoreSuggestions={false} />
    );
    expect(queryByTestId("swipe-indicator")).toBeNull();
  });

  it("displays swipe for suggestions text", () => {
    const { getByText } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByText(/Swipe.*suggestions/i)).toBeTruthy();
  });

  it("calls onSwipeToNext when swipe button is pressed", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    fireEvent.press(getByTestId("swipe-next-button"));
    expect(mockOnSwipeToNext).toHaveBeenCalledTimes(1);
  });

  it("displays the dismiss X button in swipe indicator", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    expect(getByTestId("swipe-dismiss-button")).toBeTruthy();
  });

  it("has dark background overlay", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    const container = getByTestId("suggestion-completed-modal");
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
      <SuggestionCompletedModal {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("dismiss button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    const button = getByTestId("dismiss-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("dismiss button has proper accessibility", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    const button = getByTestId("dismiss-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("displays correct points value", () => {
    const { getByText } = render(
      <SuggestionCompletedModal {...defaultProps} pointsAdded={10} />
    );
    expect(getByText(/\+10 Solace Score Added/)).toBeTruthy();
  });

  it("displays correct new score value", () => {
    const { getByText } = render(
      <SuggestionCompletedModal {...defaultProps} newScore={95} />
    );
    expect(getByText(/increased to 95!/)).toBeTruthy();
  });

  it("illustration card has tan border", () => {
    const { getByTestId } = render(
      <SuggestionCompletedModal {...defaultProps} />
    );
    const card = getByTestId("illustration-card");
    const styles = Array.isArray(card.props.style)
      ? card.props.style.flat()
      : [card.props.style];
    const cardStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(cardStyles.borderColor).toBe("#C4A574");
  });
});
