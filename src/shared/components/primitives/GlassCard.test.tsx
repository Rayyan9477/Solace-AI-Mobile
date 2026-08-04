jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

// BlurView requires native bridge — mock with a plain View
jest.mock("expo-blur", () => {
  const { View } = require("react-native");
  return { BlurView: View };
});

import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { GlassCard } from "./GlassCard";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("GlassCard", () => {
  it("renders children", () => {
    const { getByText } = renderWithTheme(
      <GlassCard>
        <Text>hello</Text>
      </GlassCard>,
    );
    expect(getByText("hello")).toBeTruthy();
  });

  it("defaults to radius=20", () => {
    const { getByTestId } = renderWithTheme(<GlassCard testID="card"><></></GlassCard>);
    const node = getByTestId("card");
    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style.filter(Boolean))
      : node.props.style;
    expect(style.borderRadius).toBe(20);
    expect(style.borderWidth).toBe(1);
  });

  it("applies custom radius", () => {
    const { getByTestId } = renderWithTheme(
      <GlassCard testID="card" radius={32}><></></GlassCard>,
    );
    const style = Array.isArray(getByTestId("card").props.style)
      ? Object.assign({}, ...getByTestId("card").props.style.filter(Boolean))
      : getByTestId("card").props.style;
    expect(style.borderRadius).toBe(32);
  });

  it.each(["default", "strong"] as const)("renders variant=%s without throwing", (variant) => {
    const { toJSON } = renderWithTheme(<GlassCard variant={variant}><></></GlassCard>);
    expect(toJSON()).toBeTruthy();
  });

  it("forwards accessibility props", () => {
    const { getByLabelText } = renderWithTheme(
      <GlassCard accessible accessibilityLabel="Score card">
        <Text>72</Text>
      </GlassCard>,
    );
    expect(getByLabelText("Score card")).toBeTruthy();
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <GlassCard><Text>snap</Text></GlassCard>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
