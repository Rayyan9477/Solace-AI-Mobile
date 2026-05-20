/**
 * SleepStagesBar Tests — Sprint 5 (prototype v4.2)
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { SleepStagesBar } from "./SleepStagesBar";

const defaultStages = [
  { type: "awake" as const, durationMinutes: 30 },
  { type: "light" as const, durationMinutes: 90 },
  { type: "rem" as const, durationMinutes: 60 },
  { type: "deep" as const, durationMinutes: 120 },
];

describe("SleepStagesBar", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(
      <SleepStagesBar stages={defaultStages} testID="stages-bar" />,
    );
    expect(getByTestId("stages-bar")).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<SleepStagesBar stages={defaultStages} testID="stages-bar" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders default labels when showLabels is true", () => {
    const { getByText } = render(
      <SleepStagesBar stages={defaultStages} showLabels />,
    );
    expect(getByText("Awake")).toBeTruthy();
    expect(getByText("Light")).toBeTruthy();
    expect(getByText("REM")).toBeTruthy();
    expect(getByText("Deep")).toBeTruthy();
  });

  it("hides labels when showLabels is false", () => {
    const { queryByText } = render(
      <SleepStagesBar stages={defaultStages} showLabels={false} />,
    );
    expect(queryByText("REM")).toBeNull();
  });

  it("renders custom label overrides", () => {
    const stages = [
      { type: "awake" as const, durationMinutes: 30, label: "Woke Up" },
      { type: "deep" as const, durationMinutes: 120 },
    ];
    const { getByText } = render(<SleepStagesBar stages={stages} />);
    expect(getByText("Woke Up")).toBeTruthy();
    expect(getByText("Deep")).toBeTruthy();
  });

  it("applies custom height prop", () => {
    const { UNSAFE_getByProps } = render(
      <SleepStagesBar stages={defaultStages} height={20} testID="stages-bar" />,
    );
    const bar = UNSAFE_getByProps({ accessibilityRole: "progressbar" });
    expect(bar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ height: 20 }),
      ]),
    );
  });

  it("has correct accessibilityRole on bar", () => {
    const { UNSAFE_getByProps } = render(
      <SleepStagesBar stages={defaultStages} />,
    );
    const bar = UNSAFE_getByProps({ accessibilityRole: "progressbar" });
    expect(bar).toBeTruthy();
  });

  it("accessibilityLabel summarises all stages", () => {
    const { UNSAFE_getByProps } = render(
      <SleepStagesBar stages={defaultStages} />,
    );
    const bar = UNSAFE_getByProps({ accessibilityRole: "progressbar" });
    expect(bar.props.accessibilityLabel).toContain("30 min Awake");
    expect(bar.props.accessibilityLabel).toContain("120 min Deep");
  });

  it("renders with a single stage without crashing", () => {
    const { getByText } = render(
      <SleepStagesBar stages={[{ type: "deep", durationMinutes: 480 }]} />,
    );
    expect(getByText("Deep")).toBeTruthy();
  });
});
