/**
 * WakeUpScreen Tests
 * @description Tests for the wake-up screen with morning greeting, time display, duration badge, and swipe-to-wake action
 * @task Task 3.10.5: Wake Up Screen (Screen 93)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { WakeUpScreen } from "./WakeUpScreen";

describe("WakeUpScreen", () => {
  const mockOnSwipeToWake = jest.fn();

  const defaultProps = {
    userName: "Shinomiya",
    wakeTime: "06:15",
    durationHours: 8,
    durationMinutes: 12,
    onSwipeToWake: mockOnSwipeToWake,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("wake-up-screen")).toBeTruthy();
  });

  it("uses dark brown background color", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    const screen = getByTestId("wake-up-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- 2. Morning Badge ---
  it("displays the GOOD MORNING badge", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("morning-badge")).toBeTruthy();
  });

  it("displays GOOD MORNING text in uppercase", () => {
    const { getByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByText("GOOD MORNING!")).toBeTruthy();
  });

  it("morning badge has tan/brown background", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    const badge = getByTestId("morning-badge");
    expect(badge.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#3D2E23" })
    );
  });

  // --- 3. Greeting ---
  it("displays the greeting with user name", () => {
    const { getByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByText("Wake Up, Shinomiya!")).toBeTruthy();
  });

  it("displays greeting text element", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("greeting-text")).toBeTruthy();
  });

  // --- 4. Time Display ---
  it("displays the wake time", () => {
    const { getByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByText("06:15")).toBeTruthy();
  });

  it("displays time display element", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("time-display")).toBeTruthy();
  });

  // --- 5. Duration Badge ---
  it("displays the duration badge", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("duration-badge")).toBeTruthy();
  });

  it("displays the clock icon in duration badge", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("duration-clock-icon")).toBeTruthy();
  });

  it("displays the Duration label", () => {
    const { getByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByText("Duration")).toBeTruthy();
  });

  it("displays formatted duration time", () => {
    const { getByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByText("08h 12m")).toBeTruthy();
  });

  it("duration badge has brown background", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    const badge = getByTestId("duration-badge");
    expect(badge.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#3D2E23" })
    );
  });

  // --- 6. Illustration Placeholder ---
  it("displays the illustration placeholder", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("illustration-placeholder")).toBeTruthy();
  });

  // --- 7. Swipe Bar ---
  it("displays the swipe bar", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("swipe-to-wake-bar")).toBeTruthy();
  });

  it("displays Swipe to Wake Up! text", () => {
    const { getByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByText("Swipe to Wake Up!")).toBeTruthy();
  });

  it("displays the gesture icon in swipe bar", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("swipe-gesture-icon")).toBeTruthy();
  });

  // --- 8. SwipeToWake Press Handler ---
  it("calls onSwipeToWake when swipe bar is pressed", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    fireEvent.press(getByTestId("swipe-to-wake-bar"));
    expect(mockOnSwipeToWake).toHaveBeenCalledTimes(1);
  });

  it("does not call onSwipeToWake on initial render", () => {
    render(<WakeUpScreen {...defaultProps} />);
    expect(mockOnSwipeToWake).not.toHaveBeenCalled();
  });

  // --- 9. Dynamic Props ---
  it("displays a different user name", () => {
    const { getByText } = render(
      <WakeUpScreen {...defaultProps} userName="Tanaka" />
    );
    expect(getByText("Wake Up, Tanaka!")).toBeTruthy();
  });

  it("displays a different wake time", () => {
    const { getByText } = render(
      <WakeUpScreen {...defaultProps} wakeTime="07:30" />
    );
    expect(getByText("07:30")).toBeTruthy();
  });

  it("displays different duration hours and minutes", () => {
    const { getByText } = render(
      <WakeUpScreen {...defaultProps} durationHours={6} durationMinutes={45} />
    );
    expect(getByText("06h 45m")).toBeTruthy();
  });

  it("displays single-digit duration values with zero padding", () => {
    const { getByText } = render(
      <WakeUpScreen {...defaultProps} durationHours={5} durationMinutes={3} />
    );
    expect(getByText("05h 03m")).toBeTruthy();
  });

  // --- 10. Accessibility ---
  it("swipe bar has accessibilityRole button", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("swipe-to-wake-bar").props.accessibilityRole).toBe(
      "button"
    );
  });

  it("swipe bar has accessibilityLabel", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    expect(getByTestId("swipe-to-wake-bar").props.accessibilityLabel).toBe(
      "Swipe to wake up"
    );
  });

  it("swipe bar meets minimum touch target size", () => {
    const { getByTestId } = render(<WakeUpScreen {...defaultProps} />);
    const bar = getByTestId("swipe-to-wake-bar");
    const barStyle = Array.isArray(bar.props.style)
      ? bar.props.style.reduce(
          (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
            ...acc,
            ...s,
          }),
          {}
        )
      : bar.props.style;
    expect(barStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // --- 11. Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain Doctor Freud branding", () => {
    const { queryByText } = render(<WakeUpScreen {...defaultProps} />);
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  // --- 12. Duration Formatting ---
  it("formats zero minutes with zero padding", () => {
    const { getByText } = render(
      <WakeUpScreen {...defaultProps} durationHours={7} durationMinutes={0} />
    );
    expect(getByText("07h 00m")).toBeTruthy();
  });

  it("formats double-digit hours without extra padding", () => {
    const { getByText } = render(
      <WakeUpScreen {...defaultProps} durationHours={12} durationMinutes={30} />
    );
    expect(getByText("12h 30m")).toBeTruthy();
  });
});
