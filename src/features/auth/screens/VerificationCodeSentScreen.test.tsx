/**
 * VerificationCodeSentScreen Tests
 * @description Tests for verification code sent confirmation modal
 * @task Task 3.2.4: Verification Code Sent Screen (Screen 14)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { VerificationCodeSentScreen } from "./VerificationCodeSentScreen";

describe("VerificationCodeSentScreen", () => {
  const mockOnResend = jest.fn();
  const mockOnDismiss = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    maskedDestination: "****-****-***24",
    onResend: mockOnResend,
    onDismiss: mockOnDismiss,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByTestId("verification-code-sent-screen")).toBeTruthy();
  });

  it("displays the modal card", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByTestId("modal-card")).toBeTruthy();
  });

  it("displays the illustration container", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByTestId("illustration-container")).toBeTruthy();
  });

  it("displays the title with verification text", () => {
    const { getByText } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByText(/We've Sent Verification/)).toBeTruthy();
  });

  it("displays the masked destination in title", () => {
    const { getByText } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByText(/\*\*\*\*-\*\*\*\*-\*\*\*24/)).toBeTruthy();
  });

  it("displays the subtitle text", () => {
    const { getByText } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByText(/Didn't receive the link/)).toBeTruthy();
  });

  it("displays the Re-Send Password button", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByTestId("resend-button")).toBeTruthy();
  });

  it("displays the Re-Send Password button text", () => {
    const { getByText } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByText("Re-Send Password")).toBeTruthy();
  });

  it("calls onResend when Re-Send Password button is pressed", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("resend-button"));
    expect(mockOnResend).toHaveBeenCalledTimes(1);
  });

  it("displays the Send Password button (disabled)", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByTestId("send-password-button")).toBeTruthy();
  });

  it("Send Password button is disabled", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    const button = getByTestId("send-password-button");
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it("displays the dismiss button", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByTestId("dismiss-button")).toBeTruthy();
  });

  it("calls onDismiss when dismiss button is pressed", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("dismiss-button"));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("has dark overlay background", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    const overlay = getByTestId("overlay-background");
    const styles = Array.isArray(overlay.props.style)
      ? overlay.props.style
      : [overlay.props.style];
    const hasOverlayColor = styles.some(
      (s) => s?.backgroundColor === "rgba(0, 0, 0, 0.5)"
    );
    expect(hasOverlayColor).toBe(true);
  });

  it("Re-Send Password button has proper accessibility", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    const button = getByTestId("resend-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("dismiss button has proper accessibility", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    const button = getByTestId("dismiss-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Close");
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("Re-Send button has minimum touch target size", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    const button = getByTestId("resend-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("dismiss button has minimum touch target size", () => {
    const { getByTestId } = render(
      <VerificationCodeSentScreen {...defaultProps} />
    );
    const button = getByTestId("dismiss-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.width).toBeGreaterThanOrEqual(44);
    expect(buttonStyles.height).toBeGreaterThanOrEqual(44);
  });

  it("renders with custom masked destination", () => {
    const { getByText } = render(
      <VerificationCodeSentScreen
        {...defaultProps}
        maskedDestination="***@email.com"
      />
    );
    expect(getByText(/\*\*\*@email\.com/)).toBeTruthy();
  });
});
