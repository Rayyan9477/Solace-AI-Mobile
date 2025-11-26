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
import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

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
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Start session if not active
    if (!isActive) {
      const sessionId = `session_${Date.now()}`;
      const startTime = new Date().toISOString();
      dispatch(startSession({ sessionId, startTime }));

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
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessageId = `msg_${Date.now()}`;
    dispatch(
      addMessage({
        id: userMessageId,
        role: "user",
        content: inputText.trim(),
        timestamp: new Date().toISOString(),
      }),
    );

    setInputText("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const responses = [
        "I understand how you feel. Can you tell me more about that?",
        "That sounds challenging. What do you think might help in this situation?",
        "Thank you for sharing that with me. How does that make you feel?",
        "It's completely normal to feel this way. Have you experienced this before?",
        "I hear you. Let's explore some coping strategies together.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      dispatch(
        addMessage({
          id: `msg_${Date.now()}`,
          role: "assistant",
          content: randomResponse,
          timestamp: new Date().toISOString(),
        }),
      );

      setIsTyping(false);
    }, 1500);
  };

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
                backgroundColor:
                  message.role === "user"
                    ? theme.colors.brown?.[60] || "#8C6A4F"
                    : theme.colors.background?.secondary || "#FFF",
              },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                {
                  color:
                    message.role === "user"
                      ? theme.colors.background?.primary || "#FFF"
                      : theme.colors.text?.primary || "#2D3748",
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
                      ? theme.colors.brown?.[20] || "#E5DDD8"
                      : theme.colors.text?.tertiary || "#A0AEC0",
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
                ? theme.colors.brown?.[70] || "#704A33"
                : theme.colors.gray?.[30] || "#CBD5E0",
            },
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
          accessible
          accessibilityLabel="Send message"
          accessibilityRole="button"
          accessibilityState={{ disabled: !inputText.trim() }}
        >
          <Text
            style={[
              styles.sendButtonText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            Send
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
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
