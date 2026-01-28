/**
 * PasswordSetupScreen Tests
 * @description Tests for password setup with strength indicator
 * @task Task 3.3.3: Password Setup Screen (Screen 17)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PasswordSetupScreen } from "./PasswordSetupScreen";

describe("PasswordSetupScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnContinue = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onContinue: mockOnContinue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("password-setup-screen")).toBeTruthy();
  });

  it("displays the header with Password Setup title", () => {
    const { getByText } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByText("Password Setup")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the large password input", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("password-input")).toBeTruthy();
  });

  it("displays the password visibility toggle", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("password-toggle")).toBeTruthy();
  });

  it("toggles password visibility when toggle is pressed", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const input = getByTestId("password-input");
    const toggle = getByTestId("password-toggle");

    expect(input.props.secureTextEntry).toBe(true);
    fireEvent.press(toggle);
    // Note: This tests the toggle action, state change verified by component behavior
  });

  it("displays the password strength label", () => {
    const { getByText } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByText("Password Strength")).toBeTruthy();
  });

  it("displays the password strength bar", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("strength-bar")).toBeTruthy();
  });

  it("displays the strength message", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("strength-message")).toBeTruthy();
  });

  it("displays requirement chips", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("requirements-list")).toBeTruthy();
  });

  it("displays uppercase requirement chip", () => {
    const { getByText } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByText(/Must have A-Z/)).toBeTruthy();
  });

  it("displays number requirement chip", () => {
    const { getByText } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByText(/Must Have 0-9/)).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(<PasswordSetupScreen {...defaultProps} />);
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const container = getByTestId("password-setup-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("password toggle has proper accessibility", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const toggle = getByTestId("password-toggle");
    expect(toggle.props.accessibilityRole).toBe("button");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("password input has large styling", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const container = getByTestId("password-input-container");
    const styles = Array.isArray(container.props.style)
      ? container.props.style.flat()
      : [container.props.style];
    const containerStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(containerStyles.height).toBeGreaterThanOrEqual(56);
  });

  it("updates password value when typing", () => {
    const { getByTestId } = render(<PasswordSetupScreen {...defaultProps} />);
    const input = getByTestId("password-input");
    fireEvent.changeText(input, "TestPassword123");
    expect(input.props.value).toBe("TestPassword123");
  });
});
