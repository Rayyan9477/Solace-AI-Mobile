/**
 * Conversation List Screen - AI Therapy Chat History
 * Shows all past conversations with AI therapist
 */

import { MentalHealthIcon } from "@components/icons";
import { FreudLogo } from "@components/icons/FreudIcons";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  mood: "happy" | "neutral" | "sad" | "anxious";
  unread?: boolean;
}

export const ConversationListScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<"recent" | "today">("recent");

  const conversations: Conversation[] = [
    {
      id: "1",
      title: "Recent Breakup, feel...",
      lastMessage: "It's normal to feel this way",
      timestamp: "2h ago",
      mood: "sad",
      unread: true,
    },
    {
      id: "2",
      title: "Shitty Teacher at Uni...",
      lastMessage: "Let's talk about coping strategies",
      timestamp: "5h ago",
      mood: "anxious",
    },
    {
      id: "3",
      title: "Just wanna hang exist...",
      lastMessage: "That's okay, we can explore this",
      timestamp: "1d ago",
      mood: "neutral",
    },
    {
      id: "4",
      title: "More Zans this Xmas...",
      lastMessage: "I understand your concerns",
      timestamp: "2d ago",
      mood: "anxious",
    },
    {
      id: "5",
      title: "Tired of this excuse...",
      lastMessage: "Let's work through this together",
      timestamp: "3d ago",
      mood: "sad",
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      padding: 20,
      paddingTop: 8,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    moreButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    statsContainer: {
      alignItems: "center",
      marginBottom: 24,
    },
    totalConversations: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    statsLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: "row",
      gap: 40,
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
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    upgradeCard: {
      backgroundColor: theme.colors.green["20"],
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    upgradeContent: {
      flex: 1,
      marginRight: 12,
    },
    upgradeTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.green["100"],
      marginBottom: 4,
    },
    upgradeSubtitle: {
      fontSize: 12,
      color: theme.colors.green["80"],
    },
    upgradeButton: {
      backgroundColor: theme.colors.green["40"],
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    upgradeButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    filterContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      marginBottom: 16,
      gap: 12,
    },
    filterButton: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.orange["40"],
      borderColor: theme.colors.orange["40"],
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    filterButtonTextActive: {
      color: "#FFFFFF",
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    listContainer: {
      paddingHorizontal: 20,
    },
    conversationCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.background.secondary,
    },
    conversationCardUnread: {
      backgroundColor: theme.colors.orange["10"],
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    conversationContent: {
      flex: 1,
    },
    conversationTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    conversationLastMessage: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    conversationMeta: {
      alignItems: "flex-end",
    },
    conversationTime: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
      marginBottom: 4,
    },
    moodIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    newConversationButton: {
      position: "absolute",
      bottom: 24,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.orange["40"],
      borderRadius: 24,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      ...theme.getShadow("lg"),
    },
    newConversationButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      marginLeft: 8,
    },
  });

  const getMoodEmoji = (mood: Conversation["mood"]) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😢";
      case "anxious":
        return "😰";
      default:
        return "😐";
    }
  };

  const getMoodColor = (mood: Conversation["mood"]) => {
    switch (mood) {
      case "happy":
        return theme.colors.green["40"];
      case "neutral":
        return theme.colors.gray["40"];
      case "sad":
        return theme.colors.blue["40"];
      case "anxious":
        return theme.colors.yellow["40"];
      default:
        return theme.colors.gray["40"];
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[
        styles.conversationCard,
        item.unread && styles.conversationCardUnread,
      ]}
      onPress={() => navigation.navigate("Chat", { conversationId: item.id })}
    >
      <View
        style={[
          styles.avatarContainer,
          { backgroundColor: theme.colors.green["20"] },
        ]}
      >
        <FreudLogo size={24} primaryColor={theme.colors.green["60"]} />
      </View>

      <View style={styles.conversationContent}>
        <Text style={styles.conversationTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.conversationLastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      <View style={styles.conversationMeta}>
        <Text style={styles.conversationTime}>{item.timestamp}</Text>
        <View
          style={[
            styles.moodIndicator,
            { backgroundColor: getMoodColor(item.mood) },
          ]}
        >
          <Text style={{ fontSize: 14 }}>{getMoodEmoji(item.mood)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MentalHealthIcon
              name="ChevronLeft"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Conversations</Text>

          <TouchableOpacity style={styles.moreButton}>
            <MentalHealthIcon
              name="MoreVertical"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.totalConversations}>1571</Text>
          <Text style={styles.statsLabel}>Total Conversations</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: theme.colors.orange["20"] },
                ]}
              >
                <Text style={{ fontSize: 20 }}>📊</Text>
              </View>
              <Text style={styles.statValue}>32</Text>
              <Text style={styles.statLabel}>Left this month</Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: theme.colors.blue["20"] },
                ]}
              >
                <Text style={{ fontSize: 20 }}>⏱️</Text>
              </View>
              <Text style={styles.statValue}>Slow</Text>
              <Text style={styles.statLabel}>Response</Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: theme.colors.green["20"] },
                ]}
              >
                <Text style={{ fontSize: 20 }}>✓</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Upgrade Card */}
      <View style={styles.upgradeCard}>
        <View style={styles.upgradeContent}>
          <Text style={styles.upgradeTitle}>🎙️ Upgrade to Pro!</Text>
          <Text style={styles.upgradeSubtitle}>
            Get Pro access to Real Support with Voice
          </Text>
        </View>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Go Pro Now!</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "recent" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("recent")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "recent" && styles.filterButtonTextActive,
            ]}
          >
            Recent (4)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "today" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("today")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === "today" && styles.filterButtonTextActive,
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT (4)</Text>
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* New Conversation Button */}
      <TouchableOpacity
        style={styles.newConversationButton}
        onPress={() => navigation.navigate("NewConversation")}
      >
        <MentalHealthIcon name="Plus" size={24} color="#FFFFFF" />
        <Text style={styles.newConversationButtonText}>New Conversation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConversationListScreen;
