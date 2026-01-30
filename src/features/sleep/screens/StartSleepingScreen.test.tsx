/**
 * StartSleepingScreen Tests
 * @description Tests for the start sleeping screen with concentric circles, play button, and schedule option
 * @task Task 3.10.4: Start Sleeping Screen (Screen 90)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { StartSleepingScreen } from "./StartSleepingScreen";

describe("StartSleepingScreen", () => {
  const mockOnStartSleep = jest.fn();
  const mockOnScheduleSleep = jest.fn();

  const defaultProps = {
    onStartSleep: mockOnStartSleep,
    onScheduleSleep: mockOnScheduleSleep,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("start-sleeping-screen")).toBeTruthy();
  });

  it("uses dark background color", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    const screen = getByTestId("start-sleeping-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Concentric Circles Decoration ---
  it("renders the concentric circles container", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("concentric-circles")).toBeTruthy();
  });

  it("renders the outer concentric ring", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("concentric-outer")).toBeTruthy();
  });

  it("renders the middle concentric ring", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("concentric-mid")).toBeTruthy();
  });

  it("renders the inner concentric ring", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("concentric-inner")).toBeTruthy();
  });

  // --- Play Button ---
  it("renders the play button", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("play-button")).toBeTruthy();
  });

  it("calls onStartSleep when play button is pressed", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    fireEvent.press(getByTestId("play-button"));
    expect(mockOnStartSleep).toHaveBeenCalledTimes(1);
  });

  it("renders the play icon inside the play button", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("play-icon")).toBeTruthy();
  });

  // --- Start Sleeping Label ---
  it("displays 'Start Sleeping' text", () => {
    const { getByText } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByText("Start Sleeping")).toBeTruthy();
  });

  it("renders the start sleeping label element", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("start-sleeping-label")).toBeTruthy();
  });

  it("start sleeping label text is white", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    const label = getByTestId("start-sleeping-label");
    expect(label.props.style).toEqual(
      expect.objectContaining({ color: "#FFFFFF" })
    );
  });

  // --- Schedule Sleep Button ---
  it("renders the schedule sleep button", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("schedule-sleep-button")).toBeTruthy();
  });

  it("displays 'Or Schedule Sleep' text", () => {
    const { getByText } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByText("Or Schedule Sleep")).toBeTruthy();
  });

  it("calls onScheduleSleep when schedule button is pressed", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    fireEvent.press(getByTestId("schedule-sleep-button"));
    expect(mockOnScheduleSleep).toHaveBeenCalledTimes(1);
  });

  it("renders the bed icon in schedule button", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("schedule-bed-icon")).toBeTruthy();
  });

  it("schedule button has a border style", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    const button = getByTestId("schedule-sleep-button");
    expect(button.props.style).toEqual(
      expect.objectContaining({ borderWidth: 1 })
    );
  });

  // --- Accessibility ---
  it("play button has accessibilityRole button", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("play-button").props.accessibilityRole).toBe("button");
  });

  it("play button has accessibilityLabel", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("play-button").props.accessibilityLabel).toBe(
      "Start sleeping"
    );
  });

  it("play button meets minimum touch target size", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("play-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("schedule sleep button has accessibilityRole button", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("schedule-sleep-button").props.accessibilityRole).toBe(
      "button"
    );
  });

  it("schedule sleep button has accessibilityLabel", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(
      getByTestId("schedule-sleep-button").props.accessibilityLabel
    ).toBe("Schedule sleep");
  });

  it("schedule sleep button meets minimum touch target size", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(getByTestId("schedule-sleep-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<StartSleepingScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain Doctor Freud text", () => {
    const { queryByText } = render(<StartSleepingScreen {...defaultProps} />);
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  // --- Visual Structure ---
  it("screen container fills available space", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    const screen = getByTestId("start-sleeping-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ flex: 1 })
    );
  });

  it("concentric circles are centered within their container", () => {
    const { getByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    const circles = getByTestId("concentric-circles");
    expect(circles.props.style).toEqual(
      expect.objectContaining({ alignItems: "center", justifyContent: "center" })
    );
  });

  it("does not render a back button", () => {
    const { queryByTestId } = render(<StartSleepingScreen {...defaultProps} />);
    expect(queryByTestId("back-button")).toBeNull();
  });
});
