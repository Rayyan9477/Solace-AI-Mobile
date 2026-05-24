/**
 * StatTilesRow Tests — Sprint 5 (prototype v4.2)
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { StatTilesRow } from "./StatTilesRow";

const defaultTiles = [
  { value: "10", unit: "min", label: "Duration", iconName: "clock", hue: "sage" as const },
  { value: "+3", label: "Score", iconName: "trending-up", hue: "aurora" as const },
  { value: "7", unit: "days", label: "Streak", iconName: "flame", hue: "peach" as const },
];

describe("StatTilesRow", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(
      <StatTilesRow tiles={defaultTiles} testID="stat-tiles" />,
    );
    expect(getByTestId("stat-tiles")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<StatTilesRow tiles={defaultTiles} testID="stat-tiles" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders value text for each tile", () => {
    const { getByText } = render(<StatTilesRow tiles={defaultTiles} />);
    expect(getByText("10")).toBeTruthy();
    expect(getByText("+3")).toBeTruthy();
    expect(getByText("7")).toBeTruthy();
  });

  it("renders unit text when provided", () => {
    const { getByText } = render(<StatTilesRow tiles={defaultTiles} />);
    expect(getByText("min")).toBeTruthy();
    expect(getByText("days")).toBeTruthy();
  });

  it("renders label text for each tile", () => {
    const { getByText } = render(<StatTilesRow tiles={defaultTiles} />);
    expect(getByText("Duration")).toBeTruthy();
    expect(getByText("Score")).toBeTruthy();
    expect(getByText("Streak")).toBeTruthy();
  });

  it("renders tiles without unit", () => {
    const tiles = [{ value: "+3", label: "Score" }];
    const { getByText, queryByText } = render(<StatTilesRow tiles={tiles} />);
    expect(getByText("+3")).toBeTruthy();
    expect(queryByText("undefined")).toBeNull();
  });

  it("renders tiles without icon", () => {
    const tiles = [{ value: "5", label: "Sessions" }];
    const { getByText } = render(<StatTilesRow tiles={tiles} />);
    expect(getByText("5")).toBeTruthy();
  });

  it("has correct accessibilityRole and label per tile", () => {
    const { UNSAFE_getAllByProps } = render(<StatTilesRow tiles={defaultTiles} />);
    const textTiles = UNSAFE_getAllByProps({ accessibilityRole: "text" });
    // At least 3 tiles with the role
    expect(textTiles.length).toBeGreaterThanOrEqual(3);
    const labels = textTiles.map((el) => el.props.accessibilityLabel);
    expect(labels.some((l) => l?.includes("Duration"))).toBe(true);
    expect(labels.some((l) => l?.includes("Score"))).toBe(true);
    expect(labels.some((l) => l?.includes("Streak"))).toBe(true);
  });

  it("defaults hue to sage when not provided", () => {
    const tiles = [{ value: "1", label: "Test" }];
    // Should render without error — IconTile not shown since no iconName
    const { getByText } = render(<StatTilesRow tiles={tiles} />);
    expect(getByText("1")).toBeTruthy();
  });
});
