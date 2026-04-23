jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { SmokeBlob } from "./SmokeBlob";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("SmokeBlob", () => {
  it("defaults to size=280, tint=aurora", () => {
    const { getByTestId } = renderWithTheme(<SmokeBlob testID="smoke" />);
    const node = getByTestId("smoke", { includeHiddenElements: true });
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(style.width).toBe(280);
    expect(style.height).toBe(280);
  });

  it("applies provided size", () => {
    const { getByTestId } = renderWithTheme(<SmokeBlob testID="s" size={400} />);
    const node = getByTestId("s", { includeHiddenElements: true });
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(style.width).toBe(400);
    expect(style.height).toBe(400);
  });

  it.each(["aurora", "sage", "peach", "lavender"] as const)(
    "renders tint=%s without throwing",
    (tint) => {
      const { toJSON } = renderWithTheme(<SmokeBlob tint={tint} />);
      expect(toJSON()).toBeTruthy();
    },
  );

  it("is hidden from screen readers and ignores touches", () => {
    const { getByTestId } = renderWithTheme(<SmokeBlob testID="smoke" />);
    const node = getByTestId("smoke", { includeHiddenElements: true });
    expect(node.props.pointerEvents).toBe("none");
    expect(node.props.accessibilityElementsHidden).toBe(true);
    expect(node.props.importantForAccessibility).toBe("no-hide-descendants");
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(<SmokeBlob size={200} tint="sage" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
