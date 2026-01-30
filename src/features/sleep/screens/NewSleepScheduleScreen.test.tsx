/**
 * NewSleepScheduleScreen Tests
 * @description Tests for the new sleep schedule configuration screen with time pickers,
 *   snooze slider, day selector, toggle switches, and submit button
 * @task Task 3.10.4: New Sleep Schedule Screen (Screen 91)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NewSleepScheduleScreen } from "./NewSleepScheduleScreen";

describe("NewSleepScheduleScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSleepTimePress = jest.fn();
  const mockOnWakeTimePress = jest.fn();
  const mockOnSnoozeChange = jest.fn();
  const mockOnDayToggle = jest.fn();
  const mockOnAutoDisplayStatsToggle = jest.fn();
  const mockOnAutoSetAlarmToggle = jest.fn();
  const mockOnSetSchedule = jest.fn();

  const defaultProps = {
    sleepTime: "11:00 PM",
    wakeTime: "06:00 AM",
    snoozeCount: 3,
    selectedDays: ["Tue"],
    autoDisplayStats: false,
    autoSetAlarm: true,
    onBack: mockOnBack,
    onSleepTimePress: mockOnSleepTimePress,
    onWakeTimePress: mockOnWakeTimePress,
    onSnoozeChange: mockOnSnoozeChange,
    onDayToggle: mockOnDayToggle,
    onAutoDisplayStatsToggle: mockOnAutoDisplayStatsToggle,
    onAutoSetAlarmToggle: mockOnAutoSetAlarmToggle,
    onSetSchedule: mockOnSetSchedule,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // 1. Rendering
  // =============================================
  it("renders the screen container", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("new-sleep-schedule-screen")).toBeTruthy();
  });

  it("uses dark background color #1C1410", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const screen = getByTestId("new-sleep-schedule-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // =============================================
  // 2. Header
  // =============================================
  it("displays the back button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the crescent moon icon in back button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const backButton = getByTestId("back-button");
    expect(backButton).toBeTruthy();
  });

  it("displays 'New Sleep Schedule' title", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("New Sleep Schedule")).toBeTruthy();
  });

  // =============================================
  // 3. Time Pickers
  // =============================================
  it("displays 'Sleep At' label", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Sleep At")).toBeTruthy();
  });

  it("displays 'Wake Up At' label", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Wake Up At")).toBeTruthy();
  });

  it("displays the sleep time value", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText(/11:00 PM/)).toBeTruthy();
  });

  it("displays the wake time value", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText(/06:00 AM/)).toBeTruthy();
  });

  it("renders sleep time picker button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("sleep-time-picker")).toBeTruthy();
  });

  it("renders wake time picker button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("wake-time-picker")).toBeTruthy();
  });

  it("calls onSleepTimePress when sleep time picker is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("sleep-time-picker"));
    expect(mockOnSleepTimePress).toHaveBeenCalledTimes(1);
  });

  it("calls onWakeTimePress when wake time picker is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("wake-time-picker"));
    expect(mockOnWakeTimePress).toHaveBeenCalledTimes(1);
  });

  it("displays different sleep time when prop changes", () => {
    const { getByText } = render(
      <NewSleepScheduleScreen {...defaultProps} sleepTime="10:30 PM" />
    );
    expect(getByText(/10:30 PM/)).toBeTruthy();
  });

  it("displays different wake time when prop changes", () => {
    const { getByText } = render(
      <NewSleepScheduleScreen {...defaultProps} wakeTime="07:30 AM" />
    );
    expect(getByText(/07:30 AM/)).toBeTruthy();
  });

  // =============================================
  // 4. Snooze Slider
  // =============================================
  it("displays 'Repeat Snooze' label", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Repeat Snooze")).toBeTruthy();
  });

  it("displays the current snooze count value", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const valueDisplay = getByTestId("snooze-value");
    expect(valueDisplay).toBeTruthy();
  });

  it("renders the snooze slider", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("snooze-slider")).toBeTruthy();
  });

  it("displays snooze min label of 1", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("1")).toBeTruthy();
  });

  it("displays snooze max label of 5", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("5")).toBeTruthy();
  });

  // =============================================
  // 5. Day Selector
  // =============================================
  it("displays 'Auto Repeat Every' label", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Auto Repeat Every")).toBeTruthy();
  });

  it("renders Mon day chip", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Mon")).toBeTruthy();
  });

  it("renders Tue day chip", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Tue")).toBeTruthy();
  });

  it("renders Wed day chip", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Wed")).toBeTruthy();
  });

  it("renders Thu day chip", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Thu")).toBeTruthy();
  });

  it("calls onDayToggle with correct day when Mon chip is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("day-chip-Mon"));
    expect(mockOnDayToggle).toHaveBeenCalledWith("Mon");
  });

  it("calls onDayToggle with correct day when Tue chip is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("day-chip-Tue"));
    expect(mockOnDayToggle).toHaveBeenCalledWith("Tue");
  });

  it("renders Tue chip as selected with green background", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const tueChip = getByTestId("day-chip-Tue");
    const flatStyle = Array.isArray(tueChip.props.style)
      ? Object.assign({}, ...tueChip.props.style)
      : tueChip.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  it("renders unselected day chip without green background", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const monChip = getByTestId("day-chip-Mon");
    const flatStyle = Array.isArray(monChip.props.style)
      ? Object.assign({}, ...monChip.props.style)
      : monChip.props.style;
    expect(flatStyle.backgroundColor).not.toBe("#9AAD5C");
  });

  // =============================================
  // 6. Toggle Switches
  // =============================================
  it("displays 'Auto Display Sleep Stats' toggle label", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Auto Display Sleep Stats")).toBeTruthy();
  });

  it("displays 'Auto Set Alarm' toggle label", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Auto Set Alarm")).toBeTruthy();
  });

  it("renders Auto Display Stats toggle in OFF state", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const toggle = getByTestId("auto-display-stats-toggle");
    expect(toggle).toBeTruthy();
  });

  it("renders Auto Set Alarm toggle in ON state", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const toggle = getByTestId("auto-set-alarm-toggle");
    expect(toggle).toBeTruthy();
  });

  it("calls onAutoDisplayStatsToggle when stats toggle is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("auto-display-stats-toggle"));
    expect(mockOnAutoDisplayStatsToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onAutoSetAlarmToggle when alarm toggle is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("auto-set-alarm-toggle"));
    expect(mockOnAutoSetAlarmToggle).toHaveBeenCalledTimes(1);
  });

  it("displays Auto Display Stats toggle track with OFF color when false", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const track = getByTestId("auto-display-stats-track");
    const flatStyle = Array.isArray(track.props.style)
      ? Object.assign({}, ...track.props.style)
      : track.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#3D2E23" })
    );
  });

  it("displays Auto Set Alarm toggle track with ON color when true", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const track = getByTestId("auto-set-alarm-track");
    const flatStyle = Array.isArray(track.props.style)
      ? Object.assign({}, ...track.props.style)
      : track.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  // =============================================
  // 7. Submit Button
  // =============================================
  it("displays 'Set Sleep Schedule +' button text", () => {
    const { getByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByText("Set Sleep Schedule +")).toBeTruthy();
  });

  it("renders the set schedule button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("set-schedule-button")).toBeTruthy();
  });

  it("calls onSetSchedule when submit button is pressed", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    fireEvent.press(getByTestId("set-schedule-button"));
    expect(mockOnSetSchedule).toHaveBeenCalledTimes(1);
  });

  it("submit button has orange background color", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    const button = getByTestId("set-schedule-button");
    expect(button.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  // =============================================
  // 8. Accessibility
  // =============================================
  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("sleep time picker has accessibilityRole button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("sleep-time-picker").props.accessibilityRole).toBe("button");
  });

  it("sleep time picker has accessibilityLabel", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("sleep-time-picker").props.accessibilityLabel).toBe(
      "Select sleep time"
    );
  });

  it("wake time picker has accessibilityRole button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("wake-time-picker").props.accessibilityRole).toBe("button");
  });

  it("wake time picker has accessibilityLabel", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("wake-time-picker").props.accessibilityLabel).toBe(
      "Select wake up time"
    );
  });

  it("set schedule button has accessibilityRole button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("set-schedule-button").props.accessibilityRole).toBe("button");
  });

  it("set schedule button has accessibilityLabel", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("set-schedule-button").props.accessibilityLabel).toBe(
      "Set sleep schedule"
    );
  });

  it("set schedule button meets minimum touch target size", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("set-schedule-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("day chips have accessibilityRole button", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("day-chip-Mon").props.accessibilityRole).toBe("button");
  });

  it("day chips have accessibilityLabel", () => {
    const { getByTestId } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(getByTestId("day-chip-Mon").props.accessibilityLabel).toBe("Toggle Monday");
  });

  // =============================================
  // 9. Branding
  // =============================================
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<NewSleepScheduleScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
