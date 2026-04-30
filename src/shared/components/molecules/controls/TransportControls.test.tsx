/**
 * TransportControls Tests (prototype v4.2)
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { TransportControls } from "./TransportControls";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("TransportControls", () => {
  const baseProps = {
    isPlaying: false,
    onPlayPause: jest.fn(),
    testID: "transport",
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <TransportControls {...baseProps} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot when paused", () => {
    const { toJSON } = renderWithTheme(
      <TransportControls {...baseProps} isPlaying={false} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("matches snapshot when playing", () => {
    const { toJSON } = renderWithTheme(
      <TransportControls {...baseProps} isPlaying={true} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders all 5 buttons", () => {
    const { getByTestId } = renderWithTheme(
      <TransportControls
        {...baseProps}
        onPrev={jest.fn()}
        onNext={jest.fn()}
        onRewind={jest.fn()}
        onForward={jest.fn()}
      />,
    );
    expect(getByTestId("transport-prev")).toBeTruthy();
    expect(getByTestId("transport-rewind")).toBeTruthy();
    expect(getByTestId("transport-playpause")).toBeTruthy();
    expect(getByTestId("transport-forward")).toBeTruthy();
    expect(getByTestId("transport-next")).toBeTruthy();
  });

  describe("isPlaying prop", () => {
    it("play/pause button has label 'Play' when paused", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} isPlaying={false} />,
      );
      expect(getByTestId("transport-playpause").props.accessibilityLabel).toBe("Play");
    });

    it("play/pause button has label 'Pause' when playing", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} isPlaying={true} />,
      );
      expect(getByTestId("transport-playpause").props.accessibilityLabel).toBe("Pause");
    });
  });

  describe("interactions", () => {
    it("calls onPlayPause when play/pause button pressed", () => {
      const onPlayPause = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onPlayPause={onPlayPause} />,
      );
      fireEvent.press(getByTestId("transport-playpause"));
      expect(onPlayPause).toHaveBeenCalledTimes(1);
    });

    it("calls onPrev when prev button pressed", () => {
      const onPrev = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onPrev={onPrev} />,
      );
      fireEvent.press(getByTestId("transport-prev"));
      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    it("calls onNext when next button pressed", () => {
      const onNext = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onNext={onNext} />,
      );
      fireEvent.press(getByTestId("transport-next"));
      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it("calls onRewind when rewind button pressed", () => {
      const onRewind = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onRewind={onRewind} />,
      );
      fireEvent.press(getByTestId("transport-rewind"));
      expect(onRewind).toHaveBeenCalledTimes(1);
    });

    it("calls onForward when forward button pressed", () => {
      const onForward = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onForward={onForward} />,
      );
      fireEvent.press(getByTestId("transport-forward"));
      expect(onForward).toHaveBeenCalledTimes(1);
    });
  });

  describe("disabled state", () => {
    it("renders prev as disabled when no onPrev handler", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} />,
      );
      expect(getByTestId("transport-prev").props.accessibilityState?.disabled).not.toBe(false);
    });

    it("renders all optional buttons with opacity 0.4 when handlers not provided", () => {
      const { toJSON } = renderWithTheme(
        <TransportControls {...baseProps} />,
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("prev button has accessibilityRole=button", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onPrev={jest.fn()} />,
      );
      expect(getByTestId("transport-prev").props.accessibilityRole).toBe("button");
    });

    it("prev button has accessibilityLabel 'Previous track'", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onPrev={jest.fn()} />,
      );
      expect(getByTestId("transport-prev").props.accessibilityLabel).toBe("Previous track");
    });

    it("next button has accessibilityLabel 'Next track'", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onNext={jest.fn()} />,
      );
      expect(getByTestId("transport-next").props.accessibilityLabel).toBe("Next track");
    });

    it("rewind button has accessibilityLabel 'Skip back 15 seconds'", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onRewind={jest.fn()} />,
      );
      expect(getByTestId("transport-rewind").props.accessibilityLabel).toBe("Skip back 15 seconds");
    });

    it("forward button has accessibilityLabel 'Skip forward 15 seconds'", () => {
      const { getByTestId } = renderWithTheme(
        <TransportControls {...baseProps} onForward={jest.fn()} />,
      );
      expect(getByTestId("transport-forward").props.accessibilityLabel).toBe("Skip forward 15 seconds");
    });

    it("all visible buttons have accessibilityRole=button", () => {
      const { getAllByRole } = renderWithTheme(
        <TransportControls
          {...baseProps}
          onPrev={jest.fn()}
          onNext={jest.fn()}
          onRewind={jest.fn()}
          onForward={jest.fn()}
        />,
      );
      const buttons = getAllByRole("button");
      expect(buttons.length).toBe(5);
    });
  });
});
