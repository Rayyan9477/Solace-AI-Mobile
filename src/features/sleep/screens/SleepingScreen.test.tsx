/**
 * SleepingScreen Tests
 * @description Tests for the sleeping/nighttime screen with alarm badge, greeting, time display,
 *   duration badge, illustration placeholder, and swipe-to-wake bar
 * @task Task 3.10.6: Sleeping Screen (Screen 92)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SleepingScreen } from "./SleepingScreen";

describe("SleepingScreen", () => {
  const mockOnSwipeToWake = jest.fn();

  const defaultProps = {
    alarmTime: "10:05",
    userName: "Shinomiya",
    currentTime: "22:15",
    durationHours: 0,
    durationMinutes: 1,
    onSwipeToWake: mockOnSwipeToWake,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("sleeping-screen")).toBeTruthy();
  });

  it("uses dark background color", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    const screen = getByTestId("sleeping-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Alarm Badge ---
  it("renders the alarm badge", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("alarm-badge")).toBeTruthy();
  });

  it("displays alarm time in uppercase format", () => {
    const { getByText } = render(<SleepingScreen {...defaultProps} />);
    expect(getByText("ALARM AT 10:05")).toBeTruthy();
  });

  it("displays different alarm time", () => {
    const { getByText } = render(
      <SleepingScreen {...defaultProps} alarmTime="07:30" />
    );
    expect(getByText("ALARM AT 07:30")).toBeTruthy();
  });

  // --- Greeting ---
  it("displays good night greeting with user name", () => {
    const { getByText } = render(<SleepingScreen {...defaultProps} />);
    expect(getByText("Good Night, Shinomiya!")).toBeTruthy();
  });

  it("displays greeting with different user name", () => {
    const { getByText } = render(
      <SleepingScreen {...defaultProps} userName="Kaguya" />
    );
    expect(getByText("Good Night, Kaguya!")).toBeTruthy();
  });

  // --- Time Display ---
  it("renders the current time display", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("current-time-display")).toBeTruthy();
  });

  it("displays the current time", () => {
    const { getByText } = render(<SleepingScreen {...defaultProps} />);
    expect(getByText("22:15")).toBeTruthy();
  });

  it("displays different current time", () => {
    const { getByText } = render(
      <SleepingScreen {...defaultProps} currentTime="03:45" />
    );
    expect(getByText("03:45")).toBeTruthy();
  });

  // --- Duration Badge ---
  it("renders the duration badge", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("duration-badge")).toBeTruthy();
  });

  it("displays the clock icon in duration badge", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("duration-clock-icon")).toBeTruthy();
  });

  it("displays 'Duration' label", () => {
    const { getByText } = render(<SleepingScreen {...defaultProps} />);
    expect(getByText("Duration")).toBeTruthy();
  });

  it("displays formatted duration as 00h 01m", () => {
    const { getByText } = render(<SleepingScreen {...defaultProps} />);
    expect(getByText("00h 01m")).toBeTruthy();
  });

  it("formats duration with leading zeros", () => {
    const { getByText } = render(
      <SleepingScreen {...defaultProps} durationHours={2} durationMinutes={5} />
    );
    expect(getByText("02h 05m")).toBeTruthy();
  });

  it("formats double-digit duration correctly", () => {
    const { getByText } = render(
      <SleepingScreen {...defaultProps} durationHours={10} durationMinutes={30} />
    );
    expect(getByText("10h 30m")).toBeTruthy();
  });

  // --- Illustration Placeholder ---
  it("renders the illustration placeholder", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("illustration-placeholder")).toBeTruthy();
  });

  // --- Swipe Bar ---
  it("renders the swipe-to-wake bar", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("swipe-to-wake-bar")).toBeTruthy();
  });

  it("displays 'Swipe to Wake Up!' text", () => {
    const { getByText } = render(<SleepingScreen {...defaultProps} />);
    expect(getByText("Swipe to Wake Up!")).toBeTruthy();
  });

  it("renders gesture icon in swipe bar", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("swipe-gesture-icon")).toBeTruthy();
  });

  // --- SwipeToWake Handler ---
  it("calls onSwipeToWake when swipe bar is pressed", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    fireEvent.press(getByTestId("swipe-to-wake-bar"));
    expect(mockOnSwipeToWake).toHaveBeenCalledTimes(1);
  });

  it("does not call onSwipeToWake on initial render", () => {
    render(<SleepingScreen {...defaultProps} />);
    expect(mockOnSwipeToWake).not.toHaveBeenCalled();
  });

  // --- Accessibility ---
  it("swipe bar has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("swipe-to-wake-bar").props.accessibilityRole).toBe(
      "button"
    );
  });

  it("swipe bar has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(getByTestId("swipe-to-wake-bar").props.accessibilityLabel).toBe(
      "Swipe to wake up"
    );
  });

  it("swipe bar meets minimum touch target size", () => {
    const { getByTestId } = render(<SleepingScreen {...defaultProps} />);
    const swipeBar = getByTestId("swipe-to-wake-bar");
    expect(swipeBar.props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<SleepingScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  // --- No Back Button ---
  it("does not render a back button", () => {
    const { queryByTestId } = render(<SleepingScreen {...defaultProps} />);
    expect(queryByTestId("back-button")).toBeNull();
  });
});
