/**
 * ChatsListScreen Component
 * @description List of AI chat conversations with Recent and Trash sections
 * @task Task 3.6.3: Chats List Screen (Screen 49)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type TabType = "recent" | "trash";

interface ChatConversation {
  id: string;
  title: string;
  messageCount: number;
  mood: string;
  moodColor: string;
}

interface ChatsListScreenProps {
  recentChats: ChatConversation[];
  trashChats: ChatConversation[];
  recentCount: number;
  trashCount: number;
  activeTab: TabType;
  onBack: () => void;
  onTabChange: (tab: TabType) => void;
  onChatPress: (id: string) => void;
  onSeeAllRecent: () => void;
  onSeeAllTrash: () => void;
}

export function ChatsListScreen({
  recentChats,
  trashChats,
  recentCount,
  trashCount,
  activeTab,
  onBack,
  onTabChange,
  onChatPress,
  onSeeAllRecent,
  onSeeAllTrash,
}: ChatsListScreenProps): React.ReactElement {
  const renderChatItem = (chat: ChatConversation, isTrash: boolean = false) => (
    <TouchableOpacity
      key={chat.id}
      testID={`chat-item-${chat.id}`}
      style={[styles.chatItem, isTrash && styles.chatItemTrash]}
      onPress={() => onChatPress(chat.id)}
      accessibilityRole="button"
      accessibilityLabel={`Open conversation: ${chat.title}`}
    >
      <View testID={`chat-avatar-${chat.id}`} style={styles.chatAvatar}>
        <Text style={styles.avatarEmoji}>💬</Text>
      </View>
      <View style={styles.chatContent}>
        <Text
          style={[styles.chatTitle, isTrash && styles.chatTitleTrash]}
          numberOfLines={1}
        >
          {chat.title}
        </Text>
        <Text style={styles.chatStats}>{chat.messageCount} Total</Text>
      </View>
      <View
        testID={`mood-badge-${chat.id}`}
        style={[styles.moodBadge, { backgroundColor: chat.moodColor }]}
      >
        <Text style={styles.moodBadgeText}>{chat.mood}</Text>
      </View>
      <Text testID={`chat-chevron-${chat.id}`} style={styles.chevron}>
        {">"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View testID="chats-list-screen" style={styles.container}>
      {/* Header Section - Orange gradient */}
      <View testID="header-section" style={styles.headerSection}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>My AI Chats</Text>

        {/* Segmented Control */}
        <View testID="segmented-control" style={styles.segmentedControl}>
          <TouchableOpacity
            testID="tab-recent"
            style={[
              styles.segmentTab,
              activeTab === "recent" && styles.segmentTabActive,
            ]}
            onPress={() => onTabChange("recent")}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "recent" }}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeTab === "recent" && styles.segmentTabTextActive,
              ]}
            >
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="tab-trash"
            style={[
              styles.segmentTab,
              activeTab === "trash" && styles.segmentTabActive,
            ]}
            onPress={() => onTabChange("trash")}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "trash" }}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeTab === "trash" && styles.segmentTabTextActive,
              ]}
            >
              Trash
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView
        testID="content-area"
        style={styles.contentArea}
        showsVerticalScrollIndicator={false}
      >
        {/* Recent Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent ({recentCount})</Text>
            <TouchableOpacity
              testID="see-all-recent"
              onPress={onSeeAllRecent}
              accessibilityRole="button"
              accessibilityLabel="See all recent conversations"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentChats.map((chat) => renderChatItem(chat))}
        </View>

        {/* Trash Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trash ({trashCount})</Text>
            <TouchableOpacity
              testID="see-all-trash"
              onPress={onSeeAllTrash}
              accessibilityRole="button"
              accessibilityLabel="See all trash conversations"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {trashChats.map((chat) => renderChatItem(chat, true))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarEmoji: {
    fontSize: 20,
  },
  backButton: {
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.3)",
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
  chatAvatar: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    marginRight: 12,
    width: 48,
  },
  chatContent: {
    flex: 1,
  },
  chatItem: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  chatItemTrash: {
    opacity: 0.7,
  },
  chatStats: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
  chatTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  chatTitleTrash: {
    color: "#94A3B8",
  },
  chevron: {
    color: "#94A3B8",
    fontSize: 16,
    marginLeft: 8,
  },
  container: {
    flex: 1,
  },
  contentArea: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerSection: {
    backgroundColor: "#E8853A",
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  moodBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  moodBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  screenTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  seeAllText: {
    color: "#C4A574",
    fontSize: 14,
    fontWeight: "500",
  },
  segmentTab: {
    borderRadius: 16,
    flex: 1,
    paddingVertical: 8,
  },
  segmentTabActive: {
    backgroundColor: "#FFFFFF",
  },
  segmentTabText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  segmentTabTextActive: {
    color: "#E8853A",
  },
  segmentedControl: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 20,
    padding: 4,
  },
});

export default ChatsListScreen;
