jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { StatBar } from "./StatBar";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("StatBar", () => {
  describe("percent clamping", () => {
    it("exposes accessibilityValue with the given percent", () => {
      const { getByTestId } = renderWithTheme(<StatBar testID="bar" percent={72} />);
      const node = getByTestId("bar");
      expect(node.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 72 });
    });

    it("clamps negative values to 0", () => {
      const { getByTestId } = renderWithTheme(<StatBar testID="bar" percent={-5} />);
      expect(getByTestId("bar").props.accessibilityValue.now).toBe(0);
    });

    it("clamps values above 100 to 100", () => {
      const { getByTestId } = renderWithTheme(<StatBar testID="bar" percent={150} />);
      expect(getByTestId("bar").props.accessibilityValue.now).toBe(100);
    });

    it("treats NaN as 0 without crashing", () => {
      const { getByTestId } = renderWithTheme(<StatBar testID="bar" percent={NaN} />);
      expect(getByTestId("bar").props.accessibilityValue.now).toBe(0);
    });
  });

  describe("dimensions", () => {
    it("defaults to height=4 with half-height radius", () => {
      const { getByTestId } = renderWithTheme(<StatBar testID="bar" percent={50} />);
      const style = Array.isArray(getByTestId("bar").props.style)
        ? Object.assign({}, ...getByTestId("bar").props.style.filter(Boolean))
        : getByTestId("bar").props.style;
      expect(style.height).toBe(4);
      expect(style.borderRadius).toBe(2);
    });

    it("respects custom height", () => {
      const { getByTestId } = renderWithTheme(<StatBar testID="bar" percent={50} height={8} />);
      const style = Array.isArray(getByTestId("bar").props.style)
        ? Object.assign({}, ...getByTestId("bar").props.style.filter(Boolean))
        : getByTestId("bar").props.style;
      expect(style.height).toBe(8);
      expect(style.borderRadius).toBe(4);
    });
  });

  describe("accessibility", () => {
    it("uses progressbar role + accepts label", () => {
      const { getByLabelText } = renderWithTheme(
        <StatBar percent={42} accessibilityLabel="Solace score 42 of 100" />,
      );
      const node = getByLabelText("Solace score 42 of 100");
      expect(node.props.accessibilityRole).toBe("progressbar");
    });
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(<StatBar percent={72} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
