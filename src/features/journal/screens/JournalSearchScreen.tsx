/**
 * Journal Search Screen - Find Specific Journal Entries
 * Based on ui-designs/Dark-mode/🔒 Mental Health Journal.png
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
  TextInput,
} from "react-native";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  mood: string;
  emoji: string;
  tags: string[];
}

export const JournalSearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "mood" | "tags">(
    "all",
  );

  const recentSearches = [
    "anxiety",
    "work stress",
    "therapy session",
    "happy moments",
  ];

  const searchResults: SearchResult[] = [
    {
      id: "1",
      title: "Feeling overwhelmed with work",
      excerpt:
        "Today was really challenging. The deadline for the project is approaching and I feel...",
      date: "Oct 15, 2024",
      mood: "Stressed",
      emoji: "😰",
      tags: ["work", "stress", "anxiety"],
    },
    {
      id: "2",
      title: "Great therapy session today",
      excerpt:
        "Had an amazing breakthrough in therapy. Dr. Smith helped me understand...",
      date: "Oct 12, 2024",
      mood: "Happy",
      emoji: "😊",
      tags: ["therapy", "progress", "happy"],
    },
    {
      id: "3",
      title: "Anxiety about upcoming presentation",
      excerpt:
        "The presentation is in 2 days and I can't stop thinking about it...",
      date: "Oct 10, 2024",
      mood: "Anxious",
      emoji: "😟",
      tags: ["anxiety", "work", "presentation"],
    },
  ];

  const popularTags = [
    "work",
    "family",
    "therapy",
    "anxiety",
    "stress",
    "happy",
    "progress",
    "relationships",
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
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
    searchInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      paddingHorizontal: 12,
      marginLeft: 12,
    },
    searchIcon: {
      fontSize: 18,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: theme.colors.text.primary,
      paddingVertical: 10,
    },
    clearButton: {
      padding: 4,
    },
    clearButtonText: {
      fontSize: 18,
      color: theme.colors.text.tertiary,
    },
    content: {
      flex: 1,
    },
    filterRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["10"],
    },
    filterButtonActive: {
      backgroundColor: theme.colors.orange["60"],
    },
    filterText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    filterTextActive: {
      color: "#FFFFFF",
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    recentSearchItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    recentSearchIcon: {
      fontSize: 16,
      marginRight: 12,
      color: theme.colors.text.tertiary,
    },
    recentSearchText: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    tagButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.brown["10"],
      borderWidth: 1,
      borderColor: theme.colors.gray["20"],
    },
    tagText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    resultCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    resultHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    resultEmoji: {
      fontSize: 24,
      marginRight: 12,
    },
    resultHeaderText: {
      flex: 1,
    },
    resultTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    resultMeta: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    resultExcerpt: {
      fontSize: 13,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    resultTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    resultTag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.colors.orange["20"],
    },
    resultTagText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.orange["80"],
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 60,
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
    },
    emptyDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      textAlign: "center",
      paddingHorizontal: 40,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search */}
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
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search your journal..."
            placeholderTextColor={theme.colors.text.tertiary}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "all" && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "all" && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "mood" && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter("mood")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "mood" && styles.filterTextActive,
              ]}
            >
              By Mood
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "tags" && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter("tags")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "tags" && styles.filterTextActive,
              ]}
            >
              By Tags
            </Text>
          </TouchableOpacity>
        </View>

        {searchQuery.length === 0 ? (
          <>
            {/* Recent Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {/* LOW-NEW-002 FIX: Use search term as stable key instead of index */}
              {recentSearches.map((search) => (
                <TouchableOpacity
                  key={`recent-${search}`}
                  style={styles.recentSearchItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Text style={styles.recentSearchIcon}>🕐</Text>
                  <Text style={styles.recentSearchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Popular Tags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Tags</Text>
              <View style={styles.tagsContainer}>
                {/* LOW-NEW-002 FIX: Use tag as stable key instead of index */}
                {popularTags.map((tag) => (
                  <TouchableOpacity
                    key={`tag-${tag}`}
                    style={styles.tagButton}
                    onPress={() => setSearchQuery(tag)}
                  >
                    <Text style={styles.tagText}>#{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Search Results */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {searchResults.length} Results for "{searchQuery}"
              </Text>
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <TouchableOpacity
                    key={result.id}
                    style={styles.resultCard}
                    onPress={() =>
                      navigation.navigate("JournalDetail", { id: result.id })
                    }
                  >
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultEmoji}>{result.emoji}</Text>
                      <View style={styles.resultHeaderText}>
                        <Text style={styles.resultTitle}>{result.title}</Text>
                        <Text style={styles.resultMeta}>
                          {result.mood} • {result.date}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.resultExcerpt}>{result.excerpt}</Text>
                    <View style={styles.resultTags}>
                      {/* LOW-NEW-002 FIX: Use result id + tag as stable key */}
                      {result.tags.map((tag) => (
                        <View key={`tag-${result.id}-${tag}`} style={styles.resultTag}>
                          <Text style={styles.resultTagText}>#{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📝</Text>
                  <Text style={styles.emptyTitle}>No Results Found</Text>
                  <Text style={styles.emptyDescription}>
                    Try different keywords or browse by tags
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
JournalSearchScreen.displayName = 'JournalSearchScreen';

export default JournalSearchScreen;
