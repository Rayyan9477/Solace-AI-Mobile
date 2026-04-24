jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { HeroCard } from "./HeroCard";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("HeroCard", () => {
  it("wraps children and defaults to radius=24", () => {
    const { getByText, getByTestId } = renderWithTheme(
      <HeroCard testID="hero">
        <Text>inner content</Text>
      </HeroCard>,
    );
    expect(getByText("inner content")).toBeTruthy();
    const style = Array.isArray(getByTestId("hero").props.style)
      ? Object.assign({}, ...getByTestId("hero").props.style.filter(Boolean))
      : getByTestId("hero").props.style;
    expect(style.borderRadius).toBe(24);
    expect(style.overflow).toBe("hidden");
  });

  it("applies custom radius + hairline", () => {
    const { getByTestId } = renderWithTheme(
      <HeroCard testID="hero" radius={32} hairline={2}>
        <Text>x</Text>
      </HeroCard>,
    );
    const style = Array.isArray(getByTestId("hero").props.style)
      ? Object.assign({}, ...getByTestId("hero").props.style.filter(Boolean))
      : getByTestId("hero").props.style;
    expect(style.borderRadius).toBe(32);
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <HeroCard>
        <Text>snap</Text>
      </HeroCard>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
