/**
 * UserProfileScreen Component
 * @description Public profile view with avatar, stats, follow/message actions,
 *   bio, and content tabs
 * @task Task 3.14.8: User Profile Screen (Screen 126)
 * @audit-fix Replaced "Shinomiya Kaguya" with appropriate placeholder name
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

interface TabItem {
  id: string;
  label: string;
}

interface UserProfileScreenProps {
  username: string;
  postCount: string;
  followingCount: string;
  followerCount: string;
  location: string;
  bio: string;
  tabs: TabItem[];
  selectedTabId: string;
  isFollowing: boolean;
  onBack: () => void;
  onFollow: () => void;
  onMessage: () => void;
  onTabSelect: (id: string) => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  followBg: "#C4A574",
  followText: "#1C1410",
  messageBg: "#2A1F18",
  tabBg: "#2A1F18",
  tabSelected: "#C4A574",
  tabSelectedText: "#1C1410",
} as const;

export function UserProfileScreen({
  username,
  postCount,
  followingCount,
  followerCount,
  location,
  bio,
  tabs,
  selectedTabId,
  isFollowing,
  onBack,
  onFollow,
  onMessage,
  onTabSelect,
}: UserProfileScreenProps): React.ReactElement {
  return (
    <View testID="user-profile-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View testID="profile-avatar" style={styles.avatar} />
          <Text style={styles.username}>{username}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity
              testID="follow-button"
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={onFollow}
              accessibilityRole="button"
              accessibilityLabel={isFollowing ? "Unfollow" : "Follow"}
            >
              <Text style={[styles.followText, isFollowing && styles.followingText]}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="message-button"
              style={styles.messageButton}
              onPress={onMessage}
              accessibilityRole="button"
              accessibilityLabel="Message"
            >
              <Text style={styles.messageText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>{postCount}</Text>
          <Text style={styles.statText}>{followingCount}</Text>
          <Text style={styles.statText}>{followerCount}</Text>
        </View>

        {/* Location */}
        <Text style={styles.location}>{"\uD83D\uDCCD"} {location}</Text>

        {/* Bio */}
        <Text style={styles.bio}>{bio}</Text>

        {/* Content Tabs */}
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              testID={`tab-${tab.id}`}
              style={[styles.tab, selectedTabId === tab.id && styles.tabSelected]}
              onPress={() => onTabSelect(tab.id)}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <Text style={[styles.tabText, selectedTabId === tab.id && styles.tabTextSelected]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  avatar: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 48,
    height: 96,
    width: 96,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  bio: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  container: { backgroundColor: colors.background, flex: 1 },
  followButton: {
    backgroundColor: colors.followBg,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  followText: { color: colors.followText, fontSize: 14, fontWeight: "600" },
  followingButton: { backgroundColor: colors.tabBg },
  followingText: { color: colors.white },
  location: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  messageButton: {
    backgroundColor: colors.messageBg,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  messageText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  profileHeader: { alignItems: "center", marginTop: 16 },
  scrollContent: { paddingBottom: 48 },
  statText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  tab: {
    alignItems: "center",
    backgroundColor: colors.tabBg,
    borderRadius: 20,
    flex: 1,
    paddingVertical: 10,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  tabSelected: { backgroundColor: colors.tabSelected },
  tabText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  tabTextSelected: { color: colors.tabSelectedText },
  username: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 16,
  },
});

export default UserProfileScreen;
