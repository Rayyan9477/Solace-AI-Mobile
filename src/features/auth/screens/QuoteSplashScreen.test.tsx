/**
 * QuoteSplashScreen Tests
 * @description Tests for inspirational quote interstitial screen
 * @task Task 3.1.3: Quote Splash Screen
 */

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { QuoteSplashScreen } from "./QuoteSplashScreen";

describe("QuoteSplashScreen", () => {
  const mockOnComplete = jest.fn();

  const defaultProps = {
    quote: "In the midst of winter, I found there was within me an invincible summer.",
    author: "Albert Camus",
    onComplete: mockOnComplete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the quote splash screen", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    expect(getByTestId("quote-splash-screen")).toBeTruthy();
  });

  it("displays the app logo", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    expect(getByTestId("quote-logo")).toBeTruthy();
  });

  it("displays the quote text", () => {
    const { getByText } = render(<QuoteSplashScreen {...defaultProps} />);
    expect(getByText(/In the midst of winter/)).toBeTruthy();
  });

  it("displays the author attribution", () => {
    const { getByText } = render(<QuoteSplashScreen {...defaultProps} />);
    expect(getByText(/ALBERT CAMUS/)).toBeTruthy();
  });

  it("has correct orange background color", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    const container = getByTestId("quote-splash-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#E8853A");
    expect(hasBackgroundColor).toBe(true);
  });

  it("calls onComplete after delay", async () => {
    render(<QuoteSplashScreen {...defaultProps} />);

    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it("uses custom delay when provided", async () => {
    render(<QuoteSplashScreen {...defaultProps} delay={5000} />);

    jest.advanceTimersByTime(4999);
    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it("displays different quotes", () => {
    const customQuote = "The only way out is through.";
    const { getByText } = render(
      <QuoteSplashScreen {...defaultProps} quote={customQuote} />
    );
    expect(getByText(/The only way out is through/)).toBeTruthy();
  });

  it("displays different authors", () => {
    const { getByText } = render(
      <QuoteSplashScreen {...defaultProps} author="Robert Frost" />
    );
    expect(getByText(/ROBERT FROST/)).toBeTruthy();
  });

  it("has proper accessibility label on quote", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    const quoteText = getByTestId("quote-text");
    expect(quoteText.props.accessibilityLabel).toBeTruthy();
  });
});
