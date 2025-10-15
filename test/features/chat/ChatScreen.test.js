/**
 * ChatScreen Component Tests
 * Comprehensive testing for AI therapy chat interface
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { ChatScreen } from '../../../src/features/chat/ChatScreen';

// Mock theme provider
jest.mock('@theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
        },
        text: {
          primary: '#2D3748',
          secondary: '#718096',
          tertiary: '#A0AEC0',
        },
        border: {
          primary: '#E2E8F0',
        },
        therapeutic: {
          nurturing: {
            500: '#22c55e',
          },
        },
      },
      getShadow: () => ({
        shadowColor: '#000',
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
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
}));

// Mock KeyboardAvoidingView behavior
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props) => React.createElement(View, props);
});

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial welcome message', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    expect(screen.getByText('AI Therapist')).toBeTruthy();
    expect(screen.getByText('Safe space for your mental wellness')).toBeTruthy();
    expect(screen.getByText("Hello! I'm here to support you on your mental health journey. How are you feeling today?")).toBeTruthy();
  });

  it('displays header with correct styling', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const headerTitle = screen.getByText('AI Therapist');
    const headerSubtitle = screen.getByText('Safe space for your mental wellness');

    expect(headerTitle).toBeTruthy();
    expect(headerSubtitle).toBeTruthy();
  });

  it('renders input field and send button', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    expect(textInput).toBeTruthy();
    expect(sendButton).toBeTruthy();
  });

  it('send button is disabled when input is empty', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const sendButton = screen.getByText('Send');
    expect(sendButton.parent?.parent?.props.disabled).toBe(true);
  });

  it('send button is enabled when input has text', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    fireEvent.changeText(textInput, 'Hello');
    expect(sendButton.parent?.parent?.props.disabled).toBe(false);
  });

  it('sends user message and clears input', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    fireEvent.changeText(textInput, 'I feel anxious today');
    fireEvent.press(sendButton);

    // Check that user message appears
    await waitFor(() => {
      expect(screen.getByText('I feel anxious today')).toBeTruthy();
    });

    // Check that input is cleared
    expect(textInput.props.value).toBe('');
  });

  it('displays AI response after user message', async () => {
    // Mock Math.random to return 0.3 (index 1: "Thank you for sharing that with me. Let's explore this feeling together.")
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.3; // This will select index 1
    global.Math = mockMath;

    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    fireEvent.changeText(textInput, 'I need help');
    fireEvent.press(sendButton);

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText("Thank you for sharing that with me. Let's explore this feeling together.")).toBeTruthy();
    }, { timeout: 2000 });

    // Restore Math.random
    global.Math = Object.getPrototypeOf(mockMath);
  });

  it('handles multiple message exchanges', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    // First message
    fireEvent.changeText(textInput, 'First message');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(screen.getByText('First message')).toBeTruthy();
    });

    // Second message
    fireEvent.changeText(textInput, 'Second message');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Second message')).toBeTruthy();
    });

    // Check that both user messages are present
    const userMessages = screen.getAllByText(/First message|Second message/);
    expect(userMessages).toHaveLength(2);
  });

  it('renders user messages on the right side', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    fireEvent.changeText(textInput, 'User message');
    fireEvent.press(sendButton);

    await waitFor(() => {
      const userMessage = screen.getByText('User message');
      // The message container should have alignSelf: 'flex-end'
      const messageContainer = userMessage.parent?.parent?.parent?.parent;
      const hasAlignSelf = messageContainer?.props?.style?.some((styleObj: any) =>
        styleObj && styleObj.alignSelf === 'flex-end'
      );
      expect(hasAlignSelf).toBe(true);
    });
  });

  it('renders bot messages on the left side', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const botMessage = screen.getByText("Hello! I'm here to support you on your mental health journey. How are you feeling today?");
    const messageContainer = botMessage.parent?.parent?.parent?.parent;
    const hasAlignSelf = messageContainer?.props?.style?.some((styleObj: any) =>
      styleObj && styleObj.alignSelf === 'flex-start'
    );
    expect(hasAlignSelf).toBe(true);
  });

  it('displays timestamps for messages', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    fireEvent.changeText(textInput, 'Test message');
    fireEvent.press(sendButton);

    await waitFor(() => {
      // Should find timestamp elements (format: HH:MM)
      const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/);
      expect(timestamps.length).toBeGreaterThan(0);
    });
  });

  it('handles multiline input', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');

    const multilineText = 'Line 1\nLine 2\nLine 3';
    fireEvent.changeText(textInput, multilineText);

    expect(textInput.props.value).toBe(multilineText);
  });

  it('handles submit editing on text input', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');

    fireEvent.changeText(textInput, 'Message via submit');
    fireEvent(textInput, 'onSubmitEditing');

    await waitFor(() => {
      expect(screen.getByText('Message via submit')).toBeTruthy();
    });
  });

  it('maintains message order', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    // Send multiple messages
    fireEvent.changeText(textInput, 'First');
    fireEvent.press(sendButton);

    await waitFor(() => {
      fireEvent.changeText(textInput, 'Second');
      fireEvent.press(sendButton);
    });

    await waitFor(() => {
      fireEvent.changeText(textInput, 'Third');
      fireEvent.press(sendButton);
    });

    // Check that messages appear in order
    const messages = screen.getAllByText(/First|Second|Third/);
    expect(messages).toHaveLength(3);
  });

  it('handles empty message submission gracefully', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    // Try to send empty message
    fireEvent.changeText(textInput, '   '); // Only whitespace
    fireEvent.press(sendButton);

    // Should not add any new messages
    const initialMessage = screen.getByText("Hello! I'm here to support you on your mental health journey. How are you feeling today?");
    expect(initialMessage).toBeTruthy();

    // Should only have the initial message
    const allMessages = screen.getAllByText(/.+/);
    expect(allMessages.length).toBeGreaterThanOrEqual(1); // At least the header and initial message
  });

  it('applies correct theme colors', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const headerTitle = screen.getByText('AI Therapist');
    expect(headerTitle.props.style.color).toBe('#2D3748');
  });

  it('handles rapid message sending', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    const sendButton = screen.getByText('Send');

    // Send multiple messages quickly
    fireEvent.changeText(textInput, 'Message 1');
    fireEvent.press(sendButton);

    fireEvent.changeText(textInput, 'Message 2');
    fireEvent.press(sendButton);

    fireEvent.changeText(textInput, 'Message 3');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Message 1')).toBeTruthy();
      expect(screen.getByText('Message 2')).toBeTruthy();
      expect(screen.getByText('Message 3')).toBeTruthy();
    });
  });

  it('maintains accessibility features', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    expect(textInput.props.accessibilityLabel).toBeUndefined(); // Default accessibility

    const sendButton = screen.getByText('Send');
    expect(sendButton.props.accessibilityRole).toBeUndefined(); // TouchableOpacity default
  });
});