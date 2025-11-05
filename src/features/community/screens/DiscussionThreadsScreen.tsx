/**
 * Discussion Threads Screen - Topic-Based Conversations
 * Based on ui-designs/Dark-mode/🔒 Community Support.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Thread {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned: boolean;
  isLocked: boolean;
}

export const DiscussionThreadsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Topics", icon: "📚" },
    { id: "anxiety", name: "Anxiety", icon: "😰" },
    { id: "depression", name: "Depression", icon: "😔" },
    { id: "relationships", name: "Relationships", icon: "💑" },
    { id: "work", name: "Work & Career", icon: "💼" },
    { id: "wellness", name: "Wellness", icon: "🌱" },
  ];

  const threads: Thread[] = [
    {
      id: "1",
      title: "Tips for managing workplace anxiety",
      author: "Sarah K.",
      authorAvatar: "👩",
      category: "Anxiety",
      replies: 45,
      views: 1240,
      lastActivity: "2 hours ago",
      isPinned: true,
      isLocked: false,
    },
    {
      id: "2",
      title: "My journey with therapy - 6 months update",
      author: "Michael R.",
      authorAvatar: "👨",
      category: "Wellness",
      replies: 32,
      views: 890,
      lastActivity: "5 hours ago",
      isPinned: false,
      isLocked: false,
    },
    {
      id: "3",
      title: "Coping with seasonal depression",
      author: "Emma L.",
      authorAvatar: "👱‍♀️",
      category: "Depression",
      replies: 67,
      views: 2150,
      lastActivity: "1 day ago",
      isPinned: true,
      isLocked: false,
    },
    {
      id: "4",
      title: "How to communicate better in relationships",
      author: "James T.",
      authorAvatar: "🧑",
      category: "Relationships",
      replies: 28,
      views: 756,
      lastActivity: "2 days ago",
      isPinned: false,
      isLocked: false,
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
    newThreadButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    categoriesScroll: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    categoriesRow: {
      flexDirection: "row",
      gap: 8,
    },
    categoryButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["10"],
      gap: 6,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.purple["60"],
    },
    categoryIcon: {
      fontSize: 16,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    categoryTextActive: {
      color: "#FFFFFF",
    },
    threadsContainer: {
      paddingHorizontal: 20,
    },
    threadCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: "transparent",
    },
    threadCardPinned: {
      borderLeftColor: theme.colors.purple["60"],
    },
    threadHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    threadAuthorAvatar: {
      fontSize: 24,
      marginRight: 12,
    },
    threadAuthorInfo: {
      flex: 1,
    },
    threadAuthor: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    threadBadges: {
      flexDirection: "row",
      gap: 6,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    pinnedBadge: {
      backgroundColor: theme.colors.purple["60"],
    },
    lockedBadge: {
      backgroundColor: theme.colors.gray["60"],
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
    threadTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      lineHeight: 22,
    },
    threadCategory: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.purple["60"],
      marginBottom: 12,
    },
    threadStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    threadStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    threadStatIcon: {
      fontSize: 14,
    },
    threadStatText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    threadLastActivity: {
      flex: 1,
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      textAlign: "right",
    },
    createButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.purple["60"],
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    createButtonText: {
      fontSize: 28,
      color: "#FFFFFF",
    },
  });

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
        <Text style={styles.headerTitle}>Discussion Threads</Text>
        <TouchableOpacity
          style={styles.newThreadButton}
          accessible
          accessibilityLabel="Search threads"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          <View style={styles.categoriesRow}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Threads List */}
        <View style={styles.threadsContainer}>
          {threads.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              style={[
                styles.threadCard,
                thread.isPinned && styles.threadCardPinned,
              ]}
              onPress={() =>
                navigation.navigate("PostDetail", { id: thread.id })
              }
            >
              <View style={styles.threadHeader}>
                <Text style={styles.threadAuthorAvatar}>
                  {thread.authorAvatar}
                </Text>
                <View style={styles.threadAuthorInfo}>
                  <Text style={styles.threadAuthor}>{thread.author}</Text>
                </View>
                <View style={styles.threadBadges}>
                  {thread.isPinned && (
                    <View style={[styles.badge, styles.pinnedBadge]}>
                      <Text style={styles.badgeText}>📌 Pinned</Text>
                    </View>
                  )}
                  {thread.isLocked && (
                    <View style={[styles.badge, styles.lockedBadge]}>
                      <Text style={styles.badgeText}>🔒 Locked</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.threadTitle}>{thread.title}</Text>
              <Text style={styles.threadCategory}>#{thread.category}</Text>

              <View style={styles.threadStats}>
                <View style={styles.threadStat}>
                  <Text style={styles.threadStatIcon}>💬</Text>
                  <Text style={styles.threadStatText}>{thread.replies}</Text>
                </View>
                <View style={styles.threadStat}>
                  <Text style={styles.threadStatIcon}>👁️</Text>
                  <Text style={styles.threadStatText}>{thread.views}</Text>
                </View>
                <Text style={styles.threadLastActivity}>
                  {thread.lastActivity}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Create Thread Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreatePost")}
        accessible
        accessibilityLabel="Create new thread"
        accessibilityRole="button"
      >
        <Text style={styles.createButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DiscussionThreadsScreen;
