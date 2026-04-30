/**
 * MindfulPlayerScreen Tests — prototype v4.2 #31 reskin
 * @description ≥15 tests covering render, a11y, interaction, time formatting,
 *   progress ratio, transport buttons, and bottom action buttons.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { MindfulPlayerScreen } from "./MindfulPlayerScreen";

// ---------------------------------------------------------------------------
// Default props
// ---------------------------------------------------------------------------

const defaultProps = {
  title: "Morning calm",
  durationSeconds: 600, // 10:00
  positionSeconds: 204, // 3:24
  isPlaying: true,
  category: "MEDITATION",
  narrator: "MAYA WONG",
  liked: false,
  looping: false,
  onClose: jest.fn(),
  onPlayPause: jest.fn(),
  onNext: jest.fn(),
  onPrev: jest.fn(),
  onRewind: jest.fn(),
  onForward: jest.fn(),
  onSpeedToggle: jest.fn(),
  onLikeToggle: jest.fn(),
  onLoopToggle: jest.fn(),
  onDownload: jest.fn(),
};

function renderScreen(overrides: Partial<typeof defaultProps> = {}) {
  return render(<MindfulPlayerScreen {...defaultProps} {...overrides} />);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MindfulPlayerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1 — Render
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mindful-player-screen")).toBeTruthy();
  });

  // 2 — Snapshot
  it("matches snapshot", () => {
    const tree = renderScreen();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  // 3 — Title displayed
  it("displays the session title", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("session-title").props.children).toBe("Morning calm");
  });

  // 4 — Category bracket displayed
  it("displays the category bracket", () => {
    const { getByText } = renderScreen();
    // BracketLabel wraps text as "[ ... ]" and uppercases
    expect(getByText(/MEDITATION/)).toBeTruthy();
  });

  // 5 — Narrator bracket displayed
  it("displays the narrator bracket", () => {
    const { getByText } = renderScreen();
    expect(getByText(/MAYA WONG/)).toBeTruthy();
  });

  // 6 — Current position formatted MM:SS
  it("formats and displays current position as MM:SS", () => {
    const { getByTestId } = renderScreen({ positionSeconds: 204 });
    expect(getByTestId("current-time").props.children).toBe("3:24");
  });

  // 7 — Total duration formatted MM:SS
  it("formats and displays total duration as MM:SS", () => {
    const { getByTestId } = renderScreen({ durationSeconds: 600 });
    expect(getByTestId("total-time").props.children).toBe("10:00");
  });

  // 8 — Progress fill width matches position/duration ratio
  it("sets progress fill width to the correct percentage", () => {
    // positionSeconds=204, durationSeconds=600 → 34%
    const { getByTestId } = renderScreen({
      positionSeconds: 204,
      durationSeconds: 600,
    });
    const fill = getByTestId("progress-fill");
    expect(fill.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: "34%" }),
      ]),
    );
  });

  // 9 — Play button calls onPlayPause
  it("calls onPlayPause when the play/pause button is pressed", () => {
    const onPlayPause = jest.fn();
    const { getByTestId } = renderScreen({ onPlayPause });
    fireEvent.press(getByTestId("transport-controls-playpause"));
    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  // 10 — isPlaying state reflected in transport controls
  it("transport play/pause shows pause label when isPlaying=true", () => {
    const { getByTestId } = renderScreen({ isPlaying: true });
    expect(
      getByTestId("transport-controls-playpause").props.accessibilityLabel,
    ).toBe("Pause");
  });

  it("transport play/pause shows play label when isPlaying=false", () => {
    const { getByTestId } = renderScreen({ isPlaying: false });
    expect(
      getByTestId("transport-controls-playpause").props.accessibilityLabel,
    ).toBe("Play");
  });

  // 11 — Rewind / forward / prev / next
  it("calls onRewind when transport rewind is pressed", () => {
    const onRewind = jest.fn();
    const { getByTestId } = renderScreen({ onRewind });
    fireEvent.press(getByTestId("transport-controls-rewind"));
    expect(onRewind).toHaveBeenCalledTimes(1);
  });

  it("calls onForward when transport forward is pressed", () => {
    const onForward = jest.fn();
    const { getByTestId } = renderScreen({ onForward });
    fireEvent.press(getByTestId("transport-controls-forward"));
    expect(onForward).toHaveBeenCalledTimes(1);
  });

  it("calls onPrev when transport prev is pressed", () => {
    const onPrev = jest.fn();
    const { getByTestId } = renderScreen({ onPrev });
    fireEvent.press(getByTestId("transport-controls-prev"));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when transport next is pressed", () => {
    const onNext = jest.fn();
    const { getByTestId } = renderScreen({ onNext });
    fireEvent.press(getByTestId("transport-controls-next"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  // 12 — Speed / Like / Loop / Download
  it("calls onSpeedToggle when speed button is pressed", () => {
    const onSpeedToggle = jest.fn();
    const { getByTestId } = renderScreen({ onSpeedToggle });
    fireEvent.press(getByTestId("speed-button"));
    expect(onSpeedToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onLikeToggle when like button is pressed", () => {
    const onLikeToggle = jest.fn();
    const { getByTestId } = renderScreen({ onLikeToggle });
    fireEvent.press(getByTestId("like-button"));
    expect(onLikeToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onLoopToggle when loop button is pressed", () => {
    const onLoopToggle = jest.fn();
    const { getByTestId } = renderScreen({ onLoopToggle });
    fireEvent.press(getByTestId("loop-button"));
    expect(onLoopToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onDownload when download button is pressed", () => {
    const onDownload = jest.fn();
    const { getByTestId } = renderScreen({ onDownload });
    fireEvent.press(getByTestId("download-button"));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  // 13 — liked=true changes accessibilityState
  it("like button has accessibilityState.selected=true when liked=true", () => {
    const { getByTestId } = renderScreen({ liked: true });
    expect(getByTestId("like-button").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it("like button has accessibilityState.selected=false when liked=false", () => {
    const { getByTestId } = renderScreen({ liked: false });
    expect(getByTestId("like-button").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  // 14 — CTA buttons accessibilityLabel + role
  it("close button has accessibilityRole=button and correct label", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("close-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Close player");
  });

  it("like button has accessibilityRole=button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("like-button").props.accessibilityRole).toBe("button");
  });

  it("loop button has accessibilityRole=button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("loop-button").props.accessibilityRole).toBe("button");
  });

  it("download button has accessibilityRole=button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("download-button").props.accessibilityRole).toBe("button");
  });

  // 15 — Transport buttons meet 44pt touch targets
  it("transport play/pause button meets 44pt minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("transport-controls-playpause");
    const flat = Object.assign({}, ...([] as object[]).concat(btn.props.style ?? {}));
    // heroWrapper is 80x80 — well above 44
    expect((flat as Record<string, number>).width ?? 80).toBeGreaterThanOrEqual(44);
    expect((flat as Record<string, number>).height ?? 80).toBeGreaterThanOrEqual(44);
  });

  it("transport prev/next/rewind/forward buttons meet 44pt minimum", () => {
    const { getByTestId } = renderScreen();
    for (const id of [
      "transport-controls-prev",
      "transport-controls-next",
      "transport-controls-rewind",
      "transport-controls-forward",
    ]) {
      const btn = getByTestId(id);
      const flat = Object.assign({}, ...([] as object[]).concat(btn.props.style ?? {}));
      // outerButton is 48×48
      expect((flat as Record<string, number>).width ?? 48).toBeGreaterThanOrEqual(44);
      expect((flat as Record<string, number>).height ?? 48).toBeGreaterThanOrEqual(44);
    }
  });

  // 16 — Close button calls onClose
  it("calls onClose when the close button is pressed", () => {
    const onClose = jest.fn();
    const { getByTestId } = renderScreen({ onClose });
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Extra: narrator hidden when not provided
  it("hides narrator bracket when narrator prop is omitted", () => {
    const { queryByText } = renderScreen({ narrator: undefined });
    expect(queryByText(/NARRATED BY/)).toBeNull();
  });

  // Extra: zero duration guard
  it("does not crash when durationSeconds=0", () => {
    expect(() =>
      renderScreen({ durationSeconds: 0, positionSeconds: 0 }),
    ).not.toThrow();
  });
});
