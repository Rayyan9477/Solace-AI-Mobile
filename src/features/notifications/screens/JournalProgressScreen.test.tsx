/**
 * JournalProgressScreen Tests
 * @description Tests for the journal completion progress notification
 * @task Task 3.16.3: Journal Progress Screen (Screen 136)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { JournalProgressScreen } from "./JournalProgressScreen";

const defaultProps = {
  completedCount: 21,
  targetCount: 30,
  remainingCount: 9,
  onBack: jest.fn(),
  onSeeJournal: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<JournalProgressScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("JournalProgressScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("journal-progress-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("journal-illustration")).toBeTruthy();
  });

  it("renders the progress fraction", () => {
    const { getByText } = renderScreen();
    expect(getByText("21/30")).toBeTruthy();
  });

  it("renders 'Journal Completed' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Journal Completed")).toBeTruthy();
  });

  it("renders the encouragement message with correct plural", () => {
    const { getByText } = renderScreen();
    // Audit fix: "9 daily journal" → "9 daily journals" (plural)
    expect(getByText(/9 daily journals/)).toBeTruthy();
  });

  it("renders 'Keep it up!' in the message", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Keep it up/)).toBeTruthy();
  });

  it("renders the 'See Journal' action button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-journal-button")).toBeTruthy();
  });

  it("handles singular remaining count", () => {
    const { getByText } = renderScreen({ remainingCount: 1 });
    expect(getByText(/1 daily journal /)).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSeeJournal when action button is pressed", () => {
    const onSeeJournal = jest.fn();
    const { getByTestId } = renderScreen({ onSeeJournal });
    fireEvent.press(getByTestId("see-journal-button"));
    expect(onSeeJournal).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("action button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-journal-button").props.accessibilityRole).toBe(
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
      ...[].concat(getByTestId("see-journal-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("journal-progress-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
