/**
 * OTPSetupScreen Tests
 * @description Tests for phone number entry for OTP verification
 * @task Task 3.3.4: OTP Setup Screen (Screen 18)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { OTPSetupScreen } from "./OTPSetupScreen";

describe("OTPSetupScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSendOTP = jest.fn();
  const mockOnCountryPress = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onSendOTP: mockOnSendOTP,
    onCountryPress: mockOnCountryPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("otp-setup-screen")).toBeTruthy();
  });

  it("displays the header with OTP Setup title", () => {
    const { getByText } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByText("OTP Setup")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the illustration", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("illustration")).toBeTruthy();
  });

  it("displays the OTP Verification title", () => {
    const { getByText } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByText("OTP Verification")).toBeTruthy();
  });

  it("displays the subtitle about SMS", () => {
    const { getByText } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByText(/We will send a one time SMS message/)).toBeTruthy();
  });

  it("displays the phone number input container", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("phone-input-container")).toBeTruthy();
  });

  it("displays the country selector", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("country-selector")).toBeTruthy();
  });

  it("calls onCountryPress when country selector is pressed", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    fireEvent.press(getByTestId("country-selector"));
    expect(mockOnCountryPress).toHaveBeenCalledTimes(1);
  });

  it("displays the phone number input", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("phone-input")).toBeTruthy();
  });

  it("displays the copy button", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("copy-button")).toBeTruthy();
  });

  it("displays the Send OTP button", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("send-otp-button")).toBeTruthy();
  });

  it("displays the Send OTP button text", () => {
    const { getByText } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByText(/Send OTP/)).toBeTruthy();
  });

  it("calls onSendOTP when Send OTP button is pressed", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    fireEvent.press(getByTestId("send-otp-button"));
    expect(mockOnSendOTP).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    const container = getByTestId("otp-setup-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("Send OTP button has proper accessibility", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    const button = getByTestId("send-otp-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Send OTP button has minimum touch target size", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    const button = getByTestId("send-otp-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("displays country flag", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("country-flag")).toBeTruthy();
  });

  it("displays dropdown chevron in country selector", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    expect(getByTestId("country-chevron")).toBeTruthy();
  });

  it("updates phone number when typing", () => {
    const { getByTestId } = render(<OTPSetupScreen {...defaultProps} />);
    const input = getByTestId("phone-input");
    fireEvent.changeText(input, "2345678900");
    expect(input.props.value).toContain("234");
  });
});
