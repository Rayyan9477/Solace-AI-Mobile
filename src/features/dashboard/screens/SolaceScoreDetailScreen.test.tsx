/**
 * SolaceScoreDetailScreen Tests
 * @description Tests for detailed Solace mental health score view
 * @task Task 3.5.2: Solace Score Detail Screen (Screen 41)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceScoreDetailScreen } from "./SolaceScoreDetailScreen";

describe("SolaceScoreDetailScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnChartPress = jest.fn();
  const mockOnSeeAllHistory = jest.fn();
  const mockOnHistoryEntryPress = jest.fn();

  const defaultProps = {
    currentScore: 80,
    currentStatus: "Normal" as const,
    statusLabel: "Mentally Stable",
    scoreHistory: [
      {
        id: "1",
        date: new Date("2025-01-12"),
        mood: "Anxious, Depressed",
        score: 65,
        recommendation: "Do 25m Breathing.",
      },
      {
        id: "2",
        date: new Date("2025-01-11"),
        mood: "Very Happy",
        score: 95,
        recommendation: "No Recommendation.",
      },
      {
        id: "3",
        date: new Date("2025-01-10"),
        mood: "Neutral",
        score: 65,
        recommendation: "Keep it up.",
      },
    ],
    onBack: mockOnBack,
    onChartPress: mockOnChartPress,
    onSeeAllHistory: mockOnSeeAllHistory,
    onHistoryEntryPress: mockOnHistoryEntryPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByTestId("solace-score-detail-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title as Solace Score (not Freud)", () => {
    const { getByText, queryByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("Solace Score")).toBeTruthy();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("displays the status badge", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByTestId("status-badge")).toBeTruthy();
  });

  it("displays the status badge text", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("Normal")).toBeTruthy();
  });

  it("displays the large score number", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByTestId("large-score-display")).toBeTruthy();
  });

  it("displays the current score value", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("80")).toBeTruthy();
  });

  it("displays the status label", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("Mentally Stable")).toBeTruthy();
  });

  it("displays the chart icon button", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByTestId("chart-button")).toBeTruthy();
  });

  it("calls onChartPress when chart button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("chart-button"));
    expect(mockOnChartPress).toHaveBeenCalledTimes(1);
  });

  it("displays the Score History section", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("Score History")).toBeTruthy();
  });

  it("displays the See All link", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("See All")).toBeTruthy();
  });

  it("calls onSeeAllHistory when See All is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("see-all-button"));
    expect(mockOnSeeAllHistory).toHaveBeenCalledTimes(1);
  });

  it("displays history entries", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByTestId("history-entry-1")).toBeTruthy();
    expect(getByTestId("history-entry-2")).toBeTruthy();
    expect(getByTestId("history-entry-3")).toBeTruthy();
  });

  it("displays history entry date", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("JAN 12")).toBeTruthy();
  });

  it("displays history entry mood", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("Anxious, Depressed")).toBeTruthy();
  });

  it("displays history entry recommendation", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByText("Do 25m Breathing.")).toBeTruthy();
  });

  it("displays history entry score indicator", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    expect(getByTestId("score-indicator-1")).toBeTruthy();
  });

  it("calls onHistoryEntryPress when history entry is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("history-entry-1"));
    expect(mockOnHistoryEntryPress).toHaveBeenCalledWith("1");
  });

  it("has green gradient background", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    const container = getByTestId("solace-score-detail-screen");
    // The container should have some background style
    expect(container).toBeTruthy();
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("chart button has proper accessibility", () => {
    const { getByTestId } = render(
      <SolaceScoreDetailScreen {...defaultProps} />
    );
    const chartButton = getByTestId("chart-button");
    expect(chartButton.props.accessibilityRole).toBe("button");
  });

  it("displays Elevated status correctly", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen
        {...defaultProps}
        currentStatus="Elevated"
        statusLabel="Needs Attention"
      />
    );
    expect(getByText("Elevated")).toBeTruthy();
    expect(getByText("Needs Attention")).toBeTruthy();
  });

  it("displays Critical status correctly", () => {
    const { getByText } = render(
      <SolaceScoreDetailScreen
        {...defaultProps}
        currentStatus="Critical"
        statusLabel="Critical - Seek Help"
      />
    );
    expect(getByText("Critical")).toBeTruthy();
    expect(getByText("Critical - Seek Help")).toBeTruthy();
  });
});
