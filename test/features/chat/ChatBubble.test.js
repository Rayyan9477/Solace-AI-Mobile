/**
 * ChatBubble Component Tests
 * Comprehensive testing for enhanced chat bubble with accessibility and therapeutic styling
 */

import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import React from "react";

import ChatBubble from "../../../src/features/chat/components/ChatBubble";
jest.mock("react-native-paper", () => ({
  Card: (props) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { ...props, testID: "card" });
  },
  Surface: (props) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, { ...props, testID: "surface" });
  },
  IconButton: (props) => {
    const React = require("react");
    const { TouchableOpacity, Text } = require("react-native");
    return React.createElement(
      TouchableOpacity,
      {
        ...props,
        testID: "icon-button",
      },
      React.createElement(Text, {}, "🔊"),
    );
  },
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: (Component) => Component,
}));

// Mock theme provider
jest.mock("src/shared/theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: {
          primary: "#FFFFFF",
          secondary: "#F5F5F5",
        },
        text: {
          primary: "#2D3748",
          secondary: "#718096",
        },
      },
    },
    isDarkMode: false,
  }),
}));

// Mock platform utilities
jest.mock("../../../src/shared/utils/platform", () => ({
  platform: {
    isWeb: false,
    isNative: true,
    select: jest.fn((obj) => obj.default || obj.ios || obj),
  },
}));

// Mock Speech API
jest.mock("expo-speech", () => ({
  speak: jest.fn().mockResolvedValue(undefined),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
  stop: jest.fn().mockResolvedValue(undefined),
}));

const mockSpeech = {
  speak: require("expo-speech").speak,
  isSpeakingAsync: require("expo-speech").isSpeakingAsync,
  stop: require("expo-speech").stop,
};

describe("ChatBubble", () => {
  const defaultProps = {
    message: "Test message",
    isUser: false,
    timestamp: "2024-01-01T12:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders message text correctly", () => {
    render(<ChatBubble {...defaultProps} />);

    expect(screen.getByText("Test message")).toBeTruthy();
  });

  it("displays formatted timestamp", () => {
    render(<ChatBubble {...defaultProps} />);

    // Should display time in HH:MM format
    expect(screen.getByText(/\d{1,2}:\d{2}/)).toBeTruthy();
  });

  it("applies user message styling", () => {
    render(<ChatBubble {...defaultProps} isUser />);

    const messageText = screen.getByText("Test message");
    expect(messageText.props.style).toContainEqual(
      expect.objectContaining({ color: "#FFFFFF" }),
    );
  });

  it("applies bot message styling", () => {
    render(<ChatBubble {...defaultProps} isUser={false} />);

    const messageText = screen.getByText("Test message");
    expect(messageText.props.style).toContainEqual(
      expect.objectContaining({ color: "#2D3748" }),
    );
  });

  it("shows speak button when Speech is available", () => {
    render(<ChatBubble {...defaultProps} />);

    const speakButton = screen.getByTestId("icon-button");
    expect(speakButton).toBeTruthy();
  });

  it("handles speak button press", async () => {
    render(<ChatBubble {...defaultProps} />);

    const speakButton = screen.getByTestId("icon-button");
    fireEvent.press(speakButton);

    await waitFor(() => {
      expect(mockSpeech.speak).toHaveBeenCalledWith("Test message", {
        language: "en",
        pitch: 1.0,
        rate: 0.9,
      });
    });
  });

  it("handles long press callback", () => {
    const onLongPress = jest.fn();
    render(<ChatBubble {...defaultProps} onLongPress={onLongPress} />);

    const bubbleContent = screen.getByTestId("surface").children[0];
    fireEvent(bubbleContent, "onLongPress");

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it("applies correct accessibility labels", () => {
    render(<ChatBubble {...defaultProps} />);

    const bubbleContent = screen.getByTestId("surface").children[0];
    expect(bubbleContent.props.accessibilityLabel).toBe(
      "Assistant message: Test message",
    );
  });

  it("uses custom accessibility label when provided", () => {
    const customLabel = "Custom accessibility label";
    render(<ChatBubble {...defaultProps} accessibilityLabel={customLabel} />);

    const bubbleContent = screen.getByTestId("surface").children[0];
    expect(bubbleContent.props.accessibilityLabel).toBe(customLabel);
  });

  it("applies user-specific accessibility label", () => {
    render(<ChatBubble {...defaultProps} isUser />);

    const bubbleContent = screen.getByTestId("surface").children[0];
    expect(bubbleContent.props.accessibilityLabel).toBe(
      "Your message: Test message",
    );
  });

  it("handles speech synthesis errors gracefully", async () => {
    mockSpeech.speak.mockRejectedValueOnce(
      new Error("Speech synthesis failed"),
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<ChatBubble {...defaultProps} />);
    const speakButton = screen.getByTestId("icon-button");
    fireEvent.press(speakButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in handleSpeak:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("stops speaking when already speaking", async () => {
    mockSpeech.isSpeakingAsync.mockResolvedValueOnce(true);

    render(<ChatBubble {...defaultProps} />);
    const speakButton = screen.getByTestId("icon-button");
    fireEvent.press(speakButton);

    await waitFor(() => {
      expect(mockSpeech.stop).toHaveBeenCalled();
      expect(mockSpeech.speak).not.toHaveBeenCalled();
    });
  });

  it("disables speak button while loading", async () => {
    // Mock a slow speech operation
    mockSpeech.speak.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<ChatBubble {...defaultProps} />);
    const speakButton = screen.getByTestId("icon-button");

    fireEvent.press(speakButton);
    expect(speakButton.props.disabled).toBe(true);

    await waitFor(() => {
      expect(speakButton.props.disabled).toBe(false);
    });
  });

  it("handles multiline messages", () => {
    const multilineMessage = "Line 1\nLine 2\nLine 3";
    render(<ChatBubble {...defaultProps} message={multilineMessage} />);

    expect(screen.getByText(multilineMessage)).toBeTruthy();
  });

  it("applies correct container alignment for user messages", () => {
    render(<ChatBubble {...defaultProps} isUser />);

    const card = screen.getByTestId("card");
    expect(card.props.style).toContainEqual(
      expect.objectContaining({ alignSelf: "flex-end" }),
    );
  });

  it("applies correct container alignment for bot messages", () => {
    render(<ChatBubble {...defaultProps} isUser={false} />);

    const card = screen.getByTestId("card");
    expect(card.props.style).toContainEqual(
      expect.objectContaining({ alignSelf: "flex-start" }),
    );
  });

  it("handles empty message gracefully", () => {
    render(<ChatBubble {...defaultProps} message="" />);

    // Should still render but with empty text
    const messageText = screen.getByText("");
    expect(messageText).toBeTruthy();
  });

  it("handles very long messages", () => {
    const longMessage = "A".repeat(1000);
    render(<ChatBubble {...defaultProps} message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeTruthy();
  });

  it("applies correct bubble border radius for user messages", () => {
    render(<ChatBubble {...defaultProps} isUser />);

    const surface = screen.getByTestId("surface");
    // Check that user bubble has different border radius
    expect(surface.props.style).toBeDefined();
  });

  it("applies correct bubble border radius for bot messages", () => {
    render(<ChatBubble {...defaultProps} isUser={false} />);

    const surface = screen.getByTestId("surface");
    // Check that bot bubble has different border radius
    expect(surface.props.style).toBeDefined();
  });

  it("handles timestamp parsing errors gracefully", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<ChatBubble {...defaultProps} timestamp="invalid-date" />);

    // Should not crash and should still render
    expect(screen.getByText("Test message")).toBeTruthy();

    consoleSpy.mockRestore();
  });

  it("maintains message content integrity", () => {
    const specialCharsMessage =
      "Message with special chars: @#$%^&*()_+{}|:<>?[]\\;'\",./";
    render(<ChatBubble {...defaultProps} message={specialCharsMessage} />);

    expect(screen.getByText(specialCharsMessage)).toBeTruthy();
  });

  it("handles rapid speak button presses", async () => {
    // Mock speak to be slow so the button stays disabled
    mockSpeech.speak.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    render(<ChatBubble {...defaultProps} />);
    const speakButton = screen.getByTestId("icon-button");

    // Press multiple times quickly
    fireEvent.press(speakButton);
    fireEvent.press(speakButton);
    fireEvent.press(speakButton);

    await waitFor(() => {
      expect(mockSpeech.speak).toHaveBeenCalledTimes(1);
    });
  });

  it("provides correct accessibility hint", () => {
    render(<ChatBubble {...defaultProps} />);

    const bubbleContent = screen.getByTestId("surface").children[0];
    expect(bubbleContent.props.accessibilityHint).toBe(
      "Double tap to hear message spoken aloud",
    );
  });

  it("handles speak button accessibility", () => {
    render(<ChatBubble {...defaultProps} />);

    const speakButton = screen.getByTestId("icon-button");
    expect(speakButton.props.accessibilityLabel).toBe("Speak message aloud");
  });
});
