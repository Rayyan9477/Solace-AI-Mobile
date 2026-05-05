/**
 * SearchResultsScreen — prototype v4.2 #36 reskin (Sprint 9).
 *
 * Cosmic search surface. Top row: back IconButton + glass-strong rounded search
 * input with aurora search icon and X clear. Bracket "N results for "{query}""
 * with `accessibilityLiveRegion="polite"`. Horizontal FilterPills (All / Chats /
 * Journal / Practices / Articles) with counts. Then three category sections
 * each with bracket label + "All N" link aurora and glass result rows.
 *
 * Maps to `prototypes/screens/36-search.js`.
 */

import React, { useMemo } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { FilterPills } from "@/shared/components/molecules/navigation/FilterPills";
import {
  BracketLabel,
  GlassCard,
  IconTile,
  type IconTileHue,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

import { sectionStyles, styles } from "./SearchResultsScreen.styles";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type SearchCategory =
  | "all"
  | "chats"
  | "journal"
  | "practices"
  | "articles";

export type SearchResultType = "practice" | "journal" | "article";

export interface PracticeResult {
  id: string;
  type: "practice";
  iconName: string;
  hue: IconTileHue;
  title: string;
  caption: string;
}

export interface JournalResult {
  id: string;
  type: "journal";
  date: string;
  mood: string;
  title: string;
  preview: string;
}

export interface ArticleResult {
  id: string;
  type: "article";
  iconName: string;
  title: string;
  readMinutes: number;
}

export type SearchResult = PracticeResult | JournalResult | ArticleResult;

export interface SearchResults {
  totalCount: number;
  practices: PracticeResult[];
  journal: JournalResult[];
  articles: ArticleResult[];
  categoryCounts: {
    all: number;
    chats: number;
    journal: number;
    practices: number;
    articles: number;
  };
}

export interface SearchResultsScreenProps {
  query?: string;
  results?: SearchResults;
  selectedCategory?: SearchCategory;
  onBack: () => void;
  onClear?: () => void;
  onQueryChange?: (_q: string) => void;
  onCategoryChange?: (_c: SearchCategory) => void;
  onResultPress?: (_id: string, _type: SearchResultType) => void;
  /** @deprecated legacy stack — ignored. */
  onFilterPress?: () => void;
  /** @deprecated legacy stack — ignored. */
  onSortPress?: () => void;
  /** @deprecated legacy stack — ignored. */
  onCategorySelect?: (_id: string) => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_SEARCH_RESULTS: SearchResults = {
  totalCount: 24,
  categoryCounts: {
    all: 24,
    chats: 8,
    journal: 5,
    practices: 7,
    articles: 4,
  },
  practices: [
    {
      id: "practice-478",
      type: "practice",
      iconName: "wind",
      hue: "sage",
      title: "4-7-8 breathing",
      caption: "Calms anxiety in 4 min",
    },
    {
      id: "practice-body-scan",
      type: "practice",
      iconName: "user-round",
      hue: "lavender",
      title: "Body scan for anxious minds",
      caption: "10 min guided meditation",
    },
  ],
  journal: [
    {
      id: "journal-apr-3",
      type: "journal",
      date: "Apr 3",
      mood: "Stressed",
      title: "Handling work anxiety",
      preview:
        "I’ve been feeling more on-edge than usual about the new project…",
    },
  ],
  articles: [
    {
      id: "article-triggers",
      type: "article",
      iconName: "book-open",
      title: "Understanding your anxiety triggers",
      readMinutes: 6,
    },
  ],
};

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  title: string;
  link: string;
  testID: string;
  onPress?: () => void;
}

function SectionHeader({
  title,
  link,
  testID,
  onPress,
}: SectionHeaderProps): React.ReactElement {
  const { palette, typography } = useTheme();

  return (
    <View style={sectionStyles.header}>
      <BracketLabel variant="muted">{title}</BracketLabel>
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        accessibilityRole="link"
        accessibilityLabel={`${link} ${title}`}
        hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
        style={sectionStyles.link}
      >
        <Text
          style={[
            sectionStyles.linkText,
            {
              color: palette.aurora[300],
              fontFamily: typography.fontFamily.sansMedium,
            },
          ]}
        >
          {link}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface ResultRowBaseProps {
  testID: string;
  onPress: () => void;
  accessibilityLabel: string;
  children: React.ReactNode;
}

function ResultRow({
  testID,
  onPress,
  accessibilityLabel,
  children,
}: ResultRowBaseProps): React.ReactElement {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.85}
      style={sectionStyles.rowTouchable}
    >
      <GlassCard radius={20} style={sectionStyles.rowCard}>
        {children}
      </GlassCard>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SearchResultsScreen({
  query = "anxiety",
  results = DEFAULT_SEARCH_RESULTS,
  selectedCategory = "all",
  onBack,
  onClear,
  onQueryChange,
  onCategoryChange,
  onResultPress,
  testID = "search-results-screen",
  style,
}: SearchResultsScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const filterPills = useMemo(
    () => [
      { id: "all", label: "All", count: results.categoryCounts.all },
      { id: "chats", label: "Chats", count: results.categoryCounts.chats },
      {
        id: "journal",
        label: "Journal",
        count: results.categoryCounts.journal,
      },
      {
        id: "practices",
        label: "Practices",
        count: results.categoryCounts.practices,
      },
      {
        id: "articles",
        label: "Articles",
        count: results.categoryCounts.articles,
      },
    ],
    [results.categoryCounts],
  );

  const handleCategoryChange = (id: string): void => {
    onCategoryChange?.(id as SearchCategory);
  };

  const handleResultPress = (id: string, type: SearchResultType): void => {
    onResultPress?.(id, type);
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search bar row */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            testID="back-button"
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="arrow-left" size={16} color={palette.warm[400]} />
          </TouchableOpacity>

          <View
            testID="search-input-wrap"
            style={[
              styles.searchField,
              {
                backgroundColor: palette.midnight[700],
                borderColor: palette.aurora[300],
              },
            ]}
          >
            <AppIcon name="search" size={16} color={palette.aurora[300]} />
            <TextInput
              testID="search-input"
              value={query}
              onChangeText={(text) => onQueryChange?.(text)}
              placeholder="Search everything…"
              placeholderTextColor={palette.warm[500]}
              accessibilityLabel="Search everything"
              style={[
                styles.searchInput,
                {
                  color: palette.warm[50],
                  fontFamily: typography.fontFamily.sans,
                },
              ]}
              returnKeyType="search"
            />
            <TouchableOpacity
              testID="clear-button"
              onPress={() => onClear?.()}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
              style={[
                styles.clearButton,
                { backgroundColor: palette.opacity.white08 },
              ]}
            >
              <AppIcon name="x" size={12} color={palette.warm[400]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Result count line */}
        <View
          testID="results-count"
          accessibilityLiveRegion="polite"
          style={styles.countLine}
        >
          <BracketLabel variant="muted">
            {`${results.totalCount} results for "${query}"`}
          </BracketLabel>
        </View>

        {/* Category tabs */}
        <View style={styles.filterRow}>
          <FilterPills
            testID="category-pills"
            pills={filterPills}
            activeId={selectedCategory}
            onChange={handleCategoryChange}
          />
        </View>

        {/* Practices section */}
        {results.practices.length > 0 ? (
          <View testID="practices-section" style={styles.section}>
            <SectionHeader
              title="Practices"
              link={`All ${results.categoryCounts.practices}`}
              testID="practices-all-link"
              onPress={() => handleCategoryChange("practices")}
            />
            <View style={styles.list}>
              {results.practices.map((p) => (
                <ResultRow
                  key={p.id}
                  testID={`result-row-${p.id}`}
                  accessibilityLabel={`${p.title}. ${p.caption}.`}
                  onPress={() => handleResultPress(p.id, "practice")}
                >
                  <View style={sectionStyles.rowInner}>
                    <IconTile
                      iconName={p.iconName}
                      hue={p.hue}
                      size={36}
                      iconSize={16}
                      style={sectionStyles.rowIcon}
                    />
                    <View style={sectionStyles.rowBody}>
                      <Text
                        style={[
                          sectionStyles.rowTitle,
                          {
                            color: palette.warm[50],
                            fontFamily: typography.fontFamily.sansMedium,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {p.title}
                      </Text>
                      <Text
                        style={[
                          sectionStyles.rowCaption,
                          { color: palette.warm[500] },
                        ]}
                        numberOfLines={1}
                      >
                        {p.caption}
                      </Text>
                    </View>
                    <AppIcon
                      name="chevron-right"
                      size={14}
                      color={palette.warm[500]}
                    />
                  </View>
                </ResultRow>
              ))}
            </View>
          </View>
        ) : null}

        {/* Journal section */}
        {results.journal.length > 0 ? (
          <View testID="journal-section" style={styles.section}>
            <SectionHeader
              title="Journal"
              link={`All ${results.categoryCounts.journal}`}
              testID="journal-all-link"
              onPress={() => handleCategoryChange("journal")}
            />
            <View style={styles.list}>
              {results.journal.map((j) => (
                <ResultRow
                  key={j.id}
                  testID={`result-row-${j.id}`}
                  accessibilityLabel={`Journal entry from ${j.date}, mood ${j.mood}: ${j.title}`}
                  onPress={() => handleResultPress(j.id, "journal")}
                >
                  <View style={sectionStyles.journalInner}>
                    <View
                      style={[
                        sectionStyles.accentBar,
                        { backgroundColor: palette.lavender[300] },
                      ]}
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
                    />
                    <View style={sectionStyles.journalBody}>
                      <View style={sectionStyles.journalHeader}>
                        <BracketLabel variant="muted">{j.date}</BracketLabel>
                        <Text
                          style={[
                            sectionStyles.journalDot,
                            { color: palette.warm[500] },
                          ]}
                        >
                          ·
                        </Text>
                        <Text
                          style={[
                            sectionStyles.journalMood,
                            {
                              color: palette.lavender[300],
                              fontFamily: typography.fontFamily.sansMedium,
                            },
                          ]}
                        >
                          {j.mood}
                        </Text>
                      </View>
                      <Text
                        style={[
                          sectionStyles.rowTitle,
                          {
                            color: palette.warm[50],
                            fontFamily: typography.fontFamily.sansMedium,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {j.title}
                      </Text>
                      <Text
                        style={[
                          sectionStyles.rowCaption,
                          { color: palette.warm[500] },
                        ]}
                        numberOfLines={1}
                      >
                        {j.preview}
                      </Text>
                    </View>
                  </View>
                </ResultRow>
              ))}
            </View>
          </View>
        ) : null}

        {/* Articles section */}
        {results.articles.length > 0 ? (
          <View testID="articles-section" style={styles.section}>
            <SectionHeader
              title="Articles"
              link={`All ${results.categoryCounts.articles}`}
              testID="articles-all-link"
              onPress={() => handleCategoryChange("articles")}
            />
            <View style={styles.list}>
              {results.articles.map((a) => (
                <ResultRow
                  key={a.id}
                  testID={`result-row-${a.id}`}
                  accessibilityLabel={`${a.title}, ${a.readMinutes} minute read.`}
                  onPress={() => handleResultPress(a.id, "article")}
                >
                  <View style={sectionStyles.rowInner}>
                    <IconTile
                      iconName={a.iconName}
                      hue="peach"
                      size={36}
                      iconSize={16}
                      style={sectionStyles.rowIcon}
                    />
                    <View style={sectionStyles.rowBody}>
                      <Text
                        style={[
                          sectionStyles.rowTitle,
                          {
                            color: palette.warm[50],
                            fontFamily: typography.fontFamily.sansMedium,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {a.title}
                      </Text>
                      <Text
                        style={[
                          sectionStyles.rowCaption,
                          {
                            color: palette.warm[500],
                            fontFamily: typography.fontFamily.mono,
                          },
                        ]}
                      >
                        {`${a.readMinutes} min read`}
                      </Text>
                    </View>
                  </View>
                </ResultRow>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}


export default SearchResultsScreen;
