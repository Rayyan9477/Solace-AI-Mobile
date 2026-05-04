/**
 * ProfileDashboardScreen Tests — prototype v4.2 #09 reskin (Sprint 8).
 * ≥15 behavior-style tests for header, stats, settings, sign-out.
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ProfileDashboardScreen } from "./ProfileDashboardScreen";

const makeProps = (overrides = {}) => ({
  onChangePhoto: jest.fn(),
  onPersonalInfo: jest.fn(),
  onNotifications: jest.fn(),
  onPrivacy: jest.fn(),
  onLanguage: jest.fn(),
  onHelp: jest.fn(),
  onFeedback: jest.fn(),
  onInvite: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProfileDashboardScreen", () => {
  // 1. Render
  it("renders the screen container", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("profile-dashboard-screen")).toBeTruthy();
  });

  // 2. Default user name
  it("renders default user name", () => {
    const { getByText } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByText("Rayyan Ahmed")).toBeTruthy();
  });

  // 3. Custom user name
  it("renders provided user name", () => {
    const { getByText } = render(
      <ProfileDashboardScreen {...makeProps()} userName="Alex Smith" />,
    );
    expect(getByText("Alex Smith")).toBeTruthy();
  });

  // 4. Avatar initial defaults from name
  it("uses first character of name as avatar initial", () => {
    const { getByTestId } = render(
      <ProfileDashboardScreen {...makeProps()} userName="Maya Lin" />,
    );
    expect(getByTestId("avatar-initial").props.children).toBe("M");
  });

  // 5. Custom initial
  it("respects userInitial override", () => {
    const { getByTestId } = render(
      <ProfileDashboardScreen
        {...makeProps()}
        userName="Rayyan"
        userInitial="X"
      />,
    );
    expect(getByTestId("avatar-initial").props.children).toBe("X");
  });

  // 6. Premium chip renders by default
  it("renders premium chip when isPremium is true (default)", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("premium-chip")).toBeTruthy();
  });

  // 7. Premium chip hides when not premium
  it("does not render premium chip when isPremium is false", () => {
    const { queryByTestId } = render(
      <ProfileDashboardScreen {...makeProps()} isPremium={false} />,
    );
    expect(queryByTestId("premium-chip")).toBeNull();
  });

  // 8. Camera badge fires onChangePhoto
  it("calls onChangePhoto when camera badge pressed", () => {
    const onChangePhoto = jest.fn();
    const { getByTestId } = render(
      <ProfileDashboardScreen {...makeProps({ onChangePhoto })} />,
    );
    fireEvent.press(getByTestId("change-photo-button"));
    expect(onChangePhoto).toHaveBeenCalledTimes(1);
  });

  // 9. Stats grid — three tiles
  it("renders three stat tiles", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("stat-streak")).toBeTruthy();
    expect(getByTestId("stat-sessions")).toBeTruthy();
    expect(getByTestId("stat-mindful")).toBeTruthy();
  });

  // 10. Streak value shows
  it("displays default streak value", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("stat-streak").props.accessibilityLabel).toBe(
      "Streak: 23d",
    );
  });

  // 11. Sessions value shows
  it("displays default sessions value", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("stat-sessions").props.accessibilityLabel).toBe(
      "Sessions: 142",
    );
  });

  // 12. Mindful value shows
  it("displays default mindful hours value", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("stat-mindful").props.accessibilityLabel).toBe(
      "Mindful: 12h",
    );
  });

  // 13. Settings rows — account
  it("renders all account section rows", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("row-personal-info")).toBeTruthy();
    expect(getByTestId("row-notifications")).toBeTruthy();
    expect(getByTestId("row-privacy")).toBeTruthy();
    expect(getByTestId("row-language")).toBeTruthy();
  });

  // 14. Settings rows — support
  it("renders all support section rows", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("row-help")).toBeTruthy();
    expect(getByTestId("row-feedback")).toBeTruthy();
    expect(getByTestId("row-invite")).toBeTruthy();
  });

  // 15. Personal info row press
  it("calls onPersonalInfo when row pressed", () => {
    const onPersonalInfo = jest.fn();
    const { getByTestId } = render(
      <ProfileDashboardScreen {...makeProps({ onPersonalInfo })} />,
    );
    fireEvent.press(getByTestId("row-personal-info"));
    expect(onPersonalInfo).toHaveBeenCalledTimes(1);
  });

  // 16. Notifications row press
  it("calls onNotifications when row pressed", () => {
    const onNotifications = jest.fn();
    const { getByTestId } = render(
      <ProfileDashboardScreen {...makeProps({ onNotifications })} />,
    );
    fireEvent.press(getByTestId("row-notifications"));
    expect(onNotifications).toHaveBeenCalledTimes(1);
  });

  // 17. Sign out — explicit prop wins
  it("calls onSignOut prop when provided", () => {
    const onSignOut = jest.fn();
    const { getByTestId } = render(
      <ProfileDashboardScreen {...makeProps({ onSignOut })} />,
    );
    fireEvent.press(getByTestId("sign-out-button"));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  // 18. Footer
  it("renders the version footer", () => {
    const { getByText } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByText(/Solace v4\.2\.0/)).toBeTruthy();
  });

  // 19. a11y — name is announced as header
  it("name is announced as a header", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(getByTestId("profile-name").props.accessibilityRole).toBe("header");
  });

  // 20. a11y — camera badge meets touch target
  it("camera badge button meets 44pt minimum touch target", () => {
    const { getByTestId } = render(<ProfileDashboardScreen {...makeProps()} />);
    const btn = getByTestId("change-photo-button");
    const { StyleSheet } = require("react-native");
    const flat = StyleSheet.flatten(btn.props.style);
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  // 21. Branding — no Freud
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<ProfileDashboardScreen {...makeProps()} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
