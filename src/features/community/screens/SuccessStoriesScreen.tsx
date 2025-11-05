/**
 * Success Stories Screen - Inspirational Community Content
 * Based on ui-designs/Dark-mode/🔒 Community Support.png
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

interface Story {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  timeframe: string;
  category: string;
  excerpt: string;
  likes: number;
  comments: number;
  featured: boolean;
}

export const SuccessStoriesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const stories: Story[] = [
    {
      id: "1",
      title: "From Rock Bottom to Finding My Purpose",
      author: "Jennifer M.",
      authorAvatar: "👩",
      timeframe: "2 Year Journey",
      category: "Recovery",
      excerpt:
        "Two years ago, I couldn't get out of bed. Today, I'm running my own business and helping others. This is my story of transformation...",
      likes: 342,
      comments: 89,
      featured: true,
    },
    {
      id: "2",
      title: "Overcoming Social Anxiety: My 18-Month Progress",
      author: "David R.",
      authorAvatar: "👨",
      timeframe: "18 Months",
      category: "Anxiety",
      excerpt:
        "I used to panic at the thought of social gatherings. Now I host weekly meetups. Here's what helped me...",
      likes: 267,
      comments: 54,
      featured: true,
    },
    {
      id: "3",
      title: "Breaking Free from Depression",
      author: "Sarah L.",
      authorAvatar: "👱‍♀️",
      timeframe: "1 Year Journey",
      category: "Depression",
      excerpt:
        "It took time, therapy, and self-compassion. But I made it through. You can too...",
      likes: 198,
      comments: 43,
      featured: false,
    },
    {
      id: "4",
      title: "How Mindfulness Changed My Life",
      author: "Marcus T.",
      authorAvatar: "🧑",
      timeframe: "6 Months",
      category: "Wellness",
      excerpt:
        "Six months of daily meditation practice transformed my relationship with stress and anxiety...",
      likes: 156,
      comments: 31,
      featured: false,
    },
  ];

  const stats = {
    totalStories: 1247,
    totalReaders: 45890,
    averageRating: 4.8,
    hopeGiven: "100k+",
  };

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
    shareButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    heroCard: {
      backgroundColor: theme.colors.green["60"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },
    heroIcon: {
      fontSize: 64,
      marginBottom: 12,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 8,
      textAlign: "center",
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: "#FFFFFF",
      opacity: 0.9,
      textAlign: "center",
    },
    statsCard: {
      backgroundColor: theme.colors.brown["10"],
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 16,
      padding: 20,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    storyCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: "transparent",
    },
    storyCardFeatured: {
      borderLeftColor: theme.colors.green["60"],
      backgroundColor: theme.colors.green["10"],
    },
    storyHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    storyAuthorAvatar: {
      fontSize: 32,
      marginRight: 12,
    },
    storyAuthorInfo: {
      flex: 1,
    },
    storyAuthor: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    storyTimeframe: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.green["80"],
    },
    featuredBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.green["60"],
    },
    featuredText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
    storyTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      lineHeight: 22,
    },
    storyCategory: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.green["60"],
      marginBottom: 8,
    },
    storyExcerpt: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    storyFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    storyStat: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    storyStatIcon: {
      fontSize: 16,
    },
    storyStatText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    readMoreButton: {
      marginLeft: "auto",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.colors.green["60"],
    },
    readMoreText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    shareYourStoryButton: {
      backgroundColor: theme.colors.green["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    shareYourStoryText: {
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
        <Text style={styles.headerTitle}>Success Stories</Text>
        <TouchableOpacity
          style={styles.shareButton}
          accessible
          accessibilityLabel="Share"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🌟</Text>
          <Text style={styles.heroTitle}>You Are Not Alone</Text>
          <Text style={styles.heroSubtitle}>
            Read inspiring stories from people who've walked similar paths and
            found their way to healing
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalStories}</Text>
              <Text style={styles.statLabel}>Stories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(stats.totalReaders / 1000).toFixed(1)}k
              </Text>
              <Text style={styles.statLabel}>Readers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.averageRating}⭐</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.hopeGiven}</Text>
              <Text style={styles.statLabel}>Hope Given</Text>
            </View>
          </View>
        </View>

        {/* Featured Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Stories</Text>
          {stories
            .filter((story) => story.featured)
            .map((story) => (
              <TouchableOpacity
                key={story.id}
                style={[styles.storyCard, styles.storyCardFeatured]}
                onPress={() =>
                  navigation.navigate("PostDetail", { id: story.id })
                }
              >
                <View style={styles.storyHeader}>
                  <Text style={styles.storyAuthorAvatar}>
                    {story.authorAvatar}
                  </Text>
                  <View style={styles.storyAuthorInfo}>
                    <Text style={styles.storyAuthor}>{story.author}</Text>
                    <Text style={styles.storyTimeframe}>{story.timeframe}</Text>
                  </View>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>⭐ Featured</Text>
                  </View>
                </View>

                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyCategory}>#{story.category}</Text>
                <Text style={styles.storyExcerpt}>{story.excerpt}</Text>

                <View style={styles.storyFooter}>
                  <View style={styles.storyStat}>
                    <Text style={styles.storyStatIcon}>❤️</Text>
                    <Text style={styles.storyStatText}>{story.likes}</Text>
                  </View>
                  <View style={styles.storyStat}>
                    <Text style={styles.storyStatIcon}>💬</Text>
                    <Text style={styles.storyStatText}>{story.comments}</Text>
                  </View>
                  <View style={styles.readMoreButton}>
                    <Text style={styles.readMoreText}>Read More</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* More Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More Inspiring Stories</Text>
          {stories
            .filter((story) => !story.featured)
            .map((story) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyCard}
                onPress={() =>
                  navigation.navigate("PostDetail", { id: story.id })
                }
              >
                <View style={styles.storyHeader}>
                  <Text style={styles.storyAuthorAvatar}>
                    {story.authorAvatar}
                  </Text>
                  <View style={styles.storyAuthorInfo}>
                    <Text style={styles.storyAuthor}>{story.author}</Text>
                    <Text style={styles.storyTimeframe}>{story.timeframe}</Text>
                  </View>
                </View>

                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyCategory}>#{story.category}</Text>
                <Text style={styles.storyExcerpt}>{story.excerpt}</Text>

                <View style={styles.storyFooter}>
                  <View style={styles.storyStat}>
                    <Text style={styles.storyStatIcon}>❤️</Text>
                    <Text style={styles.storyStatText}>{story.likes}</Text>
                  </View>
                  <View style={styles.storyStat}>
                    <Text style={styles.storyStatIcon}>💬</Text>
                    <Text style={styles.storyStatText}>{story.comments}</Text>
                  </View>
                  <View style={styles.readMoreButton}>
                    <Text style={styles.readMoreText}>Read More</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Share Your Story Button */}
        <TouchableOpacity
          style={styles.shareYourStoryButton}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Text style={styles.shareYourStoryText}>Share Your Story 📝</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessStoriesScreen;
