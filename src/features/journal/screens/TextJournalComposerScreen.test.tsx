/**
 * TextJournalComposerScreen Tests — prototype v4.2 #28 reskin (Sprint 7).
 * ≥15 tests covering render, interactions, a11y, word count, and toolbar.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TextJournalComposerScreen } from "./TextJournalComposerScreen";

const noop = jest.fn();

const defaultProps = {
  title: "A quiet morning",
  onTitleChange: noop,
  body: "The rain makes everything feel softer.",
  onBodyChange: noop,
  moodLevel: null as null | (1 | 2 | 3 | 4 | 5),
  onMoodLevelChange: noop,
  hashtags: [] as string[],
  onHashtagsChange: noop,
  onClose: noop,
  onSave: noop,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// 1. Render
describe("TextJournalComposerScreen", () => {
  it("renders the screen container", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("text-journal-composer-screen")).toBeTruthy();
  });

  // 2. Snapshot
  it("matches snapshot", () => {
    const tree = render(<TextJournalComposerScreen {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 3. Title input renders + accepts text
  it("title input renders and calls onTitleChange", () => {
    const onTitleChange = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onTitleChange={onTitleChange} />,
    );
    const input = getByTestId("title-input");
    expect(input).toBeTruthy();
    fireEvent.changeText(input, "My new title");
    expect(onTitleChange).toHaveBeenCalledWith("My new title");
  });

  // 4. Body input renders + accepts text
  it("body input renders and calls onBodyChange", () => {
    const onBodyChange = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onBodyChange={onBodyChange} />,
    );
    const input = getByTestId("body-input");
    expect(input).toBeTruthy();
    fireEvent.changeText(input, "New body text");
    expect(onBodyChange).toHaveBeenCalledWith("New body text");
  });

  // 5. All 5 mood circles render
  it("renders all 5 mood level buttons", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("mood-level-1")).toBeTruthy();
    expect(getByTestId("mood-level-2")).toBeTruthy();
    expect(getByTestId("mood-level-3")).toBeTruthy();
    expect(getByTestId("mood-level-4")).toBeTruthy();
    expect(getByTestId("mood-level-5")).toBeTruthy();
  });

  // 6. Tapping a mood circle calls onMoodLevelChange with correct level
  it("tapping mood level 3 calls onMoodLevelChange with 3", () => {
    const onMoodLevelChange = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onMoodLevelChange={onMoodLevelChange} />,
    );
    fireEvent.press(getByTestId("mood-level-3"));
    expect(onMoodLevelChange).toHaveBeenCalledWith(3);
  });

  it("tapping the already-selected mood level calls onMoodLevelChange with null", () => {
    const onMoodLevelChange = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen
        {...defaultProps}
        moodLevel={2}
        onMoodLevelChange={onMoodLevelChange}
      />,
    );
    fireEvent.press(getByTestId("mood-level-2"));
    expect(onMoodLevelChange).toHaveBeenCalledWith(null);
  });

  // 7. Selected mood circle has accessibilityState.selected = true
  it("selected mood circle has accessibilityState.selected = true", () => {
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} moodLevel={4} />,
    );
    const btn = getByTestId("mood-level-4");
    expect(btn.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
  });

  // 8. Hashtag chips render
  it("renders hashtag chips from default options", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(getByTestId("hashtag-chip-anxious")).toBeTruthy();
    expect(getByTestId("hashtag-chip-hopeful")).toBeTruthy();
    expect(getByTestId("hashtag-chip-tired")).toBeTruthy();
    expect(getByTestId("hashtag-chip-grateful")).toBeTruthy();
  });

  // 9. Tapping a chip toggles selection
  it("tapping unselected chip adds it to hashtags", () => {
    const onHashtagsChange = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen
        {...defaultProps}
        hashtags={[]}
        onHashtagsChange={onHashtagsChange}
      />,
    );
    fireEvent.press(getByTestId("hashtag-chip-anxious"));
    expect(onHashtagsChange).toHaveBeenCalledWith(["anxious"]);
  });

  it("tapping selected chip removes it from hashtags", () => {
    const onHashtagsChange = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen
        {...defaultProps}
        hashtags={["anxious", "hopeful"]}
        onHashtagsChange={onHashtagsChange}
      />,
    );
    fireEvent.press(getByTestId("hashtag-chip-anxious"));
    expect(onHashtagsChange).toHaveBeenCalledWith(["hopeful"]);
  });

  // 10. Suggestion card renders when suggestion prop provided
  it("renders suggestion card when suggestion prop is provided", () => {
    const { getByTestId } = render(
      <TextJournalComposerScreen
        {...defaultProps}
        suggestion={{ title: "Prompt", body: "Try writing about gratitude." }}
        onSuggestionDismiss={noop}
      />,
    );
    expect(getByTestId("suggestion-card")).toBeTruthy();
  });

  // 11. Suggestion card hides when suggestion = null
  it("hides suggestion card when suggestion prop is null", () => {
    const { queryByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} suggestion={null} />,
    );
    expect(queryByTestId("suggestion-card")).toBeNull();
  });

  it("hides suggestion card when suggestion prop is omitted", () => {
    const { queryByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    expect(queryByTestId("suggestion-card")).toBeNull();
  });

  // 12. Suggestion dismiss button calls onSuggestionDismiss
  it("suggestion card dismiss button calls onSuggestionDismiss", () => {
    const onSuggestionDismiss = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen
        {...defaultProps}
        suggestion={{ title: "Prompt", body: "Write about today." }}
        onSuggestionDismiss={onSuggestionDismiss}
      />,
    );
    fireEvent.press(getByTestId("suggestion-card-dismiss"));
    expect(onSuggestionDismiss).toHaveBeenCalledTimes(1);
  });

  // 13. FAB save button calls onSave
  it("FAB save button (testID=save-button) calls onSave", () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onSave={onSave} />,
    );
    fireEvent.press(getByTestId("save-button"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  // 14. Close button calls onClose
  it("close button calls onClose", () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onClose={onClose} />,
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // 15. Word count reflects body length
  it("word count shows 0 words for empty body", () => {
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} body="" />,
    );
    expect(getByTestId("word-count").props.children).toBe("0 words");
  });

  it("word count reflects actual word count of body", () => {
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} body="Hello world today" />,
    );
    expect(getByTestId("word-count").props.children).toBe("3 words");
  });

  it("word count uses singular for 1 word", () => {
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} body="Hello" />,
    );
    expect(getByTestId("word-count").props.children).toBe("1 word");
  });

  // 16. Toolbar buttons call their handlers when provided
  it("toolbar bold button calls onBoldPress", () => {
    const onBoldPress = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onBoldPress={onBoldPress} />,
    );
    fireEvent.press(getByTestId("toolbar-bold"));
    expect(onBoldPress).toHaveBeenCalledTimes(1);
  });

  it("toolbar italic button calls onItalicPress", () => {
    const onItalicPress = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onItalicPress={onItalicPress} />,
    );
    fireEvent.press(getByTestId("toolbar-italic"));
    expect(onItalicPress).toHaveBeenCalledTimes(1);
  });

  it("toolbar mic button calls onMicPress", () => {
    const onMicPress = jest.fn();
    const { getByTestId } = render(
      <TextJournalComposerScreen {...defaultProps} onMicPress={onMicPress} />,
    );
    fireEvent.press(getByTestId("toolbar-mic"));
    expect(onMicPress).toHaveBeenCalledTimes(1);
  });

  // 17. FAB a11y label + role
  it("FAB save button has correct accessibilityLabel and role", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    const fab = getByTestId("save-button");
    expect(fab.props.accessibilityRole).toBe("button");
    expect(fab.props.accessibilityLabel).toBe("Save journal entry");
  });

  // 18. FAB meets 44pt minimum
  it("FAB save button meets 44pt minimum touch target", () => {
    const { getByTestId } = render(<TextJournalComposerScreen {...defaultProps} />);
    const fab = getByTestId("save-button");
    const style = Array.isArray(fab.props.style)
      ? Object.assign({}, ...fab.props.style)
      : fab.props.style;
    expect(style.width).toBeGreaterThanOrEqual(44);
    expect(style.height).toBeGreaterThanOrEqual(44);
  });
});
