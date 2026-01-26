/**
 * PostCard Component
 * @description Community post card with author, content, and engagement
 * @task Task 2.9.4: PostCard Component
 */

import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import type { PostCardProps } from "./PostCard.types";
import { formatTimestamp, formatCount } from "./PostCard.types";

export function PostCard({
  id,
  author,
  content,
  timestamp,
  imageUrl,
  viewCount,
  likeCount,
  isLiked,
  onPress,
  onLikePress,
  onSharePress,
  style,
  testID,
  accessibilityLabel,
}: PostCardProps): React.ReactElement {
  const timeLabel = formatTimestamp(timestamp);
  const handlePress = () => onPress?.(id);
  const handleLike = () => onLikePress?.(id);
  const handleShare = () => onSharePress?.(id);

  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress: handlePress, accessibilityRole: "button" as const } : {};

  return (
    <Container testID={testID} accessibilityLabel={accessibilityLabel || `Post by ${author.username}`} style={[styles.container, style]} {...containerProps}>
      {/* Author Row */}
      <View style={styles.authorRow}>
        <Image source={{ uri: author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <View style={styles.usernameRow}>
            <Text style={styles.username}>{author.username}</Text>
            {author.isVerified && <Text style={styles.verified}>✓</Text>}
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.badge}>{author.badge}</Text>
            <Text style={styles.timestamp}>{timeLabel}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <Text style={styles.content}>{content}</Text>

      {/* Image */}
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />}

      {/* Engagement Row */}
      <View style={styles.engagementRow}>
        <Text style={styles.metricText}>👁 {formatCount(viewCount)}</Text>
        <TouchableOpacity onPress={handleLike}>
          <Text style={[styles.metricText, isLiked && styles.liked]}>
            {isLiked ? "♥" : "♡"} {formatCount(likeCount)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.metricText}>↗ Share</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  authorInfo: { flex: 1, marginLeft: 12 },
  authorRow: { flexDirection: "row", marginBottom: 12 },
  avatar: { backgroundColor: "#475569", borderRadius: 20, height: 40, width: 40 },
  badge: { backgroundColor: "#475569", borderRadius: 8, color: "#FFFFFF", fontSize: 10, paddingHorizontal: 6, paddingVertical: 2 },
  container: { backgroundColor: "#334155", borderRadius: 12, padding: 16 },
  content: { color: "#FFFFFF", fontSize: 14, lineHeight: 20 },
  engagementRow: { flexDirection: "row", gap: 16, marginTop: 12 },
  image: { backgroundColor: "#475569", borderRadius: 8, height: 200, marginTop: 12, width: "100%" },
  liked: { color: "#E8853A" },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 2 },
  metricText: { color: "#94A3B8", fontSize: 12 },
  timestamp: { color: "#64748B", fontSize: 12 },
  username: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  usernameRow: { flexDirection: "row", gap: 4 },
  verified: { color: "#9AAD5C", fontSize: 14 },
});

export default PostCard;
