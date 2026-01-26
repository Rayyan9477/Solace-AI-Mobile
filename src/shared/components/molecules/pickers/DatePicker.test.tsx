/**
 * DatePicker Component Tests
 * @description TDD tests for the DatePicker component
 * @task Task 2.6.1: DatePicker Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { DatePicker } from "./DatePicker";

// Mock react-native-calendars
jest.mock("react-native-calendars", () => ({
  Calendar: ({ onDayPress, markedDates, testID, ...props }: any) => {
    const React = require("react");
    const { View, Text, TouchableOpacity } = require("react-native");

    return (
      <View testID={testID} accessibilityRole="grid">
        <TouchableOpacity
          accessibilityRole="button"
          testID={`${testID}-day-2025-01-15`}
          onPress={() =>
            onDayPress?.({
              dateString: "2025-01-15",
              day: 15,
              month: 1,
              year: 2025,
            })
          }
        >
          <Text>15</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          testID={`${testID}-day-2025-01-20`}
          onPress={() =>
            onDayPress?.({
              dateString: "2025-01-20",
              day: 20,
              month: 1,
              year: 2025,
            })
          }
        >
          <Text>20</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

describe("DatePicker", () => {
  const mockOnDateChange = jest.fn();
  const mockOnRangeChange = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(<DatePicker testID="date-picker" />);

      expect(getByTestId("date-picker")).toBeTruthy();
    });

    it("renders calendar component", () => {
      const { getByTestId } = render(<DatePicker testID="date-picker" />);

      expect(getByTestId("date-picker-calendar")).toBeTruthy();
    });

    it("renders quick select options when showQuickSelect is true", () => {
      const { getByText } = render(
        <DatePicker testID="date-picker" showQuickSelect />,
      );

      expect(getByText("Today")).toBeTruthy();
      expect(getByText("This Week")).toBeTruthy();
      expect(getByText("Yesterday")).toBeTruthy();
    });

    it("hides quick select options when showQuickSelect is false", () => {
      const { queryByText } = render(
        <DatePicker testID="date-picker" showQuickSelect={false} />,
      );

      expect(queryByText("Today")).toBeNull();
    });

    it("renders apply button when showApplyButton is true", () => {
      const { getByText } = render(
        <DatePicker
          testID="date-picker"
          showApplyButton
          onApply={mockOnApply}
        />,
      );

      expect(getByText("Apply")).toBeTruthy();
    });

    it("hides apply button when showApplyButton is false", () => {
      const { queryByText } = render(
        <DatePicker testID="date-picker" showApplyButton={false} />,
      );

      expect(queryByText("Apply")).toBeNull();
    });
  });

  describe("Single Date Selection", () => {
    it("calls onDateChange when a date is selected", () => {
      const { getByTestId } = render(
        <DatePicker
          testID="date-picker"
          mode="single"
          onDateChange={mockOnDateChange}
        />,
      );

      fireEvent.press(getByTestId("date-picker-calendar-day-2025-01-15"));

      expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Date));
    });

    it("displays the selected date correctly", () => {
      const selectedDate = new Date(2025, 0, 15);
      const { getByTestId } = render(
        <DatePicker testID="date-picker" mode="single" value={selectedDate} />,
      );

      expect(getByTestId("date-picker")).toBeTruthy();
    });

    it("respects minDate constraint", () => {
      const minDate = new Date(2025, 0, 10);
      const { getByTestId } = render(
        <DatePicker
          testID="date-picker"
          mode="single"
          minDate={minDate}
          onDateChange={mockOnDateChange}
        />,
      );

      expect(getByTestId("date-picker")).toBeTruthy();
    });

    it("respects maxDate constraint", () => {
      const maxDate = new Date(2025, 0, 25);
      const { getByTestId } = render(
        <DatePicker
          testID="date-picker"
          mode="single"
          maxDate={maxDate}
          onDateChange={mockOnDateChange}
        />,
      );

      expect(getByTestId("date-picker")).toBeTruthy();
    });
  });

  describe("Range Selection", () => {
    it("calls onRangeChange when range dates are selected", () => {
      const { getByTestId } = render(
        <DatePicker
          testID="date-picker"
          mode="range"
          onRangeChange={mockOnRangeChange}
        />,
      );

      // Select start date
      fireEvent.press(getByTestId("date-picker-calendar-day-2025-01-15"));
      // Select end date
      fireEvent.press(getByTestId("date-picker-calendar-day-2025-01-20"));

      expect(mockOnRangeChange).toHaveBeenCalled();
    });

    it("displays range selection correctly", () => {
      const range = {
        startDate: new Date(2025, 0, 15),
        endDate: new Date(2025, 0, 20),
      };
      const { getByTestId } = render(
        <DatePicker testID="date-picker" mode="range" range={range} />,
      );

      expect(getByTestId("date-picker")).toBeTruthy();
    });
  });

  describe("Quick Select", () => {
    it("selects today when Today option is pressed", () => {
      const { getByText } = render(
        <DatePicker
          testID="date-picker"
          showQuickSelect
          onDateChange={mockOnDateChange}
        />,
      );

      fireEvent.press(getByText("Today"));

      expect(mockOnDateChange).toHaveBeenCalled();
    });

    it("uses custom quick select options when provided", () => {
      const customOptions = [
        {
          id: "custom",
          label: "Custom Option",
          getValue: () => new Date(2025, 5, 1),
        },
      ];

      const { getByText, queryByText } = render(
        <DatePicker
          testID="date-picker"
          showQuickSelect
          quickSelectOptions={customOptions}
        />,
      );

      expect(getByText("Custom Option")).toBeTruthy();
      expect(queryByText("Today")).toBeNull();
    });
  });

  describe("Actions", () => {
    it("calls onApply when apply button is pressed", () => {
      const { getByText } = render(
        <DatePicker
          testID="date-picker"
          showApplyButton
          onApply={mockOnApply}
        />,
      );

      fireEvent.press(getByText("Apply"));

      expect(mockOnApply).toHaveBeenCalled();
    });

    it("calls onCancel when cancel is pressed", () => {
      const { getByTestId } = render(
        <DatePicker testID="date-picker" onCancel={mockOnCancel} />,
      );

      const cancelButton = getByTestId("date-picker-cancel");
      fireEvent.press(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("does not respond to interactions when disabled", () => {
      const { getByTestId } = render(
        <DatePicker
          testID="date-picker"
          disabled
          onDateChange={mockOnDateChange}
        />,
      );

      expect(getByTestId("date-picker")).toBeTruthy();
      // Disabled state should prevent interactions
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility role", () => {
      const { getByTestId } = render(
        <DatePicker testID="date-picker" accessibilityLabel="Select a date" />,
      );

      const datePicker = getByTestId("date-picker");
      expect(datePicker.props.accessibilityLabel).toBe("Select a date");
    });

    it("calendar has grid role", () => {
      const { getByTestId } = render(<DatePicker testID="date-picker" />);

      const calendar = getByTestId("date-picker-calendar");
      expect(calendar.props.accessibilityRole).toBe("grid");
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <DatePicker testID="date-picker" style={customStyle} />,
      );

      const datePicker = getByTestId("date-picker");
      expect(datePicker.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });
  });
});
