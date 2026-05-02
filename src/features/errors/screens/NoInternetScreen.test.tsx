/**
 * NoInternetScreen Tests — prototype v4.2 #41 reskin (Sprint 9 Batch B).
 */

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { NoInternetScreen } from "./NoInternetScreen";

const defaultProps = {
  onRetry: jest.fn(),
  onContinueOffline: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<NoInternetScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("NoInternetScreen", () => {
  // 1
  it("renders + matches snapshot", () => {
    expect(renderScreen().toJSON()).toMatchSnapshot();
  });

  // 2
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("no-internet-screen")).toBeTruthy();
  });

  // 3
  it("renders the [ CONNECTION ] header bracket", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("offline-header-bracket")).toBeTruthy();
  });

  // 4
  it("renders the [ NO CONNECTION ] bracket", () => {
    const { getByText } = renderScreen();
    expect(getByText(/^\[ NO CONNECTION \]/)).toBeTruthy();
  });

  // 5
  it("renders the editorial 'You're offline.' headline", () => {
    const { getByTestId } = renderScreen();
    const headline = getByTestId("offline-headline");
    expect(headline).toBeTruthy();
  });

  // 6
  it("renders the supporting subtitle copy about local sync", () => {
    const { getByText } = renderScreen();
    expect(getByText(/saved locally/)).toBeTruthy();
  });

  // 7
  it("renders the dashed wifi-off ring as decorative", () => {
    const { getByTestId } = renderScreen();
    const ring = getByTestId("offline-dashed-ring", {
      includeHiddenElements: true,
    });
    expect(ring.props.accessibilityElementsHidden).toBe(true);
  });

  // 8
  it("renders the Try again button", () => {
    const { getByTestId, getByText } = renderScreen();
    expect(getByTestId("offline-retry-button")).toBeTruthy();
    expect(getByText("Try again")).toBeTruthy();
  });

  // 9
  it("renders the Continue offline link", () => {
    const { getByTestId, getByText } = renderScreen();
    expect(getByTestId("offline-continue-link")).toBeTruthy();
    expect(getByText("Continue offline")).toBeTruthy();
  });

  // 10
  it("calls onRetry when Try again pressed", () => {
    const onRetry = jest.fn();
    const { getByTestId } = renderScreen({ onRetry });
    fireEvent.press(getByTestId("offline-retry-button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  // 11
  it("calls onContinueOffline when Continue offline pressed", () => {
    const onContinueOffline = jest.fn();
    const { getByTestId } = renderScreen({ onContinueOffline });
    fireEvent.press(getByTestId("offline-continue-link"));
    expect(onContinueOffline).toHaveBeenCalledTimes(1);
  });

  // 12
  it("renders all three offline-available chips", () => {
    const { getByTestId, getByText } = renderScreen();
    expect(getByTestId("offline-chip-journal")).toBeTruthy();
    expect(getByTestId("offline-chip-breathing")).toBeTruthy();
    expect(getByTestId("offline-chip-sounds")).toBeTruthy();
    expect(getByText("Journal")).toBeTruthy();
    expect(getByText("Breathing")).toBeTruthy();
    expect(getByText("Sounds")).toBeTruthy();
  });

  // 13
  it("renders the Still available offline glass card header", () => {
    const { getByText } = renderScreen();
    expect(getByText(/STILL AVAILABLE OFFLINE/i)).toBeTruthy();
  });

  // 14
  it("retry button meets ≥44pt minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign(
      {},
      ...[]
        .concat(getByTestId("offline-retry-button").props.style as never[])
        .filter(Boolean),
    ) as { minHeight?: number };
    expect((flat.minHeight ?? 0)).toBeGreaterThanOrEqual(44);
  });

  // 15
  it("continue link meets ≥44pt minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign(
      {},
      ...[]
        .concat(getByTestId("offline-continue-link").props.style as never[])
        .filter(Boolean),
    ) as { minHeight?: number };
    expect((flat.minHeight ?? 0)).toBeGreaterThanOrEqual(44);
  });

  // 16
  it("uses cosmic midnight-950 background, not legacy hex", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign(
      {},
      ...[]
        .concat(getByTestId("no-internet-screen").props.style as never[])
        .filter(Boolean),
    ) as { backgroundColor?: string };
    expect(flat.backgroundColor).toBe("#040818");
  });

  // 17
  it("retry button has accessibilityRole=button + label", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("offline-retry-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Try again");
  });

  // 18
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
