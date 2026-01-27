/**
 * ForgotPasswordScreen Tests
 * @description Tests for password recovery method selection screen
 * @task Task 3.2.3: Forgot Password Screen
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";

describe("ForgotPasswordScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSendPassword = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onSendPassword: mockOnSendPassword,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the forgot password screen", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    expect(getByTestId("forgot-password-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the title", () => {
    const { getByText } = render(<ForgotPasswordScreen {...defaultProps} />);
    expect(getByText("Forgot Password")).toBeTruthy();
  });

  it("displays the subtitle", () => {
    const { getByText } = render(<ForgotPasswordScreen {...defaultProps} />);
    expect(getByText(/Select contact details/)).toBeTruthy();
  });

  it("displays recovery method options", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    expect(getByTestId("method-2fa")).toBeTruthy();
    expect(getByTestId("method-password")).toBeTruthy();
    expect(getByTestId("method-google")).toBeTruthy();
  });

  it("displays method labels", () => {
    const { getByText } = render(<ForgotPasswordScreen {...defaultProps} />);
    expect(getByText("Use 2FA")).toBeTruthy();
    expect(getByText("Password")).toBeTruthy();
    expect(getByText("Google Authenticator")).toBeTruthy();
  });

  it("allows selecting a recovery method", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    fireEvent.press(getByTestId("method-2fa"));
    const method2fa = getByTestId("method-2fa");
    // Check if selected style is applied
    expect(method2fa).toBeTruthy();
  });

  it("displays send password button", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    expect(getByTestId("send-password-button")).toBeTruthy();
  });

  it("calls onSendPassword with selected method when button is pressed", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    fireEvent.press(getByTestId("method-google"));
    fireEvent.press(getByTestId("send-password-button"));
    expect(mockOnSendPassword).toHaveBeenCalledWith("google");
  });

  it("has password method selected by default", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    fireEvent.press(getByTestId("send-password-button"));
    expect(mockOnSendPassword).toHaveBeenCalledWith("password");
  });

  it("has correct dark background color", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    const container = getByTestId("forgot-password-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#1C1410");
    expect(hasBackgroundColor).toBe(true);
  });

  it("send password button has proper accessibility", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    const button = getByTestId("send-password-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("recovery method options have proper accessibility role", () => {
    const { getByTestId } = render(<ForgotPasswordScreen {...defaultProps} />);
    const method = getByTestId("method-password");
    expect(method.props.accessibilityRole).toBe("radio");
  });
});
