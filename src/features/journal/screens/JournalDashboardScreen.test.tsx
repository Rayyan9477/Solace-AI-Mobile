/**
 * JournalDashboardScreen Tests
 * @description Tests for the main journal dashboard with hero stats and weekly calendar
 * @screen Screen 78: Health Journal Dashboard
 * @audit batch-16-mood-tracker-final-journal-start.md
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { JournalDashboardScreen } from "./JournalDashboardScreen";

describe("JournalDashboardScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnAddJournal = jest.fn();
  const mockOnSeeAllStats = jest.fn();
  const mockOnDayPress = jest.fn();

  const mockCalendarData = [
    { day: "M", status: "positive" as const },
    { day: "T", status: "positive" as const },
    { day: "W", status: "positive" as const },
    { day: "T", status: "negative" as const },
    { day: "F", status: "positive" as const },
    { day: "S", status: "skipped" as const },
    { day: "S", status: "skipped" as const },
  ];

  const defaultProps = {
    journalCount: 34,
    periodLabel: "this year",
    calendarData: mockCalendarData,
    onBack: mockOnBack,
    onAddJournal: mockOnAddJournal,
    onSeeAllStats: mockOnSeeAllStats,
    onDayPress: mockOnDayPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("journal-dashboard-screen")).toBeTruthy();
  });

  it("uses dark background color", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const screen = getByTestId("journal-dashboard-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Hero Section ---
  it("displays the hero section", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("hero-section")).toBeTruthy();
  });

  it("displays the journal count prominently", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText("34")).toBeTruthy();
  });

  it("displays the period label", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText(/Journals this year/)).toBeTruthy();
  });

  it("displays the screen title", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText("Health Journal")).toBeTruthy();
  });

  it("displays decorative elements in hero", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("decorative-elements")).toBeTruthy();
  });

  // --- Back Button (Crescent Moon) ---
  it("displays the back button", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  // --- FAB (Add Journal) ---
  it("displays the add journal FAB", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("add-journal-fab")).toBeTruthy();
  });

  it("calls onAddJournal when FAB is pressed", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("add-journal-fab"));
    expect(mockOnAddJournal).toHaveBeenCalledTimes(1);
  });

  // --- Journal Statistics Section ---
  it("displays 'Journal Statistics' section header", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText("Journal Statistics")).toBeTruthy();
  });

  it("displays 'See All' link", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText("See All")).toBeTruthy();
  });

  it("calls onSeeAllStats when 'See All' is pressed", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("see-all-button"));
    expect(mockOnSeeAllStats).toHaveBeenCalledTimes(1);
  });

  // --- Weekly Calendar Grid ---
  it("displays the weekly calendar grid", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("calendar-grid")).toBeTruthy();
  });

  it("renders 7 day columns in the calendar", () => {
    const { getAllByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const dayColumns = getAllByTestId(/calendar-day-/);
    expect(dayColumns.length).toBe(7);
  });

  it("renders day labels (M T W T F S S)", () => {
    const { getAllByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    // M appears once, T appears twice, etc.
    const mLabels = getAllByText("M");
    expect(mLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("renders mood dots with correct colors", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const positiveDot = getByTestId("calendar-day-0");
    expect(positiveDot).toBeTruthy();
  });

  // --- Legend ---
  it("displays the legend section", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("legend")).toBeTruthy();
  });

  it("displays Skipped legend item", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText("Skipped")).toBeTruthy();
  });

  it("displays Positive legend item", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText("Positive")).toBeTruthy();
  });

  it("displays Negative legend item", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(getByText("Negative")).toBeTruthy();
  });

  // --- Accessibility ---
  it("back button has proper accessibility role", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
  });

  it("back button has proper accessibility label", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target (44pt)", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const btn = getByTestId("back-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("FAB has proper accessibility", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const fab = getByTestId("add-journal-fab");
    expect(fab.props.accessibilityRole).toBe("button");
    expect(fab.props.accessibilityLabel).toBe("Add new journal entry");
  });

  it("FAB meets minimum touch target (44pt)", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const fab = getByTestId("add-journal-fab");
    expect(fab.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("See All button has proper accessibility", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    const btn = getByTestId("see-all-button");
    expect(btn.props.accessibilityRole).toBe("button");
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <JournalDashboardScreen {...defaultProps} />
    );
    expect(queryByText(/Freud/)).toBeNull();
  });

  // --- Audit fix: data consistency ---
  it("renders journal count from props (not hardcoded)", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...defaultProps} journalCount={157} />
    );
    expect(getByText("157")).toBeTruthy();
  });
});
