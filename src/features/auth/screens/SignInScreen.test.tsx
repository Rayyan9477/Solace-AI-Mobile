/**
 * SignInScreen Tests
 * @description Tests for user authentication screen
 * @task Task 3.2.1: Sign In Screen
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SignInScreen } from "./SignInScreen";

describe("SignInScreen", () => {
  const mockOnSignIn = jest.fn();
  const mockOnSignUp = jest.fn();
  const mockOnForgotPassword = jest.fn();
  const mockOnSocialLogin = jest.fn();

  const defaultProps = {
    onSignIn: mockOnSignIn,
    onSignUp: mockOnSignUp,
    onForgotPassword: mockOnForgotPassword,
    onSocialLogin: mockOnSocialLogin,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sign in screen", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    expect(getByTestId("sign-in-screen")).toBeTruthy();
  });

  it("displays the app logo", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    expect(getByTestId("sign-in-logo")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getByText } = render(<SignInScreen {...defaultProps} />);
    expect(getByText(/Sign In To freud\.ai/)).toBeTruthy();
  });

  it("displays email input field", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    expect(getByTestId("email-input")).toBeTruthy();
  });

  it("displays password input field", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    expect(getByTestId("password-input")).toBeTruthy();
  });

  it("displays sign in button", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    expect(getByTestId("sign-in-button")).toBeTruthy();
  });

  it("allows entering email", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    const emailInput = getByTestId("email-input");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("allows entering password", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(passwordInput, "password123");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("calls onSignIn with credentials when sign in button is pressed", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);

    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");
    fireEvent.press(getByTestId("sign-in-button"));

    expect(mockOnSignIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("displays social login buttons", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    expect(getByTestId("facebook-login")).toBeTruthy();
    expect(getByTestId("google-login")).toBeTruthy();
    expect(getByTestId("instagram-login")).toBeTruthy();
  });

  it("calls onSocialLogin when social button is pressed", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    fireEvent.press(getByTestId("google-login"));
    expect(mockOnSocialLogin).toHaveBeenCalledWith("google");
  });

  it("displays sign up link", () => {
    const { getByText } = render(<SignInScreen {...defaultProps} />);
    expect(getByText(/Sign Up/)).toBeTruthy();
  });

  it("calls onSignUp when sign up link is pressed", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    fireEvent.press(getByTestId("sign-up-link"));
    expect(mockOnSignUp).toHaveBeenCalledTimes(1);
  });

  it("displays forgot password link", () => {
    const { getByText } = render(<SignInScreen {...defaultProps} />);
    expect(getByText(/Forgot Password/)).toBeTruthy();
  });

  it("calls onForgotPassword when forgot password link is pressed", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    fireEvent.press(getByTestId("forgot-password-link"));
    expect(mockOnForgotPassword).toHaveBeenCalledTimes(1);
  });

  it("has correct dark background color", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    const container = getByTestId("sign-in-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#1C1410");
    expect(hasBackgroundColor).toBe(true);
  });

  it("password input is secure by default", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    const passwordInput = getByTestId("password-input");
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it("can toggle password visibility", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    const toggleButton = getByTestId("password-toggle");
    fireEvent.press(toggleButton);
    const passwordInput = getByTestId("password-input");
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it("sign in button has proper accessibility", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    const button = getByTestId("sign-in-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("email input has proper accessibility label", () => {
    const { getByTestId } = render(<SignInScreen {...defaultProps} />);
    const input = getByTestId("email-input");
    expect(input.props.accessibilityLabel).toBe("Email Address");
  });
});
