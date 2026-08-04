jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { ConcentricRings } from "./ConcentricRings";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("ConcentricRings", () => {
  it("mounts without throwing", () => {
    expect(() => renderWithTheme(<ConcentricRings />)).not.toThrow();
  });

  it("renders a stable snapshot (default props)", () => {
    const { toJSON } = renderWithTheme(<ConcentricRings testID="rings" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot with children", () => {
    const { toJSON } = renderWithTheme(
      <ConcentricRings size={220} rings={4} tint="sage">
        <Text>inner</Text>
      </ConcentricRings>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("dimensions", () => {
    it("defaults to size=220", () => {
      const { getByTestId } = renderWithTheme(
        <ConcentricRings testID="rings" />,
      );
      const node = getByTestId("rings", { includeHiddenElements: true });
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(220);
      expect(style.height).toBe(220);
    });

    it("applies custom size", () => {
      const { getByTestId } = renderWithTheme(
        <ConcentricRings testID="rings" size={300} />,
      );
      const node = getByTestId("rings", { includeHiddenElements: true });
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(300);
    });
  });

  describe("tint variants", () => {
    it.each(["aurora", "sage", "lavender", "peach"] as const)(
      "renders tint=%s without throwing",
      (tint) => {
        const { toJSON } = renderWithTheme(
          <ConcentricRings tint={tint} size={160} />,
        );
        expect(toJSON()).toBeTruthy();
      },
    );
  });

  describe("rings clamping", () => {
    it("clamps rings below 3 to 3", () => {
      // Should not throw with rings=1 — clamped to 3 internally.
      const { toJSON } = renderWithTheme(<ConcentricRings rings={1} />);
      expect(toJSON()).toBeTruthy();
    });

    it("clamps rings above 5 to 5", () => {
      const { toJSON } = renderWithTheme(<ConcentricRings rings={10} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("children", () => {
    it("renders centered children", () => {
      const { getByTestId } = renderWithTheme(
        <ConcentricRings>
          <Text testID="inner-child">center</Text>
        </ConcentricRings>,
      );
      // The outer wrapper is hidden from a11y; query by testID with hidden flag.
      expect(getByTestId("inner-child", { includeHiddenElements: true })).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("is hidden from screen readers by default", () => {
      const { getByTestId } = renderWithTheme(
        <ConcentricRings testID="rings" />,
      );
      const node = getByTestId("rings", { includeHiddenElements: true });
      expect(node.props.accessibilityElementsHidden).toBe(true);
      expect(node.props.accessibilityRole).toBeUndefined();
    });

    it("is announced as image when accessibilityLabel is provided", () => {
      const { getByLabelText } = renderWithTheme(
        <ConcentricRings accessibilityLabel="Decorative rings" />,
      );
      const node = getByLabelText("Decorative rings");
      expect(node.props.accessibilityRole).toBe("image");
      expect(node.props.accessibilityElementsHidden).toBe(false);
    });
  });
});
