/**
 * TherapySessionScreen - Active therapy session with AI chat
 * Integrates with therapySlice for session management
 */

import {
  startSession,
  endSession,
  addMessage,
  saveTherapySession,
  setSessionMood,
  selectCurrentSession,
  selectIsSessionActive,
  selectSessionMessages,
} from "@app/store/slices/therapySlice";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import { logger } from "@shared/utils/logger";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

/** Constants for chat configuration */
const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  AI_RESPONSE_TIMEOUT_MS: 30000,
} as const;

/** Error types for granular error handling */
type ChatErrorType = 'NETWORK' | 'TIMEOUT' | 'SERVER' | 'VALIDATION' | 'UNKNOWN';

interface ChatError {
  type: ChatErrorType;
  message: string;
  retryable: boolean;
}

/** AI Response simulation - Replace with actual API integration */
const generateAIResponse = async (
  userMessage: string,
  _sessionId: string,
  _conversationHistory: Array<{ role: string; content: string }>
): Promise<string> => {
  // Simulated AI responses - In production, replace with actual API call
  // Example: return await therapyAPI.generateResponse({ sessionId, message: userMessage, history });

  const therapeuticResponses = [
    "I understand how you feel. Can you tell me more about what's been on your mind?",
    "That sounds challenging. What do you think might help you cope with this situation?",
    "Thank you for sharing that with me. How does expressing this make you feel right now?",
    "It's completely normal to feel this way. Have you noticed any patterns in when these feelings arise?",
    "I hear you, and your feelings are valid. Let's explore some strategies that might help.",
    "That takes courage to share. What would be most helpful for you right now?",
    "I appreciate you opening up. What support do you feel you need most at this moment?",
  ];

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

  // Contextual response based on keywords
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
    return "I notice you're feeling anxious. Anxiety can be overwhelming, but there are techniques we can explore together. Would you like to try a grounding exercise, or would you prefer to talk through what's causing these feelings?";
  }
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
    return "I'm sorry you're feeling this way. Depression can make everything feel heavy. Remember that reaching out is a sign of strength. Can you tell me more about what's been weighing on you?";
  }
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
    return "It sounds like you're experiencing some strong emotions. Anger often signals that something important to us feels threatened. What do you think is at the root of these feelings?";
  }

  return therapeuticResponses[Math.floor(Math.random() * therapeuticResponses.length)];
};

/**
 * TherapySessionScreen Component
 * Provides interactive therapy session with AI
 */
const TherapySessionScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const currentSession = useSelector(selectCurrentSession);
  const isActive = useSelector(selectIsSessionActive);
  const messages = useSelector(selectSessionMessages);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingMessageRef = useRef<string | null>(null);

  useEffect(() => {
    // Start session if not active
    if (!isActive) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const startTime = new Date().toISOString();
      dispatch(startSession({ sessionId, startTime }));

      logger.info("[TherapySession] Session started:", { sessionId });

      // Add welcome message
      setTimeout(() => {
        dispatch(
          addMessage({
            id: `msg_${Date.now()}`,
            role: "assistant",
            content:
              "Hello! I'm here to listen and support you. How are you feeling today?",
            timestamp: new Date().toISOString(),
          }),
        );
      }, 500);
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  /**
   * Creates a timeout promise for AI response
   */
  const createTimeoutPromise = useCallback((ms: number): Promise<never> => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('AI response timeout'));
      }, ms);
    });
  }, []);

  /**
   * Handles AI response errors with classification
   */
  const classifyError = useCallback((err: unknown): ChatError => {
    if (err instanceof Error) {
      if (err.message.includes('timeout')) {
        return {
          type: 'TIMEOUT',
          message: 'The AI is taking longer than expected. Would you like to try again?',
          retryable: true,
        };
      }
      if (err.message.includes('network') || err.message.includes('fetch')) {
        return {
          type: 'NETWORK',
          message: 'Unable to connect. Please check your internet connection.',
          retryable: true,
        };
      }
      if (err.message.includes('500') || err.message.includes('server')) {
        return {
          type: 'SERVER',
          message: 'Our servers are experiencing issues. Please try again shortly.',
          retryable: true,
        };
      }
    }
    return {
      type: 'UNKNOWN',
      message: 'Something went wrong. Please try again.',
      retryable: true,
    };
  }, []);

  /**
   * Retries failed message send with exponential backoff
   */
  const retryWithBackoff = useCallback(async (
    messageContent: string,
    attempt: number
  ): Promise<string> => {
    if (attempt >= CHAT_CONFIG.MAX_RETRY_ATTEMPTS) {
      throw new Error('Max retry attempts reached');
    }

    const delay = CHAT_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt);
    await new Promise(resolve => setTimeout(resolve, delay));

    logger.info("[TherapySession] Retrying message send:", { attempt: attempt + 1 });
    return generateAIResponse(
      messageContent,
      currentSession.sessionId || `session_${Date.now()}`,
      messages.map(m => ({ role: m.role, content: m.content }))
    );
  }, [currentSession.sessionId, messages]);

  /**
   * Displays error alert with retry option
   */
  const showErrorAlert = useCallback((chatError: ChatError, messageContent: string) => {
    const buttons = chatError.retryable
      ? [
          { text: "Cancel", style: "cancel" as const },
          {
            text: "Try Again",
            onPress: () => {
              pendingMessageRef.current = messageContent;
              setRetryCount(prev => prev + 1);
              handleSendMessage(messageContent, true);
            },
          },
        ]
      : [{ text: "OK", style: "default" as const }];

    Alert.alert("Message Failed", chatError.message, buttons);
  }, []);

  /**
   * Main message sending handler with full error handling
   */
  const handleSendMessage = useCallback(async (
    overrideMessage?: string,
    isRetry: boolean = false
  ) => {
    const messageContent = overrideMessage || inputText.trim();

    // Validation
    if (!messageContent) {
      return;
    }

    if (messageContent.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
      Alert.alert(
        "Message Too Long",
        `Please keep your message under ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    // Clear any previous error
    setError(null);

    // Abort any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Add user message (only if not a retry)
    if (!isRetry) {
      const userMessageId = `msg_${Date.now()}_user`;
      dispatch(
        addMessage({
          id: userMessageId,
          role: "user",
          content: messageContent,
          timestamp: new Date().toISOString(),
        }),
      );
      setInputText("");
      logger.debug("[TherapySession] User message added:", { messageId: userMessageId });
    }

    setIsTyping(true);

    try {
      // Race between AI response and timeout
      const aiResponse = await Promise.race([
        generateAIResponse(
          messageContent,
          currentSession.sessionId || `session_${Date.now()}`,
          messages.map(m => ({ role: m.role, content: m.content }))
        ),
        createTimeoutPromise(CHAT_CONFIG.AI_RESPONSE_TIMEOUT_MS),
      ]);

      // Add AI response
      const assistantMessageId = `msg_${Date.now()}_assistant`;
      dispatch(
        addMessage({
          id: assistantMessageId,
          role: "assistant",
          content: aiResponse,
          timestamp: new Date().toISOString(),
        }),
      );

      logger.debug("[TherapySession] AI response added:", { messageId: assistantMessageId });
      setRetryCount(0);
      pendingMessageRef.current = null;

    } catch (err) {
      logger.error("[TherapySession] Failed to get AI response:", err);

      const chatError = classifyError(err);
      setError(chatError);

      // Attempt automatic retry for retryable errors
      if (chatError.retryable && retryCount < CHAT_CONFIG.MAX_RETRY_ATTEMPTS) {
        try {
          const retryResponse = await retryWithBackoff(messageContent, retryCount);

          const assistantMessageId = `msg_${Date.now()}_assistant_retry`;
          dispatch(
            addMessage({
              id: assistantMessageId,
              role: "assistant",
              content: retryResponse,
              timestamp: new Date().toISOString(),
            }),
          );

          setError(null);
          setRetryCount(0);
          pendingMessageRef.current = null;
          logger.info("[TherapySession] Retry successful");
        } catch (retryErr) {
          logger.error("[TherapySession] Retry failed:", retryErr);
          showErrorAlert(chatError, messageContent);
        }
      } else {
        showErrorAlert(chatError, messageContent);
      }
    } finally {
      setIsTyping(false);
    }
  }, [
    inputText,
    currentSession.sessionId,
    messages,
    dispatch,
    retryCount,
    createTimeoutPromise,
    classifyError,
    retryWithBackoff,
    showErrorAlert,
  ]);

  const handleEndSession = () => {
    const endTime = new Date().toISOString();
    dispatch(endSession({ endTime }));

    // Save session
    dispatch(saveTherapySession(currentSession));

    navigation.navigate("TherapyHistory");
  };

  const handleSetMood = (mood: string) => {
    dispatch(setSessionMood(mood));
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background?.primary || "#F7FAFC" },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
        ]}
      >
        <View style={styles.headerContent}>
          <Text
            style={[
              styles.headerTitle,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            Therapy Session
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.colors.brown?.[20] || "#E5DDD8" },
            ]}
          >
            {isActive ? "Active Session" : "Session Ended"}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.endButton,
            { backgroundColor: theme.colors.brown?.[80] || "#5C3D2E" },
          ]}
          onPress={handleEndSession}
          accessible
          accessibilityLabel="End therapy session"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.endButtonText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            End Session
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mood Quick Select */}
      <View
        style={[
          styles.moodBar,
          { backgroundColor: theme.colors.background?.secondary || "#FFF" },
        ]}
      >
        <Text
          style={[
            styles.moodLabel,
            { color: theme.colors.text?.secondary || "#718096" },
          ]}
        >
          How are you feeling?
        </Text>
        <View style={styles.moodButtons}>
          {["😊 Good", "😐 Okay", "😔 Low", "😰 Anxious"].map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                { backgroundColor: theme.colors.brown?.[20] || "#F0EBE8" },
                currentSession.mood === mood && {
                  backgroundColor: theme.colors.brown?.[50] || "#A67C5B",
                },
              ]}
              onPress={() => handleSetMood(mood)}
              accessible
              accessibilityLabel={`Set mood to ${mood}`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.moodButtonText,
                  { color: theme.colors.text?.primary || "#2D3748" },
                  currentSession.mood === mood && {
                    color: theme.colors.background?.primary || "#FFF",
                  },
                ]}
              >
                {mood}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message: any) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === "user"
                ? styles.userBubble
                : styles.assistantBubble,
              {
                // Design spec: User = Serenity Green, Assistant = Mindful Brown
                backgroundColor:
                  message.role === "user"
                    ? theme.colors.green?.[60] || "#7D944D"  // Serenity Green 60
                    : theme.colors.brown?.[30] || "#DDC2B8", // Mindful Brown 30
                // Add shadow for depth per design system
                shadowColor: theme.colors.semantic?.shadow || "rgba(22, 21, 19, 0.08)",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 4,
                elevation: 2,
              },
            ]}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${message.role === 'user' ? 'You' : 'AI Therapist'} said: ${message.content}`}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color:
                    message.role === "user"
                      ? theme.colors.semantic?.onPrimary || "#FFFFFF"  // White text on green
                      : theme.colors.brown?.[100] || "#372315",        // Dark brown text on light brown
                },
              ]}
            >
              {message.content}
            </Text>
            <Text
              style={[
                styles.messageTime,
                {
                  color:
                    message.role === "user"
                      ? theme.colors.green?.[20] || "#E5EAD7"   // Light green on dark green
                      : theme.colors.brown?.[70] || "#704A33",  // Dark brown on light brown
                },
              ]}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View
            style={[
              styles.typingIndicator,
              { backgroundColor: theme.colors.background?.secondary || "#FFF" },
            ]}
          >
            <ActivityIndicator
              size="small"
              color={theme.colors.brown?.[70] || "#704A33"}
            />
            <Text
              style={[
                styles.typingText,
                { color: theme.colors.text?.tertiary || "#A0AEC0" },
              ]}
            >
              AI is typing...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.background?.secondary || "#FFF",
            borderTopColor: theme.colors.border?.light || "#E2E8F0",
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background?.primary || "#F7FAFC",
              color: theme.colors.text?.primary || "#2D3748",
              borderColor: theme.colors.border?.light || "#E2E8F0",
            },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={theme.colors.text?.tertiary || "#A0AEC0"}
          multiline
          maxLength={500}
          accessible
          accessibilityLabel="Message input"
          accessibilityHint="Type your message to send to the AI therapist"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim()
                ? theme.colors.green?.[60] || "#7D944D"
                : theme.colors.gray?.[30] || "#CBD5E0",
            },
          ]}
          onPress={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          accessible
          accessibilityLabel="Send message"
          accessibilityHint="Sends your message to the AI therapist"
          accessibilityRole="button"
          accessibilityState={{ disabled: !inputText.trim() || isTyping }}
        >
          <Text
            style={[
              styles.sendButtonText,
              { color: theme.colors.semantic?.onPrimary || "#FFFFFF" },
            ]}
          >
            {isTyping ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  endButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  moodBar: {
    padding: 16,
    borderBottomWidth: 1,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  moodButtons: {
    flexDirection: "row",
    gap: 8,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    minHeight: 44,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  moodButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 12,
    borderRadius: 16,
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 70,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export const TherapySessionScreenWithBoundary = () => (
  <ScreenErrorBoundary screenName="Therapy Session">
    <TherapySessionScreen />
  </ScreenErrorBoundary>
);

export default TherapySessionScreenWithBoundary;
