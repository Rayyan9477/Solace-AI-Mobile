/**
 * NewPostComposerScreen Component
 * @description Post composition screen with content input, post type selector,
 *   media toolbar, privacy toggle, and publish/draft actions
 * @task Task 3.14.4: New Post Composer Screen (Screen 122)
 * @audit-fix Replaced anime character names with appropriate placeholders
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface PostTypeItem {
  id: string;
  label: string;
}

interface NewPostComposerScreenProps {
  username: string;
  totalPosts: string;
  rating: string;
  content: string;
  characterCount: number;
  maxCharacters: number;
  postTypes: PostTypeItem[];
  selectedPostTypeId: string;
  isPrivate: boolean;
  onBack: () => void;
  onContentChange: (text: string) => void;
  onPostTypeSelect: (id: string) => void;
  onCameraPress: () => void;
  onMicPress: () => void;
  onEmojiPress: () => void;
  onPrivacyToggle: () => void;
  onSaveDraft: () => void;
  onPost: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  cardBg: palette.background.secondary,
  textSecondary: palette.text.secondary,
  badgeBg: palette.background.tertiary,
  pillBg: palette.background.secondary,
  pillSelected: palette.accent.green,
  toggleOff: palette.background.tertiary,
  toggleOn: palette.accent.green,
  draftButtonBg: palette.background.secondary,
  postButtonBg: palette.primary.gold,
  postButtonText: palette.background.primary,
  toolbarIcon: palette.text.tertiary,
} as const;

export function NewPostComposerScreen({
  username,
  totalPosts,
  rating,
  content,
  characterCount,
  maxCharacters,
  postTypes,
  selectedPostTypeId,
  isPrivate,
  onBack,
  onContentChange,
  onPostTypeSelect,
  onCameraPress,
  onMicPress,
  onEmojiPress,
  onPrivacyToggle,
  onSaveDraft,
  onPost,
}: NewPostComposerScreenProps): React.ReactElement {
  return (
    <View testID="new-post-composer-screen" style={styles.container}>
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Community Post</Text>
          </View>
        </View>

        {/* Post Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Post Content</Text>
          <View style={styles.composerCard}>
            <View style={styles.userRow}>
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
            <TextInput
              testID="post-text-input"
              style={styles.textInput}
              value={content}
              onChangeText={onContentChange}
              multiline
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Post content"
            />
            <Text style={styles.charCount}>
              {characterCount}/{maxCharacters}
            </Text>
            <View style={styles.toolbar}>
              <TouchableOpacity
                testID="camera-button"
                style={styles.toolbarButton}
                onPress={onCameraPress}
                accessibilityRole="button"
                accessibilityLabel="Add photo"
              >
                <Text style={styles.toolbarIcon}>{"\uD83D\uDCF7"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="mic-button"
                style={styles.toolbarButton}
                onPress={onMicPress}
                accessibilityRole="button"
                accessibilityLabel="Add voice note"
              >
                <Text style={styles.toolbarIcon}>{"\uD83C\uDF99\uFE0F"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="emoji-button"
                style={styles.toolbarButton}
                onPress={onEmojiPress}
                accessibilityRole="button"
                accessibilityLabel="Add emoji"
              >
                <Text style={styles.toolbarIcon}>{"\uD83D\uDE0A"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Post Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Post Type</Text>
          <View style={styles.typePillsRow}>
            {postTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                testID={`post-type-${type.id}`}
                style={[
                  styles.typePill,
                  selectedPostTypeId === type.id && styles.typePillSelected,
                ]}
                onPress={() => onPostTypeSelect(type.id)}
                accessibilityRole="button"
                accessibilityLabel={type.label}
              >
                <Text style={styles.typePillText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Toggle */}
        <View style={styles.privacySection}>
          <View style={styles.privacyInfo}>
            <Text style={styles.privacyLabel}>Hide from Community?</Text>
            <Text style={styles.privacyDescription}>
              This post will be private.
            </Text>
          </View>
          <TouchableOpacity
            testID="privacy-toggle"
            style={[
              styles.toggle,
              isPrivate ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={onPrivacyToggle}
            accessibilityRole="button"
            accessibilityLabel={
              isPrivate ? "Make post public" : "Make post private"
            }
          >
            <View
              style={[
                styles.toggleThumb,
                isPrivate && styles.toggleThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            testID="save-draft-button"
            style={styles.draftButton}
            onPress={onSaveDraft}
            accessibilityRole="button"
            accessibilityLabel="Save as draft"
          >
            <Text style={styles.draftButtonText}>Save As Draft {"\u2713"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="post-button"
            style={styles.postButton}
            onPress={onPost}
            accessibilityRole="button"
            accessibilityLabel="Post"
          >
            <Text style={styles.postButtonText}>Post {"\u2192"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  avatar: {
    backgroundColor: palette.opacity.white10,
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
  badge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 12,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: "600" },
  charCount: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    textAlign: "right",
  },
  composerCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginTop: 12,
    padding: 16,
  },
  container: { backgroundColor: colors.background, flex: 1 },
  draftButton: {
    alignItems: "center",
    backgroundColor: colors.draftButtonBg,
    borderRadius: 24,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 14,
  },
  draftButtonText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  pillBg: { backgroundColor: colors.pillBg },
  postButton: {
    alignItems: "center",
    backgroundColor: colors.postButtonBg,
    borderRadius: 24,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 14,
  },
  postButtonText: {
    color: colors.postButtonText,
    fontSize: 14,
    fontWeight: "700",
  },
  privacyDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  privacyInfo: { flex: 1 },
  privacyLabel: { color: colors.white, fontSize: 15, fontWeight: "600" },
  privacySection: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  scrollContent: { paddingBottom: 48 },
  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionTitle: { color: colors.white, fontSize: 16, fontWeight: "700" },
  textInput: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  toggle: {
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 2,
    width: 52,
  },
  toggleOff: { backgroundColor: colors.toggleOff },
  toggleOn: { backgroundColor: colors.toggleOn },
  toggleThumb: {
    backgroundColor: colors.white,
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  toggleThumbActive: { alignSelf: "flex-end" },
  toolbar: { flexDirection: "row", gap: 16, marginTop: 12 },
  toolbarButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  toolbarIcon: { fontSize: 20 },
  typePill: {
    backgroundColor: colors.pillBg,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typePillSelected: { backgroundColor: colors.pillSelected },
  typePillText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  typePillsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  userInfo: { marginLeft: 12 },
  userRow: { alignItems: "center", flexDirection: "row" },
  userStatText: { color: colors.textSecondary, fontSize: 12, marginRight: 12 },
  userStats: { flexDirection: "row", marginTop: 2 },
  username: { color: colors.white, fontSize: 15, fontWeight: "700" },
});

export default NewPostComposerScreen;
