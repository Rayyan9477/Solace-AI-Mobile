/**
 * ProfileDashboardScreen Tests
 * @description Tests for the user profile dashboard overview
 * @task Task 3.17.2: Profile Dashboard Screen (Screen 141)
 * @audit-fix "Shinomiya Kaguya" → appropriate name, age 17→24, "Freud Score" → "Solace Score"
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ProfileDashboardScreen } from "./ProfileDashboardScreen";

const defaultProps = {
  username: "Jordan Rivera",
  membershipTier: "Basic Member",
  age: "24y",
  weight: "65kg",
  height: "172cm",
  solaceScore: 80,
  scoreStatus: "Healthy",
  currentMood: "Calm",
  moodData: [3, 5, 4, 6, 5, 4, 7],
  onSettings: jest.fn(),
  onScorePress: jest.fn(),
  onMoodPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<ProfileDashboardScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("ProfileDashboardScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("profile-dashboard-screen")).toBeTruthy();
  });

  it("renders the profile avatar", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("profile-avatar")).toBeTruthy();
  });

  it("renders the settings button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("renders the username", () => {
    const { getByText } = renderScreen();
    expect(getByText("Jordan Rivera")).toBeTruthy();
  });

  it("renders the membership badge", () => {
    const { getByText } = renderScreen();
    expect(getByText("Basic Member")).toBeTruthy();
  });

  it("renders the age stat", () => {
    const { getByText } = renderScreen();
    expect(getByText("24y")).toBeTruthy();
  });

  it("renders the weight stat", () => {
    const { getByText } = renderScreen();
    expect(getByText("65kg")).toBeTruthy();
  });

  it("renders the height stat", () => {
    const { getByText } = renderScreen();
    expect(getByText("172cm")).toBeTruthy();
  });

  it("renders the Solace Score card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("solace-score-card")).toBeTruthy();
  });

  it("renders the score value", () => {
    const { getByText } = renderScreen();
    expect(getByText("80")).toBeTruthy();
  });

  it("renders the score status", () => {
    const { getByText } = renderScreen();
    expect(getByText("Healthy")).toBeTruthy();
  });

  it("renders the mood card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mood-card")).toBeTruthy();
  });

  it("renders the current mood", () => {
    const { getByText } = renderScreen();
    expect(getByText("Calm")).toBeTruthy();
  });

  it("renders mood bar chart", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mood-bar-chart")).toBeTruthy();
  });

  it("renders correct number of mood bars", () => {
    const { getByTestId } = renderScreen();
    const chart = getByTestId("mood-bar-chart");
    expect(chart.children.length).toBe(7);
  });

  // ── Dynamic Props ──────────────────────────────────────
  it("displays the provided username", () => {
    const { getByText } = renderScreen({ username: "Alex Smith" });
    expect(getByText("Alex Smith")).toBeTruthy();
  });

  it("displays the provided membership tier", () => {
    const { getByText } = renderScreen({ membershipTier: "Premium Member" });
    expect(getByText("Premium Member")).toBeTruthy();
  });

  it("displays the provided score", () => {
    const { getByText } = renderScreen({ solaceScore: 95 });
    expect(getByText("95")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onSettings when settings button is pressed", () => {
    const onSettings = jest.fn();
    const { getByTestId } = renderScreen({ onSettings });
    fireEvent.press(getByTestId("settings-button"));
    expect(onSettings).toHaveBeenCalledTimes(1);
  });

  it("calls onScorePress when score card is pressed", () => {
    const onScorePress = jest.fn();
    const { getByTestId } = renderScreen({ onScorePress });
    fireEvent.press(getByTestId("solace-score-card"));
    expect(onScorePress).toHaveBeenCalledTimes(1);
  });

  it("calls onMoodPress when mood card is pressed", () => {
    const onMoodPress = jest.fn();
    const { getByTestId } = renderScreen({ onMoodPress });
    fireEvent.press(getByTestId("mood-card"));
    expect(onMoodPress).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("settings button has accessibilityLabel 'Settings'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button").props.accessibilityLabel).toBe(
      "Settings",
    );
  });

  it("settings button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("settings button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("settings-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("profile-dashboard-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("uses 'Solace Score' not 'Freud Score'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Solace Score")).toBeTruthy();
  });
});
