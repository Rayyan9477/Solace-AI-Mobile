/**
 * HistoryBars Tests — Sprint 5 (prototype v4.2)
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { HistoryBars } from "./HistoryBars";

const sevenDays = [
  { label: "Mon", hours: 6.5 },
  { label: "Tue", hours: 7.2 },
  { label: "Wed", hours: 5.8 },
  { label: "Thu", hours: 8.1 },
  { label: "Fri", hours: 7.5 },
  { label: "Sat", hours: 9.0 },
  { label: "Sun", hours: 7.8, isToday: true },
];

describe("HistoryBars", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(
      <HistoryBars days={sevenDays} testID="history-bars" />,
    );
    expect(getByTestId("history-bars")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<HistoryBars days={sevenDays} testID="history-bars" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders goal text with default goalHours", () => {
    const { getByText } = render(<HistoryBars days={sevenDays} />);
    expect(getByText("Goal: 8h")).toBeTruthy();
  });

  it("renders goal text with custom goalHours", () => {
    const { getByText } = render(
      <HistoryBars days={sevenDays} goalHours={7} />,
    );
    expect(getByText("Goal: 7h")).toBeTruthy();
  });

  it("passes accessibility label to inner BarChart", () => {
    const { UNSAFE_getByProps } = render(
      <HistoryBars days={sevenDays} goalHours={8} />,
    );
    const chart = UNSAFE_getByProps({ accessibilityRole: "image" });
    expect(chart.props.accessibilityLabel).toContain(
      "Sleep history for the last 7 days, goal 8 hours",
    );
  });

  it("renders day labels via BarChart", () => {
    const { getByText } = render(<HistoryBars days={sevenDays} />);
    // BarChart renders bar labels — check at least today's label
    expect(getByText("Sun")).toBeTruthy();
  });

  it("accepts custom height prop", () => {
    const { getByTestId } = render(
      <HistoryBars days={sevenDays} height={200} testID="history-bars" />,
    );
    expect(getByTestId("history-bars")).toBeTruthy();
  });
});
