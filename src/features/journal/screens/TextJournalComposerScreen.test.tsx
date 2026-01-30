/**
 * TextJournalComposerScreen Tests
 * @screen Screen 83: Text Journal Composer
 * @audit batch-17-journal-continued.md
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TextJournalComposerScreen } from "./TextJournalComposerScreen";

describe("TextJournalComposerScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnTitleChange = jest.fn();
  const mockOnContentChange = jest.fn();
  const mockOnStressLevelChange = jest.fn();
  const mockOnEmotionSelect = jest.fn();
  const mockOnStressorSelect = jest.fn();
  const mockOnCreate = jest.fn();
  const mockOnTabChange = jest.fn();
  const mockOnUndo = jest.fn();
  const mockOnRedo = jest.fn();

  const mockEmotions = [
    { id: "angry", emoji: "😤", selected: true },
    { id: "sad", emoji: "😞", selected: false },
    { id: "neutral", emoji: "😐", selected: false },
    { id: "happy", emoji: "🙂", selected: false },
    { id: "overjoyed", emoji: "😄", selected: false },
  ];

  const mockStressors = [
    { id: "loneliness", label: "Loneliness", selected: true },
    { id: "money", label: "Money Issue", selected: false },
    { id: "patience", label: "Patience", selected: false },
  ];

  const defaultProps = {
    activeTab: "text" as const,
    title: "Feeling Bad Again",
    content: "I had a bad day today, at school... It's fine I guess...",
    stressLevel: 3,
    emotions: mockEmotions,
    stressors: mockStressors,
    onBack: mockOnBack,
    onTitleChange: mockOnTitleChange,
    onContentChange: mockOnContentChange,
    onStressLevelChange: mockOnStressLevelChange,
    onEmotionSelect: mockOnEmotionSelect,
    onStressorSelect: mockOnStressorSelect,
    onCreate: mockOnCreate,
    onTabChange: mockOnTabChange,
    onUndo: mockOnUndo,
    onRedo: mockOnRedo,
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders the screen container", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("text-journal-composer-screen")).toBeTruthy();
  });

  it("displays 'Add New Journal' title", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Add New Journal")).toBeTruthy();
  });

  // --- Tabs ---
  it("displays Text/Voice tab selector", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("tab-selector")).toBeTruthy();
  });

  it("displays Text tab", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Text")).toBeTruthy();
  });

  it("displays Voice tab", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Voice")).toBeTruthy();
  });

  // --- Journal Title ---
  it("displays 'Journal Title' label", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Journal Title")).toBeTruthy();
  });

  it("displays journal title value", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Feeling Bad Again")).toBeTruthy();
  });

  // --- Write Your Entry ---
  it("displays 'Write Your Entry' label", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Write Your Entry")).toBeTruthy();
  });

  it("displays entry content", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText(/I had a bad day today/)).toBeTruthy();
  });

  // --- Undo/Redo ---
  it("displays undo button", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("undo-button")).toBeTruthy();
  });

  it("calls onUndo when undo is pressed", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("undo-button"));
    expect(mockOnUndo).toHaveBeenCalledTimes(1);
  });

  it("displays redo button", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("redo-button")).toBeTruthy();
  });

  // --- Stress Level ---
  it("displays 'Stress Level' label", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Stress Level")).toBeTruthy();
  });

  it("displays stress level scale labels (1, 3, 5)", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("1")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
  });

  // --- Emotions ---
  it("displays 'Select Your Emotion' label", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Select Your Emotion")).toBeTruthy();
  });

  it("renders emotion options", () => {
    const { getAllByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    const emotions = getAllByTestId(/emotion-/);
    expect(emotions.length).toBe(5);
  });

  it("calls onEmotionSelect when emotion is tapped", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("emotion-sad"));
    expect(mockOnEmotionSelect).toHaveBeenCalledWith("sad");
  });

  // --- Stressors ---
  it("displays 'Select Stressor' label", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Select Stressor")).toBeTruthy();
  });

  it("renders stressor chips", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText("Loneliness")).toBeTruthy();
    expect(getByText("Money Issue")).toBeTruthy();
  });

  it("calls onStressorSelect when stressor chip is tapped", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("stressor-money"));
    expect(mockOnStressorSelect).toHaveBeenCalledWith("money");
  });

  // --- Create Button ---
  it("displays Create Journal button", () => {
    const { getByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByText(/Create Journal/)).toBeTruthy();
  });

  it("calls onCreate when create button is pressed", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    fireEvent.press(getByTestId("create-journal-button"));
    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
    expect(btn.props.style).toEqual(expect.objectContaining({ minHeight: 44 }));
  });

  it("create button meets minimum touch target", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("create-journal-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
