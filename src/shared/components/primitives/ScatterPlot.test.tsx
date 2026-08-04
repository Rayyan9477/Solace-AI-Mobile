jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { ScatterPlot, type ScatterPoint } from "./ScatterPlot";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const SAMPLE_POINTS: ScatterPoint[] = [
  { x: 0.1, y: 0.2, moodLevel: 0 },
  { x: 0.3, y: 0.5, moodLevel: 1 },
  { x: 0.5, y: 0.4, moodLevel: 2 },
  { x: 0.7, y: 0.8, moodLevel: 3 },
  { x: 0.9, y: 0.9, moodLevel: 4 },
];

describe("ScatterPlot", () => {
  it("renders without crashing", () => {
    const { getByTestId } = renderWithTheme(
      <ScatterPlot
        testID="scatter"
        points={SAMPLE_POINTS}
        width={300}
        height={200}
        accessibilityLabel="Mood vs sleep scatter"
      />,
    );
    expect(getByTestId("scatter")).toBeTruthy();
  });

  it("has accessibilityRole='img'", () => {
    const { getByTestId } = renderWithTheme(
      <ScatterPlot
        testID="scatter"
        points={SAMPLE_POINTS}
        width={300}
        height={200}
        accessibilityLabel="Mood scatter"
      />,
    );
    expect(getByTestId("scatter").props.accessibilityRole).toBe("image");
  });

  it("exposes the required accessibilityLabel", () => {
    const label = "Mood versus sleep, 5 data points";
    const { getByLabelText } = renderWithTheme(
      <ScatterPlot
        points={SAMPLE_POINTS}
        width={300}
        height={200}
        accessibilityLabel={label}
      />,
    );
    expect(getByLabelText(label)).toBeTruthy();
  });

  it("renders with all 5 mood levels", () => {
    const allLevels: ScatterPoint[] = [0, 1, 2, 3, 4].map((level) => ({
      x: level / 4,
      y: level / 4,
      moodLevel: level as 0 | 1 | 2 | 3 | 4,
    }));
    const { getByTestId } = renderWithTheme(
      <ScatterPlot
        testID="scatter"
        points={allLevels}
        width={300}
        height={200}
        accessibilityLabel="All mood levels"
      />,
    );
    expect(getByTestId("scatter")).toBeTruthy();
  });

  it("renders with a trend line", () => {
    const { getByTestId } = renderWithTheme(
      <ScatterPlot
        testID="scatter"
        points={SAMPLE_POINTS}
        width={300}
        height={200}
        trendLine={{ from: { x: 0, y: 0.1, moodLevel: 0 }, to: { x: 1, y: 0.9, moodLevel: 4 } }}
        accessibilityLabel="Scatter with trend"
      />,
    );
    expect(getByTestId("scatter")).toBeTruthy();
  });

  it("renders with trendLine=null without crashing", () => {
    const { getByTestId } = renderWithTheme(
      <ScatterPlot
        testID="scatter"
        points={SAMPLE_POINTS}
        width={300}
        height={200}
        trendLine={null}
        accessibilityLabel="Scatter no trend"
      />,
    );
    expect(getByTestId("scatter")).toBeTruthy();
  });

  it("renders axis labels when provided", () => {
    const { getByText } = renderWithTheme(
      <ScatterPlot
        points={SAMPLE_POINTS}
        width={300}
        height={200}
        xAxisLabel="Sleep hours"
        yAxisLabel="Mood"
        accessibilityLabel="Scatter with axes"
      />,
    );
    expect(getByText("Sleep hours")).toBeTruthy();
    expect(getByText("Mood")).toBeTruthy();
  });

  it("renders with empty points array without crashing", () => {
    const { getByTestId } = renderWithTheme(
      <ScatterPlot
        testID="scatter"
        points={[]}
        width={300}
        height={200}
        accessibilityLabel="Empty scatter"
      />,
    );
    expect(getByTestId("scatter")).toBeTruthy();
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <ScatterPlot
        points={SAMPLE_POINTS}
        width={300}
        height={200}
        trendLine={{ from: { x: 0, y: 0.2, moodLevel: 1 }, to: { x: 1, y: 0.8, moodLevel: 3 } }}
        xAxisLabel="Sleep"
        yAxisLabel="Mood"
        accessibilityLabel="Snapshot scatter"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
