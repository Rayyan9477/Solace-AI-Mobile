jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { StarField } from "./StarField";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("StarField", () => {
  it("mounts without throwing", () => {
    expect(() =>
      renderWithTheme(<StarField width={375} height={260} />),
    ).not.toThrow();
  });

  it("renders a stable snapshot with default seed", () => {
    const { toJSON } = renderWithTheme(
      <StarField testID="stars" width={375} height={260} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders the same output given the same seed (deterministic)", () => {
    const { toJSON: toJSON1 } = renderWithTheme(
      <StarField width={375} height={260} seed={99} count={10} />,
    );
    const { toJSON: toJSON2 } = renderWithTheme(
      <StarField width={375} height={260} seed={99} count={10} />,
    );
    expect(toJSON1()).toEqual(toJSON2());
  });

  it("produces different output for different seeds", () => {
    const { toJSON: a } = renderWithTheme(
      <StarField width={375} height={260} seed={1} count={10} />,
    );
    const { toJSON: b } = renderWithTheme(
      <StarField width={375} height={260} seed={2} count={10} />,
    );
    expect(JSON.stringify(a())).not.toEqual(JSON.stringify(b()));
  });

  describe("count prop", () => {
    it("renders with a custom count without throwing", () => {
      const { toJSON } = renderWithTheme(
        <StarField width={300} height={200} count={50} />,
      );
      expect(toJSON()).toBeTruthy();
    });

    it("renders with count=1 without throwing", () => {
      const { toJSON } = renderWithTheme(
        <StarField width={200} height={200} count={1} />,
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("is fully hidden from screen readers", () => {
      const { getByTestId } = renderWithTheme(
        <StarField testID="stars" width={375} height={260} />,
      );
      const node = getByTestId("stars", { includeHiddenElements: true });
      expect(node.props.accessibilityElementsHidden).toBe(true);
    });
  });
});
