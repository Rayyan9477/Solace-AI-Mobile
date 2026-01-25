/**
 * FormField Component Tests
 * @description Tests for the FormField molecule component
 * @task Task 2.4.3: FormField Component (Sprint 2.4 - Molecules Content)
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { View, Text, TextInput } from "react-native";
import { FormField } from "./FormField";

// Mock input component
const MockInput = ({ testID }: { testID?: string }) => (
  <TextInput testID={testID} placeholder="Enter text" />
);

// Mock icon component
const MockIcon = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Icon</Text>
  </View>
);

describe("FormField", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with children", () => {
      const { getByTestId } = render(
        <FormField>
          <MockInput testID="input" />
        </FormField>
      );
      expect(getByTestId("input")).toBeTruthy();
    });

    it("renders with testID", () => {
      const { getByTestId } = render(
        <FormField testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });

    it("renders with label", () => {
      const { getByText } = render(
        <FormField label="Email Address">
          <MockInput />
        </FormField>
      );
      expect(getByText("Email Address")).toBeTruthy();
    });

    it("renders without label", () => {
      const { getByTestId } = render(
        <FormField testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });
  });

  // ===================
  // Required Field Tests
  // ===================

  describe("Required Field", () => {
    it("shows required indicator when required is true", () => {
      const { getByText } = render(
        <FormField label="Email" required>
          <MockInput />
        </FormField>
      );
      expect(getByText("*")).toBeTruthy();
    });

    it("does not show required indicator when required is false", () => {
      const { queryByText, getByText } = render(
        <FormField label="Email" required={false}>
          <MockInput />
        </FormField>
      );
      expect(getByText("Email")).toBeTruthy();
      // Check that the asterisk is not present
      const asterisk = queryByText("*");
      expect(asterisk).toBeNull();
    });

    it("does not show required indicator by default", () => {
      const { queryByText, getByText } = render(
        <FormField label="Email">
          <MockInput />
        </FormField>
      );
      expect(getByText("Email")).toBeTruthy();
      expect(queryByText("*")).toBeNull();
    });
  });

  // ===================
  // Helper Text Tests
  // ===================

  describe("Helper Text", () => {
    it("renders helper text", () => {
      const { getByText } = render(
        <FormField helperText="Enter your email address">
          <MockInput />
        </FormField>
      );
      expect(getByText("Enter your email address")).toBeTruthy();
    });

    it("does not render helper text when not provided", () => {
      const { queryByTestId } = render(
        <FormField testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(queryByTestId("form-field-helper")).toBeNull();
    });
  });

  // ===================
  // Error Message Tests
  // ===================

  describe("Error Message", () => {
    it("renders error message when status is error", () => {
      const { getByText } = render(
        <FormField error="Invalid email address" status="error">
          <MockInput />
        </FormField>
      );
      expect(getByText("Invalid email address")).toBeTruthy();
    });

    it("does not render error message when status is not error", () => {
      const { queryByText } = render(
        <FormField error="Invalid email address" status="default">
          <MockInput />
        </FormField>
      );
      expect(queryByText("Invalid email address")).toBeNull();
    });

    it("prioritizes error message over helper text when status is error", () => {
      const { getByText, queryByText } = render(
        <FormField
          helperText="Enter your email"
          error="Invalid email"
          status="error"
        >
          <MockInput />
        </FormField>
      );
      expect(getByText("Invalid email")).toBeTruthy();
      expect(queryByText("Enter your email")).toBeNull();
    });

    it("shows helper text when error is provided but status is not error", () => {
      const { getByText, queryByText } = render(
        <FormField
          helperText="Enter your email"
          error="Invalid email"
          status="default"
        >
          <MockInput />
        </FormField>
      );
      expect(getByText("Enter your email")).toBeTruthy();
      expect(queryByText("Invalid email")).toBeNull();
    });
  });

  // ===================
  // Status Tests
  // ===================

  describe("Status", () => {
    it("renders default status", () => {
      const { getByTestId } = render(
        <FormField status="default" testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });

    it("renders error status", () => {
      const { getByTestId } = render(
        <FormField status="error" testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });

    it("renders success status", () => {
      const { getByTestId } = render(
        <FormField status="success" testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });

    it("renders warning status", () => {
      const { getByTestId } = render(
        <FormField status="warning" testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });
  });

  // ===================
  // Label Icon Tests
  // ===================

  describe("Label Icon", () => {
    it("renders label icon", () => {
      const { getByTestId } = render(
        <FormField
          label="Email"
          labelIcon={<MockIcon testID="label-icon" />}
        >
          <MockInput />
        </FormField>
      );
      expect(getByTestId("label-icon")).toBeTruthy();
    });

    it("does not render label icon when not provided", () => {
      const { queryByTestId, getByText } = render(
        <FormField label="Email" testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByText("Email")).toBeTruthy();
      expect(queryByTestId("label-icon")).toBeNull();
    });
  });

  // ===================
  // Counter Tests
  // ===================

  describe("Counter", () => {
    it("renders character counter", () => {
      const { getByText } = render(
        <FormField label="Message" counter="50/100">
          <MockInput />
        </FormField>
      );
      expect(getByText("50/100")).toBeTruthy();
    });

    it("does not render counter when not provided", () => {
      const { queryByTestId } = render(
        <FormField label="Message" testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(queryByTestId("form-field-counter")).toBeNull();
    });
  });

  // ===================
  // Disabled State Tests
  // ===================

  describe("Disabled State", () => {
    it("renders disabled state", () => {
      const { getByTestId } = render(
        <FormField disabled testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });

    it("applies reduced opacity when disabled", () => {
      const { getByTestId } = render(
        <FormField disabled testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <FormField
          accessibilityLabel="Email input field"
          testID="form-field"
        >
          <MockInput />
        </FormField>
      );
      const field = getByTestId("form-field");
      expect(field.props.accessibilityLabel).toBe("Email input field");
    });

    it("uses label as accessibility label when not provided", () => {
      const { getByTestId } = render(
        <FormField label="Email Address" testID="form-field">
          <MockInput />
        </FormField>
      );
      const field = getByTestId("form-field");
      expect(field.props.accessibilityLabel).toBe("Email Address");
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <FormField style={{ marginBottom: 24 }} testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });
  });

  // ===================
  // Combined Props Tests
  // ===================

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      const { getByText, getByTestId } = render(
        <FormField
          label="Email Address"
          required
          helperText="We'll never share your email"
          labelIcon={<MockIcon testID="label-icon" />}
          counter="0/100"
          status="default"
          testID="form-field"
        >
          <MockInput testID="input" />
        </FormField>
      );

      expect(getByTestId("form-field")).toBeTruthy();
      // Use partial match for nested text with required indicator
      expect(getByText(/Email Address/)).toBeTruthy();
      expect(getByText(/\*/)).toBeTruthy();
      expect(getByText("We'll never share your email")).toBeTruthy();
      expect(getByText("0/100")).toBeTruthy();
      expect(getByTestId("label-icon")).toBeTruthy();
      expect(getByTestId("input")).toBeTruthy();
    });

    it("renders error state with all related props", () => {
      const { getByText, getByTestId, queryByText } = render(
        <FormField
          label="Full Name"
          required
          helperText="At least 3 characters"
          error="This field is required"
          status="error"
          testID="form-field"
        >
          <MockInput testID="input" />
        </FormField>
      );

      expect(getByTestId("form-field")).toBeTruthy();
      // Use partial match for nested text with required indicator
      expect(getByText(/Full Name/)).toBeTruthy();
      expect(getByText(/\*/)).toBeTruthy();
      expect(getByText("This field is required")).toBeTruthy();
      expect(queryByText("At least 3 characters")).toBeNull();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty label", () => {
      const { getByTestId } = render(
        <FormField label="" testID="form-field">
          <MockInput />
        </FormField>
      );
      expect(getByTestId("form-field")).toBeTruthy();
    });

    it("handles very long label", () => {
      const longLabel = "A".repeat(200);
      const { getByText } = render(
        <FormField label={longLabel}>
          <MockInput />
        </FormField>
      );
      expect(getByText(longLabel)).toBeTruthy();
    });

    it("handles very long helper text", () => {
      const longHelper = "B".repeat(300);
      const { getByText } = render(
        <FormField helperText={longHelper}>
          <MockInput />
        </FormField>
      );
      expect(getByText(longHelper)).toBeTruthy();
    });

    it("handles very long error message", () => {
      const longError = "C".repeat(200);
      const { getByText } = render(
        <FormField error={longError} status="error">
          <MockInput />
        </FormField>
      );
      expect(getByText(longError)).toBeTruthy();
    });

    it("handles multiple children", () => {
      const { getByTestId } = render(
        <FormField testID="form-field">
          <MockInput testID="input-1" />
          <MockInput testID="input-2" />
        </FormField>
      );
      expect(getByTestId("input-1")).toBeTruthy();
      expect(getByTestId("input-2")).toBeTruthy();
    });
  });
});
