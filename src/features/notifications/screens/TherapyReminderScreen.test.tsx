/**
 * TherapyReminderScreen Tests
 * @description Tests for the therapy session reminder notification
 * @task Task 3.16.4: Therapy Reminder Screen (Screen 137)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TherapyReminderScreen } from "./TherapyReminderScreen";

const defaultProps = {
  sessionTime: "05:25 AM",
  sessionTitle: "Therapy with Dr. Solace AI",
  countdownHours: 8,
  countdownMinutes: 21,
  onBack: jest.fn(),
  onSeeSchedule: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<TherapyReminderScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("TherapyReminderScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("therapy-reminder-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("therapy-illustration")).toBeTruthy();
  });

  it("renders the session time", () => {
    const { getByText } = renderScreen();
    expect(getByText("05:25 AM")).toBeTruthy();
  });

  it("renders the session title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Therapy with Dr. Solace AI")).toBeTruthy();
  });

  it("renders the countdown message", () => {
    const { getByText } = renderScreen();
    expect(getByText(/8h 21m from now/)).toBeTruthy();
  });

  it("renders the 'See Schedule' action button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-schedule-button")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSeeSchedule when action button is pressed", () => {
    const onSeeSchedule = jest.fn();
    const { getByTestId } = renderScreen({ onSeeSchedule });
    fireEvent.press(getByTestId("see-schedule-button"));
    expect(onSeeSchedule).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("action button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-schedule-button").props.accessibilityRole).toBe(
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
      ...[].concat(getByTestId("see-schedule-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("therapy-reminder-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
