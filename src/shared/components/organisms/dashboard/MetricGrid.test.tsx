import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MetricGrid } from "./MetricGrid";
import type { MetricTile } from "./MetricGrid";

const tiles: MetricTile[] = [
  { iconName: "moon", iconHue: "aurora", label: "Sleep", value: "7.8", unit: "h", progress: 0.78 },
  { iconName: "heart", iconHue: "peach", label: "Mood", value: "7.2", unit: "/ 10", progress: 0.72 },
  { iconName: "wind", iconHue: "sage", label: "Mindful", value: "18", unit: "min" },
  { iconName: "zap", iconHue: "lavender", label: "Stress", value: "Low" },
];

describe("MetricGrid", () => {
  const onPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(
      <MetricGrid tiles={tiles} testID="metric-grid" />
    );
    expect(getByTestId("metric-grid")).toBeTruthy();
  });

  it("renders snapshot", () => {
    const tree = render(
      <MetricGrid tiles={tiles} testID="metric-grid" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders all 4 tiles", () => {
    const { getByTestId } = render(
      <MetricGrid tiles={tiles} testID="metric-grid" />
    );
    for (let i = 0; i < 4; i++) {
      expect(getByTestId(`metric-grid-tile-${i}`)).toBeTruthy();
    }
  });

  it("displays tile label and value", () => {
    const { getByText } = render(<MetricGrid tiles={tiles} testID="mg" />);
    expect(getByText("Sleep")).toBeTruthy();
    expect(getByText("7.8")).toBeTruthy();
  });

  it("renders unit when provided", () => {
    const { getByText } = render(<MetricGrid tiles={tiles} />);
    expect(getByText("h")).toBeTruthy();
    expect(getByText("/ 10")).toBeTruthy();
  });

  it("tile has accessibilityRole button when onPress provided", () => {
    const tilesWithPress: MetricTile[] = [
      { ...tiles[0], onPress },
      ...tiles.slice(1),
    ];
    const { getByTestId } = render(
      <MetricGrid tiles={tilesWithPress} testID="mg" />
    );
    const tile = getByTestId("mg-tile-0");
    expect(tile.props.accessibilityRole).toBe("button");
  });

  it("calls onPress when tile is pressed", () => {
    const tilesWithPress: MetricTile[] = [
      { ...tiles[0], onPress },
      ...tiles.slice(1),
    ];
    const { getByTestId } = render(
      <MetricGrid tiles={tilesWithPress} testID="mg" />
    );
    fireEvent.press(getByTestId("mg-tile-0"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("tile without onPress has accessibilityRole text", () => {
    const { getByTestId } = render(
      <MetricGrid tiles={tiles} testID="mg" />
    );
    expect(getByTestId("mg-tile-0").props.accessibilityRole).toBe("text");
  });

  it("accessibilityLabel includes label and value", () => {
    const { getByTestId } = render(
      <MetricGrid tiles={tiles} testID="mg" />
    );
    const tile = getByTestId("mg-tile-0");
    expect(tile.props.accessibilityLabel).toContain("Sleep");
    expect(tile.props.accessibilityLabel).toContain("7.8");
  });

  it("applies custom style to the grid", () => {
    const { getByTestId } = render(
      <MetricGrid tiles={tiles} testID="mg" style={{ marginTop: 16 }} />
    );
    const el = getByTestId("mg");
    expect(el.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ marginTop: 16 })])
    );
  });
});
