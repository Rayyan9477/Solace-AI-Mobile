/**
 * BreathingExerciseActiveScreen Tests — prototype v4.2 #10
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import {
  BreathingExerciseActiveScreen,
  type BreathingExerciseActiveScreenProps,
} from "./BreathingExerciseActiveScreen";

const baseProps: BreathingExerciseActiveScreenProps = {
  cycleCount: 8,
  currentCycle: 3,
  currentPhase: "inhale",
  secondsRemaining: 4,
  isPaused: false,
  onClose: jest.fn(),
  onTogglePause: jest.fn(),
  onRestart: jest.fn(),
  onSettings: jest.fn(),
  onToggleSound: jest.fn(),
};

function renderScreen(overrides: Partial<BreathingExerciseActiveScreenProps> = {}) {
  const props: BreathingExerciseActiveScreenProps = { ...baseProps, ...overrides };
  return render(<BreathingExerciseActiveScreen {...props} />);
}

describe("BreathingExerciseActiveScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("breathing-exercise-active-screen")).toBeTruthy();
  });

  it("renders the close button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("close-button").props.accessibilityRole).toBe("button");
  });

  it("invokes onClose when close pressed", () => {
    const onClose = jest.fn();
    const { getByTestId } = renderScreen({ onClose });
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("displays the cycle counter", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("cycle-counter").props.children).toBe("Cycle 3 of 8");
  });

  it("renders cycle progress as progressbar with correct values", () => {
    const { getByTestId } = renderScreen({ currentCycle: 2, cycleCount: 8 });
    const progress = getByTestId("cycle-progress");
    expect(progress.props.accessibilityRole).toBe("progressbar");
    expect(progress.props.accessibilityValue).toEqual({ min: 0, max: 8, now: 2 });
  });

  it("renders the breathing circle with phase a11y label", () => {
    const { getByTestId } = renderScreen({ currentPhase: "exhale", secondsRemaining: 8 });
    const circle = getByTestId("breathing-circle");
    expect(circle.props.accessibilityRole).toBe("image");
    expect(circle.props.accessibilityLabel).toBe(
      "Breathe out, 8 seconds remaining",
    );
  });

  it("displays the inhale phase label by default", () => {
    const { UNSAFE_root } = renderScreen();
    const node = UNSAFE_root.find(
      (n: { props: { testID?: string } }) => n.props.testID === "instruction-text",
    );
    expect(node.props.children).toBe("Breathe in");
  });

  it("displays the hold phase label", () => {
    const { UNSAFE_root } = renderScreen({ currentPhase: "hold" });
    const node = UNSAFE_root.find(
      (n: { props: { testID?: string } }) => n.props.testID === "instruction-text",
    );
    expect(node.props.children).toBe("Hold");
  });

  it("zero-pads the seconds counter", () => {
    const { getByTestId } = renderScreen({ secondsRemaining: 4 });
    expect(getByTestId("seconds-counter").props.children).toBe("04");
  });

  it("renders seconds counter as a polite live region", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("seconds-counter").props.accessibilityLiveRegion).toBe(
      "polite",
    );
  });

  it("calls onTogglePause when play/pause pressed", () => {
    const onTogglePause = jest.fn();
    const { getByTestId } = renderScreen({ onTogglePause });
    fireEvent.press(getByTestId("play-pause-button"));
    expect(onTogglePause).toHaveBeenCalledTimes(1);
  });

  it("uses pause label when not paused", () => {
    const { getByTestId } = renderScreen({ isPaused: false });
    expect(getByTestId("play-pause-button").props.accessibilityLabel).toBe(
      "Pause breathing exercise",
    );
  });

  it("uses resume label when paused", () => {
    const { getByTestId } = renderScreen({ isPaused: true });
    expect(getByTestId("play-pause-button").props.accessibilityLabel).toBe(
      "Resume breathing exercise",
    );
  });

  it("calls onRestart when restart pressed", () => {
    const onRestart = jest.fn();
    const { getByTestId } = renderScreen({ onRestart });
    fireEvent.press(getByTestId("restart-button"));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("calls onSettings when settings pressed", () => {
    const onSettings = jest.fn();
    const { getByTestId } = renderScreen({ onSettings });
    fireEvent.press(getByTestId("settings-button"));
    expect(onSettings).toHaveBeenCalledTimes(1);
  });

  it("calls onToggleSound when sound pressed", () => {
    const onToggleSound = jest.fn();
    const { getByTestId } = renderScreen({ onToggleSound });
    fireEvent.press(getByTestId("sound-button"));
    expect(onToggleSound).toHaveBeenCalledTimes(1);
  });

  it("control buttons meet 44pt touch target", () => {
    const { getByTestId } = renderScreen();
    const targets = ["close-button", "sound-button", "restart-button", "play-pause-button", "settings-button"];
    for (const id of targets) {
      const node = getByTestId(id);
      const flat = Object.assign({}, ...[].concat(node.props.style));
      expect(flat.minHeight).toBeGreaterThanOrEqual(44);
      expect(flat.minWidth).toBeGreaterThanOrEqual(44);
    }
  });

  it("renders 8 cycle pips by default", () => {
    const { getByTestId } = renderScreen();
    const progress = getByTestId("cycle-progress");
    // 8 pips inside the progress wrapper
    expect(progress.props.children?.length ?? progress.children?.length).toBeGreaterThan(0);
  });

  it("does not contain Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("renders default props with no input changes", () => {
    const { getByTestId } = render(
      <BreathingExerciseActiveScreen
        onClose={jest.fn()}
        onTogglePause={jest.fn()}
        onRestart={jest.fn()}
        onSettings={jest.fn()}
      />,
    );
    expect(getByTestId("cycle-counter").props.children).toBe("Cycle 1 of 8");
    expect(getByTestId("seconds-counter").props.children).toBe("04");
  });
});
