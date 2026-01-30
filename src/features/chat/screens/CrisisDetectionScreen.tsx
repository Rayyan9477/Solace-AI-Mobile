/**
 * CrisisDetectionScreen Component
 * @description Crisis detection interface with professional referrals and hotline information
 * @task Task 3.7.2: Crisis Detection Screen (Screen 54)
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

type MessageType = "user" | "ai" | "crisis";
type Severity = "low" | "medium" | "high";
type ProfessionalRole = "Licensed Therapist" | "Clinical Psychologist" | "Psychiatrist";

interface Professional {
  id: string;
  name: string;
  role: ProfessionalRole;
  rating: number;
  verified: boolean;
  avatar: string;
  freeSession: boolean;
}

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
  professionals?: Professional[];
}

interface CrisisBadge extends BaseMessage {
  type: "crisis";
  emotions: string[];
  severity: Severity;
}

type ChatMessage = UserMessage | AIMessage | CrisisBadge;

interface CrisisDetectionScreenProps {
  chatsRemaining: number;
  modelName: string;
  messages: ChatMessage[];
  isAITyping: boolean;
  inputText: string;
  crisisActive: boolean;
  onBack: () => void;
  onSearch: () => void;
  onSendMessage: (message: string) => void;
  onAttachment: () => void;
  onInputChange: (text: string) => void;
  onContactProfessional: (professionalId: string) => void;
  onCallHotline: () => void;
}

export function CrisisDetectionScreen({
  chatsRemaining,
  modelName,
  messages,
  isAITyping,
  inputText,
  crisisActive,
  onBack,
  onSearch,
  onSendMessage,
  onAttachment,
  onInputChange,
  onContactProfessional,
  onCallHotline,
}: CrisisDetectionScreenProps): React.ReactElement {
  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
    }
  };

  const renderProfessionalCard = (professional: Professional) => (
    <TouchableOpacity
      key={professional.id}
      testID={`professional-card-${professional.id}`}
      style={styles.professionalCard}
      onPress={() => onContactProfessional(professional.id)}
      accessibilityRole="button"
      accessibilityLabel={`Contact ${professional.name}`}
    >
      <View style={styles.professionalAvatar}>
        <Text style={styles.avatarEmoji}>👨‍⚕️</Text>
      </View>
      <View style={styles.professionalInfo}>
        <View style={styles.professionalHeader}>
          <Text style={styles.professionalName}>{professional.name}</Text>
          {professional.verified && (
            <View
              testID={`verified-badge-${professional.id}`}
              style={styles.verifiedBadge}
            >
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.professionalRole}>{professional.role}</Text>
        <View style={styles.professionalMeta}>
          <Text style={styles.ratingText}>★ {professional.rating}</Text>
          {professional.freeSession && (
            <View style={styles.freeSessionBadge}>
              <Text style={styles.freeSessionText}>Free Session</Text>
            </View>
          )}
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
            {item.professionals && item.professionals.length > 0 && (
              <View style={styles.professionalsContainer}>
                {item.professionals.map(renderProfessionalCard)}
              </View>
            )}
          </View>
        </View>
      );
    }

    if (item.type === "crisis") {
      return (
        <View
          testID={`crisis-badge-${item.id}`}
          style={styles.crisisBadge}
        >
          <View style={styles.crisisIcon}>
            <Text style={styles.crisisIconText}>⚠️</Text>
          </View>
          <View style={styles.crisisContent}>
            <Text style={styles.crisisEmotions}>
              Emotions: {item.emotions.join(", ")}
            </Text>
            <Text style={styles.crisisStatus}>Crisis Support Active</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View testID="crisis-detection-screen" style={styles.container}>
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

      {/* Crisis Hotline Banner */}
      {crisisActive && (
        <View testID="crisis-hotline-banner" style={styles.hotlineBanner}>
          <View style={styles.hotlineContent}>
            <Text style={styles.hotlineTitle}>Need immediate support?</Text>
            <Text style={styles.hotlineNumber}>
              Call 988 - Suicide & Crisis Lifeline
            </Text>
            <Text style={styles.hotlineSubtext}>
              Free, confidential support 24/7
            </Text>
          </View>
          <TouchableOpacity
            testID="call-hotline-button"
            style={styles.callButton}
            onPress={onCallHotline}
            accessibilityRole="button"
            accessibilityLabel="Call 988 Suicide and Crisis Lifeline"
          >
            <Text style={styles.callButtonText}>Call Now</Text>
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
  callButton: {
    backgroundColor: "#E8853A",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
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
  crisisBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#E8853A",
    borderRadius: 16,
    flexDirection: "row",
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  crisisContent: {
    marginLeft: 8,
  },
  crisisEmotions: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  crisisIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  crisisIconText: {
    fontSize: 20,
  },
  crisisStatus: {
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 2,
    opacity: 0.9,
  },
  freeSessionBadge: {
    backgroundColor: "#9AAD5C",
    borderRadius: 8,
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  freeSessionText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
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
  hotlineBanner: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderColor: "#E8853A",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 16,
    marginHorizontal: 24,
    padding: 16,
  },
  hotlineContent: {
    flex: 1,
  },
  hotlineNumber: {
    color: "#E8853A",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  hotlineSubtext: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  hotlineTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
  professionalAvatar: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  professionalCard: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 8,
    minHeight: 44,
    padding: 12,
  },
  professionalHeader: {
    alignItems: "center",
    flexDirection: "row",
  },
  professionalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  professionalMeta: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  },
  professionalName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  professionalRole: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  professionalsContainer: {
    marginTop: 8,
  },
  ratingText: {
    color: "#C4A574",
    fontSize: 12,
    fontWeight: "500",
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
  verifiedBadge: {
    alignItems: "center",
    backgroundColor: "#9AAD5C",
    borderRadius: 8,
    height: 16,
    justifyContent: "center",
    marginLeft: 6,
    width: 16,
  },
  verifiedIcon: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});

export default CrisisDetectionScreen;
