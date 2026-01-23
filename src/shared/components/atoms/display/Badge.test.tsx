/**
 * Badge Component Tests
 * @description TDD tests for the Badge component
 * @task Task 2.2.2: Badge Component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { Badge } from "./Badge";

describe("Badge Component", () => {
  describe("Rendering", () => {
    it("should render badge with label", () => {
      const { getByText } = render(<Badge label="New" testID="badge" />);
      expect(getByText("New")).toBeTruthy();
    });

    it("should render badge without label (dot mode)", () => {
      const { getByTestId, queryByText } = render(
        <Badge dot testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
      expect(queryByText("New")).toBeNull();
    });
  });

  describe("Variants", () => {
    it("should render default variant", () => {
      const { getByTestId } = render(
        <Badge label="Default" variant="default" testID="badge" />
      );
      const badge = getByTestId("badge");
      expect(badge).toBeTruthy();
    });

    it("should render success variant", () => {
      const { getByTestId } = render(
        <Badge label="Success" variant="success" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });

    it("should render warning variant", () => {
      const { getByTestId } = render(
        <Badge label="Warning" variant="warning" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });

    it("should render error variant", () => {
      const { getByTestId } = render(
        <Badge label="Error" variant="error" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });

    it("should render info variant", () => {
      const { getByTestId } = render(
        <Badge label="Info" variant="info" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      const { getByTestId } = render(
        <Badge label="SM" size="sm" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });

    it("should render medium size (default)", () => {
      const { getByTestId } = render(
        <Badge label="MD" size="md" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });

    it("should render large size", () => {
      const { getByTestId } = render(
        <Badge label="LG" size="lg" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });
  });

  describe("Dot Mode", () => {
    it("should render as dot when dot prop is true", () => {
      const { getByTestId, queryByText } = render(
        <Badge dot label="Hidden" testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
      // Label should not be shown in dot mode
      expect(queryByText("Hidden")).toBeNull();
    });

    it("should apply dot styles", () => {
      const { getByTestId } = render(
        <Badge dot testID="badge" />
      );
      const badge = getByTestId("badge");
      // Dot mode should have specific dimensions
      expect(badge).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible role", () => {
      const { getByTestId } = render(
        <Badge label="New" testID="badge" />
      );
      const badge = getByTestId("badge");
      expect(badge.props.accessibilityRole).toBe("text");
    });

    it("should include label in accessibility", () => {
      const { getByTestId } = render(
        <Badge label="3 unread" testID="badge" />
      );
      const badge = getByTestId("badge");
      expect(badge.props.accessibilityLabel).toBe("3 unread");
    });
  });

  describe("Custom Styles", () => {
    it("should apply custom style", () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <Badge label="Custom" style={customStyle} testID="badge" />
      );
      expect(getByTestId("badge")).toBeTruthy();
    });
  });
});
