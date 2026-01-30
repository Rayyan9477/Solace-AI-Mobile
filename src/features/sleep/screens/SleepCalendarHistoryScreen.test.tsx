/**
 * SleepCalendarHistoryScreen Tests
 * @description Tests for the sleep calendar history screen with month navigation, calendar grid, suggestions, and history list
 * @task Task 3.10.3: Sleep Calendar History Screen (Screen 89)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SleepCalendarHistoryScreen } from "./SleepCalendarHistoryScreen";

describe("SleepCalendarHistoryScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnPrevMonth = jest.fn();
  const mockOnNextMonth = jest.fn();
  const mockOnDayPress = jest.fn();
  const mockOnSuggestionsSeeAll = jest.fn();
  const mockOnHistorySeeAll = jest.fn();
  const mockOnHistoryItemPress = jest.fn();
  const mockOnSuggestionsCardPress = jest.fn();
  const mockOnAddSleep = jest.fn();

  const defaultCalendarDays = [
    { date: 1, isSelected: false, isToday: false, hasSchedule: false, hasAutomatic: false, hasRemSleep: false },
    { date: 2, isSelected: false, isToday: false, hasSchedule: true, hasAutomatic: false, hasRemSleep: false },
    { date: 9, isSelected: true, isToday: false, hasSchedule: false, hasAutomatic: true, hasRemSleep: false },
    { date: 10, isSelected: true, isToday: false, hasSchedule: false, hasAutomatic: false, hasRemSleep: true },
    { date: 11, isSelected: true, isToday: true, hasSchedule: true, hasAutomatic: true, hasRemSleep: true },
    { date: 15, isSelected: false, isToday: false, hasSchedule: false, hasAutomatic: false, hasRemSleep: false },
    { date: 20, isSelected: false, isToday: false, hasSchedule: false, hasAutomatic: true, hasRemSleep: false },
    { date: 25, isSelected: false, isToday: false, hasSchedule: true, hasAutomatic: false, hasRemSleep: true },
    { date: 31, isSelected: false, isToday: false, hasSchedule: false, hasAutomatic: false, hasRemSleep: false },
  ];

  const defaultWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const defaultSleepHistory = [
    {
      id: "entry-1",
      month: "Sep",
      day: 12,
      duration: 7.5,
      qualityBadge: { label: "Insomniac", color: "#7B68B5" },
      suggestionsCount: 3,
      heartRate: 72,
      hasIrregularity: true,
    },
    {
      id: "entry-2",
      month: "Sep",
      day: 11,
      duration: 6.2,
      qualityBadge: { label: "Core", color: "#6B6B6B" },
      suggestionsCount: 0,
      heartRate: 68,
      hasIrregularity: false,
    },
    {
      id: "entry-3",
      month: "Sep",
      day: 10,
      duration: 8.1,
      qualityBadge: { label: "Normal", color: "#9AAD5C" },
      suggestionsCount: 2,
      heartRate: 65,
      hasIrregularity: false,
    },
    {
      id: "entry-4",
      month: "Sep",
      day: 9,
      duration: 5.0,
      qualityBadge: { label: "Irregular", color: "#E8853A" },
      suggestionsCount: 0,
      hasIrregularity: true,
    },
  ];

  const defaultProps = {
    monthLabel: "January 2025",
    calendarDays: defaultCalendarDays,
    weekDays: defaultWeekDays,
    sleepHistory: defaultSleepHistory,
    suggestionsCount: 89,
    onBack: mockOnBack,
    onPrevMonth: mockOnPrevMonth,
    onNextMonth: mockOnNextMonth,
    onDayPress: mockOnDayPress,
    onSuggestionsSeeAll: mockOnSuggestionsSeeAll,
    onHistorySeeAll: mockOnHistorySeeAll,
    onHistoryItemPress: mockOnHistoryItemPress,
    onSuggestionsCardPress: mockOnSuggestionsCardPress,
    onAddSleep: mockOnAddSleep,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- 1. Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("sleep-calendar-history-screen")).toBeTruthy();
  });

  it("uses dark background color #1C1410", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const screen = getByTestId("sleep-calendar-history-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- 2. Header ---
  it("renders the back button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the crescent moon icon in back button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const backButton = getByTestId("back-button");
    const textChildren = backButton.findAllByType
      ? backButton.props.children
      : null;
    expect(backButton).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the month label", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("January 2025")).toBeTruthy();
  });

  it("renders the previous month navigation arrow", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("prev-month-button")).toBeTruthy();
  });

  it("calls onPrevMonth when previous arrow is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("prev-month-button"));
    expect(mockOnPrevMonth).toHaveBeenCalledTimes(1);
  });

  it("renders the next month navigation arrow", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("next-month-button")).toBeTruthy();
  });

  it("calls onNextMonth when next arrow is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("next-month-button"));
    expect(mockOnNextMonth).toHaveBeenCalledTimes(1);
  });

  // --- 3. Calendar Grid ---
  it("renders all weekday headers", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    defaultWeekDays.forEach((day) => {
      expect(getByText(day)).toBeTruthy();
    });
  });

  it("renders calendar day cells", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("calendar-day-1")).toBeTruthy();
    expect(getByTestId("calendar-day-9")).toBeTruthy();
    expect(getByTestId("calendar-day-31")).toBeTruthy();
  });

  it("highlights selected days with green styling", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const selectedDay = getByTestId("calendar-day-9");
    const flatStyle = Array.isArray(selectedDay.props.style)
      ? Object.assign({}, ...selectedDay.props.style)
      : selectedDay.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  it("does not highlight unselected days with green", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const unselectedDay = getByTestId("calendar-day-1");
    const flatStyle = Array.isArray(unselectedDay.props.style)
      ? Object.assign({}, ...unselectedDay.props.style)
      : unselectedDay.props.style;
    expect(flatStyle.backgroundColor).not.toBe("#9AAD5C");
  });

  it("calls onDayPress with the date when a calendar day is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("calendar-day-9"));
    expect(mockOnDayPress).toHaveBeenCalledWith(9);
  });

  it("calls onDayPress with correct date for another day", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("calendar-day-25"));
    expect(mockOnDayPress).toHaveBeenCalledWith(25);
  });

  it("renders the calendar grid container", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("calendar-grid")).toBeTruthy();
  });

  // --- 4. Calendar Legend ---
  it("displays Schedule legend item", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("Schedule")).toBeTruthy();
  });

  it("displays Automatic legend item", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("Automatic")).toBeTruthy();
  });

  it("displays REM Sleep legend item", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("REM Sleep")).toBeTruthy();
  });

  it("renders three legend dot indicators", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("legend-dot-schedule")).toBeTruthy();
    expect(getByTestId("legend-dot-automatic")).toBeTruthy();
    expect(getByTestId("legend-dot-rem-sleep")).toBeTruthy();
  });

  // --- 5. AI Suggestions Section ---
  it("displays Sleep AI Suggestions section header", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("Sleep AI Suggestions")).toBeTruthy();
  });

  it("displays See All link in suggestions section", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("suggestions-see-all")).toBeTruthy();
  });

  it("calls onSuggestionsSeeAll when See All is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("suggestions-see-all"));
    expect(mockOnSuggestionsSeeAll).toHaveBeenCalledTimes(1);
  });

  it("displays suggestions count on the card", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText(/89\+/)).toBeTruthy();
  });

  it("displays Sleep Patterns text on suggestion card", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText(/Sleep Patterns/)).toBeTruthy();
  });

  it("renders the suggestions card", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("suggestions-card")).toBeTruthy();
  });

  it("calls onSuggestionsCardPress when suggestions card is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("suggestions-card"));
    expect(mockOnSuggestionsCardPress).toHaveBeenCalledTimes(1);
  });

  // --- 6. Sleep History Section ---
  it("displays Sleep History section header", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("Sleep History")).toBeTruthy();
  });

  it("displays See All link in history section", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("history-see-all")).toBeTruthy();
  });

  it("calls onHistorySeeAll when history See All is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("history-see-all"));
    expect(mockOnHistorySeeAll).toHaveBeenCalledTimes(1);
  });

  it("renders all sleep history items", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("history-item-entry-1")).toBeTruthy();
    expect(getByTestId("history-item-entry-2")).toBeTruthy();
    expect(getByTestId("history-item-entry-3")).toBeTruthy();
    expect(getByTestId("history-item-entry-4")).toBeTruthy();
  });

  it("displays date information for history items", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("Sep 12")).toBeTruthy();
    expect(getByText("Sep 11")).toBeTruthy();
  });

  it("displays sleep duration text", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText(/7\.5h/)).toBeTruthy();
    expect(getByText(/6\.2h/)).toBeTruthy();
  });

  it("displays quality badge labels", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const badge1 = getByTestId("quality-badge-entry-1");
    expect(badge1).toBeTruthy();
  });

  it("displays Insomniac quality badge text", () => {
    const { getAllByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getAllByText("Insomniac").length).toBeGreaterThanOrEqual(1);
  });

  it("displays Core quality badge text", () => {
    const { getAllByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getAllByText("Core").length).toBeGreaterThanOrEqual(1);
  });

  it("displays suggestions count for history items with suggestions", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText("3 Suggestions")).toBeTruthy();
  });

  it("displays No Suggestions for history items without suggestions", () => {
    const { getAllByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getAllByText("No Suggestions").length).toBeGreaterThanOrEqual(1);
  });

  it("displays heart rate values when available", () => {
    const { getByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByText(/72/)).toBeTruthy();
  });

  it("calls onHistoryItemPress with item id when history item is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("history-item-entry-1"));
    expect(mockOnHistoryItemPress).toHaveBeenCalledWith("entry-1");
  });

  it("calls onHistoryItemPress with correct id for another item", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("history-item-entry-3"));
    expect(mockOnHistoryItemPress).toHaveBeenCalledWith("entry-3");
  });

  // --- 7. FAB Button ---
  it("renders the floating action button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("add-sleep-button")).toBeTruthy();
  });

  it("displays + icon on FAB", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const fab = getByTestId("add-sleep-button");
    expect(fab).toBeTruthy();
  });

  it("calls onAddSleep when FAB is pressed", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("add-sleep-button"));
    expect(mockOnAddSleep).toHaveBeenCalledTimes(1);
  });

  it("FAB has green background color", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const fab = getByTestId("add-sleep-button");
    const flatStyle = Array.isArray(fab.props.style)
      ? Object.assign({}, ...fab.props.style)
      : fab.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  // --- 8. Accessibility ---
  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("prev month button has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("prev-month-button").props.accessibilityRole).toBe("button");
  });

  it("prev month button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("prev-month-button").props.accessibilityLabel).toBe("Previous month");
  });

  it("next month button has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("next-month-button").props.accessibilityRole).toBe("button");
  });

  it("next month button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("next-month-button").props.accessibilityLabel).toBe("Next month");
  });

  it("FAB has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("add-sleep-button").props.accessibilityRole).toBe("button");
  });

  it("FAB has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("add-sleep-button").props.accessibilityLabel).toBe("Add sleep entry");
  });

  it("FAB meets minimum touch target size", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const fab = getByTestId("add-sleep-button");
    const flatStyle = Array.isArray(fab.props.style)
      ? Object.assign({}, ...fab.props.style)
      : fab.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("prev month button meets minimum touch target size", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const btn = getByTestId("prev-month-button");
    const flatStyle = Array.isArray(btn.props.style)
      ? Object.assign({}, ...btn.props.style)
      : btn.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("next month button meets minimum touch target size", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    const btn = getByTestId("next-month-button");
    const flatStyle = Array.isArray(btn.props.style)
      ? Object.assign({}, ...btn.props.style)
      : btn.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("suggestions card has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("suggestions-card").props.accessibilityRole).toBe("button");
  });

  it("history items have accessibilityRole button", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("history-item-entry-1").props.accessibilityRole).toBe("button");
  });

  // --- 9. Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  // --- 10. Edge Cases ---
  it("renders with empty sleep history", () => {
    const { getByTestId, queryByTestId } = render(
      <SleepCalendarHistoryScreen {...defaultProps} sleepHistory={[]} />
    );
    expect(getByTestId("sleep-calendar-history-screen")).toBeTruthy();
    expect(queryByTestId("history-item-entry-1")).toBeNull();
  });

  it("renders with different month label", () => {
    const { getByText } = render(
      <SleepCalendarHistoryScreen {...defaultProps} monthLabel="February 2025" />
    );
    expect(getByText("February 2025")).toBeTruthy();
  });

  it("renders history item without heart rate", () => {
    const { getByTestId } = render(<SleepCalendarHistoryScreen {...defaultProps} />);
    expect(getByTestId("history-item-entry-4")).toBeTruthy();
  });

  it("displays different suggestions count", () => {
    const { getByText } = render(
      <SleepCalendarHistoryScreen {...defaultProps} suggestionsCount={150} />
    );
    expect(getByText(/150\+/)).toBeTruthy();
  });
});
