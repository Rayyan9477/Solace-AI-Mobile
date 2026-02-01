/**
 * NotFound404Screen Tests
 * @description Tests for 404 not found error screen
 * @task Task 3.18.1: NotFound404 Screen (Screen 154)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { NotFound404Screen } from "./NotFound404Screen";

const defaultProps = {
  onBack: jest.fn(),
  onGoHome: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<NotFound404Screen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("NotFound404Screen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("not-found-404-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the lost illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("lost-illustration")).toBeTruthy();
  });

  it("renders 'Not Found' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Not Found")).toBeTruthy();
  });

  it("renders the error subtitle", () => {
    const { getByText } = renderScreen();
    expect(getByText(/can't find this page/)).toBeTruthy();
  });

  it("renders the status badge with 404", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Status Code: 404/)).toBeTruthy();
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
      ...[].concat(getByTestId("not-found-404-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("uses 'Solace' not 'Dr. F' in subtitle", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Solace/)).toBeTruthy();
  });

  it("does not contain 'Dr. F' branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/Dr\. F/)).toBeNull();
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
