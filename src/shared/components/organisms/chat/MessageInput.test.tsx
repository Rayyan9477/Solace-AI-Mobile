/**
 * MessageInput Component Tests
 * @description TDD tests for the MessageInput component
 * @task Task 2.7.3: MessageInput Component
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import { MessageInput } from "./MessageInput";
import type { InputAttachment } from "./MessageInput.types";
import { formatDuration, canSendMessage } from "./MessageInput.types";

describe("MessageInput", () => {
  const mockOnChangeText = jest.fn();
  const mockOnSend = jest.fn();
  const mockOnAttachmentPress = jest.fn();
  const mockOnVoicePress = jest.fn();
  const mockOnRemoveAttachment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = render(<MessageInput testID="message-input" />);

      expect(getByTestId("message-input")).toBeTruthy();
    });

    it("renders text input", () => {
      const { getByTestId } = render(<MessageInput testID="message-input" />);

      expect(getByTestId("message-input-field")).toBeTruthy();
    });

    it("renders placeholder text", () => {
      const { getByPlaceholderText } = render(
        <MessageInput
          testID="message-input"
          placeholder="Type to start chatting..."
        />,
      );

      expect(getByPlaceholderText("Type to start chatting...")).toBeTruthy();
    });

    it("renders custom placeholder", () => {
      const { getByPlaceholderText } = render(
        <MessageInput testID="message-input" placeholder="Send a message" />,
      );

      expect(getByPlaceholderText("Send a message")).toBeTruthy();
    });

    it("renders attachment button when showAttachment is true", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" showAttachment />,
      );

      expect(getByTestId("message-input-attachment-button")).toBeTruthy();
    });

    it("hides attachment button when showAttachment is false", () => {
      const { queryByTestId } = render(
        <MessageInput testID="message-input" showAttachment={false} />,
      );

      expect(queryByTestId("message-input-attachment-button")).toBeNull();
    });

    it("renders voice button when showVoice is true", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" showVoice />,
      );

      expect(getByTestId("message-input-voice-button")).toBeTruthy();
    });

    it("hides voice button when showVoice is false", () => {
      const { queryByTestId } = render(
        <MessageInput testID="message-input" showVoice={false} />,
      );

      expect(queryByTestId("message-input-voice-button")).toBeNull();
    });

    it("renders send button", () => {
      const { getByTestId } = render(<MessageInput testID="message-input" />);

      expect(getByTestId("message-input-send-button")).toBeTruthy();
    });
  });

  describe("Text Input", () => {
    it("displays current value", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" value="Hello" />,
      );

      const input = getByTestId("message-input-field");
      expect(input.props.value).toBe("Hello");
    });

    it("calls onChangeText when text changes", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" onChangeText={mockOnChangeText} />,
      );

      const input = getByTestId("message-input-field");
      fireEvent.changeText(input, "Hello world");

      expect(mockOnChangeText).toHaveBeenCalledWith("Hello world");
    });

    it("respects maxLength", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" maxLength={100} />,
      );

      const input = getByTestId("message-input-field");
      expect(input.props.maxLength).toBe(100);
    });

    it("supports multiline", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" multiline />,
      );

      const input = getByTestId("message-input-field");
      expect(input.props.multiline).toBe(true);
    });
  });

  describe("Send Message", () => {
    it("calls onSend when send button is pressed with text", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          value="Hello"
          onSend={mockOnSend}
        />,
      );

      fireEvent.press(getByTestId("message-input-send-button"));

      expect(mockOnSend).toHaveBeenCalledWith("Hello", undefined);
    });

    it("does not call onSend when message is empty", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" value="" onSend={mockOnSend} />,
      );

      fireEvent.press(getByTestId("message-input-send-button"));

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it("does not call onSend when message is only whitespace", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          value="   "
          onSend={mockOnSend}
        />,
      );

      fireEvent.press(getByTestId("message-input-send-button"));

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it("includes attachments when sending", () => {
      const attachments: InputAttachment[] = [
        { id: "1", type: "image", uri: "file://image.jpg" },
      ];

      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          value="Check this out"
          attachments={attachments}
          onSend={mockOnSend}
        />,
      );

      fireEvent.press(getByTestId("message-input-send-button"));

      expect(mockOnSend).toHaveBeenCalledWith("Check this out", attachments);
    });

    it("can send with only attachments (no text)", () => {
      const attachments: InputAttachment[] = [
        { id: "1", type: "image", uri: "file://image.jpg" },
      ];

      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          value=""
          attachments={attachments}
          onSend={mockOnSend}
        />,
      );

      fireEvent.press(getByTestId("message-input-send-button"));

      expect(mockOnSend).toHaveBeenCalledWith("", attachments);
    });
  });

  describe("Attachment Button", () => {
    it("calls onAttachmentPress when pressed", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          showAttachment
          onAttachmentPress={mockOnAttachmentPress}
        />,
      );

      fireEvent.press(getByTestId("message-input-attachment-button"));

      expect(mockOnAttachmentPress).toHaveBeenCalled();
    });
  });

  describe("Voice Button", () => {
    it("calls onVoicePress when pressed", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          showVoice
          onVoicePress={mockOnVoicePress}
        />,
      );

      fireEvent.press(getByTestId("message-input-voice-button"));

      expect(mockOnVoicePress).toHaveBeenCalled();
    });
  });

  describe("Attachments Display", () => {
    it("renders attachments preview", () => {
      const attachments: InputAttachment[] = [
        { id: "1", type: "image", uri: "file://image.jpg", name: "photo.jpg" },
      ];

      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          attachments={attachments}
        />,
      );

      expect(getByTestId("message-input-attachment-1")).toBeTruthy();
    });

    it("calls onRemoveAttachment when remove is pressed", () => {
      const attachments: InputAttachment[] = [
        { id: "1", type: "image", uri: "file://image.jpg" },
      ];

      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          attachments={attachments}
          onRemoveAttachment={mockOnRemoveAttachment}
        />,
      );

      fireEvent.press(getByTestId("message-input-attachment-1-remove"));

      expect(mockOnRemoveAttachment).toHaveBeenCalledWith("1");
    });
  });

  describe("Voice Recording State", () => {
    it("shows recording UI when recording", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          voiceRecordingState="recording"
          voiceRecordingDuration={5000}
        />,
      );

      expect(getByTestId("message-input-voice-recording")).toBeTruthy();
    });

    it("displays recording duration", () => {
      const { getByText } = render(
        <MessageInput
          testID="message-input"
          voiceRecordingState="recording"
          voiceRecordingDuration={65000}
        />,
      );

      expect(getByText("1:05")).toBeTruthy();
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled is true", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" disabled />,
      );

      const input = getByTestId("message-input-field");
      expect(input.props.editable).toBe(false);
    });

    it("disables send button when disabled", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" disabled onSend={mockOnSend} />,
      );

      fireEvent.press(getByTestId("message-input-send-button"));

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it("applies disabled styling", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" disabled />,
      );

      const container = getByTestId("message-input");
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })]),
      );
    });
  });

  describe("Custom Addons", () => {
    it("renders left addon", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          leftAddon={<Text testID="custom-left">Custom</Text>}
        />,
      );

      expect(getByTestId("custom-left")).toBeTruthy();
    });

    it("renders right addon", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          rightAddon={<Text testID="custom-right">Custom</Text>}
        />,
      );

      expect(getByTestId("custom-right")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility label for input", () => {
      const { getByTestId } = render(
        <MessageInput
          testID="message-input"
          accessibilityLabel="Message input field"
        />,
      );

      const input = getByTestId("message-input-field");
      expect(input.props.accessibilityLabel).toBe("Message input field");
    });

    it("send button has accessible label", () => {
      const { getByTestId } = render(<MessageInput testID="message-input" />);

      const sendButton = getByTestId("message-input-send-button");
      expect(sendButton.props.accessibilityLabel).toBe("Send message");
    });

    it("attachment button has accessible label", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" showAttachment />,
      );

      const attachButton = getByTestId("message-input-attachment-button");
      expect(attachButton.props.accessibilityLabel).toBe("Add attachment");
    });

    it("voice button has accessible label", () => {
      const { getByTestId } = render(
        <MessageInput testID="message-input" showVoice />,
      );

      const voiceButton = getByTestId("message-input-voice-button");
      expect(voiceButton.props.accessibilityLabel).toBe("Record voice message");
    });
  });

  describe("Styling", () => {
    it("applies custom container style", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <MessageInput testID="message-input" style={customStyle} />,
      );

      const container = getByTestId("message-input");
      expect(container.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)]),
      );
    });

    it("applies custom input style", () => {
      const customInputStyle = { fontSize: 18 };
      const { getByTestId } = render(
        <MessageInput testID="message-input" inputStyle={customInputStyle} />,
      );

      const input = getByTestId("message-input-field");
      expect(input.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customInputStyle)]),
      );
    });
  });
});

// Helper function tests
describe("MessageInput Helper Functions", () => {
  describe("formatDuration", () => {
    it("formats 0 milliseconds", () => {
      expect(formatDuration(0)).toBe("0:00");
    });

    it("formats seconds", () => {
      expect(formatDuration(5000)).toBe("0:05");
    });

    it("formats minutes and seconds", () => {
      expect(formatDuration(65000)).toBe("1:05");
    });

    it("formats longer durations", () => {
      expect(formatDuration(125000)).toBe("2:05");
    });

    it("pads seconds with leading zero", () => {
      expect(formatDuration(3000)).toBe("0:03");
    });
  });

  describe("canSendMessage", () => {
    it("returns true with non-empty text", () => {
      expect(canSendMessage("Hello")).toBe(true);
    });

    it("returns false with empty text", () => {
      expect(canSendMessage("")).toBe(false);
    });

    it("returns false with whitespace only", () => {
      expect(canSendMessage("   ")).toBe(false);
    });

    it("returns true with attachments and no text", () => {
      const attachments: InputAttachment[] = [
        { id: "1", type: "image", uri: "file://test.jpg" },
      ];
      expect(canSendMessage("", attachments)).toBe(true);
    });

    it("returns true with both text and attachments", () => {
      const attachments: InputAttachment[] = [
        { id: "1", type: "image", uri: "file://test.jpg" },
      ];
      expect(canSendMessage("Hello", attachments)).toBe(true);
    });

    it("returns false with empty attachments array", () => {
      expect(canSendMessage("", [])).toBe(false);
    });
  });
});
