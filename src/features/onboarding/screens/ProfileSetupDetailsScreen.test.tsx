/**
 * ProfileSetupDetailsScreen Tests
 * @description Tests for profile details form during profile setup
 * @task Task 3.3.2: Profile Setup Details Screen (Screen 16)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ProfileSetupDetailsScreen } from "./ProfileSetupDetailsScreen";

describe("ProfileSetupDetailsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnContinue = jest.fn();
  const mockOnEditPhoto = jest.fn();
  const mockOnGenderPress = jest.fn();
  const mockOnLocationPress = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onContinue: mockOnContinue,
    onEditPhoto: mockOnEditPhoto,
    onGenderPress: mockOnGenderPress,
    onLocationPress: mockOnLocationPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("profile-setup-details-screen")).toBeTruthy();
  });

  it("displays the curved header", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("curved-header")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Profile Setup title", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Profile Setup")).toBeTruthy();
  });

  it("displays the profile photo", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("profile-photo")).toBeTruthy();
  });

  it("displays the edit photo button", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("edit-photo-button")).toBeTruthy();
  });

  it("calls onEditPhoto when edit button is pressed", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("edit-photo-button"));
    expect(mockOnEditPhoto).toHaveBeenCalledTimes(1);
  });

  it("displays the Full Name input field", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("full-name-input")).toBeTruthy();
  });

  it("displays the Full Name label", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Full Name")).toBeTruthy();
  });

  it("displays the Email Address input field", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("email-input")).toBeTruthy();
  });

  it("displays the Email Address label", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Email Address")).toBeTruthy();
  });

  it("displays the Password input field", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("password-input")).toBeTruthy();
  });

  it("displays the Password label", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Password")).toBeTruthy();
  });

  it("displays the password visibility toggle", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("password-toggle")).toBeTruthy();
  });

  it("displays the Account Type selector", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("account-type-selector")).toBeTruthy();
  });

  it("displays the Account Type label", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Account Type")).toBeTruthy();
  });

  it("displays the account type options", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Psychiatrist")).toBeTruthy();
    expect(getByText("Patient")).toBeTruthy();
    expect(getByText("Professional")).toBeTruthy();
  });

  it("displays the Weight slider", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("weight-slider")).toBeTruthy();
  });

  it("displays the Weight label", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Weight")).toBeTruthy();
  });

  it("displays the Gender dropdown", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("gender-dropdown")).toBeTruthy();
  });

  it("displays the Gender label", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Gender")).toBeTruthy();
  });

  it("calls onGenderPress when gender dropdown is pressed", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("gender-dropdown"));
    expect(mockOnGenderPress).toHaveBeenCalledTimes(1);
  });

  it("displays the Location dropdown", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("location-dropdown")).toBeTruthy();
  });

  it("displays the Location label", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText("Location")).toBeTruthy();
  });

  it("calls onLocationPress when location dropdown is pressed", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("location-dropdown"));
    expect(mockOnLocationPress).toHaveBeenCalledTimes(1);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    const container = getByTestId("profile-setup-details-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <ProfileSetupDetailsScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });
});
