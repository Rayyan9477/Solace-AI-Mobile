jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { render } from "@testing-library/react-native";

import { BarChart, type BarChartBar } from "./BarChart";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const SEVEN_BARS: BarChartBar[] = [
  { label: "Mon", value: 0.5 },
  { label: "Tue", value: 0.7 },
  { label: "Wed", value: 0.4 },
  { label: "Thu", value: 0.9, highlighted: true },
  { label: "Fri", value: 0.6 },
  { label: "Sat", value: 0.3 },
  { label: "Sun", value: 0.8 },
];

describe("BarChart", () => {
  it("renders without crashing", () => {
    const { getByTestId } = renderWithTheme(
      <BarChart
        testID="barchart"
        bars={SEVEN_BARS}
        width={280}
        height={120}
        accessibilityLabel="7-day mood chart"
      />,
    );
    expect(getByTestId("barchart")).toBeTruthy();
  });

  it("has accessibilityRole='img'", () => {
    const { getByTestId } = renderWithTheme(
      <BarChart
        testID="barchart"
        bars={SEVEN_BARS}
        width={280}
        height={120}
        accessibilityLabel="7-day mood chart"
      />,
    );
    expect(getByTestId("barchart").props.accessibilityRole).toBe("image");
  });

  it("exposes the required accessibilityLabel", () => {
    const label = "Sleep duration last 7 days";
    const { getByLabelText } = renderWithTheme(
      <BarChart
        bars={SEVEN_BARS}
        width={280}
        height={120}
        accessibilityLabel={label}
      />,
    );
    expect(getByLabelText(label)).toBeTruthy();
  });

  it("renders all bar labels", () => {
    const { getByText } = renderWithTheme(
      <BarChart
        bars={SEVEN_BARS}
        width={280}
        height={120}
        accessibilityLabel="7-day chart"
      />,
    );
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((day) => {
      expect(getByText(day)).toBeTruthy();
    });
  });

  it("renders with sage variant (default)", () => {
    const { getByTestId } = renderWithTheme(
      <BarChart
        testID="barchart"
        bars={SEVEN_BARS}
        width={280}
        height={120}
        variant="sage"
        accessibilityLabel="Sage chart"
      />,
    );
    expect(getByTestId("barchart")).toBeTruthy();
  });

  it("renders with lavender variant", () => {
    const { getByTestId } = renderWithTheme(
      <BarChart
        testID="barchart"
        bars={SEVEN_BARS}
        width={280}
        height={120}
        variant="lavender"
        accessibilityLabel="Lavender chart"
      />,
    );
    expect(getByTestId("barchart")).toBeTruthy();
  });

  it("renders with peach variant", () => {
    const { getByTestId } = renderWithTheme(
      <BarChart
        testID="barchart"
        bars={SEVEN_BARS}
        width={280}
        height={120}
        variant="peach"
        accessibilityLabel="Peach chart"
      />,
    );
    expect(getByTestId("barchart")).toBeTruthy();
  });

  it("renders with zero-value bars without crashing", () => {
    const zeroBars: BarChartBar[] = [
      { label: "A", value: 0 },
      { label: "B", value: 0 },
    ];
    const { getByTestId } = renderWithTheme(
      <BarChart
        testID="barchart"
        bars={zeroBars}
        width={120}
        height={80}
        accessibilityLabel="Zero bars"
      />,
    );
    expect(getByTestId("barchart")).toBeTruthy();
  });

  it("renders a stable snapshot", () => {
    const { toJSON } = renderWithTheme(
      <BarChart
        bars={SEVEN_BARS}
        width={280}
        height={120}
        accessibilityLabel="Snapshot bar chart"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
