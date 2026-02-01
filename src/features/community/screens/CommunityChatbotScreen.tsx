/**
 * CommunityChatbotScreen Component
 * @description AI chat interface with message bubbles, input bar, and voice input
 * @task Task 3.14.10: Community Chatbot Screen (Screen 128)
 * @audit-fix Replaced "Doctor Freud.AI" with "Doctor Solace.AI"
 * @audit-fix Replaced "GPT-6" with "Solace AI"
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
  role: "user" | "assistant";
  content: string;
}

interface CommunityChatbotScreenProps {
  botName: string;
  chatsRemaining: string;
  modelLabel: string;
  messages: ChatMessage[];
  inputText: string;
  onBack: () => void;
  onSearch: () => void;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onMicPress: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  userBubble: "#C4A574",
  userBubbleText: "#1C1410",
  aiBubble: "#2A1F18",
  aiBubbleText: "#FFFFFF",
  inputBg: "#2A1F18",
  sendBg: "#C4A574",
  sendIcon: "#1C1410",
} as const;

export function CommunityChatbotScreen({
  botName,
  chatsRemaining,
  modelLabel,
  messages,
  inputText,
  onBack,
  onSearch,
  onInputChange,
  onSend,
  onMicPress,
}: CommunityChatbotScreenProps): React.ReactElement {
  return (
    <View testID="community-chatbot-screen" style={styles.container}>
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
        <View style={styles.headerInfo}>
          <Text style={styles.botName}>{botName}</Text>
          <Text style={styles.headerSubtitle}>
            {chatsRemaining} {"\u00B7"} {modelLabel}
          </Text>
        </View>
        <TouchableOpacity
          testID="search-button"
          style={styles.searchButton}
          onPress={onSearch}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={styles.searchIcon}>{"\uD83D\uDD0D"}</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            testID={`message-${msg.id}`}
            style={[
              styles.messageBubble,
              msg.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={
                msg.role === "user"
                  ? styles.userBubbleText
                  : styles.aiBubbleText
              }
            >
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity
          testID="mic-button"
          style={styles.micButton}
          onPress={onMicPress}
          accessibilityRole="button"
          accessibilityLabel="Voice input"
        >
          <Text style={styles.micIcon}>{"\uD83C\uDF99\uFE0F"}</Text>
        </TouchableOpacity>
        <TextInput
          testID="chat-input"
          style={styles.textInput}
          value={inputText}
          onChangeText={onInputChange}
          placeholder="Type to start chatting..."
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
          <Text style={styles.sendIcon}>{"\u2192"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.aiBubble,
    borderBottomLeftRadius: 4,
  },
  aiBubbleText: { color: colors.aiBubbleText, fontSize: 15, lineHeight: 22 },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  botName: { color: colors.white, fontSize: 16, fontWeight: "700" },
  chatContainer: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 8 },
  container: { backgroundColor: colors.background, flex: 1 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerInfo: { flex: 1, marginLeft: 8 },
  headerSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  inputBar: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  messageBubble: {
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "80%",
    padding: 14,
  },
  micButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  micIcon: { fontSize: 20 },
  searchButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  searchIcon: { fontSize: 18 },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.sendBg,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  sendIcon: { color: colors.sendIcon, fontSize: 18, fontWeight: "700" },
  textInput: {
    backgroundColor: colors.inputBg,
    borderRadius: 20,
    color: colors.white,
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.userBubble,
    borderBottomRightRadius: 4,
  },
  userBubbleText: {
    color: colors.userBubbleText,
    fontSize: 15,
    lineHeight: 22,
  },
});

export default CommunityChatbotScreen;
