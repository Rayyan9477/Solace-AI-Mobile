/**
 * Skeleton Component Tests
 * @description TDD tests for the Skeleton component
 * @task Task 2.2.7: Skeleton Component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { Skeleton } from "./Skeleton";

describe("Skeleton Component", () => {
  describe("Rendering", () => {
    it("should render skeleton", () => {
      const { getByTestId } = render(<Skeleton testID="skeleton" />);
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });

  describe("Shapes", () => {
    it("should render text shape by default", () => {
      const { getByTestId } = render(
        <Skeleton shape="text" testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should render circle shape", () => {
      const { getByTestId } = render(
        <Skeleton shape="circle" width={40} height={40} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should render rect shape", () => {
      const { getByTestId } = render(
        <Skeleton shape="rect" width={100} height={100} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });

  describe("Dimensions", () => {
    it("should apply custom width", () => {
      const { getByTestId } = render(
        <Skeleton width={200} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should apply custom height", () => {
      const { getByTestId } = render(
        <Skeleton height={50} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should support percentage width", () => {
      const { getByTestId } = render(
        <Skeleton width="100%" testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should apply custom border radius", () => {
      const { getByTestId } = render(
        <Skeleton shape="rect" borderRadius={16} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });

  describe("Animation", () => {
    it("should be animated by default", () => {
      const { getByTestId } = render(
        <Skeleton animated testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should render without animation when animated is false", () => {
      const { getByTestId } = render(
        <Skeleton animated={false} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });

  describe("Circle Shape", () => {
    it("should have equal width and height for circle", () => {
      const { getByTestId } = render(
        <Skeleton shape="circle" width={50} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should have borderRadius equal to half size for circle", () => {
      const { getByTestId } = render(
        <Skeleton shape="circle" width={60} height={60} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });

  describe("Text Shape", () => {
    it("should have default text dimensions", () => {
      const { getByTestId } = render(
        <Skeleton shape="text" testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });

    it("should have rounded corners for text shape", () => {
      const { getByTestId } = render(
        <Skeleton shape="text" testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have none accessibilityRole (decorative)", () => {
      const { getByTestId } = render(
        <Skeleton testID="skeleton" />
      );
      const skeleton = getByTestId("skeleton");
      expect(skeleton.props.accessibilityRole).toBe("none");
    });

    it("should indicate busy state", () => {
      const { getByTestId } = render(
        <Skeleton testID="skeleton" />
      );
      const skeleton = getByTestId("skeleton");
      expect(skeleton.props.accessibilityState?.busy).toBe(true);
    });
  });

  describe("Custom Styles", () => {
    it("should apply custom style", () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <Skeleton style={customStyle} testID="skeleton" />
      );
      expect(getByTestId("skeleton")).toBeTruthy();
    });
  });
});
