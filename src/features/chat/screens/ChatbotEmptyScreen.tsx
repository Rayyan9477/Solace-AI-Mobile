/**
 * ChatbotEmptyScreen Component
 * @description Empty state screen for AI chatbot when user has no conversations
 * @task Task 3.6.1: Chatbot Empty Screen (Screen 47)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface ChatbotEmptyScreenProps {
  isCreating?: boolean;
  onBack: () => void;
  onNewConversation: () => void;
}

export function ChatbotEmptyScreen({
  isCreating = false,
  onBack,
  onNewConversation,
}: ChatbotEmptyScreenProps): React.ReactElement {
  return (
    <View testID="chatbot-empty-screen" style={styles.container}>
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
        <Text style={styles.screenTitle}>Mindful AI Chatbot</Text>
      </View>

      {/* Content Area - Centered */}
      <View testID="content-area" style={styles.contentArea}>
        {/* Mascot Illustration */}
        <View testID="mascot-illustration" style={styles.mascotContainer}>
          <View style={styles.mascotInner}>
            <Text style={styles.mascotEmoji}>🤖</Text>
            <Text style={styles.mascotAccent}>🌿</Text>
          </View>
          <View style={styles.mascotDecorations}>
            <Text style={styles.decorationLeft}>☕</Text>
            <Text style={styles.decorationRight}>✨</Text>
          </View>
        </View>

        {/* Empty State Text */}
        <Text style={styles.emptyTitle}>Talk to Solace AI</Text>
        <Text style={styles.emptyDescription}>
          You have no AI conversations. Get your mind healthy by starting a new one.
        </Text>
      </View>

      {/* Footer - New Conversation Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="new-conversation-button"
          style={styles.newConversationButton}
          onPress={onNewConversation}
          disabled={isCreating}
          accessibilityRole="button"
          accessibilityLabel="Start new conversation"
          accessibilityState={{ disabled: isCreating }}
        >
          <Text style={styles.newConversationText}>
            {isCreating ? "Creating..." : "New Conversation"}
          </Text>
          <Text testID="new-conversation-icon" style={styles.newConversationIcon}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    left: 0,
    position: "absolute",
    top: 0,
  },
  decorationRight: {
    fontSize: 24,
    position: "absolute",
    right: 0,
    top: 0,
  },
  emptyDescription: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  emptyTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  footer: {
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 24,
  },
  mascotAccent: {
    bottom: -10,
    fontSize: 32,
    position: "absolute",
    right: -10,
  },
  mascotContainer: {
    alignItems: "center",
    marginBottom: 32,
    position: "relative",
  },
  mascotDecorations: {
    height: 60,
    position: "relative",
    width: 200,
  },
  mascotEmoji: {
    fontSize: 80,
  },
  mascotInner: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 80,
    height: 160,
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
    width: 160,
  },
  newConversationButton: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%",
  },
  newConversationIcon: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 8,
  },
  newConversationText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  screenTitle: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
  },
});

export default ChatbotEmptyScreen;
