/**
 * InternalError500Screen Tests
 * @description Tests for 500 internal server error screen
 * @task Task 3.18.3: InternalError500 Screen (Screen 156)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { InternalError500Screen } from "./InternalError500Screen";

const defaultProps = {
  onBack: jest.fn(),
  onGoHome: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<InternalError500Screen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("InternalError500Screen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("internal-error-500-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the server error illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("server-error-illustration")).toBeTruthy();
  });

  it("renders 'Internal Error' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Internal Error")).toBeTruthy();
  });

  it("renders the error subtitle", () => {
    const { getByText } = renderScreen();
    expect(getByText(/server seems to have encountered an error/)).toBeTruthy();
  });

  it("renders the status badge with 500", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Status Code: 500/)).toBeTruthy();
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
      ...[].concat(getByTestId("internal-error-500-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Audit Fix ──────────────────────────────────────────
  it("uses corrected grammar (not 'seems to error')", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/seems to error/)).toBeNull();
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
