/**
 * AccountSettingsScreen Tests — prototype v4.2 #37 reskin (Sprint 9).
 * ≥15 behavior-style tests covering header, profile card, three sections,
 * Face ID toggle, sign out, and footer.
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { AccountSettingsScreen } from "./AccountSettingsScreen";

const makeProps = (overrides = {}) => ({
  onBack: jest.fn(),
  onPersonalInfo: jest.fn(),
  onEmail: jest.fn(),
  onChangePassword: jest.fn(),
  onSubscription: jest.fn(),
  onNotifications: jest.fn(),
  onAppearance: jest.fn(),
  onLanguage: jest.fn(),
  onCheckInTime: jest.fn(),
  onPrivacy: jest.fn(),
  onFaceIdToggle: jest.fn(),
  onExportData: jest.fn(),
  onDeleteAccount: jest.fn(),
  onSignOut: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AccountSettingsScreen", () => {
  // 1. Root container
  it("renders the screen container", () => {
    const { getByTestId } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByTestId("account-settings-screen")).toBeTruthy();
  });

  // 2. Headline
  it("renders the 'Account' headline", () => {
    const { getByText } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByText("Account")).toBeTruthy();
  });

  // 3. Mini header label
  it("renders the Settings bracket label", () => {
    const { getByText } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByText(/SETTINGS/)).toBeTruthy();
  });

  // 4. Back press
  it("calls onBack when back button pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = render(
      <AccountSettingsScreen {...makeProps({ onBack })} />,
    );
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 5. Default profile name
  it("renders the default user name and email", () => {
    const { getByText, getAllByText } = render(
      <AccountSettingsScreen {...makeProps()} />,
    );
    expect(getByText("Rayyan Ahmed")).toBeTruthy();
    // Email shows in profile card AND in Email address row's value cell
    expect(getAllByText("rayyan@solace.ai").length).toBeGreaterThanOrEqual(1);
  });

  // 6. Custom user override
  it("respects userName / userEmail overrides", () => {
    const { getByText, getAllByText } = render(
      <AccountSettingsScreen
        {...makeProps()}
        userName="Maya Lin"
        userEmail="maya@example.com"
      />,
    );
    expect(getByText("Maya Lin")).toBeTruthy();
    expect(getAllByText("maya@example.com").length).toBeGreaterThanOrEqual(1);
  });

  // 7. Avatar initial defaults from name
  it("uses first character of name as avatar initial", () => {
    const { getByTestId } = render(
      <AccountSettingsScreen {...makeProps()} userName="Alex Kim" />,
    );
    expect(getByTestId("profile-avatar-initial").props.children).toBe("A");
  });

  // 8. Custom initial wins
  it("respects userInitial override", () => {
    const { getByTestId } = render(
      <AccountSettingsScreen
        {...makeProps()}
        userName="Rayyan"
        userInitial="X"
      />,
    );
    expect(getByTestId("profile-avatar-initial").props.children).toBe("X");
  });

  // 9. Plus chip renders
  it("renders the Plus chip", () => {
    const { getByTestId } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByTestId("plus-chip")).toBeTruthy();
  });

  // 10. Account section rows
  it("renders all Account section rows", () => {
    const { getByTestId } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByTestId("row-personal-info")).toBeTruthy();
    expect(getByTestId("row-email")).toBeTruthy();
    expect(getByTestId("row-change-password")).toBeTruthy();
    expect(getByTestId("row-subscription")).toBeTruthy();
  });

  // 11. Preferences section rows
  it("renders all Preferences section rows", () => {
    const { getByTestId } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByTestId("row-notifications")).toBeTruthy();
    expect(getByTestId("row-appearance")).toBeTruthy();
    expect(getByTestId("row-language")).toBeTruthy();
    expect(getByTestId("row-checkin-time")).toBeTruthy();
  });

  // 12. Privacy section rows
  it("renders all Privacy & safety rows", () => {
    const { getByTestId } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByTestId("row-privacy")).toBeTruthy();
    expect(getByTestId("row-face-id")).toBeTruthy();
    expect(getByTestId("row-export-data")).toBeTruthy();
    expect(getByTestId("row-delete-account")).toBeTruthy();
  });

  // 13. Personal info press
  it("calls onPersonalInfo when personal info row pressed", () => {
    const onPersonalInfo = jest.fn();
    const { getByTestId } = render(
      <AccountSettingsScreen {...makeProps({ onPersonalInfo })} />,
    );
    fireEvent.press(getByTestId("row-personal-info"));
    expect(onPersonalInfo).toHaveBeenCalledTimes(1);
  });

  // 14. Subscription value renders
  it("renders the subscription value label", () => {
    const { getByText } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByText("Plus Annual")).toBeTruthy();
  });

  // 15. Notifications value renders
  it("renders the notifications value", () => {
    const { getByText } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByText("On")).toBeTruthy();
  });

  // 16. Notifications value flips when disabled
  it("renders 'Off' when notificationsEnabled is false", () => {
    const { getByText } = render(
      <AccountSettingsScreen
        {...makeProps()}
        notificationsEnabled={false}
      />,
    );
    expect(getByText("Off")).toBeTruthy();
  });

  // 17. Face ID toggle fires
  it("calls onFaceIdToggle with new value when switch pressed", () => {
    const onFaceIdToggle = jest.fn();
    const { getByTestId } = render(
      <AccountSettingsScreen {...makeProps({ onFaceIdToggle })} />,
    );
    fireEvent(getByTestId("face-id-switch"), "valueChange", false);
    expect(onFaceIdToggle).toHaveBeenCalledWith(false);
  });

  // 18. Delete account press
  it("calls onDeleteAccount when delete row pressed", () => {
    const onDeleteAccount = jest.fn();
    const { getByTestId } = render(
      <AccountSettingsScreen {...makeProps({ onDeleteAccount })} />,
    );
    fireEvent.press(getByTestId("row-delete-account"));
    expect(onDeleteAccount).toHaveBeenCalledTimes(1);
  });

  // 19. Sign out
  it("calls onSignOut when sign-out card pressed", () => {
    const onSignOut = jest.fn();
    const { getByTestId } = render(
      <AccountSettingsScreen {...makeProps({ onSignOut })} />,
    );
    fireEvent.press(getByTestId("sign-out-button"));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  // 20. Footer
  it("renders the version footer", () => {
    const { getByText } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByText(/Solace v4\.2\.0/)).toBeTruthy();
  });

  // 21. Headline a11y
  it("'Account' headline is announced as a header", () => {
    const { getByTestId } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(getByTestId("account-headline").props.accessibilityRole).toBe(
      "header",
    );
  });

  // 22. Touch target — back button
  it("back button meets 44pt minimum touch target", () => {
    const { getByTestId } = render(<AccountSettingsScreen {...makeProps()} />);
    const { StyleSheet } = require("react-native");
    const flat = StyleSheet.flatten(getByTestId("back-button").props.style);
    expect(flat.height).toBeGreaterThanOrEqual(44);
    expect(flat.width).toBeGreaterThanOrEqual(44);
  });

  // 23. Branding — no Freud
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<AccountSettingsScreen {...makeProps()} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
