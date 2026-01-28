/**
 * VerificationSetupScreen Tests
 * @description Tests for verification setup with biometric and notification options
 * @task Task 3.3.7: Verification Setup Screen (Screen 21)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VerificationSetupScreen } from "./VerificationSetupScreen";

describe("VerificationSetupScreen", () => {
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
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("verification-setup-screen")).toBeTruthy();
  });

  it("displays the header with Verification Setup title", () => {
    const { getByText } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByText("Verification Setup")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the illustration container", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("illustration-container")).toBeTruthy();
  });

  it("displays the document illustration", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("document-illustration")).toBeTruthy();
  });

  it("displays the biometric verification checkbox", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("biometric-checkbox")).toBeTruthy();
  });

  it("displays the biometric verification label", () => {
    const { getByText } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByText("Biometric Verification")).toBeTruthy();
  });

  it("displays the notification checkbox", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("notification-checkbox")).toBeTruthy();
  });

  it("displays the notification label", () => {
    const { getByText } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByText("Enable Notification")).toBeTruthy();
  });

  it("biometric checkbox is checked by default", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const checkbox = getByTestId("biometric-checkbox");
    expect(checkbox.props.accessibilityState?.checked).toBe(true);
  });

  it("notification checkbox is checked by default", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const checkbox = getByTestId("notification-checkbox");
    expect(checkbox.props.accessibilityState?.checked).toBe(true);
  });

  it("toggles biometric checkbox when pressed", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const checkbox = getByTestId("biometric-checkbox");
    fireEvent.press(checkbox);
    expect(checkbox.props.accessibilityState?.checked).toBe(false);
  });

  it("toggles notification checkbox when pressed", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const checkbox = getByTestId("notification-checkbox");
    fireEvent.press(checkbox);
    expect(checkbox.props.accessibilityState?.checked).toBe(false);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue with preferences when Continue button is pressed", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
    expect(mockOnContinue).toHaveBeenCalledWith({
      biometricEnabled: true,
      notificationEnabled: true,
    });
  });

  it("passes correct preferences when biometric is unchecked", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("biometric-checkbox"));
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith({
      biometricEnabled: false,
      notificationEnabled: true,
    });
  });

  it("passes correct preferences when notification is unchecked", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("notification-checkbox"));
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith({
      biometricEnabled: true,
      notificationEnabled: false,
    });
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const container = getByTestId("verification-setup-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("biometric checkbox has proper accessibility", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const checkbox = getByTestId("biometric-checkbox");
    expect(checkbox.props.accessibilityRole).toBe("checkbox");
  });

  it("notification checkbox has proper accessibility", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const checkbox = getByTestId("notification-checkbox");
    expect(checkbox.props.accessibilityRole).toBe("checkbox");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("checkboxes have minimum touch target size", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    const biometricRow = getByTestId("biometric-checkbox");
    const styles = Array.isArray(biometricRow.props.style)
      ? biometricRow.props.style.flat()
      : [biometricRow.props.style];
    const rowStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(rowStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("displays checkmark icon when checkbox is checked", () => {
    const { getByTestId } = render(
      <VerificationSetupScreen {...defaultProps} />
    );
    expect(getByTestId("biometric-checkmark")).toBeTruthy();
    expect(getByTestId("notification-checkmark")).toBeTruthy();
  });
});
