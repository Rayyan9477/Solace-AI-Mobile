/**
 * Article Detail Screen - Mindful Resources Article Detail
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
  Image,
} from "react-native";

export const ArticleDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isPremium] = useState(false);

  const article = {
    title: "What is Life? Why?",
    author: "Dr. Johann Liebert",
    rating: 4.8,
    views: "303K",
    likes: "3k",
    tags: ["Article", "Philosophy"],
    image: "nature-walk.jpg",
    sections: [
      {
        title: "Introduction",
        content: `What is life? A question that has intrigued philosophers, scientists, and thinkers throughout history. It is a profound inquiry that goes beyond the biological definition of living organisms. In this philosophical exploration, we delve into the very dimensions of life, seeking to uncover its deeper meaning and significance.`,
      },
      {
        title: "Should We or Should we Not?",
        content: `Life is a biological process characterized by traits such as growth, adaptation, reproduction, and response to stimuli. At its core, it encompasses a wide range of living beings, from the simplest microorganisms to the complex forms of plants, animals, and humans.`,
      },
    ],
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
    content: {
      flex: 1,
    },
    coverImage: {
      width: "100%",
      height: 240,
      backgroundColor: theme.colors.gray["20"],
    },
    articleInfo: {
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
      backgroundColor: theme.colors.brown["20"],
    },
    tagText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.brown["80"],
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
    authorRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    authorInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    authorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["40"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    authorAvatarText: {
      fontSize: 18,
    },
    authorName: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    authorTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    followButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: theme.colors.brown["60"],
    },
    followButtonText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
    },
    sectionContent: {
      fontSize: 15,
      lineHeight: 24,
      color: theme.colors.text.secondary,
    },
    imageCaption: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      textAlign: "center",
      marginTop: 8,
      marginBottom: 16,
    },
    premiumOverlay: {
      backgroundColor: theme.colors.green["20"],
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
      backgroundColor: theme.colors.green["40"],
      marginBottom: 12,
    },
    premiumBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.green["100"],
    },
    premiumTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.green["100"],
      marginBottom: 8,
      textAlign: "center",
    },
    premiumSubtitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.green["80"],
      textAlign: "center",
      marginBottom: 20,
    },
    premiumButton: {
      backgroundColor: theme.colors.green["60"],
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
        <Text style={styles.headerTitle}>Article Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverImage} />

        {/* Article Info */}
        <View style={styles.articleInfo}>
          <View style={styles.tags}>
            {/* LOW-NEW-002 FIX: Use tag as stable key instead of index */}
            {article.tags.map((tag) => (
              <View key={`tag-${tag}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statText}>{article.rating}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statText}>{article.views}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statText}>{article.likes}</Text>
            </View>
          </View>

          <View style={styles.authorRow}>
            <View style={styles.authorInfo}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorAvatarText}>👨‍⚕️</Text>
              </View>
              <View>
                <Text style={styles.authorName}>By {article.author}</Text>
                <Text style={styles.authorTitle}>Philosophy Expert</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow +</Text>
            </TouchableOpacity>
          </View>

          {/* Introduction Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{article.sections[0].title}</Text>
            <Text style={styles.sectionContent}>
              {article.sections[0].content}
            </Text>
          </View>

          {/* Section Image */}
          <View style={styles.coverImage} />
          <Text style={styles.imageCaption}>Image Caption</Text>

          {/* Second Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{article.sections[1].title}</Text>
            <Text style={styles.sectionContent}>
              {article.sections[1].content}
            </Text>
          </View>
        </View>

        {/* Premium Unlock */}
        {!isPremium && (
          <View style={styles.premiumOverlay}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>⭐ GO PREMIUM</Text>
            </View>
            <Text style={styles.premiumTitle}>Unlock the Full Article</Text>
            <Text style={styles.premiumSubtitle}>
              Get unlimited access to all articles and resources
            </Text>
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
ArticleDetailScreen.displayName = 'ArticleDetailScreen';

export default ArticleDetailScreen;
