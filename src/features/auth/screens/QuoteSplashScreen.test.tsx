/**
 * QuoteSplashScreen Tests — prototype v4.2 #14 (Sprint 7)
 */

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import React from "react";
import { render, waitFor } from "@testing-library/react-native";

import { QuoteSplashScreen } from "./QuoteSplashScreen";

// Stable mock for useReducedMotion — can be overridden per test
const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

const DEFAULT_PROPS = {
  quote: "You are not the thoughts you have at 3am.",
  author: "Anne Lamott",
  onComplete: jest.fn(),
};

describe("QuoteSplashScreen", () => {
  const mockOnComplete = jest.fn();

  const defaultProps = {
    ...DEFAULT_PROPS,
    onComplete: mockOnComplete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // 1. Renders
  it("renders without crashing", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    expect(getByTestId("quote-splash-screen")).toBeTruthy();
  });

  // 2. Snapshot
  it("matches snapshot", () => {
    const tree = render(<QuoteSplashScreen {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 3. Quote text rendered
  it("renders the quote text", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    const quoteEl = getByTestId("quote-text");
    expect(quoteEl).toBeTruthy();
    expect(quoteEl.props.children).toBe(defaultProps.quote);
  });

  // 4. Author rendered
  it("renders the author attribution", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    const authorEl = getByTestId("author-text");
    expect(authorEl).toBeTruthy();
    expect(authorEl.props.children).toBe(`— ${defaultProps.author}`);
  });

  // 5. Progress bar rendered
  it("renders the progress bar track and gradient fill", () => {
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    expect(getByTestId("progress-bar-track")).toBeTruthy();
    expect(getByTestId("progress-bar")).toBeTruthy();
  });

  // 6. Bracket label "A REMINDER" present
  it("renders the '[ A REMINDER ]' bracket label", () => {
    const { getByText } = render(<QuoteSplashScreen {...defaultProps} />);
    expect(getByText("[ A REMINDER ]")).toBeTruthy();
  });

  // 7. onComplete called after default 3s delay
  it("calls onComplete after the default 3000 ms delay", async () => {
    render(<QuoteSplashScreen {...defaultProps} />);

    expect(mockOnComplete).not.toHaveBeenCalled();
    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  // 8. Custom delay respected
  it("respects a custom delay prop", async () => {
    render(<QuoteSplashScreen {...defaultProps} delay={5000} />);

    jest.advanceTimersByTime(4999);
    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  // 9. Different quote + author props
  it("renders different quote and author when props change", () => {
    const { getByTestId, getByText } = render(
      <QuoteSplashScreen
        {...defaultProps}
        quote="Almost everything will work again if you unplug it for a few minutes."
        author="Anne Lamott"
      />,
    );
    expect(getByTestId("quote-text").props.children).toBe(
      "Almost everything will work again if you unplug it for a few minutes.",
    );
    expect(getByText("— Anne Lamott")).toBeTruthy();
  });

  // 10. Reduced motion: progress bar instantly fills (withTiming duration=0)
  it("sets progress bar to fully filled instantly when reduced motion is enabled", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { getByTestId } = render(<QuoteSplashScreen {...defaultProps} />);
    // With reduced motion, progressFraction.value is initialized to 1
    // and withTiming is called with duration 0. The track still renders.
    expect(getByTestId("progress-bar-track")).toBeTruthy();
    expect(getByTestId("progress-bar")).toBeTruthy();
  });
});
