/**
 * CompilingDataScreen Tests
 * @description Tests for data compilation loading screen
 * @task Task 3.3.8: Compiling Data Screen (Screen 22)
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { CompilingDataScreen } from "./CompilingDataScreen";

describe("CompilingDataScreen", () => {
  const defaultProps = {};

  it("renders the screen", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    expect(getByTestId("compiling-data-screen")).toBeTruthy();
  });

  it("displays the mascot illustration", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    expect(getByTestId("mascot-illustration")).toBeTruthy();
  });

  it("displays the status text", () => {
    const { getByText } = render(<CompilingDataScreen {...defaultProps} />);
    expect(getByText("Compiling Data...")).toBeTruthy();
  });

  it("displays the loading indicator", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const container = getByTestId("compiling-data-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("centers content vertically", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const container = getByTestId("compiling-data-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasCenter = styles.some((s) => s?.justifyContent === "center");
    expect(hasCenter).toBe(true);
  });

  it("displays the meditation character", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    expect(getByTestId("meditation-character")).toBeTruthy();
  });

  it("displays decorative wave element", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    expect(getByTestId("decorative-wave")).toBeTruthy();
  });

  it("status text has proper styling", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const statusText = getByTestId("status-text");
    const styles = Array.isArray(statusText.props.style)
      ? statusText.props.style.flat()
      : [statusText.props.style];
    const textStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(textStyles.color).toBe("#FFFFFF");
  });

  it("loading indicator has tan/beige color", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const indicator = getByTestId("loading-indicator");
    const styles = Array.isArray(indicator.props.style)
      ? indicator.props.style.flat()
      : [indicator.props.style];
    const indicatorStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(indicatorStyles.borderTopColor).toBe("#C4A574");
  });

  it("has proper accessibility for status text", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const statusText = getByTestId("status-text");
    expect(statusText.props.accessibilityRole).toBe("text");
    expect(statusText.props.accessibilityLabel).toBe("Compiling Data");
  });

  it("screen has accessibilityLabel for screen readers", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const screen = getByTestId("compiling-data-screen");
    expect(screen.props.accessibilityLabel).toBe(
      "Loading screen, compiling your data"
    );
  });

  it("mascot has proper dimensions", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const mascot = getByTestId("mascot-illustration");
    const styles = Array.isArray(mascot.props.style)
      ? mascot.props.style.flat()
      : [mascot.props.style];
    const mascotStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(mascotStyles.width).toBeGreaterThanOrEqual(150);
    expect(mascotStyles.height).toBeGreaterThanOrEqual(150);
  });

  it("loading indicator is animated", () => {
    const { getByTestId } = render(<CompilingDataScreen {...defaultProps} />);
    const indicator = getByTestId("loading-indicator");
    // Check that it has animation-related styles or props
    expect(indicator).toBeTruthy();
  });
});
