/**
 * StressDecreasedScreen Tests
 * @description Tests for the stress decrease celebration notification
 * @task Task 3.16.5: Stress Decreased Screen (Screen 138)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { StressDecreasedScreen } from "./StressDecreasedScreen";

const mockEmojis = [
  { id: "stressed", emoji: "\uD83D\uDE1F", label: "Stressed" },
  { id: "neutral", emoji: "\uD83D\uDE10", label: "Neutral" },
  { id: "happy", emoji: "\uD83D\uDE0A", label: "Happy" },
];

const defaultProps = {
  currentLevel: "Neutral",
  emojis: mockEmojis,
  highlightedEmojiId: "neutral",
  onBack: jest.fn(),
  onSeeStressLevel: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<StressDecreasedScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("StressDecreasedScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-decreased-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-illustration")).toBeTruthy();
  });

  it("renders the current level", () => {
    const { getByText } = renderScreen();
    expect(getByText("Neutral")).toBeTruthy();
  });

  it("renders 'Stress Decreased!' title (typo fixed)", () => {
    const { getByText } = renderScreen();
    // Audit fix: "Decresased" → "Decreased" (Issue #32)
    expect(getByText("Stress Decreased!")).toBeTruthy();
  });

  it("renders the congratulations message", () => {
    const { getByText } = renderScreen();
    expect(getByText(/You are now Neutral/)).toBeTruthy();
  });

  // ── Mood Transition Row ────────────────────────────────
  it("renders the mood transition row", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mood-transition-row")).toBeTruthy();
  });

  it("renders all emoji items", () => {
    const { getByTestId } = renderScreen();
    mockEmojis.forEach((e) => {
      expect(getByTestId(`emoji-${e.id}`)).toBeTruthy();
    });
  });

  it("highlights the current emoji", () => {
    const { getByTestId } = renderScreen({ highlightedEmojiId: "neutral" });
    const emoji = getByTestId("emoji-neutral");
    const style = Object.assign({}, ...[].concat(emoji.props.style));
    expect(style.opacity).toBeDefined();
  });

  it("renders transition arrows between emojis", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("\u2192").length).toBeGreaterThanOrEqual(1);
  });

  // ── Action Button ──────────────────────────────────────
  it("renders the 'See Stress Level' action button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-stress-button")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSeeStressLevel when action button is pressed", () => {
    const onSeeStressLevel = jest.fn();
    const { getByTestId } = renderScreen({ onSeeStressLevel });
    fireEvent.press(getByTestId("see-stress-button"));
    expect(onSeeStressLevel).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("action button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("see-stress-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("action button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("see-stress-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("stress-decreased-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
