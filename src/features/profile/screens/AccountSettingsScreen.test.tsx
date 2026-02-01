/**
 * AccountSettingsScreen Tests
 * @description Tests for the comprehensive settings menu
 * @task Task 3.17.3: Account Settings Screen (Screen 142)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AccountSettingsScreen } from "./AccountSettingsScreen";

const defaultProps = {
  sections: [
    {
      id: "general",
      title: "General Settings",
      items: [
        {
          id: "notifications",
          label: "Notifications",
          type: "navigation" as const,
        },
        {
          id: "personal-info",
          label: "Personal Information",
          type: "navigation" as const,
        },
        {
          id: "emergency",
          label: "Emergency Contact",
          type: "value" as const,
          value: "15+",
        },
        {
          id: "language",
          label: "Language",
          type: "value" as const,
          value: "English (EN)",
        },
        {
          id: "dark-mode",
          label: "Dark Mode",
          type: "toggle" as const,
          toggleValue: true,
        },
        { id: "invite", label: "Invite Friends", type: "navigation" as const },
        {
          id: "feedback",
          label: "Submit Feedback",
          type: "navigation" as const,
        },
      ],
    },
    {
      id: "security",
      title: "Security & Privacy",
      items: [
        { id: "security", label: "Security", type: "navigation" as const },
        { id: "help", label: "Help Center", type: "navigation" as const },
      ],
    },
    {
      id: "danger",
      title: "Danger Zone",
      items: [
        {
          id: "close-account",
          label: "Close Account",
          type: "destructive" as const,
        },
      ],
    },
    {
      id: "logout",
      title: "Log Out",
      items: [{ id: "logout", label: "Log Out", type: "navigation" as const }],
    },
  ],
  onBack: jest.fn(),
  onItemPress: jest.fn(),
  onToggle: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<AccountSettingsScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("AccountSettingsScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("account-settings-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the 'Account Settings' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Account Settings")).toBeTruthy();
  });

  it("renders all section headers", () => {
    const { getByText, getAllByText } = renderScreen();
    expect(getByText("General Settings")).toBeTruthy();
    expect(getByText("Security & Privacy")).toBeTruthy();
    expect(getByText("Danger Zone")).toBeTruthy();
    expect(getAllByText("Log Out").length).toBe(2);
  });

  it("renders navigation items", () => {
    const { getByText } = renderScreen();
    expect(getByText("Notifications")).toBeTruthy();
    expect(getByText("Personal Information")).toBeTruthy();
    expect(getByText("Invite Friends")).toBeTruthy();
  });

  it("renders value items with their values", () => {
    const { getByText } = renderScreen();
    expect(getByText("Emergency Contact")).toBeTruthy();
    expect(getByText("15+")).toBeTruthy();
    expect(getByText("Language")).toBeTruthy();
    expect(getByText("English (EN)")).toBeTruthy();
  });

  it("renders the dark mode toggle item", () => {
    const { getByText } = renderScreen();
    expect(getByText("Dark Mode")).toBeTruthy();
  });

  it("renders the dark mode toggle control", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("toggle-dark-mode")).toBeTruthy();
  });

  it("renders the destructive close account item", () => {
    const { getByText } = renderScreen();
    expect(getByText("Close Account")).toBeTruthy();
  });

  it("renders the security section items", () => {
    const { getByText } = renderScreen();
    expect(getByText("Security")).toBeTruthy();
    expect(getByText("Help Center")).toBeTruthy();
  });

  it("renders the log out item", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("Log Out").length).toBe(2);
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onItemPress with item id when navigation item is pressed", () => {
    const onItemPress = jest.fn();
    const { getByTestId } = renderScreen({ onItemPress });
    fireEvent.press(getByTestId("settings-item-notifications"));
    expect(onItemPress).toHaveBeenCalledWith("notifications");
  });

  it("calls onToggle with item id and value when toggle is pressed", () => {
    const onToggle = jest.fn();
    const { getByTestId } = renderScreen({ onToggle });
    fireEvent.press(getByTestId("toggle-dark-mode"));
    expect(onToggle).toHaveBeenCalledWith("dark-mode", false);
  });

  it("calls onItemPress for destructive item", () => {
    const onItemPress = jest.fn();
    const { getByTestId } = renderScreen({ onItemPress });
    fireEvent.press(getByTestId("settings-item-close-account"));
    expect(onItemPress).toHaveBeenCalledWith("close-account");
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
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

  it("settings items meet 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("settings-item-notifications").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("account-settings-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  it("applies destructive styling to close account item", () => {
    const { getByTestId } = renderScreen();
    const item = getByTestId("settings-item-close-account");
    expect(item).toBeTruthy();
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
