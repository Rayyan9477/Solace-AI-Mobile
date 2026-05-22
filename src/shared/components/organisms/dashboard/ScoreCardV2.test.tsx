import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ScoreCardV2 } from "./ScoreCardV2";

describe("ScoreCardV2", () => {
  const onPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(
      <ScoreCardV2 score={72} testID="score-v2" />
    );
    expect(getByTestId("score-v2-static")).toBeTruthy();
  });

  it("renders snapshot — hero size", () => {
    const tree = render(
      <ScoreCardV2 score={72} size="hero" label="Solace Score" testID="score-v2" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders snapshot — compact size", () => {
    const tree = render(
      <ScoreCardV2 score={50} size="compact" testID="score-v2" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays the score number", () => {
    const { getByText } = render(<ScoreCardV2 score={85} />);
    expect(getByText("85")).toBeTruthy();
  });

  it("renders bracketKicker when provided", () => {
    const { getByText } = render(
      <ScoreCardV2 score={72} bracketKicker="MENTAL HEALTH" />
    );
    expect(getByText("[ MENTAL HEALTH ]")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    const { getByText } = render(
      <ScoreCardV2 score={72} subtitle="Good progress this week" />
    );
    expect(getByText("Good progress this week")).toBeTruthy();
  });

  it("renders positive delta chip", () => {
    const { getByText } = render(
      <ScoreCardV2 score={72} delta={5} testID="score-v2" />
    );
    expect(getByText("↑ +5 this week")).toBeTruthy();
  });

  it("renders negative delta chip", () => {
    const { getByText } = render(
      <ScoreCardV2 score={72} delta={-3} testID="score-v2" />
    );
    expect(getByText("↓ -3 this week")).toBeTruthy();
  });

  it("does not render delta chip when delta is undefined", () => {
    const { queryByTestId } = render(
      <ScoreCardV2 score={72} testID="score-v2" />
    );
    expect(queryByTestId("score-v2-delta")).toBeNull();
  });

  it("wraps in TouchableOpacity when onPress provided", () => {
    const { getByTestId } = render(
      <ScoreCardV2 score={72} onPress={onPress} testID="score-v2" />
    );
    expect(getByTestId("score-v2-pressable")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const { getByTestId } = render(
      <ScoreCardV2 score={72} onPress={onPress} testID="score-v2" />
    );
    fireEvent.press(getByTestId("score-v2-pressable"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has accessible label with score info", () => {
    const { getByTestId } = render(
      <ScoreCardV2 score={72} label="Solace Score" testID="score-v2" />
    );
    const el = getByTestId("score-v2-static");
    expect(el.props.accessibilityLabel).toContain("72 out of 100");
  });

  it("includes delta in accessibility label", () => {
    const { getByTestId } = render(
      <ScoreCardV2 score={72} delta={5} onPress={onPress} testID="score-v2" />
    );
    const el = getByTestId("score-v2-pressable");
    expect(el.props.accessibilityLabel).toContain("this week");
  });

  it("applies custom style", () => {
    const { getByTestId } = render(
      <ScoreCardV2 score={72} testID="score-v2" style={{ marginTop: 20 }} />
    );
    const el = getByTestId("score-v2-static");
    const styleArr = [el.props.style].flat();
    expect(styleArr).toEqual(
      expect.arrayContaining([expect.objectContaining({ marginTop: 20 })])
    );
  });
});
