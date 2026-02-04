/**
 * CourseDetailScreen Component
 * @description Full course detail view with curriculum, instructor info,
 *   download option, lesson list, and premium paywall
 * @task Task 3.13.5: Course Detail Screen (Screen 116)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix Replaced "Dr. Hannibal Lector" with "Dr. Sarah Mitchell"
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

interface LessonItem {
  id: string;
  title: string;
  duration: string;
  rating: string;
}

interface CourseDetailScreenProps {
  title: string;
  categories: string[];
  rating: string;
  views: string;
  lessonCount: string;
  instructorName: string;
  isFollowing: boolean;
  description: string;
  downloadSize: string;
  totalLessons: string;
  lessons: LessonItem[];
  onBack: () => void;
  onFollow: () => void;
  onDownload: () => void;
  onLessonPress: (id: string) => void;
  onGoPro: () => void;
}

const colors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: "#2A1F18",
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  badgeBg: palette.olive[500],
  followBg: "#2A1F18",
  downloadBg: "#2A1F18",
  paywallBg: palette.olive[500],
  proButtonBg: palette.olive[500],
} as const;

export function CourseDetailScreen({
  title,
  categories,
  rating,
  views,
  lessonCount,
  instructorName,
  isFollowing,
  description,
  downloadSize,
  totalLessons,
  lessons,
  onBack,
  onFollow,
  onDownload,
  onLessonPress,
  onGoPro,
}: CourseDetailScreenProps): React.ReactElement {
  return (
    <View testID="course-detail-screen" style={styles.container}>
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
          <Text style={styles.headerTitle}>Course Detail</Text>
        </View>

        <View style={styles.badgesRow}>
          {categories.map((cat) => (
            <View key={cat} style={styles.badge}>
              <Text style={styles.badgeText}>{cat}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.courseTitle}>{title}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            {"\u2B50"} {rating}
          </Text>
          <Text style={styles.statText}>
            {"\uD83D\uDC41"} {views}
          </Text>
          <Text style={styles.statText}>
            {"\uD83D\uDCD6"} {lessonCount}
          </Text>
        </View>

        <View style={styles.instructorRow}>
          <View style={styles.instructorAvatar} />
          <Text style={styles.instructorName}>By {instructorName}</Text>
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

        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnail} />
        </View>

        <Text style={styles.descriptionText}>{description}</Text>

        <TouchableOpacity
          testID="download-section"
          style={styles.downloadRow}
          onPress={onDownload}
          accessibilityRole="button"
          accessibilityLabel="Download for offline"
        >
          <Text style={styles.downloadLabel}>Offline Download</Text>
          <Text style={styles.downloadSize}>{downloadSize}</Text>
          <Text style={styles.downloadIcon}>{"\u2B07\uFE0F"}</Text>
        </TouchableOpacity>

        <View style={styles.lessonHeader}>
          <Text style={styles.lessonHeaderText}>{totalLessons}</Text>
        </View>

        {lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.id}
            testID={`lesson-row-${lesson.id}`}
            style={styles.lessonRow}
            onPress={() => onLessonPress(lesson.id)}
            accessibilityRole="button"
            accessibilityLabel={`${lesson.title}, ${lesson.duration}`}
          >
            <View style={styles.lessonPlayIcon}>
              <Text style={styles.lessonPlayText}>{"\u25B6"}</Text>
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <View style={styles.lessonMeta}>
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                <Text style={styles.lessonRating}>
                  {"\u2B50"} {lesson.rating}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View testID="premium-paywall" style={styles.paywall}>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>GO PREMIUM</Text>
          </View>
          <Text style={styles.paywallTitle}>Unlock the Full Course</Text>
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
  courseTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 34,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  downloadIcon: { fontSize: 18 },
  downloadLabel: {
    color: colors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  downloadRow: {
    alignItems: "center",
    backgroundColor: colors.downloadBg,
    borderRadius: 16,
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
  },
  downloadSize: { color: colors.textSecondary, fontSize: 13, marginRight: 12 },
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
  instructorAvatar: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  instructorName: {
    color: colors.white,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
  },
  instructorRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  lessonDuration: {
    color: colors.textSecondary,
    fontSize: 12,
    marginRight: 12,
  },
  lessonHeader: { marginTop: 24, paddingHorizontal: 24 },
  lessonHeaderText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  lessonInfo: { flex: 1, marginLeft: 12 },
  lessonMeta: { flexDirection: "row", marginTop: 4 },
  lessonPlayIcon: {
    alignItems: "center",
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  lessonPlayText: { color: colors.white, fontSize: 14 },
  lessonRating: { color: colors.textSecondary, fontSize: 12 },
  lessonRow: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 8,
    padding: 12,
  },
  lessonTitle: { color: colors.white, fontSize: 15, fontWeight: "600" },
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
  statText: { color: colors.textSecondary, fontSize: 13, marginRight: 16 },
  statsRow: { flexDirection: "row", marginTop: 8, paddingHorizontal: 24 },
  thumbnail: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 12,
    height: 160,
    width: "100%",
  },
  thumbnailContainer: { marginTop: 16, paddingHorizontal: 24 },
});

export default CourseDetailScreen;
