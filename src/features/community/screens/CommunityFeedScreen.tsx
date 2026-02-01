/**
 * CommunityFeedScreen Component
 * @description Main community feed with user profile badge, browse filters,
 *   post cards with engagement metrics, and FAB for new posts
 * @task Task 3.14.2: Community Feed Screen (Screen 120)
 * @audit-fix Replaced anime character names with appropriate placeholders
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface FilterItem {
  id: string;
  label: string;
  emoji?: string;
}

interface PostItem {
  id: string;
  authorName: string;
  authorBadge: string;
  timestamp: string;
  content: string;
  viewCount: string;
  likeCount: string;
}

interface CommunityFeedScreenProps {
  username: string;
  totalPosts: string;
  rating: string;
  filters: FilterItem[];
  selectedFilterId: string | null;
  posts: PostItem[];
  onBack: () => void;
  onFilterSelect: (id: string) => void;
  onPostPress: (id: string) => void;
  onPostLike: (id: string) => void;
  onPostShare: (id: string) => void;
  onAddPost: () => void;
  onProfilePress: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  pillBg: "#2A1F18",
  pillSelected: "#E8853A",
  badgeBg: "#3D2E23",
  fabBg: "#5C4A2A",
  engagementText: "rgba(255,255,255,0.5)",
} as const;

export function CommunityFeedScreen({
  username,
  totalPosts,
  rating,
  filters,
  selectedFilterId,
  posts,
  onBack,
  onFilterSelect,
  onPostPress,
  onAddPost,
}: CommunityFeedScreenProps): React.ReactElement {
  return (
    <View testID="community-feed-screen" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>{"\u2190"}</Text>
          </TouchableOpacity>
          <View style={styles.userBadge}>
            <View style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{username}</Text>
              <View style={styles.userStats}>
                <Text style={styles.userStatText}>{totalPosts}</Text>
                <Text style={styles.userStatText}>
                  {"\u2B50"} {rating}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Browse By */}
        <View style={styles.browseSection}>
          <Text style={styles.browseLabel}>Browse By</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                testID={`filter-pill-${filter.id}`}
                style={[
                  styles.filterPill,
                  selectedFilterId === filter.id && styles.filterPillSelected,
                ]}
                onPress={() => onFilterSelect(filter.id)}
                accessibilityRole="button"
                accessibilityLabel={filter.label}
              >
                <Text style={styles.filterPillText}>
                  {filter.emoji ? `${filter.emoji} ` : ""}
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Post Cards */}
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            testID={`post-card-${post.id}`}
            style={styles.postCard}
            onPress={() => onPostPress(post.id)}
            accessibilityRole="button"
            accessibilityLabel={`Post by ${post.authorName}`}
          >
            <View style={styles.postAuthorRow}>
              <View style={styles.postAvatar} />
              <View style={styles.postAuthorInfo}>
                <Text style={styles.postAuthorName}>{post.authorName}</Text>
                <Text style={styles.postBadge}>{post.authorBadge}</Text>
              </View>
              <Text style={styles.postTimestamp}>{post.timestamp}</Text>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementText}>
                {"\uD83D\uDC41"} {post.viewCount}
              </Text>
              <Text style={styles.engagementText}>
                {"\u2764\uFE0F"} {post.likeCount}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        testID="add-post-fab"
        style={styles.fab}
        onPress={onAddPost}
        accessibilityRole="button"
        accessibilityLabel="Add new post"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  browseLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  browseSection: { marginTop: 16, paddingHorizontal: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  engagementRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  engagementText: { color: colors.engagementText, fontSize: 13 },
  fab: {
    alignItems: "center",
    backgroundColor: colors.fabBg,
    borderRadius: 28,
    bottom: 24,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    right: 24,
    width: 56,
  },
  fabIcon: { color: colors.white, fontSize: 28, fontWeight: "300" },
  filterPill: {
    backgroundColor: colors.pillBg,
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterPillSelected: { backgroundColor: colors.pillSelected },
  filterPillText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  filterRow: { paddingRight: 24 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  postAuthorInfo: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: 8,
    marginLeft: 12,
  },
  postAuthorName: { color: colors.white, fontSize: 14, fontWeight: "600" },
  postAuthorRow: { alignItems: "center", flexDirection: "row" },
  postAvatar: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 18,
    height: 36,
    width: 36,
  },
  postBadge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 8,
    color: colors.textSecondary,
    fontSize: 11,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  postCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
  },
  postContent: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  postTimestamp: { color: colors.textSecondary, fontSize: 12 },
  scrollContent: { paddingBottom: 96 },
  userBadge: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    marginLeft: 12,
  },
  userInfo: { marginLeft: 12 },
  userStatText: { color: colors.textSecondary, fontSize: 12, marginRight: 12 },
  userStats: { flexDirection: "row", marginTop: 2 },
  username: { color: colors.white, fontSize: 15, fontWeight: "700" },
});

export default CommunityFeedScreen;
