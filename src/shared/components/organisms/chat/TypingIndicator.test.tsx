/**
 * TypingIndicator Component Tests
 * @description TDD tests for the TypingIndicator component
 * @task Task 2.7.2: TypingIndicator Component
 */

import { render } from "@testing-library/react-native";
import React from "react";

import { TypingIndicator } from "./TypingIndicator";
import { getTypingText, sizeSpecs } from "./TypingIndicator.types";

describe("TypingIndicator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });

    it("renders nothing when isTyping is false", () => {
      const { queryByTestId } = render(
        <TypingIndicator testID="typing-indicator" isTyping={false} />,
      );

      expect(queryByTestId("typing-indicator")).toBeNull();
    });

    it("renders when isTyping is true", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" isTyping />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });

    it("renders avatar when showAvatar is true", () => {
      const { getByTestId } = render(
        <TypingIndicator
          testID="typing-indicator"
          showAvatar
          avatar="https://example.com/avatar.png"
        />,
      );

      expect(getByTestId("typing-indicator-avatar")).toBeTruthy();
    });

    it("hides avatar when showAvatar is false", () => {
      const { queryByTestId } = render(
        <TypingIndicator testID="typing-indicator" showAvatar={false} />,
      );

      expect(queryByTestId("typing-indicator-avatar")).toBeNull();
    });
  });

  describe("Variants", () => {
    it("renders dots variant", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" variant="dots" />,
      );

      expect(getByTestId("typing-indicator-dots")).toBeTruthy();
    });

    it("renders text variant", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" variant="text" />,
      );

      expect(getByTestId("typing-indicator-text")).toBeTruthy();
    });

    it("renders combined variant (default)", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" variant="combined" />,
      );

      expect(getByTestId("typing-indicator-text")).toBeTruthy();
      expect(getByTestId("typing-indicator-dots")).toBeTruthy();
    });
  });

  describe("Dots", () => {
    it("renders correct number of dots", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" variant="dots" dotCount={3} />,
      );

      expect(getByTestId("typing-indicator-dot-0")).toBeTruthy();
      expect(getByTestId("typing-indicator-dot-1")).toBeTruthy();
      expect(getByTestId("typing-indicator-dot-2")).toBeTruthy();
    });

    it("renders custom dot count", () => {
      const { getByTestId, queryByTestId } = render(
        <TypingIndicator testID="typing-indicator" variant="dots" dotCount={5} />,
      );

      expect(getByTestId("typing-indicator-dot-0")).toBeTruthy();
      expect(getByTestId("typing-indicator-dot-4")).toBeTruthy();
      expect(queryByTestId("typing-indicator-dot-5")).toBeNull();
    });
  });

  describe("Text", () => {
    it("displays default typing text", () => {
      const { getByText } = render(
        <TypingIndicator testID="typing-indicator" variant="text" />,
      );

      expect(getByText("Typing...")).toBeTruthy();
    });

    it("displays custom text", () => {
      const { getByText } = render(
        <TypingIndicator
          testID="typing-indicator"
          variant="text"
          text="Dr. Freud is thinking..."
        />,
      );

      expect(getByText("Dr. Freud is thinking...")).toBeTruthy();
    });

    it("generates text from typingUserName", () => {
      const { getByText } = render(
        <TypingIndicator
          testID="typing-indicator"
          variant="text"
          typingUserName="Dr. Freud"
        />,
      );

      expect(getByText("Dr. Freud is thinking...")).toBeTruthy();
    });
  });

  describe("Sizes", () => {
    it("applies small size", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" size="sm" />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });

    it("applies medium size (default)", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" size="md" />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });

    it("applies large size", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" size="lg" />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });
  });

  describe("Animation", () => {
    it("accepts bounce animation style", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" animationStyle="bounce" />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });

    it("accepts fade animation style", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" animationStyle="fade" />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });

    it("accepts pulse animation style", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" animationStyle="pulse" />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });

    it("accepts custom animation duration", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" animationDuration={1000} />,
      );

      expect(getByTestId("typing-indicator")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <TypingIndicator
          testID="typing-indicator"
          accessibilityLabel="AI is composing a response"
        />,
      );

      const indicator = getByTestId("typing-indicator");
      expect(indicator.props.accessibilityLabel).toBe(
        "AI is composing a response",
      );
    });

    it("has default accessibility label", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" />,
      );

      const indicator = getByTestId("typing-indicator");
      expect(indicator.props.accessibilityLabel).toBe("Typing indicator");
    });

    it("marks as accessibility live region", () => {
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" />,
      );

      const indicator = getByTestId("typing-indicator");
      expect(indicator.props.accessibilityLiveRegion).toBe("polite");
    });
  });

  describe("Styling", () => {
    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <TypingIndicator testID="typing-indicator" style={customStyle} />,
      );

      const indicator = getByTestId("typing-indicator");
      expect(indicator.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });
  });
});

// Helper function tests
describe("TypingIndicator Helper Functions", () => {
  describe("getTypingText", () => {
    it("returns default text when no userName", () => {
      expect(getTypingText()).toBe("Typing...");
    });

    it("returns personalized text with userName", () => {
      expect(getTypingText("Dr. Freud")).toBe("Dr. Freud is thinking...");
    });

    it("returns personalized text with different name", () => {
      expect(getTypingText("Assistant")).toBe("Assistant is thinking...");
    });
  });

  describe("sizeSpecs", () => {
    it("has small size specs", () => {
      expect(sizeSpecs.sm).toEqual({
        dotSize: 6,
        fontSize: 12,
        avatarSize: 28,
        spacing: 4,
      });
    });

    it("has medium size specs", () => {
      expect(sizeSpecs.md).toEqual({
        dotSize: 8,
        fontSize: 14,
        avatarSize: 36,
        spacing: 6,
      });
    });

    it("has large size specs", () => {
      expect(sizeSpecs.lg).toEqual({
        dotSize: 10,
        fontSize: 16,
        avatarSize: 44,
        spacing: 8,
      });
    });
  });
});
