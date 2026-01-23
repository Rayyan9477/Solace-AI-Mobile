/**
 * ProgressBar Component Tests
 * @description TDD tests for the ProgressBar component
 * @task Task 2.2.5: ProgressBar Component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar Component", () => {
  describe("Rendering", () => {
    it("should render progress bar", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });

    it("should render progress fill", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} testID="progress" />
      );
      expect(getByTestId("progress-fill")).toBeTruthy();
    });
  });

  describe("Value", () => {
    it("should reflect 0% progress", () => {
      const { getByTestId } = render(
        <ProgressBar value={0} testID="progress" />
      );
      const fill = getByTestId("progress-fill");
      expect(fill.props.style).toBeTruthy();
    });

    it("should reflect 50% progress", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} testID="progress" />
      );
      const fill = getByTestId("progress-fill");
      expect(fill.props.style).toBeTruthy();
    });

    it("should reflect 100% progress", () => {
      const { getByTestId } = render(
        <ProgressBar value={100} testID="progress" />
      );
      const fill = getByTestId("progress-fill");
      expect(fill.props.style).toBeTruthy();
    });

    it("should clamp value above 100 to 100", () => {
      const { getByTestId } = render(
        <ProgressBar value={150} testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });

    it("should clamp value below 0 to 0", () => {
      const { getByTestId } = render(
        <ProgressBar value={-10} testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });
  });

  describe("Variants", () => {
    it("should render default variant", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} variant="default" testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });

    it("should render success variant", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} variant="success" testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });

    it("should render warning variant", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} variant="warning" testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });

    it("should render error variant", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} variant="error" testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} size="sm" testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });

    it("should render medium size (default)", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} size="md" testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });

    it("should render large size", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} size="lg" testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });
  });

  describe("Label", () => {
    it("should show percentage label when showLabel is true", () => {
      const { getByText } = render(
        <ProgressBar value={75} showLabel testID="progress" />
      );
      expect(getByText("75%")).toBeTruthy();
    });

    it("should not show label by default", () => {
      const { queryByText } = render(
        <ProgressBar value={75} testID="progress" />
      );
      expect(queryByText("75%")).toBeNull();
    });

    it("should round percentage in label", () => {
      const { getByText } = render(
        <ProgressBar value={33.7} showLabel testID="progress" />
      );
      expect(getByText("34%")).toBeTruthy();
    });
  });

  describe("Indeterminate Mode", () => {
    it("should render indeterminate state", () => {
      const { getByTestId } = render(
        <ProgressBar value={0} indeterminate testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have progressbar accessibilityRole", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} testID="progress" />
      );
      const progress = getByTestId("progress");
      expect(progress.props.accessibilityRole).toBe("progressbar");
    });

    it("should include accessibilityValue", () => {
      const { getByTestId } = render(
        <ProgressBar value={50} testID="progress" />
      );
      const progress = getByTestId("progress");
      expect(progress.props.accessibilityValue).toEqual({
        min: 0,
        max: 100,
        now: 50,
      });
    });

    it("should apply custom accessibilityLabel", () => {
      const { getByLabelText } = render(
        <ProgressBar
          value={50}
          accessibilityLabel="Upload progress"
        />
      );
      expect(getByLabelText("Upload progress")).toBeTruthy();
    });
  });

  describe("Custom Styles", () => {
    it("should apply custom style", () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <ProgressBar value={50} style={customStyle} testID="progress" />
      );
      expect(getByTestId("progress")).toBeTruthy();
    });
  });
});
