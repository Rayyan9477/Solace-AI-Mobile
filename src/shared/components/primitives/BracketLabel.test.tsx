// BracketLabel tests depend on the REAL ThemeProvider to read typography
// tokens. The jest.setup.js globally mocks the theme barrel; here we need to
// unmock so the component receives the actual fontFamily/palette values.
jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

import React from "react";
import { render } from "@testing-library/react-native";

import { BracketLabel } from "./BracketLabel";
import { ThemeProvider } from "@/shared/theme/useTheme";
import { presets } from "@/shared/theme/presets";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("BracketLabel", () => {
  it("wraps its children with [ UPPERCASE ] brackets", () => {
    const { getByText } = renderWithTheme(
      <BracketLabel>Tuesday, April 9</BracketLabel>,
    );
    expect(getByText("[ TUESDAY, APRIL 9 ]")).toBeTruthy();
  });

  it("uses the Fira Code medium font family and 10px size", () => {
    const { getByText } = renderWithTheme(<BracketLabel>Your streak</BracketLabel>);
    const node = getByText("[ YOUR STREAK ]");
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(style.fontFamily).toBe("FiraCode_500Medium");
    expect(style.fontSize).toBe(10);
    expect(style.letterSpacing).toBe(1.5); // typography.letterSpacing.ultraWide
  });

  describe("variants map to cosmic palette", () => {
    const p = presets.cosmic.palette;

    it("muted (default) = warm-500", () => {
      const { getByText } = renderWithTheme(<BracketLabel>muted</BracketLabel>);
      const node = getByText("[ MUTED ]");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.color).toBe(p.warm[500]);
    });

    it("sage = sage-300", () => {
      const { getByText } = renderWithTheme(
        <BracketLabel variant="sage">sage</BracketLabel>,
      );
      const node = getByText("[ SAGE ]");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.color).toBe(p.sage[300]);
    });

    it("peach = peach-300", () => {
      const { getByText } = renderWithTheme(
        <BracketLabel variant="peach">peach</BracketLabel>,
      );
      const node = getByText("[ PEACH ]");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.color).toBe(p.peach[300]);
    });

    it("aurora = aurora-300", () => {
      const { getByText } = renderWithTheme(
        <BracketLabel variant="aurora">aurora</BracketLabel>,
      );
      const node = getByText("[ AURORA ]");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.color).toBe(p.aurora[300]);
    });
  });

  describe("accessibility", () => {
    it("announces the inner text (not the brackets) by default", () => {
      const { getByLabelText } = renderWithTheme(
        <BracketLabel>Your streak</BracketLabel>,
      );
      expect(getByLabelText("Your streak")).toBeTruthy();
    });

    it("omits the accessibilityLabel when announceAsLabel=false", () => {
      const { getByText } = renderWithTheme(
        <BracketLabel announceAsLabel={false}>Decorative</BracketLabel>,
      );
      const node = getByText("[ DECORATIVE ]");
      expect(node.props.accessibilityLabel).toBeUndefined();
    });
  });

  describe("snapshot", () => {
    it("renders a stable tree with defaults", () => {
      const { toJSON } = renderWithTheme(<BracketLabel>Stable</BracketLabel>);
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
