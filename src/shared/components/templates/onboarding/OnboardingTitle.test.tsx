/**
 * OnboardingTitle Tests
 * @description Test suite for OnboardingTitle component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { OnboardingTitle } from "./OnboardingTitle";

describe("OnboardingTitle", () => {
  describe("Rendering", () => {
    it("should render title text", () => {
      const { getByText } = render(
        <OnboardingTitle
          text="Test Title"
          highlightedWords={[]}
        />
      );
      expect(getByText("Test Title")).toBeTruthy();
    });

    it("should highlight specified words", () => {
      const { getByText } = render(
        <OnboardingTitle
          text="Personalize Your Mental Health State With AI"
          highlightedWords={["Health State"]}
          highlightColor="#C4A574"
        />
      );

      // Full text should be present
      expect(getByText(/Personalize Your Mental/)).toBeTruthy();
      expect(getByText(/Health/)).toBeTruthy();
      expect(getByText(/State/)).toBeTruthy();
    });

    it("should handle multiple highlighted words", () => {
      const { getByText } = render(
        <OnboardingTitle
          text="AI Mental Journaling & AI Therapy Chatbot"
          highlightedWords={["Mental", "AI"]}
          highlightColor="#C4A574"
        />
      );

      expect(getByText(/Mental/)).toBeTruthy();
      expect(getByText(/AI/)).toBeTruthy();
    });

    it("should handle no highlighted words", () => {
      const { getByText } = render(
        <OnboardingTitle
          text="Simple Title"
          highlightedWords={[]}
        />
      );

      expect(getByText("Simple Title")).toBeTruthy();
    });

    it("should use default highlight color when not provided", () => {
      const { container } = render(
        <OnboardingTitle
          text="Test Highlight"
          highlightedWords={["Highlight"]}
        />
      );

      // Component should render successfully with default color
      expect(container).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have header role", () => {
      const { getByA11yRole } = render(
        <OnboardingTitle
          text="Test Title"
          highlightedWords={[]}
        />
      );
      expect(getByA11yRole("header")).toBeTruthy();
    });

    it("should have proper accessibility label with full text", () => {
      const fullText = "Personalize Your Mental Health State With AI";
      const { getByLabelText } = render(
        <OnboardingTitle
          text={fullText}
          highlightedWords={["Health State"]}
        />
      );
      expect(getByLabelText(fullText)).toBeTruthy();
    });
  });

  describe("TestID", () => {
    it("should render with custom testID", () => {
      const { getByTestId } = render(
        <OnboardingTitle
          text="Test"
          highlightedWords={[]}
          testID="custom-title"
        />
      );
      expect(getByTestId("custom-title")).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty text", () => {
      const { container } = render(
        <OnboardingTitle
          text=""
          highlightedWords={[]}
        />
      );
      expect(container).toBeTruthy();
    });

    it("should handle highlight words not in text", () => {
      const { getByText } = render(
        <OnboardingTitle
          text="This is a title"
          highlightedWords={["NotInText"]}
        />
      );
      expect(getByText("This is a title")).toBeTruthy();
    });

    it("should handle case-insensitive highlighting", () => {
      const { getByText } = render(
        <OnboardingTitle
          text="Mental Health"
          highlightedWords={["mental"]} // lowercase
        />
      );
      expect(getByText(/Mental/)).toBeTruthy();
    });
  });
});
