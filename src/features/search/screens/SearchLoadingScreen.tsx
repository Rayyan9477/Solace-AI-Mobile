/**
 * SearchLoadingScreen Component
 * @description Global search loading state with search bar, spinner, and loading text
 * @task Task 3.15.1: Search Loading Screen (Screen 129)
 * @audit-fix "Search freud.ai..." → "Search Solace..."
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface SearchLoadingScreenProps {
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
  iconColor: "rgba(255,255,255,0.5)",
} as const;

export function SearchLoadingScreen({
  query,
  onBack,
  onFilterPress,
  onQueryChange,
}: SearchLoadingScreenProps): React.ReactElement {
  return (
    <View testID="search-loading-screen" style={styles.container}>
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
      <View testID="search-bar" style={styles.searchBar}>
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

      {/* Loading Content */}
      <View style={styles.loadingContainer}>
        <View testID="loading-spinner" style={styles.spinner}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
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
  dot: {
    backgroundColor: colors.white,
    borderRadius: 5,
    height: 10,
    width: 10,
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
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 16,
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
  spinner: {
    flexDirection: "row",
    gap: 8,
  },
});

export default SearchLoadingScreen;
