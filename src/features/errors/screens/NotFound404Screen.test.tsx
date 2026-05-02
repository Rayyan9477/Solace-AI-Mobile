/**
 * NotFound404Screen Tests — prototype v4.2 #42 reskin (Sprint 9 Batch B).
 */

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { NotFound404Screen } from "./NotFound404Screen";

const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

const defaultProps = {
  onBack: jest.fn(),
  onBackHome: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<NotFound404Screen {...defaultProps} {...overrides} />);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
});

describe("NotFound404Screen", () => {
  // 1
  it("renders + matches snapshot", () => {
    expect(renderScreen().toJSON()).toMatchSnapshot();
  });

  // 2
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("not-found-404-screen")).toBeTruthy();
  });

  // 3
  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("not-found-back-button")).toBeTruthy();
  });

  // 4
  it("renders ghost '404' wordmark", () => {
    const { getByTestId } = renderScreen();
    const ghost = getByTestId("not-found-ghost-404", {
      includeHiddenElements: true,
    });
    expect(ghost).toBeTruthy();
    expect(ghost.props.children).toBe("404");
  });

  // 5
  it("renders aurora 'This page doesn't exist' bracket", () => {
    const { getByText } = renderScreen();
    expect(getByText(/THIS PAGE DOESN'T EXIST/i)).toBeTruthy();
  });

  // 6
  it("renders editorial 'Let's get you / back to calm.' headline", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Let's get you/)).toBeTruthy();
    expect(getByText(/back to calm/)).toBeTruthy();
  });

  // 7
  it("renders supporting copy", () => {
    const { getByText } = renderScreen();
    expect(getByText(/has moved, or perhaps/)).toBeTruthy();
  });

  // 8
  it("renders Back home button", () => {
    const { getByTestId, getByText } = renderScreen();
    expect(getByTestId("not-found-home-button")).toBeTruthy();
    expect(getByText("Back home")).toBeTruthy();
  });

  // 9
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("not-found-back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 10
  it("calls onBackHome when Back home is pressed", () => {
    const onBackHome = jest.fn();
    const { getByTestId } = renderScreen({ onBackHome });
    fireEvent.press(getByTestId("not-found-home-button"));
    expect(onBackHome).toHaveBeenCalledTimes(1);
  });

  // 11
  it("back button has accessibilityRole=button + label='Go back'", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("not-found-back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  // 12
  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign(
      {},
      ...[]
        .concat(getByTestId("not-found-back-button").props.style as never[])
        .filter(Boolean),
    ) as { width?: number; height?: number };
    expect((flat.width ?? 0)).toBeGreaterThanOrEqual(44);
    expect((flat.height ?? 0)).toBeGreaterThanOrEqual(44);
  });

  // 13
  it("home button meets ≥44pt minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign(
      {},
      ...[]
        .concat(getByTestId("not-found-home-button").props.style as never[])
        .filter(Boolean),
    ) as { minHeight?: number };
    expect((flat.minHeight ?? 0)).toBeGreaterThanOrEqual(44);
  });

  // 14
  it("uses cosmic midnight-950 background, not legacy hex", () => {
    const { getByTestId } = renderScreen();
    const flat = Object.assign(
      {},
      ...[]
        .concat(getByTestId("not-found-404-screen").props.style as never[])
        .filter(Boolean),
    ) as { backgroundColor?: string };
    expect(flat.backgroundColor).toBe("#040818");
  });

  // 15
  it("renders the BreathingOrb compass overlay", () => {
    const { getByTestId } = renderScreen();
    expect(
      getByTestId("not-found-compass", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 16
  it("renders the ambient BreathingOrb", () => {
    const { getByTestId } = renderScreen();
    expect(
      getByTestId("not-found-ambient-orb", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 17
  it("respects reduced motion (orbs still mount)", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { getByTestId } = renderScreen();
    expect(
      getByTestId("not-found-compass", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("not-found-ambient-orb", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 18
  it("does not contain any 'Dr. F' or Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/Dr\. F/)).toBeNull();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
