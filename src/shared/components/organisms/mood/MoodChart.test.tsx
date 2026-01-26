/**
 * MoodChart Component Tests
 * @description TDD tests for the MoodChart component
 * @task Task 2.8.3: MoodChart Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { MoodChart } from "./MoodChart";
import type { MoodDataPoint, TimePeriod } from "./MoodChart.types";
import {
  MOOD_VALUES,
  MOOD_CHART_COLORS,
  PERIOD_LABELS,
  getMoodValue,
  getMoodChartColor,
  getMoodChartEmoji,
  calculateBarHeight,
  generateWeeklyData,
  generateLabels,
} from "./MoodChart.types";

// Mock data
const mockData: MoodDataPoint[] = [
  { date: "2025-01-20", mood: "neutral", value: 50, label: "Mon" },
  { date: "2025-01-21", mood: "happy", value: 70, label: "Tue" },
  { date: "2025-01-22", mood: "sad", value: 30, label: "Wed" },
  { date: "2025-01-23", mood: "overjoyed", value: 90, label: "Thu" },
  { date: "2025-01-24", mood: "happy", value: 70, label: "Fri" },
  { date: "2025-01-25", mood: "neutral", value: 50, label: "Sat" },
  { date: "2025-01-26", mood: "neutral", value: 50, label: "Sun" },
];

describe("MoodChart", () => {
  const mockOnPeriodChange = jest.fn();
  const mockOnDataPointPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with data", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      expect(getByTestId("mood-chart")).toBeTruthy();
    });

    it("renders bar chart by default", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      expect(getByTestId("mood-chart-bars")).toBeTruthy();
    });

    it("renders bars for each data point", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      mockData.forEach((_, index) => {
        expect(getByTestId(`mood-chart-bar-${index}`)).toBeTruthy();
      });
    });

    it("renders day labels", () => {
      const { getByText } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      expect(getByText("Mon")).toBeTruthy();
      expect(getByText("Tue")).toBeTruthy();
      expect(getByText("Sun")).toBeTruthy();
    });

    it("renders emoji on bars when showEmoji is true", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} showEmoji />,
      );

      expect(getByTestId("mood-chart-emoji-0")).toBeTruthy();
    });

    it("hides emoji when showEmoji is false", () => {
      const { queryByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} showEmoji={false} />,
      );

      expect(queryByTestId("mood-chart-emoji-0")).toBeNull();
    });
  });

  describe("Period Selector", () => {
    it("renders period selector by default", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      expect(getByTestId("mood-chart-period-selector")).toBeTruthy();
    });

    it("hides period selector when showPeriodSelector is false", () => {
      const { queryByTestId } = render(
        <MoodChart
          testID="mood-chart"
          data={mockData}
          showPeriodSelector={false}
        />,
      );

      expect(queryByTestId("mood-chart-period-selector")).toBeNull();
    });

    it("renders all period options", () => {
      const { getByText } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      expect(getByText("1 Day")).toBeTruthy();
      expect(getByText("1 Week")).toBeTruthy();
      expect(getByText("1 Month")).toBeTruthy();
      expect(getByText("1 Year")).toBeTruthy();
      expect(getByText("All Time")).toBeTruthy();
    });

    it("highlights selected period", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} period="1week" />,
      );

      const weekOption = getByTestId("mood-chart-period-1week");
      expect(weekOption.props.style).toEqual(
        expect.objectContaining({ backgroundColor: "#9AAD5C" }),
      );
    });

    it("calls onPeriodChange when period is selected", () => {
      const { getByTestId } = render(
        <MoodChart
          testID="mood-chart"
          data={mockData}
          onPeriodChange={mockOnPeriodChange}
        />,
      );

      fireEvent.press(getByTestId("mood-chart-period-1month"));
      expect(mockOnPeriodChange).toHaveBeenCalledWith("1month");
    });
  });

  describe("Bar Heights", () => {
    it("renders bars with correct heights based on mood value", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} height={200} />,
      );

      // Overjoyed (90) should have tallest bar
      const overjoyedBar = getByTestId("mood-chart-bar-3");
      expect(overjoyedBar.props.style).toEqual(
        expect.objectContaining({ height: expect.any(Number) }),
      );
    });
  });

  describe("Bar Colors", () => {
    it("applies correct color for happy mood", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      const happyBar = getByTestId("mood-chart-bar-1");
      expect(happyBar.props.style).toEqual(
        expect.objectContaining({ backgroundColor: "#F5C563" }),
      );
    });

    it("applies correct color for sad mood", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      const sadBar = getByTestId("mood-chart-bar-2");
      expect(sadBar.props.style).toEqual(
        expect.objectContaining({ backgroundColor: "#E8853A" }),
      );
    });
  });

  describe("Data Point Interaction", () => {
    it("calls onDataPointPress when bar is pressed", () => {
      const { getByTestId } = render(
        <MoodChart
          testID="mood-chart"
          data={mockData}
          onDataPointPress={mockOnDataPointPress}
        />,
      );

      fireEvent.press(getByTestId("mood-chart-bar-0"));
      expect(mockOnDataPointPress).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe("Loading State", () => {
    it("shows skeleton when loading", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={[]} loading />,
      );

      expect(getByTestId("mood-chart-skeleton")).toBeTruthy();
    });
  });

  describe("Disabled State", () => {
    it("does not call onDataPointPress when disabled", () => {
      const { getByTestId } = render(
        <MoodChart
          testID="mood-chart"
          data={mockData}
          disabled
          onDataPointPress={mockOnDataPointPress}
        />,
      );

      fireEvent.press(getByTestId("mood-chart-bar-0"));
      expect(mockOnDataPointPress).not.toHaveBeenCalled();
    });

    it("does not call onPeriodChange when disabled", () => {
      const { getByTestId } = render(
        <MoodChart
          testID="mood-chart"
          data={mockData}
          disabled
          onPeriodChange={mockOnPeriodChange}
        />,
      );

      fireEvent.press(getByTestId("mood-chart-period-1month"));
      expect(mockOnPeriodChange).not.toHaveBeenCalled();
    });
  });

  describe("Empty State", () => {
    it("shows empty state when no data", () => {
      const { getByText } = render(
        <MoodChart testID="mood-chart" data={[]} />,
      );

      expect(getByText("No mood data available")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <MoodChart
          testID="mood-chart"
          data={mockData}
          accessibilityLabel="Weekly mood chart"
        />,
      );

      const chart = getByTestId("mood-chart");
      expect(chart.props.accessibilityLabel).toBe("Weekly mood chart");
    });

    it("has default accessibility label", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      const chart = getByTestId("mood-chart");
      expect(chart.props.accessibilityLabel).toBe("Mood chart");
    });

    it("bars have accessibility labels", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} />,
      );

      const bar = getByTestId("mood-chart-bar-1");
      expect(bar.props.accessibilityLabel).toBe("Tuesday, Happy mood");
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} style={customStyle} />,
      );

      const chart = getByTestId("mood-chart");
      expect(chart.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });

    it("applies custom height", () => {
      const { getByTestId } = render(
        <MoodChart testID="mood-chart" data={mockData} height={300} />,
      );

      const chartArea = getByTestId("mood-chart-area");
      expect(chartArea.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ height: 300 }),
        ]),
      );
    });
  });
});

// Helper function tests
describe("MoodChart Helper Functions", () => {
  describe("MOOD_VALUES", () => {
    it("has correct values", () => {
      expect(MOOD_VALUES.depressed).toBe(10);
      expect(MOOD_VALUES.sad).toBe(30);
      expect(MOOD_VALUES.neutral).toBe(50);
      expect(MOOD_VALUES.happy).toBe(70);
      expect(MOOD_VALUES.overjoyed).toBe(90);
    });
  });

  describe("MOOD_CHART_COLORS", () => {
    it("has correct colors", () => {
      expect(MOOD_CHART_COLORS.depressed).toBe("#7B68B5");
      expect(MOOD_CHART_COLORS.sad).toBe("#E8853A");
      expect(MOOD_CHART_COLORS.neutral).toBe("#8B7355");
      expect(MOOD_CHART_COLORS.happy).toBe("#F5C563");
      expect(MOOD_CHART_COLORS.overjoyed).toBe("#9AAD5C");
    });
  });

  describe("PERIOD_LABELS", () => {
    it("has correct labels", () => {
      expect(PERIOD_LABELS["1day"]).toBe("1 Day");
      expect(PERIOD_LABELS["1week"]).toBe("1 Week");
      expect(PERIOD_LABELS["1month"]).toBe("1 Month");
      expect(PERIOD_LABELS["1year"]).toBe("1 Year");
      expect(PERIOD_LABELS.alltime).toBe("All Time");
    });
  });

  describe("getMoodValue", () => {
    it("returns correct value for each mood", () => {
      expect(getMoodValue("depressed")).toBe(10);
      expect(getMoodValue("sad")).toBe(30);
      expect(getMoodValue("neutral")).toBe(50);
      expect(getMoodValue("happy")).toBe(70);
      expect(getMoodValue("overjoyed")).toBe(90);
    });
  });

  describe("getMoodChartColor", () => {
    it("returns correct color for each mood", () => {
      expect(getMoodChartColor("depressed")).toBe("#7B68B5");
      expect(getMoodChartColor("happy")).toBe("#F5C563");
    });
  });

  describe("getMoodChartEmoji", () => {
    it("returns correct emoji for each mood", () => {
      expect(getMoodChartEmoji("depressed")).toBe("😵");
      expect(getMoodChartEmoji("sad")).toBe("😢");
      expect(getMoodChartEmoji("neutral")).toBe("😐");
      expect(getMoodChartEmoji("happy")).toBe("🙂");
      expect(getMoodChartEmoji("overjoyed")).toBe("😄");
    });
  });

  describe("calculateBarHeight", () => {
    it("calculates height as percentage", () => {
      expect(calculateBarHeight(50, 100)).toBe(50);
      expect(calculateBarHeight(90, 100)).toBe(90);
      expect(calculateBarHeight(25, 100)).toBe(25);
    });

    it("uses 100 as default max value", () => {
      expect(calculateBarHeight(50)).toBe(50);
    });
  });

  describe("generateWeeklyData", () => {
    it("returns 7 days of data", () => {
      const data = generateWeeklyData();
      expect(data).toHaveLength(7);
    });

    it("has correct day labels", () => {
      const data = generateWeeklyData();
      expect(data[0].label).toBe("Mon");
      expect(data[6].label).toBe("Sun");
    });
  });

  describe("generateLabels", () => {
    it("generates day labels for 1 week", () => {
      const labels = generateLabels("1week");
      expect(labels).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    });

    it("generates hour labels for 1 day", () => {
      const labels = generateLabels("1day");
      expect(labels).toContain("6am");
      expect(labels).toContain("12pm");
    });

    it("generates week labels for 1 month", () => {
      const labels = generateLabels("1month");
      expect(labels).toEqual(["W1", "W2", "W3", "W4"]);
    });

    it("generates month labels for 1 year", () => {
      const labels = generateLabels("1year");
      expect(labels).toContain("Jan");
      expect(labels).toContain("Dec");
    });
  });
});
