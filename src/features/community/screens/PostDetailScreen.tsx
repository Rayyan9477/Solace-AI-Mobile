/**
 * Post Detail Screen - Community Post Detail View
 * Based on ui-designs/Dark-mode/Community Support.png
 */

import { useNavigation, useRoute } from "@react-navigation/native";
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
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  type: "Story" | "Poll" | "Ask";
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export const PostDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const post: Post = {
    id: "1",
    author: "Shinomiya Kaguya",
    avatar: "👤",
    timestamp: "8 hrs · 74k followers",
    content: `I can't sleep well last night, what about you guys?

Dear grateful for Dad 💛 #gratefulchallenge #mentalhealth

Huge gratitude to all who help spread my joy!!!`,
    type: "Story",
    image: "https://example.com/nature-image.jpg",
    likes: 342,
    comments: 174,
    isLiked: false,
    isBookmarked: false,
  };

  const comments: Comment[] = [
    {
      id: "1",
      author: "Shinomiya Kaguya",
      avatar: "👤",
      timestamp: "8 hrs",
      content: `I think that's good that Dad 🥰 everyone has kindness we need to believe`,
      likes: 20,
    },
    {
      id: "2",
      author: "Makima Smith",
      avatar: "👤",
      timestamp: "7 hrs",
      content: `I'm glad my first meditation session felt really relaxing. My mind was all over the place SQAO #peacefullife #everyrdays`,
      likes: 14,
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
    moreButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    postCard: {
      backgroundColor: theme.colors.background.primary,
      padding: 20,
      borderBottomWidth: 8,
      borderBottomColor: theme.colors.gray["20"],
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.brown["40"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      fontSize: 24,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    postTimestamp: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    followButton: {
      backgroundColor: theme.colors.orange["60"],
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
    },
    followButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    postContent: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    postImage: {
      width: "100%",
      height: 240,
      borderRadius: 16,
      backgroundColor: theme.colors.gray["20"],
      marginBottom: 16,
    },
    postActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray["20"],
    },
    actionButton: {
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
    actionTextActive: {
      color: theme.colors.orange["60"],
    },
    commentsSection: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    commentCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    commentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    commentAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.brown["40"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    commentAvatarText: {
      fontSize: 18,
    },
    commentAuthor: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    commentTimestamp: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginLeft: 8,
    },
    commentContent: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    commentActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    commentActionButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    commentActionText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray["20"],
      gap: 12,
    },
    inputAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.brown["40"],
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 14,
      color: theme.colors.text.primary,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.green["60"],
      justifyContent: "center",
      alignItems: "center",
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.gray["40"],
    },
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      setCommentText("");
    }
  };

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
        <Text style={styles.headerTitle}>Community Post</Text>
        <TouchableOpacity
          style={styles.moreButton}
          accessible
          accessibilityLabel="More options"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.avatar}</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postTimestamp}>{post.timestamp}</Text>
              </View>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.image && <View style={styles.postImage} />}

            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLike}
              >
                <Text style={styles.actionIcon}>{isLiked ? "❤️" : "🤍"}</Text>
                <Text
                  style={[
                    styles.actionText,
                    isLiked && styles.actionTextActive,
                  ]}
                >
                  {post.likes + (isLiked ? 1 : 0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>↗️</Text>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleBookmark}
              >
                <Text style={styles.actionIcon}>
                  {isBookmarked ? "🔖" : "📑"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              Comments ({comments.length})
            </Text>

            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {comment.avatar}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentTimestamp}>
                        {comment.timestamp}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.commentContent}>{comment.content}</Text>

                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentActionButton}>
                    <Text style={{ fontSize: 14 }}>🤍</Text>
                    <Text style={styles.commentActionText}>
                      {comment.likes}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.commentActionButton}>
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputAvatar}>
            <Text style={styles.commentAvatarText}>👤</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Type your comment..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !commentText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!commentText.trim()}
          >
            <Text style={{ fontSize: 18 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PostDetailScreen;
