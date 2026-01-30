/**
 * JournalEntryEditorScreen Tests
 * @screen Screen 85: Journal Entry Editor
 * @audit batch-18-journal-final-sleep-start.md
 *
 * Visual ref: Mental_Health_Journal_Screen_08.png
 * - "Edit Journal" header, back button
 * - "Feeling Bad Again! 😡" title
 * - Multi-paragraph content with green keyword highlight
 * - Undo (green) / Redo (brown) circular buttons
 * - "Tap to continue your journal!" prompt
 * - Bottom toolbar: Home (orange), Edit, Share, Settings
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { JournalEntryEditorScreen } from "./JournalEntryEditorScreen";

describe("JournalEntryEditorScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnUndo = jest.fn();
  const mockOnRedo = jest.fn();
  const mockOnHome = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnShare = jest.fn();
  const mockOnSettings = jest.fn();

  const defaultProps = {
    title: "Feeling Bad Again!",
    titleEmoji: "😡",
    content:
      "I just felt so overwhelmed, you know? It's like everything piled up at once.\n\nMaybe I'm just stressed about exams and assignments. I try to stay positive, but some days it's really hard. Do you have any tips on managing stress and staying calm in situations like this?",
    highlightedText: "calm in situations",
    onBack: mockOnBack,
    onUndo: mockOnUndo,
    onRedo: mockOnRedo,
    onHome: mockOnHome,
    onEdit: mockOnEdit,
    onShare: mockOnShare,
    onSettings: mockOnSettings,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("journal-entry-editor-screen")).toBeTruthy();
  });

  it("uses dark background", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("journal-entry-editor-screen").props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Header ---
  it("displays back button", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays header title", () => {
    const { getByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByText("Edit Journal")).toBeTruthy();
  });

  // --- Entry Title ---
  it("displays the journal entry title", () => {
    const { getByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByText(/Feeling Bad Again!/)).toBeTruthy();
  });

  it("displays the title emoji", () => {
    const { getByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByText(/😡/)).toBeTruthy();
  });

  // --- Content ---
  it("displays the journal content", () => {
    const { getByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(
      getByText(/I just felt so overwhelmed, you know\?/)
    ).toBeTruthy();
  });

  it("displays full content text", () => {
    const { getByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(
      getByText(/tips on managing stress/)
    ).toBeTruthy();
  });

  // --- Highlighted Text ---
  it("renders the highlighted text section", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("text-highlight")).toBeTruthy();
  });

  it("displays the highlighted phrase", () => {
    const { getByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByText("calm in situations")).toBeTruthy();
  });

  it("highlight has green background color", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const highlight = getByTestId("text-highlight");
    const flatStyle = Array.isArray(highlight.props.style)
      ? Object.assign({}, ...highlight.props.style)
      : highlight.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  // --- Undo/Redo ---
  it("displays undo button", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("undo-button")).toBeTruthy();
  });

  it("displays redo button", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("redo-button")).toBeTruthy();
  });

  it("calls onUndo when undo is pressed", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("undo-button"));
    expect(mockOnUndo).toHaveBeenCalledTimes(1);
  });

  it("calls onRedo when redo is pressed", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("redo-button"));
    expect(mockOnRedo).toHaveBeenCalledTimes(1);
  });

  it("undo button has green background", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const btn = getByTestId("undo-button");
    const flatStyle = Array.isArray(btn.props.style)
      ? Object.assign({}, ...btn.props.style)
      : btn.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  it("redo button has brown background", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const btn = getByTestId("redo-button");
    const flatStyle = Array.isArray(btn.props.style)
      ? Object.assign({}, ...btn.props.style)
      : btn.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#3D2E23" })
    );
  });

  // --- Prompt Text ---
  it("displays prompt text", () => {
    const { getByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByText("Tap to continue your journal!")).toBeTruthy();
  });

  // --- Bottom Toolbar ---
  it("renders the bottom toolbar", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("bottom-toolbar")).toBeTruthy();
  });

  it("displays home button", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("toolbar-home")).toBeTruthy();
  });

  it("displays edit button", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("toolbar-edit")).toBeTruthy();
  });

  it("displays share button", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("toolbar-share")).toBeTruthy();
  });

  it("displays settings button", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("toolbar-settings")).toBeTruthy();
  });

  it("calls onHome when home toolbar button is pressed", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("toolbar-home"));
    expect(mockOnHome).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit when edit toolbar button is pressed", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("toolbar-edit"));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onShare when share toolbar button is pressed", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("toolbar-share"));
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it("calls onSettings when settings toolbar button is pressed", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("toolbar-settings"));
    expect(mockOnSettings).toHaveBeenCalledTimes(1);
  });

  it("home button has orange background", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const btn = getByTestId("toolbar-home");
    const flatStyle = Array.isArray(btn.props.style)
      ? Object.assign({}, ...btn.props.style)
      : btn.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  // --- Accessibility ---
  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("undo button has proper accessibility", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const btn = getByTestId("undo-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Undo");
  });

  it("redo button has proper accessibility", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const btn = getByTestId("redo-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Redo");
  });

  it("toolbar buttons have proper accessibility", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(getByTestId("toolbar-home").props.accessibilityRole).toBe("button");
    expect(getByTestId("toolbar-edit").props.accessibilityRole).toBe("button");
    expect(getByTestId("toolbar-share").props.accessibilityRole).toBe("button");
    expect(getByTestId("toolbar-settings").props.accessibilityRole).toBe(
      "button"
    );
  });

  it("toolbar buttons meet minimum touch target", () => {
    const { getByTestId } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    const btn = getByTestId("toolbar-home");
    const flatStyle = Array.isArray(btn.props.style)
      ? Object.assign({}, ...btn.props.style)
      : btn.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <JournalEntryEditorScreen {...defaultProps} />
    );
    expect(queryByText(/Freud/)).toBeNull();
  });
});
