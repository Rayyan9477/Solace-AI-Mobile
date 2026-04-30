jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { SocialButton } from "./SocialButton";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("SocialButton", () => {
  const onPress = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <SocialButton provider="apple" onPress={onPress} testID="social-btn" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = renderWithTheme(
      <SocialButton provider="google" onPress={onPress} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it.each(["apple", "google", "github"] as const)(
    "renders provider=%s without throwing",
    (provider) => {
      const { toJSON } = renderWithTheme(
        <SocialButton provider={provider} onPress={onPress} />,
      );
      expect(toJSON()).toBeTruthy();
    },
  );

  it("calls onPress when pressed", () => {
    const { getByTestId } = renderWithTheme(
      <SocialButton provider="github" onPress={onPress} testID="social-btn" />,
    );
    fireEvent.press(getByTestId("social-btn"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  describe("sizing", () => {
    it("applies default size=56", () => {
      const { getByTestId } = renderWithTheme(
        <SocialButton provider="apple" onPress={onPress} testID="social-btn" />,
      );
      const node = getByTestId("social-btn");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(56);
      expect(style.height).toBe(56);
    });

    it("applies custom size", () => {
      const { getByTestId } = renderWithTheme(
        <SocialButton provider="apple" onPress={onPress} testID="social-btn" size={72} />,
      );
      const node = getByTestId("social-btn");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(72);
      expect(style.height).toBe(72);
    });
  });

  describe("accessibility", () => {
    it("has accessibilityRole=button", () => {
      const { getByTestId } = renderWithTheme(
        <SocialButton provider="apple" onPress={onPress} testID="social-btn" />,
      );
      expect(getByTestId("social-btn").props.accessibilityRole).toBe("button");
    });

    it.each(["apple", "google", "github"] as const)(
      "has correct accessibilityLabel for provider=%s",
      (provider) => {
        const { getByLabelText } = renderWithTheme(
          <SocialButton provider={provider} onPress={onPress} />,
        );
        expect(getByLabelText(`Sign in with ${provider}`)).toBeTruthy();
      },
    );

    it("has hitSlop for minimum 44pt touch target", () => {
      const { getByTestId } = renderWithTheme(
        <SocialButton provider="google" onPress={onPress} testID="social-btn" />,
      );
      const node = getByTestId("social-btn");
      expect(node.props.hitSlop).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
    });
  });
});
