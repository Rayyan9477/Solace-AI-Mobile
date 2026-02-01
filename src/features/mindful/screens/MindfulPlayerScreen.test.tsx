/**
 * MindfulPlayerScreen Tests
 * @description Tests for TDD implementation of Screen 109
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { MindfulPlayerScreen } from "./MindfulPlayerScreen";

const defaultProps = {
  soundName: "CHIRPING BIRDS",
  instruction: "Breathe In...",
  elapsedTime: "05:21",
  totalTime: "25:00",
  progress: 0.21,
  isPlaying: true,
  onRewind: jest.fn(),
  onPlayPause: jest.fn(),
  onForward: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <MindfulPlayerScreen {...defaultProps} {...overrides} />,
  );
}

describe("MindfulPlayerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mindful-player-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("mindful-player-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ flex: 1 }),
    );
  });

  it("has green background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("mindful-player-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" }),
    );
  });

  // Sound Badge
  it("renders the sound badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sound-badge")).toBeTruthy();
  });

  it("displays the sound name", () => {
    const { getByText } = renderScreen();
    expect(getByText(/CHIRPING BIRDS/)).toBeTruthy();
  });

  // Breathing Circle
  it("renders the breathing circle", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("breathing-circle")).toBeTruthy();
  });

  // Instruction Text
  it("displays the breathing instruction", () => {
    const { getByTestId } = renderScreen();
    const instruction = getByTestId("instruction-text");
    expect(instruction.props.children).toBe("Breathe In...");
  });

  it("instruction text is white and large", () => {
    const { getByTestId } = renderScreen();
    const instruction = getByTestId("instruction-text");
    const flatStyle = Object.assign({}, ...[].concat(instruction.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
    expect(flatStyle.fontSize).toBeGreaterThanOrEqual(24);
  });

  // Progress Bar
  it("renders the progress bar", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("progress-bar")).toBeTruthy();
  });

  it("displays elapsed time", () => {
    const { getByText } = renderScreen();
    expect(getByText("05:21")).toBeTruthy();
  });

  it("displays total time", () => {
    const { getByText } = renderScreen();
    expect(getByText("25:00")).toBeTruthy();
  });

  // Playback Controls
  it("renders the rewind button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("rewind-button")).toBeTruthy();
  });

  it("calls onRewind when rewind button is pressed", () => {
    const onRewind = jest.fn();
    const { getByTestId } = renderScreen({ onRewind });
    fireEvent.press(getByTestId("rewind-button"));
    expect(onRewind).toHaveBeenCalledTimes(1);
  });

  it("rewind button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("rewind-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("rewind button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("rewind-button").props.accessibilityLabel).toBe(
      "Rewind",
    );
  });

  it("rewind button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("rewind-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("renders the play/pause button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("play-pause-button")).toBeTruthy();
  });

  it("calls onPlayPause when play/pause button is pressed", () => {
    const onPlayPause = jest.fn();
    const { getByTestId } = renderScreen({ onPlayPause });
    fireEvent.press(getByTestId("play-pause-button"));
    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it("play/pause button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("play-pause-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("play/pause shows pause label when playing", () => {
    const { getByTestId } = renderScreen({ isPlaying: true });
    expect(getByTestId("play-pause-button").props.accessibilityLabel).toBe(
      "Pause",
    );
  });

  it("play/pause shows play label when paused", () => {
    const { getByTestId } = renderScreen({ isPlaying: false });
    expect(getByTestId("play-pause-button").props.accessibilityLabel).toBe(
      "Play",
    );
  });

  it("play/pause button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("play-pause-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("renders the forward button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("forward-button")).toBeTruthy();
  });

  it("calls onForward when forward button is pressed", () => {
    const onForward = jest.fn();
    const { getByTestId } = renderScreen({ onForward });
    fireEvent.press(getByTestId("forward-button"));
    expect(onForward).toHaveBeenCalledTimes(1);
  });

  it("forward button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("forward-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("forward button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("forward-button").props.accessibilityLabel).toBe(
      "Forward",
    );
  });

  it("forward button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("forward-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Dynamic Props
  it("displays different instruction text", () => {
    const { getByTestId } = renderScreen({ instruction: "Hold..." });
    expect(getByTestId("instruction-text").props.children).toBe("Hold...");
  });

  it("displays different elapsed time", () => {
    const { getByText } = renderScreen({ elapsedTime: "12:30" });
    expect(getByText("12:30")).toBeTruthy();
  });

  it("displays different sound name", () => {
    const { getByText } = renderScreen({ soundName: "ZEN GARDEN" });
    expect(getByText(/ZEN GARDEN/)).toBeTruthy();
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
