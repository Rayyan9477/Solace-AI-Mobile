/**
 * Recent Searches Screen - Previously Searched Terms
 * Based on ui-designs/Dark-mode/🔒 Search Screen.png
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

export const RecentSearchesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const recentSearches = [
    { id: "1", query: "anxiety coping strategies", timestamp: "2 hours ago" },
    { id: "2", query: "sleep meditation", timestamp: "1 day ago" },
    { id: "3", query: "depression support groups", timestamp: "2 days ago" },
    { id: "4", query: "breathing exercises", timestamp: "3 days ago" },
    { id: "5", query: "mood tracking tips", timestamp: "4 days ago" },
    { id: "6", query: "stress management", timestamp: "5 days ago" },
    { id: "7", query: "journaling prompts", timestamp: "1 week ago" },
  ];

  const popularSearches = [
    "anxiety relief",
    "meditation techniques",
    "sleep improvement",
    "stress management",
    "mood tracking",
    "therapy resources",
    "coping strategies",
    "mindfulness exercises",
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
    clearButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    clearButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.red["60"],
    },
    content: {
      flex: 1,
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
    searchItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    searchIcon: {
      fontSize: 18,
      marginRight: 12,
      color: theme.colors.text.tertiary,
    },
    searchContent: {
      flex: 1,
    },
    searchQuery: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    searchTimestamp: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
    },
    deleteButton: {
      padding: 8,
    },
    deleteIcon: {
      fontSize: 16,
      color: theme.colors.text.tertiary,
    },
    popularSearchesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    popularSearchTag: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.brown["10"],
      borderWidth: 1,
      borderColor: theme.colors.gray["20"],
    },
    popularSearchText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.primary,
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
        <Text style={styles.headerTitle}>Recent Searches</Text>
        <TouchableOpacity
          style={styles.clearButton}
          accessible
          accessibilityLabel="Clear all"
          accessibilityRole="button"
        >
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {recentSearches.map((search) => (
            <TouchableOpacity
              key={search.id}
              style={styles.searchItem}
              onPress={() =>
                navigation.navigate("Search", { query: search.query })
              }
            >
              <Text style={styles.searchIcon}>🕐</Text>
              <View style={styles.searchContent}>
                <Text style={styles.searchQuery}>{search.query}</Text>
                <Text style={styles.searchTimestamp}>{search.timestamp}</Text>
              </View>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteIcon}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.popularSearchesContainer}>
            {/* LOW-NEW-002 FIX: Use search term as stable key instead of index */}
            {popularSearches.map((search) => (
              <TouchableOpacity
                key={`popular-${search}`}
                style={styles.popularSearchTag}
                onPress={() => navigation.navigate("Search", { query: search })}
              >
                <Text style={styles.popularSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
RecentSearchesScreen.displayName = 'RecentSearchesScreen';

export default RecentSearchesScreen;
