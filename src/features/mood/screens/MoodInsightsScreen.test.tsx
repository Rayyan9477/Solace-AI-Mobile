/**
 * MoodInsightsScreen Tests — prototype v4.2 #23 (Sprint 8 reskin).
 *
 * Replaces the old MoodAnalyticsScreen. Covers: render, miniHeader,
 * pattern hero, scatter plot, supporting insights, accessibility,
 * reduced-motion path, prop variants.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodInsightsScreen } from "./MoodInsightsScreen";

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

interface OrbProps extends ViewProps {
  pulsing?: boolean;
}

interface ScatterMockProps extends ViewProps {
  points?: Array<{ x: number; y: number; moodLevel: number }>;
}

jest.mock("@/shared/components/primitives", () => {
  const ReactLib = require("react");
  const { View, Text } = require("react-native");

  const Mock = (_name: string) => (props: ViewProps) =>
    ReactLib.createElement(View, { testID: props.testID, ...props }, props.children);

  const BreathingOrbMock = (props: OrbProps) =>
    ReactLib.createElement(View, {
      testID: props.testID ?? "breathing-orb",
      "data-pulsing": String(props.pulsing ?? true),
    });

  const ScatterMock = (props: ScatterMockProps) =>
    ReactLib.createElement(
      View,
      {
        testID: props.testID,
        accessibilityLabel: props.accessibilityLabel,
        accessibilityRole: "image",
      },
      (props.points ?? []).map((p, i) =>
        ReactLib.createElement(View, { key: i, testID: `dot-${i}` }),
      ),
    );

  const BracketLabelMock = ({ children }: { children: string }) =>
    ReactLib.createElement(Text, null, `[ ${String(children).toUpperCase()} ]`);

  return {
    BracketLabel: BracketLabelMock,
    BreathingOrb: BreathingOrbMock,
    GlassCard: Mock("GlassCard"),
    HeroCard: Mock("HeroCard"),
    IconTile: Mock("IconTile"),
    ScatterPlot: ScatterMock,
  };
});

// Mock expo-linear-gradient so we don't transitively pull native code.
jest.mock("expo-linear-gradient", () => {
  const ReactLib = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: (props: ViewProps) =>
      ReactLib.createElement(View, props, props.children),
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
  onBack: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockReducedMotion = false;
});

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("MoodInsightsScreen", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("mood-insights-screen")).toBeTruthy();
  });

  it("renders the back button with proper a11y", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("calls onBack when back button is tapped", () => {
    const onBack = jest.fn();
    const { getByTestId } = render(<MoodInsightsScreen onBack={onBack} />);
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders the page title 'What we've learned'", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    const title = getByTestId("page-title");
    expect(title.props.children).toBe("What we've learned");
    expect(title.props.accessibilityRole).toBe("header");
  });

  it("renders the page subtitle by default", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("page-subtitle").props.children).toBe(
      "From 23 days of data · AI-analyzed",
    );
  });

  it("supports custom page title + subtitle", () => {
    const { getByTestId } = render(
      <MoodInsightsScreen
        {...baseProps}
        pageTitle="Custom title"
        pageSubtitle="Custom subtitle"
      />,
    );
    expect(getByTestId("page-title").props.children).toBe("Custom title");
    expect(getByTestId("page-subtitle").props.children).toBe("Custom subtitle");
  });

  it("renders the pattern hero with default key insight", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("pattern-hero")).toBeTruthy();
    expect(getByTestId("pattern-title").props.children).toBe(
      "You feel calmer after 7+ hours of sleep.",
    );
  });

  it("renders pattern body content", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("pattern-body")).toBeTruthy();
  });

  it("renders the BreathingOrb in pattern hero", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("pattern-orb")).toBeTruthy();
  });

  it("BreathingOrb is static when useReducedMotion returns true", () => {
    mockReducedMotion = true;
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("pattern-orb").props["data-pulsing"]).toBe("false");
  });

  it("BreathingOrb pulses when useReducedMotion returns false", () => {
    mockReducedMotion = false;
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("pattern-orb").props["data-pulsing"]).toBe("true");
  });

  it("renders the scatter card with default 12 points", () => {
    const { getByTestId, getAllByTestId } = render(
      <MoodInsightsScreen {...baseProps} />,
    );
    expect(getByTestId("scatter-card")).toBeTruthy();
    const scatter = getByTestId("mood-sleep-scatter");
    expect(scatter).toBeTruthy();
    expect(scatter.props.accessibilityLabel).toMatch(/Scatter plot/);
    const dots = getAllByTestId(/^dot-/);
    expect(dots.length).toBe(12);
  });

  it("supports custom scatter point count", () => {
    const { getAllByTestId } = render(
      <MoodInsightsScreen
        {...baseProps}
        scatterPoints={[
          { x: 0.1, y: 0.2, moodLevel: 1 },
          { x: 0.5, y: 0.5, moodLevel: 2 },
          { x: 0.9, y: 0.9, moodLevel: 4 },
        ]}
      />,
    );
    const dots = getAllByTestId(/^dot-/);
    expect(dots.length).toBe(3);
  });

  it("renders 3 default supporting insight rows", () => {
    const { getByTestId } = render(<MoodInsightsScreen {...baseProps} />);
    expect(getByTestId("insights-list")).toBeTruthy();
    expect(getByTestId("insight-sun")).toBeTruthy();
    expect(getByTestId("insight-social")).toBeTruthy();
    expect(getByTestId("insight-monday")).toBeTruthy();
  });

  it("renders custom supporting insights", () => {
    const { getByTestId, queryByTestId } = render(
      <MoodInsightsScreen
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
    expect(queryByTestId("insight-sun")).toBeNull();
  });

  it("does not render legacy 'Freud' brand text", () => {
    const { queryByText } = render(<MoodInsightsScreen {...baseProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });

  it("does not render legacy 'Mood Analytics' title", () => {
    const { queryByText } = render(<MoodInsightsScreen {...baseProps} />);
    expect(queryByText(/Mood Analytics/)).toBeNull();
  });
});
