/**
 * MaintenanceScreen Tests
 * @description Tests for maintenance downtime screen
 * @task Task 3.18.4: Maintenance Screen (Screen 157)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { MaintenanceScreen } from "./MaintenanceScreen";

const defaultProps = {
  countdownText: "Come back in 9h 12m",
  onBack: jest.fn(),
  onGoHome: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<MaintenanceScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("MaintenanceScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("maintenance-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the maintenance illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("maintenance-illustration")).toBeTruthy();
  });

  it("renders 'Maintenance' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Maintenance")).toBeTruthy();
  });

  it("renders the maintenance subtitle", () => {
    const { getByText } = renderScreen();
    expect(getByText(/undergoing maintenance/)).toBeTruthy();
  });

  it("renders the countdown badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("countdown-badge")).toBeTruthy();
  });

  it("renders countdown text from props", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Come back in 9h 12m/)).toBeTruthy();
  });

  it("renders custom countdown text", () => {
    const { getByText } = renderScreen({ countdownText: "Ending soon" });
    expect(getByText(/Ending soon/)).toBeTruthy();
  });

  it("renders 'Take Me Home' button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("go-home-button")).toBeTruthy();
  });

  it("renders 'Take Me Home' button text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Take Me Home/)).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onGoHome when home button is pressed", () => {
    const onGoHome = jest.fn();
    const { getByTestId } = renderScreen({ onGoHome });
    fireEvent.press(getByTestId("go-home-button"));
    expect(onGoHome).toHaveBeenCalledTimes(1);
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

  it("home button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("go-home-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("maintenance-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
