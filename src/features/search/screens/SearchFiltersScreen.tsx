/**
 * Search Filters Screen - Refine Search Results
 * Based on ui-designs/Dark-mode/🔒 Search Screen.png
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

interface FilterOption {
  id: string;
  label: string;
}

export const SearchFiltersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    [],
  );
  const [selectedDateRange, setSelectedDateRange] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("relevance");

  const categories: FilterOption[] = [
    { id: "articles", label: "Articles" },
    { id: "courses", label: "Courses" },
    { id: "exercises", label: "Exercises" },
    { id: "community", label: "Community" },
    { id: "journal", label: "Journal" },
    { id: "mood", label: "Mood Data" },
  ];

  const contentTypes: FilterOption[] = [
    { id: "text", label: "Text" },
    { id: "video", label: "Video" },
    { id: "audio", label: "Audio" },
    { id: "interactive", label: "Interactive" },
  ];

  const dateRanges: FilterOption[] = [
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "year", label: "This Year" },
    { id: "all", label: "All Time" },
  ];

  const sortOptions: FilterOption[] = [
    { id: "relevance", label: "Most Relevant" },
    { id: "recent", label: "Most Recent" },
    { id: "popular", label: "Most Popular" },
    { id: "alphabetical", label: "A-Z" },
  ];

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleContentType = (id: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedContentTypes([]);
    setSelectedDateRange("");
    setSelectedSort("relevance");
  };

  const applyFilters = () => {
    navigation.goBack();
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
      paddingVertical: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    filterGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["10"],
      borderWidth: 2,
      borderColor: "transparent",
    },
    filterChipSelected: {
      backgroundColor: theme.colors.purple["20"],
      borderColor: theme.colors.purple["60"],
    },
    filterChipText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    filterChipTextSelected: {
      fontWeight: "700",
      color: theme.colors.purple["60"],
    },
    radioList: {
      gap: 12,
    },
    radioOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.brown["10"],
    },
    radioOptionSelected: {
      backgroundColor: theme.colors.purple["20"],
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.gray["40"],
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    radioCircleSelected: {
      borderColor: theme.colors.purple["60"],
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.purple["60"],
    },
    radioLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    bottomBar: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray["20"],
      backgroundColor: theme.colors.background.primary,
    },
    applyButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    resultsText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 12,
    },
  });

  const activeFiltersCount =
    selectedCategories.length +
    selectedContentTypes.length +
    (selectedDateRange ? 1 : 0) +
    (selectedSort !== "relevance" ? 1 : 0);

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
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearFilters}
          disabled={activeFiltersCount === 0}
          accessible
          accessibilityLabel="Clear all filters"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.clearButtonText,
              activeFiltersCount === 0 && { opacity: 0.5 },
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.filterGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  selectedCategories.includes(category.id) &&
                    styles.filterChipSelected,
                ]}
                onPress={() => toggleCategory(category.id)}
                accessible
                accessibilityLabel={`Filter by ${category.label}`}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategories.includes(category.id) &&
                      styles.filterChipTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Type</Text>
          <View style={styles.filterGrid}>
            {contentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.filterChip,
                  selectedContentTypes.includes(type.id) &&
                    styles.filterChipSelected,
                ]}
                onPress={() => toggleContentType(type.id)}
                accessible
                accessibilityLabel={`Filter by ${type.label}`}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedContentTypes.includes(type.id) &&
                      styles.filterChipTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.radioList}>
            {dateRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.radioOption,
                  selectedDateRange === range.id && styles.radioOptionSelected,
                ]}
                onPress={() => setSelectedDateRange(range.id)}
                accessible
                accessibilityLabel={`Filter by ${range.label}`}
                accessibilityRole="radio"
              >
                <View
                  style={[
                    styles.radioCircle,
                    selectedDateRange === range.id &&
                      styles.radioCircleSelected,
                  ]}
                >
                  {selectedDateRange === range.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{range.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.radioList}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.radioOption,
                  selectedSort === option.id && styles.radioOptionSelected,
                ]}
                onPress={() => setSelectedSort(option.id)}
                accessible
                accessibilityLabel={`Sort by ${option.label}`}
                accessibilityRole="radio"
              >
                <View
                  style={[
                    styles.radioCircle,
                    selectedSort === option.id && styles.radioCircleSelected,
                  ]}
                >
                  {selectedSort === option.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.resultsText}>
          {activeFiltersCount > 0
            ? `${activeFiltersCount} filter${activeFiltersCount > 1 ? "s" : ""} active`
            : "No filters applied"}
        </Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={applyFilters}
          accessible
          accessibilityLabel="Apply filters"
          accessibilityRole="button"
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SearchFiltersScreen;
