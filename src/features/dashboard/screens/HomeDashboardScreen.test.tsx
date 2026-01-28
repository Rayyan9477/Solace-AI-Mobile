/**
 * HomeDashboardScreen Tests
 * @description Tests for main home dashboard screen with mental health metrics
 * @task Task 3.5.1: Home Dashboard Screen (Screen 40)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { HomeDashboardScreen } from "./HomeDashboardScreen";

describe("HomeDashboardScreen", () => {
  const mockOnSolaceScorePress = jest.fn();
  const mockOnMoodPress = jest.fn();
  const mockOnMindfulHoursPress = jest.fn();
  const mockOnSleepQualityPress = jest.fn();
  const mockOnJournalPress = jest.fn();
  const mockOnStressLevelPress = jest.fn();
  const mockOnChatbotPress = jest.fn();
  const mockOnArticlePress = jest.fn();
  const mockOnSearchPress = jest.fn();
  const mockOnNotificationPress = jest.fn();

  const defaultProps = {
    userName: "Shinomiya",
    userAvatar: "https://example.com/avatar.png",
    currentDate: new Date("2025-01-20"),
    solaceScore: 80,
    solaceStatus: "Mentally Stable" as const,
    currentMood: "happy" as const,
    mindfulHours: 3,
    sleepQuality: 85,
    journalPages: 9,
    stressLevel: 4,
    weeklyMoods: ["neutral", "happy", "sad", "neutral", "happy", "neutral", "happy"] as const,
    conversationCount: 2541,
    articles: [
      { id: "1", title: "5 Ways to Reduce Stress", thumbnail: "https://example.com/1.jpg" },
      { id: "2", title: "Mindfulness for Beginners", thumbnail: "https://example.com/2.jpg" },
    ],
    notificationCount: 3,
    onSolaceScorePress: mockOnSolaceScorePress,
    onMoodPress: mockOnMoodPress,
    onMindfulHoursPress: mockOnMindfulHoursPress,
    onSleepQualityPress: mockOnSleepQualityPress,
    onJournalPress: mockOnJournalPress,
    onStressLevelPress: mockOnStressLevelPress,
    onChatbotPress: mockOnChatbotPress,
    onArticlePress: mockOnArticlePress,
    onSearchPress: mockOnSearchPress,
    onNotificationPress: mockOnNotificationPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("home-dashboard-screen")).toBeTruthy();
  });

  it("displays the current date", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText(/Mon, 20 Jan 2025/i)).toBeTruthy();
  });

  it("displays the user greeting with name", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText(/Hi, Shinomiya/i)).toBeTruthy();
  });

  it("displays the user avatar", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("user-avatar")).toBeTruthy();
  });

  it("displays the notification bell", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("notification-bell")).toBeTruthy();
  });

  it("displays notification badge when there are notifications", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("notification-badge")).toBeTruthy();
  });

  it("calls onNotificationPress when notification bell is pressed", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("notification-bell"));
    expect(mockOnNotificationPress).toHaveBeenCalledTimes(1);
  });

  it("displays the search bar", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("search-bar")).toBeTruthy();
  });

  it("calls onSearchPress when search bar is pressed", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("search-bar"));
    expect(mockOnSearchPress).toHaveBeenCalledTimes(1);
  });

  it("displays the Mental Health Metrics section title", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("Mental Health Metrics")).toBeTruthy();
  });

  it("displays the Solace Score card", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("solace-score-card")).toBeTruthy();
  });

  it("displays the Solace Score value", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("80")).toBeTruthy();
  });

  it("displays Solace Score label (not Freud)", () => {
    const { getByText, queryByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("Solace Score")).toBeTruthy();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("displays the Solace status", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("Mentally Stable")).toBeTruthy();
  });

  it("calls onSolaceScorePress when Solace Score card is pressed", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("solace-score-card"));
    expect(mockOnSolaceScorePress).toHaveBeenCalledTimes(1);
  });

  it("displays the Mood card", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("mood-card")).toBeTruthy();
  });

  it("calls onMoodPress when Mood card is pressed", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("mood-card"));
    expect(mockOnMoodPress).toHaveBeenCalledTimes(1);
  });

  it("displays the Mindful Hours card", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("mindful-hours-card")).toBeTruthy();
  });

  it("displays mindful hours value", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("3 Hrs")).toBeTruthy();
  });

  it("displays the Sleep Quality card", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("sleep-quality-card")).toBeTruthy();
  });

  it("displays the Mental Journal card", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("journal-card")).toBeTruthy();
  });

  it("displays journal pages count", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("9 Pages")).toBeTruthy();
  });

  it("displays the Stress Level card", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("stress-level-card")).toBeTruthy();
  });

  it("displays stress level value", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("4/5")).toBeTruthy();
  });

  it("displays the Mood Tracker card with weekly moods", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("mood-tracker-card")).toBeTruthy();
  });

  it("displays the AI Therapy Chatbot section", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("AI Therapy Chatbot")).toBeTruthy();
  });

  it("displays the conversation count", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("2,541")).toBeTruthy();
  });

  it("displays the chatbot section", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("chatbot-section")).toBeTruthy();
  });

  it("calls onChatbotPress when chatbot section is pressed", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("chatbot-section"));
    expect(mockOnChatbotPress).toHaveBeenCalledTimes(1);
  });

  it("displays the Mindful Articles section", () => {
    const { getByText } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByText("Mindful Articles")).toBeTruthy();
  });

  it("displays article cards", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("article-card-1")).toBeTruthy();
    expect(getByTestId("article-card-2")).toBeTruthy();
  });

  it("calls onArticlePress when article card is pressed", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("article-card-1"));
    expect(mockOnArticlePress).toHaveBeenCalledWith("1");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    const container = getByTestId("home-dashboard-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("metric cards have proper accessibility", () => {
    const { getByTestId } = render(
      <HomeDashboardScreen {...defaultProps} />
    );
    const solaceCard = getByTestId("solace-score-card");
    expect(solaceCard.props.accessibilityRole).toBe("button");
  });

  it("hides notification badge when count is 0", () => {
    const { queryByTestId } = render(
      <HomeDashboardScreen {...defaultProps} notificationCount={0} />
    );
    expect(queryByTestId("notification-badge")).toBeNull();
  });
});
