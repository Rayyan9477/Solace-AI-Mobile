jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

// GlassAuroraCard uses expo-blur + expo-linear-gradient — stub native bridges
jest.mock("expo-blur", () => {
  const { View } = require("react-native");
  return { BlurView: View };
});
jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { ChatBubbleAction } from "./ChatBubbleAction";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const noop = jest.fn();

describe("ChatBubbleAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(() =>
      renderWithTheme(
        <ChatBubbleAction title="4-7-8 Breathing" onPress={noop} />,
      ),
    ).not.toThrow();
  });

  it("renders a stable snapshot with defaults", () => {
    const { toJSON } = renderWithTheme(
      <ChatBubbleAction title="4-7-8 Breathing" onPress={noop} testID="action" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot with all props", () => {
    const { toJSON } = renderWithTheme(
      <ChatBubbleAction
        title="4-7-8 Breathing"
        subtitle="2 minutes · Calming"
        iconName="leaf"
        ctaLabel="Begin"
        onPress={noop}
        testID="action"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("content", () => {
    it("displays the title", () => {
      const { getByText } = renderWithTheme(
        <ChatBubbleAction title="4-7-8 Breathing" onPress={noop} />,
      );
      expect(getByText("4-7-8 Breathing")).toBeTruthy();
    });

    it("displays the subtitle when provided", () => {
      const { getByText } = renderWithTheme(
        <ChatBubbleAction
          title="4-7-8 Breathing"
          subtitle="2 minutes · Calming"
          onPress={noop}
        />,
      );
      expect(getByText("2 minutes · Calming")).toBeTruthy();
    });

    it("does not render subtitle when absent", () => {
      const { queryByText } = renderWithTheme(
        <ChatBubbleAction title="4-7-8 Breathing" onPress={noop} />,
      );
      expect(queryByText("2 minutes · Calming")).toBeNull();
    });

    it("renders default ctaLabel 'Try now'", () => {
      const { getByText } = renderWithTheme(
        <ChatBubbleAction title="4-7-8 Breathing" onPress={noop} />,
      );
      expect(getByText("Try now")).toBeTruthy();
    });

    it("renders custom ctaLabel", () => {
      const { getByText } = renderWithTheme(
        <ChatBubbleAction title="Meditation" ctaLabel="Start" onPress={noop} />,
      );
      expect(getByText("Start")).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("has accessibilityRole=button on the outer touchable", () => {
      const { getByTestId } = renderWithTheme(
        <ChatBubbleAction title="4-7-8 Breathing" onPress={noop} testID="action" />,
      );
      const node = getByTestId("action");
      expect(node.props.accessibilityRole).toBe("button");
    });

    it("has descriptive accessibilityLabel combining title and ctaLabel", () => {
      const { getByTestId } = renderWithTheme(
        <ChatBubbleAction
          title="4-7-8 Breathing"
          ctaLabel="Try now"
          onPress={noop}
          testID="action"
        />,
      );
      const node = getByTestId("action");
      expect(node.props.accessibilityLabel).toBe("4-7-8 Breathing: Try now");
    });
  });

  describe("interactions", () => {
    it("calls onPress when tapped", () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ChatBubbleAction title="4-7-8 Breathing" onPress={onPress} testID="action" />,
      );
      fireEvent.press(getByTestId("action"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
