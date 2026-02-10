/**
 * LiveChatSupportScreen Component
 * @description Active live chat conversation with support specialist
 * @task Task 3.17.12: Live Chat Support Screen (Screen 151)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface ChatMessage {
  id: string;
  type: "user" | "agent";
  content: string;
}

interface LiveChatSupportScreenProps {
  messages: ChatMessage[];
  inputText: string;
  onBack: () => void;
  onInputChange: (text: string) => void;
  onSend: () => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  userBubble: palette.tan[500],
  userBubbleText: palette.brown[900],
  agentBubble: palette.brown[800],
  inputBg: palette.brown[800],
  sendBg: palette.tan[500],
  sendIcon: palette.brown[900],
} as const;

export function LiveChatSupportScreen({
  messages,
  inputText,
  onBack,
  onInputChange,
  onSend,
}: LiveChatSupportScreenProps): React.ReactElement {
  return (
    <View testID="live-chat-support-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Chat Support</Text>
      </View>

      {/* Messages */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContainer}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            testID={`message-${msg.id}`}
            style={[
              styles.messageBubble,
              msg.type === "user" ? styles.userBubble : styles.agentBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.type === "user" && styles.userText,
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          testID="chat-input"
          style={styles.textInput}
          value={inputText}
          onChangeText={onInputChange}
          placeholder="Chat with our specialist..."
          placeholderTextColor={localColors.textSecondary}
          accessibilityLabel="Chat message"
        />
        <TouchableOpacity
          testID="send-button"
          style={styles.sendButton}
          onPress={onSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendIcon}>{"\u2191"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  agentBubble: {
    alignSelf: "flex-start",
    backgroundColor: localColors.agentBubble,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: localColors.white, fontSize: 24 },
  container: { backgroundColor: localColors.background, flex: 1 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: localColors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  inputBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messageBubble: {
    borderRadius: 16,
    marginTop: 8,
    maxWidth: "80%",
    padding: 14,
  },
  messageText: {
    color: localColors.white,
    fontSize: 15,
    lineHeight: 22,
  },
  messagesContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: localColors.sendBg,
    borderRadius: 22,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  sendIcon: {
    color: localColors.sendIcon,
    fontSize: 20,
    fontWeight: "700",
  },
  textInput: {
    backgroundColor: localColors.inputBg,
    borderRadius: 22,
    color: localColors.white,
    flex: 1,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: localColors.userBubble,
  },
  userText: { color: localColors.userBubbleText },
});

export default LiveChatSupportScreen;
