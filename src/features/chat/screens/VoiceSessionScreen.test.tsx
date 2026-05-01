/**
 * VoiceSessionScreen Tests — prototype v4.2 #25 (Sprint 8).
 *
 * Behavior-focused: render, header chips, timer formatting, waveform rendering,
 * pause/resume toggle, button accessibility, callbacks, reduced motion safe.
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { ThemeProvider } from "@/shared/theme/useTheme";
import {
  VoiceSessionScreen,
  formatElapsed,
  type VoiceSessionScreenProps,
} from "./VoiceSessionScreen";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps: VoiceSessionScreenProps = {
  onClose: jest.fn(),
  onTogglePause: jest.fn(),
  onSwitchToKeyboard: jest.fn(),
  onEnd: jest.fn(),
};

describe("VoiceSessionScreen (v4.2 #25)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    expect(getByTestId("voice-session-screen")).toBeTruthy();
  });

  it("renders ambient SmokeBlob and BreathingOrb decorations", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    expect(
      getByTestId("bg-smoke", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("bg-orb", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it("renders the close button with correct a11y", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    const btn = getByTestId("close-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("End voice session");
  });

  it("invokes onClose when close pressed", () => {
    const onClose = jest.fn();
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} onClose={onClose} />,
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders the bracket label 'Voice session'", () => {
    const { getByText } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    expect(getByText(/VOICE SESSION/)).toBeTruthy();
  });

  it("renders the timer chip with formatted MM:SS", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} elapsedSeconds={32} />,
    );
    expect(getByTestId("timer-chip").props.accessibilityRole).toBe("timer");
    expect(getByText("00:32")).toBeTruthy();
  });

  it("formats timer for >= 60 seconds", () => {
    const { getByText } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} elapsedSeconds={125} />,
    );
    expect(getByText("02:05")).toBeTruthy();
  });

  it("formatElapsed handles negative inputs", () => {
    expect(formatElapsed(-5)).toBe("00:00");
    expect(formatElapsed(0)).toBe("00:00");
    expect(formatElapsed(59)).toBe("00:59");
    expect(formatElapsed(60)).toBe("01:00");
  });

  it("renders the listening headline (default state)", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    const h = getByTestId("listening-headline");
    expect(h.props.children).toContain("listening");
  });

  it("swaps headline when paused", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} isPaused />,
    );
    const h = getByTestId("listening-headline");
    expect(h.props.children).toContain("Paused");
  });

  it("renders the avatar rings + pulse", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    expect(
      getByTestId("avatar-rings", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      getByTestId("voice-avatar", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it("renders the waveform with 34 bars", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    expect(getByTestId("waveform")).toBeTruthy();
    expect(getByTestId("bar-0")).toBeTruthy();
    expect(getByTestId("bar-33")).toBeTruthy();
  });

  it("renders the keyboard button with a11y", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    const btn = getByTestId("switch-keyboard-button");
    expect(btn.props.accessibilityLabel).toBe("Switch to keyboard");
  });

  it("invokes onSwitchToKeyboard when keyboard button pressed", () => {
    const onSwitchToKeyboard = jest.fn();
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen
        {...baseProps}
        onSwitchToKeyboard={onSwitchToKeyboard}
      />,
    );
    fireEvent.press(getByTestId("switch-keyboard-button"));
    expect(onSwitchToKeyboard).toHaveBeenCalledTimes(1);
  });

  it("renders the pause button when active", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    const btn = getByTestId("toggle-pause-button");
    expect(btn.props.accessibilityLabel).toBe("Pause voice session");
    expect(btn.props.accessibilityState.selected).toBe(false);
  });

  it("renders the resume button when paused", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} isPaused />,
    );
    const btn = getByTestId("toggle-pause-button");
    expect(btn.props.accessibilityLabel).toBe("Resume voice session");
    expect(btn.props.accessibilityState.selected).toBe(true);
  });

  it("invokes onTogglePause when pause/resume pressed", () => {
    const onTogglePause = jest.fn();
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} onTogglePause={onTogglePause} />,
    );
    fireEvent.press(getByTestId("toggle-pause-button"));
    expect(onTogglePause).toHaveBeenCalledTimes(1);
  });

  it("invokes onEnd when end button pressed", () => {
    const onEnd = jest.fn();
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} onEnd={onEnd} />,
    );
    fireEvent.press(getByTestId("end-button"));
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("center pause button is at least 44pt", () => {
    const { getByTestId } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    const btn = getByTestId("toggle-pause-button");
    const styles = Array.isArray(btn.props.style)
      ? btn.props.style.flat()
      : [btn.props.style];
    const merged = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown> | undefined) => ({
        ...acc,
        ...(s ?? {}),
      }),
      {},
    );
    expect(merged.height).toBeGreaterThanOrEqual(44);
    expect(merged.width).toBeGreaterThanOrEqual(44);
  });

  it("does not render legacy 'Voice input' text from the demolished screen", () => {
    const { queryByText } = renderWithTheme(
      <VoiceSessionScreen {...baseProps} />,
    );
    expect(queryByText(/voice input/i)).toBeNull();
  });
});
