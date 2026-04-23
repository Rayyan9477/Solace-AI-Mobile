import React from "react";
import { render } from "@testing-library/react-native";
import {
  MoodFace,
  MOOD_LABELS,
  MOOD_LEVELS,
  type MoodLevel,
} from "./MoodFace";

describe("MoodFace", () => {
  describe("levels + labels", () => {
    it("exposes all 5 mood levels", () => {
      expect(MOOD_LEVELS).toEqual([1, 2, 3, 4, 5]);
    });

    it("labels each level per prototype spec (Struggling → Overjoyed)", () => {
      expect(MOOD_LABELS).toEqual({
        1: "Struggling",
        2: "Down",
        3: "Neutral",
        4: "Content",
        5: "Overjoyed",
      });
    });
  });

  describe("rendering", () => {
    it.each(MOOD_LEVELS)("renders level %i without throwing", (level) => {
      const { toJSON } = render(<MoodFace level={level as MoodLevel} />);
      expect(toJSON()).toBeTruthy();
    });

    it("applies the provided size to the container", () => {
      const { getByLabelText } = render(<MoodFace level={4} size={120} />);
      const node = getByLabelText("Content mood");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(120);
      expect(style.height).toBe(120);
      expect(style.borderRadius).toBe(60);
    });

    it("defaults to size=72 when omitted", () => {
      const { getByLabelText } = render(<MoodFace level={3} />);
      const node = getByLabelText("Neutral mood");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(72);
      expect(style.height).toBe(72);
    });
  });

  describe("accessibility", () => {
    it("renders as an image with '<Label> mood' label by default", () => {
      const { getByLabelText } = render(<MoodFace level={5} />);
      const node = getByLabelText("Overjoyed mood");
      expect(node.props.accessibilityRole).toBe("image");
    });

    it("becomes a button with accessibilityState when interactive", () => {
      const { getByLabelText } = render(
        <MoodFace level={2} interactive selected />,
      );
      const node = getByLabelText("Down mood");
      expect(node.props.accessibilityRole).toBe("button");
      expect(node.props.accessibilityState).toEqual({ selected: true });
    });

    it("does not emit accessibilityState for non-interactive renders", () => {
      const { getByLabelText } = render(<MoodFace level={3} />);
      const node = getByLabelText("Neutral mood");
      expect(node.props.accessibilityState).toBeUndefined();
    });

    it("allows overriding the accessibility label", () => {
      const { getByLabelText } = render(
        <MoodFace level={1} accessibilityLabel="How you said you feel right now: struggling" />,
      );
      expect(
        getByLabelText("How you said you feel right now: struggling"),
      ).toBeTruthy();
    });
  });

  describe("snapshot", () => {
    it("renders a stable tree for level=4 content at 60px", () => {
      const { toJSON } = render(<MoodFace level={4} size={60} />);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
