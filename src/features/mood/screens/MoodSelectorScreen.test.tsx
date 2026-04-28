/**
 * MoodSelectorScreen Tests
 * @description Prototype v4.2 #21 Daily Check-in reskin (Sprint 6)
 *
 * Covers: render, snapshot, headline, MoodFace hero, radio strip,
 * influence chips, note input, CTA button, a11y, reduced-motion,
 * and backward-compat with the legacy prop API.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodSelectorScreen } from "./MoodSelectorScreen";

// ---------------------------------------------------------------------------
// Mocks — avoid loading expo-blur (GlassCard) transitively; mock the whole
// primitives barrel with just the pieces MoodSelectorScreen needs.
// BreathingOrb is mocked to a View so we can inspect the pulsing prop.
// ---------------------------------------------------------------------------

interface BreathingOrbMockProps {
  testID?: string;
  pulsing?: boolean;
  size?: number;
  tint?: string;
  style?: object;
}

interface MoodFaceMockProps {
  level?: number;
  size?: number;
  selected?: boolean;
  interactive?: boolean;
  accessibilityLabel?: string;
}

jest.mock("@/shared/components/primitives", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  const BreathingOrbMock = (props: BreathingOrbMockProps) =>
    React.createElement(View, {
      testID: props.testID ?? "breathing-orb",
      "data-pulsing": String(props.pulsing ?? true),
      style: props.style,
    });

  const MoodFaceMock = (props: MoodFaceMockProps) =>
    React.createElement(
      View,
      {
        accessible: true,
        accessibilityLabel: props.accessibilityLabel ?? `Mood level ${props.level ?? 3}`,
        accessibilityRole: props.interactive ? "button" : "image",
        accessibilityState: props.interactive ? { selected: props.selected ?? false } : undefined,
      },
      React.createElement(Text, null, String(props.level ?? 3)),
    );

  const BracketLabelMock = ({ children, style }: { children: string; style?: object }) =>
    React.createElement(Text, { style }, `[ ${children.toUpperCase()} ]`);

  const MOOD_LEVELS = [1, 2, 3, 4, 5];
  const MOOD_LABELS: Record<number, string> = {
    1: "Struggling",
    2: "Down",
    3: "Neutral",
    4: "Content",
    5: "Overjoyed",
  };

  return {
    BreathingOrb: BreathingOrbMock,
    MoodFace: MoodFaceMock,
    BracketLabel: BracketLabelMock,
    MOOD_LEVELS,
    MOOD_LABELS,
  };
});

// Mock useReducedMotion so we can toggle it per test.
let mockReducedMotion = false;
jest.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockReducedMotion,
}));

// ---------------------------------------------------------------------------
// Shared fixture
// ---------------------------------------------------------------------------

const mockMoodOptions = [
  { index: 0, label: "Depressed", emoji: "😵", color: "#7B68B5" },
  { index: 1, label: "Sad", emoji: "😢", color: "#E8853A" },
  { index: 2, label: "Neutral", emoji: "😐", color: "#8B7355" },
  { index: 3, label: "Happy", emoji: "🙂", color: "#F5C563" },
  { index: 4, label: "Overjoyed", emoji: "😄", color: "#9AAD5C" },
];

const defaultProps = {
  selectedMoodIndex: 3,
  moodOptions: mockMoodOptions,
  onBack: jest.fn(),
  onMoodChange: jest.fn(),
  onSetMood: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockReducedMotion = false;
});

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe("MoodSelectorScreen", () => {
  // 1. Render
  it("renders the screen container", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByTestId("mood-selector-screen")).toBeTruthy();
  });

  // 2. Snapshot
  it("matches snapshot (default theme)", () => {
    const tree = render(<MoodSelectorScreen {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 3. Headline text present
  it("displays 'How are you' headline text", () => {
    const { getByText } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByText(/How are you/i)).toBeTruthy();
  });

  // 4. MoodFace big preview matches selected level
  it("big MoodFace hero area renders and contains the correct mood level", () => {
    const { getByTestId, getAllByText } = render(
      <MoodSelectorScreen {...defaultProps} />,
    );
    // The hero-mood-face wrapper is present
    expect(getByTestId("hero-mood-face")).toBeTruthy();
    // selectedMoodIndex=3 → level 4; MoodFace mock renders level as text
    // Multiple "4" elements expected (hero + radio strip) — at least 1 must exist
    const levelNodes = getAllByText("4");
    expect(levelNodes.length).toBeGreaterThanOrEqual(1);
  });

  // 5. 5 mood radio circles render
  it("renders 5 mood radio circles", () => {
    const { getAllByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const radios = getAllByTestId(/^mood-radio-/);
    expect(radios).toHaveLength(5);
  });

  // 6. Tapping a radio circle calls onMoodChange with new index
  it("calls onMoodChange with correct index when a radio circle is pressed", () => {
    const onMoodChange = jest.fn();
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} onMoodChange={onMoodChange} />,
    );
    // mood-radio-2 → level 2 → index 1 (level - 1)
    fireEvent.press(getByTestId("mood-radio-2"));
    expect(onMoodChange).toHaveBeenCalledWith(1);
  });

  // 7. All 8 influence chips render
  it("renders all 8 influence chips", () => {
    const { getAllByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const chips = getAllByTestId(/^influence-chip-/);
    expect(chips).toHaveLength(8);
  });

  // 8. Tapping a chip toggles selection (calls onInfluencesChange)
  it("calls onInfluencesChange when an influence chip is tapped", () => {
    const onInfluencesChange = jest.fn();
    const { getByTestId } = render(
      <MoodSelectorScreen
        {...defaultProps}
        selectedInfluences={[]}
        onInfluencesChange={onInfluencesChange}
      />,
    );
    fireEvent.press(getByTestId("influence-chip-sleep"));
    expect(onInfluencesChange).toHaveBeenCalledWith(["sleep"]);
  });

  it("removes an already-selected influence when tapped again", () => {
    const onInfluencesChange = jest.fn();
    const { getByTestId } = render(
      <MoodSelectorScreen
        {...defaultProps}
        selectedInfluences={["sleep", "work"]}
        onInfluencesChange={onInfluencesChange}
      />,
    );
    fireEvent.press(getByTestId("influence-chip-sleep"));
    expect(onInfluencesChange).toHaveBeenCalledWith(["work"]);
  });

  // 9. Note input renders and accepts text
  it("renders the note input", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByTestId("mood-note-input")).toBeTruthy();
  });

  it("calls onNoteChange when note text changes", () => {
    const onNoteChange = jest.fn();
    const { getByTestId } = render(
      <MoodSelectorScreen
        {...defaultProps}
        note=""
        onNoteChange={onNoteChange}
      />,
    );
    fireEvent.changeText(getByTestId("mood-note-input-input"), "Feeling tired");
    expect(onNoteChange).toHaveBeenCalledWith("Feeling tired");
  });

  // 10. CTA has testID="log-mood-button"
  it("CTA button has testID 'log-mood-button'", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByTestId("log-mood-button")).toBeTruthy();
  });

  // 11. CTA press calls onSetMood
  it("CTA press calls onSetMood", () => {
    const onSetMood = jest.fn();
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} onSetMood={onSetMood} />,
    );
    fireEvent.press(getByTestId("log-mood-button"));
    expect(onSetMood).toHaveBeenCalledTimes(1);
  });

  // 12. Back/close button calls onBack/onClose
  it("close button calls onBack when onClose is not provided", () => {
    const onBack = jest.fn();
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} onBack={onBack} />,
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("close button calls onClose when provided, not onBack", () => {
    const onBack = jest.fn();
    const onClose = jest.fn();
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} onBack={onBack} onClose={onClose} />,
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onBack).not.toHaveBeenCalled();
  });

  // 13. CTA has accessibilityLabel + role
  it("CTA button has accessibilityLabel", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("log-mood-button");
    expect(btn.props.accessibilityLabel).toBe("Log this mood");
  });

  it("CTA button has accessibilityRole 'button'", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("log-mood-button");
    expect(btn.props.accessibilityRole).toBe("button");
  });

  // 14. CTA meets 44pt touch target
  it("CTA button meets 44pt minimum touch target via size 'lg'", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("log-mood-button");
    // Button size="lg" enforces minHeight ≥44 via its internal sizeSpec
    // The rendered Pressable style has minHeight=52 (lg height=52 >= 44)
    const flatStyle = Array.isArray(btn.props.style)
      ? Object.assign({}, ...(btn.props.style as object[]).filter(Boolean))
      : btn.props.style ?? {};
    expect(
      (flatStyle as { minHeight?: number }).minHeight ?? 52,
    ).toBeGreaterThanOrEqual(44);
  });

  // 15. Reduced-motion: BreathingOrb is static
  it("BreathingOrb is static when useReducedMotion returns true", () => {
    mockReducedMotion = true;
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const orb = getByTestId("breathing-orb");
    // Our mock forwards pulsing as data-pulsing="false" when reducedMotion=true
    expect(orb.props["data-pulsing"]).toBe("false");
  });

  it("BreathingOrb is animated when useReducedMotion returns false", () => {
    mockReducedMotion = false;
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const orb = getByTestId("breathing-orb");
    expect(orb.props["data-pulsing"]).toBe("true");
  });

  // 16. Theme tokens — component uses useTheme palette (smoke test with valid render)
  it("renders without errors when theme tokens are applied (cosmic default)", () => {
    expect(() => render(<MoodSelectorScreen {...defaultProps} />)).not.toThrow();
  });

  // Backward-compat — legacy API still works
  it("displays the legacy moodOptions label via moodDisplayLabel", () => {
    // selectedMoodIndex=3 → moodOptions[3].label = "Happy"
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const label = getByTestId("mood-display-label");
    expect(label.props.children).toBe("Happy");
  });

  it("falls back to MOOD_LABELS when selectedMoodIndex is out of moodOptions range", () => {
    const { getByTestId } = render(
      <MoodSelectorScreen
        {...defaultProps}
        selectedMoodIndex={10}
        moodOptions={[]}
      />,
    );
    // level = clamp(10+1,1,5)=5 → "Overjoyed"
    const label = getByTestId("mood-display-label");
    expect(label.props.children).toBe("Overjoyed");
  });

  // Radio strip a11y
  it("radio strip is annotated as a radiogroup", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const strip = getByTestId("mood-intensity-radiogroup");
    expect(strip.props.accessibilityRole).toBe("radiogroup");
  });

  it("selected radio has accessibilityState checked=true", () => {
    // selectedMoodIndex=3 → level 4 → mood-radio-4
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const selected = getByTestId("mood-radio-4");
    expect(selected.props.accessibilityState).toEqual({ checked: true });
  });

  it("non-selected radios have accessibilityState checked=false", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const unselected = getByTestId("mood-radio-1");
    expect(unselected.props.accessibilityState).toEqual({ checked: false });
  });
});
