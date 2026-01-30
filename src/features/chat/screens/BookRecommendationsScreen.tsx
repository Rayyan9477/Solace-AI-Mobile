/**
 * BookRecommendationsScreen Component
 * @description Chat interface with AI-generated book recommendations
 * @task Task 3.7.3: Book Recommendations Screen (Screen 55)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";

type ColorTheme = "tan" | "orange" | "teal" | "purple";

interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  colorTheme: ColorTheme;
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
  books?: BookRecommendation[];
}

type ChatMessage = UserMessage | AIMessage;

interface BookRecommendationsScreenProps {
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
  onBookPress: (bookId: string) => void;
}

const COLOR_THEMES: Record<ColorTheme, string> = {
  tan: "#C4A574",
  orange: "#E8853A",
  teal: "#5C9AAD",
  purple: "#9A5CAD",
};

const BOOK_EMOJIS: Record<ColorTheme, string> = {
  tan: "📚",
  orange: "📕",
  teal: "📗",
  purple: "📘",
};

export function BookRecommendationsScreen({
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
  onBookPress,
}: BookRecommendationsScreenProps): React.ReactElement {
  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
    }
  };

  const renderBookCard = (book: BookRecommendation) => (
    <TouchableOpacity
      key={book.id}
      testID={`book-card-${book.id}`}
      style={styles.bookCard}
      onPress={() => onBookPress(book.id)}
      accessibilityRole="button"
      accessibilityLabel={`View ${book.title}`}
    >
      <View
        testID={`book-icon-${book.id}`}
        style={[
          styles.bookIcon,
          { backgroundColor: COLOR_THEMES[book.colorTheme] },
        ]}
      >
        <Text style={styles.bookEmoji}>{BOOK_EMOJIS[book.colorTheme]}</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>By {book.author}</Text>
        <View style={styles.bookMeta}>
          <View
            testID={`book-progress-${book.id}`}
            style={styles.progressContainer}
          >
            <View
              style={[
                styles.progressBar,
                { backgroundColor: COLOR_THEMES[book.colorTheme] },
              ]}
            />
          </View>
          <Text style={styles.pageCount}>{book.pageCount}p</Text>
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
              {item.books && item.books.length > 0 && (
                <View style={styles.booksContainer}>
                  {item.books.map(renderBookCard)}
                </View>
              )}
            </View>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View testID="book-recommendations-screen" style={styles.container}>
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
    maxWidth: "85%",
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
  bookAuthor: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  bookCard: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 8,
    minHeight: 44,
    padding: 12,
  },
  bookEmoji: {
    fontSize: 20,
  },
  bookIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookMeta: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 6,
  },
  bookTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  booksContainer: {
    marginTop: 8,
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
  pageCount: {
    color: "#94A3B8",
    fontSize: 11,
    marginLeft: 8,
  },
  progressBar: {
    borderRadius: 2,
    height: "100%",
    width: "60%",
  },
  progressContainer: {
    backgroundColor: "#1C1410",
    borderRadius: 2,
    flex: 1,
    height: 4,
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

export default BookRecommendationsScreen;
