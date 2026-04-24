jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

jest.mock("expo-blur", () => {
  const { View } = require("react-native");
  return { BlurView: View };
});

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { GlassAuroraCard } from "./GlassAuroraCard";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("GlassAuroraCard", () => {
  it("renders children inside a rounded container", () => {
    const { getByText, getByTestId } = renderWithTheme(
      <GlassAuroraCard testID="hero">
        <Text>Solace Score</Text>
      </GlassAuroraCard>,
    );
    expect(getByText("Solace Score")).toBeTruthy();
    const style = Array.isArray(getByTestId("hero").props.style)
      ? Object.assign({}, ...getByTestId("hero").props.style.filter(Boolean))
      : getByTestId("hero").props.style;
    expect(style.borderRadius).toBe(24);
    expect(style.borderWidth).toBe(1);
  });

  it("applies custom radius", () => {
    const { getByTestId } = renderWithTheme(
      <GlassAuroraCard testID="hero" radius={32}>
        <Text>x</Text>
      </GlassAuroraCard>,
    );
    const style = Array.isArray(getByTestId("hero").props.style)
      ? Object.assign({}, ...getByTestId("hero").props.style.filter(Boolean))
      : getByTestId("hero").props.style;
    expect(style.borderRadius).toBe(32);
  });

  it("carries cosmic-tinted shadow colour", () => {
    const { getByTestId } = renderWithTheme(
      <GlassAuroraCard testID="hero"><Text>x</Text></GlassAuroraCard>,
    );
    const style = Array.isArray(getByTestId("hero").props.style)
      ? Object.assign({}, ...getByTestId("hero").props.style.filter(Boolean))
      : getByTestId("hero").props.style;
    expect(style.shadowColor).toBe("#6B8FFF");
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <GlassAuroraCard>
        <Text>snap</Text>
      </GlassAuroraCard>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
