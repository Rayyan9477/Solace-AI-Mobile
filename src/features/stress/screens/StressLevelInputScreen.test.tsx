/**
 * StressLevelInputScreen Tests
 * @description Tests for TDD implementation of Screen 98
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { StressLevelInputScreen } from "./StressLevelInputScreen";

const defaultProps = {
  selectedLevel: 3,
  levelLabel: "Moderate",
  onBack: jest.fn(),
  onLevelSelect: jest.fn(),
  onContinue: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<StressLevelInputScreen {...defaultProps} {...overrides} />);
}

describe("StressLevelInputScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-level-input-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stress-level-input-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stress-level-input-screen");
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

  // Title
  it("displays the question title", () => {
    const { getByText } = renderScreen();
    expect(getByText("What's your stress level today?")).toBeTruthy();
  });

  it("question title is white", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("question-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
  });

  // Arc Gauge
  it("renders the arc gauge container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("arc-gauge")).toBeTruthy();
  });

  it("renders 5 gauge points", () => {
    const { getByTestId } = renderScreen();
    for (let i = 1; i <= 5; i++) {
      expect(getByTestId(`gauge-point-${i}`)).toBeTruthy();
    }
  });

  it("gauge points are pressable", () => {
    const onLevelSelect = jest.fn();
    const { getByTestId } = renderScreen({ onLevelSelect });
    fireEvent.press(getByTestId("gauge-point-1"));
    expect(onLevelSelect).toHaveBeenCalledWith(1);
  });

  it("calls onLevelSelect with correct level when point 5 is tapped", () => {
    const onLevelSelect = jest.fn();
    const { getByTestId } = renderScreen({ onLevelSelect });
    fireEvent.press(getByTestId("gauge-point-5"));
    expect(onLevelSelect).toHaveBeenCalledWith(5);
  });

  it("gauge points have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("gauge-point-3").props.accessibilityRole).toBe("button");
  });

  it("gauge points have accessibility labels", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("gauge-point-1").props.accessibilityLabel).toBe(
      "Stress level 1",
    );
    expect(getByTestId("gauge-point-5").props.accessibilityLabel).toBe(
      "Stress level 5",
    );
  });

  it("selected gauge point has orange background", () => {
    const { getByTestId } = renderScreen({ selectedLevel: 3 });
    const point = getByTestId("gauge-point-3");
    const flatStyle = Object.assign({}, ...[].concat(point.props.style));
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  it("unselected gauge point has brown background", () => {
    const { getByTestId } = renderScreen({ selectedLevel: 3 });
    const point = getByTestId("gauge-point-1");
    const flatStyle = Object.assign({}, ...[].concat(point.props.style));
    expect(flatStyle.backgroundColor).toBe("#3D2E23");
  });

  it("selected gauge point is larger than unselected", () => {
    const { getByTestId } = renderScreen({ selectedLevel: 3 });
    const selected = getByTestId("gauge-point-3");
    const unselected = getByTestId("gauge-point-1");
    const selectedStyle = Object.assign({}, ...[].concat(selected.props.style));
    const unselectedStyle = Object.assign(
      {},
      ...[].concat(unselected.props.style),
    );
    expect(selectedStyle.width).toBeGreaterThan(unselectedStyle.width);
    expect(selectedStyle.height).toBeGreaterThan(unselectedStyle.height);
  });

  it("renders a selection indicator icon on the selected point", () => {
    const { getByTestId } = renderScreen({ selectedLevel: 3 });
    expect(getByTestId("selection-indicator")).toBeTruthy();
  });

  // Arc line segments
  it("renders arc line segments", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("arc-segments")).toBeTruthy();
  });

  // Level Display
  it("displays the selected level number", () => {
    const { getByTestId } = renderScreen({ selectedLevel: 3 });
    const display = getByTestId("level-number");
    expect(display.props.children).toBe(3);
  });

  it("level number is large and white", () => {
    const { getByTestId } = renderScreen();
    const display = getByTestId("level-number");
    const flatStyle = Object.assign({}, ...[].concat(display.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
    expect(flatStyle.fontSize).toBeGreaterThanOrEqual(64);
  });

  it("displays the level label", () => {
    const { getByTestId } = renderScreen({ levelLabel: "Moderate" });
    const label = getByTestId("level-label");
    expect(label.props.children).toBe("Moderate");
  });

  it("level label is white", () => {
    const { getByTestId } = renderScreen();
    const label = getByTestId("level-label");
    const flatStyle = Object.assign({}, ...[].concat(label.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
  });

  // Continue Button
  it("renders the continue button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("continue button displays correct text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when continue button is pressed", () => {
    const onContinue = jest.fn();
    const { getByTestId } = renderScreen({ onContinue });
    fireEvent.press(getByTestId("continue-button"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("continue button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("continue button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button").props.accessibilityLabel).toBe(
      "Continue to next step",
    );
  });

  it("continue button has brown/tan background", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.backgroundColor).toBe("#C4A574");
  });

  it("continue button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Dynamic Props
  it("displays level 1 with its label", () => {
    const { getByTestId } = renderScreen({
      selectedLevel: 1,
      levelLabel: "Low",
    });
    expect(getByTestId("level-number").props.children).toBe(1);
    expect(getByTestId("level-label").props.children).toBe("Low");
  });

  it("displays level 5 with its label", () => {
    const { getByTestId } = renderScreen({
      selectedLevel: 5,
      levelLabel: "High",
    });
    expect(getByTestId("level-number").props.children).toBe(5);
    expect(getByTestId("level-label").props.children).toBe("High");
  });

  it("highlights correct point when selectedLevel changes", () => {
    const { getByTestId } = renderScreen({ selectedLevel: 4 });
    const point4 = getByTestId("gauge-point-4");
    const point3 = getByTestId("gauge-point-3");
    const style4 = Object.assign({}, ...[].concat(point4.props.style));
    const style3 = Object.assign({}, ...[].concat(point3.props.style));
    expect(style4.backgroundColor).toBe("#E8853A");
    expect(style3.backgroundColor).toBe("#3D2E23");
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
