/**
 * JournalEntryDetailScreen Tests — prototype v4.2 #29 reskin (Sprint 8).
 * ≥15 behavior-style tests covering header, mood, body, insight, tags, metadata.
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import {
  JournalEntryDetailScreen,
  DEFAULT_JOURNAL_ENTRY,
  type JournalEntry,
} from "./JournalEntryDetailScreen";

const makeProps = (overrides = {}) => ({
  onBack: jest.fn(),
  onEdit: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("JournalEntryDetailScreen", () => {
  // 1. Render
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("journal-entry-detail-screen")).toBeTruthy();
  });

  // 2. Default fixture title
  it("renders the default entry title", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("entry-title").props.children).toBe("A quiet morning");
  });

  // 3. Back button
  it("calls onBack when back button pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps({ onBack })} />,
    );
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 4. Edit button
  it("calls onEdit when edit button pressed", () => {
    const onEdit = jest.fn();
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps({ onEdit })} />,
    );
    fireEvent.press(getByTestId("edit-button"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  // 5. Date appears
  it("renders the entry date", () => {
    const { getByText } = render(<JournalEntryDetailScreen {...makeProps()} />);
    expect(getByText(/APR 9, 2026/i)).toBeTruthy();
  });

  // 6. Mood label appears
  it("renders the mood label", () => {
    const { getByText } = render(<JournalEntryDetailScreen {...makeProps()} />);
    expect(getByText(/CONTENT/i)).toBeTruthy();
  });

  // 7. Time + read minutes
  it("renders time and read length", () => {
    const { getByText } = render(<JournalEntryDetailScreen {...makeProps()} />);
    expect(getByText("2:45 PM · 4 min read")).toBeTruthy();
  });

  // 8. All paragraphs render
  it("renders all paragraphs from the default fixture", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("entry-paragraph-0")).toBeTruthy();
    expect(getByTestId("entry-paragraph-1")).toBeTruthy();
    expect(getByTestId("entry-paragraph-2")).toBeTruthy();
  });

  // 9. Gratitude items render
  it("renders all gratitude items", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("gratitude-item-0")).toBeTruthy();
    expect(getByTestId("gratitude-item-1")).toBeTruthy();
    expect(getByTestId("gratitude-item-2")).toBeTruthy();
  });

  // 10. Insight card
  it("renders the AI insight card", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("insight-card")).toBeTruthy();
  });

  // 11. Tags render
  it("renders both default tags", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("tag-gratitude")).toBeTruthy();
    expect(getByTestId("tag-morning")).toBeTruthy();
  });

  // 12. Metadata row
  it("renders the metadata footer row", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("metadata-row")).toBeTruthy();
  });

  // 13. Metadata announces full string
  it("metadata row has descriptive accessibility label", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("metadata-row").props.accessibilityLabel).toBe(
      "142 words. Heart rate 68 bpm. Rain 64°.",
    );
  });

  // 14. Custom entry overrides default
  it("renders a custom entry when provided", () => {
    const customEntry: JournalEntry = {
      ...DEFAULT_JOURNAL_ENTRY,
      title: "Spring rain",
      paragraphs: ["Watching the rain fall."],
      gratitudeItems: [],
      tags: ["rain"],
    };
    const { getByTestId, queryByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} entry={customEntry} />,
    );
    expect(getByTestId("entry-title").props.children).toBe("Spring rain");
    expect(getByTestId("entry-paragraph-0")).toBeTruthy();
    expect(queryByTestId("entry-paragraph-1")).toBeNull();
    expect(getByTestId("tag-rain")).toBeTruthy();
  });

  // 15. Empty gratitude list
  it("does not render gratitude list when items is empty", () => {
    const customEntry: JournalEntry = {
      ...DEFAULT_JOURNAL_ENTRY,
      gratitudeItems: [],
    };
    const { queryByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} entry={customEntry} />,
    );
    expect(queryByTestId("gratitude-list")).toBeNull();
  });

  // 16. a11y — title is announced as header
  it("title is announced as a header", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(getByTestId("entry-title").props.accessibilityRole).toBe("header");
  });

  // 17. a11y — back button has button role + label
  it("back button has accessibility role and label", () => {
    const { getByTestId } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    const back = getByTestId("back-button");
    expect(back.props.accessibilityRole).toBe("button");
    expect(back.props.accessibilityLabel).toBe("Go back");
  });

  // 18. Branding — no Freud
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(
      <JournalEntryDetailScreen {...makeProps()} />,
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
