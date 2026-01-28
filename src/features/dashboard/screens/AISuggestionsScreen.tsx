/**
 * AISuggestionsScreen Component
 * @description AI-generated mental health suggestions screen
 * @task Task 3.5.5: AI Suggestions Screen (Screen 44)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type CategoryType = "mindfulness" | "physical" | "social" | "professional";
type SortType = "newest" | "oldest" | "duration" | "category";

interface SuggestionIcon {
  icon: string;
  color: string;
}

interface SuggestionCategory {
  id: string;
  category: CategoryType;
  title: string;
  subtitle: string;
  duration: string;
  activityCount: number;
  icons: SuggestionIcon[];
}

interface AISuggestionsScreenProps {
  totalCount: number;
  sortBy: SortType;
  suggestions: SuggestionCategory[];
  onBack: () => void;
  onToggleDarkMode: () => void;
  onSortChange: (sort: SortType) => void;
  onSuggestionPress: (id: string) => void;
}

const getSortLabel = (sort: SortType): string => {
  switch (sort) {
    case "newest":
      return "Newest";
    case "oldest":
      return "Oldest";
    case "duration":
      return "Duration";
    case "category":
      return "Category";
    default:
      return "Newest";
  }
};

const getCategoryIconEmoji = (icon: string): string => {
  switch (icon) {
    case "meditation":
      return "🧘";
    case "yoga":
      return "🧘‍♀️";
    case "running":
      return "🏃";
    case "cycling":
      return "🚴";
    case "social":
      return "👥";
    case "people":
      return "🤝";
    case "therapy":
      return "💬";
    case "phone":
      return "📞";
    default:
      return "✨";
  }
};

export function AISuggestionsScreen({
  totalCount,
  sortBy,
  suggestions,
  onBack,
  onToggleDarkMode,
  onSortChange,
  onSuggestionPress,
}: AISuggestionsScreenProps): React.ReactElement {
  return (
    <View testID="ai-suggestions-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="dark-mode-toggle"
          style={styles.darkModeToggle}
          onPress={onToggleDarkMode}
          accessibilityRole="button"
          accessibilityLabel="Toggle dark mode"
        >
          <Text style={styles.darkModeIcon}>🌙</Text>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.screenTitle}>AI Score Suggestions</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statText}>{totalCount} Total</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statIcon}>🤖</Text>
            <Text style={styles.statText}>Solace AI</Text>
          </View>
        </View>
      </View>

      {/* Filter Bar */}
      <View testID="filter-bar" style={styles.filterBar}>
        <Text style={styles.filterLabel}>All Suggestions</Text>
        <TouchableOpacity
          testID="sort-dropdown"
          style={styles.sortDropdown}
          onPress={() => onSortChange(sortBy)}
          accessibilityRole="button"
          accessibilityLabel="Change sort order"
        >
          <Text style={styles.sortText}>{getSortLabel(sortBy)}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Suggestions List */}
      <ScrollView
        style={styles.suggestionsList}
        showsVerticalScrollIndicator={false}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            testID={`suggestion-card-${suggestion.id}`}
            style={styles.suggestionCard}
            onPress={() => onSuggestionPress(suggestion.id)}
            accessibilityRole="button"
            accessibilityLabel={`${suggestion.title}, ${suggestion.subtitle}`}
          >
            {/* Icon Row */}
            <View
              testID={`icon-row-${suggestion.id}`}
              style={styles.iconRow}
            >
              {suggestion.icons.map((iconItem, index) => (
                <View
                  key={index}
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: iconItem.color },
                  ]}
                >
                  <Text style={styles.categoryIconText}>
                    {getCategoryIconEmoji(iconItem.icon)}
                  </Text>
                </View>
              ))}
              <View
                testID={`activity-count-badge-${suggestion.id}`}
                style={styles.countBadge}
              >
                <Text style={styles.countBadgeText}>
                  {suggestion.activityCount}+
                </Text>
              </View>
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{suggestion.title}</Text>
              <Text style={styles.cardSubtitle}>
                {suggestion.subtitle} • {suggestion.duration}
              </Text>
            </View>

            {/* Chevron */}
            <View testID={`chevron-${suggestion.id}`} style={styles.chevron}>
              <Text style={styles.chevronIcon}>{">"}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  categoryIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    marginRight: 8,
    width: 32,
  },
  categoryIconText: {
    fontSize: 16,
  },
  chevron: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
  },
  chevronIcon: {
    color: "#94A3B8",
    fontSize: 18,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  countBadge: {
    alignItems: "center",
    backgroundColor: "#E8853A",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  darkModeIcon: {
    fontSize: 20,
  },
  darkModeToggle: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  dropdownArrow: {
    color: "#FFFFFF",
    fontSize: 10,
    marginLeft: 4,
  },
  filterBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  filterLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  iconRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  screenTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  sortDropdown: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  statBadge: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    flexDirection: "row",
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
  },
  suggestionCard: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 12,
    marginHorizontal: 24,
    padding: 16,
  },
  suggestionsList: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
});

export default AISuggestionsScreen;
