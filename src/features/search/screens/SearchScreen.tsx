/**
 * Search Screen - Universal search with filters
 * Based on ui-designs/Dark-mode/Search Screen.png
 */

import { useNavigation } from "@react-navigation/native";
import { sanitizeSearchQuery } from "@shared/utils/sanitization";
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
  subtitle: string;
  category: "mood" | "sleep" | "meditation" | "community" | "journal";
  icon: string;
  color: string;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: "1",
    title: "My Mood History",
    subtitle: "In Mood & Emotions",
    category: "mood",
    icon: "😊",
    color: "#98B068",
  },
  {
    id: "2",
    title: "Mood Improvements",
    subtitle: "In Resources & Videos",
    category: "mood",
    icon: "💪",
    color: "#C96100",
  },
  {
    id: "3",
    title: "Mood Journals",
    subtitle: "In Mental Health Journal",
    category: "journal",
    icon: "📝",
    color: "#E0A500",
  },
  {
    id: "4",
    title: "AI Chatbot Mood Suggestion",
    subtitle: "In AI Therapy Chatbot",
    category: "community",
    icon: "🤖",
    color: "#8B7DA8",
  },
  {
    id: "5",
    title: "My Current Mood",
    subtitle: "In Mood & Emotions",
    category: "mood",
    icon: "😔",
    color: "#6B6B6B",
  },
];

const CATEGORIES = [
  { id: "journal", label: "Journal", icon: "📝" },
  { id: "sleep", label: "Sleep", icon: "😴" },
  { id: "meditation", label: "Meditation", icon: "🧘" },
  { id: "community", label: "Community", icon: "👥" },
  { id: "health", label: "Health", icon: "❤️" },
];

export const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "sleep",
  );
  const [searchDate, setSearchDate] = useState("25 January, 2052");
  const [searchLimit, setSearchLimit] = useState(20);
  const [showFilters, setShowFilters] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text.primary,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    searchIcon: {
      fontSize: 18,
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    filterButton: {
      padding: 8,
    },
    filterIcon: {
      fontSize: 20,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginTop: 16,
    },
    resultsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    resultsCount: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 12,
    },
    sortText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    filterChips: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 8,
      gap: 8,
    },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    chipActive: {
      backgroundColor: theme.colors.brown["70"],
    },
    chipIcon: {
      fontSize: 14,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    chipTextActive: {
      color: theme.colors.background.secondary,
    },
    resultsList: {
      padding: 20,
      gap: 12,
    },
    resultCard: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    resultIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    resultIconText: {
      fontSize: 24,
    },
    resultContent: {
      flex: 1,
    },
    resultTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    resultSubtitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    resultChevron: {
      fontSize: 20,
      color: theme.colors.text.tertiary,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyIcon: {
      fontSize: 80,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      textAlign: "center",
      lineHeight: 20,
    },
    filterModal: {
      backgroundColor: theme.colors.brown["10"],
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
    },
    filterHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.colors.text.primary,
    },
    filterSection: {
      marginBottom: 20,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      borderWidth: 2,
      borderColor: "transparent",
    },
    categoryChipActive: {
      backgroundColor: theme.colors.brown["70"],
      borderColor: theme.colors.brown["70"],
    },
    dateSelector: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateText: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    slider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    sliderTrack: {
      flex: 1,
      height: 8,
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 4,
    },
    sliderFill: {
      height: "100%",
      backgroundColor: "#98B068",
      borderRadius: 4,
    },
    sliderValue: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      minWidth: 30,
    },
    applyButton: {
      backgroundColor: theme.colors.brown["70"],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 12,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.background.secondary,
    },
  });

  const renderResults = () => {
    if (searchQuery.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Start Searching</Text>
          <Text style={styles.emptyText}>
            Search for moods, journals, meditations, and more to track your
            mental health journey
          </Text>
        </View>
      );
    }

    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyIcon}>⏳</Text>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (MOCK_RESULTS.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>😕</Text>
          <Text style={styles.emptyTitle}>Not Found</Text>
          <Text style={styles.emptyText}>
            Unfortunately, the key you entered cannot be found. 404 Error.
            Please try another keyword or check again.
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>871 Results Found</Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Newest</Text>
            <Text>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterChips}>
          <TouchableOpacity style={[styles.chip, styles.chipActive]}>
            <Text style={styles.chipIcon}>😴</Text>
            <Text style={[styles.chipText, styles.chipTextActive]}>Sleep</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipIcon}>😊</Text>
            <Text style={styles.chipText}>Mood</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipIcon}>🧘</Text>
            <Text style={styles.chipText}>Meditation</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.resultsList}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_RESULTS.map((result) => (
            <TouchableOpacity key={result.id} style={styles.resultCard}>
              <View
                style={[
                  styles.resultIcon,
                  { backgroundColor: `${result.color}30` },
                ]}
              >
                <Text style={styles.resultIconText}>{result.icon}</Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
              </View>
              <Text style={styles.resultChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search freud.ai..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(sanitizeSearchQuery(text))}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderResults()}</View>
    </SafeAreaView>
  );
};

export default SearchScreen;
