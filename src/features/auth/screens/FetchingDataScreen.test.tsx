/**
 * FetchingDataScreen Tests
 * @description Tests for data fetching screen with shake hint
 * @task Task 3.1.4: Fetching Data Screen
 */

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { FetchingDataScreen } from "./FetchingDataScreen";

describe("FetchingDataScreen", () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the fetching data screen", () => {
    const { getByTestId } = render(<FetchingDataScreen onComplete={mockOnComplete} />);
    expect(getByTestId("fetching-data-screen")).toBeTruthy();
  });

  it("displays the fetching data text", () => {
    const { getByText } = render(<FetchingDataScreen onComplete={mockOnComplete} />);
    expect(getByText("Fetching Data...")).toBeTruthy();
  });

  it("displays the shake hint", () => {
    const { getByText } = render(<FetchingDataScreen onComplete={mockOnComplete} />);
    expect(getByText(/Shake screen to interact/)).toBeTruthy();
  });

  it("renders decorative circles", () => {
    const { getByTestId } = render(<FetchingDataScreen onComplete={mockOnComplete} />);
    expect(getByTestId("decorative-circles")).toBeTruthy();
  });

  it("has correct green background color", () => {
    const { getByTestId } = render(<FetchingDataScreen onComplete={mockOnComplete} />);
    const container = getByTestId("fetching-data-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#9AAD5C");
    expect(hasBackgroundColor).toBe(true);
  });

  it("calls onComplete after delay", async () => {
    render(<FetchingDataScreen onComplete={mockOnComplete} />);

    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it("uses custom delay when provided", async () => {
    render(<FetchingDataScreen onComplete={mockOnComplete} delay={4000} />);

    jest.advanceTimersByTime(3999);
    expect(mockOnComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
  });

  it("displays shake icon", () => {
    const { getByTestId } = render(<FetchingDataScreen onComplete={mockOnComplete} />);
    expect(getByTestId("shake-icon")).toBeTruthy();
  });

  it("has proper accessibility", () => {
    const { getByTestId } = render(<FetchingDataScreen onComplete={mockOnComplete} />);
    const screen = getByTestId("fetching-data-screen");
    expect(screen.props.accessibilityLabel).toBeTruthy();
  });
});
