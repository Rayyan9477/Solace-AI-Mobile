/**
 * ConversationsDashboardScreen Tests
 * @description Tests for conversations dashboard with stats and upsell
 * @task Task 3.6.2: Conversations Dashboard Screen (Screen 48)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ConversationsDashboardScreen } from "./ConversationsDashboardScreen";

describe("ConversationsDashboardScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnFilter = jest.fn();
  const mockOnNewConversation = jest.fn();
  const mockOnSettings = jest.fn();
  const mockOnUpgrade = jest.fn();

  const defaultProps = {
    totalConversations: 1571,
    remainingQuota: 32,
    subscriptionTier: "Basic" as const,
    supportLevel: "Slow" as const,
    onBack: mockOnBack,
    onFilter: mockOnFilter,
    onNewConversation: mockOnNewConversation,
    onSettings: mockOnSettings,
    onUpgrade: mockOnUpgrade,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("conversations-dashboard-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText("My Conversations")).toBeTruthy();
  });

  it("displays the subscription badge", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("subscription-badge")).toBeTruthy();
  });

  it("displays Basic tier text in subscription badge", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText("Basic")).toBeTruthy();
  });

  it("displays Pro tier when subscriptionTier is Pro", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} subscriptionTier="Pro" />
    );
    expect(getByText("Pro")).toBeTruthy();
  });

  it("displays total conversations count", () => {
    const { getByTestId, getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("total-count")).toBeTruthy();
    expect(getByText("1571")).toBeTruthy();
  });

  it("displays Total Conversations label", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText("Total Conversations")).toBeTruthy();
  });

  it("displays remaining quota stat", () => {
    const { getByTestId, getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("quota-stat")).toBeTruthy();
    expect(getByText("32")).toBeTruthy();
  });

  it("displays Left this month label", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText("Left this month")).toBeTruthy();
  });

  it("displays support level stat", () => {
    const { getByTestId, getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("support-stat")).toBeTruthy();
    expect(getByText("Slow")).toBeTruthy();
  });

  it("displays Response & Support label", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText("Response & Support")).toBeTruthy();
  });

  it("displays Fast support when Pro tier", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen
        {...defaultProps}
        subscriptionTier="Pro"
        supportLevel="Fast"
      />
    );
    expect(getByText("Fast")).toBeTruthy();
  });

  it("displays filter button", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("filter-button")).toBeTruthy();
  });

  it("calls onFilter when filter button is pressed", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("filter-button"));
    expect(mockOnFilter).toHaveBeenCalledTimes(1);
  });

  it("displays new conversation action button", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("new-action-button")).toBeTruthy();
  });

  it("calls onNewConversation when new button is pressed", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("new-action-button"));
    expect(mockOnNewConversation).toHaveBeenCalledTimes(1);
  });

  it("displays settings button", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("calls onSettings when settings button is pressed", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("settings-button"));
    expect(mockOnSettings).toHaveBeenCalledTimes(1);
  });

  it("displays upsell card for Basic tier", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("upsell-card")).toBeTruthy();
  });

  it("displays Upgrade to Pro title", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText("Upgrade to Pro!")).toBeTruthy();
  });

  it("displays 24/7 support benefit", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText(/24\/7.*Support/i)).toBeTruthy();
  });

  it("displays unlimited conversations benefit", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByText(/Unlimited Conversations/i)).toBeTruthy();
  });

  it("displays Go Pro button", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(getByTestId("go-pro-button")).toBeTruthy();
  });

  it("calls onUpgrade when Go Pro is pressed", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("go-pro-button"));
    expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
  });

  it("hides upsell card for Pro tier", () => {
    const { queryByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} subscriptionTier="Pro" />
    );
    expect(queryByTestId("upsell-card")).toBeNull();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    const container = getByTestId("conversations-dashboard-screen");
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
      <ConversationsDashboardScreen {...defaultProps} />
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

  it("action buttons have minimum touch target size", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    const button = getByTestId("filter-button");
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
      <ConversationsDashboardScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("filter button has proper accessibility", () => {
    const { getByTestId } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    const button = getByTestId("filter-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Filter conversations");
  });

  it("displays correct quota value", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen {...defaultProps} remainingQuota={50} />
    );
    expect(getByText("50")).toBeTruthy();
  });

  it("displays correct total conversations value", () => {
    const { getByText } = render(
      <ConversationsDashboardScreen
        {...defaultProps}
        totalConversations={2500}
      />
    );
    expect(getByText("2500")).toBeTruthy();
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <ConversationsDashboardScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
