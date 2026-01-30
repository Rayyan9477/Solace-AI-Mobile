/**
 * ChatWithMediaScreen Component
 * @description Chat interface with embedded media content (videos, resources)
 * @task Task 3.7.1: Chat With Media Screen (Screen 53)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";

interface MediaContent {
  id: string;
  type: "video" | "audio" | "article";
  title: string;
  thumbnail: string;
  duration: string;
}

interface BaseMessage {
  id: string;
  type: "user" | "ai";
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
  media?: MediaContent;
}

type ChatMessage = UserMessage | AIMessage;

interface ChatWithMediaScreenProps {
  chatsRemaining: number;
  modelName: string;
  messages: ChatMessage[];
  isAITyping: boolean;
  inputText: string;
  onBack: () => void;
  onSearch: () => void;
  onSendMessage: (message: string) => void;
  onAttachment: () => void;
  onInputChange: (text: string) => void;
  onPlayVideo: (videoId: string) => void;
}

export function ChatWithMediaScreen({
  chatsRemaining,
  modelName,
  messages,
  isAITyping,
  inputText,
  onBack,
  onSearch,
  onSendMessage,
  onAttachment,
  onInputChange,
  onPlayVideo,
}: ChatWithMediaScreenProps): React.ReactElement {
  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
    }
  };

  const renderVideoCard = (media: MediaContent) => (
    <TouchableOpacity
      testID={`video-card-${media.id}`}
      style={styles.videoCard}
      onPress={() => onPlayVideo(media.id)}
      accessibilityRole="button"
      accessibilityLabel={`Play ${media.title}`}
    >
      <View style={styles.videoThumbnailContainer}>
        <View
          testID={`video-thumbnail-${media.id}`}
          style={styles.videoThumbnail}
        >
          <Image
            source={{ uri: media.thumbnail }}
            style={styles.thumbnailImage}
            accessibilityRole="image"
          />
        </View>
        <TouchableOpacity
          testID={`video-play-button-${media.id}`}
          style={styles.playButton}
          onPress={() => onPlayVideo(media.id)}
          accessibilityRole="button"
          accessibilityLabel="Play video"
        >
          <Text style={styles.playIcon}>▶</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{media.title}</Text>
        <View style={styles.videoMeta}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.videoDuration}>{media.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <View style={styles.aiMessageContainer}>
            <View style={[styles.messageContent, styles.aiMessageContent]}>
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
            {item.media && renderVideoCard(item.media)}
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View testID="chat-with-media-screen" style={styles.container}>
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
  aiMessageContainer: {
    flex: 1,
    maxWidth: "80%",
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
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 16,
    paddingHorizontal: 24,
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
    alignItems: "flex-start",
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
  playButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    width: 50,
  },
  playIcon: {
    color: "#1C1410",
    fontSize: 18,
    marginLeft: 4,
  },
  progressBar: {
    backgroundColor: "#3D2E23",
    borderRadius: 2,
    flex: 1,
    height: 4,
    marginRight: 8,
  },
  progressFill: {
    backgroundColor: "#C4A574",
    borderRadius: 2,
    height: "100%",
    width: "0%",
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
  thumbnailImage: {
    borderRadius: 8,
    height: "100%",
    width: "100%",
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
  videoCard: {
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    marginTop: 8,
    overflow: "hidden",
  },
  videoDuration: {
    color: "#94A3B8",
    fontSize: 12,
  },
  videoInfo: {
    padding: 12,
  },
  videoMeta: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  videoThumbnail: {
    backgroundColor: "#3D2E23",
    borderRadius: 8,
    height: "100%",
    width: "100%",
  },
  videoThumbnailContainer: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
    height: 120,
    justifyContent: "center",
    position: "relative",
  },
  videoTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ChatWithMediaScreen;
