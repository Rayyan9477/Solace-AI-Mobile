jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { RingProgress } from "./RingProgress";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("RingProgress", () => {
  describe("value clamping", () => {
    it.each([
      [50, 50],
      [-10, 0],
      [150, 100],
      [Number.NaN, 0],
    ])("clamps value=%p to %i in accessibilityValue", (input, expected) => {
      const { getByTestId } = renderWithTheme(
        <RingProgress testID="ring" value={input as number} />,
      );
      expect(getByTestId("ring").props.accessibilityValue.now).toBe(expected);
    });
  });

  describe("dimensions", () => {
    it("defaults to 160x160", () => {
      const { getByTestId } = renderWithTheme(
        <RingProgress testID="ring" value={50} />,
      );
      const style = Array.isArray(getByTestId("ring").props.style)
        ? Object.assign({}, ...getByTestId("ring").props.style.filter(Boolean))
        : getByTestId("ring").props.style;
      expect(style.width).toBe(160);
      expect(style.height).toBe(160);
    });

    it("applies custom size", () => {
      const { getByTestId } = renderWithTheme(
        <RingProgress testID="ring" value={50} size={200} />,
      );
      const style = Array.isArray(getByTestId("ring").props.style)
        ? Object.assign({}, ...getByTestId("ring").props.style.filter(Boolean))
        : getByTestId("ring").props.style;
      expect(style.width).toBe(200);
      expect(style.height).toBe(200);
    });
  });

  it("renders children centered in the ring", () => {
    const { getByText } = renderWithTheme(
      <RingProgress value={72}>
        <Text>72</Text>
      </RingProgress>,
    );
    expect(getByText("72")).toBeTruthy();
  });

  it("accepts accessibility label", () => {
    const { getByLabelText } = renderWithTheme(
      <RingProgress value={68} accessibilityLabel="Solace score 68 out of 100" />,
    );
    const node = getByLabelText("Solace score 68 out of 100");
    expect(node.props.accessibilityRole).toBe("progressbar");
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(<RingProgress value={72} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
