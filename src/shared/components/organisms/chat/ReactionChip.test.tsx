jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { ReactionChip } from "./ReactionChip";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const noop = jest.fn();

describe("ReactionChip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(() =>
      renderWithTheme(
        <ReactionChip label="This helped" onPress={noop} />,
      ),
    ).not.toThrow();
  });

  it("renders a stable snapshot (unselected)", () => {
    const { toJSON } = renderWithTheme(
      <ReactionChip label="This helped" onPress={noop} testID="chip" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot (selected)", () => {
    const { toJSON } = renderWithTheme(
      <ReactionChip label="This helped" selected onPress={noop} testID="chip" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot (with icon)", () => {
    const { toJSON } = renderWithTheme(
      <ReactionChip label="This helped" iconName="thumbs-up" onPress={noop} testID="chip" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("label", () => {
    it("displays the label text", () => {
      const { getByText } = renderWithTheme(
        <ReactionChip label="This helped" onPress={noop} />,
      );
      expect(getByText("This helped")).toBeTruthy();
    });

    it("displays 'Not quite' label", () => {
      const { getByText } = renderWithTheme(
        <ReactionChip label="Not quite" onPress={noop} />,
      );
      expect(getByText("Not quite")).toBeTruthy();
    });
  });

  describe("accessibility", () => {
    it("has accessibilityRole=button", () => {
      const { getByTestId } = renderWithTheme(
        <ReactionChip label="This helped" onPress={noop} testID="chip" />,
      );
      const node = getByTestId("chip");
      expect(node.props.accessibilityRole).toBe("button");
    });

    it("has accessibilityLabel matching the label prop", () => {
      const { getByTestId } = renderWithTheme(
        <ReactionChip label="This helped" onPress={noop} testID="chip" />,
      );
      const node = getByTestId("chip");
      expect(node.props.accessibilityLabel).toBe("This helped");
    });

    it("accessibilityState.selected is false by default", () => {
      const { getByTestId } = renderWithTheme(
        <ReactionChip label="This helped" onPress={noop} testID="chip" />,
      );
      const node = getByTestId("chip");
      expect(node.props.accessibilityState?.selected).toBe(false);
    });

    it("accessibilityState.selected is true when selected", () => {
      const { getByTestId } = renderWithTheme(
        <ReactionChip label="This helped" selected onPress={noop} testID="chip" />,
      );
      const node = getByTestId("chip");
      expect(node.props.accessibilityState?.selected).toBe(true);
    });
  });

  describe("interactions", () => {
    it("calls onPress when tapped", () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ReactionChip label="This helped" onPress={onPress} testID="chip" />,
      );
      fireEvent.press(getByTestId("chip"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("calls onPress again on second tap", () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <ReactionChip label="Not quite" onPress={onPress} testID="chip" />,
      );
      fireEvent.press(getByTestId("chip"));
      fireEvent.press(getByTestId("chip"));
      expect(onPress).toHaveBeenCalledTimes(2);
    });
  });
});
