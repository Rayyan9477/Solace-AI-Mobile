/**
 * ScoreCard Component Tests
 * @description TDD tests for the ScoreCard component
 * @task Task 2.8.4: ScoreCard Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ScoreCard } from "./ScoreCard";
import type { ScoreStatus, TrendDirection } from "./ScoreCard.types";
import {
  STATUS_COLORS,
  SIZE_SPECS,
  getScoreStatus,
  getDefaultStatusLabel,
  getStatusColor,
  getTrendIcon,
  getTrendColor,
  calculateGaugeProgress,
} from "./ScoreCard.types";

describe("ScoreCard", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with score", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      expect(getByTestId("score-card")).toBeTruthy();
    });

    it("displays score value", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      expect(getByText("80")).toBeTruthy();
    });

    it("displays default title", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      expect(getByText("Freud Score")).toBeTruthy();
    });

    it("displays custom title", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} title="Mental Health Score" />,
      );

      expect(getByText("Mental Health Score")).toBeTruthy();
    });

    it("displays status label", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} statusLabel="Mentally Stable" />,
      );

      expect(getByText("Mentally Stable")).toBeTruthy();
    });

    it("displays default status label based on score", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      expect(getByText("Mentally Stable")).toBeTruthy();
    });

    it("renders circular gauge", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      expect(getByTestId("score-card-gauge")).toBeTruthy();
    });

    it("hides gauge when showGauge is false", () => {
      const { queryByTestId } = render(
        <ScoreCard testID="score-card" score={80} showGauge={false} />,
      );

      expect(queryByTestId("score-card-gauge")).toBeNull();
    });
  });

  describe("Score Status", () => {
    it("shows critical status for score < 30", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={20} />,
      );

      expect(getByText("Needs Attention")).toBeTruthy();
    });

    it("shows low status for score 30-49", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={40} />,
      );

      expect(getByText("Below Average")).toBeTruthy();
    });

    it("shows moderate status for score 50-69", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={60} />,
      );

      expect(getByText("Making Progress")).toBeTruthy();
    });

    it("shows stable status for score 70-84", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      expect(getByText("Mentally Stable")).toBeTruthy();
    });

    it("shows excellent status for score >= 85", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={90} />,
      );

      expect(getByText("Excellent")).toBeTruthy();
    });
  });

  describe("Gauge Colors", () => {
    it("applies critical color for low scores", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={20} />,
      );

      const gauge = getByTestId("score-card-gauge-progress");
      expect(gauge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderColor: STATUS_COLORS.critical }),
        ]),
      );
    });

    it("applies stable color for good scores", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      const gauge = getByTestId("score-card-gauge-progress");
      expect(gauge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ borderColor: STATUS_COLORS.stable }),
        ]),
      );
    });
  });

  describe("Trend Indicator", () => {
    it("shows trend indicator when trend is provided", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} trend="up" />,
      );

      expect(getByTestId("score-card-trend")).toBeTruthy();
    });

    it("hides trend indicator when showTrend is false", () => {
      const { queryByTestId } = render(
        <ScoreCard testID="score-card" score={80} trend="up" showTrend={false} />,
      );

      expect(queryByTestId("score-card-trend")).toBeNull();
    });

    it("shows upward arrow for up trend", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} trend="up" />,
      );

      expect(getByText("↑")).toBeTruthy();
    });

    it("shows downward arrow for down trend", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} trend="down" />,
      );

      expect(getByText("↓")).toBeTruthy();
    });

    it("shows trend value", () => {
      const { getByText } = render(
        <ScoreCard testID="score-card" score={80} trend="up" trendValue={5} />,
      );

      expect(getByText(/5%/)).toBeTruthy();
    });

    it("applies green color for up trend", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} trend="up" />,
      );

      const trend = getByTestId("score-card-trend");
      expect(trend.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: "#9AAD5C" }),
        ]),
      );
    });

    it("applies red color for down trend", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} trend="down" />,
      );

      const trend = getByTestId("score-card-trend");
      expect(trend.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: "#EF4444" }),
        ]),
      );
    });
  });

  describe("Sizes", () => {
    it("applies small size specs", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} size="sm" />,
      );

      const gauge = getByTestId("score-card-gauge");
      expect(gauge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: SIZE_SPECS.sm.gaugeSize,
            height: SIZE_SPECS.sm.gaugeSize,
          }),
        ]),
      );
    });

    it("applies medium size specs by default", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      const gauge = getByTestId("score-card-gauge");
      expect(gauge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: SIZE_SPECS.md.gaugeSize,
            height: SIZE_SPECS.md.gaugeSize,
          }),
        ]),
      );
    });

    it("applies large size specs", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} size="lg" />,
      );

      const gauge = getByTestId("score-card-gauge");
      expect(gauge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: SIZE_SPECS.lg.gaugeSize,
            height: SIZE_SPECS.lg.gaugeSize,
          }),
        ]),
      );
    });
  });

  describe("Interaction", () => {
    it("calls onPress when card is pressed", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} onPress={mockOnPress} />,
      );

      fireEvent.press(getByTestId("score-card"));
      expect(mockOnPress).toHaveBeenCalled();
    });

    it("does not call onPress when disabled", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} disabled onPress={mockOnPress} />,
      );

      fireEvent.press(getByTestId("score-card"));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows skeleton when loading", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} loading />,
      );

      expect(getByTestId("score-card-skeleton")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <ScoreCard
          testID="score-card"
          score={80}
          accessibilityLabel="Freud score 80 out of 100"
        />,
      );

      const card = getByTestId("score-card");
      expect(card.props.accessibilityLabel).toBe("Freud score 80 out of 100");
    });

    it("has default accessibility label", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} />,
      );

      const card = getByTestId("score-card");
      expect(card.props.accessibilityLabel).toBe(
        "Freud Score: 80, Mentally Stable",
      );
    });

    it("has button role when pressable", () => {
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} onPress={mockOnPress} />,
      );

      const card = getByTestId("score-card");
      expect(card.props.accessibilityRole).toBe("button");
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <ScoreCard testID="score-card" score={80} style={customStyle} />,
      );

      const card = getByTestId("score-card");
      expect(card.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });
  });
});

// Helper function tests
describe("ScoreCard Helper Functions", () => {
  describe("getScoreStatus", () => {
    it("returns critical for score < 30", () => {
      expect(getScoreStatus(20)).toBe("critical");
      expect(getScoreStatus(29)).toBe("critical");
    });

    it("returns low for score 30-49", () => {
      expect(getScoreStatus(30)).toBe("low");
      expect(getScoreStatus(49)).toBe("low");
    });

    it("returns moderate for score 50-69", () => {
      expect(getScoreStatus(50)).toBe("moderate");
      expect(getScoreStatus(69)).toBe("moderate");
    });

    it("returns stable for score 70-84", () => {
      expect(getScoreStatus(70)).toBe("stable");
      expect(getScoreStatus(84)).toBe("stable");
    });

    it("returns excellent for score >= 85", () => {
      expect(getScoreStatus(85)).toBe("excellent");
      expect(getScoreStatus(100)).toBe("excellent");
    });

    it("handles custom max score", () => {
      expect(getScoreStatus(25, 50)).toBe("moderate"); // 50%
      expect(getScoreStatus(40, 50)).toBe("stable"); // 80%
    });
  });

  describe("getDefaultStatusLabel", () => {
    it("returns correct labels for each status", () => {
      expect(getDefaultStatusLabel(20)).toBe("Needs Attention");
      expect(getDefaultStatusLabel(40)).toBe("Below Average");
      expect(getDefaultStatusLabel(60)).toBe("Making Progress");
      expect(getDefaultStatusLabel(80)).toBe("Mentally Stable");
      expect(getDefaultStatusLabel(90)).toBe("Excellent");
    });
  });

  describe("getStatusColor", () => {
    it("returns correct colors", () => {
      expect(getStatusColor(20)).toBe("#EF4444");
      expect(getStatusColor(40)).toBe("#E8853A");
      expect(getStatusColor(60)).toBe("#F5C563");
      expect(getStatusColor(80)).toBe("#9AAD5C");
      expect(getStatusColor(90)).toBe("#4ADE80");
    });
  });

  describe("getTrendIcon", () => {
    it("returns correct icons", () => {
      expect(getTrendIcon("up")).toBe("↑");
      expect(getTrendIcon("down")).toBe("↓");
      expect(getTrendIcon("stable")).toBe("→");
    });
  });

  describe("getTrendColor", () => {
    it("returns correct colors", () => {
      expect(getTrendColor("up")).toBe("#9AAD5C");
      expect(getTrendColor("down")).toBe("#EF4444");
      expect(getTrendColor("stable")).toBe("#94A3B8");
    });
  });

  describe("calculateGaugeProgress", () => {
    it("calculates progress as percentage", () => {
      expect(calculateGaugeProgress(50, 100)).toBe(0.5);
      expect(calculateGaugeProgress(80, 100)).toBe(0.8);
    });

    it("clamps values between 0 and 1", () => {
      expect(calculateGaugeProgress(120, 100)).toBe(1);
      expect(calculateGaugeProgress(-10, 100)).toBe(0);
    });
  });
});
