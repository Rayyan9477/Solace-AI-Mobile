jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { ScoreRing } from "./ScoreRing";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ScoreRing", () => {
  it("mounts without throwing", () => {
    expect(() => renderWithTheme(<ScoreRing value={72} />)).not.toThrow();
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(<ScoreRing value={72} />);
    expect(toJSON()).toMatchSnapshot();
  });

  describe("value clamping", () => {
    it.each([
      [50, 50],
      [-10, 0],
      [150, 100],
      [Number.NaN, 0],
    ])("clamps value=%p to %i in accessibilityValue", (input, expected) => {
      const { getByTestId } = renderWithTheme(
        <ScoreRing testID="score-ring" value={input as number} />,
      );
      expect(getByTestId("score-ring").props.accessibilityValue.now).toBe(expected);
    });
  });

  describe("dimensions", () => {
    it("defaults to 200x200", () => {
      const { getByTestId } = renderWithTheme(
        <ScoreRing testID="score-ring" value={50} />,
      );
      const node = getByTestId("score-ring");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(200);
      expect(style.height).toBe(200);
    });

    it("applies custom size", () => {
      const { getByTestId } = renderWithTheme(
        <ScoreRing testID="score-ring" value={50} size={240} />,
      );
      const node = getByTestId("score-ring");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(240);
    });
  });

  describe("accessibility", () => {
    it("has role=progressbar", () => {
      const { getByTestId } = renderWithTheme(
        <ScoreRing testID="score-ring" value={55} />,
      );
      expect(getByTestId("score-ring").props.accessibilityRole).toBe("progressbar");
    });

    it("exposes accessibilityValue with min=0, max=100, now=value", () => {
      const { getByTestId } = renderWithTheme(
        <ScoreRing testID="score-ring" value={83} />,
      );
      const { accessibilityValue } = getByTestId("score-ring").props;
      expect(accessibilityValue.min).toBe(0);
      expect(accessibilityValue.max).toBe(100);
      expect(accessibilityValue.now).toBe(83);
    });

    it("accepts a custom accessibilityLabel", () => {
      const { getByLabelText } = renderWithTheme(
        <ScoreRing value={68} accessibilityLabel="Mental health score 68 out of 100" />,
      );
      const node = getByLabelText("Mental health score 68 out of 100");
      expect(node.props.accessibilityRole).toBe("progressbar");
    });
  });

  describe("children", () => {
    it("renders children centered inside the ring", () => {
      const { getByText } = renderWithTheme(
        <ScoreRing value={72}>
          <Text>72</Text>
        </ScoreRing>,
      );
      expect(getByText("72")).toBeTruthy();
    });
  });
});
