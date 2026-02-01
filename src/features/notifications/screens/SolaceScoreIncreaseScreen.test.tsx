/**
 * SolaceScoreIncreaseScreen Tests
 * @description Tests for the full-screen score increase notification
 * @task Task 3.16.2: Solace Score Increase Screen (Screen 135)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceScoreIncreaseScreen } from "./SolaceScoreIncreaseScreen";

const defaultProps = {
  scoreChange: 8,
  percentageChange: 26,
  currentScore: 88.2,
  comparisonPeriod: "last month",
  onBack: jest.fn(),
  onSeeScore: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <SolaceScoreIncreaseScreen {...defaultProps} {...overrides} />,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("SolaceScoreIncreaseScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("solace-score-increase-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("score-illustration")).toBeTruthy();
  });

  it("renders the score change display", () => {
    const { getByText } = renderScreen();
    expect(getByText("+8")).toBeTruthy();
  });

  it("renders 'Solace Score Increased' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Solace Score Increased")).toBeTruthy();
  });

  it("renders the comparison message with percentage", () => {
    const { getByText } = renderScreen();
    expect(getByText(/26% happier/)).toBeTruthy();
  });

  it("renders the comparison period", () => {
    const { getByText } = renderScreen();
    expect(getByText(/last month/)).toBeTruthy();
  });

  it("renders the current score", () => {
    const { getByText } = renderScreen();
    expect(getByText("88.2")).toBeTruthy();
  });

  it("renders 'Score Now:' label", () => {
    const { getByText } = renderScreen();
    expect(getByText("Score Now:")).toBeTruthy();
  });

  it("renders the 'See Score' action button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-score-button")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSeeScore when action button is pressed", () => {
    const onSeeScore = jest.fn();
    const { getByTestId } = renderScreen({ onSeeScore });
    fireEvent.press(getByTestId("see-score-button"));
    expect(onSeeScore).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("action button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-score-button").props.accessibilityRole).toBe(
      "button",
    );
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
      ...[].concat(getByTestId("see-score-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(
        getByTestId("solace-score-increase-screen").props.style,
      ),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
