/**
 * NotificationSettingsScreen Tests
 * @description Tests for notification preferences screen
 * @task Task 3.17.5: Notification Settings Screen (Screen 144)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { NotificationSettingsScreen } from "./NotificationSettingsScreen";

const defaultProps = {
  chatbotToggles: [
    { id: "push", label: "Push Notifications", enabled: true },
    { id: "support", label: "Support Notification", enabled: true },
    { id: "alert", label: "Alert Notification", enabled: true },
  ],
  soundEnabled: true,
  soundDescription:
    "When Sound Notifications are on, your phone will always play sounds.",
  vibrationEnabled: true,
  vibrationDescription:
    "When Vibration Notifications are on, your phone will vibrate.",
  miscItems: [
    { id: "offers", label: "Offers", type: "value" as const, value: "50% OFF" },
    {
      id: "updates",
      label: "App Updates",
      type: "toggle" as const,
      enabled: true,
    },
  ],
  resourcesEnabled: true,
  resourcesDescription:
    "Browse our collection of resources to tailor your mental health.",
  onBack: jest.fn(),
  onToggle: jest.fn(),
  onItemPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <NotificationSettingsScreen {...defaultProps} {...overrides} />,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("NotificationSettingsScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("notification-settings-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Notification Settings' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Notification Settings")).toBeTruthy();
  });

  it("renders 'Chatbot' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("Chatbot")).toBeTruthy();
  });

  it("renders chatbot toggle items", () => {
    const { getByText } = renderScreen();
    expect(getByText("Push Notifications")).toBeTruthy();
    expect(getByText("Support Notification")).toBeTruthy();
    expect(getByText("Alert Notification")).toBeTruthy();
  });

  it("renders 'Sound' section with description", () => {
    const { getByText } = renderScreen();
    expect(getByText("Sound")).toBeTruthy();
    expect(getByText(/play sounds/)).toBeTruthy();
  });

  it("renders 'Vibration' section with description", () => {
    const { getByText } = renderScreen();
    expect(getByText("Vibration")).toBeTruthy();
    expect(getByText(/vibrate/)).toBeTruthy();
  });

  it("renders 'Misc' section header", () => {
    const { getByText } = renderScreen();
    expect(getByText("Misc")).toBeTruthy();
  });

  it("renders offers item with value", () => {
    const { getByText } = renderScreen();
    expect(getByText("Offers")).toBeTruthy();
    expect(getByText("50% OFF")).toBeTruthy();
  });

  it("renders app updates toggle", () => {
    const { getByText } = renderScreen();
    expect(getByText("App Updates")).toBeTruthy();
  });

  it("renders 'Resources' section with description", () => {
    const { getByText } = renderScreen();
    expect(getByText("Resources")).toBeTruthy();
    expect(getByText(/collection of resources/)).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle when chatbot toggle is pressed", () => {
    const onToggle = jest.fn();
    const { getByTestId } = renderScreen({ onToggle });
    fireEvent.press(getByTestId("toggle-push"));
    expect(onToggle).toHaveBeenCalledWith("push", false);
  });

  it("calls onToggle when sound toggle is pressed", () => {
    const onToggle = jest.fn();
    const { getByTestId } = renderScreen({ onToggle });
    fireEvent.press(getByTestId("toggle-sound"));
    expect(onToggle).toHaveBeenCalledWith("sound", false);
  });

  it("calls onToggle when vibration toggle is pressed", () => {
    const onToggle = jest.fn();
    const { getByTestId } = renderScreen({ onToggle });
    fireEvent.press(getByTestId("toggle-vibration"));
    expect(onToggle).toHaveBeenCalledWith("vibration", false);
  });

  it("calls onToggle when resources toggle is pressed", () => {
    const onToggle = jest.fn();
    const { getByTestId } = renderScreen({ onToggle });
    fireEvent.press(getByTestId("toggle-resources"));
    expect(onToggle).toHaveBeenCalledWith("resources", false);
  });

  it("calls onItemPress when offers item is pressed", () => {
    const onItemPress = jest.fn();
    const { getByTestId } = renderScreen({ onItemPress });
    fireEvent.press(getByTestId("item-offers"));
    expect(onItemPress).toHaveBeenCalledWith("offers");
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

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("notification-settings-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
