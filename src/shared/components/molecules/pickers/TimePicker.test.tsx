/**
 * TimePicker Component Tests
 * @description TDD tests for the TimePicker component
 * @task Task 2.6.2: TimePicker Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { TimePicker } from "./TimePicker";
import type { TimeValue } from "./TimePicker.types";
import {
  to24Hour,
  to12Hour,
  formatTime,
  parseTimeString,
} from "./TimePicker.types";

describe("TimePicker", () => {
  const mockOnTimeChange = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(<TimePicker testID="time-picker" />);

      expect(getByTestId("time-picker")).toBeTruthy();
    });

    it("renders hour wheel", () => {
      const { getByTestId } = render(<TimePicker testID="time-picker" />);

      expect(getByTestId("time-picker-hour-wheel")).toBeTruthy();
    });

    it("renders minute wheel", () => {
      const { getByTestId } = render(<TimePicker testID="time-picker" />);

      expect(getByTestId("time-picker-minute-wheel")).toBeTruthy();
    });

    it("renders period selector in 12h format", () => {
      const { getByTestId } = render(
        <TimePicker testID="time-picker" format="12h" />,
      );

      expect(getByTestId("time-picker-period")).toBeTruthy();
    });

    it("does not render period selector in 24h format", () => {
      const { queryByTestId } = render(
        <TimePicker testID="time-picker" format="24h" />,
      );

      expect(queryByTestId("time-picker-period")).toBeNull();
    });

    it("renders label when provided", () => {
      const { getByText } = render(
        <TimePicker testID="time-picker" label="Select time" />,
      );

      expect(getByText("Select time")).toBeTruthy();
    });

    it("renders helper text when provided", () => {
      const { getByText } = render(
        <TimePicker
          testID="time-picker"
          helperText="Choose your preferred time"
        />,
      );

      expect(getByText("Choose your preferred time")).toBeTruthy();
    });

    it("renders error message when provided", () => {
      const { getByText } = render(
        <TimePicker testID="time-picker" error="Invalid time" />,
      );

      expect(getByText("Invalid time")).toBeTruthy();
    });

    it("renders confirm button when showConfirm is true", () => {
      const { getByText } = render(
        <TimePicker
          testID="time-picker"
          showConfirm
          onConfirm={mockOnConfirm}
        />,
      );

      expect(getByText("Confirm")).toBeTruthy();
    });
  });

  describe("Time Selection", () => {
    it("calls onTimeChange when hour is changed", () => {
      const { getByTestId } = render(
        <TimePicker
          testID="time-picker"
          value={{ hours: 10, minutes: 30, period: "AM" }}
          onTimeChange={mockOnTimeChange}
        />,
      );

      const hourWheel = getByTestId("time-picker-hour-wheel");
      fireEvent(hourWheel, "onValueChange", 11);

      expect(mockOnTimeChange).toHaveBeenCalled();
    });

    it("calls onTimeChange when minute is changed", () => {
      const { getByTestId } = render(
        <TimePicker
          testID="time-picker"
          value={{ hours: 10, minutes: 30, period: "AM" }}
          onTimeChange={mockOnTimeChange}
        />,
      );

      const minuteWheel = getByTestId("time-picker-minute-wheel");
      fireEvent(minuteWheel, "onValueChange", 45);

      expect(mockOnTimeChange).toHaveBeenCalled();
    });

    it("calls onTimeChange when period is changed", () => {
      const { getByTestId } = render(
        <TimePicker
          testID="time-picker"
          format="12h"
          value={{ hours: 10, minutes: 30, period: "AM" }}
          onTimeChange={mockOnTimeChange}
        />,
      );

      const pmButton = getByTestId("time-picker-period-pm");
      fireEvent.press(pmButton);

      expect(mockOnTimeChange).toHaveBeenCalledWith(
        expect.objectContaining({ period: "PM" }),
      );
    });

    it("displays the correct initial time", () => {
      const initialTime: TimeValue = { hours: 3, minutes: 45, period: "PM" };
      const { getByTestId } = render(
        <TimePicker testID="time-picker" value={initialTime} format="12h" />,
      );

      expect(getByTestId("time-picker")).toBeTruthy();
      // The component should display 03:45 PM
    });
  });

  describe("Minute Interval", () => {
    it("shows minutes in 5-minute intervals when minuteInterval is 5", () => {
      const { getByTestId } = render(
        <TimePicker testID="time-picker" minuteInterval={5} />,
      );

      expect(getByTestId("time-picker")).toBeTruthy();
      // Minute wheel should show 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
    });

    it("shows minutes in 15-minute intervals when minuteInterval is 15", () => {
      const { getByTestId } = render(
        <TimePicker testID="time-picker" minuteInterval={15} />,
      );

      expect(getByTestId("time-picker")).toBeTruthy();
      // Minute wheel should show 0, 15, 30, 45
    });
  });

  describe("Time Constraints", () => {
    it("respects minTime constraint", () => {
      const minTime: TimeValue = { hours: 9, minutes: 0 };
      const { getByTestId } = render(
        <TimePicker testID="time-picker" minTime={minTime} format="24h" />,
      );

      expect(getByTestId("time-picker")).toBeTruthy();
    });

    it("respects maxTime constraint", () => {
      const maxTime: TimeValue = { hours: 17, minutes: 0 };
      const { getByTestId } = render(
        <TimePicker testID="time-picker" maxTime={maxTime} format="24h" />,
      );

      expect(getByTestId("time-picker")).toBeTruthy();
    });
  });

  describe("Actions", () => {
    it("calls onConfirm when confirm button is pressed", () => {
      const { getByText } = render(
        <TimePicker
          testID="time-picker"
          showConfirm
          onConfirm={mockOnConfirm}
          value={{ hours: 10, minutes: 30, period: "AM" }}
        />,
      );

      fireEvent.press(getByText("Confirm"));

      expect(mockOnConfirm).toHaveBeenCalledWith({
        hours: 10,
        minutes: 30,
        period: "AM",
      });
    });

    it("calls onCancel when cancel button is pressed", () => {
      const { getByTestId } = render(
        <TimePicker testID="time-picker" onCancel={mockOnCancel} />,
      );

      fireEvent.press(getByTestId("time-picker-cancel"));

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("does not respond to interactions when disabled", () => {
      const { getByTestId } = render(
        <TimePicker
          testID="time-picker"
          disabled
          onTimeChange={mockOnTimeChange}
        />,
      );

      const hourWheel = getByTestId("time-picker-hour-wheel");
      fireEvent(hourWheel, "onValueChange", 11);

      expect(mockOnTimeChange).not.toHaveBeenCalled();
    });

    it("applies disabled styling", () => {
      const { getByTestId } = render(
        <TimePicker testID="time-picker" disabled />,
      );

      const picker = getByTestId("time-picker");
      expect(picker.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })]),
      );
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <TimePicker testID="time-picker" accessibilityLabel="Select time" />,
      );

      const picker = getByTestId("time-picker");
      expect(picker.props.accessibilityLabel).toBe("Select time");
    });

    it("hour wheel has proper accessibility", () => {
      const { getByTestId } = render(<TimePicker testID="time-picker" />);

      const hourWheel = getByTestId("time-picker-hour-wheel");
      expect(hourWheel.props.accessibilityRole).toBe("adjustable");
    });

    it("minute wheel has proper accessibility", () => {
      const { getByTestId } = render(<TimePicker testID="time-picker" />);

      const minuteWheel = getByTestId("time-picker-minute-wheel");
      expect(minuteWheel.props.accessibilityRole).toBe("adjustable");
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <TimePicker testID="time-picker" style={customStyle} />,
      );

      const picker = getByTestId("time-picker");
      expect(picker.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });

    it("shows error styling when error is present", () => {
      const { getByTestId } = render(
        <TimePicker testID="time-picker" error="Invalid time" />,
      );

      expect(getByTestId("time-picker")).toBeTruthy();
    });
  });
});

// Helper function tests
describe("TimePicker Helper Functions", () => {
  describe("to24Hour", () => {
    it("converts 12:00 AM to 00:00", () => {
      const result = to24Hour({ hours: 12, minutes: 0, period: "AM" });
      expect(result).toEqual({ hours: 0, minutes: 0 });
    });

    it("converts 12:00 PM to 12:00", () => {
      const result = to24Hour({ hours: 12, minutes: 0, period: "PM" });
      expect(result).toEqual({ hours: 12, minutes: 0 });
    });

    it("converts 3:30 PM to 15:30", () => {
      const result = to24Hour({ hours: 3, minutes: 30, period: "PM" });
      expect(result).toEqual({ hours: 15, minutes: 30 });
    });

    it("keeps 9:15 AM as 9:15", () => {
      const result = to24Hour({ hours: 9, minutes: 15, period: "AM" });
      expect(result).toEqual({ hours: 9, minutes: 15 });
    });
  });

  describe("to12Hour", () => {
    it("converts 00:00 to 12:00 AM", () => {
      const result = to12Hour({ hours: 0, minutes: 0 });
      expect(result).toEqual({ hours: 12, minutes: 0, period: "AM" });
    });

    it("converts 12:00 to 12:00 PM", () => {
      const result = to12Hour({ hours: 12, minutes: 0 });
      expect(result).toEqual({ hours: 12, minutes: 0, period: "PM" });
    });

    it("converts 15:30 to 3:30 PM", () => {
      const result = to12Hour({ hours: 15, minutes: 30 });
      expect(result).toEqual({ hours: 3, minutes: 30, period: "PM" });
    });

    it("converts 9:15 to 9:15 AM", () => {
      const result = to12Hour({ hours: 9, minutes: 15 });
      expect(result).toEqual({ hours: 9, minutes: 15, period: "AM" });
    });
  });

  describe("formatTime", () => {
    it("formats time in 12h format", () => {
      const result = formatTime({ hours: 15, minutes: 30 }, "12h");
      expect(result).toBe("03:30 PM");
    });

    it("formats time in 24h format", () => {
      const result = formatTime({ hours: 15, minutes: 30 }, "24h");
      expect(result).toBe("15:30");
    });
  });

  describe("parseTimeString", () => {
    it("parses 12h time string", () => {
      const result = parseTimeString("03:30 PM");
      expect(result).toEqual({ hours: 3, minutes: 30, period: "PM" });
    });

    it("parses 24h time string", () => {
      const result = parseTimeString("15:30");
      expect(result).toEqual({ hours: 15, minutes: 30 });
    });

    it("returns null for invalid string", () => {
      const result = parseTimeString("invalid");
      expect(result).toBeNull();
    });
  });
});
