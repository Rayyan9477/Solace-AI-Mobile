/**
 * ChatsListScreen Component
 * @description List of AI chat conversations with Recent and Trash sections
 * @task Task 3.6.3: Chats List Screen (Screen 49)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { palette } from "../../../shared/theme";
import { EmptyState } from "../../../shared/components/molecules/feedback";
import { ScreenContainer } from "../../../shared/components/atoms/layout";

type TabType = "recent" | "trash";

interface ChatConversation {
  id: string;
  title: string;
  messageCount: number;
  mood: string;
  moodColor: string;
}

interface ChatsListScreenProps {
  recentChats?: ChatConversation[];
  trashChats?: ChatConversation[];
  recentCount?: number;
  trashCount?: number;
  activeTab?: TabType;
  onBack?: () => void;
  onTabChange?: (tab: TabType) => void;
  onChatPress?: (id: string) => void;
  onSeeAllRecent?: () => void;
  onSeeAllTrash?: () => void;
  onNewChat?: () => void;
}

export function ChatsListScreen({
  recentChats = [],
  trashChats = [],
  recentCount = 0,
  trashCount = 0,
  activeTab = "recent",
  onBack,
  onTabChange,
  onChatPress,
  onSeeAllRecent,
  onSeeAllTrash,
  onNewChat,
}: ChatsListScreenProps = {}): React.ReactElement {
  const renderChatItem = (chat: ChatConversation, isTrash: boolean = false) => (
    <TouchableOpacity
      key={chat.id}
      testID={`chat-item-${chat.id}`}
      style={[styles.chatItem, isTrash && styles.chatItemTrash]}
      onPress={() => onChatPress?.(chat.id)}
      accessibilityRole="button"
      accessibilityLabel={`Open conversation: ${chat.title}`}
    >
      <View testID={`chat-avatar-${chat.id}`} style={styles.chatAvatar}>
        <Icon name="chatbubble-outline" size={24} color={palette.white} />
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
    <ScreenContainer testID="chats-list-screen" style={styles.container}>
      {/* Header Section - Orange gradient */}
      <LinearGradient
        testID="header-section"
        colors={["#E8853A", "#C06A28"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerSection}
      >
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle} accessibilityRole="header">My AI Chats</Text>

        {/* Segmented Control */}
        <View testID="segmented-control" style={styles.segmentedControl}>
          <TouchableOpacity
            testID="tab-recent"
            style={[
              styles.segmentTab,
              activeTab === "recent" && styles.segmentTabActive,
            ]}
            onPress={() => onTabChange?.("recent")}
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
            onPress={() => onTabChange?.("trash")}
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
      </LinearGradient>

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
          {recentChats.length === 0 ? (
            <EmptyState
              testID="recent-chats-empty"
              title="No conversations yet"
              description="Start your first AI therapy session"
              action={
                onNewChat
                  ? { label: "New Conversation", onPress: onNewChat }
                  : undefined
              }
              variant="card"
            />
          ) : (
            recentChats.map((chat) => renderChatItem(chat))
          )}
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
          {trashChats.length === 0 ? (
            <EmptyState
              testID="trash-chats-empty"
              title="Trash is empty"
              description="Deleted conversations will appear here"
              variant="compact"
            />
          ) : (
            trashChats.map((chat) => renderChatItem(chat, true))
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
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
  chatAvatar: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
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
    backgroundColor: palette.brown[800],
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
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 4,
  },
  chatTitle: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
  },
  chatTitleTrash: {
    color: palette.gray[400],
  },
  chevron: {
    color: palette.gray[400],
    fontSize: 16,
    marginLeft: 8,
  },
  container: {
    flex: 1,
  },
  contentArea: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerSection: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  moodBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  moodBadgeText: {
    color: palette.white,
    fontSize: 11,
    fontWeight: "600",
  },
  screenTitle: {
    color: palette.white,
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
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  seeAllText: {
    color: palette.tan[500],
    fontSize: 14,
    fontWeight: "500",
  },
  segmentTab: {
    borderRadius: 16,
    flex: 1,
    paddingVertical: 8,
  },
  segmentTabActive: {
    backgroundColor: palette.white,
  },
  segmentTabText: {
    color: `${palette.white}${palette.alpha[70]}`,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  segmentTabTextActive: {
    color: palette.onboarding.step2,
  },
  segmentedControl: {
    backgroundColor: `${palette.white}${palette.alpha[20]}`,
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 20,
    padding: 4,
  },
});

export default ChatsListScreen;
