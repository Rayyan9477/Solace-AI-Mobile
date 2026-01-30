/**
 * SplashScreen Tests
 * @description Tests for app launch splash screen
 * @task Task 3.1.1: Splash Screen
 */

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { SplashScreen } from "./SplashScreen";

describe("SplashScreen", () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the splash screen", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByTestId("splash-screen")).toBeTruthy();
  });

  it("displays the app logo", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByTestId("app-logo")).toBeTruthy();
  });

  it("displays the brand text", () => {
    const { getByText } = render(<SplashScreen onComplete={mockOnComplete} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("has correct background color", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    const container = getByTestId("splash-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#1C1410");
    expect(hasBackgroundColor).toBe(true);
  });

  it("calls onComplete after delay", async () => {
    render(<SplashScreen onComplete={mockOnComplete} />);

    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it("renders with proper accessibility", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    const logo = getByTestId("app-logo");
    expect(logo.props.accessibilityLabel).toBeTruthy();
  });

  it("has proper content alignment", () => {
    const { getByTestId } = render(<SplashScreen onComplete={mockOnComplete} />);
    const container = getByTestId("splash-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style.flat() : [container.props.style];
    const alignmentStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});

    expect(alignmentStyles.justifyContent).toBe("center");
    expect(alignmentStyles.alignItems).toBe("center");
  });

  it("does not call onComplete immediately", () => {
    render(<SplashScreen onComplete={mockOnComplete} />);
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it("handles custom delay prop", async () => {
    render(<SplashScreen onComplete={mockOnComplete} delay={1000} />);

    jest.advanceTimersByTime(999);
    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });
});
