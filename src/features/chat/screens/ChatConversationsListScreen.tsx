/**
 * Chat Conversations List Screen - My AI Conversations
 * Based on ui-designs/Dark-mode/AI Therapy Chatbot.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  mood: string;
  isOngoing: boolean;
}

export const ChatConversationsListScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"recent" | "trash">("recent");

  const stats = {
    totalConversations: 1571,
    leftThisMonth: 32,
    usage: "Slow",
  };

  const recentConversations: Conversation[] = [
    {
      id: "1",
      title: "Recent Breakup, Depression",
      preview: "AI • 5 hour • 🟢 New",
      date: "5 hour",
      mood: "😊",
      isOngoing: true,
    },
    {
      id: "2",
      title: "Shitty Teacher at University",
      preview: "AI • 2 days • Happy",
      date: "2 days",
      mood: "😊",
      isOngoing: false,
    },
    {
      id: "3",
      title: "Just wanna sleep, don't want to do anything",
      preview: "AI • 4 days • Lonely",
      date: "4 days",
      mood: "😔",
      isOngoing: false,
    },
  ];

  const trashConversations: Conversation[] = [
    {
      id: "4",
      title: "Mom Zara this Xmas...",
      preview: "AI • 5 days • Overwhelmed",
      date: "5 days",
      mood: "😰",
      isOngoing: false,
    },
    {
      id: "5",
      title: "Tired of this excuse. Just shut the hell up!",
      preview: "AI • 1 hour • Neutral",
      date: "1 hour",
      mood: "😐",
      isOngoing: false,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    searchButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    statsCard: {
      backgroundColor: theme.colors.brown["10"],
      margin: 20,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
    },
    totalNumber: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 20,
    },
    statsRow: {
      flexDirection: "row",
      gap: 40,
      marginBottom: 20,
    },
    statItem: {
      alignItems: "center",
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    upgradeButton: {
      backgroundColor: theme.colors.green["60"],
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    upgradeButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    tabsRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 16,
    },
    tab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["10"],
    },
    tabActive: {
      backgroundColor: theme.colors.orange["60"],
    },
    tabText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    tabTextActive: {
      color: "#FFFFFF",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    seeAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    seeAllText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.brown["60"],
    },
    conversationsList: {
      paddingHorizontal: 20,
    },
    conversationCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    conversationMood: {
      fontSize: 32,
      marginRight: 12,
    },
    conversationInfo: {
      flex: 1,
    },
    conversationTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    conversationPreview: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    newBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.green["60"],
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.green["60"],
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    addButtonText: {
      fontSize: 28,
      color: "#FFFFFF",
    },
  });

  const conversations =
    activeTab === "recent" ? recentConversations : trashConversations;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Conversations</Text>
        <TouchableOpacity
          style={styles.searchButton}
          accessible
          accessibilityLabel="Search"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.totalNumber}>{stats.totalConversations}</Text>
          <Text style={styles.totalLabel}>Total Conversations</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: theme.colors.orange["40"] },
                ]}
              >
                <Text style={{ fontSize: 24 }}>📊</Text>
              </View>
              <Text style={styles.statValue}>{stats.leftThisMonth}</Text>
              <Text style={styles.statLabel}>Left this month</Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: theme.colors.green["40"] },
                ]}
              >
                <Text style={{ fontSize: 24 }}>⚡</Text>
              </View>
              <Text style={styles.statValue}>{stats.usage}</Text>
              <Text style={styles.statLabel}>Usage</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={{ fontSize: 16 }}>✨</Text>
            <Text style={styles.upgradeButtonText}>Upgrade to Pro!</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "recent" && styles.tabActive]}
            onPress={() => setActiveTab("recent")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "recent" && styles.tabTextActive,
              ]}
            >
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "trash" && styles.tabActive]}
            onPress={() => setActiveTab("trash")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "trash" && styles.tabTextActive,
              ]}
            >
              Trash
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === "recent" ? "Recent (4)" : "Trash (16)"}
          </Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Conversations List */}
        <View style={styles.conversationsList}>
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationCard}
              onPress={() =>
                navigation.navigate("Chat", { conversationId: conversation.id })
              }
            >
              <Text style={styles.conversationMood}>{conversation.mood}</Text>
              <View style={styles.conversationInfo}>
                <Text style={styles.conversationTitle}>
                  {conversation.title}
                </Text>
                <Text style={styles.conversationPreview}>
                  {conversation.preview}
                </Text>
              </View>
              {conversation.isOngoing && <View style={styles.newBadge} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("NewConversation")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export const ChatConversationsListScreenWithBoundary = () => (
  <ScreenErrorBoundary screenName="Chat Conversations">
    <ChatConversationsListScreen />
  </ScreenErrorBoundary>
);

export default ChatConversationsListScreenWithBoundary;
