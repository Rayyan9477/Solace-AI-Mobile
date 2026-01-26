/**
 * VoiceWaveform Component Tests
 * @description TDD tests for the VoiceWaveform component
 * @task Task 2.7.4: VoiceWaveform Component
 */

import { render } from "@testing-library/react-native";
import React from "react";

import { VoiceWaveform } from "./VoiceWaveform";
import {
  generateRandomWaveform,
  normalizeWaveform,
  resampleWaveform,
  formatWaveformDuration,
} from "./VoiceWaveform.types";

describe("VoiceWaveform", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(<VoiceWaveform testID="waveform" />);

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("renders bars container", () => {
      const { getByTestId } = render(<VoiceWaveform testID="waveform" />);

      expect(getByTestId("waveform-bars")).toBeTruthy();
    });

    it("renders correct number of bars", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" barCount={10} />,
      );

      expect(getByTestId("waveform-bar-0")).toBeTruthy();
      expect(getByTestId("waveform-bar-9")).toBeTruthy();
    });

    it("renders default bar count of 30", () => {
      const { queryByTestId } = render(<VoiceWaveform testID="waveform" />);

      expect(queryByTestId("waveform-bar-0")).toBeTruthy();
      expect(queryByTestId("waveform-bar-29")).toBeTruthy();
      expect(queryByTestId("waveform-bar-30")).toBeNull();
    });
  });

  describe("Waveform Data", () => {
    it("renders with provided waveform data", () => {
      const waveform = [0.5, 0.8, 0.3, 0.9, 0.2];
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" waveform={waveform} barCount={5} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("handles empty waveform", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" waveform={[]} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });
  });

  describe("Animation", () => {
    it("renders static when isAnimating is false", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" isAnimating={false} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("renders animating when isAnimating is true", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" isAnimating />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts live animation mode", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" animationMode="live" isAnimating />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts playback animation mode", () => {
      const { getByTestId } = render(
        <VoiceWaveform
          testID="waveform"
          animationMode="playback"
          playbackProgress={0.5}
        />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts static animation mode", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" animationMode="static" />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });
  });

  describe("Waveform Styles", () => {
    it("renders bars style", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" waveformStyle="bars" />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("renders line style", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" waveformStyle="line" />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("renders mirror style", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" waveformStyle="mirror" />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });
  });

  describe("Customization", () => {
    it("accepts custom primary color", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" primaryColor="#FF0000" />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts custom secondary color", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" secondaryColor="#00FF00" />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts custom bar width", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" barWidth={5} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts custom bar gap", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" barGap={4} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts custom bar radius", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" barRadius={4} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts custom max height", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" maxHeight={60} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("accepts custom min bar height", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" minBarHeight={0.2} />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });
  });

  describe("Playback Progress", () => {
    it("shows playback progress indicator", () => {
      const { getByTestId } = render(
        <VoiceWaveform
          testID="waveform"
          animationMode="playback"
          playbackProgress={0.5}
        />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("handles 0% progress", () => {
      const { getByTestId } = render(
        <VoiceWaveform
          testID="waveform"
          animationMode="playback"
          playbackProgress={0}
        />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });

    it("handles 100% progress", () => {
      const { getByTestId } = render(
        <VoiceWaveform
          testID="waveform"
          animationMode="playback"
          playbackProgress={1}
        />,
      );

      expect(getByTestId("waveform")).toBeTruthy();
    });
  });

  describe("Duration Display", () => {
    it("shows duration when showDuration is true", () => {
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" showDuration duration={65000} />,
      );

      expect(getByTestId("waveform-duration")).toBeTruthy();
    });

    it("hides duration when showDuration is false", () => {
      const { queryByTestId } = render(
        <VoiceWaveform testID="waveform" showDuration={false} duration={65000} />,
      );

      expect(queryByTestId("waveform-duration")).toBeNull();
    });

    it("displays formatted duration", () => {
      const { getByText } = render(
        <VoiceWaveform testID="waveform" showDuration duration={65000} />,
      );

      expect(getByText("1:05")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <VoiceWaveform
          testID="waveform"
          accessibilityLabel="Voice message waveform"
        />,
      );

      const waveform = getByTestId("waveform");
      expect(waveform.props.accessibilityLabel).toBe("Voice message waveform");
    });

    it("has default accessibility label", () => {
      const { getByTestId } = render(<VoiceWaveform testID="waveform" />);

      const waveform = getByTestId("waveform");
      expect(waveform.props.accessibilityLabel).toBe(
        "Audio waveform visualization",
      );
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <VoiceWaveform testID="waveform" style={customStyle} />,
      );

      const waveform = getByTestId("waveform");
      expect(waveform.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });
  });
});

// Helper function tests
describe("VoiceWaveform Helper Functions", () => {
  describe("generateRandomWaveform", () => {
    it("generates correct count", () => {
      const waveform = generateRandomWaveform(10);
      expect(waveform).toHaveLength(10);
    });

    it("generates values between 0.2 and 1", () => {
      const waveform = generateRandomWaveform(100);
      waveform.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0.2);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });

  describe("normalizeWaveform", () => {
    it("normalizes to 0-1 range", () => {
      const waveform = [0, 50, 100];
      const normalized = normalizeWaveform(waveform);
      expect(normalized).toEqual([0, 0.5, 1]);
    });

    it("handles all zeros", () => {
      const waveform = [0, 0, 0];
      const normalized = normalizeWaveform(waveform);
      expect(normalized).toEqual([0, 0, 0]);
    });

    it("handles already normalized values", () => {
      const waveform = [0.5, 0.8, 1];
      const normalized = normalizeWaveform(waveform);
      expect(normalized).toEqual([0.5, 0.8, 1]);
    });
  });

  describe("resampleWaveform", () => {
    it("downsamples longer waveform", () => {
      const waveform = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
      const resampled = resampleWaveform(waveform, 5);
      expect(resampled).toHaveLength(5);
    });

    it("upsamples shorter waveform", () => {
      const waveform = [0.5, 1.0];
      const resampled = resampleWaveform(waveform, 5);
      expect(resampled).toHaveLength(5);
    });

    it("handles empty waveform", () => {
      const resampled = resampleWaveform([], 5);
      expect(resampled).toHaveLength(5);
      expect(resampled).toEqual([0, 0, 0, 0, 0]);
    });

    it("returns same length if counts match", () => {
      const waveform = [0.1, 0.5, 0.9];
      const resampled = resampleWaveform(waveform, 3);
      expect(resampled).toEqual(waveform);
    });
  });

  describe("formatWaveformDuration", () => {
    it("formats 0 milliseconds", () => {
      expect(formatWaveformDuration(0)).toBe("0:00");
    });

    it("formats seconds", () => {
      expect(formatWaveformDuration(5000)).toBe("0:05");
    });

    it("formats minutes and seconds", () => {
      expect(formatWaveformDuration(65000)).toBe("1:05");
    });

    it("formats longer durations", () => {
      expect(formatWaveformDuration(125000)).toBe("2:05");
    });

    it("pads seconds with leading zero", () => {
      expect(formatWaveformDuration(3000)).toBe("0:03");
    });
  });
});
