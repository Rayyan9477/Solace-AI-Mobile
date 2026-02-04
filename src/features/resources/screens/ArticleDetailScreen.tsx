/**
 * ArticleDetailScreen Component
 * @description Full article reading view with content preview, author info,
 *   stats, and premium paywall
 * @task Task 3.13.4: Article Detail Screen (Screen 115)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix Replaced "Johann Liebert" with "Dr. Sarah Mitchell"
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface ArticleDetailScreenProps {
  title: string;
  categories: string[];
  rating: string;
  views: string;
  comments: string;
  authorName: string;
  isFollowing: boolean;
  contentPreview: string;
  onBack: () => void;
  onFollow: () => void;
  onGoPro: () => void;
}

const colors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: "#2A1F18",
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  badgeBg: palette.olive[500],
  followBg: "#2A1F18",
  paywallBg: palette.olive[500],
  proButtonBg: palette.olive[500],
} as const;

export function ArticleDetailScreen({
  title,
  categories,
  rating,
  views,
  comments,
  authorName,
  isFollowing,
  contentPreview,
  onBack,
  onFollow,
  onGoPro,
}: ArticleDetailScreenProps): React.ReactElement {
  return (
    <View testID="article-detail-screen" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            testID="back-button"
            style={styles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>{"\u263E"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article Detail</Text>
        </View>

        <View style={styles.badgesRow}>
          {categories.map((cat) => (
            <View key={cat} style={styles.badge}>
              <Text style={styles.badgeText}>{cat}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.articleTitle}>{title}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            {"\u2B50"} {rating}
          </Text>
          <Text style={styles.statText}>
            {"\uD83D\uDC41"} {views}
          </Text>
          <Text style={styles.statText}>
            {"\uD83D\uDCAC"} {comments}
          </Text>
        </View>

        <View style={styles.authorRow}>
          <View style={styles.authorAvatar} />
          <Text style={styles.authorName}>By {authorName}</Text>
          <TouchableOpacity
            testID="follow-button"
            style={styles.followButton}
            onPress={onFollow}
            accessibilityRole="button"
            accessibilityLabel={isFollowing ? "Unfollow" : "Follow"}
          >
            <Text style={styles.followText}>
              {isFollowing ? "Following" : "Follow +"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>
            {"\uD83D\uDD25"} Introduction
          </Text>
          <Text style={styles.contentText}>{contentPreview}</Text>
          <View style={styles.articleImage} />
        </View>

        <View testID="premium-paywall" style={styles.paywall}>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>GO PREMIUM</Text>
          </View>
          <Text style={styles.paywallTitle}>Unlock the Full Article</Text>
          <TouchableOpacity
            testID="go-pro-button"
            style={styles.goProButton}
            onPress={onGoPro}
            accessibilityRole="button"
            accessibilityLabel="Go Pro"
          >
            <Text style={styles.goProText}>Go Pro {"\u2B50"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  articleImage: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 12,
    height: 160,
    marginTop: 16,
    width: "100%",
  },
  articleTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 34,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  authorAvatar: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  authorName: {
    color: colors.white,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
  },
  authorRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 24,
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
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: "600" },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  container: { backgroundColor: colors.background, flex: 1 },
  contentSection: { marginTop: 24, paddingHorizontal: 24 },
  contentText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
  },
  followButton: {
    backgroundColor: colors.followBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  goProButton: {
    alignItems: "center",
    backgroundColor: colors.proButtonBg,
    borderRadius: 24,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  goProText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  paywall: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  paywallTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },
  premiumBadge: {
    backgroundColor: `${palette.white}${palette.alpha[15]}`,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  premiumBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  scrollContent: { paddingBottom: 48 },
  sectionHeader: { color: colors.white, fontSize: 18, fontWeight: "700" },
  statText: { color: colors.textSecondary, fontSize: 13, marginRight: 16 },
  statsRow: { flexDirection: "row", marginTop: 8, paddingHorizontal: 24 },
});

export default ArticleDetailScreen;
