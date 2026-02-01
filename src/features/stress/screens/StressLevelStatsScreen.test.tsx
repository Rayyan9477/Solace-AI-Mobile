/**
 * StressLevelStatsScreen Tests
 * @description Tests for TDD implementation of Screen 103
 * Note: Fixes "Montlhy" typo to "Monthly"
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { StressLevelStatsScreen } from "./StressLevelStatsScreen";

const defaultBubbles = [
  { level: "Calm", count: 97, color: "#9AAD5C" },
  { level: "Stressed", count: 58, color: "#E8853A" },
  { level: "Normal", count: 33, color: "#6B6B6B" },
  { level: "Elevated", count: 25, color: "#C4A535" },
  { level: "Extreme", count: 8, color: "#7B68B5" },
];

const defaultProps = {
  bubbles: defaultBubbles,
  selectedPeriod: "Monthly",
  onBack: jest.fn(),
  onSettingsPress: jest.fn(),
  onPeriodChange: jest.fn(),
  onBubblePress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<StressLevelStatsScreen {...defaultProps} {...overrides} />);
}

describe("StressLevelStatsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-level-stats-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stress-level-stats-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stress-level-stats-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" }),
    );
  });

  // Back Button
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
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Settings Button
  it("renders the settings button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("calls onSettingsPress when settings button is pressed", () => {
    const onSettingsPress = jest.fn();
    const { getByTestId } = renderScreen({ onSettingsPress });
    fireEvent.press(getByTestId("settings-button"));
    expect(onSettingsPress).toHaveBeenCalledTimes(1);
  });

  it("settings button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("settings button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("settings-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Title
  it("displays the screen title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Stress Level Stats")).toBeTruthy();
  });

  it("title is white", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("screen-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
  });

  // Legend
  it("renders the legend container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-legend")).toBeTruthy();
  });

  it("displays all 5 legend labels", () => {
    const { getByText } = renderScreen();
    expect(getByText("Calm")).toBeTruthy();
    expect(getByText("Normal")).toBeTruthy();
    expect(getByText("Elevated")).toBeTruthy();
    expect(getByText("Stressed")).toBeTruthy();
    expect(getByText("Extreme")).toBeTruthy();
  });

  it("renders legend dots for each level", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("legend-dot-Calm")).toBeTruthy();
    expect(getByTestId("legend-dot-Normal")).toBeTruthy();
    expect(getByTestId("legend-dot-Elevated")).toBeTruthy();
    expect(getByTestId("legend-dot-Stressed")).toBeTruthy();
    expect(getByTestId("legend-dot-Extreme")).toBeTruthy();
  });

  it("legend dot for Calm has green color", () => {
    const { getByTestId } = renderScreen();
    const dot = getByTestId("legend-dot-Calm");
    const flatStyle = Object.assign({}, ...[].concat(dot.props.style));
    expect(flatStyle.backgroundColor).toBe("#9AAD5C");
  });

  it("legend dot for Stressed has orange color", () => {
    const { getByTestId } = renderScreen();
    const dot = getByTestId("legend-dot-Stressed");
    const flatStyle = Object.assign({}, ...[].concat(dot.props.style));
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  it("legend dot for Extreme has purple color", () => {
    const { getByTestId } = renderScreen();
    const dot = getByTestId("legend-dot-Extreme");
    const flatStyle = Object.assign({}, ...[].concat(dot.props.style));
    expect(flatStyle.backgroundColor).toBe("#7B68B5");
  });

  // Bubble Chart
  it("renders the bubble chart container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("bubble-chart")).toBeTruthy();
  });

  it("renders a bubble for each stress level", () => {
    const { getByTestId } = renderScreen();
    defaultBubbles.forEach((b) => {
      expect(getByTestId(`stress-bubble-${b.level}`)).toBeTruthy();
    });
  });

  it("displays the count value in each bubble", () => {
    const { getByText } = renderScreen();
    expect(getByText("97")).toBeTruthy();
    expect(getByText("58")).toBeTruthy();
    expect(getByText("33")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
    expect(getByText("8")).toBeTruthy();
  });

  it("bubbles have correct background colors", () => {
    const { getByTestId } = renderScreen();
    const calmBubble = getByTestId("stress-bubble-Calm");
    const calmStyle = Object.assign({}, ...[].concat(calmBubble.props.style));
    expect(calmStyle.backgroundColor).toBe("#9AAD5C");
  });

  it("higher count bubbles are larger", () => {
    const { getByTestId } = renderScreen();
    const calm = getByTestId("stress-bubble-Calm"); // 97
    const extreme = getByTestId("stress-bubble-Extreme"); // 8
    const calmStyle = Object.assign({}, ...[].concat(calm.props.style));
    const extremeStyle = Object.assign({}, ...[].concat(extreme.props.style));
    expect(calmStyle.width).toBeGreaterThan(extremeStyle.width);
    expect(calmStyle.height).toBeGreaterThan(extremeStyle.height);
  });

  it("bubbles are pressable", () => {
    const onBubblePress = jest.fn();
    const { getByTestId } = renderScreen({ onBubblePress });
    fireEvent.press(getByTestId("stress-bubble-Calm"));
    expect(onBubblePress).toHaveBeenCalledWith("Calm");
  });

  it("bubbles have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-bubble-Calm").props.accessibilityRole).toBe(
      "button",
    );
  });

  // Period Selector
  it("renders the period selector", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("period-selector")).toBeTruthy();
  });

  it("displays the selected period (Monthly, not Montlhy)", () => {
    const { getByText } = renderScreen();
    expect(getByText("Monthly")).toBeTruthy();
  });

  it("does not contain the typo Montlhy", () => {
    const { queryByText } = renderScreen();
    expect(queryByText("Montlhy")).toBeNull();
  });

  it("calls onPeriodChange when period selector is pressed", () => {
    const onPeriodChange = jest.fn();
    const { getByTestId } = renderScreen({ onPeriodChange });
    fireEvent.press(getByTestId("period-selector"));
    expect(onPeriodChange).toHaveBeenCalledTimes(1);
  });

  it("period selector has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("period-selector").props.accessibilityRole).toBe(
      "button",
    );
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
