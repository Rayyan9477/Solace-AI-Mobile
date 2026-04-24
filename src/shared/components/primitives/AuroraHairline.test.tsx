jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { AuroraHairline } from "./AuroraHairline";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("AuroraHairline", () => {
  it("defaults to 1px thickness with no horizontal inset", () => {
    const { getByTestId } = renderWithTheme(<AuroraHairline testID="line" />);
    const node = getByTestId("line", { includeHiddenElements: true });
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(style.height).toBe(1);
    expect(style.marginHorizontal).toBe(0);
  });

  it("respects custom thickness + inset props", () => {
    const { getByTestId } = renderWithTheme(
      <AuroraHairline testID="line" thickness={2} inset={16} />,
    );
    const node = getByTestId("line", { includeHiddenElements: true });
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(style.height).toBe(2);
    expect(style.marginHorizontal).toBe(16);
  });

  it("hides from screen readers (decorative)", () => {
    const { getByTestId } = renderWithTheme(<AuroraHairline testID="line" />);
    const node = getByTestId("line", { includeHiddenElements: true });
    expect(node.props.accessibilityElementsHidden).toBe(true);
    expect(node.props.importantForAccessibility).toBe("no-hide-descendants");
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(<AuroraHairline />);
    expect(toJSON()).toMatchSnapshot();
  });
});
