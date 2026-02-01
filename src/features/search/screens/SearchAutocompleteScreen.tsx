/**
 * SearchAutocompleteScreen Component
 * @description Search input with autocomplete dropdown suggestions
 * @task Task 3.15.2: Search Autocomplete Screen (Screen 130)
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface SuggestionItem {
  id: string;
  text: string;
}

interface SearchAutocompleteScreenProps {
  query: string;
  suggestions: SuggestionItem[];
  highlightedIndex: number;
  onBack: () => void;
  onFilterPress: () => void;
  onQueryChange: (text: string) => void;
  onSuggestionPress: (suggestion: SuggestionItem) => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  searchBarBg: "#2A1F18",
  dropdownBg: "#2A1F18",
  highlightBg: "#3D2E23",
} as const;

export function SearchAutocompleteScreen({
  query,
  suggestions,
  highlightedIndex,
  onBack,
  onFilterPress,
  onQueryChange,
  onSuggestionPress,
}: SearchAutocompleteScreenProps): React.ReactElement {
  return (
    <View testID="search-autocomplete-screen" style={styles.container}>
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

      {/* Autocomplete Dropdown */}
      <View testID="autocomplete-dropdown" style={styles.dropdown}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={suggestion.id}
            testID={`suggestion-${suggestion.id}`}
            style={[
              styles.suggestionItem,
              index === highlightedIndex && styles.suggestionHighlighted,
            ]}
            onPress={() => onSuggestionPress(suggestion)}
            accessibilityRole="button"
            accessibilityLabel={suggestion.text}
          >
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
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
  dropdown: {
    marginHorizontal: 20,
    marginTop: 4,
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
  suggestionHighlighted: { backgroundColor: colors.highlightBg },
  suggestionItem: {
    backgroundColor: colors.dropdownBg,
    borderBottomColor: "rgba(255,255,255,0.05)",
    borderBottomWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionText: { color: colors.white, fontSize: 15 },
});

export default SearchAutocompleteScreen;
