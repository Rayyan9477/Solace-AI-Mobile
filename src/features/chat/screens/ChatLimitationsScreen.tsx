/**
 * ChatLimitationsScreen Component
 * @description Onboarding carousel showing AI chatbot limitations before starting conversation
 * @task Task 3.6.5: Chat Limitations Screen (Screen 51)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface LimitationPage {
  id: string;
  category: string;
  title: string;
  description: string;
}

interface ChatLimitationsScreenProps {
  currentPage: number;
  totalPages: number;
  chatsRemaining: number;
  modelName: string;
  pages: LimitationPage[];
  onBack: () => void;
  onPageChange: (page: number) => void;
  onSkip: () => void;
  onSendMessage: (message: string) => void;
}

export function ChatLimitationsScreen({
  currentPage,
  totalPages,
  chatsRemaining,
  modelName,
  pages,
  onBack,
  onPageChange,
  onSkip,
  onSendMessage,
}: ChatLimitationsScreenProps): React.ReactElement {
  const [inputText, setInputText] = useState("");
  const currentPageData = pages[currentPage];

  const handleTextChange = (text: string) => {
    setInputText(text);
    if (text.length > 0) {
      onSkip();
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  return (
    <View testID="chat-limitations-screen" style={styles.container}>
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
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {/* Robot Illustration */}
        <View testID="robot-illustration" style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.robotEmoji}>🤖</Text>
          </View>
          <View style={styles.decorations}>
            <Text style={styles.decorationLeft}>✨</Text>
            <Text style={styles.decorationRight}>🌿</Text>
          </View>
        </View>

        {/* Category Badge */}
        <View testID="category-badge" style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{currentPageData?.category}</Text>
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>{currentPageData?.title}</Text>

        {/* Page Description */}
        <Text style={styles.pageDescription}>
          {currentPageData?.description}
        </Text>

        {/* Pagination Dots */}
        <View testID="pagination-dots" style={styles.paginationDots}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <TouchableOpacity
              key={index}
              testID={`dot-${index}`}
              style={[
                styles.dot,
                currentPage === index && styles.dotActive,
              ]}
              onPress={() => onPageChange(index)}
              accessibilityRole="button"
              accessibilityLabel={`Go to page ${index + 1}`}
            />
          ))}
        </View>

        {/* Swipe Hint */}
        <View testID="swipe-hint" style={styles.swipeHint}>
          <Text style={styles.swipeHintText}>
            Swipe to learn more or type to start chatting
          </Text>
        </View>
      </View>

      {/* Chat Input Area */}
      <View testID="chat-input-area" style={styles.chatInputArea}>
        <TouchableOpacity
          testID="attachment-button"
          style={styles.attachmentButton}
          accessibilityRole="button"
          accessibilityLabel="Add attachment"
        >
          <Text style={styles.attachmentIcon}>📎</Text>
        </TouchableOpacity>
        <TextInput
          testID="message-input"
          style={styles.messageInput}
          value={inputText}
          onChangeText={handleTextChange}
          placeholder="Type to start chatting..."
          placeholderTextColor={palette.gray[400]}
          accessibilityLabel="Message input"
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
  attachmentButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  attachmentIcon: {
    fontSize: 20,
  },
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  categoryBadge: {
    backgroundColor: palette.tan[500],
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  categoryText: {
    color: palette.brown[900],
    fontSize: 12,
    fontWeight: "600",
  },
  chatInputArea: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 28,
    flexDirection: "row",
    marginBottom: 32,
    marginHorizontal: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  contentArea: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  decorationLeft: {
    fontSize: 24,
    left: -30,
    position: "absolute",
    top: 20,
  },
  decorationRight: {
    fontSize: 24,
    position: "absolute",
    right: -30,
    top: 20,
  },
  decorations: {
    height: 60,
    position: "relative",
    width: 200,
  },
  dot: {
    backgroundColor: palette.brown[700],
    borderRadius: 4,
    height: 8,
    marginHorizontal: 4,
    width: 8,
  },
  dotActive: {
    backgroundColor: palette.tan[500],
    width: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerSubtitle: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 2,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  illustrationCircle: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 80,
    height: 160,
    justifyContent: "center",
    marginBottom: 16,
    width: 160,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  messageInput: {
    color: palette.white,
    flex: 1,
    fontSize: 14,
    paddingVertical: 12,
  },
  pageDescription: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  pageTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  robotEmoji: {
    fontSize: 64,
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
    backgroundColor: palette.olive[500],
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  sendIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  swipeHint: {
    opacity: 0.7,
  },
  swipeHintText: {
    color: palette.gray[400],
    fontSize: 12,
    textAlign: "center",
  },
});

export default ChatLimitationsScreen;
