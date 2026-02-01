/**
 * SearchResultsScreen Component
 * @description Search results with category filters, sort dropdown, and result rows
 * @task Task 3.15.4: Search Results Screen (Screen 132)
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface CategoryChip {
  id: string;
  label: string;
  icon: string;
}

interface SearchResultItem {
  id: string;
  title: string;
  categoryLabel: string;
  iconColor: string;
}

interface SearchResultsScreenProps {
  query: string;
  resultCount: number;
  sortLabel: string;
  categories: CategoryChip[];
  selectedCategoryId: string | null;
  results: SearchResultItem[];
  onBack: () => void;
  onFilterPress: () => void;
  onQueryChange: (text: string) => void;
  onSortPress: () => void;
  onCategorySelect: (id: string) => void;
  onResultPress: (result: SearchResultItem) => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  searchBarBg: "#2A1F18",
  chipBg: "#2A1F18",
  chipSelected: "#E8853A",
  rowBg: "#2A1F18",
} as const;

export function SearchResultsScreen({
  query,
  resultCount,
  sortLabel,
  categories,
  selectedCategoryId,
  results,
  onBack,
  onFilterPress,
  onQueryChange,
  onSortPress,
  onCategorySelect,
  onResultPress,
}: SearchResultsScreenProps): React.ReactElement {
  return (
    <View testID="search-results-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>{"\uD83D\uDD0D"}</Text>
        <TextInput
          testID="search-input"
          style={styles.searchInput}
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search Solace..."
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Search"
        />
        <TouchableOpacity
          testID="filter-button"
          style={styles.filterButton}
          onPress={onFilterPress}
          accessibilityRole="button"
          accessibilityLabel="Filter"
        >
          <Text style={styles.filterIcon}>{"\u2699\uFE0F"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultCount}>
            {resultCount} Results Found.
          </Text>
          <TouchableOpacity
            testID="sort-button"
            style={styles.sortButton}
            onPress={onSortPress}
            accessibilityRole="button"
            accessibilityLabel={`Sort by ${sortLabel}`}
          >
            <Text style={styles.sortLabel}>
              {sortLabel} {"\u25BC"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              testID={`category-chip-${cat.id}`}
              style={[
                styles.chip,
                selectedCategoryId === cat.id && styles.chipSelected,
              ]}
              onPress={() => onCategorySelect(cat.id)}
              accessibilityRole="button"
              accessibilityLabel={cat.label}
            >
              <Text style={styles.chipText}>
                {cat.icon} {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results List */}
        {results.map((result) => (
          <TouchableOpacity
            key={result.id}
            testID={`result-row-${result.id}`}
            style={styles.resultRow}
            onPress={() => onResultPress(result)}
            accessibilityRole="button"
            accessibilityLabel={result.title}
          >
            <View
              testID={`result-icon-${result.id}`}
              style={[
                styles.resultIcon,
                { backgroundColor: result.iconColor },
              ]}
            />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultCategory}>{result.categoryLabel}</Text>
            </View>
            <Text
              testID={`result-chevron-${result.id}`}
              style={styles.chevron}
            >
              {"\u203A"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  chevron: { color: colors.textSecondary, fontSize: 24 },
  chip: {
    backgroundColor: colors.chipBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipSelected: { backgroundColor: colors.chipSelected },
  chipText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  container: { backgroundColor: colors.background, flex: 1 },
  filterButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  filterIcon: { fontSize: 18 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  resultCategory: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  resultCount: { color: colors.textSecondary, fontSize: 13 },
  resultIcon: {
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  resultRow: {
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 4,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultTextContainer: { flex: 1, marginLeft: 12 },
  resultTitle: { color: colors.white, fontSize: 15, fontWeight: "600" },
  resultsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scrollContent: { paddingBottom: 48 },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.searchBarBg,
    borderRadius: 12,
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    color: colors.white,
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  sortButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  sortLabel: { color: colors.white, fontSize: 13, fontWeight: "600" },
});

export default SearchResultsScreen;
