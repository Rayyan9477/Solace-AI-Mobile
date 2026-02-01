/**
 * SecuritySettingsScreen Tests
 * @description Tests for security settings with 2FA, authenticator, Face ID, biometric toggles
 * @task Task 3.17.6: Security Settings Screen (Screen 145)
 * @audit-fix "by by visiting" → "by visiting" (Issue #37)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { SecuritySettingsScreen } from "./SecuritySettingsScreen";

const defaultProps = {
  options: [
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description:
        "Add an extra layer of security to your account by requiring a verification code.",
      enabled: true,
    },
    {
      id: "authenticator",
      title: "Google Authenticator",
      description:
        "Use Google Authenticator app to generate verification codes.",
      enabled: true,
    },
    {
      id: "face-id",
      title: "Face ID",
      description: "Use Face ID to unlock your account on your iPhone or iPad.",
      enabled: true,
    },
    {
      id: "biometric",
      title: "Biometric Unlock",
      description:
        "Enable biometric authentication by visiting your device settings.",
      enabled: true,
    },
  ],
  onBack: jest.fn(),
  onToggle: jest.fn(),
  onSave: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<SecuritySettingsScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("SecuritySettingsScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("security-settings-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Security Settings' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Security Settings")).toBeTruthy();
  });

  it("renders all security option titles", () => {
    const { getByText } = renderScreen();
    expect(getByText("Two-Factor Authentication")).toBeTruthy();
    expect(getByText("Google Authenticator")).toBeTruthy();
    expect(getByText("Face ID")).toBeTruthy();
    expect(getByText("Biometric Unlock")).toBeTruthy();
  });

  it("renders option descriptions", () => {
    const { getByText } = renderScreen();
    expect(getByText(/extra layer of security/)).toBeTruthy();
    expect(getByText(/Google Authenticator app/)).toBeTruthy();
  });

  it("renders toggle controls for each option", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("toggle-2fa")).toBeTruthy();
    expect(getByTestId("toggle-authenticator")).toBeTruthy();
    expect(getByTestId("toggle-face-id")).toBeTruthy();
    expect(getByTestId("toggle-biometric")).toBeTruthy();
  });

  it("renders save button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("save-button")).toBeTruthy();
  });

  it("renders save button text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Save Settings/)).toBeTruthy();
  });

  // ── Audit Fix ──────────────────────────────────────────
  it("uses 'by visiting' not 'by by visiting' in biometric description", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/by by visiting/)).toBeNull();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle when a toggle is pressed", () => {
    const onToggle = jest.fn();
    const { getByTestId } = renderScreen({ onToggle });
    fireEvent.press(getByTestId("toggle-2fa"));
    expect(onToggle).toHaveBeenCalledWith("2fa", false);
  });

  it("calls onSave when save button is pressed", () => {
    const onSave = jest.fn();
    const { getByTestId } = renderScreen({ onSave });
    fireEvent.press(getByTestId("save-button"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("save button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("save-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("security-settings-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
