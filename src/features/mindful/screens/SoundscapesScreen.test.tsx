/**
 * SoundscapesScreen Tests — prototype v4.2 #34
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { SoundscapesScreen } from "./SoundscapesScreen";

const baseProps = {
  onBack: jest.fn(),
  onSelectSound: jest.fn(),
  onTogglePlayback: jest.fn(),
};

function renderScreen(overrides: Record<string, unknown> = {}) {
  return render(<SoundscapesScreen {...baseProps} {...overrides} />);
}

describe("SoundscapesScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("soundscapes-screen")).toBeTruthy();
  });

  it("renders the night sky gradient backdrop", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("night-sky-gradient")).toBeTruthy();
  });

  it("renders the back button with a11y", () => {
    const { getByTestId } = renderScreen();
    const back = getByTestId("back-button");
    expect(back.props.accessibilityRole).toBe("button");
    expect(back.props.accessibilityLabel).toBe("Go back");
  });

  it("invokes onBack when back pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders the headline 'Drift off gently'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Drift off gently")).toBeTruthy();
  });

  it("renders the now playing card by default", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("now-playing-card")).toBeTruthy();
    expect(getByTestId("now-playing-title").props.children).toBe("Gentle rain");
  });

  it("renders the playing meta text", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("now-playing-meta").props.children).toBe(
      "Playing · 24 min",
    );
  });

  it("invokes onTogglePlayback when toggle pressed", () => {
    const onTogglePlayback = jest.fn();
    const { getByTestId } = renderScreen({ onTogglePlayback });
    fireEvent.press(getByTestId("now-playing-toggle"));
    expect(onTogglePlayback).toHaveBeenCalledTimes(1);
  });

  it("hides the now playing card when nowPlaying is null", () => {
    const { queryByTestId } = renderScreen({ nowPlaying: null });
    expect(queryByTestId("now-playing-card")).toBeNull();
  });

  it("renders all 6 default sounds", () => {
    const { getByTestId } = renderScreen();
    const ids = ["rain", "ocean", "forest", "white-noise", "fire", "bowl"];
    for (const id of ids) {
      expect(getByTestId(`sound-${id}`)).toBeTruthy();
    }
  });

  it("marks the active sound with selected state", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sound-rain").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
    expect(getByTestId("sound-ocean").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  it("renders the volume indicator on the active sound", () => {
    const { UNSAFE_root } = renderScreen();
    const found = UNSAFE_root.findAll(
      (n: { props: { testID?: string } }) => n.props.testID === "sound-active-indicator-rain",
    );
    expect(found.length).toBeGreaterThan(0);
  });

  it("invokes onSelectSound when a tile pressed", () => {
    const onSelectSound = jest.fn();
    const { getByTestId } = renderScreen({ onSelectSound });
    fireEvent.press(getByTestId("sound-ocean"));
    expect(onSelectSound).toHaveBeenCalledWith("ocean");
  });

  it("uses custom sounds list", () => {
    const custom = [
      {
        id: "thunder",
        title: "Thunder",
        duration: "30m",
        iconName: "cloud-rain",
        gradient: "lavender" as const,
      },
    ];
    const { getByTestId, queryByTestId } = renderScreen({ sounds: custom });
    expect(getByTestId("sound-thunder")).toBeTruthy();
    expect(queryByTestId("sound-rain")).toBeNull();
  });

  it("renders a custom now playing entry", () => {
    const { getByTestId } = renderScreen({
      nowPlaying: { id: "ocean", title: "Ocean waves", minutes: 12 },
    });
    expect(getByTestId("now-playing-title").props.children).toBe("Ocean waves");
    expect(getByTestId("now-playing-meta").props.children).toBe(
      "Playing · 12 min",
    );
  });

  it("touch targets meet 44pt", () => {
    const { getByTestId } = renderScreen();
    for (const id of ["back-button", "now-playing-toggle"]) {
      const flat = Object.assign({}, ...[].concat(getByTestId(id).props.style));
      expect(flat.minHeight).toBeGreaterThanOrEqual(44);
      expect(flat.minWidth).toBeGreaterThanOrEqual(44);
    }
  });

  it("does not contain Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("toggle pause button announces the active sound", () => {
    const { getByTestId } = renderScreen({
      nowPlaying: { id: "fire", title: "Crackling fire", minutes: 5 },
    });
    expect(getByTestId("now-playing-toggle").props.accessibilityLabel).toBe(
      "Pause Crackling fire",
    );
  });
});
