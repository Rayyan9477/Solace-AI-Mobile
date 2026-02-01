/**
 * SearchNoResultsScreen Component
 * @description Empty state when search returns no results, with illustration and guidance
 * @task Task 3.15.3: Search No Results Screen (Screen 131)
 * @audit-fix "found.404" → "found. 404" (Issue #29 - missing space)
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface SearchNoResultsScreenProps {
  query: string;
  onBack: () => void;
  onFilterPress: () => void;
  onQueryChange: (text: string) => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  searchBarBg: "#2A1F18",
  illustrationBg: "rgba(255,255,255,0.05)",
} as const;

export function SearchNoResultsScreen({
  query,
  onBack,
  onFilterPress,
  onQueryChange,
}: SearchNoResultsScreenProps): React.ReactElement {
  return (
    <View testID="search-no-results-screen" style={styles.container}>
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

      {/* Empty State */}
      <View style={styles.emptyStateContainer}>
        <View testID="empty-state-illustration" style={styles.illustration} />
        <Text style={styles.emptyTitle}>
          {"Not Found \uD83D\uDE22"}
        </Text>
        <Text style={styles.emptyMessage}>
          Unfortunately, the key you entered cannot be found. 404 Error, please
          try another keyword or check again.
        </Text>
      </View>
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
  container: { backgroundColor: colors.background, flex: 1 },
  emptyMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 32,
    textAlign: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 24,
    textAlign: "center",
  },
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
  illustration: {
    backgroundColor: colors.illustrationBg,
    borderRadius: 80,
    height: 160,
    width: 160,
  },
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
});

export default SearchNoResultsScreen;
