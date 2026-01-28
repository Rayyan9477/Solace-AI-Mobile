/**
 * OTPEntryScreen Tests
 * @description Tests for 4-digit OTP code entry
 * @task Task 3.3.5: OTP Entry Screen (Screen 19)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { OTPEntryScreen } from "./OTPEntryScreen";

describe("OTPEntryScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnContinue = jest.fn();
  const mockOnResend = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onContinue: mockOnContinue,
    onResend: mockOnResend,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByTestId("otp-entry-screen")).toBeTruthy();
  });

  it("displays the header with OTP Setup title", () => {
    const { getByText } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByText("OTP Setup")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the title", () => {
    const { getByText } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByText(/Enter 4 digit OTP Code/)).toBeTruthy();
  });

  it("displays the subtitle", () => {
    const { getByText } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByText(/Scan your biometric fingerprint/)).toBeTruthy();
  });

  it("displays the OTP input container", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByTestId("otp-input-container")).toBeTruthy();
  });

  it("displays 4 digit boxes", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByTestId("digit-box-0")).toBeTruthy();
    expect(getByTestId("digit-box-1")).toBeTruthy();
    expect(getByTestId("digit-box-2")).toBeTruthy();
    expect(getByTestId("digit-box-3")).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("displays the resend link", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByTestId("resend-link")).toBeTruthy();
  });

  it("displays resend link text", () => {
    const { getByText } = render(<OTPEntryScreen {...defaultProps} />);
    expect(getByText(/Didn't receive the OTP/)).toBeTruthy();
  });

  it("calls onResend when resend link is pressed", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("resend-link"));
    expect(mockOnResend).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    const container = getByTestId("otp-entry-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("shows error chip when error prop is provided", () => {
    const { getByTestId } = render(
      <OTPEntryScreen {...defaultProps} error="Invalid OTP! Try Again!" />
    );
    expect(getByTestId("error-chip")).toBeTruthy();
  });

  it("displays error message text", () => {
    const { getByText } = render(
      <OTPEntryScreen {...defaultProps} error="Invalid OTP! Try Again!" />
    );
    expect(getByText(/Invalid OTP/)).toBeTruthy();
  });

  it("digit boxes have proper size", () => {
    const { getByTestId } = render(<OTPEntryScreen {...defaultProps} />);
    const digitBox = getByTestId("digit-box-0");
    const styles = Array.isArray(digitBox.props.style)
      ? digitBox.props.style.flat()
      : [digitBox.props.style];
    const boxStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(boxStyles.width).toBeGreaterThanOrEqual(56);
    expect(boxStyles.height).toBeGreaterThanOrEqual(56);
  });
});
