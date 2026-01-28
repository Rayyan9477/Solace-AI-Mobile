/**
 * ProfileSetupAvatarScreen Tests
 * @description Tests for avatar selection during profile setup
 * @task Task 3.3.1: Profile Setup Avatar Screen (Screen 15)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ProfileSetupAvatarScreen } from "./ProfileSetupAvatarScreen";

describe("ProfileSetupAvatarScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnContinue = jest.fn();
  const mockOnUpload = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onContinue: mockOnContinue,
    onUpload: mockOnUpload,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByTestId("profile-setup-avatar-screen")).toBeTruthy();
  });

  it("displays the header with Profile Setup title", () => {
    const { getByText } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByText("Profile Setup")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the avatar display container", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByTestId("avatar-display")).toBeTruthy();
  });

  it("displays the avatar with decorative border", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByTestId("avatar-container")).toBeTruthy();
  });

  it("displays the title text", () => {
    const { getByText } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByText("Select your Avatar")).toBeTruthy();
  });

  it("displays the subtitle text", () => {
    const { getByText } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(
      getByText(/We have a set of customizable avatar/)
    ).toBeTruthy();
  });

  it("displays the upload button", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByTestId("upload-button")).toBeTruthy();
  });

  it("calls onUpload when upload button is pressed", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("upload-button"));
    expect(mockOnUpload).toHaveBeenCalledTimes(1);
  });

  it("displays the upload label text", () => {
    const { getByText } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByText(/Or upload your profile/)).toBeTruthy();
  });

  it("displays swipe indicators", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByTestId("swipe-indicator-up")).toBeTruthy();
    expect(getByTestId("swipe-indicator-down")).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    const container = getByTestId("profile-setup-avatar-screen");
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
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("upload button has proper accessibility", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    const button = getByTestId("upload-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Upload profile picture");
  });

  it("upload button has minimum touch target size", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    const button = getByTestId("upload-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.width).toBeGreaterThanOrEqual(44);
    expect(buttonStyles.height).toBeGreaterThanOrEqual(44);
  });

  it("displays decorative circles", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    expect(getByTestId("decorative-circles")).toBeTruthy();
  });

  it("avatar display has proper structure with border", () => {
    const { getByTestId } = render(
      <ProfileSetupAvatarScreen {...defaultProps} />
    );
    const avatarContainer = getByTestId("avatar-container");
    const styles = Array.isArray(avatarContainer.props.style)
      ? avatarContainer.props.style.flat()
      : [avatarContainer.props.style];
    const containerStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(containerStyles.borderWidth).toBeGreaterThanOrEqual(4);
  });
});
