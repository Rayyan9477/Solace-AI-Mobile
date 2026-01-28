/**
 * FingerprintSetupScreen Tests
 * @description Tests for biometric fingerprint setup
 * @task Task 3.3.6: Fingerprint Setup Screen (Screen 20)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FingerprintSetupScreen } from "./FingerprintSetupScreen";

describe("FingerprintSetupScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnContinue = jest.fn();
  const mockOnSkip = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onContinue: mockOnContinue,
    onSkip: mockOnSkip,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("fingerprint-setup-screen")).toBeTruthy();
  });

  it("displays the header with Fingerprint Setup title", () => {
    const { getAllByText } = render(<FingerprintSetupScreen {...defaultProps} />);
    const titles = getAllByText("Fingerprint Setup");
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the scanner container", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("scanner-container")).toBeTruthy();
  });

  it("displays the scanner frame with corner brackets", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("scanner-frame")).toBeTruthy();
  });

  it("displays the fingerprint icon", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("fingerprint-icon")).toBeTruthy();
  });

  it("displays the scan line", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("scan-line")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getAllByText } = render(<FingerprintSetupScreen {...defaultProps} />);
    const titles = getAllByText("Fingerprint Setup");
    expect(titles.length).toBeGreaterThan(0);
  });

  it("displays the subtitle with key emoji", () => {
    const { getByText } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByText(/Scan your biometric fingerprint/)).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    const container = getByTestId("fingerprint-setup-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("displays corner brackets", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    expect(getByTestId("corner-top-left")).toBeTruthy();
    expect(getByTestId("corner-top-right")).toBeTruthy();
    expect(getByTestId("corner-bottom-left")).toBeTruthy();
    expect(getByTestId("corner-bottom-right")).toBeTruthy();
  });

  it("scan line has proper color", () => {
    const { getByTestId } = render(<FingerprintSetupScreen {...defaultProps} />);
    const scanLine = getByTestId("scan-line");
    const styles = Array.isArray(scanLine.props.style)
      ? scanLine.props.style.flat()
      : [scanLine.props.style];
    const lineStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(lineStyles.backgroundColor).toBe("#9AAD5C");
  });
});
