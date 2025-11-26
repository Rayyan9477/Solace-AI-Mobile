/**
 * Guided Sessions Screen - Various Mindfulness Exercises
 * Based on ui-designs/Dark-mode/🔒 Mindful Hours.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Session {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  icon: string;
  instructor: string;
}

export const GuidedSessionsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All", icon: "📚" },
    { id: "meditation", name: "Meditation", icon: "🧘" },
    { id: "breathing", name: "Breathing", icon: "🫁" },
    { id: "sleep", name: "Sleep", icon: "😴" },
    { id: "stress", name: "Stress Relief", icon: "🌊" },
  ];

  const sessions: Session[] = [
    {
      id: "1",
      title: "Morning Mindfulness",
      description: "Start your day with clarity and focus",
      duration: "10 min",
      difficulty: "Beginner",
      category: "Meditation",
      icon: "☀️",
      instructor: "Dr. Sarah Chen",
    },
    {
      id: "2",
      title: "Deep Breathing for Anxiety",
      description: "Calm your nervous system with breathwork",
      duration: "5 min",
      difficulty: "Beginner",
      category: "Breathing",
      icon: "🫁",
      instructor: "Michael Torres",
    },
    {
      id: "3",
      title: "Body Scan Meditation",
      description: "Release tension from head to toe",
      duration: "20 min",
      difficulty: "Intermediate",
      category: "Meditation",
      icon: "🧘",
      instructor: "Dr. Sarah Chen",
    },
    {
      id: "4",
      title: "Sleep Meditation",
      description: "Drift into peaceful, restful sleep",
      duration: "30 min",
      difficulty: "Beginner",
      category: "Sleep",
      icon: "🌙",
      instructor: "Emma Williams",
    },
    {
      id: "5",
      title: "Stress Release Visualization",
      description: "Let go of stress and tension",
      duration: "15 min",
      difficulty: "Intermediate",
      category: "Stress Relief",
      icon: "🌊",
      instructor: "Michael Torres",
    },
    {
      id: "6",
      title: "Advanced Mindfulness",
      description: "Deepen your meditation practice",
      duration: "45 min",
      difficulty: "Advanced",
      category: "Meditation",
      icon: "🕉️",
      instructor: "Dr. Sarah Chen",
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
    categoriesScroll: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    categoriesRow: {
      flexDirection: "row",
      gap: 8,
    },
    categoryButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["10"],
      gap: 6,
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.purple["60"],
    },
    categoryIcon: {
      fontSize: 16,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    categoryTextActive: {
      color: "#FFFFFF",
    },
    sessionsContainer: {
      paddingHorizontal: 20,
    },
    sessionCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    sessionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    sessionIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    sessionHeaderText: {
      flex: 1,
    },
    sessionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    sessionInstructor: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    difficultyBeginner: {
      backgroundColor: theme.colors.green["60"],
    },
    difficultyIntermediate: {
      backgroundColor: theme.colors.orange["60"],
    },
    difficultyAdvanced: {
      backgroundColor: theme.colors.red["60"],
    },
    difficultyText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    sessionDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    sessionFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sessionMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    sessionMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    sessionMetaIcon: {
      fontSize: 14,
    },
    sessionMetaText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    startButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    startButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return styles.difficultyBeginner;
      case "Intermediate":
        return styles.difficultyIntermediate;
      case "Advanced":
        return styles.difficultyAdvanced;
      default:
        return styles.difficultyBeginner;
    }
  };

  const filteredSessions =
    selectedCategory === "all"
      ? sessions
      : sessions.filter((s) => s.category.toLowerCase() === selectedCategory);

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
        <Text style={styles.headerTitle}>Guided Sessions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          <View style={styles.categoriesRow}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id &&
                    styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Sessions List */}
        <View style={styles.sessionsContainer}>
          {filteredSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionCard}
              onPress={() => navigation.navigate("CourseLesson")}
            >
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionIcon}>{session.icon}</Text>
                <View style={styles.sessionHeaderText}>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <Text style={styles.sessionInstructor}>
                    with {session.instructor}
                  </Text>
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    getDifficultyStyle(session.difficulty),
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {session.difficulty}
                  </Text>
                </View>
              </View>

              <Text style={styles.sessionDescription}>
                {session.description}
              </Text>

              <View style={styles.sessionFooter}>
                <View style={styles.sessionMeta}>
                  <View style={styles.sessionMetaItem}>
                    <Text style={styles.sessionMetaIcon}>⏱️</Text>
                    <Text style={styles.sessionMetaText}>
                      {session.duration}
                    </Text>
                  </View>
                  <View style={styles.sessionMetaItem}>
                    <Text style={styles.sessionMetaIcon}>📂</Text>
                    <Text style={styles.sessionMetaText}>
                      {session.category}
                    </Text>
                  </View>
                </View>
                <View style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const GuidedSessionsScreenWithBoundary = () => (
  <ScreenErrorBoundary screenName="Guided Sessions">
    <GuidedSessionsScreen />
  </ScreenErrorBoundary>
);

export default GuidedSessionsScreenWithBoundary;
