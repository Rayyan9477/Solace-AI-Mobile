/**
 * JournalDashboardScreen Tests — prototype v4.2 #08 reskin (Sprint 8).
 * ≥15 behavior-style tests for header, chart, entries, FAB, a11y.
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import {
  JournalDashboardScreen,
  type JournalEntry,
} from "./JournalDashboardScreen";

const makeProps = (overrides = {}) => ({
  onSearch: jest.fn(),
  onCompose: jest.fn(),
  onViewAll: jest.fn(),
  onEntryPress: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("JournalDashboardScreen", () => {
  // 1. Render
  it("renders the screen container", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    expect(getByTestId("journal-dashboard-screen")).toBeTruthy();
  });

  // 2. Header heading
  it("renders Fraunces heading with default count", () => {
    const { getByText } = render(<JournalDashboardScreen {...makeProps()} />);
    expect(getByText("3 entries")).toBeTruthy();
  });

  // 3. Custom entry count overrides default
  it("uses entryCount prop when provided", () => {
    const { getByText } = render(
      <JournalDashboardScreen {...makeProps()} entryCount={12} />,
    );
    expect(getByText("12 entries")).toBeTruthy();
  });

  // 4. Search button calls handler
  it("calls onSearch when search button is pressed", () => {
    const onSearch = jest.fn();
    const { getByTestId } = render(
      <JournalDashboardScreen {...makeProps({ onSearch })} />,
    );
    fireEvent.press(getByTestId("search-button"));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  // 5. Streak subline
  it("renders the streak subline with month and day count", () => {
    const { getByTestId } = render(
      <JournalDashboardScreen
        {...makeProps()}
        monthLabel="March"
        streakDays={9}
      />,
    );
    const sub = getByTestId("streak-subline");
    expect(sub.props.accessibilityLabel).toBe("March, 9 day streak");
  });

  // 6. Chart renders
  it("renders the mood trend chart", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    expect(getByTestId("mood-trend-chart")).toBeTruthy();
  });

  // 7. AI chip
  it("renders the AI insight chip", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    expect(getByTestId("ai-chip")).toBeTruthy();
  });

  // 8. Entries list
  it("renders 3 default entries", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    expect(getByTestId("entry-today")).toBeTruthy();
    expect(getByTestId("entry-yesterday")).toBeTruthy();
    expect(getByTestId("entry-apr-4")).toBeTruthy();
  });

  // 9. Entry titles surface
  it("displays entry titles", () => {
    const { getByText } = render(<JournalDashboardScreen {...makeProps()} />);
    expect(getByText("A quiet morning")).toBeTruthy();
    expect(getByText("Letting go")).toBeTruthy();
    expect(getByText("Deadline week")).toBeTruthy();
  });

  // 10. Entry tap fires callback with id
  it("calls onEntryPress with id when entry pressed", () => {
    const onEntryPress = jest.fn();
    const { getByTestId } = render(
      <JournalDashboardScreen {...makeProps({ onEntryPress })} />,
    );
    fireEvent.press(getByTestId("entry-today"));
    expect(onEntryPress).toHaveBeenCalledWith("today");
  });

  // 11. View all link
  it("calls onViewAll when view-all link is pressed", () => {
    const onViewAll = jest.fn();
    const { getByTestId } = render(
      <JournalDashboardScreen {...makeProps({ onViewAll })} />,
    );
    fireEvent.press(getByTestId("view-all-link"));
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });

  // 12. FAB renders & fires
  it("calls onCompose when FAB pressed", () => {
    const onCompose = jest.fn();
    const { getByTestId } = render(
      <JournalDashboardScreen {...makeProps({ onCompose })} />,
    );
    fireEvent.press(getByTestId("compose-fab"));
    expect(onCompose).toHaveBeenCalledTimes(1);
  });

  // 13. Custom entries
  it("renders custom entries when provided", () => {
    const entries: JournalEntry[] = [
      {
        id: "custom-1",
        date: "Mar 12",
        mood: "Hopeful",
        moodHue: "aurora",
        title: "Spring is coming",
        preview: "Saw the first daffodils today.",
      },
    ];
    const { getByTestId, getByText } = render(
      <JournalDashboardScreen {...makeProps()} entries={entries} />,
    );
    expect(getByTestId("entry-custom-1")).toBeTruthy();
    expect(getByText("Spring is coming")).toBeTruthy();
  });

  // 14. a11y — search button has role + label
  it("search button has accessibility role and label", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    const btn = getByTestId("search-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Search journal");
  });

  // 15. a11y — heading is announced as header
  it("heading is announced as a header", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    const heading = getByTestId("entry-count-heading");
    expect(heading.props.accessibilityRole).toBe("header");
  });

  // 16. a11y — FAB is accessible
  it("FAB has button role and label", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    const fab = getByTestId("compose-fab");
    expect(fab.props.accessibilityRole).toBe("button");
    expect(fab.props.accessibilityLabel).toBe("Write a new entry");
  });

  // 17. a11y — entry has descriptive label
  it("entry button announces title, mood, and date", () => {
    const { getByTestId } = render(<JournalDashboardScreen {...makeProps()} />);
    const entry = getByTestId("entry-today");
    expect(entry.props.accessibilityLabel).toBe(
      "A quiet morning, Content, Today",
    );
  });

  // 18. Branding — no Freud
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<JournalDashboardScreen {...makeProps()} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
