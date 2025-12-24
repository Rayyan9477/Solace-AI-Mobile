/**
 * Course Detail Screen - Mindfulness Course Detail with Lessons
 * Based on ui-designs/Dark-mode/Mindful Resources.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  rating: number;
  isCompleted: boolean;
}

export const CourseDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isPremium] = useState(false);

  const course = {
    title: "Mindfulness 101",
    instructor: "Dr. Norihual Lenter",
    rating: 4.7,
    students: "13K",
    lessons: 43,
    image: "meditation.jpg",
    description:
      "This course will teach you how to be mindful in your life. Prepare to be Enlightened!",
    tags: ["Course", "Practice"],
  };

  const lessons: Lesson[] = [
    {
      id: "1",
      title: "Meditation Intro",
      duration: "~10 Min",
      rating: 4.8,
      isCompleted: false,
    },
    {
      id: "2",
      title: "Self Reflection",
      duration: "~15 Min",
      rating: 5.0,
      isCompleted: false,
    },
    {
      id: "3",
      title: "First Session",
      duration: "~20 Min",
      rating: 4.1,
      isCompleted: false,
    },
    {
      id: "4",
      title: "How To Be Happy",
      duration: "~10 Min",
      rating: 4.9,
      isCompleted: false,
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
    content: {
      flex: 1,
    },
    coverImage: {
      width: "100%",
      height: 240,
      backgroundColor: theme.colors.gray["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    coverImageText: {
      fontSize: 48,
    },
    courseInfo: {
      padding: 20,
    },
    tags: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    tag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.orange["20"],
    },
    tagText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.orange["80"],
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    stats: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 16,
    },
    stat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    statIcon: {
      fontSize: 14,
    },
    statText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    instructorRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    instructorInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    instructorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.orange["40"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    instructorAvatarText: {
      fontSize: 18,
    },
    instructorName: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    followButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: theme.colors.orange["60"],
    },
    followButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    description: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      marginBottom: 20,
    },
    downloadSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
    },
    downloadInfo: {
      flex: 1,
    },
    downloadTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    downloadSize: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    downloadButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.purple["60"],
      justifyContent: "center",
      alignItems: "center",
    },
    downloadIcon: {
      fontSize: 20,
    },
    lessonsSection: {
      marginBottom: 24,
    },
    lessonsTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    lessonCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    playButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["60"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    playIcon: {
      fontSize: 16,
      color: "#FFFFFF",
    },
    lessonInfo: {
      flex: 1,
    },
    lessonTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    lessonMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    lessonDuration: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    lessonRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.orange["80"],
    },
    premiumOverlay: {
      backgroundColor: theme.colors.orange["20"],
      borderRadius: 20,
      padding: 24,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    premiumBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.orange["40"],
      marginBottom: 12,
    },
    premiumBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.orange["100"],
    },
    premiumTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.orange["100"],
      marginBottom: 20,
      textAlign: "center",
    },
    premiumButton: {
      backgroundColor: theme.colors.orange["60"],
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 32,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    premiumButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

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
        <Text style={styles.headerTitle}>Course Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverImage}>
          <Text style={styles.coverImageText}>🧘</Text>
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <View style={styles.tags}>
            {/* LOW-NEW-002 FIX: Use tag as stable key instead of index */}
            {course.tags.map((tag) => (
              <View key={`tag-${tag}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statText}>{course.rating}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={styles.statText}>{course.students}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statText}>{course.lessons}</Text>
            </View>
          </View>

          <View style={styles.instructorRow}>
            <View style={styles.instructorInfo}>
              <View style={styles.instructorAvatar}>
                <Text style={styles.instructorAvatarText}>👨‍🏫</Text>
              </View>
              <Text style={styles.instructorName}>By {course.instructor}</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow +</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{course.description}</Text>

          {/* Offline Download */}
          <View style={styles.downloadSection}>
            <View style={styles.downloadInfo}>
              <Text style={styles.downloadTitle}>Offline Download</Text>
              <Text style={styles.downloadSize}>~2.05 Total File</Text>
            </View>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadIcon}>⬇️</Text>
            </TouchableOpacity>
          </View>

          {/* Lessons List */}
          <View style={styles.lessonsSection}>
            <Text style={styles.lessonsTitle}>ID Total</Text>

            {lessons.map((lesson) => (
              <TouchableOpacity key={lesson.id} style={styles.lessonCard}>
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>▶️</Text>
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={styles.lessonMeta}>
                    <Text style={styles.lessonDuration}>
                      ⏱️ {lesson.duration}
                    </Text>
                    <View style={styles.lessonRating}>
                      <Text style={{ fontSize: 12 }}>⭐</Text>
                      <Text style={styles.ratingText}>{lesson.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Premium Unlock */}
        {!isPremium && (
          <View style={styles.premiumOverlay}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>⭐ GO PREMIUM</Text>
            </View>
            <Text style={styles.premiumTitle}>Unlock the Full Course</Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Go Pro</Text>
              <Text style={{ fontSize: 16 }}>⭐</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
CourseDetailScreen.displayName = 'CourseDetailScreen';

export default CourseDetailScreen;
