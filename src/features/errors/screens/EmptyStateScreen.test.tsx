/**
 * EmptyStateScreen Tests — prototype v4.2 #40 (Sprint 9 Batch B).
 */

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return { LinearGradient: View };
});

import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Text, View } from "react-native";

import { EmptyStateScreen } from "./EmptyStateScreen";

const mockUseReducedMotion = jest.fn(() => false);
jest.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

const baseProps = {
  onCta: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseReducedMotion.mockReturnValue(false);
});

describe("EmptyStateScreen", () => {
  // 1
  it("renders + matches snapshot", () => {
    const tree = render(<EmptyStateScreen {...baseProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // 2
  it("renders the screen container", () => {
    const { getByTestId } = render(<EmptyStateScreen {...baseProps} />);
    expect(getByTestId("empty-state-screen")).toBeTruthy();
  });

  // 3
  it("renders default 'Start somewhere' bracket label", () => {
    const { getByText } = render(<EmptyStateScreen {...baseProps} />);
    expect(getByText(/START SOMEWHERE/i)).toBeTruthy();
  });

  // 4
  it("renders default headline 'Your story / begins here.'", () => {
    const { getByText } = render(<EmptyStateScreen {...baseProps} />);
    expect(getByText(/Your story/)).toBeTruthy();
    expect(getByText(/begins here/)).toBeTruthy();
  });

  // 5
  it("renders default subtitle copy", () => {
    const { getByText } = render(<EmptyStateScreen {...baseProps} />);
    expect(getByText(/No need for perfect words/)).toBeTruthy();
  });

  // 6
  it("renders default 'Write freely' CTA", () => {
    const { getByText, getByTestId } = render(
      <EmptyStateScreen {...baseProps} />,
    );
    expect(getByText("Write freely")).toBeTruthy();
    expect(getByTestId("empty-cta-button")).toBeTruthy();
  });

  // 7
  it("renders default 3 prompt cards", () => {
    const { getByTestId, getByText } = render(
      <EmptyStateScreen {...baseProps} />,
    );
    expect(getByTestId("empty-prompt-0")).toBeTruthy();
    expect(getByTestId("empty-prompt-1")).toBeTruthy();
    expect(getByTestId("empty-prompt-2")).toBeTruthy();
    expect(getByText("How are you feeling right now?")).toBeTruthy();
  });

  // 8
  it("calls onCta when CTA pressed", () => {
    const onCta = jest.fn();
    const { getByTestId } = render(
      <EmptyStateScreen {...baseProps} onCta={onCta} />,
    );
    fireEvent.press(getByTestId("empty-cta-button"));
    expect(onCta).toHaveBeenCalledTimes(1);
  });

  // 9
  it("calls onPromptPress with the prompt string", () => {
    const onPromptPress = jest.fn();
    const { getByTestId } = render(
      <EmptyStateScreen {...baseProps} onPromptPress={onPromptPress} />,
    );
    fireEvent.press(getByTestId("empty-prompt-1"));
    expect(onPromptPress).toHaveBeenCalledWith("What's one small win from today?");
  });

  // 10
  it("renders custom prompts when provided", () => {
    const prompts = ["Custom A", "Custom B"];
    const { getByText, queryByTestId } = render(
      <EmptyStateScreen {...baseProps} prompts={prompts} />,
    );
    expect(getByText("Custom A")).toBeTruthy();
    expect(getByText("Custom B")).toBeTruthy();
    expect(queryByTestId("empty-prompt-2")).toBeNull();
  });

  // 11
  it("hides prompt list when prompts array is empty", () => {
    const { queryByTestId } = render(
      <EmptyStateScreen {...baseProps} prompts={[]} />,
    );
    expect(queryByTestId("empty-prompts")).toBeNull();
  });

  // 12
  it("renders headline string with newline split", () => {
    const { getByText } = render(
      <EmptyStateScreen
        {...baseProps}
        headline={"Nothing yet,\njust silence."}
      />,
    );
    expect(getByText(/Nothing yet,/)).toBeTruthy();
    expect(getByText(/just silence/)).toBeTruthy();
  });

  // 13
  it("renders headline as typed object", () => {
    const { getByText } = render(
      <EmptyStateScreen
        {...baseProps}
        headline={{ first: "First line", second: "Second line." }}
      />,
    );
    expect(getByText(/First line/)).toBeTruthy();
    expect(getByText(/Second line\./)).toBeTruthy();
  });

  // 14
  it("renders custom subtitle", () => {
    const { getByText } = render(
      <EmptyStateScreen
        {...baseProps}
        subtitle="A custom hint to draw you in"
      />,
    );
    expect(getByText(/custom hint/)).toBeTruthy();
  });

  // 15
  it("renders custom illustration when provided", () => {
    const customIllustration = <View testID="custom-illustration" />;
    const { getByTestId, queryByTestId } = render(
      <EmptyStateScreen
        {...baseProps}
        illustration={customIllustration}
      />,
    );
    expect(
      getByTestId("custom-illustration", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      queryByTestId("empty-default-orb", { includeHiddenElements: true }),
    ).toBeNull();
  });

  // 16
  it("renders default BreathingOrb illustration when none supplied", () => {
    const { getByTestId } = render(<EmptyStateScreen {...baseProps} />);
    expect(
      getByTestId("empty-default-orb", { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  // 17
  it("shows the back button only when onBack is supplied", () => {
    const { queryByTestId, rerender, getByTestId } = render(
      <EmptyStateScreen {...baseProps} />,
    );
    expect(queryByTestId("empty-back-button")).toBeNull();

    const onBack = jest.fn();
    rerender(<EmptyStateScreen {...baseProps} onBack={onBack} />);
    fireEvent.press(getByTestId("empty-back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 18
  it("CTA button meets ≥44pt touch height", () => {
    const { getByTestId } = render(<EmptyStateScreen {...baseProps} />);
    const cta = getByTestId("empty-cta-button");
    const flat = Object.assign(
      {},
      ...[].concat(cta.props.style as never[]).filter(Boolean),
    ) as { minHeight?: number };
    expect((flat.minHeight ?? 0)).toBeGreaterThanOrEqual(44);
  });

  // 19
  it("renders custom header title bracket when provided", () => {
    const { getByText, getByTestId } = render(
      <EmptyStateScreen {...baseProps} headerTitle="Journal" />,
    );
    expect(getByTestId("empty-header-label")).toBeTruthy();
    expect(getByText(/JOURNAL/i)).toBeTruthy();
  });

  // 20
  it("renders without throw when reducedMotion=true", () => {
    mockUseReducedMotion.mockReturnValue(true);
    expect(() => render(<EmptyStateScreen {...baseProps} />)).not.toThrow();
  });
});

// guard against accidentally importing the unused Text
void Text;
