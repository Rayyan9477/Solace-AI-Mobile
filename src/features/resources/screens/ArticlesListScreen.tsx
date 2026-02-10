/**
 * ArticlesListScreen Component
 * @description Full articles listing with curved header, search bar, category pills,
 *   and full-width article cards
 * @task Task 3.13.2: Articles List Screen (Screen 113)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix Replaced "Freud App" with "Solace App" in sample titles
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface CategoryOption {
  id: string;
  label: string;
  icon: string;
}

interface ArticleItem {
  id: string;
  title: string;
  category: string;
}

interface ArticlesListScreenProps {
  searchPlaceholder: string;
  searchQuery: string;
  categories: CategoryOption[];
  selectedCategoryId: string | null;
  articles: ArticleItem[];
  onBack: () => void;
  onSearchChange: (query: string) => void;
  onCategorySelect: (id: string) => void;
  onSeeAllCategories: () => void;
  onArticlePress: (id: string) => void;
  onArticleOptions: () => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  headerBg: palette.olive[500],
  cardBg: palette.brown[800],
  searchBg: palette.brown[800],
  pillBg: palette.brown[800],
  pillSelected: palette.olive[500],
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  seeAll: palette.olive[500],
  categoryBadgeBg: palette.olive[500],
} as const;

export function ArticlesListScreen({
  searchPlaceholder,
  searchQuery,
  categories,
  selectedCategoryId,
  articles,
  onBack,
  onSearchChange,
  onCategorySelect,
  onSeeAllCategories,
  onArticlePress,
  onArticleOptions,
}: ArticlesListScreenProps): React.ReactElement {
  return (
    <View testID="articles-list-screen" style={styles.container}>
      {/* Curved Header */}
      <View style={styles.curvedHeader}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u263E"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Articles</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            accessibilityLabel="Text input field"
            testID="search-input"
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={localColors.textSecondary}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          <Text style={styles.searchIcon}>{"\uD83D\uDD0D"}</Text>
        </View>

        {/* Suggested Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Suggested Category</Text>
          <TouchableOpacity
            testID="see-all-categories"
            onPress={onSeeAllCategories}
            accessibilityRole="button"
            accessibilityLabel="See all categories"
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <TouchableOpacity
                key={cat.id}
                testID={`category-pill-${cat.id}`}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
                onPress={() => onCategorySelect(cat.id)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${cat.label}`}
              >
                <Text style={styles.pillIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.pillLabel,
                    isSelected && styles.pillLabelSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* All Articles */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>All Articles</Text>
          <TouchableOpacity
            onPress={onArticleOptions}
            accessibilityRole="button"
            accessibilityLabel="Article options"
          >
            <Text style={styles.optionsIcon}>{"\u22EF"}</Text>
          </TouchableOpacity>
        </View>

        {articles.map((article) => (
          <TouchableOpacity
            key={article.id}
            testID={`article-card-${article.id}`}
            style={styles.articleCard}
            onPress={() => onArticlePress(article.id)}
            accessibilityRole="button"
            accessibilityLabel={article.title}
          >
            <View style={styles.articleImage} />
            <View style={styles.articleContent}>
              <View style={styles.articleBadge}>
                <Text style={styles.articleBadgeText}>{article.category}</Text>
              </View>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>
            </View>
            <Text style={styles.arrowIndicator}>{"\u203A"}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  arrowIndicator: {
    color: localColors.white,
    fontSize: 24,
    marginLeft: 8,
  },
  articleBadge: {
    alignSelf: "flex-start",
    backgroundColor: localColors.categoryBadgeBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  articleBadgeText: {
    color: localColors.white,
    fontSize: 10,
    fontWeight: "600",
  },
  articleCard: {
    alignItems: "center",
    backgroundColor: localColors.cardBg,
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 12,
    marginHorizontal: 24,
    overflow: "hidden",
    padding: 12,
  },
  articleContent: {
    flex: 1,
    marginLeft: 12,
  },
  articleImage: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 12,
    height: 80,
    width: 80,
  },
  articleTitle: {
    color: localColors.white,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 6,
  },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: localColors.white,
    fontSize: 24,
  },
  categoryPill: {
    alignItems: "center",
    backgroundColor: localColors.pillBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryPillSelected: {
    backgroundColor: localColors.pillSelected,
  },
  container: {
    backgroundColor: localColors.background,
    flex: 1,
  },
  curvedHeader: {
    backgroundColor: localColors.headerBg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: localColors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 8,
  },
  optionsIcon: {
    color: localColors.white,
    fontSize: 20,
  },
  pillIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  pillLabel: {
    color: localColors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  pillLabelSelected: {
    color: localColors.white,
  },
  pillsRow: {
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchContainer: {
    alignItems: "center",
    backgroundColor: localColors.searchBg,
    borderRadius: 24,
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  searchInput: {
    color: localColors.white,
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    color: localColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  seeAllText: {
    color: localColors.seeAll,
    fontSize: 13,
    fontWeight: "600",
  },
});

export default ArticlesListScreen;
