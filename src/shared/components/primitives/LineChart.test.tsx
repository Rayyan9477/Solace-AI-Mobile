jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { LineChart, type LineChartPoint } from "./LineChart";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const TWO_POINTS: LineChartPoint[] = [
  { x: 0, y: 0.3 },
  { x: 1, y: 0.8 },
];

const MULTI_POINTS: LineChartPoint[] = [
  { x: 0, y: 0.2 },
  { x: 0.25, y: 0.5 },
  { x: 0.5, y: 0.4 },
  { x: 0.75, y: 0.9 },
  { x: 1, y: 0.7 },
];

describe("LineChart", () => {
  it("renders without crashing with minimum 2 points", () => {
    const { getByTestId } = renderWithTheme(
      <LineChart
        testID="chart"
        data={TWO_POINTS}
        width={300}
        height={120}
        accessibilityLabel="Mood trend over 2 days"
      />,
    );
    expect(getByTestId("chart")).toBeTruthy();
  });

  it("has accessibilityRole='img'", () => {
    const { getByTestId } = renderWithTheme(
      <LineChart
        testID="chart"
        data={TWO_POINTS}
        width={300}
        height={120}
        accessibilityLabel="Mood trend"
      />,
    );
    expect(getByTestId("chart").props.accessibilityRole).toBe("image");
  });

  it("exposes the required accessibilityLabel", () => {
    const label = "Mood trend over 3 days, rising";
    const { getByLabelText } = renderWithTheme(
      <LineChart
        data={TWO_POINTS}
        width={300}
        height={120}
        accessibilityLabel={label}
      />,
    );
    expect(getByLabelText(label)).toBeTruthy();
  });

  it("renders with sage-aurora variant (default)", () => {
    const { getByTestId } = renderWithTheme(
      <LineChart
        testID="chart"
        data={MULTI_POINTS}
        width={300}
        height={120}
        variant="sage-aurora"
        accessibilityLabel="Mood chart"
      />,
    );
    expect(getByTestId("chart")).toBeTruthy();
  });

  it("renders with peach-aurora variant", () => {
    const { getByTestId } = renderWithTheme(
      <LineChart
        testID="chart"
        data={MULTI_POINTS}
        width={300}
        height={120}
        variant="peach-aurora"
        accessibilityLabel="Mood chart peach"
      />,
    );
    expect(getByTestId("chart")).toBeTruthy();
  });

  it("renders with showEndpoint=false", () => {
    const { getByTestId } = renderWithTheme(
      <LineChart
        testID="chart"
        data={TWO_POINTS}
        width={300}
        height={120}
        showEndpoint={false}
        accessibilityLabel="Mood chart no endpoint"
      />,
    );
    expect(getByTestId("chart")).toBeTruthy();
  });

  it("renders with many data points", () => {
    const manyPoints: LineChartPoint[] = Array.from({ length: 30 }, (_, i) => ({
      x: i / 29,
      y: Math.abs(Math.sin(i * 0.4)),
    }));
    const { getByTestId } = renderWithTheme(
      <LineChart
        testID="chart"
        data={manyPoints}
        width={360}
        height={150}
        accessibilityLabel="30-day mood trend"
      />,
    );
    expect(getByTestId("chart")).toBeTruthy();
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <LineChart
        data={MULTI_POINTS}
        width={300}
        height={120}
        accessibilityLabel="Snapshot mood trend"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
