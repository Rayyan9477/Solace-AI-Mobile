/**
 * HelpCenterLiveChatScreen Tests
 * @description Tests for live chat entry point
 * @task Task 3.17.11: Help Center Live Chat Screen (Screen 150)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { HelpCenterLiveChatScreen } from "./HelpCenterLiveChatScreen";

const defaultProps = {
  activeTab: "live-chat" as const,
  onBack: jest.fn(),
  onTabSelect: jest.fn(),
  onStartLiveChat: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<HelpCenterLiveChatScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("HelpCenterLiveChatScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("help-center-live-chat-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Help Center' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Help Center")).toBeTruthy();
  });

  it("renders FAQ and Live Chat tabs", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("tab-faq")).toBeTruthy();
    expect(getByTestId("tab-live-chat")).toBeTruthy();
  });

  it("renders the support illustration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("support-illustration")).toBeTruthy();
  });

  it("renders welcome title", () => {
    const { getByText } = renderScreen();
    expect(getByText(/here to help/i)).toBeTruthy();
  });

  it("renders response time text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/reply within/)).toBeTruthy();
  });

  it("renders the live chat button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("live-chat-button")).toBeTruthy();
  });

  it("renders live chat button text", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText(/Live Chat/).length).toBeGreaterThanOrEqual(2);
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onTabSelect when FAQ tab is pressed", () => {
    const onTabSelect = jest.fn();
    const { getByTestId } = renderScreen({ onTabSelect });
    fireEvent.press(getByTestId("tab-faq"));
    expect(onTabSelect).toHaveBeenCalledWith("faq");
  });

  it("calls onStartLiveChat when button is pressed", () => {
    const onStartLiveChat = jest.fn();
    const { getByTestId } = renderScreen({ onStartLiveChat });
    fireEvent.press(getByTestId("live-chat-button"));
    expect(onStartLiveChat).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("live chat button meets 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("live-chat-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("help-center-live-chat-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
