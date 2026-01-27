/**
 * SignUpScreen Tests
 * @description Tests for new user registration screen
 * @task Task 3.2.2: Sign Up Screen
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SignUpScreen } from "./SignUpScreen";

describe("SignUpScreen", () => {
  const mockOnSignUp = jest.fn();
  const mockOnSignIn = jest.fn();

  const defaultProps = {
    onSignUp: mockOnSignUp,
    onSignIn: mockOnSignIn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sign up screen", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    expect(getByTestId("sign-up-screen")).toBeTruthy();
  });

  it("displays the app logo", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    expect(getByTestId("sign-up-logo")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getByText } = render(<SignUpScreen {...defaultProps} />);
    expect(getByText(/Sign Up For Free/)).toBeTruthy();
  });

  it("displays email input field", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    expect(getByTestId("email-input")).toBeTruthy();
  });

  it("displays password input field", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    expect(getByTestId("password-input")).toBeTruthy();
  });

  it("displays password confirmation input field", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    expect(getByTestId("confirm-password-input")).toBeTruthy();
  });

  it("displays sign up button", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    expect(getByTestId("sign-up-button")).toBeTruthy();
  });

  it("allows entering email", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    const emailInput = getByTestId("email-input");
    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });

  it("allows entering password", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    const passwordInput = getByTestId("password-input");
    fireEvent.changeText(passwordInput, "password123");
    expect(passwordInput.props.value).toBe("password123");
  });

  it("allows entering password confirmation", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    const confirmInput = getByTestId("confirm-password-input");
    fireEvent.changeText(confirmInput, "password123");
    expect(confirmInput.props.value).toBe("password123");
  });

  it("calls onSignUp with credentials when sign up button is pressed", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);

    fireEvent.changeText(getByTestId("email-input"), "test@example.com");
    fireEvent.changeText(getByTestId("password-input"), "password123");
    fireEvent.changeText(getByTestId("confirm-password-input"), "password123");
    fireEvent.press(getByTestId("sign-up-button"));

    expect(mockOnSignUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
  });

  it("displays sign in link", () => {
    const { getByText } = render(<SignUpScreen {...defaultProps} />);
    expect(getByText(/Sign In/)).toBeTruthy();
  });

  it("calls onSignIn when sign in link is pressed", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    fireEvent.press(getByTestId("sign-in-link"));
    expect(mockOnSignIn).toHaveBeenCalledTimes(1);
  });

  it("has correct dark background color", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    const container = getByTestId("sign-up-screen");
    const styles = Array.isArray(container.props.style) ? container.props.style : [container.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#1C1410");
    expect(hasBackgroundColor).toBe(true);
  });

  it("password inputs are secure by default", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    expect(getByTestId("password-input").props.secureTextEntry).toBe(true);
    expect(getByTestId("confirm-password-input").props.secureTextEntry).toBe(true);
  });

  it("can show validation error for email", () => {
    const { getByTestId, getByText } = render(<SignUpScreen {...defaultProps} />);
    fireEvent.changeText(getByTestId("email-input"), "invalid-email");
    fireEvent.press(getByTestId("sign-up-button"));
    expect(getByText(/Invalid Email Address/)).toBeTruthy();
  });

  it("sign up button has proper accessibility", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    const button = getByTestId("sign-up-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("email input has proper accessibility label", () => {
    const { getByTestId } = render(<SignUpScreen {...defaultProps} />);
    const input = getByTestId("email-input");
    expect(input.props.accessibilityLabel).toBe("Email Address");
  });
});
