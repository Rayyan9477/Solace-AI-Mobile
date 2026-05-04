/**
 * GoalsPickerScreen Tests — Sprint 7, prototype v4.2 #15 GoalsPicker
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { GoalsPickerScreen } from "./GoalsPickerScreen";
import type { GoalId, GoalsPickerScreenProps } from "./GoalsPickerScreen";

const ALL_GOAL_IDS: GoalId[] = [
  "anxiety",
  "sleep",
  "mood",
  "mindful",
  "journal",
  "stress",
  "focus",
  "growth",
];

const defaultProps = {
  selectedGoals: [] as GoalId[],
  onGoalsChange: jest.fn(),
  onContinue: jest.fn(),
  onBack: jest.fn(),
  onSkip: jest.fn(),
};

function renderScreen(overrides: Partial<GoalsPickerScreenProps> = {}) {
  return render(<GoalsPickerScreen {...defaultProps} {...overrides} />);
}

describe("GoalsPickerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Render + snapshot
  it("renders and matches snapshot", () => {
    const tree = renderScreen().toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 2. All 8 goal tiles render
  it("renders all 8 goal tiles", () => {
    const { getByTestId } = renderScreen();
    ALL_GOAL_IDS.forEach((id) => {
      expect(getByTestId(`goal-tile-${id}`)).toBeTruthy();
    });
  });

  // 3. Tapping a tile calls onGoalsChange with new array (adds goal)
  it("tapping an unselected tile calls onGoalsChange with the goal added", () => {
    const onGoalsChange = jest.fn();
    const { getByTestId } = renderScreen({ selectedGoals: [], onGoalsChange });
    fireEvent.press(getByTestId("goal-tile-anxiety"));
    expect(onGoalsChange).toHaveBeenCalledTimes(1);
    expect(onGoalsChange).toHaveBeenCalledWith(["anxiety"]);
  });

  // 4. Tapping a selected tile removes it from selection
  it("tapping a selected tile calls onGoalsChange with the goal removed", () => {
    const onGoalsChange = jest.fn();
    const { getByTestId } = renderScreen({
      selectedGoals: ["anxiety", "sleep"],
      onGoalsChange,
    });
    fireEvent.press(getByTestId("goal-tile-anxiety"));
    expect(onGoalsChange).toHaveBeenCalledWith(["sleep"]);
  });

  // 5. Continue button is disabled when selectedGoals=[]
  it("Continue button is disabled when no goals are selected", () => {
    const { getByTestId } = renderScreen({ selectedGoals: [] });
    const btn = getByTestId("continue-button");
    expect(btn.props.accessibilityState?.disabled).toBe(true);
  });

  // 6. Continue button enabled when ≥1 selected
  it("Continue button is enabled when at least 1 goal is selected", () => {
    const { getByTestId } = renderScreen({ selectedGoals: ["mood"] });
    const btn = getByTestId("continue-button");
    expect(btn.props.accessibilityState?.disabled).toBe(false);
  });

  // 7. Continue calls onContinue when pressed
  it("calls onContinue when Continue button is pressed", () => {
    const onContinue = jest.fn();
    const { getByTestId } = renderScreen({
      selectedGoals: ["focus"],
      onContinue,
    });
    fireEvent.press(getByTestId("continue-button"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  // 8. Selection counter text matches prop count
  it("displays correct selection count label", () => {
    const { getByTestId } = renderScreen({
      selectedGoals: ["anxiety", "sleep", "mood"],
    });
    const counter = getByTestId("selection-counter");
    expect(counter.props.children).toBe("3 selected");
  });

  // 9. Selected tile has accessibilityState.selected=true
  it("selected tile has accessibilityState.selected=true", () => {
    const { getByTestId } = renderScreen({ selectedGoals: ["journal"] });
    const tile = getByTestId("goal-tile-journal");
    expect(tile.props.accessibilityState?.selected).toBe(true);
  });

  // 10. Unselected tile has accessibilityState.selected=false
  it("unselected tile has accessibilityState.selected=false", () => {
    const { getByTestId } = renderScreen({ selectedGoals: [] });
    const tile = getByTestId("goal-tile-focus");
    expect(tile.props.accessibilityState?.selected).toBe(false);
  });

  // 11. Step label rendered when provided
  it("renders custom stepLabel when provided", () => {
    const { getByText } = renderScreen({ stepLabel: "Step 2 of 4" });
    // BracketLabel uppercases the text and wraps it in brackets
    expect(getByText(/STEP 2 OF 4/i)).toBeTruthy();
  });

  // 12. Back button calls onBack when provided
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 13. Skip link calls onSkip when provided
  it("calls onSkip when skip link is pressed", () => {
    const onSkip = jest.fn();
    const { getByTestId } = renderScreen({ onSkip });
    fireEvent.press(getByTestId("skip-link"));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  // 14. Back button not rendered when onBack omitted
  it("does not render back button when onBack is not provided", () => {
    const { queryByTestId } = renderScreen({ onBack: undefined });
    expect(queryByTestId("back-button")).toBeNull();
  });

  // 15. Skip link not rendered when onSkip omitted
  it("does not render skip link when onSkip is not provided", () => {
    const { queryByTestId } = renderScreen({ onSkip: undefined });
    expect(queryByTestId("skip-link")).toBeNull();
  });

  // 16. Back button a11y
  it("back button has correct accessibilityRole and label", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  // 17. Tile a11y role
  it("goal tiles have accessibilityRole checkbox", () => {
    const { getByTestId } = renderScreen();
    const tile = getByTestId("goal-tile-anxiety");
    expect(tile.props.accessibilityRole).toBe("checkbox");
  });

  // 18. "None selected" text when nothing selected
  it("shows 'None selected' when selectedGoals is empty", () => {
    const { getByTestId } = renderScreen({ selectedGoals: [] });
    expect(getByTestId("selection-counter").props.children).toBe(
      "None selected",
    );
  });

  // 19. "1 selected" singular label
  it("shows '1 selected' when exactly one goal is selected", () => {
    const { getByTestId } = renderScreen({ selectedGoals: ["growth"] });
    expect(getByTestId("selection-counter").props.children).toBe("1 selected");
  });

  // 20. Headline present
  it("displays the 'What brings you to Solace?' headline", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("headline")).toBeTruthy();
  });
});
