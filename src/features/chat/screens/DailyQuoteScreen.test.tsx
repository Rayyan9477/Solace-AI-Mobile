/**
 * DailyQuoteScreen Tests
 * @description Tests for daily inspirational quote screen
 * @task Task 3.7.11: Daily Quote Screen (Screen 63)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DailyQuoteScreen } from "./DailyQuoteScreen";

describe("DailyQuoteScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnShare = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnNewQuote = jest.fn();
  const mockOnContinue = jest.fn();

  const defaultProps = {
    quote:
      "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "Resilience",
    isSaved: false,
    dateDisplayed: new Date("2024-01-15"),
    onBack: mockOnBack,
    onShare: mockOnShare,
    onSave: mockOnSave,
    onNewQuote: mockOnNewQuote,
    onContinue: mockOnContinue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("daily-quote-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByText(/Daily Quote/i)).toBeTruthy();
  });

  it("displays quote text", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("quote-text")).toBeTruthy();
  });

  it("displays the quote content", () => {
    const { getByText } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByText(/greatest glory in living/)).toBeTruthy();
  });

  it("displays author name", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("quote-author")).toBeTruthy();
  });

  it("displays author text", () => {
    const { getByText } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByText(/Nelson Mandela/)).toBeTruthy();
  });

  it("displays category badge", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("category-badge")).toBeTruthy();
  });

  it("displays category text", () => {
    const { getByText } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByText("Resilience")).toBeTruthy();
  });

  it("displays share button", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("share-button")).toBeTruthy();
  });

  it("calls onShare when share button is pressed", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    fireEvent.press(getByTestId("share-button"));
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it("displays save button", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("save-button")).toBeTruthy();
  });

  it("calls onSave when save button is pressed", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    fireEvent.press(getByTestId("save-button"));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("displays saved state when quote is saved", () => {
    const { getByTestId } = render(
      <DailyQuoteScreen {...defaultProps} isSaved={true} />
    );
    expect(getByTestId("saved-indicator")).toBeTruthy();
  });

  it("displays new quote button", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("new-quote-button")).toBeTruthy();
  });

  it("calls onNewQuote when new quote button is pressed", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    fireEvent.press(getByTestId("new-quote-button"));
    expect(mockOnNewQuote).toHaveBeenCalledTimes(1);
  });

  it("displays continue button", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinue when continue button is pressed", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("displays quote icon", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByTestId("quote-icon")).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    const container = getByTestId("daily-quote-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
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
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
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
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("share button has proper accessibility", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    const button = getByTestId("share-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Share quote");
  });

  it("save button has proper accessibility", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    const button = getByTestId("save-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Save quote");
  });

  it("continue button has proper accessibility", () => {
    const { getByTestId } = render(<DailyQuoteScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Continue");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("uses Solace branding", () => {
    const { getByText } = render(<DailyQuoteScreen {...defaultProps} />);
    expect(getByText(/Solace/)).toBeTruthy();
  });
});
