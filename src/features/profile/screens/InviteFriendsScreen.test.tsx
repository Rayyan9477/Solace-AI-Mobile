/**
 * InviteFriendsScreen Tests
 * @description Tests for friend invitation with referral incentive
 * @task Task 3.17.13: Invite Friends Screen (Screen 152)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { InviteFriendsScreen } from "./InviteFriendsScreen";

const defaultProps = {
  incentiveText: "Invite Friends, $50 OFF!!",
  subtitle: "Invite your friends to improve their mental health journey.",
  contacts: [
    { id: "c1", name: "Albert Motan", phone: "+1 234 567 890", initial: "A" },
    { id: "c2", name: "Alfonso Motan", phone: "+1 234 567 891", initial: "A" },
  ],
  onBack: jest.fn(),
  onAddFriends: jest.fn(),
  onInviteContact: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<InviteFriendsScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("InviteFriendsScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("invite-friends-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the incentive text", () => {
    const { getByText } = renderScreen();
    expect(getByText("Invite Friends, $50 OFF!!")).toBeTruthy();
  });

  it("renders the subtitle", () => {
    const { getByText } = renderScreen();
    expect(getByText(/mental health journey/)).toBeTruthy();
  });

  it("renders the add friends button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-friends-button")).toBeTruthy();
  });

  it("renders contact rows", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("contact-c1")).toBeTruthy();
    expect(getByTestId("contact-c2")).toBeTruthy();
  });

  it("renders contact names", () => {
    const { getByText } = renderScreen();
    expect(getByText("Albert Motan")).toBeTruthy();
    expect(getByText("Alfonso Motan")).toBeTruthy();
  });

  it("renders contact phone numbers", () => {
    const { getByText } = renderScreen();
    expect(getByText("+1 234 567 890")).toBeTruthy();
    expect(getByText("+1 234 567 891")).toBeTruthy();
  });

  it("renders avatar initials", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("A").length).toBe(2);
  });

  it("renders invite buttons for each contact", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("invite-c1")).toBeTruthy();
    expect(getByTestId("invite-c2")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onAddFriends when add friends button is pressed", () => {
    const onAddFriends = jest.fn();
    const { getByTestId } = renderScreen({ onAddFriends });
    fireEvent.press(getByTestId("add-friends-button"));
    expect(onAddFriends).toHaveBeenCalledTimes(1);
  });

  it("calls onInviteContact with contact id", () => {
    const onInviteContact = jest.fn();
    const { getByTestId } = renderScreen({ onInviteContact });
    fireEvent.press(getByTestId("invite-c1"));
    expect(onInviteContact).toHaveBeenCalledWith("c1");
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

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
