jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { IconTile } from "./IconTile";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("IconTile", () => {
  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <IconTile iconName="heart" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders a stable snapshot with defaults", () => {
    const { toJSON } = renderWithTheme(
      <IconTile iconName="heart" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("size", () => {
    it("defaults to size=44", () => {
      const { getByTestId } = renderWithTheme(
        <IconTile testID="tile" iconName="heart" />,
      );
      const node = getByTestId("tile", { includeHiddenElements: true });
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(44);
      expect(style.height).toBe(44);
    });

    it("applies custom size", () => {
      const { getByTestId } = renderWithTheme(
        <IconTile testID="tile" iconName="heart" size={60} />,
      );
      const node = getByTestId("tile", { includeHiddenElements: true });
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(60);
      expect(style.height).toBe(60);
    });
  });

  describe("shape", () => {
    it("uses borderRadius=12 for rounded (default)", () => {
      const { getByTestId } = renderWithTheme(
        <IconTile testID="tile" iconName="heart" shape="rounded" />,
      );
      const node = getByTestId("tile", { includeHiddenElements: true });
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.borderRadius).toBe(12);
    });

    it("uses borderRadius=size/2 for circle", () => {
      const { getByTestId } = renderWithTheme(
        <IconTile testID="tile" iconName="heart" size={44} shape="circle" />,
      );
      const node = getByTestId("tile", { includeHiddenElements: true });
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.borderRadius).toBe(22);
    });
  });

  describe("hue variants", () => {
    it.each(["sage", "aurora", "peach", "lavender", "warm", "midnight"] as const)(
      "renders hue=%s without throwing",
      (hue) => {
        const { toJSON } = renderWithTheme(
          <IconTile iconName="star" hue={hue} />,
        );
        expect(toJSON()).toBeTruthy();
      },
    );
  });

  describe("variant", () => {
    it("renders soft variant", () => {
      const { toJSON } = renderWithTheme(
        <IconTile iconName="star" variant="soft" />,
      );
      expect(toJSON()).toBeTruthy();
    });

    it("renders solid variant", () => {
      const { toJSON } = renderWithTheme(
        <IconTile iconName="star" variant="solid" />,
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("is decorative by default (hidden from screen readers)", () => {
      const { getByTestId } = renderWithTheme(
        <IconTile testID="tile" iconName="heart" />,
      );
      const node = getByTestId("tile", { includeHiddenElements: true });
      expect(node.props.accessibilityElementsHidden).toBe(true);
      expect(node.props.importantForAccessibility).toBe("no-hide-descendants");
      expect(node.props.accessibilityRole).toBeUndefined();
    });

    it("is announced as image when accessibilityLabel is provided", () => {
      const { getByLabelText } = renderWithTheme(
        <IconTile iconName="heart" accessibilityLabel="Favourite" />,
      );
      const node = getByLabelText("Favourite");
      expect(node.props.accessibilityRole).toBe("image");
      expect(node.props.accessibilityElementsHidden).toBe(false);
    });
  });
});
