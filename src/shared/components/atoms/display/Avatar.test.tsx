/**
 * Avatar Component Tests
 * @description TDD tests for the Avatar component
 * @task Task 2.2.3: Avatar Component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { Avatar } from "./Avatar";

describe("Avatar Component", () => {
  describe("Rendering", () => {
    it("should render avatar", () => {
      const { getByTestId } = render(<Avatar testID="avatar" />);
      expect(getByTestId("avatar")).toBeTruthy();
    });

    it("should render with image source", () => {
      const { getByTestId } = render(
        <Avatar
          source={{ uri: "https://example.com/avatar.jpg" }}
          testID="avatar"
        />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });
  });

  describe("Initials Fallback", () => {
    it("should show initials when no image provided", () => {
      const { getByText } = render(
        <Avatar name="John Doe" testID="avatar" />
      );
      expect(getByText("JD")).toBeTruthy();
    });

    it("should show single initial for single name", () => {
      const { getByText } = render(
        <Avatar name="John" testID="avatar" />
      );
      expect(getByText("J")).toBeTruthy();
    });

    it("should handle empty name gracefully", () => {
      const { getByTestId } = render(
        <Avatar name="" testID="avatar" />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });

    it("should show placeholder for undefined name", () => {
      const { getByTestId } = render(
        <Avatar testID="avatar" />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      const { getByTestId } = render(
        <Avatar size="sm" name="AB" testID="avatar" />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });

    it("should render medium size (default)", () => {
      const { getByTestId } = render(
        <Avatar size="md" name="AB" testID="avatar" />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });

    it("should render large size", () => {
      const { getByTestId } = render(
        <Avatar size="lg" name="AB" testID="avatar" />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });

    it("should render extra large size", () => {
      const { getByTestId } = render(
        <Avatar size="xl" name="AB" testID="avatar" />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });
  });

  describe("Status Indicator", () => {
    it("should show status indicator when showStatus is true", () => {
      const { getByTestId } = render(
        <Avatar
          name="John"
          status="online"
          showStatus
          testID="avatar"
        />
      );
      expect(getByTestId("avatar-status")).toBeTruthy();
    });

    it("should not show status indicator by default", () => {
      const { queryByTestId } = render(
        <Avatar name="John" testID="avatar" />
      );
      expect(queryByTestId("avatar-status")).toBeNull();
    });

    it("should render online status", () => {
      const { getByTestId } = render(
        <Avatar name="John" status="online" showStatus testID="avatar" />
      );
      expect(getByTestId("avatar-status")).toBeTruthy();
    });

    it("should render offline status", () => {
      const { getByTestId } = render(
        <Avatar name="John" status="offline" showStatus testID="avatar" />
      );
      expect(getByTestId("avatar-status")).toBeTruthy();
    });

    it("should render away status", () => {
      const { getByTestId } = render(
        <Avatar name="John" status="away" showStatus testID="avatar" />
      );
      expect(getByTestId("avatar-status")).toBeTruthy();
    });

    it("should render busy status", () => {
      const { getByTestId } = render(
        <Avatar name="John" status="busy" showStatus testID="avatar" />
      );
      expect(getByTestId("avatar-status")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have image accessibilityRole", () => {
      const { getByTestId } = render(
        <Avatar name="John Doe" testID="avatar" />
      );
      const avatar = getByTestId("avatar");
      expect(avatar.props.accessibilityRole).toBe("image");
    });

    it("should apply custom accessibilityLabel", () => {
      const { getByLabelText } = render(
        <Avatar
          name="John Doe"
          accessibilityLabel="Profile picture of John Doe"
        />
      );
      expect(getByLabelText("Profile picture of John Doe")).toBeTruthy();
    });

    it("should use name for default accessibility label", () => {
      const { getByTestId } = render(
        <Avatar name="John Doe" testID="avatar" />
      );
      const avatar = getByTestId("avatar");
      expect(avatar.props.accessibilityLabel).toBe("John Doe");
    });
  });

  describe("Custom Styles", () => {
    it("should apply custom style", () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <Avatar name="AB" style={customStyle} testID="avatar" />
      );
      expect(getByTestId("avatar")).toBeTruthy();
    });
  });
});
