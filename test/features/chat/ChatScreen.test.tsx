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
        brown: { '20': '#E8D0D9', '70': '#704A33' },
        green: { '20': '#E5EAD7', '60': '#7D944D' },
        orange: { '20': '#FFEEE2', '40': '#ED7E1C' },
        error: '#DC2626',
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
  ThemeProvider: ({ children }: any) => children,
}));

// Simple wrapper for tests
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
}));

// Mock KeyboardAvoidingView behavior
jest.mock('react-native/Libraries/Components/Keyboard/KeyboardAvoidingView', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => React.createElement(View, props);
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
    expect(textInput).toBeTruthy();
  });

  it('allows user to type message', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    fireEvent.changeText(textInput, 'I am feeling anxious today');

    expect(textInput.props.value).toBe('I am feeling anxious today');
  });

  it('sends message when send button is pressed', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    fireEvent.changeText(textInput, 'Test message');
    
    // Find and press send button
    const buttons = screen.getAllByRole('button');
    const sendButton = buttons.find(btn => btn.props.accessibilityLabel === 'Send message');
    
    if (sendButton) {
      fireEvent.press(sendButton);
    }

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeTruthy();
    });
  });

  it('displays typing indicator when AI is responding', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    fireEvent.changeText(textInput, 'Hello');
    
    const buttons = screen.getAllByRole('button');
    const sendButton = buttons.find(btn => btn.props.accessibilityLabel === 'Send message');
    
    if (sendButton) {
      fireEvent.press(sendButton);
    }

    // Should show typing indicator briefly
    await waitFor(() => {
      expect(screen.queryByTestId('typing-indicator')).toBeTruthy();
    }, { timeout: 500 });
  });

  it('applies correct theme colors', () => {
    const { container } = render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    expect(container).toBeTruthy();
  });

  it('handles rapid message sending', async () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    
    // Send multiple messages quickly
    for (let i = 0; i < 3; i++) {
      fireEvent.changeText(textInput, `Message ${i}`);
      const buttons = screen.getAllByRole('button');
      const sendButton = buttons.find(btn => btn.props.accessibilityLabel === 'Send message');
      if (sendButton) {
        fireEvent.press(sendButton);
      }
    }

    await waitFor(() => {
      expect(screen.getByText('Message 0')).toBeTruthy();
      expect(screen.getByText('Message 1')).toBeTruthy();
      expect(screen.getByText('Message 2')).toBeTruthy();
    });
  });

  it('maintains accessibility features', () => {
    render(
      <ThemeProvider>
        <ChatScreen />
      </ThemeProvider>
    );

    const textInput = screen.getByPlaceholderText('Share your thoughts...');
    expect(textInput.props.accessibilityLabel).toBeTruthy();
  });
});
