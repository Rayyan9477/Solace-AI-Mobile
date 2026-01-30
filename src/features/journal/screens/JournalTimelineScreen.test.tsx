/**
 * JournalTimelineScreen Tests
 * @screen Screen 84: Journal Timeline List
 * @audit batch-17-journal-continued.md
 * @fixes CRITICAL: Replace harmful placeholder content (Issue #84-1, #84-2, #84-3)
 * @fixes Typo: "Im" → "I'm" (Issue #84-6)
 *
 * Visual ref: Mental_Health_Journal_Screen_07.png
 * - "My Journals" title, calendar strip (Mon–Sun)
 * - "Timeline" + "Newest ▼" sort
 * - Chronological entry cards with mood badges, AI suggestions, heart rate
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { JournalTimelineScreen } from "./JournalTimelineScreen";

const sampleCalendar = [
  { dayLabel: "Mon", date: 25, selected: false, moodColor: "#9AAD5C" },
  { dayLabel: "Tue", date: 26, selected: true, moodColor: "#E8853A" },
  { dayLabel: "Wed", date: 27, selected: false, moodColor: "#9AAD5C" },
  { dayLabel: "Thu", date: 28, selected: false, moodColor: "#3D2E23" },
  { dayLabel: "Fri", date: 29, selected: false, moodColor: "#E8853A" },
  { dayLabel: "Sat", date: 30, selected: false, moodColor: "#9AAD5C" },
  { dayLabel: "Sun", date: 3, selected: false, moodColor: "#3D2E23" },
];

const sampleEntries = [
  {
    id: "1",
    time: "10:00",
    title: "Feeling Positive Today!",
    titleEmoji: "😊",
    mood: "Overjoyed",
    moodColor: "#9AAD5C",
    preview:
      "I'm grateful for the supportive phone call I had with my best friend.",
    aiSuggestions: 7,
    heartRate: 96,
  },
  {
    id: "2",
    time: "",
    title: "Got A Gift from my BF, OMG!",
    titleEmoji: "",
    mood: "Happy",
    moodColor: "#C4A535",
    preview:
      "I experienced pure joy today while playing with my dog in the park.",
    aiSuggestions: 7,
    heartRate: 96,
  },
  {
    id: "3",
    time: "09:00",
    title: "Felt Bad, but it's all OK.",
    titleEmoji: "",
    mood: "Neutral",
    moodColor: "#6B6B6B",
    preview: "I felt anxious today during the team meeting. But it's ok.",
    aiSuggestions: 7,
    heartRate: 96,
  },
  {
    id: "4",
    time: "08:00",
    title: "Felt Sad & Grief. IDK what to do.",
    titleEmoji: "",
    mood: "Sad",
    moodColor: "#E8853A",
    preview: "Feeling sad today after hearing a touching but heartbreaking news.",
    aiSuggestions: 7,
    heartRate: 96,
  },
  {
    id: "5",
    time: "07:00",
    title: "Reflecting on a difficult day",
    titleEmoji: "",
    mood: "Depressed",
    moodColor: "#7B68B5",
    preview: "Processing some challenging news I received today.",
    aiSuggestions: 7,
    heartRate: 96,
  },
];

describe("JournalTimelineScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnDaySelect = jest.fn();
  const mockOnEntryPress = jest.fn();
  const mockOnSortChange = jest.fn();

  const defaultProps = {
    calendarDays: sampleCalendar,
    entries: sampleEntries,
    sortOrder: "newest" as const,
    onBack: mockOnBack,
    onDaySelect: mockOnDaySelect,
    onEntryPress: mockOnEntryPress,
    onSortChange: mockOnSortChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByTestId("journal-timeline-screen")).toBeTruthy();
  });

  it("uses dark background", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByTestId("journal-timeline-screen").props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Header ---
  it("displays back button", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText("My Journals")).toBeTruthy();
  });

  // --- Calendar Strip ---
  it("renders the calendar strip", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByTestId("calendar-strip")).toBeTruthy();
  });

  it("renders all 7 calendar days", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    for (let i = 0; i < 7; i++) {
      expect(getByTestId(`calendar-day-${i}`)).toBeTruthy();
    }
  });

  it("displays day labels and dates", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Tue")).toBeTruthy();
    expect(getByText("Sun")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
    expect(getByText("26")).toBeTruthy();
  });

  it("highlights the selected day", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    const selectedDay = getByTestId("calendar-day-1");
    const flatStyle = Array.isArray(selectedDay.props.style)
      ? Object.assign({}, ...selectedDay.props.style)
      : selectedDay.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  it("calls onDaySelect when a calendar day is pressed", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("calendar-day-0"));
    expect(mockOnDaySelect).toHaveBeenCalledWith(0);
  });

  it("renders mood dots in calendar", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByTestId("calendar-mood-dot-0")).toBeTruthy();
  });

  // --- Sort Section ---
  it("displays Timeline label", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText("Timeline")).toBeTruthy();
  });

  it("displays sort control", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByTestId("sort-button")).toBeTruthy();
  });

  it("shows current sort order", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText(/Newest/)).toBeTruthy();
  });

  it("calls onSortChange when sort is pressed", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("sort-button"));
    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
  });

  // --- Timeline Entries ---
  it("renders all journal entries", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    sampleEntries.forEach((entry) => {
      expect(getByTestId(`entry-card-${entry.id}`)).toBeTruthy();
    });
  });

  it("displays entry titles", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText(/Feeling Positive Today!/)).toBeTruthy();
    expect(getByText(/Felt Bad, but it's all OK\./)).toBeTruthy();
  });

  it("displays mood badges", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText("Overjoyed")).toBeTruthy();
    expect(getByText("Happy")).toBeTruthy();
    expect(getByText("Neutral")).toBeTruthy();
    expect(getByText("Sad")).toBeTruthy();
    expect(getByText("Depressed")).toBeTruthy();
  });

  it("displays entry previews", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(
      getByText(/I'm grateful for the supportive phone call/)
    ).toBeTruthy();
  });

  it("displays AI suggestion counts", () => {
    const { getAllByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getAllByText(/7 AI Suggestions/).length).toBe(5);
  });

  it("displays heart rate values", () => {
    const { getAllByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getAllByText(/96bpm/).length).toBe(5);
  });

  it("displays time labels", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText("10:00")).toBeTruthy();
    expect(getByText("09:00")).toBeTruthy();
    expect(getByText("08:00")).toBeTruthy();
    expect(getByText("07:00")).toBeTruthy();
  });

  it("calls onEntryPress when an entry card is pressed", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("entry-card-1"));
    expect(mockOnEntryPress).toHaveBeenCalledWith("1");
  });

  // --- Timeline Connector ---
  it("renders timeline connector", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByTestId("timeline-connector")).toBeTruthy();
  });

  // --- CRITICAL AUDIT FIXES ---
  it("does not contain harmful placeholder content (audit fix #84-1)", () => {
    const { queryByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(queryByText(/wanna end myself/i)).toBeNull();
    expect(queryByText(/end myself/i)).toBeNull();
  });

  it("does not contain violent placeholder content (audit fix #84-2)", () => {
    const { queryByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(queryByText(/got killed/i)).toBeNull();
    expect(queryByText(/car accident/i)).toBeNull();
  });

  it("does not contain profanity (audit fix #84-3)", () => {
    const { queryByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(queryByText(/fucking/i)).toBeNull();
  });

  it("uses safe replacement for depressed entry (audit fix)", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText("Reflecting on a difficult day")).toBeTruthy();
    expect(
      getByText(/Processing some challenging news/)
    ).toBeTruthy();
  });

  it("uses corrected grammar: I'm instead of Im (audit fix #84-6)", () => {
    const { getByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(getByText(/I'm grateful/)).toBeTruthy();
  });

  // --- Accessibility ---
  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("calendar days have proper accessibility", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    const day = getByTestId("calendar-day-0");
    expect(day.props.accessibilityRole).toBe("button");
  });

  it("entry cards have proper accessibility", () => {
    const { getByTestId } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    const card = getByTestId("entry-card-1");
    expect(card.props.accessibilityRole).toBe("button");
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <JournalTimelineScreen {...defaultProps} />
    );
    expect(queryByText(/Freud/)).toBeNull();
  });
});
