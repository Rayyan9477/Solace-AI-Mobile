/**
 * LoadingProgressScreen Tests
 * @description Tests for loading progress screen with percentage display
 * @task Task 3.1.2: Loading Progress Screen
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { LoadingProgressScreen } from "./LoadingProgressScreen";

describe("LoadingProgressScreen", () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the loading progress screen", () => {
    const { getByTestId } = render(<LoadingProgressScreen progress={50} onComplete={mockOnComplete} />);
    expect(getByTestId("loading-progress-screen")).toBeTruthy();
  });

  it("displays the progress percentage", () => {
    const { getByText } = render(<LoadingProgressScreen progress={75} onComplete={mockOnComplete} />);
    expect(getByText("75%")).toBeTruthy();
  });

  it("displays 0% when progress is 0", () => {
    const { getByText } = render(<LoadingProgressScreen progress={0} onComplete={mockOnComplete} />);
    expect(getByText("0%")).toBeTruthy();
  });

  it("displays 100% when progress is 100", () => {
    const { getByText } = render(<LoadingProgressScreen progress={100} onComplete={mockOnComplete} />);
    expect(getByText("100%")).toBeTruthy();
  });

  it("renders decorative circles", () => {
    const { getByTestId } = render(<LoadingProgressScreen progress={50} onComplete={mockOnComplete} />);
    expect(getByTestId("decorative-circles")).toBeTruthy();
  });

  it("has correct dark background color", () => {
    const { getByTestId } = render(<LoadingProgressScreen progress={50} onComplete={mockOnComplete} />);
    const container = getByTestId("loading-progress-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#1C1410");
    expect(hasBackgroundColor).toBe(true);
  });

  it("calls onComplete when progress reaches 100", () => {
    const { rerender } = render(<LoadingProgressScreen progress={99} onComplete={mockOnComplete} />);
    expect(mockOnComplete).not.toHaveBeenCalled();

    rerender(<LoadingProgressScreen progress={100} onComplete={mockOnComplete} />);
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it("does not call onComplete when progress is below 100", () => {
    render(<LoadingProgressScreen progress={50} onComplete={mockOnComplete} />);
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it("centers the progress text", () => {
    const { getByTestId } = render(<LoadingProgressScreen progress={50} onComplete={mockOnComplete} />);
    const container = getByTestId("loading-progress-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style.flat() : [container.props.style];
    const alignmentStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});

    expect(alignmentStyles.justifyContent).toBe("center");
    expect(alignmentStyles.alignItems).toBe("center");
  });

  it("handles progress values outside 0-100 range", () => {
    const { getByText: getText1 } = render(<LoadingProgressScreen progress={-10} onComplete={mockOnComplete} />);
    expect(getText1("0%")).toBeTruthy();

    const { getByText: getText2 } = render(<LoadingProgressScreen progress={150} onComplete={mockOnComplete} />);
    expect(getText2("100%")).toBeTruthy();
  });
});
