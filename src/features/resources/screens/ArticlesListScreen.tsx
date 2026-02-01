/**
 * ArticlesListScreen Component
 * @description Full articles listing with curved header, search bar, category pills,
 *   and full-width article cards
 * @task Task 3.13.2: Articles List Screen (Screen 113)
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

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  headerBg: "#9AAD5C",
  cardBg: "#2A1F18",
  searchBg: "#2A1F18",
  pillBg: "#2A1F18",
  pillSelected: "#9AAD5C",
  textSecondary: "rgba(255,255,255,0.6)",
  seeAll: "#9AAD5C",
  categoryBadgeBg: "#9AAD5C",
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
            placeholderTextColor={colors.textSecondary}
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
    color: colors.white,
    fontSize: 24,
    marginLeft: 8,
  },
  articleBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.categoryBadgeBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  articleBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
  },
  articleCard: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
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
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    height: 80,
    width: 80,
  },
  articleTitle: {
    color: colors.white,
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
    color: colors.white,
    fontSize: 24,
  },
  categoryPill: {
    alignItems: "center",
    backgroundColor: colors.pillBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryPillSelected: {
    backgroundColor: colors.pillSelected,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  curvedHeader: {
    backgroundColor: colors.headerBg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 8,
  },
  optionsIcon: {
    color: colors.white,
    fontSize: 20,
  },
  pillIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  pillLabel: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  pillLabelSelected: {
    color: colors.white,
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
    backgroundColor: colors.searchBg,
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
    color: colors.white,
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
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  seeAllText: {
    color: colors.seeAll,
    fontSize: 13,
    fontWeight: "600",
  },
});

export default ArticlesListScreen;
