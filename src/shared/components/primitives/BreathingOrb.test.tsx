jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { BreathingOrb } from "./BreathingOrb";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("BreathingOrb", () => {
  it("defaults to size=160, tint=cool", () => {
    const { getByTestId } = renderWithTheme(<BreathingOrb testID="orb" />);
    const node = getByTestId("orb", { includeHiddenElements: true });
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(style.width).toBe(160);
    expect(style.height).toBe(160);
  });

  it("renders at custom size", () => {
    const { getByTestId } = renderWithTheme(
      <BreathingOrb testID="orb" size={260} />,
    );
    const style = Array.isArray(getByTestId("orb", { includeHiddenElements: true }).props.style)
      ? Object.assign({}, ...getByTestId("orb", { includeHiddenElements: true }).props.style.filter(Boolean))
      : getByTestId("orb", { includeHiddenElements: true }).props.style;
    expect(style.width).toBe(260);
  });

  it.each(["cool", "warm"] as const)("renders tint=%s without throwing", (tint) => {
    const { toJSON } = renderWithTheme(<BreathingOrb tint={tint} />);
    expect(toJSON()).toBeTruthy();
  });

  describe("accessibility", () => {
    it("is decorative by default (hidden from SR, ignores touches)", () => {
      const { getByTestId } = renderWithTheme(<BreathingOrb testID="orb" />);
      const node = getByTestId("orb", { includeHiddenElements: true });
      expect(node.props.pointerEvents).toBe("none");
      expect(node.props.accessibilityElementsHidden).toBe(true);
      expect(node.props.importantForAccessibility).toBe("no-hide-descendants");
      expect(node.props.accessibilityRole).toBeUndefined();
    });

    it("is announced as image when accessibilityLabel is provided", () => {
      const { getByLabelText } = renderWithTheme(
        <BreathingOrb accessibilityLabel="Solace brand mark" />,
      );
      const node = getByLabelText("Solace brand mark");
      expect(node.props.accessibilityRole).toBe("image");
      expect(node.props.accessibilityElementsHidden).toBe(false);
    });
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(<BreathingOrb size={120} pulsing={false} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
