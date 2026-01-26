/**
 * MoodCalendar Component Tests
 * @description TDD tests for the MoodCalendar component
 * @task Task 2.8.2: MoodCalendar Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { MoodCalendar } from "./MoodCalendar";
import type { CalendarWeek, CalendarDay, DayStatus } from "./MoodCalendar.types";
import {
  STATUS_COLORS,
  DEFAULT_LEGEND_ITEMS,
  getStatusColor,
  getStatusFromMood,
  generateCalendarWeeks,
  formatDate,
  parseDate,
} from "./MoodCalendar.types";

// Mock calendar data
const mockWeeks: CalendarWeek[] = [
  {
    weekNumber: 1,
    days: [
      { date: "2025-01-20", dayOfWeek: 1, dayOfMonth: 20, status: "positive", isCurrentMonth: true },
      { date: "2025-01-21", dayOfWeek: 2, dayOfMonth: 21, status: "positive", isCurrentMonth: true },
      { date: "2025-01-22", dayOfWeek: 3, dayOfMonth: 22, status: "negative", isCurrentMonth: true },
      { date: "2025-01-23", dayOfWeek: 4, dayOfMonth: 23, status: "positive", isCurrentMonth: true },
      { date: "2025-01-24", dayOfWeek: 5, dayOfMonth: 24, status: "skipped", isCurrentMonth: true },
      { date: "2025-01-25", dayOfWeek: 6, dayOfMonth: 25, status: "positive", isCurrentMonth: true },
      { date: "2025-01-26", dayOfWeek: 0, dayOfMonth: 26, status: "positive", isToday: true, isCurrentMonth: true },
    ],
  },
  {
    weekNumber: 2,
    days: [
      { date: "2025-01-27", dayOfWeek: 1, dayOfMonth: 27, status: "none", isCurrentMonth: true },
      { date: "2025-01-28", dayOfWeek: 2, dayOfMonth: 28, status: "none", isCurrentMonth: true },
      { date: "2025-01-29", dayOfWeek: 3, dayOfMonth: 29, status: "none", isCurrentMonth: true },
      { date: "2025-01-30", dayOfWeek: 4, dayOfMonth: 30, status: "none", isCurrentMonth: true },
      { date: "2025-01-31", dayOfWeek: 5, dayOfMonth: 31, status: "none", isCurrentMonth: true },
      { date: "2025-02-01", dayOfWeek: 6, dayOfMonth: 1, status: "none", isCurrentMonth: false },
      { date: "2025-02-02", dayOfWeek: 0, dayOfMonth: 2, status: "none", isCurrentMonth: false },
    ],
  },
];

describe("MoodCalendar", () => {
  const mockOnDayPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with weeks data", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      expect(getByTestId("mood-calendar")).toBeTruthy();
    });

    it("renders day headers", () => {
      const { getByText, getAllByText } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      expect(getByText("M")).toBeTruthy();
      expect(getAllByText("T").length).toBeGreaterThanOrEqual(1); // T appears twice (Tue, Thu)
      expect(getByText("W")).toBeTruthy();
      expect(getByText("F")).toBeTruthy();
      expect(getAllByText("S").length).toBeGreaterThanOrEqual(1); // S appears twice (Sat, Sun)
    });

    it("renders correct number of weeks", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      expect(getByTestId("mood-calendar-week-1")).toBeTruthy();
      expect(getByTestId("mood-calendar-week-2")).toBeTruthy();
    });

    it("renders day cells for each week", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      // First week, first day
      expect(getByTestId("mood-calendar-day-2025-01-20")).toBeTruthy();
    });

    it("renders legend by default", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      expect(getByTestId("mood-calendar-legend")).toBeTruthy();
    });

    it("hides legend when showLegend is false", () => {
      const { queryByTestId } = render(
        <MoodCalendar
          testID="mood-calendar"
          weeks={mockWeeks}
          showLegend={false}
        />,
      );

      expect(queryByTestId("mood-calendar-legend")).toBeNull();
    });

    it("renders default legend items", () => {
      const { getByText } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      expect(getByText("Skipped")).toBeTruthy();
      expect(getByText("Positive")).toBeTruthy();
      expect(getByText("Negative")).toBeTruthy();
    });
  });

  describe("Day Status Colors", () => {
    it("applies positive status color", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      const positiveDay = getByTestId("mood-calendar-day-2025-01-20");
      expect(positiveDay.props.style).toEqual(
        expect.objectContaining({ backgroundColor: STATUS_COLORS.positive }),
      );
    });

    it("applies negative status color", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      const negativeDay = getByTestId("mood-calendar-day-2025-01-22");
      expect(negativeDay.props.style).toEqual(
        expect.objectContaining({ backgroundColor: STATUS_COLORS.negative }),
      );
    });

    it("applies skipped status color", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      const skippedDay = getByTestId("mood-calendar-day-2025-01-24");
      expect(skippedDay.props.style).toEqual(
        expect.objectContaining({ backgroundColor: STATUS_COLORS.skipped }),
      );
    });
  });

  describe("Today Indicator", () => {
    it("highlights today", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      const todayCell = getByTestId("mood-calendar-day-2025-01-26");
      expect(todayCell.props.style).toEqual(
        expect.objectContaining({ borderWidth: 2 }),
      );
    });
  });

  describe("Day Selection", () => {
    it("calls onDayPress when day is pressed", () => {
      const { getByTestId } = render(
        <MoodCalendar
          testID="mood-calendar"
          weeks={mockWeeks}
          onDayPress={mockOnDayPress}
        />,
      );

      fireEvent.press(getByTestId("mood-calendar-day-2025-01-20"));
      expect(mockOnDayPress).toHaveBeenCalledWith(
        expect.objectContaining({
          date: "2025-01-20",
          status: "positive",
        }),
      );
    });

    it("highlights selected day", () => {
      const { getByTestId } = render(
        <MoodCalendar
          testID="mood-calendar"
          weeks={mockWeeks}
          selectedDate="2025-01-21"
        />,
      );

      const selectedDay = getByTestId("mood-calendar-day-2025-01-21");
      expect(selectedDay.props.style).toEqual(
        expect.objectContaining({ borderColor: "#FFFFFF" }),
      );
    });
  });

  describe("Disabled State", () => {
    it("does not call onDayPress when disabled", () => {
      const { getByTestId } = render(
        <MoodCalendar
          testID="mood-calendar"
          weeks={mockWeeks}
          disabled
          onDayPress={mockOnDayPress}
        />,
      );

      fireEvent.press(getByTestId("mood-calendar-day-2025-01-20"));
      expect(mockOnDayPress).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows skeleton cells when loading", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={[]} loading />,
      );

      expect(getByTestId("mood-calendar-skeleton")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <MoodCalendar
          testID="mood-calendar"
          weeks={mockWeeks}
          accessibilityLabel="Monthly mood calendar"
        />,
      );

      const calendar = getByTestId("mood-calendar");
      expect(calendar.props.accessibilityLabel).toBe("Monthly mood calendar");
    });

    it("has default accessibility label", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      const calendar = getByTestId("mood-calendar");
      expect(calendar.props.accessibilityLabel).toBe("Mood calendar");
    });

    it("day cells have accessibility labels", () => {
      const { getByTestId } = render(
        <MoodCalendar testID="mood-calendar" weeks={mockWeeks} />,
      );

      const dayCell = getByTestId("mood-calendar-day-2025-01-20");
      expect(dayCell.props.accessibilityLabel).toBe("January 20, Positive mood");
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <MoodCalendar
          testID="mood-calendar"
          weeks={mockWeeks}
          style={customStyle}
        />,
      );

      const calendar = getByTestId("mood-calendar");
      expect(calendar.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });
  });
});

// Helper function tests
describe("MoodCalendar Helper Functions", () => {
  describe("STATUS_COLORS", () => {
    it("has correct colors", () => {
      expect(STATUS_COLORS.positive).toBe("#9AAD5C");
      expect(STATUS_COLORS.negative).toBe("#E8853A");
      expect(STATUS_COLORS.skipped).toBe("#6B6B6B");
      expect(STATUS_COLORS.none).toBe("transparent");
    });
  });

  describe("DEFAULT_LEGEND_ITEMS", () => {
    it("has three items", () => {
      expect(DEFAULT_LEGEND_ITEMS).toHaveLength(3);
    });

    it("has correct labels", () => {
      expect(DEFAULT_LEGEND_ITEMS[0].label).toBe("Skipped");
      expect(DEFAULT_LEGEND_ITEMS[1].label).toBe("Positive");
      expect(DEFAULT_LEGEND_ITEMS[2].label).toBe("Negative");
    });
  });

  describe("getStatusColor", () => {
    it("returns correct color for each status", () => {
      expect(getStatusColor("positive")).toBe("#9AAD5C");
      expect(getStatusColor("negative")).toBe("#E8853A");
      expect(getStatusColor("skipped")).toBe("#6B6B6B");
      expect(getStatusColor("none")).toBe("transparent");
    });
  });

  describe("getStatusFromMood", () => {
    it("returns positive for happy/overjoyed/neutral", () => {
      expect(getStatusFromMood("happy")).toBe("positive");
      expect(getStatusFromMood("overjoyed")).toBe("positive");
      expect(getStatusFromMood("neutral")).toBe("positive");
    });

    it("returns negative for sad/depressed", () => {
      expect(getStatusFromMood("sad")).toBe("negative");
      expect(getStatusFromMood("depressed")).toBe("negative");
    });

    it("returns skipped when no mood", () => {
      expect(getStatusFromMood(undefined)).toBe("skipped");
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date(2025, 0, 15); // Jan 15, 2025
      expect(formatDate(date)).toBe("2025-01-15");
    });

    it("pads single digit months and days", () => {
      const date = new Date(2025, 4, 5); // May 5, 2025
      expect(formatDate(date)).toBe("2025-05-05");
    });
  });

  describe("parseDate", () => {
    it("parses date string correctly", () => {
      const date = parseDate("2025-01-15");
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0); // January
      expect(date.getDate()).toBe(15);
    });
  });

  describe("generateCalendarWeeks", () => {
    it("generates correct number of weeks", () => {
      const weeks = generateCalendarWeeks(2025, 0, {}, 4);
      expect(weeks).toHaveLength(4);
    });

    it("each week has 7 days", () => {
      const weeks = generateCalendarWeeks(2025, 0, {});
      weeks.forEach((week) => {
        expect(week.days).toHaveLength(7);
      });
    });

    it("assigns mood status from data", () => {
      const moodData = {
        "2025-01-15": "happy" as const,
        "2025-01-16": "sad" as const,
      };
      const weeks = generateCalendarWeeks(2025, 0, moodData);

      // Find the day with mood
      const day15 = weeks.flatMap(w => w.days).find(d => d.date === "2025-01-15");
      expect(day15?.status).toBe("positive");
    });
  });
});
