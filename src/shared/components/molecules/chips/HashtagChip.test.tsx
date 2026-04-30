jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { HashtagChip } from "./HashtagChip";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("HashtagChip", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders without crashing", () => {
    const { toJSON } = renderWithTheme(
      <HashtagChip label="anxious" testID="chip" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot (default variant)", () => {
    const { toJSON } = renderWithTheme(
      <HashtagChip label="hopeful" testID="chip" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("matches snapshot (selected)", () => {
    const { toJSON } = renderWithTheme(
      <HashtagChip label="hopeful" selected testID="chip" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("prepends # to label", () => {
    const { getByText } = renderWithTheme(
      <HashtagChip label="anxious" />,
    );
    expect(getByText("#anxious")).toBeTruthy();
  });

  it("renders label with # prefix regardless of input", () => {
    // The component always prepends "#" — label="#hopeful" renders text node "#hopeful".
    // Use exact:false so the query matches partial/split text nodes.
    const { getByText } = renderWithTheme(
      <HashtagChip label="#hopeful" />,
    );
    expect(getByText("#hopeful", { exact: false })).toBeTruthy();
  });

  describe("onPress variant", () => {
    it("calls onPress when chip is pressed", () => {
      const onPress = jest.fn();
      const { getByTestId } = renderWithTheme(
        <HashtagChip label="calm" onPress={onPress} testID="chip" />,
      );
      fireEvent.press(getByTestId("chip"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("has accessibilityRole=button when onPress provided", () => {
      const { getByTestId } = renderWithTheme(
        <HashtagChip label="calm" onPress={jest.fn()} testID="chip" />,
      );
      expect(getByTestId("chip").props.accessibilityRole).toBe("button");
    });
  });

  describe("onRemove variant", () => {
    it("renders remove button when onRemove is provided", () => {
      const { getByTestId } = renderWithTheme(
        <HashtagChip label="anxious" onRemove={jest.fn()} testID="chip" />,
      );
      expect(getByTestId("chip-remove")).toBeTruthy();
    });

    it("does not render remove button when onRemove is omitted", () => {
      const { queryByTestId } = renderWithTheme(
        <HashtagChip label="anxious" testID="chip" />,
      );
      expect(queryByTestId("chip-remove")).toBeNull();
    });

    it("calls onRemove when remove button is pressed", () => {
      const onRemove = jest.fn();
      const { getByTestId } = renderWithTheme(
        <HashtagChip label="anxious" onRemove={onRemove} testID="chip" />,
      );
      fireEvent.press(getByTestId("chip-remove"));
      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe("accessibility", () => {
    it("has accessibilityState.selected=false by default", () => {
      const { getByTestId } = renderWithTheme(
        <HashtagChip label="calm" onPress={jest.fn()} testID="chip" />,
      );
      expect(getByTestId("chip").props.accessibilityState?.selected).toBe(false);
    });

    it("has accessibilityState.selected=true when selected", () => {
      const { getByTestId } = renderWithTheme(
        <HashtagChip label="calm" selected onPress={jest.fn()} testID="chip" />,
      );
      expect(getByTestId("chip").props.accessibilityState?.selected).toBe(true);
    });
  });
});
