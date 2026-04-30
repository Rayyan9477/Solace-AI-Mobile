jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { SuggestionCard } from "./SuggestionCard";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps = {
  iconName: "lightbulb",
  title: "Try writing about your day",
  body: "Describe one moment that stood out to you.",
  testID: "suggestion-card",
};

describe("SuggestionCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(<SuggestionCard {...baseProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot (default peach-border variant)", () => {
    const { toJSON } = renderWithTheme(<SuggestionCard {...baseProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("matches snapshot (glass variant)", () => {
    const { toJSON } = renderWithTheme(
      <SuggestionCard {...baseProps} variant="glass" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders title and body text", () => {
    const { getByText } = renderWithTheme(<SuggestionCard {...baseProps} />);
    expect(getByText("Try writing about your day")).toBeTruthy();
    expect(getByText("Describe one moment that stood out to you.")).toBeTruthy();
  });

  describe("dismiss button", () => {
    it("renders dismiss button when onDismiss is provided", () => {
      const { getByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} onDismiss={jest.fn()} />,
      );
      expect(getByTestId("suggestion-card-dismiss")).toBeTruthy();
    });

    it("does not render dismiss button when onDismiss is omitted", () => {
      const { queryByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} />,
      );
      expect(queryByTestId("suggestion-card-dismiss")).toBeNull();
    });

    it("calls onDismiss when dismiss button is pressed", () => {
      const onDismiss = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} onDismiss={onDismiss} />,
      );
      fireEvent.press(getByTestId("suggestion-card-dismiss"));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("dismiss button has accessibilityRole=button", () => {
      const { getByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} onDismiss={jest.fn()} />,
      );
      expect(getByTestId("suggestion-card-dismiss").props.accessibilityRole).toBe("button");
    });
  });

  describe("CTA button", () => {
    it("renders CTA when ctaLabel is provided", () => {
      const { getByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} ctaLabel="Try it" onCtaPress={jest.fn()} />,
      );
      expect(getByTestId("suggestion-card-cta")).toBeTruthy();
    });

    it("calls onCtaPress when CTA is pressed", () => {
      const onCtaPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} ctaLabel="Try it" onCtaPress={onCtaPress} />,
      );
      fireEvent.press(getByTestId("suggestion-card-cta"));
      expect(onCtaPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("variants", () => {
    it("renders sage-border variant without crashing", () => {
      const { toJSON } = renderWithTheme(
        <SuggestionCard {...baseProps} variant="sage-border" />,
      );
      expect(toJSON()).toBeTruthy();
    });

    it("renders glass variant without crashing", () => {
      const { toJSON } = renderWithTheme(
        <SuggestionCard {...baseProps} variant="glass" />,
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("card has an accessibilityLabel", () => {
      const { getByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} />,
      );
      const node = getByTestId("suggestion-card");
      expect(node.props.accessibilityLabel).toBeTruthy();
    });

    it("uses custom accessibilityLabel when provided", () => {
      const { getByTestId } = renderWithTheme(
        <SuggestionCard {...baseProps} accessibilityLabel="Writing prompt" />,
      );
      expect(getByTestId("suggestion-card").props.accessibilityLabel).toBe(
        "Writing prompt",
      );
    });
  });
});
