/**
 * MeditationReminderScreen Tests
 * @description Tests for the daily meditation reminder notification
 * @task Task 3.16.6: Meditation Reminder Screen (Screen 139)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MeditationReminderScreen } from "./MeditationReminderScreen";

const defaultProps = {
  recommendedDuration: 25,
  onBack: jest.fn(),
  onStartMeditation: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <MeditationReminderScreen {...defaultProps} {...overrides} />,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("MeditationReminderScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("meditation-reminder-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("meditation-illustration")).toBeTruthy();
  });

  it("renders 'It's Time!' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("It's Time!")).toBeTruthy();
  });

  it("renders corrected subtitle with 'meditation' (not 'mediation')", () => {
    const { getByText } = renderScreen();
    // Audit fix: "mediation" → "meditation" (Issue #33)
    expect(getByText(/meditation session/)).toBeTruthy();
  });

  it("renders corrected message with 'Please' (not 'Pelase')", () => {
    const { getByText } = renderScreen();
    // Audit fix: "Pelase" → "Please" (Issue #33)
    expect(getByText(/Please do/)).toBeTruthy();
  });

  it("renders the recommended duration in the message", () => {
    const { getByText } = renderScreen();
    expect(getByText(/25m session/)).toBeTruthy();
  });

  it("renders AI attribution with Solace branding", () => {
    const { getByText } = renderScreen();
    // Audit fix: "Dr Freud AI" → "Dr Solace AI"
    expect(getByText(/Dr Solace AI/)).toBeTruthy();
  });

  it("renders the 'Let's Meditate' action button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("start-meditation-button")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onStartMeditation when action button is pressed", () => {
    const onStartMeditation = jest.fn();
    const { getByTestId } = renderScreen({ onStartMeditation });
    fireEvent.press(getByTestId("start-meditation-button"));
    expect(onStartMeditation).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("action button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(
      getByTestId("start-meditation-button").props.accessibilityRole,
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
      ...[].concat(getByTestId("start-meditation-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(
        getByTestId("meditation-reminder-screen").props.style,
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
