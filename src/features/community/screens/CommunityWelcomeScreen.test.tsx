/**
 * CommunityWelcomeScreen Tests
 * @task Task 3.14.1: Community Welcome Screen (Screen 119)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CommunityWelcomeScreen } from "./CommunityWelcomeScreen";

const defaultProps = {
  title: "Welcome to Our Community!",
  description:
    "Our community is a place of warmth and acceptance, where everyone's voice is valued and respected.",
  onStartPosting: jest.fn(),
  onPrivacyPolicy: jest.fn(),
  onTerms: jest.fn(),
};

describe("CommunityWelcomeScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("community-welcome-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    const container = getByTestId("community-welcome-screen");
    const flat = Object.assign({}, ...[].concat(container.props.style));
    expect(flat.flex).toBe(1);
  });

  // --- Illustration ---
  it("renders the illustration area", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("welcome-illustration")).toBeTruthy();
  });

  // --- Brand Logo ---
  it("renders the brand logo", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("brand-logo")).toBeTruthy();
  });

  // --- Title ---
  it("displays the welcome title", () => {
    const { getByText } = render(<CommunityWelcomeScreen {...defaultProps} />);
    expect(getByText("Welcome to Our Community!")).toBeTruthy();
  });

  // --- Description ---
  it("displays the description", () => {
    const { getByText } = render(<CommunityWelcomeScreen {...defaultProps} />);
    expect(getByText(defaultProps.description)).toBeTruthy();
  });

  // --- Start Posting Button ---
  it("renders the Start Posting button", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("start-posting-button")).toBeTruthy();
  });

  it("displays 'Start Posting' text", () => {
    const { getByText } = render(<CommunityWelcomeScreen {...defaultProps} />);
    expect(getByText(/Start Posting/)).toBeTruthy();
  });

  it("calls onStartPosting when button is pressed", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("start-posting-button"));
    expect(defaultProps.onStartPosting).toHaveBeenCalledTimes(1);
  });

  it("Start Posting button has accessibilityRole button", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("start-posting-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("Start Posting button meets minimum touch target size", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("start-posting-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  // --- Footer Links ---
  it("renders the privacy policy link", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("privacy-policy-link")).toBeTruthy();
  });

  it("calls onPrivacyPolicy when privacy link is pressed", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("privacy-policy-link"));
    expect(defaultProps.onPrivacyPolicy).toHaveBeenCalledTimes(1);
  });

  it("renders the terms link", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("terms-link")).toBeTruthy();
  });

  it("calls onTerms when terms link is pressed", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("terms-link"));
    expect(defaultProps.onTerms).toHaveBeenCalledTimes(1);
  });

  it("footer links have accessibilityRole link", () => {
    const { getByTestId } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(getByTestId("privacy-policy-link").props.accessibilityRole).toBe(
      "link",
    );
    expect(getByTestId("terms-link").props.accessibilityRole).toBe("link");
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(
      <CommunityWelcomeScreen {...defaultProps} />,
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
