/**
 * NewJournalTypeSelectorScreen Tests
 * @screen Screen 80: New Journal Type Selector
 * @audit batch-17-journal-continued.md
 * @fixes Typo: "Automaticly" → "Automatically", "ealth" → "health"
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NewJournalTypeSelectorScreen } from "./NewJournalTypeSelectorScreen";

describe("NewJournalTypeSelectorScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSelectVoice = jest.fn();
  const mockOnSelectText = jest.fn();
  const mockOnCreate = jest.fn();

  const defaultProps = {
    selectedType: null as "voice" | "text" | null,
    onBack: mockOnBack,
    onSelectVoice: mockOnSelectVoice,
    onSelectText: mockOnSelectText,
    onCreate: mockOnCreate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByTestId("new-journal-type-screen")).toBeTruthy();
  });

  it("uses dark background", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByTestId("new-journal-type-screen").props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  it("displays the title", () => {
    const { getByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByText("New Mental Health Journal")).toBeTruthy();
  });

  it("displays back button", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  // --- Voice Journal Card ---
  it("displays Voice Journal option", () => {
    const { getByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByText("Voice Journal")).toBeTruthy();
  });

  it("displays corrected voice journal description (audit fix)", () => {
    const { getByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    // Fixed typo: "Automaticly" → "Automatically", "ealth" → "health"
    expect(
      getByText(/Automatically create health journal/)
    ).toBeTruthy();
  });

  it("calls onSelectVoice when voice card is pressed", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("voice-journal-card"));
    expect(mockOnSelectVoice).toHaveBeenCalledTimes(1);
  });

  it("displays chevron on voice card", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByTestId("voice-card-chevron")).toBeTruthy();
  });

  // --- Text Journal Card ---
  it("displays Text Journal option", () => {
    const { getByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByText("Text journal")).toBeTruthy();
  });

  it("displays text journal description", () => {
    const { getByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(
      getByText(/Set up manual text journal based on your current mood/)
    ).toBeTruthy();
  });

  it("calls onSelectText when text card is pressed", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("text-journal-card"));
    expect(mockOnSelectText).toHaveBeenCalledTimes(1);
  });

  // --- Create Button ---
  it("displays Create Journal button", () => {
    const { getByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByText(/Create Journal/)).toBeTruthy();
  });

  it("calls onCreate when create button is pressed", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("create-journal-button"));
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  // --- Selected State ---
  it("highlights selected voice card", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} selectedType="voice" />
    );
    const card = getByTestId("voice-journal-card");
    const flatStyle = Array.isArray(card.props.style)
      ? Object.assign({}, ...card.props.style)
      : card.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ borderColor: "#C4A574" })
    );
  });

  // --- Accessibility ---
  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("create button has proper accessibility", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    const btn = getByTestId("create-journal-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("journal cards have proper accessibility roles", () => {
    const { getByTestId } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(getByTestId("voice-journal-card").props.accessibilityRole).toBe(
      "button"
    );
    expect(getByTestId("text-journal-card").props.accessibilityRole).toBe(
      "button"
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(queryByText(/Freud/)).toBeNull();
  });

  it("does not contain original typos from audit", () => {
    const { queryByText } = render(
      <NewJournalTypeSelectorScreen {...defaultProps} />
    );
    expect(queryByText(/Automaticly/)).toBeNull();
    // Original design had "ealth" (missing 'h') — verify we use "health"
    expect(queryByText(/\bealth\b/)).toBeNull();
  });
});
