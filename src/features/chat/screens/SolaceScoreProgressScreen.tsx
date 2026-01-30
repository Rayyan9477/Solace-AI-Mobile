/**
 * SolaceScoreProgressScreen Component
 * @description Chat interface showing mental health score (Solace Score) progression
 * @task Task 3.7.5: Solace Score Progress Screen (Screen 57)
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

type TimeRange = "1week" | "1month" | "3months" | "6months" | "1year";

interface ScoreDataPoint {
  date: string;
  score: number;
}

interface ScoreProgress {
  data: ScoreDataPoint[];
  currentScore: number;
  previousScore: number;
  changePercent: number;
  timeRange: TimeRange;
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
  scoreProgress?: ScoreProgress;
}

type ChatMessage = UserMessage | AIMessage;

interface SolaceScoreProgressScreenProps {
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
}

export function SolaceScoreProgressScreen({
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
}: SolaceScoreProgressScreenProps): React.ReactElement {
  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
    }
  };

  const renderScoreChart = (scoreProgress: ScoreProgress) => (
    <View testID="score-chart" style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <View style={styles.chartTitleRow}>
          <Text style={styles.chartIcon}>🧠</Text>
          <Text style={styles.chartTitle}>Solace Score</Text>
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

      <View style={styles.chartArea}>
        {/* Line Chart Visualization */}
        <View testID="chart-line" style={styles.chartLine}>
          <View style={styles.lineGraph}>
            {scoreProgress.data.map((point, index) => (
              <View
                key={index}
                style={[
                  styles.dataPoint,
                  {
                    left: `${(index / (scoreProgress.data.length - 1)) * 100}%`,
                    bottom: `${(point.score / 100) * 100}%`,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Current Score Indicator */}
        <View testID="current-score" style={styles.currentScoreContainer}>
          <Text style={styles.currentScoreValue}>
            {scoreProgress.currentScore}
          </Text>
        </View>
      </View>

      {/* Week Labels */}
      <View style={styles.chartLabels}>
        {scoreProgress.data.map((point, index) => (
          <Text key={index} style={styles.chartLabel}>
            {point.date}
          </Text>
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
              {item.scoreProgress && renderScoreChart(item.scoreProgress)}
            </View>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View testID="solace-score-progress-screen" style={styles.container}>
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
  chartArea: {
    height: 100,
    marginVertical: 12,
    position: "relative",
  },
  chartContainer: {
    backgroundColor: "#3D2E23",
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
  chartLabel: {
    color: "#94A3B8",
    flex: 1,
    fontSize: 10,
    textAlign: "center",
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  chartLine: {
    backgroundColor: "#2A1F19",
    borderRadius: 8,
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  chartTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  chartTitleRow: {
    alignItems: "center",
    flexDirection: "row",
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
  currentScoreContainer: {
    alignItems: "center",
    backgroundColor: "#9AAD5C",
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    position: "absolute",
    right: 8,
    top: 8,
  },
  currentScoreValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  dataPoint: {
    backgroundColor: "#9AAD5C",
    borderRadius: 4,
    height: 8,
    position: "absolute",
    transform: [{ translateX: -4 }, { translateY: 4 }],
    width: 8,
  },
  dropdownIcon: {
    color: "#94A3B8",
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
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  lineGraph: {
    height: "100%",
    position: "relative",
    width: "100%",
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
  timeRangeSelector: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeRangeText: {
    color: "#FFFFFF",
    fontSize: 11,
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

export default SolaceScoreProgressScreen;
