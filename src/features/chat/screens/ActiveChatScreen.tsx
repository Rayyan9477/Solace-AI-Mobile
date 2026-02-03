/**
 * ActiveChatScreen Component
 * @description Main AI chat conversation interface with messages and emotion detection
 * @task Task 3.6.6: Active Chat Screen (Screen 52)
 * @phase Phase 3D: Integrated CrisisModal for AI-detected crisis content
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";
import { CrisisModal } from "../../../shared/components/organisms/crisis";

type MessageType = "user" | "ai" | "emotion" | "date";
type Sentiment = "positive" | "negative" | "neutral";

interface BaseMessage {
  id: string;
  type: MessageType;
}

interface UserMessage extends BaseMessage {
  type: "user";
  content: string;
  timestamp: Date;
}

interface AIMessage extends BaseMessage {
  type: "ai";
  content: string;
  timestamp: Date;
}

interface EmotionBadge extends BaseMessage {
  type: "emotion";
  emotions: string[];
  sentiment: Sentiment;
}

interface DateDivider extends BaseMessage {
  type: "date";
  date: string;
}

type ChatMessage = UserMessage | AIMessage | EmotionBadge | DateDivider;

interface ActiveChatScreenProps {
  chatsRemaining: number;
  modelName: string;
  messages: ChatMessage[];
  isAITyping: boolean;
  inputText: string;
  crisisDetected?: boolean; // AI-detected crisis keywords in conversation
  onBack: () => void;
  onSearch: () => void;
  onSendMessage: (message: string) => void;
  onAttachment: () => void;
  onInputChange: (text: string) => void;
}

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  positive: "#9AAD5C",
  negative: "#E8853A",
  neutral: "#94A3B8",
};

export function ActiveChatScreen({
  chatsRemaining,
  modelName,
  messages,
  isAITyping,
  inputText,
  crisisDetected = false,
  onBack,
  onSearch,
  onSendMessage,
  onAttachment,
  onInputChange,
}: ActiveChatScreenProps): React.ReactElement {
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
    }
  };

  const handleAccessCrisisSupport = (): void => {
    setShowCrisisModal(true);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.type === "user") {
      return (
        <View
          testID={`message-${item.id}`}
          style={[styles.messageBubble, styles.userMessage]}
        >
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
          <View testID={`user-avatar-${item.id}`} style={styles.userAvatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
        </View>
      );
    }

    if (item.type === "ai") {
      return (
        <View
          testID={`message-${item.id}`}
          style={[styles.messageBubble, styles.aiMessage]}
        >
          <View testID={`ai-avatar-${item.id}`} style={styles.aiAvatar}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
          <View style={[styles.messageContent, styles.aiMessageContent]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        </View>
      );
    }

    if (item.type === "emotion") {
      return (
        <View
          testID={`emotion-badge-${item.id}`}
          style={[
            styles.emotionBadge,
            { backgroundColor: SENTIMENT_COLORS[item.sentiment] },
          ]}
        >
          <Text style={styles.emotionText}>
            Emotion: {item.emotions.join(", ")}. Data Updated.
          </Text>
        </View>
      );
    }

    if (item.type === "date") {
      return (
        <View
          testID={`date-divider-${item.id}`}
          style={styles.dateDivider}
        >
          <View style={styles.dateLine} />
          <Text style={styles.dateText}>{item.date}</Text>
          <View style={styles.dateLine} />
        </View>
      );
    }

    return null;
  };

  return (
    <View testID="active-chat-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Solace AI</Text>
          <Text style={styles.headerSubtitle}>
            {chatsRemaining} Chats Left • {modelName}
          </Text>
        </View>
        <TouchableOpacity
          testID="search-button"
          style={styles.searchButton}
          onPress={onSearch}
          accessibilityRole="button"
          accessibilityLabel="Search messages"
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Crisis Alert Banner - Shows when AI detects crisis content */}
      {crisisDetected && (
        <View testID="crisis-alert-banner" style={styles.crisisAlertBanner}>
          <View style={styles.crisisAlertContent}>
            <Text style={styles.crisisAlertIcon}>❤️‍🩹</Text>
            <View style={styles.crisisAlertText}>
              <Text style={styles.crisisAlertTitle}>Support Available</Text>
              <Text style={styles.crisisAlertDescription}>
                We noticed you might need immediate support
              </Text>
            </View>
          </View>
          <TouchableOpacity
            testID="crisis-support-banner-button"
            style={styles.crisisAlertButton}
            onPress={handleAccessCrisisSupport}
            accessibilityRole="button"
            accessibilityLabel="Access crisis support resources"
          >
            <Text style={styles.crisisAlertButtonText}>Get Help Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Message List */}
      <FlatList
        testID="message-list"
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isAITyping && (
        <View testID="typing-indicator" style={styles.typingIndicator}>
          <View style={styles.aiAvatar}>
            <Text style={styles.avatarEmoji}>🤖</Text>
          </View>
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>Solace AI is thinking...</Text>
            <View style={styles.typingDots}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        </View>
      )}

      {/* Chat Input Area */}
      <View testID="chat-input-area" style={styles.chatInputArea}>
        <TouchableOpacity
          testID="attachment-button"
          style={styles.attachmentButton}
          onPress={onAttachment}
          accessibilityRole="button"
          accessibilityLabel="Add attachment"
        >
          <Text style={styles.attachmentIcon}>📎</Text>
        </TouchableOpacity>
        <TextInput
          testID="message-input"
          style={styles.messageInput}
          value={inputText}
          onChangeText={onInputChange}
          placeholder="Type to start chatting..."
          placeholderTextColor="#94A3B8"
          accessibilityLabel="Message input"
          multiline
        />
        <TouchableOpacity
          testID="send-button"
          style={styles.sendButton}
          onPress={handleSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendIcon}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Crisis Modal */}
      <CrisisModal
        visible={showCrisisModal}
        onDismiss={() => setShowCrisisModal(false)}
        triggerSource="chat"
        requireAcknowledge={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  aiAvatar: {
    alignItems: "center",
    backgroundColor: "#9AAD5C",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginRight: 8,
    width: 40,
  },
  aiMessage: {
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  aiMessageContent: {
    backgroundColor: "#2A1F19",
  },
  attachmentButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  attachmentIcon: {
    fontSize: 20,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  backButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  chatInputArea: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 28,
    flexDirection: "row",
    marginBottom: 32,
    marginHorizontal: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  crisisAlertBanner: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 24,
    padding: 16,
  },
  crisisAlertButton: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 44,
    paddingVertical: 10,
  },
  crisisAlertButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  crisisAlertContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  crisisAlertDescription: {
    color: "#FCA5A5",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  crisisAlertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  crisisAlertText: {
    flex: 1,
  },
  crisisAlertTitle: {
    color: "#FCA5A5",
    fontSize: 15,
    fontWeight: "600",
  },
  dateDivider: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  dateLine: {
    backgroundColor: "#3D2E23",
    flex: 1,
    height: 1,
  },
  dateText: {
    color: "#94A3B8",
    fontSize: 12,
    marginHorizontal: 12,
  },
  emotionBadge: {
    alignSelf: "center",
    borderRadius: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emotionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  messageBubble: {
    alignItems: "flex-end",
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  messageContent: {
    backgroundColor: "#C4A574",
    borderRadius: 16,
    maxWidth: "70%",
    padding: 12,
  },
  messageInput: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 12,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 16,
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  searchButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  searchIcon: {
    fontSize: 20,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: "#9AAD5C",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  typingBubble: {
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
  },
  typingDot: {
    backgroundColor: "#94A3B8",
    borderRadius: 3,
    height: 6,
    marginLeft: 4,
    width: 6,
  },
  typingDots: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 8,
  },
  typingIndicator: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  typingText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  userAvatar: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginLeft: 8,
    width: 40,
  },
  userMessage: {
    alignSelf: "flex-end",
    flexDirection: "row",
  },
});

export default ActiveChatScreen;
