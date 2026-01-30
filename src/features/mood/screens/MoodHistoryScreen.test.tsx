/**
 * MoodHistoryScreen Tests
 * @description Tests for chronological mood history list with biometric data
 * @task Task 3.8.4: Mood History Screen (Screen 74)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodHistoryScreen } from "./MoodHistoryScreen";

describe("MoodHistoryScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnTabChange = jest.fn();
  const mockOnEntryPress = jest.fn();
  const mockOnFilter = jest.fn();
  const mockOnSettings = jest.fn();
  const mockOnAddMood = jest.fn();
  const mockOnEdit = jest.fn();

  const mockEntries = [
    {
      id: "1",
      date: "Sep 12",
      mood: "Overjoyed",
      emoji: "😄",
      heartRate: 96,
      bloodPressure: 121,
    },
    {
      id: "2",
      date: "Sep 11",
      mood: "Happy",
      emoji: "🙂",
      heartRate: 65,
      bloodPressure: 111,
    },
    {
      id: "3",
      date: "Sep 10",
      mood: "Neutral",
      emoji: "😐",
      heartRate: 77,
      bloodPressure: 111,
    },
    {
      id: "4",
      date: "Sep 9",
      mood: "Sad",
      emoji: "😢",
      heartRate: 99,
      bloodPressure: 130,
    },
    {
      id: "5",
      date: "Sep 8",
      mood: "Depressed",
      emoji: "😵",
      heartRate: 105,
      bloodPressure: 140,
    },
  ];

  const defaultProps = {
    activeTab: "history" as const,
    entries: mockEntries,
    onBack: mockOnBack,
    onTabChange: mockOnTabChange,
    onEntryPress: mockOnEntryPress,
    onFilter: mockOnFilter,
    onSettings: mockOnSettings,
    onAddMood: mockOnAddMood,
    onEdit: mockOnEdit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("mood-history-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByText("Mood History")).toBeTruthy();
  });

  // --- Segmented Control ---
  it("displays segmented control", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("segmented-control")).toBeTruthy();
  });

  it("displays History tab", () => {
    const { getByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByText("History")).toBeTruthy();
  });

  it("displays AI Suggestions tab", () => {
    const { getByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByText("AI Suggestions")).toBeTruthy();
  });

  it("highlights the active History tab", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    const historyTab = getByTestId("tab-history");
    const flatStyle = Array.isArray(historyTab.props.style)
      ? Object.assign({}, ...historyTab.props.style)
      : historyTab.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  it("calls onTabChange when AI Suggestions tab is pressed", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("tab-suggestions"));
    expect(mockOnTabChange).toHaveBeenCalledWith("suggestions");
  });

  // --- Mood History Entries ---
  it("renders all mood entries", () => {
    const { getAllByTestId } = render(
      <MoodHistoryScreen {...defaultProps} />
    );
    const cards = getAllByTestId(/mood-entry-/);
    expect(cards.length).toBe(mockEntries.length);
  });

  it("displays entry dates", () => {
    const { getByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByText("Sep 12")).toBeTruthy();
    expect(getByText("Sep 11")).toBeTruthy();
  });

  it("displays entry mood labels", () => {
    const { getByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByText("Overjoyed")).toBeTruthy();
    expect(getByText("Neutral")).toBeTruthy();
  });

  it("displays heart rate biometric data", () => {
    const { getByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByText("96 bpm")).toBeTruthy();
    expect(getByText("65 bpm")).toBeTruthy();
  });

  it("displays blood pressure biometric data", () => {
    const { getByText, getAllByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByText("121 sys")).toBeTruthy();
    const sysElements = getAllByText("111 sys");
    expect(sysElements.length).toBeGreaterThan(0);
  });

  it("calls onEntryPress when entry is tapped", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("mood-entry-1"));
    expect(mockOnEntryPress).toHaveBeenCalledWith(mockEntries[0]);
  });

  // --- Biometric placeholders are medically appropriate ---
  it("uses medically appropriate blood pressure values", () => {
    const { queryByText } = render(<MoodHistoryScreen {...defaultProps} />);
    // No values above 140 (hypertensive crisis range)
    expect(queryByText(/180 sys/)).toBeNull();
    expect(queryByText(/160 sys/)).toBeNull();
  });

  // --- Bottom Action Bar ---
  it("displays bottom action bar", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("bottom-action-bar")).toBeTruthy();
  });

  it("displays settings button", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("calls onSettings when settings button is pressed", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("settings-button"));
    expect(mockOnSettings).toHaveBeenCalledTimes(1);
  });

  it("displays add button in action bar", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("add-button")).toBeTruthy();
  });

  it("calls onAddMood when add button is pressed", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("add-button"));
    expect(mockOnAddMood).toHaveBeenCalledTimes(1);
  });

  it("displays edit button in action bar", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("edit-button")).toBeTruthy();
  });

  it("calls onEdit when edit button is pressed", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("edit-button"));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  // --- Filter ---
  it("displays filter button", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(getByTestId("filter-button")).toBeTruthy();
  });

  it("calls onFilter when filter button is pressed", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    fireEvent.press(getByTestId("filter-button"));
    expect(mockOnFilter).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("add button has proper accessibility", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    const btn = getByTestId("add-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Add mood entry");
  });

  // --- Dark Mode ---
  it("uses dark background color", () => {
    const { getByTestId } = render(<MoodHistoryScreen {...defaultProps} />);
    const screen = getByTestId("mood-history-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<MoodHistoryScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });

  // --- Chronological order ---
  it("entries are in chronological order (newest first)", () => {
    const { getAllByTestId } = render(
      <MoodHistoryScreen {...defaultProps} />
    );
    const entries = getAllByTestId(/mood-entry-/);
    // First entry should be id "1" (Sep 12), last should be id "5" (Sep 8)
    expect(entries[0].props.testID).toBe("mood-entry-1");
    expect(entries[entries.length - 1].props.testID).toBe("mood-entry-5");
  });
});
