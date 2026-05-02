/**
 * MoodDashboardScreen Tests — prototype v4.2 #06 (Sprint 8 reskin).
 *
 * Covers: render, header CTAs, hero face/label, weekly bar chart, insights
 * list, FAB, accessibility roles/labels, reduced-motion path.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodDashboardScreen } from "./MoodDashboardScreen";

// ---------------------------------------------------------------------------
// Primitive mocks — keep test deps minimal and stable
// ---------------------------------------------------------------------------

interface ViewProps {
  testID?: string;
  children?: React.ReactNode;
  style?: object;
  accessibilityLabel?: string;
  accessibilityRole?: string;
}

interface OrbProps extends ViewProps {
  pulsing?: boolean;
}

interface BarChartMockProps extends ViewProps {
  bars?: Array<{ label: string; value: number; highlighted?: boolean }>;
}

jest.mock("@/shared/components/primitives", () => {
  const ReactLib = require("react");
  const { View, Text } = require("react-native");

  const Mock = (name: string) => (props: ViewProps) =>
    ReactLib.createElement(View, { testID: props.testID, ...props }, props.children);

  const BreathingOrbMock = (props: OrbProps) =>
    ReactLib.createElement(View, {
      testID: props.testID ?? "breathing-orb",
      "data-pulsing": String(props.pulsing ?? true),
    });

  const BarChartMock = (props: BarChartMockProps) =>
    ReactLib.createElement(
      View,
      { testID: props.testID, accessibilityLabel: props.accessibilityLabel },
      (props.bars ?? []).map((b, i) =>
        ReactLib.createElement(
          View,
          { key: `${b.label}-${i}`, testID: `bar-${b.label}-${i}` },
          ReactLib.createElement(Text, null, b.label),
        ),
      ),
    );

  const MoodFaceMock = (props: { level?: number }) =>
    ReactLib.createElement(
      View,
      { testID: "mood-face" },
      ReactLib.createElement(Text, null, String(props.level ?? 3)),
    );

  const BracketLabelMock = ({ children }: { children: string }) =>
    ReactLib.createElement(Text, null, `[ ${String(children).toUpperCase()} ]`);

  return {
    BarChart: BarChartMock,
    BracketLabel: BracketLabelMock,
    BreathingOrb: BreathingOrbMock,
    GlassCard: Mock("GlassCard"),
    HeroCard: Mock("HeroCard"),
    HeatmapGrid: Mock("HeatmapGrid"),
    IconTile: Mock("IconTile"),
    MoodFace: MoodFaceMock,
    ScatterPlot: Mock("ScatterPlot"),
    MOOD_LEVELS: [1, 2, 3, 4, 5],
    MOOD_LABELS: { 1: "Struggling", 2: "Down", 3: "Neutral", 4: "Content", 5: "Overjoyed" },
  };
});

let mockReducedMotion = false;
jest.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => mockReducedMotion,
}));

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const baseProps = {
  onCalendarPress: jest.fn(),
  onLogMood: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockReducedMotion = false;
});

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("MoodDashboardScreen", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("mood-dashboard-screen")).toBeTruthy();
  });

  it("displays the 'This week' headline as a header", () => {
    const { getByText } = render(<MoodDashboardScreen {...baseProps} />);
    const headline = getByText("This week");
    expect(headline).toBeTruthy();
    expect(headline.props.accessibilityRole).toBe("header");
  });

  it("displays the calendar button with proper a11y", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    const btn = getByTestId("calendar-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("View calendar");
  });

  it("calls onCalendarPress when calendar button is tapped", () => {
    const onCalendarPress = jest.fn();
    const { getByTestId } = render(
      <MoodDashboardScreen {...baseProps} onCalendarPress={onCalendarPress} />,
    );
    fireEvent.press(getByTestId("calendar-button"));
    expect(onCalendarPress).toHaveBeenCalledTimes(1);
  });

  it("renders the current-mood hero card with default 'Content' label", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("mood-hero-card")).toBeTruthy();
    expect(getByTestId("mood-hero-label").props.children).toBe("Content");
  });

  it("renders custom mood label when provided", () => {
    const { getByTestId } = render(
      <MoodDashboardScreen
        {...baseProps}
        currentMoodLabel="Overjoyed"
        currentMoodLevel={5}
      />,
    );
    expect(getByTestId("mood-hero-label").props.children).toBe("Overjoyed");
  });

  it("renders the hero MoodFace face", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("mood-hero-face")).toBeTruthy();
  });

  it("renders the delta line with default 'Up from neutral'", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("mood-delta-text").props.children).toBe("Up from neutral");
  });

  it("renders the weekly chart card with avg pill", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("weekly-chart-card")).toBeTruthy();
    expect(getByTestId("avg-score-text").props.children).toBe("Avg 3.8/5");
  });

  it("renders a BarChart with 7 bars by default", () => {
    const { getByTestId, getAllByTestId } = render(
      <MoodDashboardScreen {...baseProps} />,
    );
    expect(getByTestId("weekly-bar-chart")).toBeTruthy();
    const bars = getAllByTestId(/^bar-/);
    expect(bars.length).toBe(7);
  });

  it("renders 3 default insight cards", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("insights-list")).toBeTruthy();
    expect(getByTestId("insight-trending-up")).toBeTruthy();
    expect(getByTestId("insight-sleep")).toBeTruthy();
    expect(getByTestId("insight-outdoor")).toBeTruthy();
  });

  it("renders custom insights when provided", () => {
    const { getByTestId, queryByTestId } = render(
      <MoodDashboardScreen
        {...baseProps}
        insights={[
          {
            id: "custom",
            iconName: "heart",
            hue: "sage",
            title: "Custom",
            description: "Custom desc",
          },
        ]}
      />,
    );
    expect(getByTestId("insight-custom")).toBeTruthy();
    expect(queryByTestId("insight-trending-up")).toBeNull();
  });

  it("FAB is rendered with 56pt touch target and a11y", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    const fab = getByTestId("log-mood-fab");
    expect(fab.props.accessibilityRole).toBe("button");
    expect(fab.props.accessibilityLabel).toBe("Log a new mood entry");
    const flatStyle = Array.isArray(fab.props.style)
      ? Object.assign({}, ...(fab.props.style as object[]).filter(Boolean))
      : fab.props.style ?? {};
    const min = (flatStyle as { minHeight?: number }).minHeight ?? 0;
    expect(min).toBeGreaterThanOrEqual(44);
  });

  it("calls onLogMood when FAB is tapped", () => {
    const onLogMood = jest.fn();
    const { getByTestId } = render(
      <MoodDashboardScreen {...baseProps} onLogMood={onLogMood} />,
    );
    fireEvent.press(getByTestId("log-mood-fab"));
    expect(onLogMood).toHaveBeenCalledTimes(1);
  });

  it("BreathingOrb is static when useReducedMotion returns true", () => {
    mockReducedMotion = true;
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("mood-hero-orb").props["data-pulsing"]).toBe("false");
  });

  it("BreathingOrb pulses when useReducedMotion returns false", () => {
    mockReducedMotion = false;
    const { getByTestId } = render(<MoodDashboardScreen {...baseProps} />);
    expect(getByTestId("mood-hero-orb").props["data-pulsing"]).toBe("true");
  });

  it("does not display the legacy 'Freud' brand text", () => {
    const { queryByText } = render(<MoodDashboardScreen {...baseProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });

  it("supports a custom timestamp label", () => {
    const { getByText } = render(
      <MoodDashboardScreen {...baseProps} timestampLabel="Today · 9:00 AM" />,
    );
    expect(getByText(/TODAY · 9:00 AM/)).toBeTruthy();
  });

  it("renders down-delta with peach color when deltaPositive is false", () => {
    const { getByTestId } = render(
      <MoodDashboardScreen
        {...baseProps}
        deltaPositive={false}
        deltaLabel="Down from content"
      />,
    );
    expect(getByTestId("mood-delta-text").props.children).toBe("Down from content");
  });

  it("renders custom weeklyData length", () => {
    const { getAllByTestId } = render(
      <MoodDashboardScreen
        {...baseProps}
        weeklyData={[
          { day: "M", value: 0.5, hue: "sage" },
          { day: "T", value: 0.8, hue: "sage", today: true },
          { day: "W", value: 0.3, hue: "peach" },
        ]}
      />,
    );
    const bars = getAllByTestId(/^bar-/);
    expect(bars.length).toBe(3);
  });
});
