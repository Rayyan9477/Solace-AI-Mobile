/**
 * Mindful Resources Screen - Articles, Courses, and Educational Content
 * Based on ui-designs/Dark-mode/Mindful Resources.png
 */

import { MentalHealthIcon } from "@components/icons";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";

type TabType = "resources" | "articles" | "courses";

interface Article {
  id: string;
  title: string;
  author: string;
  readTime: string;
  image?: string;
  likes: number;
  comments: number;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  lessons: number;
  image?: string;
}

const FEATURED_RESOURCE = {
  category: "Mental Health",
  title: "Freud Apps: Your Pocket Therapist for Mental Wellness",
  image: "🧘‍♂️",
};

const ARTICLES: Article[] = [
  {
    id: "1",
    title: "Will meditation help you get out from the roof?",
    author: "By Dr. Johann Lecturer",
    readTime: "5 min",
    likes: 2341,
    comments: 52,
  },
  {
    id: "2",
    title: "Will meditation get out from th...",
    author: "By Dr. Johann Lecturer",
    readTime: "8 min",
    likes: 1240,
    comments: 32,
  },
];

const COURSES: Course[] = [
  {
    id: "1",
    title: "Mindfulness 101",
    instructor: "By Dr. Haroldus Lecturer",
    rating: 4.8,
    students: 200,
    lessons: 23,
  },
  {
    id: "2",
    title: "Indian Meditation",
    instructor: "By Alan Watts",
    rating: 3.1,
    students: 38,
    lessons: 44,
  },
  {
    id: "3",
    title: "African Meditation",
    instructor: "By Clayton Bigsby",
    rating: 4.2,
    students: 200,
    lessons: 23,
  },
];

export const MindfulResourcesScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("resources");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginLeft: 16,
    },
    statsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    stat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    statText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    featuredCard: {
      marginHorizontal: 20,
      marginVertical: 16,
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: theme.colors.brown["20"],
      ...theme.getShadow("md"),
    },
    featuredImage: {
      width: "100%",
      height: 180,
      backgroundColor: theme.colors.brown["30"],
      justifyContent: "center",
      alignItems: "center",
    },
    featuredEmoji: {
      fontSize: 80,
    },
    featuredContent: {
      padding: 16,
    },
    featuredCategory: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.orange["40"],
      marginBottom: 8,
    },
    featuredTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    viewButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    viewButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 16,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    seeAllButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.orange["40"],
    },
    articleCard: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.background.secondary,
      overflow: "hidden",
      ...theme.getShadow("sm"),
    },
    articleImage: {
      width: 80,
      height: 80,
      backgroundColor: theme.colors.green["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    articleContent: {
      flex: 1,
      padding: 12,
      justifyContent: "space-between",
    },
    articleTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    articleMeta: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    articleStats: {
      flexDirection: "row",
      gap: 16,
    },
    articleStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    articleStatText: {
      fontSize: 12,
      color: theme.colors.text.tertiary,
    },
    courseCard: {
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    courseInner: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.background.secondary,
      ...theme.getShadow("sm"),
    },
    courseImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.purple["20"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    courseIcon: {
      fontSize: 32,
    },
    courseContent: {
      flex: 1,
    },
    courseTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    courseInstructor: {
      fontSize: 12,
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    courseStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    courseRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    courseRatingText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.yellow["50"],
    },
    courseStudents: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
    },
    addButton: {
      position: "absolute",
      bottom: 24,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.green["40"],
      justifyContent: "center",
      alignItems: "center",
      ...theme.getShadow("lg"),
    },
  });

  const renderFeaturedResource = () => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => navigation.navigate("ArticleDetail", { id: "featured" })}
    >
      <View style={styles.featuredImage}>
        <Text style={styles.featuredEmoji}>{FEATURED_RESOURCE.image}</Text>
      </View>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredCategory}>
          {FEATURED_RESOURCE.category}
        </Text>
        <Text style={styles.featuredTitle}>{FEATURED_RESOURCE.title}</Text>
        <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Read More</Text>
          <MentalHealthIcon
            name="ChevronRight"
            size={20}
            color={theme.colors.text.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderArticles = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Articles</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {ARTICLES.map((article) => (
        <TouchableOpacity
          key={article.id}
          style={styles.articleCard}
          onPress={() =>
            navigation.navigate("ArticleDetail", { id: article.id })
          }
        >
          <View style={styles.articleImage}>
            <Text style={{ fontSize: 40 }}>🌿</Text>
          </View>
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle} numberOfLines={2}>
              {article.title}
            </Text>
            <Text style={styles.articleMeta}>
              {article.author} • {article.readTime}
            </Text>
            <View style={styles.articleStats}>
              <View style={styles.articleStat}>
                <MentalHealthIcon
                  name="ThumbsUp"
                  size={14}
                  color={theme.colors.text.tertiary}
                />
                <Text style={styles.articleStatText}>{article.likes}</Text>
              </View>
              <View style={styles.articleStat}>
                <MentalHealthIcon
                  name="MessageCircle"
                  size={14}
                  color={theme.colors.text.tertiary}
                />
                <Text style={styles.articleStatText}>{article.comments}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );

  const renderCourses = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Our Courses</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {COURSES.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <TouchableOpacity
            style={styles.courseInner}
            onPress={() =>
              navigation.navigate("CourseDetail", { id: course.id })
            }
          >
            <View style={styles.courseImage}>
              <Text style={styles.courseIcon}>🧘</Text>
            </View>
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseInstructor}>{course.instructor}</Text>
              <View style={styles.courseStats}>
                <View style={styles.courseRating}>
                  <Text style={styles.courseRatingText}>
                    ⭐ {course.rating}
                  </Text>
                </View>
                <Text style={styles.courseStudents}>👥 {course.students}K</Text>
                <Text style={styles.courseStudents}>📚 {course.lessons}</Text>
              </View>
            </View>
            <MentalHealthIcon
              name="ChevronRight"
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MentalHealthIcon
            name="ChevronLeft"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Our Resources</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <MentalHealthIcon
              name="FileText"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.statText}>185 Articles</Text>
          </View>
          <View style={styles.stat}>
            <MentalHealthIcon
              name="BookOpen"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles.statText}>632 Courses</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Resource */}
        {renderFeaturedResource()}

        {/* Articles */}
        {renderArticles()}

        {/* Courses */}
        {renderCourses()}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <MentalHealthIcon name="Plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MindfulResourcesScreen;
