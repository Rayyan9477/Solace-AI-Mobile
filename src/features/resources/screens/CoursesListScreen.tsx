/**
 * CoursesListScreen Component
 * @description Full courses listing with orange curved header, filter chips,
 *   featured course with play button, and course rows
 * @task Task 3.13.3: Courses List Screen (Screen 114)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix Replaced "Dr. Hannibal Lector" with "Dr. Sarah Mitchell"
 * @audit-fix Replaced "Clayton Biggsby" with "Clayton Hughes"
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

interface FilterOption {
  id: string;
  label: string;
}

interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  rating: string;
  views: string;
  lessons: string;
}

interface CoursesListScreenProps {
  filters: FilterOption[];
  selectedFilterId: string | null;
  featuredTitle: string;
  featuredInstructor: string;
  featuredDuration: string;
  courses: CourseItem[];
  onBack: () => void;
  onFilterSelect: (id: string) => void;
  onFeaturedPlay: () => void;
  onSeeAllCourses: () => void;
  onCoursePress: (id: string) => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  headerBg: palette.onboarding.step2,
  cardBg: palette.brown[800],
  chipBg: palette.brown[800],
  chipSelected: palette.onboarding.step2,
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  seeAll: palette.tan[500],
  playBg: `${palette.white}${palette.alpha[90]}`,
  playIcon: palette.brown[900],
} as const;

export function CoursesListScreen({
  filters,
  selectedFilterId,
  featuredTitle,
  featuredInstructor,
  featuredDuration,
  courses,
  onBack,
  onFilterSelect,
  onFeaturedPlay,
  onSeeAllCourses,
  onCoursePress,
}: CoursesListScreenProps): React.ReactElement {
  return (
    <View testID="courses-list-screen" style={styles.container}>
      {/* Orange Curved Header */}
      <View style={styles.curvedHeader}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u263E"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Courses</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {filters.map((filter) => {
            const isSelected = filter.id === selectedFilterId;
            return (
              <TouchableOpacity
                key={filter.id}
                testID={`filter-chip-${filter.id}`}
                style={[
                  styles.filterChip,
                  isSelected
                    ? styles.filterChipSelected
                    : styles.filterChipUnselected,
                ]}
                onPress={() => onFilterSelect(filter.id)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${filter.label}`}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Course */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Featured Course</Text>
        </View>

        <View testID="featured-course" style={styles.featuredCard}>
          <View style={styles.featuredImage}>
            <TouchableOpacity
              testID="featured-play-button"
              style={styles.playButton}
              onPress={onFeaturedPlay}
              accessibilityRole="button"
              accessibilityLabel="Play featured course"
            >
              <Text style={styles.playIcon}>{"\u25B6"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>{featuredTitle}</Text>
            <Text style={styles.featuredInstructor}>{featuredInstructor}</Text>
            <Text style={styles.featuredDuration}>{featuredDuration}</Text>
          </View>
        </View>

        {/* All Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>All Courses</Text>
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
  backIcon: {
    color: localColors.white,
    fontSize: 24,
  },
  chipText: {
    color: localColors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: localColors.white,
  },
  chipsRow: {
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  container: {
    backgroundColor: localColors.background,
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
    color: localColors.white,
    fontSize: 16,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  courseInstructor: {
    color: localColors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  courseMetric: {
    color: localColors.textSecondary,
    fontSize: 11,
    marginRight: 12,
  },
  courseMetrics: {
    flexDirection: "row",
    marginTop: 4,
  },
  courseRow: {
    alignItems: "center",
    backgroundColor: localColors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 8,
    marginHorizontal: 24,
    padding: 12,
  },
  courseTitle: {
    color: localColors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  curvedHeader: {
    backgroundColor: localColors.headerBg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  featuredCard: {
    backgroundColor: localColors.cardBg,
    borderRadius: 16,
    marginHorizontal: 24,
    overflow: "hidden",
  },
  featuredContent: {
    padding: 16,
  },
  featuredDuration: {
    color: localColors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  featuredImage: {
    alignItems: "center",
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    height: 160,
    justifyContent: "center",
    width: "100%",
  },
  featuredInstructor: {
    color: localColors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  featuredTitle: {
    color: localColors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipSelected: {
    backgroundColor: localColors.chipSelected,
  },
  filterChipUnselected: {
    backgroundColor: localColors.chipBg,
  },
  headerTitle: {
    color: localColors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 8,
  },
  playButton: {
    alignItems: "center",
    backgroundColor: localColors.playBg,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  playIcon: {
    color: localColors.playIcon,
    fontSize: 20,
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    color: localColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  seeAllText: {
    color: localColors.seeAll,
    fontSize: 13,
    fontWeight: "600",
  },
});

export default CoursesListScreen;
