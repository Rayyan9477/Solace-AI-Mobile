/**
 * MoodSelector Component Tests
 * @description TDD tests for the MoodSelector component
 * @task Task 2.8.1: MoodSelector Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { MoodSelector } from "./MoodSelector";
import type { MoodLevel } from "./MoodSelector.types";
import {
  MOOD_CONFIGS,
  MOOD_ORDER,
  getMoodByIndex,
  getMoodIndex,
  getMoodLabel,
  getMoodEmoji,
  getMoodBackgroundColor,
} from "./MoodSelector.types";

describe("MoodSelector", () => {
  const mockOnMoodSelect = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" />,
      );

      expect(getByTestId("mood-selector")).toBeTruthy();
    });

    it("renders with default title", () => {
      const { getByText } = render(
        <MoodSelector testID="mood-selector" />,
      );

      expect(getByText("How are you feeling this day?")).toBeTruthy();
    });

    it("renders with custom title", () => {
      const { getByText } = render(
        <MoodSelector
          testID="mood-selector"
          title="How do you feel today?"
        />,
      );

      expect(getByText("How do you feel today?")).toBeTruthy();
    });

    it("renders mood emoji", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="happy" />,
      );

      expect(getByTestId("mood-selector-emoji")).toBeTruthy();
    });

    it("renders mood label", () => {
      const { getByText } = render(
        <MoodSelector testID="mood-selector" value="happy" />,
      );

      expect(getByText("I'm Feeling Happy")).toBeTruthy();
    });

    it("renders mood slider with 5 points", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" />,
      );

      expect(getByTestId("mood-selector-slider")).toBeTruthy();
      for (let i = 0; i < 5; i++) {
        expect(getByTestId(`mood-selector-point-${i}`)).toBeTruthy();
      }
    });

    it("renders confirm button", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" />,
      );

      expect(getByTestId("mood-selector-confirm")).toBeTruthy();
    });

    it("renders with default button text", () => {
      const { getByText } = render(
        <MoodSelector testID="mood-selector" />,
      );

      expect(getByText("Set Mood")).toBeTruthy();
    });

    it("renders with custom button text", () => {
      const { getByText } = render(
        <MoodSelector
          testID="mood-selector"
          confirmButtonText="Save Mood"
        />,
      );

      expect(getByText("Save Mood")).toBeTruthy();
    });
  });

  describe("Mood Selection", () => {
    it("shows neutral mood by default", () => {
      const { getByText } = render(
        <MoodSelector testID="mood-selector" />,
      );

      expect(getByText("I'm Feeling Neutral")).toBeTruthy();
    });

    it("shows selected mood when value is provided", () => {
      const { getByText } = render(
        <MoodSelector testID="mood-selector" value="overjoyed" />,
      );

      expect(getByText("I'm Feeling Overjoyed")).toBeTruthy();
    });

    it("calls onMoodSelect when slider point is pressed", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          onMoodSelect={mockOnMoodSelect}
        />,
      );

      fireEvent.press(getByTestId("mood-selector-point-0"));
      expect(mockOnMoodSelect).toHaveBeenCalledWith("depressed");
    });

    it("calls onMoodSelect with correct mood for each point", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          onMoodSelect={mockOnMoodSelect}
        />,
      );

      MOOD_ORDER.forEach((mood, index) => {
        fireEvent.press(getByTestId(`mood-selector-point-${index}`));
        expect(mockOnMoodSelect).toHaveBeenCalledWith(mood);
      });
    });

    it("highlights selected point", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="happy" />,
      );

      const point = getByTestId("mood-selector-point-3");
      // Happy is at index 3
      expect(point.props.style).toEqual(
        expect.objectContaining({ backgroundColor: "#FFFFFF" }),
      );
    });
  });

  describe("Background Colors", () => {
    it("applies depressed mood background color", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="depressed" />,
      );

      const container = getByTestId("mood-selector");
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#7B68B5" }),
        ]),
      );
    });

    it("applies sad mood background color", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="sad" />,
      );

      const container = getByTestId("mood-selector");
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#E8853A" }),
        ]),
      );
    });

    it("applies neutral mood background color", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="neutral" />,
      );

      const container = getByTestId("mood-selector");
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#8B7355" }),
        ]),
      );
    });

    it("applies happy mood background color", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="happy" />,
      );

      const container = getByTestId("mood-selector");
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#F5C563" }),
        ]),
      );
    });

    it("applies overjoyed mood background color", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="overjoyed" />,
      );

      const container = getByTestId("mood-selector");
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#9AAD5C" }),
        ]),
      );
    });
  });

  describe("Confirm Action", () => {
    it("calls onConfirm when confirm button is pressed", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          value="happy"
          onConfirm={mockOnConfirm}
        />,
      );

      fireEvent.press(getByTestId("mood-selector-confirm"));
      expect(mockOnConfirm).toHaveBeenCalledWith("happy");
    });

    it("calls onConfirm with current mood", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          value="depressed"
          onConfirm={mockOnConfirm}
        />,
      );

      fireEvent.press(getByTestId("mood-selector-confirm"));
      expect(mockOnConfirm).toHaveBeenCalledWith("depressed");
    });
  });

  describe("Disabled State", () => {
    it("does not call onMoodSelect when disabled", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          disabled
          onMoodSelect={mockOnMoodSelect}
        />,
      );

      fireEvent.press(getByTestId("mood-selector-point-0"));
      expect(mockOnMoodSelect).not.toHaveBeenCalled();
    });

    it("does not call onConfirm when disabled", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          disabled
          onConfirm={mockOnConfirm}
        />,
      );

      fireEvent.press(getByTestId("mood-selector-confirm"));
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows loading indicator on confirm button when loading", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" loading />,
      );

      expect(getByTestId("mood-selector-confirm-loading")).toBeTruthy();
    });

    it("disables interactions when loading", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          loading
          onMoodSelect={mockOnMoodSelect}
          onConfirm={mockOnConfirm}
        />,
      );

      fireEvent.press(getByTestId("mood-selector-point-0"));
      fireEvent.press(getByTestId("mood-selector-confirm"));
      expect(mockOnMoodSelect).not.toHaveBeenCalled();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <MoodSelector
          testID="mood-selector"
          accessibilityLabel="Select your current mood"
        />,
      );

      const selector = getByTestId("mood-selector");
      expect(selector.props.accessibilityLabel).toBe(
        "Select your current mood",
      );
    });

    it("has default accessibility label", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" />,
      );

      const selector = getByTestId("mood-selector");
      expect(selector.props.accessibilityLabel).toBe("Mood selector");
    });

    it("slider points have accessibility labels", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" />,
      );

      MOOD_ORDER.forEach((mood, index) => {
        const point = getByTestId(`mood-selector-point-${index}`);
        expect(point.props.accessibilityLabel).toBe(
          `Select ${MOOD_CONFIGS[mood].label} mood`,
        );
      });
    });

    it("slider points have accessibility role button", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" />,
      );

      const point = getByTestId("mood-selector-point-0");
      expect(point.props.accessibilityRole).toBe("button");
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" style={customStyle} />,
      );

      const selector = getByTestId("mood-selector");
      expect(selector.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });

    it("displays large emoji", () => {
      const { getByTestId } = render(
        <MoodSelector testID="mood-selector" value="happy" />,
      );

      const emoji = getByTestId("mood-selector-emoji");
      expect(emoji.props.style).toEqual(
        expect.objectContaining({ fontSize: 80 }),
      );
    });
  });
});

// Helper function tests
describe("MoodSelector Helper Functions", () => {
  describe("MOOD_CONFIGS", () => {
    it("has all 5 moods configured", () => {
      expect(Object.keys(MOOD_CONFIGS)).toHaveLength(5);
      expect(MOOD_CONFIGS.depressed).toBeDefined();
      expect(MOOD_CONFIGS.sad).toBeDefined();
      expect(MOOD_CONFIGS.neutral).toBeDefined();
      expect(MOOD_CONFIGS.happy).toBeDefined();
      expect(MOOD_CONFIGS.overjoyed).toBeDefined();
    });

    it("has correct indices", () => {
      expect(MOOD_CONFIGS.depressed.index).toBe(0);
      expect(MOOD_CONFIGS.sad.index).toBe(1);
      expect(MOOD_CONFIGS.neutral.index).toBe(2);
      expect(MOOD_CONFIGS.happy.index).toBe(3);
      expect(MOOD_CONFIGS.overjoyed.index).toBe(4);
    });
  });

  describe("getMoodByIndex", () => {
    it("returns correct mood config for each index", () => {
      expect(getMoodByIndex(0).mood).toBe("depressed");
      expect(getMoodByIndex(1).mood).toBe("sad");
      expect(getMoodByIndex(2).mood).toBe("neutral");
      expect(getMoodByIndex(3).mood).toBe("happy");
      expect(getMoodByIndex(4).mood).toBe("overjoyed");
    });
  });

  describe("getMoodIndex", () => {
    it("returns correct index for each mood", () => {
      expect(getMoodIndex("depressed")).toBe(0);
      expect(getMoodIndex("sad")).toBe(1);
      expect(getMoodIndex("neutral")).toBe(2);
      expect(getMoodIndex("happy")).toBe(3);
      expect(getMoodIndex("overjoyed")).toBe(4);
    });
  });

  describe("getMoodLabel", () => {
    it("returns correct label with default prefix", () => {
      expect(getMoodLabel("happy")).toBe("I'm Feeling Happy");
      expect(getMoodLabel("sad")).toBe("I'm Feeling Sad");
    });

    it("returns correct label with custom prefix", () => {
      expect(getMoodLabel("happy", "Currently")).toBe("Currently Happy");
    });
  });

  describe("getMoodEmoji", () => {
    it("returns correct emoji for each mood", () => {
      expect(getMoodEmoji("depressed")).toBe("😵");
      expect(getMoodEmoji("sad")).toBe("😢");
      expect(getMoodEmoji("neutral")).toBe("😐");
      expect(getMoodEmoji("happy")).toBe("🙂");
      expect(getMoodEmoji("overjoyed")).toBe("😄");
    });
  });

  describe("getMoodBackgroundColor", () => {
    it("returns correct color for each mood", () => {
      expect(getMoodBackgroundColor("depressed")).toBe("#7B68B5");
      expect(getMoodBackgroundColor("sad")).toBe("#E8853A");
      expect(getMoodBackgroundColor("neutral")).toBe("#8B7355");
      expect(getMoodBackgroundColor("happy")).toBe("#F5C563");
      expect(getMoodBackgroundColor("overjoyed")).toBe("#9AAD5C");
    });
  });
});
