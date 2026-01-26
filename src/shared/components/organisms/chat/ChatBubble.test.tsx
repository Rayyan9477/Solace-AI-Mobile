/**
 * ChatBubble Component Tests
 * @description TDD tests for the ChatBubble component
 * @task Task 2.7.1: ChatBubble Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ChatBubble } from "./ChatBubble";
import type { EmotionDetection, MessageAttachment } from "./ChatBubble.types";
import {
  formatTimestamp,
  getStatusIcon,
  getEmotionColor,
} from "./ChatBubble.types";

describe("ChatBubble", () => {
  const mockOnLongPress = jest.fn();
  const mockOnReactionPress = jest.fn();
  const mockOnAttachmentPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(
        <ChatBubble testID="chat-bubble" message="Hello" sender="user" />,
      );

      expect(getByTestId("chat-bubble")).toBeTruthy();
    });

    it("renders user message on the right", () => {
      const { getByTestId } = render(
        <ChatBubble testID="chat-bubble" message="Hello" sender="user" />,
      );

      const container = getByTestId("chat-bubble");
      // User messages should have flex-end alignment
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ alignSelf: "flex-end" }),
        ]),
      );
    });

    it("renders AI message on the left", () => {
      const { getByTestId } = render(
        <ChatBubble testID="chat-bubble" message="Hello" sender="ai" />,
      );

      const container = getByTestId("chat-bubble");
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ alignSelf: "flex-start" }),
        ]),
      );
    });

    it("renders message content", () => {
      const { getByText } = render(
        <ChatBubble
          testID="chat-bubble"
          message="This is a test message"
          sender="user"
        />,
      );

      expect(getByText("This is a test message")).toBeTruthy();
    });

    it("renders avatar when showAvatar is true", () => {
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="ai"
          showAvatar
          avatar="https://example.com/avatar.png"
        />,
      );

      expect(getByTestId("chat-bubble-avatar")).toBeTruthy();
    });

    it("hides avatar when showAvatar is false", () => {
      const { queryByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="ai"
          showAvatar={false}
        />,
      );

      expect(queryByTestId("chat-bubble-avatar")).toBeNull();
    });

    it("renders timestamp when showTimestamp is true", () => {
      const timestamp = new Date(2025, 0, 15, 14, 30);
      const { getByText } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          timestamp={timestamp}
          showTimestamp
        />,
      );

      expect(getByText("2:30 PM")).toBeTruthy();
    });

    it("hides timestamp when showTimestamp is false", () => {
      const timestamp = new Date(2025, 0, 15, 14, 30);
      const { queryByText } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          timestamp={timestamp}
          showTimestamp={false}
        />,
      );

      expect(queryByText("2:30 PM")).toBeNull();
    });

    it("renders sender name for AI messages", () => {
      const { getByText } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="ai"
          senderName="Dr. Freud.AI"
        />,
      );

      expect(getByText("Dr. Freud.AI")).toBeTruthy();
    });
  });

  describe("Sequential Messages", () => {
    it("hides avatar for sequential messages", () => {
      const { queryByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="ai"
          showAvatar
          isSequential
        />,
      );

      expect(queryByTestId("chat-bubble-avatar")).toBeNull();
    });

    it("reduces spacing for sequential messages", () => {
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          isSequential
        />,
      );

      const container = getByTestId("chat-bubble");
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ marginTop: 2 })]),
      );
    });
  });

  describe("Message Status", () => {
    it("shows sending indicator", () => {
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          status="sending"
        />,
      );

      expect(getByTestId("chat-bubble-status")).toBeTruthy();
    });

    it("shows sent status", () => {
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          status="sent"
        />,
      );

      expect(getByTestId("chat-bubble-status")).toBeTruthy();
    });

    it("shows error status with different styling", () => {
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          status="error"
        />,
      );

      const status = getByTestId("chat-bubble-status");
      expect(status).toBeTruthy();
    });
  });

  describe("Emotion Detection", () => {
    it("renders emotion badge when emotion is provided", () => {
      const emotion: EmotionDetection = {
        emotions: ["Happy"],
        sentiment: "positive",
      };

      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          emotion={emotion}
        />,
      );

      expect(getByTestId("chat-bubble-emotion")).toBeTruthy();
    });

    it("displays emotion text", () => {
      const emotion: EmotionDetection = {
        emotions: ["Anger", "Despair"],
        sentiment: "negative",
      };

      const { getByText } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          emotion={emotion}
        />,
      );

      expect(getByText(/Emotion:/)).toBeTruthy();
    });

    it("uses correct color for positive sentiment", () => {
      const emotion: EmotionDetection = {
        emotions: ["Happy"],
        sentiment: "positive",
      };

      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          emotion={emotion}
        />,
      );

      const emotionBadge = getByTestId("chat-bubble-emotion");
      expect(emotionBadge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#9AAD5C" }),
        ]),
      );
    });

    it("uses correct color for crisis sentiment", () => {
      const emotion: EmotionDetection = {
        emotions: ["Suicidal"],
        sentiment: "crisis",
      };

      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          emotion={emotion}
        />,
      );

      const emotionBadge = getByTestId("chat-bubble-emotion");
      expect(emotionBadge.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ backgroundColor: "#EF4444" }),
        ]),
      );
    });
  });

  describe("Reactions", () => {
    it("renders reactions when provided", () => {
      const reactions = [
        { emoji: "👍", count: 2, isSelected: false },
        { emoji: "❤️", count: 1, isSelected: true },
      ];

      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          reactions={reactions}
        />,
      );

      expect(getByTestId("chat-bubble-reactions")).toBeTruthy();
    });

    it("calls onReactionPress when reaction is tapped", () => {
      const reactions = [{ emoji: "👍", count: 2, isSelected: false }];

      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          reactions={reactions}
          onReactionPress={mockOnReactionPress}
        />,
      );

      fireEvent.press(getByTestId("chat-bubble-reaction-👍"));
      expect(mockOnReactionPress).toHaveBeenCalledWith("👍");
    });
  });

  describe("Attachments", () => {
    it("renders image attachment", () => {
      const attachments: MessageAttachment[] = [
        {
          id: "1",
          type: "image",
          url: "https://example.com/image.jpg",
          thumbnail: "https://example.com/thumb.jpg",
        },
      ];

      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Check this out"
          sender="user"
          attachments={attachments}
        />,
      );

      expect(getByTestId("chat-bubble-attachment-1")).toBeTruthy();
    });

    it("calls onAttachmentPress when attachment is tapped", () => {
      const attachments: MessageAttachment[] = [
        {
          id: "1",
          type: "image",
          url: "https://example.com/image.jpg",
        },
      ];

      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Check this out"
          sender="user"
          attachments={attachments}
          onAttachmentPress={mockOnAttachmentPress}
        />,
      );

      fireEvent.press(getByTestId("chat-bubble-attachment-1"));
      expect(mockOnAttachmentPress).toHaveBeenCalledWith(attachments[0]);
    });
  });

  describe("Interactions", () => {
    it("calls onLongPress when bubble is long pressed", () => {
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          onLongPress={mockOnLongPress}
        />,
      );

      fireEvent(getByTestId("chat-bubble-content"), "onLongPress");
      expect(mockOnLongPress).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label", () => {
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          accessibilityLabel="User message: Hello"
        />,
      );

      const bubble = getByTestId("chat-bubble");
      expect(bubble.props.accessibilityLabel).toBe("User message: Hello");
    });

    it("has accessible role", () => {
      const { getByTestId } = render(
        <ChatBubble testID="chat-bubble" message="Hello" sender="user" />,
      );

      const content = getByTestId("chat-bubble-content");
      expect(content.props.accessible).toBe(true);
    });
  });

  describe("Styling", () => {
    it("applies user message styling", () => {
      const { getByTestId } = render(
        <ChatBubble testID="chat-bubble" message="Hello" sender="user" />,
      );

      const content = getByTestId("chat-bubble-content");
      // User messages have tan/brown background
      expect(content.props.style).toEqual(
        expect.objectContaining({ backgroundColor: "#C4A574" }),
      );
    });

    it("applies AI message styling", () => {
      const { getByTestId } = render(
        <ChatBubble testID="chat-bubble" message="Hello" sender="ai" />,
      );

      const content = getByTestId("chat-bubble-content");
      // AI messages have darker background
      expect(content.props.style).toEqual(
        expect.objectContaining({ backgroundColor: "#334155" }),
      );
    });

    it("applies custom style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <ChatBubble
          testID="chat-bubble"
          message="Hello"
          sender="user"
          style={customStyle}
        />,
      );

      const bubble = getByTestId("chat-bubble");
      expect(bubble.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });
  });

  describe("Custom Children", () => {
    it("renders custom children inside bubble", () => {
      const { getByTestId } = render(
        <ChatBubble testID="chat-bubble" message="Hello" sender="ai">
          <></>
        </ChatBubble>,
      );

      expect(getByTestId("chat-bubble")).toBeTruthy();
    });
  });
});

// Helper function tests
describe("ChatBubble Helper Functions", () => {
  describe("formatTimestamp", () => {
    it("formats AM time correctly", () => {
      const date = new Date(2025, 0, 15, 9, 30);
      expect(formatTimestamp(date)).toBe("9:30 AM");
    });

    it("formats PM time correctly", () => {
      const date = new Date(2025, 0, 15, 14, 45);
      expect(formatTimestamp(date)).toBe("2:45 PM");
    });

    it("formats 12:00 PM correctly", () => {
      const date = new Date(2025, 0, 15, 12, 0);
      expect(formatTimestamp(date)).toBe("12:00 PM");
    });

    it("formats 12:00 AM (midnight) correctly", () => {
      const date = new Date(2025, 0, 15, 0, 0);
      expect(formatTimestamp(date)).toBe("12:00 AM");
    });

    it("pads single digit minutes", () => {
      const date = new Date(2025, 0, 15, 10, 5);
      expect(formatTimestamp(date)).toBe("10:05 AM");
    });
  });

  describe("getStatusIcon", () => {
    it("returns clock for sending", () => {
      expect(getStatusIcon("sending")).toBe("clock");
    });

    it("returns check for sent", () => {
      expect(getStatusIcon("sent")).toBe("check");
    });

    it("returns check-all for delivered", () => {
      expect(getStatusIcon("delivered")).toBe("check-all");
    });

    it("returns check-all for read", () => {
      expect(getStatusIcon("read")).toBe("check-all");
    });

    it("returns alert-circle for error", () => {
      expect(getStatusIcon("error")).toBe("alert-circle");
    });
  });

  describe("getEmotionColor", () => {
    it("returns green for positive", () => {
      expect(getEmotionColor("positive")).toBe("#9AAD5C");
    });

    it("returns orange for negative", () => {
      expect(getEmotionColor("negative")).toBe("#E8853A");
    });

    it("returns gray for neutral", () => {
      expect(getEmotionColor("neutral")).toBe("#94A3B8");
    });

    it("returns red for crisis", () => {
      expect(getEmotionColor("crisis")).toBe("#EF4444");
    });
  });
});
