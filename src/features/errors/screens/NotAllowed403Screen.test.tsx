/**
 * NotAllowed403Screen Tests
 * @description Tests for 403 permission denied error screen
 * @task Task 3.18.5: NotAllowed403 Screen (Screen 158)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { NotAllowed403Screen } from "./NotAllowed403Screen";

const defaultProps = {
  onBack: jest.fn(),
  onContactAdmin: jest.fn(),
  onGoHome: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<NotAllowed403Screen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("NotAllowed403Screen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("not-allowed-403-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the forbidden illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("forbidden-illustration")).toBeTruthy();
  });

  it("renders 'Not Allowed' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Not Allowed")).toBeTruthy();
  });

  it("renders the permission message", () => {
    const { getByText } = renderScreen();
    expect(getByText(/don't have permission/)).toBeTruthy();
  });

  it("renders 'Contact Admin' button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("contact-admin-button")).toBeTruthy();
  });

  it("renders 'Contact Admin' button text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Contact Admin/)).toBeTruthy();
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

  it("calls onContactAdmin when contact button is pressed", () => {
    const onContactAdmin = jest.fn();
    const { getByTestId } = renderScreen({ onContactAdmin });
    fireEvent.press(getByTestId("contact-admin-button"));
    expect(onContactAdmin).toHaveBeenCalledTimes(1);
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

  it("contact admin button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("contact-admin-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
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
      ...[].concat(getByTestId("not-allowed-403-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
