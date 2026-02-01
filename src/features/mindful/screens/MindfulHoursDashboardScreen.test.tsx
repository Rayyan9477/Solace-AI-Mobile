/**
 * MindfulHoursDashboardScreen Tests
 * @description Tests for TDD implementation of Screen 104
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { MindfulHoursDashboardScreen } from "./MindfulHoursDashboardScreen";

const defaultSessions = [
  {
    id: "1",
    title: "Deep Meditation",
    soundscape: "Nature",
    soundscapeColor: "#9AAD5C",
    elapsedTime: "05:02",
    totalTime: "25:00",
    progress: 0.2,
  },
  {
    id: "2",
    title: "Relaxed State",
    soundscape: "Chirping bird",
    soundscapeColor: "#9AAD5C",
    elapsedTime: "08:33",
    totalTime: "60:00",
    progress: 0.14,
  },
  {
    id: "3",
    title: "Deep Meditation",
    soundscape: "Fireplace",
    soundscapeColor: "#E8853A",
    elapsedTime: "00:00",
    totalTime: "30:00",
    progress: 0,
  },
];

const defaultProps = {
  totalHours: "5.21",
  sessions: defaultSessions,
  onBack: jest.fn(),
  onAddSession: jest.fn(),
  onMoreOptions: jest.fn(),
  onSessionPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <MindfulHoursDashboardScreen {...defaultProps} {...overrides} />,
  );
}

describe("MindfulHoursDashboardScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mindful-hours-dashboard-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("mindful-hours-dashboard-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ flex: 1 }),
    );
  });

  // Header
  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe(
      "Go back",
    );
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'Mindful Hours' header label", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("Mindful Hours").length).toBeGreaterThanOrEqual(1);
  });

  // Hero Section
  it("renders the hero section", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("hero-section")).toBeTruthy();
  });

  it("displays the total hours", () => {
    const { getByTestId } = renderScreen();
    const display = getByTestId("total-hours-display");
    expect(display.props.children).toBe("5.21");
  });

  it("total hours is large and white", () => {
    const { getByTestId } = renderScreen();
    const display = getByTestId("total-hours-display");
    const flatStyle = Object.assign({}, ...[].concat(display.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
    expect(flatStyle.fontSize).toBeGreaterThanOrEqual(56);
  });

  it("displays 'Mindful Hours' label below total", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("hours-label")).toBeTruthy();
  });

  // FAB Button
  it("renders the add session FAB button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-session-button")).toBeTruthy();
  });

  it("calls onAddSession when FAB is pressed", () => {
    const onAddSession = jest.fn();
    const { getByTestId } = renderScreen({ onAddSession });
    fireEvent.press(getByTestId("add-session-button"));
    expect(onAddSession).toHaveBeenCalledTimes(1);
  });

  it("FAB has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-session-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("FAB has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-session-button").props.accessibilityLabel).toBe(
      "Add new session",
    );
  });

  it("FAB meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("add-session-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // History Section
  it("displays 'Mindful Hour History' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("Mindful Hour History")).toBeTruthy();
  });

  it("renders the more options button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("more-options-button")).toBeTruthy();
  });

  it("calls onMoreOptions when more options button is pressed", () => {
    const onMoreOptions = jest.fn();
    const { getByTestId } = renderScreen({ onMoreOptions });
    fireEvent.press(getByTestId("more-options-button"));
    expect(onMoreOptions).toHaveBeenCalledTimes(1);
  });

  // Session Cards
  it("renders a card for each session", () => {
    const { getByTestId } = renderScreen();
    defaultSessions.forEach((s) => {
      expect(getByTestId(`session-card-${s.id}`)).toBeTruthy();
    });
  });

  it("displays session titles", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("Deep Meditation").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("Relaxed State").length).toBe(1);
  });

  it("displays soundscape badges", () => {
    const { getByText } = renderScreen();
    expect(getByText("Nature")).toBeTruthy();
    expect(getByText("Chirping bird")).toBeTruthy();
    expect(getByText("Fireplace")).toBeTruthy();
  });

  it("renders play buttons for sessions", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("play-button-1")).toBeTruthy();
    expect(getByTestId("play-button-2")).toBeTruthy();
  });

  it("renders progress bars for sessions", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("progress-bar-1")).toBeTruthy();
    expect(getByTestId("progress-bar-2")).toBeTruthy();
  });

  it("displays elapsed and total times", () => {
    const { getByText } = renderScreen();
    expect(getByText("05:02")).toBeTruthy();
    expect(getByText("25:00")).toBeTruthy();
    expect(getByText("08:33")).toBeTruthy();
    expect(getByText("60:00")).toBeTruthy();
  });

  it("calls onSessionPress when session card is pressed", () => {
    const onSessionPress = jest.fn();
    const { getByTestId } = renderScreen({ onSessionPress });
    fireEvent.press(getByTestId("session-card-1"));
    expect(onSessionPress).toHaveBeenCalledWith("1");
  });

  it("session cards have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("session-card-1").props.accessibilityRole).toBe(
      "button",
    );
  });

  // Dynamic Props
  it("displays different total hours", () => {
    const { getByTestId } = renderScreen({ totalHours: "12.50" });
    expect(getByTestId("total-hours-display").props.children).toBe("12.50");
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
