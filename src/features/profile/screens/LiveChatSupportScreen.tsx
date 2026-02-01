/**
 * LiveChatSupportScreen Component
 * @description Active live chat conversation with support specialist
 * @task Task 3.17.12: Live Chat Support Screen (Screen 151)
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

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  userBubble: "#C4A574",
  userBubbleText: "#1C1410",
  agentBubble: "#2A1F18",
  inputBg: "#2A1F18",
  sendBg: "#C4A574",
  sendIcon: "#1C1410",
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
          placeholderTextColor={colors.textSecondary}
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
    backgroundColor: colors.agentBubble,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
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
    color: colors.white,
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
    backgroundColor: colors.sendBg,
    borderRadius: 22,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  sendIcon: {
    color: colors.sendIcon,
    fontSize: 20,
    fontWeight: "700",
  },
  textInput: {
    backgroundColor: colors.inputBg,
    borderRadius: 22,
    color: colors.white,
    flex: 1,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.userBubble,
  },
  userText: { color: colors.userBubbleText },
});

export default LiveChatSupportScreen;
