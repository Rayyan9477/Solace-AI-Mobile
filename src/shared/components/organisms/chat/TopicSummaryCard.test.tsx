jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

jest.mock("expo-blur", () => {
  const { View } = require("react-native");
  return { BlurView: View };
});

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { TopicSummaryCard } from "./TopicSummaryCard";
import type { TopicSummaryItem } from "./TopicSummaryCard";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const noop = jest.fn();

const defaultItems: TopicSummaryItem[] = [
  { text: "You identified a distorted thought pattern." },
  { text: "You challenged the evidence for your belief." },
  { iconName: "lightbulb", text: "You found a more balanced perspective." },
];

describe("TopicSummaryCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(() =>
      renderWithTheme(
        <TopicSummaryCard topic="What we explored" items={defaultItems} />,
      ),
    ).not.toThrow();
  });

  it("renders a stable snapshot with minimal props", () => {
    const { toJSON } = renderWithTheme(
      <TopicSummaryCard
        topic="What we explored"
        items={defaultItems}
        testID="card"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot with all props", () => {
    const { toJSON } = renderWithTheme(
      <TopicSummaryCard
        topic="What we explored"
        bracket="INSIGHT"
        items={defaultItems}
        primaryAction={{ label: "Save insights", onPress: noop }}
        secondaryAction={{ label: "Share", onPress: noop }}
        testID="card"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("content", () => {
    it("displays the topic heading", () => {
      const { getByText } = renderWithTheme(
        <TopicSummaryCard topic="What we explored" items={defaultItems} />,
      );
      expect(getByText("What we explored")).toBeTruthy();
    });

    it("displays all item texts", () => {
      const { getByText } = renderWithTheme(
        <TopicSummaryCard topic="What we explored" items={defaultItems} />,
      );
      defaultItems.forEach((item) => {
        expect(getByText(item.text)).toBeTruthy();
      });
    });

    it("renders BracketLabel when bracket is provided", () => {
      const { getByText } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          bracket="INSIGHT"
          items={defaultItems}
        />,
      );
      // BracketLabel uppercases and brackets the text
      expect(getByText("[ INSIGHT ]")).toBeTruthy();
    });

    it("does not render BracketLabel when bracket is absent", () => {
      const { queryByText } = renderWithTheme(
        <TopicSummaryCard topic="What we explored" items={defaultItems} />,
      );
      expect(queryByText("[ INSIGHT ]")).toBeNull();
    });
  });

  describe("action buttons", () => {
    it("renders primary action button when provided", () => {
      const { getByTestId } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          items={defaultItems}
          primaryAction={{ label: "Save insights", onPress: noop }}
          testID="card"
        />,
      );
      expect(getByTestId("card-primary")).toBeTruthy();
    });

    it("renders secondary action button when provided", () => {
      const { getByTestId } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          items={defaultItems}
          secondaryAction={{ label: "Share", onPress: noop }}
          testID="card"
        />,
      );
      expect(getByTestId("card-secondary")).toBeTruthy();
    });

    it("does not render action row when no actions provided", () => {
      const { queryByTestId } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          items={defaultItems}
          testID="card"
        />,
      );
      expect(queryByTestId("card-primary")).toBeNull();
      expect(queryByTestId("card-secondary")).toBeNull();
    });

    it("calls primaryAction.onPress when primary button is tapped", () => {
      const onPrimary = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          items={defaultItems}
          primaryAction={{ label: "Save insights", onPress: onPrimary }}
          testID="card"
        />,
      );
      fireEvent.press(getByTestId("card-primary"));
      expect(onPrimary).toHaveBeenCalledTimes(1);
    });

    it("calls secondaryAction.onPress when secondary button is tapped", () => {
      const onSecondary = jest.fn();
      const { getByTestId } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          items={defaultItems}
          secondaryAction={{ label: "Share", onPress: onSecondary }}
          testID="card"
        />,
      );
      fireEvent.press(getByTestId("card-secondary"));
      expect(onSecondary).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("primary button has accessibilityRole=button", () => {
      const { getByTestId } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          items={defaultItems}
          primaryAction={{ label: "Save insights", onPress: noop }}
          testID="card"
        />,
      );
      expect(getByTestId("card-primary").props.accessibilityRole).toBe("button");
    });

    it("secondary button has accessibilityRole=button", () => {
      const { getByTestId } = renderWithTheme(
        <TopicSummaryCard
          topic="What we explored"
          items={defaultItems}
          secondaryAction={{ label: "Share", onPress: noop }}
          testID="card"
        />,
      );
      expect(getByTestId("card-secondary").props.accessibilityRole).toBe("button");
    });
  });
});
