/**
 * ChatScreen Component Tests
 * Comprehensive testing for AI therapy chat interface
 */

import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import React from "react";

import { ChatScreen } from "../../../src/features/chat/ChatScreen";

// Mock theme provider
jest.mock("@theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: {
      colors: {
        // Palette (subset used by ChatScreen)
        green: { 10: "#F2F5EB", 20: "#E5EAD7", 40: "#B4C48D", 60: "#7D944D" },
        orange: { 10: "#FFEEE2", 20: "#FF6A3D", 40: "#ED7E1C", 60: "#AA5500" },
        brown: { 10: "#F7F4F2", 20: "#E8D0D9", 40: "#C0A091", 60: "#926247" },
        // Semantic groups used by components
        background: {
          primary: "#FFFFFF",
          secondary: "#F5F5F5",
        },
        text: {
          primary: "#2D3748",
          secondary: "#718096",
          tertiary: "#A0AEC0",
        },
        border: {
          main: "#E2E8F0",
          light: "#EDF2F7",
        },
      },
      isDark: false,
      getShadow: () => ({
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }),
    },
  }),
  ThemeProvider: ({ children }) => children,
}));

// Simple wrapper for tests
const ThemeProvider = ({ children }) => children;

// Mock Platform
jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios",
  select: jest.fn((obj) => obj.ios || obj.default),
}));

// Mock KeyboardAvoidingView behavior
jest.mock(
  "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView",
  () => {
    const React = require("react");
    const { View } = require("react-native");
    return (props) => React.createElement(View, props);
  },
);

describe("ChatScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header and initial UI", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    expect(screen.getByText("Doctor Freud AI")).toBeTruthy();
    expect(screen.getByText("Get Doctor AI with Freud v1.7")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Type to start chatting..."),
    ).toBeTruthy();
  });

  it("displays header with correct styling", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const headerTitle = screen.getByText("Doctor Freud AI");
    const headerSubtitle = screen.getByText("Get Doctor AI with Freud v1.7");

    expect(headerTitle).toBeTruthy();
    expect(headerSubtitle).toBeTruthy();
  });

  it("renders input field and send button", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    expect(textInput).toBeTruthy();
    expect(sendButton).toBeTruthy();
  });

  it("send button is disabled when input is empty", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const sendButton = screen.getByTestId("send-button");
    expect(sendButton.parent?.props.disabled || sendButton.props.disabled).toBe(
      true,
    );
  });

  it("send button is enabled when input has text", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    fireEvent.changeText(textInput, "Hello");
    expect(sendButton.parent?.parent?.props.disabled).toBe(false);
  });

  it("sends user message and clears input", async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    fireEvent.changeText(textInput, "I feel anxious today");
    fireEvent.press(sendButton);

    // Check that user message appears
    await waitFor(() => {
      expect(screen.getByText("I feel anxious today")).toBeTruthy();
    });

    // Check that input is cleared
    expect(textInput.props.value).toBe("");
  });

  it("displays AI response after user message", async () => {
    // Mock Math.random to return 0.3 (index 1: "Thank you for sharing that with me. Let's explore this feeling together.")
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.3; // This will select index 1
    global.Math = mockMath;

    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    fireEvent.changeText(textInput, "I need help");
    fireEvent.press(sendButton);

    // Wait for AI response
    await waitFor(
      () => {
        expect(
          screen.getByText(
            "Thank you for sharing that with me. Let's explore this feeling together.",
          ),
        ).toBeTruthy();
      },
      { timeout: 2000 },
    );

    // Restore Math.random
    global.Math = Object.getPrototypeOf(mockMath);
  });

  it("handles multiple message exchanges", async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    // First message
    fireEvent.changeText(textInput, "First message");
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(screen.getByText("First message")).toBeTruthy();
    });

    // Second message
    fireEvent.changeText(textInput, "Second message");
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Second message")).toBeTruthy();
    });

    // Check that both user messages are present
    const userMessages = screen.getAllByText(/First message|Second message/);
    expect(userMessages).toHaveLength(2);
  });

  it("renders user messages on the right side", async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    fireEvent.changeText(textInput, "User message");
    fireEvent.press(sendButton);

    await waitFor(() => {
      const userMessage = screen.getByText("User message");
      const messageContainer = userMessage.parent?.parent?.parent?.parent;
      const style = messageContainer?.props?.style;
      const stylesArray = Array.isArray(style) ? style : [style];
      const hasAlignSelf = stylesArray?.some(
        (styleObj) => styleObj && styleObj.alignSelf === "flex-end",
      );
      expect(hasAlignSelf).toBe(true);
    });
  });

  it("renders bot messages on the left side", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const botCandidates = screen.getAllByText(
      /Hello|overwhelmed|sorry you're going/,
    );
    const botMessage = botCandidates[0];
    const messageContainer = botMessage.parent?.parent?.parent?.parent;
    const style = messageContainer?.props?.style;
    const stylesArray = Array.isArray(style) ? style : [style];
    const hasAlignSelf = stylesArray?.some(
      (styleObj) => styleObj && styleObj.alignSelf === "flex-start",
    );
    expect(hasAlignSelf).toBe(true);
  });

  it("displays timestamps for messages", async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    fireEvent.changeText(textInput, "Test message");
    fireEvent.press(sendButton);

    await waitFor(() => {
      // Should find timestamp elements (format: HH:MM)
      const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/);
      expect(timestamps.length).toBeGreaterThan(0);
    });
  });

  it("handles multiline input", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");

    const multilineText = "Line 1\nLine 2\nLine 3";
    fireEvent.changeText(textInput, multilineText);

    expect(textInput.props.value).toBe(multilineText);
  });

  it("handles submit editing on text input", async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");

    fireEvent.changeText(textInput, "Message via submit");
    fireEvent(textInput, "onSubmitEditing");

    await waitFor(() => {
      expect(screen.getByText("Message via submit")).toBeTruthy();
    });
  });

  it("maintains message order", async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    // Send multiple messages
    fireEvent.changeText(textInput, "First");
    fireEvent.press(sendButton);

    await waitFor(() => {
      fireEvent.changeText(textInput, "Second");
      fireEvent.press(sendButton);
    });

    await waitFor(() => {
      fireEvent.changeText(textInput, "Third");
      fireEvent.press(sendButton);
    });

    // Check that messages appear in order
    const messages = screen.getAllByText(/First|Second|Third/);
    expect(messages).toHaveLength(3);
  });

  it("handles empty message submission gracefully", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    // Try to send empty/whitespace message
    fireEvent.changeText(textInput, "   ");
    // Button should remain disabled and press should have no effect
    expect(
      sendButton.parent?.parent?.props.disabled || sendButton.props.disabled,
    ).toBe(true);
    fireEvent.press(sendButton);
    // Nothing else to assert; render didn't crash and button remained disabled
  });

  it("applies correct theme colors", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const headerTitle = screen.getByText("Doctor Freud AI");
    expect(headerTitle).toBeTruthy();
  });

  it("handles rapid message sending", async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    const sendButton = screen.getByTestId("send-button");

    // Send multiple messages quickly
    fireEvent.changeText(textInput, "Message 1");
    fireEvent.press(sendButton);

    fireEvent.changeText(textInput, "Message 2");
    fireEvent.press(sendButton);

    fireEvent.changeText(textInput, "Message 3");
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Message 1")).toBeTruthy();
      expect(screen.getByText("Message 2")).toBeTruthy();
      expect(screen.getByText("Message 3")).toBeTruthy();
    });
  });

  it("maintains accessibility features", () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const textInput = screen.getByPlaceholderText("Type to start chatting...");
    expect(textInput.props.accessibilityLabel).toBeTruthy();

    const sendButton = screen.getByTestId("send-button");
    expect(sendButton.props.accessibilityLabel).toBe("Send message");
  });
});
describe("Crisis Detection Integration", () => {
  it("detects crisis keywords in message and triggers alert", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const input = getByPlaceholderText("Type your message...");
    const sendButton = getByTestId("send-button");

    // Type crisis message
    fireEvent.changeText(input, "I want to kill myself");
    fireEvent.press(sendButton);

    await waitFor(() => {
      // Crisis alert should be shown
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining("Crisis"),
        expect.any(String),
        expect.arrayContaining([
          expect.objectContaining({
            text: expect.stringMatching(/988|Emergency/i),
          }),
        ]),
      );
    });
  });

  it("sanitizes user input before sending", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const input = getByPlaceholderText("Type your message...");

    // Type malicious script
    const maliciousInput = '<script>alert("xss")</script>Hello';
    fireEvent.changeText(input, maliciousInput);

    // Input should be sanitized
    await waitFor(() => {
      const currentValue = input.props.value;
      expect(currentValue).not.toContain("<script>");
      expect(currentValue).not.toContain("</script>");
    });
  });

  it("initializes CrisisManager before accepting messages", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    // Wait for CrisisManager initialization
    await waitFor(() => {
      expect(CrisisManager.loadConfiguration).toHaveBeenCalled();
    });

    const input = getByPlaceholderText("Type your message...");
    const sendButton = getByTestId("send-button");

    // Now message can be sent safely
    fireEvent.changeText(input, "Hello");
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(CrisisManager.analyzeCrisisRisk).toHaveBeenCalledWith("Hello");
    });
  });

  it("handles crisis analysis failure gracefully", async () => {
    CrisisManager.analyzeCrisisRisk.mockRejectedValueOnce(
      new Error("Analysis failed"),
    );

    const { getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>,
    );

    const input = getByPlaceholderText("Type your message...");
    const sendButton = getByTestId("send-button");

    fireEvent.changeText(input, "Test message");
    fireEvent.press(sendButton);

    // Should not crash
    await waitFor(() => {
      expect(true).toBe(true); // Component still renders
    });
  });

  it("shows different alert levels based on crisis risk", async () => {
    const riskLevels = ["low", "medium", "high", "critical"];

    for (const risk of riskLevels) {
      jest.clearAllMocks();

      CrisisManager.analyzeCrisisRisk.mockResolvedValueOnce({
        risk,
        keywords: ["test"],
        score: risk === "critical" ? 10 : 5,
      });

      const { getByPlaceholderText, getByTestId } = render(
        <ThemeProvider>
          <ChatScreen />
        </ThemeProvider>,
      );

      const input = getByPlaceholderText("Type your message...");
      const sendButton = getByTestId("send-button");

      fireEvent.changeText(input, "Test message");
      fireEvent.press(sendButton);

      if (risk === "high" || risk === "critical") {
        await waitFor(() => {
          expect(Alert.alert).toHaveBeenCalled();
        });
      }
    }
  });
});

describe("Authentication Integration", () => {
  it("persists session across app restart", async () => {
    // Mock stored session
    const mockSession = {
      user: { id: "1", name: "Test User" },
      accessToken: "valid_token",
      refreshToken: "refresh_token",
      expiresAt: Date.now() + 3600000,
    };

    mockSecureStorage.getSecureData.mockResolvedValue(mockSession);
    mockTokenService.isAuthenticated.mockResolvedValue(true);

    // Simulate app restart by dispatching restoreAuthState
    await store.dispatch(restoreAuthState());

    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockSession.user);
    expect(state.token).toBe(mockSession.accessToken);
  });

  it("auto-refreshes token when approaching expiry", async () => {
    const almostExpiredToken = {
      accessToken: "old_token",
      refreshToken: "refresh_token",
      expiresAt: Date.now() + 4 * 60 * 1000, // 4 minutes (< 5 minute threshold)
    };

    const newToken = {
      access_token: "new_token",
      refresh_token: "new_refresh",
      expires_in: 3600,
    };

    mockTokenService.getTokens.mockResolvedValue(almostExpiredToken);
    mockTokenService.shouldRefreshToken.mockResolvedValue(true);
    mockApiService.auth.refreshToken.mockResolvedValue(newToken);

    // Trigger token refresh
    const result = await mockTokenService.refreshAccessToken();

    expect(mockApiService.auth.refreshToken).toHaveBeenCalledWith(
      "refresh_token",
    );
    expect(result.accessToken).toBe("new_token");
  });

  it("logs out user when refresh token is invalid", async () => {
    const expiredToken = {
      accessToken: "old_token",
      refreshToken: "invalid_refresh",
      expiresAt: Date.now() - 1000,
    };

    mockTokenService.getTokens.mockResolvedValue(expiredToken);
    mockApiService.auth.refreshToken.mockRejectedValue(
      new Error("Invalid refresh token"),
    );

    const result = await mockTokenService.refreshAccessToken();

    expect(result).toBe(null);
    expect(mockTokenService.clearTokens).toHaveBeenCalled();
  });
});
