/**
 * GoalSelectionScreen Tests
 * @description Tests for TDD implementation of Screen 106
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { GoalSelectionScreen } from "./GoalSelectionScreen";

const defaultGoals = [
  { id: "focus", label: "I want to gain more focus", icon: "\u{1F3AF}" },
  { id: "sleep", label: "I want to sleep better", icon: "\u{1F319}" },
  {
    id: "better_person",
    label: "I want to be a better person",
    icon: "\u2764\uFE0F",
  },
  { id: "trauma", label: "I want to conquer my trauma", icon: "\u{1F9D1}" },
  { id: "enjoyment", label: "I want to enjoy life more", icon: "\u{1F60A}" },
  { id: "other", label: "I want to be a better me", icon: "\u{1F9D8}" },
];

const defaultProps = {
  goals: defaultGoals,
  selectedGoalId: "better_person",
  stepLabel: "1 of 3",
  onBack: jest.fn(),
  onGoalSelect: jest.fn(),
  onContinue: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<GoalSelectionScreen {...defaultProps} {...overrides} />);
}

describe("GoalSelectionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("goal-selection-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("goal-selection-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("goal-selection-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" }),
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
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'New Exercise' header title", () => {
    const { getByText } = renderScreen();
    expect(getByText("New Exercise")).toBeTruthy();
  });

  // Step Indicator
  it("displays the step indicator", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("step-indicator")).toBeTruthy();
  });

  it("step indicator shows correct step label", () => {
    const { getByText } = renderScreen();
    expect(getByText("1 of 3")).toBeTruthy();
  });

  // Question Title
  it("displays the question title", () => {
    const { getByText } = renderScreen();
    expect(getByText("What's your mindful exercise goal?")).toBeTruthy();
  });

  it("question title is white and large", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("question-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
    expect(flatStyle.fontSize).toBeGreaterThanOrEqual(24);
  });

  // Goal Grid
  it("renders the goal grid", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("goal-grid")).toBeTruthy();
  });

  it("renders a card for each goal", () => {
    const { getByTestId } = renderScreen();
    defaultGoals.forEach((goal) => {
      expect(getByTestId(`goal-card-${goal.id}`)).toBeTruthy();
    });
  });

  it("displays goal labels", () => {
    const { getByText } = renderScreen();
    defaultGoals.forEach((goal) => {
      expect(getByText(goal.label)).toBeTruthy();
    });
  });

  it("renders icons for each goal", () => {
    const { getByTestId } = renderScreen();
    defaultGoals.forEach((goal) => {
      expect(getByTestId(`goal-icon-${goal.id}`)).toBeTruthy();
    });
  });

  it("renders radio indicators for each goal", () => {
    const { getByTestId } = renderScreen();
    defaultGoals.forEach((goal) => {
      expect(getByTestId(`radio-${goal.id}`)).toBeTruthy();
    });
  });

  // Selection State
  it("selected goal card has green background", () => {
    const { getByTestId } = renderScreen();
    const card = getByTestId("goal-card-better_person");
    const flatStyle = Object.assign({}, ...[].concat(card.props.style));
    expect(flatStyle.backgroundColor).toBe("#9AAD5C");
  });

  it("unselected goal card has brown background", () => {
    const { getByTestId } = renderScreen();
    const card = getByTestId("goal-card-focus");
    const flatStyle = Object.assign({}, ...[].concat(card.props.style));
    expect(flatStyle.backgroundColor).toBe("#2A1F1A");
  });

  it("calls onGoalSelect when a goal card is pressed", () => {
    const onGoalSelect = jest.fn();
    const { getByTestId } = renderScreen({ onGoalSelect });
    fireEvent.press(getByTestId("goal-card-focus"));
    expect(onGoalSelect).toHaveBeenCalledWith("focus");
  });

  it("goal cards have accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("goal-card-focus").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("goal cards have accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("goal-card-focus").props.accessibilityLabel).toBe(
      "Select I want to gain more focus",
    );
  });

  // Grid layout
  it("goal grid uses flex wrap for 2-column layout", () => {
    const { getByTestId } = renderScreen();
    const grid = getByTestId("goal-grid");
    const flatStyle = Object.assign({}, ...[].concat(grid.props.style));
    expect(flatStyle.flexDirection).toBe("row");
    expect(flatStyle.flexWrap).toBe("wrap");
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

  it("continue button has tan background", () => {
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

  // Progress Dots
  it("renders progress dots", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("progress-dots")).toBeTruthy();
  });

  // Dynamic Props
  it("displays different step label", () => {
    const { getByText } = renderScreen({ stepLabel: "2 of 3" });
    expect(getByText("2 of 3")).toBeTruthy();
  });

  it("highlights different selected goal", () => {
    const { getByTestId } = renderScreen({ selectedGoalId: "sleep" });
    const card = getByTestId("goal-card-sleep");
    const flatStyle = Object.assign({}, ...[].concat(card.props.style));
    expect(flatStyle.backgroundColor).toBe("#9AAD5C");
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
