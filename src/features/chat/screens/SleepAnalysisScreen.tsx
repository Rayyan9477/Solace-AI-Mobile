/**
 * SleepAnalysisScreen Component
 * @description Chat interface with AI-generated sleep analysis and charts
 * @task Task 3.7.4: Sleep Analysis Screen (Screen 56)
 * @phase Phase 3C: Refactored to use theme tokens
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
import { palette } from "../../../shared/theme";

type TimeRange = "1week" | "1month" | "3months" | "6months" | "1year";

interface SleepDataPoint {
  day: string;
  quality: number;
}

interface ActionButton {
  id: string;
  label: string;
  icon: string;
}

interface SleepAnalysis {
  data: SleepDataPoint[];
  timeRange: TimeRange;
  actions: ActionButton[];
}

interface BaseMessage {
  id: string;
  type: "user" | "ai" | "notification";
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
  sleepAnalysis?: SleepAnalysis;
}

interface NotificationMessage extends BaseMessage {
  type: "notification";
  message: string;
  icon: string;
}

type ChatMessage = UserMessage | AIMessage | NotificationMessage;

interface SleepAnalysisScreenProps {
  chatsRemaining: number;
  modelName: string;
  messages: ChatMessage[];
  isAITyping: boolean;
  inputText: string;
  selectedTimeRange: TimeRange;
  onBack: () => void;
  onSearch: () => void;
  onSendMessage: (message: string) => void;
  onAttachment: () => void;
  onInputChange: (text: string) => void;
  onTimeRangeChange: (range: TimeRange) => void;
  onActionPress: (actionId: string) => void;
  onDownload: () => void;
}

export function SleepAnalysisScreen({
  chatsRemaining,
  modelName,
  messages,
  isAITyping,
  inputText,
  selectedTimeRange,
  onBack,
  onSearch,
  onSendMessage,
  onAttachment,
  onInputChange,
  onActionPress,
  onDownload,
}: SleepAnalysisScreenProps): React.ReactElement {
  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
    }
  };

  const renderSleepChart = (sleepAnalysis: SleepAnalysis) => (
    <View testID="sleep-chart" style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <View style={styles.chartTitleRow}>
          <Text style={styles.chartIcon}>💤</Text>
          <Text style={styles.chartTitle}>Sleep Quality</Text>
        </View>
        <TouchableOpacity
          testID="time-range-selector"
          style={styles.timeRangeSelector}
          accessibilityRole="button"
          accessibilityLabel={`Time range: ${selectedTimeRange}`}
        >
          <Text style={styles.timeRangeText}>{selectedTimeRange}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartBars}>
        {sleepAnalysis.data.map((point, index) => (
          <View key={index} style={styles.chartBarContainer}>
            <View style={styles.chartBarWrapper}>
              <View
                testID={`chart-bar-${index}`}
                style={[
                  styles.chartBar,
                  { height: `${point.quality}%` },
                ]}
              />
            </View>
            <Text style={styles.chartBarLabel}>{point.day}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        testID="download-button"
        style={styles.downloadButton}
        onPress={onDownload}
        accessibilityRole="button"
        accessibilityLabel="Download chart"
      >
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>

      <View style={styles.actionsGrid}>
        {sleepAnalysis.actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            testID={`action-${action.id}`}
            style={styles.actionButton}
            onPress={() => onActionPress(action.id)}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
              {item.sleepAnalysis && renderSleepChart(item.sleepAnalysis)}
            </View>
          </View>
        </View>
      );
    }

    if (item.type === "notification") {
      return (
        <View
          testID={`notification-${item.id}`}
          style={styles.notificationBubble}
        >
          <Text style={styles.notificationIcon}>{item.icon}</Text>
          <Text style={styles.notificationText}>{item.message}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View testID="sleep-analysis-screen" style={styles.container}>
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
          placeholderTextColor={palette.gray[400]}
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
  actionButton: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "48%",
  },
  actionIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionLabel: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 12,
  },
  aiAvatar: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
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
    backgroundColor: palette.brown[800],
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
  chartBar: {
    backgroundColor: palette.olive[500],
    borderRadius: 4,
    width: "100%",
  },
  chartBarContainer: {
    alignItems: "center",
    flex: 1,
  },
  chartBarLabel: {
    color: palette.gray[400],
    fontSize: 10,
    marginTop: 4,
  },
  chartBarWrapper: {
    backgroundColor: palette.brown[900],
    borderRadius: 4,
    height: 80,
    justifyContent: "flex-end",
    width: 20,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  chartContainer: {
    backgroundColor: palette.brown[700],
    borderRadius: 12,
    marginTop: 12,
    padding: 12,
  },
  chartHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chartTitle: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
  },
  chartTitleRow: {
    alignItems: "center",
    flexDirection: "row",
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
  downloadButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 8,
    paddingVertical: 8,
  },
  downloadText: {
    color: palette.gray[400],
    fontSize: 12,
  },
  dropdownIcon: {
    color: palette.gray[400],
    fontSize: 10,
    marginLeft: 4,
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
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 2,
  },
  headerTitle: {
    color: palette.white,
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
    backgroundColor: palette.tan[500],
    borderRadius: 16,
    maxWidth: "70%",
    padding: 12,
  },
  messageInput: {
    color: palette.white,
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
    color: palette.white,
    fontSize: 14,
    lineHeight: 20,
  },
  notificationBubble: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 16,
    flexDirection: "row",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  notificationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  notificationText: {
    color: palette.white,
    fontSize: 13,
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
  timeRangeSelector: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeRangeText: {
    color: palette.white,
    fontSize: 11,
  },
  typingBubble: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    padding: 12,
  },
  typingDot: {
    backgroundColor: palette.gray[400],
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
    color: palette.gray[400],
    fontSize: 14,
  },
  userAvatar: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
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

export default SleepAnalysisScreen;
