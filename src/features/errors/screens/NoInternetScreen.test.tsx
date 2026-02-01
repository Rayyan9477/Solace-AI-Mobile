/**
 * NoInternetScreen Tests
 * @description Tests for no internet connectivity error screen
 * @task Task 3.18.2: NoInternet Screen (Screen 155)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { NoInternetScreen } from "./NoInternetScreen";

const defaultProps = {
  onBack: jest.fn(),
  onRefresh: jest.fn(),
  onGoHome: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<NoInternetScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("NoInternetScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("no-internet-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the offline illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("offline-illustration")).toBeTruthy();
  });

  it("renders 'No Internet!' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("No Internet!")).toBeTruthy();
  });

  it("renders the connectivity message", () => {
    const { getByText } = renderScreen();
    expect(getByText(/don't have active internet/)).toBeTruthy();
  });

  it("renders the refresh button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("refresh-button")).toBeTruthy();
  });

  it("renders refresh button text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Refresh or Try Again/)).toBeTruthy();
  });

  it("renders the home button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("go-home-button")).toBeTruthy();
  });

  it("renders home button text", () => {
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

  it("calls onRefresh when refresh button is pressed", () => {
    const onRefresh = jest.fn();
    const { getByTestId } = renderScreen({ onRefresh });
    fireEvent.press(getByTestId("refresh-button"));
    expect(onRefresh).toHaveBeenCalledTimes(1);
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

  it("refresh button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("refresh-button").props.style),
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
      ...[].concat(getByTestId("no-internet-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
