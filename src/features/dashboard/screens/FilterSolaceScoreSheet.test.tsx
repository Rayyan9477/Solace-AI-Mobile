/**
 * FilterSolaceScoreSheet Tests
 * @description Tests for bottom sheet filter for Solace score history
 * @task Task 3.5.4: Filter Solace Score Sheet (Screen 43)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FilterSolaceScoreSheet } from "./FilterSolaceScoreSheet";

describe("FilterSolaceScoreSheet", () => {
  const mockOnClose = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnHelpPress = jest.fn();
  const mockOnFromDatePress = jest.fn();
  const mockOnToDatePress = jest.fn();
  const mockOnScoreRangeChange = jest.fn();
  const mockOnToggleAISuggestions = jest.fn();

  const defaultProps = {
    isVisible: true,
    fromDate: new Date("2025-01-01"),
    toDate: new Date("2025-01-31"),
    scoreRange: [0, 100] as [number, number],
    includeAISuggestions: true,
    matchingCount: 15,
    onClose: mockOnClose,
    onApply: mockOnApply,
    onHelpPress: mockOnHelpPress,
    onFromDatePress: mockOnFromDatePress,
    onToDatePress: mockOnToDatePress,
    onScoreRangeChange: mockOnScoreRangeChange,
    onToggleAISuggestions: mockOnToggleAISuggestions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sheet when visible", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("filter-solace-score-sheet")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} isVisible={false} />
    );
    expect(queryByTestId("filter-solace-score-sheet")).toBeNull();
  });

  it("displays the drag handle", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("drag-handle")).toBeTruthy();
  });

  it("displays the title as Filter Solace Score (not Freud)", () => {
    const { getByText, queryByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText("Filter Solace Score")).toBeTruthy();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("displays the help button", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("help-button")).toBeTruthy();
  });

  it("calls onHelpPress when help button is pressed", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("help-button"));
    expect(mockOnHelpPress).toHaveBeenCalledTimes(1);
  });

  it("displays the From date label", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText("From")).toBeTruthy();
  });

  it("displays the from date picker button", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("from-date-picker")).toBeTruthy();
  });

  it("calls onFromDatePress when from date picker is pressed", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("from-date-picker"));
    expect(mockOnFromDatePress).toHaveBeenCalledTimes(1);
  });

  it("displays the To date label", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText("To")).toBeTruthy();
  });

  it("displays the to date picker button", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("to-date-picker")).toBeTruthy();
  });

  it("calls onToDatePress when to date picker is pressed", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("to-date-picker"));
    expect(mockOnToDatePress).toHaveBeenCalledTimes(1);
  });

  it("displays the Score Range label", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText("Score Range")).toBeTruthy();
  });

  it("displays the score range slider", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("score-range-slider")).toBeTruthy();
  });

  it("displays the min score label", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("min-score-label")).toBeTruthy();
  });

  it("displays the max score label", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("max-score-label")).toBeTruthy();
  });

  it("displays the Include AI Suggestions label", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText("Include AI Suggestions")).toBeTruthy();
  });

  it("displays the AI suggestions toggle", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("ai-suggestions-toggle")).toBeTruthy();
  });

  it("calls onToggleAISuggestions when toggle is pressed", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("ai-suggestions-toggle"));
    expect(mockOnToggleAISuggestions).toHaveBeenCalledTimes(1);
  });

  it("displays the apply button", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("apply-button")).toBeTruthy();
  });

  it("displays the matching count in the apply button", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText(/15/)).toBeTruthy();
  });

  it("calls onApply when apply button is pressed", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("apply-button"));
    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  it("displays apply button text with Solace Score", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    // Button shows "Filter Solace Score (15)" with the count
    expect(getByText(/Filter Solace Score \(15\)/)).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    const container = getByTestId("filter-solace-score-sheet");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("apply button has minimum touch target size", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    const button = getByTestId("apply-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("help button has proper accessibility", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    const helpButton = getByTestId("help-button");
    expect(helpButton.props.accessibilityRole).toBe("button");
  });

  it("shows toggle in on state when AI suggestions included", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} includeAISuggestions={true} />
    );
    const toggle = getByTestId("ai-suggestions-toggle");
    expect(toggle.props.accessibilityState?.checked).toBe(true);
  });

  it("shows toggle in off state when AI suggestions excluded", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} includeAISuggestions={false} />
    );
    const toggle = getByTestId("ai-suggestions-toggle");
    expect(toggle.props.accessibilityState?.checked).toBe(false);
  });

  it("displays zero matching count", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} matchingCount={0} />
    );
    expect(getByText(/\(0\)/)).toBeTruthy();
  });

  it("displays formatted from date", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText("01/01/2025")).toBeTruthy();
  });

  it("displays formatted to date", () => {
    const { getByText } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByText("31/01/2025")).toBeTruthy();
  });

  it("displays calendar icon in date pickers", () => {
    const { getByTestId } = render(
      <FilterSolaceScoreSheet {...defaultProps} />
    );
    expect(getByTestId("from-date-calendar-icon")).toBeTruthy();
    expect(getByTestId("to-date-calendar-icon")).toBeTruthy();
  });
});
