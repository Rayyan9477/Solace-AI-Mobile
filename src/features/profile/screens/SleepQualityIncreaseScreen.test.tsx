/**
 * SleepQualityIncreaseScreen Tests
 * @description Tests for the full-screen sleep quality increase notification
 * @task Task 3.17.1: Sleep Quality Increase Screen (Screen 140)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { SleepQualityIncreaseScreen } from "./SleepQualityIncreaseScreen";

const defaultProps = {
  duration: "7h 50m",
  percentageChange: 18,
  comparisonPeriod: "last month",
  onBack: jest.fn(),
  onSeeSleepQuality: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <SleepQualityIncreaseScreen {...defaultProps} {...overrides} />,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("SleepQualityIncreaseScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sleep-quality-increase-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the sleep illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sleep-illustration")).toBeTruthy();
  });

  it("renders the duration display", () => {
    const { getByText } = renderScreen();
    expect(getByText("7h 50m")).toBeTruthy();
  });

  it("renders 'Sleep Quality Increased!' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Sleep Quality Increased!")).toBeTruthy();
  });

  it("renders the comparison message with percentage", () => {
    const { getByText } = renderScreen();
    expect(getByText(/18% better/)).toBeTruthy();
  });

  it("renders the comparison period", () => {
    const { getByText } = renderScreen();
    expect(getByText(/last month/)).toBeTruthy();
  });

  it("renders the 'See Sleep Quality' action button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-sleep-quality-button")).toBeTruthy();
  });

  // ── Dynamic Props ──────────────────────────────────────
  it("displays the provided duration", () => {
    const { getByText } = renderScreen({ duration: "8h 15m" });
    expect(getByText("8h 15m")).toBeTruthy();
  });

  it("displays the provided percentage change", () => {
    const { getByText } = renderScreen({ percentageChange: 25 });
    expect(getByText(/25% better/)).toBeTruthy();
  });

  it("displays the provided comparison period", () => {
    const { getByText } = renderScreen({ comparisonPeriod: "last week" });
    expect(getByText(/last week/)).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSeeSleepQuality when action button is pressed", () => {
    const onSeeSleepQuality = jest.fn();
    const { getByTestId } = renderScreen({ onSeeSleepQuality });
    fireEvent.press(getByTestId("see-sleep-quality-button"));
    expect(onSeeSleepQuality).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("action button has accessibilityLabel 'See Sleep Quality'", () => {
    const { getByTestId } = renderScreen();
    expect(
      getByTestId("see-sleep-quality-button").props.accessibilityLabel,
    ).toBe("See Sleep Quality");
  });

  it("action button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(
      getByTestId("see-sleep-quality-button").props.accessibilityRole,
    ).toBe("button");
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

  it("action button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("see-sleep-quality-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("sleep-quality-increase-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
