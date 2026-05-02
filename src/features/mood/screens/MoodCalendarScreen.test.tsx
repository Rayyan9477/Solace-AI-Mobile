/**
 * MoodCalendarScreen Tests — prototype v4.2 #22 (Sprint 8 reskin).
 *
 * Covers: render, miniHeader (back + month + change-view), month grid heatmap,
 * legend swatches, summary callout, accessibility, prop variants.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodCalendarScreen } from "./MoodCalendarScreen";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

interface ViewProps {
  testID?: string;
  children?: React.ReactNode;
  style?: object;
  accessibilityLabel?: string;
  accessibilityRole?: string;
}

interface HeatmapMockProps extends ViewProps {
  cells?: Array<{ date: string; moodLevel: number | null }>;
  weeks?: number;
}

jest.mock("@/shared/components/primitives", () => {
  const ReactLib = require("react");
  const { View, Text } = require("react-native");

  const Mock = (_name: string) => (props: ViewProps) =>
    ReactLib.createElement(View, { testID: props.testID, ...props }, props.children);

  const HeatmapGridMock = (props: HeatmapMockProps) =>
    ReactLib.createElement(
      View,
      {
        testID: props.testID,
        accessibilityLabel: props.accessibilityLabel,
        accessibilityRole: "image",
      },
      (props.cells ?? []).map((c, i) =>
        ReactLib.createElement(
          View,
          { key: i, testID: `cell-${i}` },
          ReactLib.createElement(Text, null, c.date),
        ),
      ),
    );

  const BracketLabelMock = ({ children }: { children: string }) =>
    ReactLib.createElement(Text, null, `[ ${String(children).toUpperCase()} ]`);

  return {
    BracketLabel: BracketLabelMock,
    GlassCard: Mock("GlassCard"),
    HeatmapGrid: HeatmapGridMock,
    HeroCard: Mock("HeroCard"),
    IconTile: Mock("IconTile"),
  };
});

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const baseProps = {
  onBack: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("MoodCalendarScreen", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    expect(getByTestId("mood-calendar-screen")).toBeTruthy();
  });

  it("renders the default 'April 2026' month title", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    expect(getByTestId("month-title").props.children).toBe("April 2026");
  });

  it("renders a custom month/year combination", () => {
    const { getByTestId } = render(
      <MoodCalendarScreen {...baseProps} month={0} year={2027} />,
    );
    expect(getByTestId("month-title").props.children).toBe("January 2027");
  });

  it("month title is announced as a header", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    expect(getByTestId("month-title").props.accessibilityRole).toBe("header");
  });

  it("renders back button with proper a11y", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    const back = getByTestId("back-button");
    expect(back.props.accessibilityRole).toBe("button");
    expect(back.props.accessibilityLabel).toBe("Go back");
  });

  it("calls onBack when back button is tapped", () => {
    const onBack = jest.fn();
    const { getByTestId } = render(<MoodCalendarScreen onBack={onBack} />);
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders summary title and subtitle", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    expect(getByTestId("month-summary-title").props.children).toBe("Your month");
    expect(getByTestId("month-summary-subtitle").props.children).toBe(
      "23 days logged · mostly calm",
    );
  });

  it("supports custom summary text", () => {
    const { getByTestId } = render(
      <MoodCalendarScreen
        {...baseProps}
        summaryTitle="My month"
        summarySubtitle="2 days logged"
      />,
    );
    expect(getByTestId("month-summary-title").props.children).toBe("My month");
    expect(getByTestId("month-summary-subtitle").props.children).toBe("2 days logged");
  });

  it("renders the month heatmap with accessible label", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    const heatmap = getByTestId("month-heatmap");
    expect(heatmap).toBeTruthy();
    expect(heatmap.props.accessibilityLabel).toBe("April 2026 mood heatmap");
  });

  it("renders 5 legend swatches with correct labels", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    expect(getByTestId("legend-card")).toBeTruthy();
    [0, 1, 2, 3, 4].forEach((level) => {
      expect(getByTestId(`legend-item-${level}`)).toBeTruthy();
    });
  });

  it("renders summary callout with default highlight text", () => {
    const { getByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    expect(getByTestId("summary-card")).toBeTruthy();
    expect(getByTestId("summary-title-text").props.children).toBe(
      "18% better than March",
    );
  });

  it("supports custom highlight text", () => {
    const { getByTestId } = render(
      <MoodCalendarScreen
        {...baseProps}
        highlightTitle="Custom highlight"
        highlightSubtitle="Custom sub"
      />,
    );
    expect(getByTestId("summary-title-text").props.children).toBe("Custom highlight");
  });

  it("does not render change-view button when onChangeView omitted", () => {
    const { queryByTestId } = render(<MoodCalendarScreen {...baseProps} />);
    expect(queryByTestId("change-view-button")).toBeNull();
  });

  it("renders change-view button when onChangeView provided", () => {
    const onChangeView = jest.fn();
    const { getByTestId } = render(
      <MoodCalendarScreen {...baseProps} onChangeView={onChangeView} />,
    );
    const btn = getByTestId("change-view-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Change view");
  });

  it("calls onChangeView when change-view button is tapped", () => {
    const onChangeView = jest.fn();
    const { getByTestId } = render(
      <MoodCalendarScreen {...baseProps} onChangeView={onChangeView} />,
    );
    fireEvent.press(getByTestId("change-view-button"));
    expect(onChangeView).toHaveBeenCalledTimes(1);
  });

  it("renders custom calendar entries when provided", () => {
    const { getByTestId } = render(
      <MoodCalendarScreen
        {...baseProps}
        entries={[
          { day: 1, level: 3 },
          { day: 2, level: 4, isToday: true },
        ]}
      />,
    );
    expect(getByTestId("month-heatmap")).toBeTruthy();
  });

  it("does not display the legacy 'Freud' brand text", () => {
    const { queryByText } = render(<MoodCalendarScreen {...baseProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
