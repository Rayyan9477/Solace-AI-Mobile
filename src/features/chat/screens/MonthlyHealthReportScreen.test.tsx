/**
 * MonthlyHealthReportScreen Tests
 * @description Tests for monthly mental health report screen
 * @task Task 3.7.12: Monthly Health Report Screen (Screen 64)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MonthlyHealthReportScreen } from "./MonthlyHealthReportScreen";

describe("MonthlyHealthReportScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnShare = jest.fn();
  const mockOnDownload = jest.fn();
  const mockOnViewDetails = jest.fn();

  const mockMoodData = [
    { week: "Week 1", score: 65 },
    { week: "Week 2", score: 72 },
    { week: "Week 3", score: 68 },
    { week: "Week 4", score: 78 },
  ];

  const mockMetrics = {
    overallScore: 78,
    previousScore: 72,
    moodAverage: 75,
    sleepQuality: 82,
    activityDays: 18,
    journalEntries: 12,
    chatSessions: 24,
  };

  const mockInsights = [
    {
      id: "1",
      title: "Improved Sleep Pattern",
      description:
        "Your sleep quality increased by 15% this month. Keep maintaining consistent bedtimes.",
      type: "positive" as const,
    },
    {
      id: "2",
      title: "More Active Days",
      description:
        "You logged activity on 18 days this month, up from 14 last month!",
      type: "positive" as const,
    },
  ];

  const defaultProps = {
    month: "January",
    year: 2024,
    metrics: mockMetrics,
    moodTrendData: mockMoodData,
    insights: mockInsights,
    onBack: mockOnBack,
    onShare: mockOnShare,
    onDownload: mockOnDownload,
    onViewDetails: mockOnViewDetails,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("monthly-health-report-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByText(/Monthly Report/)).toBeTruthy();
  });

  it("displays month and year", () => {
    const { getByText } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByText(/January 2024/)).toBeTruthy();
  });

  it("displays overall score section", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("overall-score-section")).toBeTruthy();
  });

  it("displays overall score value", () => {
    const { getByText } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByText("78")).toBeTruthy();
  });

  it("displays score change indicator", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("score-change")).toBeTruthy();
  });

  it("displays mood trend chart", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("mood-trend-chart")).toBeTruthy();
  });

  it("displays metrics grid", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("metrics-grid")).toBeTruthy();
  });

  it("displays mood average metric", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("metric-mood")).toBeTruthy();
  });

  it("displays sleep quality metric", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("metric-sleep")).toBeTruthy();
  });

  it("displays activity days metric", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("metric-activity")).toBeTruthy();
  });

  it("displays journal entries metric", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("metric-journal")).toBeTruthy();
  });

  it("displays insights section", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("insights-section")).toBeTruthy();
  });

  it("displays insight cards", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("insight-card-1")).toBeTruthy();
    expect(getByTestId("insight-card-2")).toBeTruthy();
  });

  it("displays insight titles", () => {
    const { getByText } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByText("Improved Sleep Pattern")).toBeTruthy();
    expect(getByText("More Active Days")).toBeTruthy();
  });

  it("displays share button", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("share-button")).toBeTruthy();
  });

  it("calls onShare when share button is pressed", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("share-button"));
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it("displays download button", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("download-button")).toBeTruthy();
  });

  it("calls onDownload when download button is pressed", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("download-button"));
    expect(mockOnDownload).toHaveBeenCalledTimes(1);
  });

  it("displays view details button", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByTestId("view-details-button")).toBeTruthy();
  });

  it("calls onViewDetails when view details button is pressed", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("view-details-button"));
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    const container = getByTestId("monthly-health-report-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("share button has proper accessibility", () => {
    const { getByTestId } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    const button = getByTestId("share-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Share report");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("uses Solace branding", () => {
    const { getByText } = render(
      <MonthlyHealthReportScreen {...defaultProps} />
    );
    expect(getByText(/Solace/)).toBeTruthy();
  });
});
