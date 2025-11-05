/**
 * Bookmarked Resources Screen - Saved Favorite Resources
 * Based on ui-designs/Dark-mode/🔒 Mindful Resources.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface BookmarkedResource {
  id: string;
  title: string;
  type: "article" | "course" | "audio" | "video";
  duration: string;
  category: string;
  bookmarkedDate: string;
  icon: string;
}

export const BookmarkedResourcesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const bookmarkedResources: BookmarkedResource[] = [
    {
      id: "1",
      title: "Mindfulness for Beginners",
      type: "course",
      duration: "2 hours",
      category: "Mindfulness",
      bookmarkedDate: "2 days ago",
      icon: "📚",
    },
    {
      id: "2",
      title: "10 Minute Morning Meditation",
      type: "audio",
      duration: "10 min",
      category: "Meditation",
      bookmarkedDate: "1 week ago",
      icon: "🎧",
    },
    {
      id: "3",
      title: "Understanding Anxiety",
      type: "article",
      duration: "5 min read",
      category: "Mental Health",
      bookmarkedDate: "2 weeks ago",
      icon: "📰",
    },
    {
      id: "4",
      title: "Guided Body Scan",
      type: "video",
      duration: "15 min",
      category: "Relaxation",
      bookmarkedDate: "3 weeks ago",
      icon: "🎬",
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
    sortButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    statsCard: {
      backgroundColor: theme.colors.purple["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    resourceCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    resourceIcon: {
      fontSize: 40,
      marginRight: 16,
    },
    resourceInfo: {
      flex: 1,
    },
    resourceTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    resourceMeta: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    resourceCategory: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.purple["60"],
    },
    bookmarkButton: {
      padding: 8,
    },
    bookmarkIcon: {
      fontSize: 24,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    exploreButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginTop: 24,
      alignItems: "center",
    },
    exploreButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return "📰";
      case "course":
        return "📚";
      case "audio":
        return "🎧";
      case "video":
        return "🎬";
      default:
        return "📄";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <TouchableOpacity
          style={styles.sortButton}
          accessible
          accessibilityLabel="Sort"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bookmarkedResources.length}</Text>
            <Text style={styles.statLabel}>Bookmarked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.5h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Saved Resources</Text>

          {bookmarkedResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => {
                if (resource.type === "course") {
                  navigation.navigate("CourseDetail", { id: resource.id });
                } else if (resource.type === "article") {
                  navigation.navigate("ArticleDetail", { id: resource.id });
                }
              }}
            >
              <Text style={styles.resourceIcon}>
                {getTypeIcon(resource.type)}
              </Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceMeta}>
                  {resource.duration} • Saved {resource.bookmarkedDate}
                </Text>
                <Text style={styles.resourceCategory}>{resource.category}</Text>
              </View>
              <TouchableOpacity style={styles.bookmarkButton}>
                <Text style={styles.bookmarkIcon}>🔖</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate("MindfulResources")}
        >
          <Text style={styles.exploreButtonText}>Explore More Resources</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookmarkedResourcesScreen;
