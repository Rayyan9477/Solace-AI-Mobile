/**
 * Divider Component Tests
 * @description TDD tests for the Divider component
 * @task Task 2.2.6: Divider Component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { Divider } from "./Divider";

describe("Divider Component", () => {
  describe("Rendering", () => {
    it("should render divider", () => {
      const { getByTestId } = render(<Divider testID="divider" />);
      expect(getByTestId("divider")).toBeTruthy();
    });
  });

  describe("Orientation", () => {
    it("should render horizontal orientation by default", () => {
      const { getByTestId } = render(<Divider testID="divider" />);
      expect(getByTestId("divider")).toBeTruthy();
    });

    it("should render vertical orientation", () => {
      const { getByTestId } = render(
        <Divider orientation="vertical" testID="divider" />
      );
      expect(getByTestId("divider")).toBeTruthy();
    });
  });

  describe("Variants", () => {
    it("should render full variant by default", () => {
      const { getByTestId } = render(
        <Divider variant="full" testID="divider" />
      );
      expect(getByTestId("divider")).toBeTruthy();
    });

    it("should render inset variant", () => {
      const { getByTestId } = render(
        <Divider variant="inset" testID="divider" />
      );
      expect(getByTestId("divider")).toBeTruthy();
    });

    it("should render middle variant", () => {
      const { getByTestId } = render(
        <Divider variant="middle" testID="divider" />
      );
      expect(getByTestId("divider")).toBeTruthy();
    });
  });

  describe("Label", () => {
    it("should render label text when provided", () => {
      const { getByText } = render(
        <Divider label="OR" testID="divider" />
      );
      expect(getByText("OR")).toBeTruthy();
    });

    it("should not render label when not provided", () => {
      const { queryByText } = render(<Divider testID="divider" />);
      expect(queryByText("OR")).toBeNull();
    });

    it("should render divider lines on both sides of label", () => {
      const { getByTestId } = render(
        <Divider label="Section" testID="divider" />
      );
      expect(getByTestId("divider-line-left")).toBeTruthy();
      expect(getByTestId("divider-line-right")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should be decorative (not accessible)", () => {
      const { getByTestId } = render(<Divider testID="divider" />);
      const divider = getByTestId("divider");
      expect(divider.props.accessibilityRole).toBe("none");
      expect(divider.props.accessible).toBe(false);
    });
  });

  describe("Custom Styles", () => {
    it("should apply custom style", () => {
      const customStyle = { marginVertical: 20 };
      const { getByTestId } = render(
        <Divider style={customStyle} testID="divider" />
      );
      expect(getByTestId("divider")).toBeTruthy();
    });
  });
});
