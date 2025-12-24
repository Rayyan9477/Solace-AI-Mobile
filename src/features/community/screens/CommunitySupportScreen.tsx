/**
 * Community Support Screen - Community feed and support groups
 * Based on ui-designs/Dark-mode/Community Support.png
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
  Image,
} from "react-native";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  time: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: { name: "Shinomiya Kaguya", avatar: "👤", verified: true },
    time: "2h ago",
    content:
      "Does anyone believe what I'm head just now?! I'm so happy today! #PositiveLife #Yolo #mentalhealth",
    tags: ["PositiveLife", "Yolo", "mentalhealth"],
    likes: 12,
    comments: 6,
  },
  {
    id: "2",
    author: { name: "Nadine G. Smith", avatar: "👤", verified: false },
    time: "5h ago",
    content:
      "I don't want believe what I'm head just now. I'm getting really Crazy #depression",
    tags: ["depression"],
    likes: 30,
    comments: 12,
  },
  {
    id: "3",
    author: { name: "Ash Ketchum", avatar: "👤", verified: false },
    time: "8h ago",
    content:
      "I don't here can live without friend of PLEASE #depression #alone #lonely",
    tags: ["depression", "alone", "lonely"],
    likes: 20,
    comments: 8,
  },
  {
    id: "4",
    author: { name: "Shinomiya Kaguya", avatar: "👤", verified: true },
    time: "1d ago",
    content: "Everything thank my Dad! I feel grateful for Dad!",
    tags: ["grateful"],
    likes: 32,
    comments: 5,
  },
];

export const CommunitySupportScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 8,
    },
    tabActive: {
      backgroundColor: theme.colors.brown["70"],
    },
    tabText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
    },
    tabTextActive: {
      color: theme.colors.background.secondary,
    },
    content: {
      flex: 1,
    },
    postCard: {
      backgroundColor: theme.colors.brown["10"],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.brown["20"],
      padding: 16,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.brown["30"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      fontSize: 20,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    postTime: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
    },
    verifiedBadge: {
      marginLeft: 4,
      fontSize: 12,
    },
    moreButton: {
      padding: 8,
    },
    postContent: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    postImage: {
      width: "100%",
      height: 200,
      borderRadius: 12,
      backgroundColor: theme.colors.brown["30"],
      marginBottom: 12,
    },
    postTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
    },
    tag: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown["70"],
    },
    postActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 24,
    },
    action: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    actionIcon: {
      fontSize: 18,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.brown["70"],
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    fabIcon: {
      fontSize: 28,
      color: theme.colors.background.secondary,
    },
  });

  const renderPost = (post: Post) => (
    <TouchableOpacity
      key={post.id}
      style={styles.postCard}
      onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
    >
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.author.avatar}</Text>
        </View>
        <View style={styles.authorInfo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {post.author.verified && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
          </View>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={{ fontSize: 20, color: theme.colors.text.secondary }}>
            ⋮
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Image (if exists) */}
      {post.image && <View style={styles.postImage} />}

      {/* Tags */}
      <View style={styles.postTags}>
        {/* LOW-NEW-002 FIX: Use post id + tag as stable key instead of index */}
        {post.tags.map((tag) => (
          <Text key={`tag-${post.id}-${tag}`} style={styles.tag}>
            #{tag}
          </Text>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={styles.actionText}>{post.likes}k</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community Feed</Text>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("CommunityNotifications")}
          >
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.tabActive]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.tabTextActive,
              ]}
            >
              All Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "following" && styles.tabActive]}
            onPress={() => setActiveTab("following")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "following" && styles.tabTextActive,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts Feed */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MOCK_POSTS.map(renderPost)}
      </ScrollView>

      {/* Add Post FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
CommunitySupportScreen.displayName = 'CommunitySupportScreen';

export default CommunitySupportScreen;
