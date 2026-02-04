/**
 * ResourcesHomeScreen Component
 * @description Main resources dashboard with featured resource, article carousel,
 *   course list, and bottom FAB
 * @task Task 3.13.1: Resources Home Screen (Screen 112)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix Replaced "Freud App" with "Solace App" per branding guidelines
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

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  views: string;
  likes: string;
  comments: string;
}

interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  rating: string;
  views: string;
  lessons: string;
}

interface ResourcesHomeScreenProps {
  articleCount: string;
  courseCount: string;
  featuredTitle: string;
  featuredCategory: string;
  articles: ArticleItem[];
  courses: CourseItem[];
  onBack: () => void;
  onFeaturedPress: () => void;
  onFeaturedOptions: () => void;
  onSeeAllArticles: () => void;
  onArticlePress: (id: string) => void;
  onSeeAllCourses: () => void;
  onCoursePress: (id: string) => void;
  onAddPress: () => void;
}

const colors = {
  background: palette.brown[900],
  white: palette.white,
  cardBg: "#2A1F18",
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  categoryBadge: palette.olive[500],
  fabBg: "#5C4A2A",
  seeAll: palette.tan[500],
  metricText: `${palette.white}${palette.alpha[50]}`,
  ratingYellow: "#E8C94A",
} as const;

export function ResourcesHomeScreen({
  articleCount,
  courseCount,
  featuredTitle,
  featuredCategory,
  articles,
  courses,
  onBack,
  onFeaturedPress,
  onFeaturedOptions,
  onSeeAllArticles,
  onArticlePress,
  onSeeAllCourses,
  onCoursePress,
  onAddPress,
}: ResourcesHomeScreenProps): React.ReactElement {
  return (
    <View testID="resources-home-screen" style={styles.container}>
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
            <Text style={styles.backIcon}>{"\u263E"}</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>Our Resources</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            {"\uD83D\uDCC4"} {articleCount} Articles
          </Text>
          <Text style={styles.statDot}>{"\u00B7"}</Text>
          <Text style={styles.statText}>
            {"\uD83C\uDF93"} {courseCount} Courses
          </Text>
        </View>

        {/* Featured Resource */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Featured Resource</Text>
          <TouchableOpacity
            testID="featured-options-button"
            style={styles.optionsButton}
            onPress={onFeaturedOptions}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <Text style={styles.optionsIcon}>{"\u22EF"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          testID="featured-resource"
          style={styles.featuredCard}
          onPress={onFeaturedPress}
          accessibilityRole="button"
          accessibilityLabel={`Featured: ${featuredTitle}`}
        >
          <View style={styles.featuredImage} />
          <View style={styles.featuredContent}>
            <View testID="featured-category-badge" style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{featuredCategory}</Text>
            </View>
            <Text style={styles.featuredTitle}>{featuredTitle}</Text>
          </View>
        </TouchableOpacity>

        {/* Articles Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Our Articles</Text>
          <TouchableOpacity
            testID="see-all-articles"
            onPress={onSeeAllArticles}
            accessibilityRole="button"
            accessibilityLabel="See all articles"
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.articleCarousel}
        >
          {articles.map((article) => (
            <TouchableOpacity
              key={article.id}
              testID={`article-card-${article.id}`}
              style={styles.articleCard}
              onPress={() => onArticlePress(article.id)}
              accessibilityRole="button"
              accessibilityLabel={article.title}
            >
              <View style={styles.articleImage} />
              <View style={styles.articleBadge}>
                <Text style={styles.articleBadgeText}>{article.category}</Text>
              </View>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <View style={styles.metricsRow}>
                <Text style={styles.metricText}>
                  {"\uD83D\uDC41"} {article.views}
                </Text>
                <Text style={styles.metricText}>
                  {"\u2764"} {article.likes}
                </Text>
                <Text style={styles.metricText}>
                  {"\uD83D\uDCAC"} {article.comments}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Courses Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Our Courses</Text>
          <TouchableOpacity
            testID="see-all-courses"
            onPress={onSeeAllCourses}
            accessibilityRole="button"
            accessibilityLabel="See all courses"
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            testID={`course-row-${course.id}`}
            style={styles.courseRow}
            onPress={() => onCoursePress(course.id)}
            accessibilityRole="button"
            accessibilityLabel={`${course.title} by ${course.instructor}`}
          >
            <View style={styles.courseAvatar}>
              <Text style={styles.courseAvatarIcon}>{"\u25B6"}</Text>
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseInstructor}>{course.instructor}</Text>
              <View style={styles.courseMetrics}>
                <Text style={styles.courseMetric}>
                  {"\u2B50"} {course.rating}
                </Text>
                <Text style={styles.courseMetric}>
                  {"\uD83D\uDC41"} {course.views}
                </Text>
                <Text style={styles.courseMetric}>
                  {"\uD83D\uDCD6"} {course.lessons}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          testID="add-button"
          style={styles.fabButton}
          onPress={onAddPress}
          accessibilityRole="button"
          accessibilityLabel="Add new resource"
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  articleBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.categoryBadge,
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  articleBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
  },
  articleCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginRight: 12,
    padding: 12,
    width: 180,
  },
  articleCarousel: {
    paddingHorizontal: 24,
  },
  articleImage: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 12,
    height: 100,
    width: "100%",
  },
  articleTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 8,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.categoryBadge,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  courseAvatar: {
    alignItems: "center",
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  courseAvatarIcon: {
    color: colors.white,
    fontSize: 16,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  courseInstructor: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  courseMetric: {
    color: colors.textSecondary,
    fontSize: 11,
    marginRight: 12,
  },
  courseMetrics: {
    flexDirection: "row",
    marginTop: 4,
  },
  courseRow: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 8,
    marginHorizontal: 24,
    padding: 12,
  },
  courseTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  fabButton: {
    alignItems: "center",
    backgroundColor: colors.fabBg,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  fabContainer: {
    alignItems: "center",
    bottom: 32,
    left: 0,
    position: "absolute",
    right: 0,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
  },
  featuredCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginHorizontal: 24,
    overflow: "hidden",
  },
  featuredContent: {
    padding: 16,
  },
  featuredImage: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    height: 140,
    width: "100%",
  },
  featuredTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  metricText: {
    color: colors.metricText,
    fontSize: 11,
    marginRight: 8,
  },
  metricsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  optionsButton: {
    padding: 4,
  },
  optionsIcon: {
    color: colors.white,
    fontSize: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  seeAllText: {
    color: colors.seeAll,
    fontSize: 13,
    fontWeight: "600",
  },
  statDot: {
    color: colors.textSecondary,
    marginHorizontal: 8,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  statsRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    paddingHorizontal: 24,
  },
});

export default ResourcesHomeScreen;
