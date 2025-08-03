import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  FlatList,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";

const SearchScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    "anxiety management",
    "sleep better",
    "depression support",
    "mindfulness exercises",
    "stress relief",
    "breathing techniques",
    "mood tracking",
    "therapy resources",
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const searchCategories = [
    {
      id: "resources",
      title: "Mental Health Resources",
      icon: "Brain",
      color: theme.colors.therapeutic.calming[500],
      description: "Articles, guides, and educational content",
    },
    {
      id: "techniques",
      title: "Coping Techniques",
      icon: "Mindfulness",
      color: theme.colors.therapeutic.peaceful[500],
      description: "Breathing, meditation, and stress management",
    },
    {
      id: "community",
      title: "Community Posts",
      icon: "Heart",
      color: theme.colors.therapeutic.nurturing[500],
      description: "Support groups and community discussions",
    },
    {
      id: "professionals",
      title: "Find Therapists",
      icon: "Therapy",
      color: theme.colors.therapeutic.grounding[500],
      description: "Licensed mental health professionals",
    },
  ];

  const mockSearchResults = {
    resources: [
      {
        id: "1",
        title: "Understanding Anxiety: A Complete Guide",
        description:
          "Learn about anxiety symptoms, causes, and effective management strategies.",
        type: "Article",
        category: "Anxiety",
        readTime: "8 min read",
      },
      {
        id: "2",
        title: "Sleep Hygiene for Better Mental Health",
        description:
          "How quality sleep impacts your mental wellbeing and tips for improvement.",
        type: "Guide",
        category: "Sleep",
        readTime: "5 min read",
      },
    ],
    techniques: [
      {
        id: "3",
        title: "4-7-8 Breathing Technique",
        description:
          "A simple breathing exercise to reduce anxiety and promote calm.",
        type: "Exercise",
        category: "Breathing",
        duration: "5 minutes",
      },
      {
        id: "4",
        title: "Progressive Muscle Relaxation",
        description:
          "Step-by-step guide to releasing physical tension and stress.",
        type: "Technique",
        category: "Relaxation",
        duration: "15 minutes",
      },
    ],
    community: [
      {
        id: "5",
        title: "Anxiety Support Group",
        description: "A welcoming community for those dealing with anxiety.",
        type: "Group",
        members: 1247,
        activity: "Very Active",
      },
      {
        id: "6",
        title: "Daily Motivation",
        description: "Share and find daily inspiration and positive thoughts.",
        type: "Forum",
        members: 892,
        activity: "Active",
      },
    ],
    professionals: [
      {
        id: "7",
        title: "Dr. Sarah Johnson, LCSW",
        description: "Specializing in anxiety, depression, and trauma therapy.",
        type: "Therapist",
        location: "Online & In-Person",
        rating: 4.9,
      },
      {
        id: "8",
        title: "Dr. Michael Chen, PhD",
        description:
          "Cognitive Behavioral Therapy and mindfulness-based interventions.",
        type: "Psychologist",
        location: "Online Only",
        rating: 4.8,
      },
    ],
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Load recent searches from storage
    setRecentSearches(["anxiety help", "sleep tips", "breathing exercises"]);
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      const results = [];

      // Search in all categories
      Object.entries(mockSearchResults).forEach(([category, items]) => {
        const filteredItems = items.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category?.toLowerCase().includes(query.toLowerCase()),
        );

        if (filteredItems.length > 0) {
          results.push({
            category,
            categoryTitle:
              searchCategories.find((c) => c.id === category)?.title ||
              category,
            items: filteredItems,
          });
        }
      });

      setSearchResults(results);
      setIsSearching(false);

      // Add to recent searches
      if (!recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
      }
    }, 500);
  };

  const handleCategoryPress = (category) => {
    setSearchQuery(category.title.toLowerCase());
    handleSearch(category.title);
  };

  const handleRecentSearchPress = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const renderSearchResult = (item, category) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        { backgroundColor: theme.colors.background.secondary },
      ]}
      onPress={() => {
        // Navigate to specific result
        navigation.navigate("SearchResult", { item, category });
      }}
    >
      <View style={styles.resultHeader}>
        <Text
          style={[styles.resultTitle, { color: theme.colors.text.primary }]}
        >
          {item.title}
        </Text>
        <View
          style={[
            styles.resultTypeBadge,
            { backgroundColor: theme.colors.therapeutic.calming[100] },
          ]}
        >
          <Text
            style={[
              styles.resultTypeText,
              { color: theme.colors.therapeutic.calming[700] },
            ]}
          >
            {item.type}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.resultDescription,
          { color: theme.colors.text.secondary },
        ]}
      >
        {item.description}
      </Text>

      <View style={styles.resultMeta}>
        {item.readTime && (
          <Text
            style={[
              styles.resultMetaText,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {item.readTime}
          </Text>
        )}
        {item.duration && (
          <Text
            style={[
              styles.resultMetaText,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {item.duration}
          </Text>
        )}
        {item.members && (
          <Text
            style={[
              styles.resultMetaText,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {item.members.toLocaleString()} members
          </Text>
        )}
        {item.rating && (
          <Text
            style={[
              styles.resultMetaText,
              { color: theme.colors.text.tertiary },
            ]}
          >
            ⭐ {item.rating}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.nurturing[50],
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <View
              style={[
                styles.searchInputContainer,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <MentalHealthIcon
                name="Brain"
                size={20}
                color={theme.colors.text.secondary}
                variant="outline"
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: theme.colors.text.primary },
                ]}
                placeholder="Search for resources, techniques, support..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearch(searchQuery)}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <MentalHealthIcon
                    name="Heart"
                    size={20}
                    color={theme.colors.text.secondary}
                    variant="outline"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[styles.animatedContainer, { opacity: fadeAnim }]}
          >
            {/* Search Results */}
            {searchResults.length > 0 ? (
              <View style={styles.resultsContainer}>
                {searchResults.map((categoryResults) => (
                  <View
                    key={categoryResults.category}
                    style={styles.resultCategory}
                  >
                    <Text
                      style={[
                        styles.resultCategoryTitle,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {categoryResults.categoryTitle}
                    </Text>
                    {categoryResults.items.map((item) =>
                      renderSearchResult(item, categoryResults.category),
                    )}
                  </View>
                ))}
              </View>
            ) : searchQuery.length > 0 && !isSearching ? (
              <View style={styles.noResults}>
                <MentalHealthIcon
                  name="Brain"
                  size={48}
                  color={theme.colors.gray[400]}
                  variant="outline"
                />
                <Text
                  style={[
                    styles.noResultsTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  No results found
                </Text>
                <Text
                  style={[
                    styles.noResultsText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Try different keywords or browse categories below
                </Text>
              </View>
            ) : (
              <>
                {/* Search Categories */}
                <View style={styles.categoriesSection}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Browse Categories
                  </Text>

                  <View style={styles.categoriesGrid}>
                    {searchCategories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryCard,
                          { backgroundColor: theme.colors.background.primary },
                        ]}
                        onPress={() => handleCategoryPress(category)}
                      >
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: category.color },
                          ]}
                        >
                          <MentalHealthIcon
                            name={category.icon}
                            size={24}
                            color={theme.colors.text.inverse}
                            variant="filled"
                          />
                        </View>
                        <Text
                          style={[
                            styles.categoryTitle,
                            { color: theme.colors.text.primary },
                          ]}
                        >
                          {category.title}
                        </Text>
                        <Text
                          style={[
                            styles.categoryDescription,
                            { color: theme.colors.text.secondary },
                          ]}
                        >
                          {category.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <View style={styles.recentSection}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      Recent Searches
                    </Text>

                    <View style={styles.recentSearches}>
                      {recentSearches.map((search, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.recentSearchItem,
                            {
                              backgroundColor: theme.colors.background.primary,
                            },
                          ]}
                          onPress={() => handleRecentSearchPress(search)}
                        >
                          <MentalHealthIcon
                            name="Brain"
                            size={16}
                            color={theme.colors.text.secondary}
                            variant="outline"
                          />
                          <Text
                            style={[
                              styles.recentSearchText,
                              { color: theme.colors.text.primary },
                            ]}
                          >
                            {search}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Popular Searches */}
                <View style={styles.popularSection}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Popular Searches
                  </Text>

                  <View style={styles.popularSearches}>
                    {popularSearches.map((search, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.popularSearchItem,
                          {
                            backgroundColor:
                              theme.colors.therapeutic.calming[100],
                          },
                        ]}
                        onPress={() => handleRecentSearchPress(search)}
                      >
                        <Text
                          style={[
                            styles.popularSearchText,
                            { color: theme.colors.therapeutic.calming[700] },
                          ]}
                        >
                          {search}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {isSearching && (
              <View style={styles.loadingContainer}>
                <Text
                  style={[
                    styles.loadingText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Searching...
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  recentSection: {
    marginBottom: 32,
  },
  recentSearches: {
    gap: 8,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
  },
  recentSearchText: {
    fontSize: 14,
  },
  popularSection: {
    marginBottom: 32,
  },
  popularSearches: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  popularSearchItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  popularSearchText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultCategory: {
    marginBottom: 24,
  },
  resultCategoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  resultItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  resultTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultTypeText: {
    fontSize: 10,
    fontWeight: "500",
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    gap: 12,
  },
  resultMetaText: {
    fontSize: 12,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
});

export default SearchScreen;
