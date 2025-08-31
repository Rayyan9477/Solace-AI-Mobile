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
  Keyboard,
  Dimensions,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width } = Dimensions.get("window");

const DarkSearchScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchFocus, setSearchFocus] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  const suggestions = [
    "Meditation Practice",
    "Meditation Schedule",
    "Meditation AI Suggestion",
    "My Meditation",
    "Medic",
  ];

  const filters = [
    { id: "sleep", label: "Sleep", color: "#FF8C42" },
    { id: "mood", label: "Mood", color: "#6366F1" },
    { id: "meditation", label: "Meditation", color: "#10B981" },
    { id: "help", label: "Help", color: "#8B5CF6" },
  ];

  const searchCategories = [
    { id: "journal", label: "Journal", color: "#6B7280", selected: false },
    { id: "sleep", label: "Sleep", color: "#FF8C42", selected: true },
    { id: "community", label: "Community", color: "#10B981", selected: false },
  ];

  const mockResults = [
    {
      id: "1",
      title: "My Mood History",
      subtitle: "In Mood & Emotions",
      icon: "mood",
      color: "#10B981",
      category: "mood",
    },
    {
      id: "2",
      title: "Mood Improvements",
      subtitle: "In Resources & Videos",
      icon: "insights",
      color: "#FF8C42",
      category: "mood",
    },
    {
      id: "3",
      title: "Mood Journals",
      subtitle: "In Mental Health Journal",
      icon: "journal",
      color: "#F59E0B",
      category: "mood",
    },
    {
      id: "4",
      title: "AI Chatbot Mood Suggestion",
      subtitle: "In AI Therapy Chatbot",
      icon: "therapy",
      color: "#8B5CF6",
      category: "mood",
    },
    {
      id: "5",
      title: "My Current Mood",
      subtitle: "In Mood & Emotions",
      icon: "mood",
      color: "#6B7280",
      category: "mood",
    },
  ];

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Load recent searches
    setRecentSearches(["freud ai", "meditation session", "mood tracker"]);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
      // Simulate search results
      setTimeout(() => {
        setSearchResults(
          mockResults.filter((result) =>
            result.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        );
      }, 300);
    } else {
      setShowSuggestions(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchFocus = () => {
    setSearchFocus(true);
    setShowSuggestions(searchQuery.length > 0);
  };

  const handleSearchBlur = () => {
    setSearchFocus(false);
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const toggleFilter = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const renderLoadingAnimation = () => {
    const animatedDots = useRef(
      [...Array(4)].map(() => new Animated.Value(0.3)),
    ).current;

    useEffect(() => {
      const animations = animatedDots.map((dot, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 600,
              delay: index * 200,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ),
      );

      Animated.stagger(200, animations).start();

      return () => {
        animations.forEach((anim) => anim.stop());
      };
    }, []);

    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[
            theme.colors.therapeutic.calming[500],
            theme.colors.therapeutic.nurturing[400],
          ]}
          style={styles.loadingGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.loadingContent}>
            <View style={styles.loadingDots}>
              {animatedDots.map((dot, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.loadingDot,
                    {
                      backgroundColor: theme.colors.text.inverse,
                      opacity: dot,
                      transform: [{ scale: dot }],
                    },
                  ]}
                />
              ))}
            </View>
            <Text
              style={[styles.loadingText, { color: theme.colors.text.inverse }]}
            >
              Searching...
            </Text>
            <Text
              style={[
                styles.loadingSubtext,
                { color: "rgba(255,255,255,0.8)" },
              ]}
            >
              Finding the best matches for you
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderNotFound = () => (
    <View style={styles.notFoundContainer}>
      <LinearGradient
        colors={["rgba(139, 92, 246, 0.1)", "rgba(99, 102, 241, 0.05)"]}
        style={styles.notFoundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.notFoundIllustration,
            { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
          ]}
        >
          <View style={styles.notFoundIconContainer}>
            <MentalHealthIcon
              name="Brain"
              size={80}
              color={theme.colors.therapeutic.calming[400]}
              variant="outline"
            />
            <View style={styles.notFoundOverlay}>
              <MentalHealthIcon
                name="Heart"
                size={24}
                color={theme.colors.therapeutic.nurturing[400]}
                variant="filled"
              />
            </View>
          </View>
          <View style={styles.notFoundEmojis}>
            <Text style={[styles.notFoundEmoji, { opacity: 0.6 }]}>🔍</Text>
            <Text style={[styles.notFoundEmoji, { opacity: 0.4 }]}>💭</Text>
            <Text style={[styles.notFoundEmoji, { opacity: 0.7 }]}>❓</Text>
          </View>
        </Animated.View>

        <Text
          style={[styles.notFoundTitle, { color: theme.colors.text.primary }]}
        >
          No Results Found
        </Text>
        <Text
          style={[styles.notFoundText, { color: theme.colors.text.secondary }]}
        >
          We couldn't find what you're looking for. Try adjusting your search
          terms or explore our suggested categories below.
        </Text>

        <View style={styles.searchSuggestions}>
          {["Meditation", "Stress Relief", "Sleep", "Anxiety"].map(
            (suggestion, index) => (
              <TouchableOpacity
                key={suggestion}
                style={[
                  styles.suggestionChip,
                  { backgroundColor: theme.colors.therapeutic.calming[100] },
                ]}
                onPress={() => setSearchQuery(suggestion)}
              >
                <Text
                  style={[
                    styles.suggestionChipText,
                    { color: theme.colors.therapeutic.calming[700] },
                  ]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const renderSearchResult = (item, index) => {
    const itemAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(itemAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.resultItemWrapper,
          {
            opacity: itemAnim,
            transform: [
              {
                translateY: Animated.multiply(
                  itemAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                  1,
                ),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          key={item.id}
          style={[
            styles.resultItem,
            { backgroundColor: theme.colors.background.secondary },
          ]}
          onPress={() => navigation.navigate("SearchResult", { item })}
        >
          <LinearGradient
            colors={[item.color, `${item.color}80`]}
            style={styles.resultIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MentalHealthIcon
              name={item.icon || "Brain"}
              size={20}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </LinearGradient>

          <View style={styles.resultContent}>
            <Text
              style={[styles.resultTitle, { color: theme.colors.text.primary }]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.resultSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              {item.subtitle}
            </Text>
            <View style={styles.resultCategory}>
              <View
                style={[styles.categoryDot, { backgroundColor: item.color }]}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                {item.category.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.resultAction}>
            <NavigationIcon
              name="Home"
              size={16}
              color={theme.colors.text.tertiary}
              variant="outline"
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFilterBottomSheet = () => (
    <View
      style={[
        styles.filterSheet,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <View style={styles.filterHeader}>
        <Text
          style={[styles.filterTitle, { color: theme.colors.text.primary }]}
        >
          Filter Search Result
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <NavigationIcon
            name="Home"
            size={20}
            color={theme.colors.text.primary}
            variant="outline"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <Text
          style={[
            styles.filterSectionTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Search Category
        </Text>
        <View style={styles.filterOptions}>
          {searchCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterOption,
                {
                  backgroundColor: category.selected
                    ? category.color
                    : theme.colors.background.secondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  {
                    color: category.selected
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary,
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text
          style={[
            styles.filterSectionTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Search Date
        </Text>
        <TouchableOpacity
          style={[
            styles.dateSelector,
            { backgroundColor: theme.colors.background.secondary },
          ]}
        >
          <MentalHealthIcon
            name="Brain"
            size={16}
            color={theme.colors.text.secondary}
            variant="outline"
          />
          <Text style={[styles.dateText, { color: theme.colors.text.primary }]}>
            25 January 2052
          </Text>
          <NavigationIcon
            name="Home"
            size={16}
            color={theme.colors.text.secondary}
            variant="outline"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <Text
          style={[
            styles.filterSectionTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Search Limit
        </Text>
        <View style={styles.limitSlider}>
          <Text
            style={[styles.limitText, { color: theme.colors.text.secondary }]}
          >
            20
          </Text>
          <View style={styles.sliderTrack}>
            <View
              style={[styles.sliderProgress, { backgroundColor: "#10B981" }]}
            />
            <View
              style={[styles.sliderHandle, { backgroundColor: "#10B981" }]}
            />
          </View>
          <Text
            style={[styles.limitText, { color: theme.colors.text.secondary }]}
          >
            50
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.filterApplyButton,
          { backgroundColor: theme.colors.therapeutic.calming[600] },
        ]}
      >
        <Text
          style={[styles.filterApplyText, { color: theme.colors.text.inverse }]}
        >
          Filter Search Results (21)
        </Text>
        <MentalHealthIcon
          name="Brain"
          size={16}
          color={theme.colors.text.inverse}
          variant="outline"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
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
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Search
        </Text>

        <TouchableOpacity style={styles.menuButton}>
          <MentalHealthIcon
            name="Brain"
            size={24}
            color={theme.colors.text.primary}
            variant="outline"
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: searchFocus
                ? theme.colors.therapeutic.calming[400]
                : "transparent",
            },
          ]}
        >
          <MentalHealthIcon
            name="Brain"
            size={20}
            color={theme.colors.text.secondary}
            variant="outline"
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder="Search freud ai..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          <TouchableOpacity style={styles.filterButton}>
            <MentalHealthIcon
              name="Brain"
              size={20}
              color={theme.colors.text.secondary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {selectedFilters.length > 0 && (
          <View style={styles.activeFilters}>
            <Text
              style={[
                styles.resultsCount,
                { color: theme.colors.text.primary },
              ]}
            >
              871 Results Found
            </Text>
            <TouchableOpacity style={styles.sortButton}>
              <Text
                style={[
                  styles.sortText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Newest
              </Text>
              <NavigationIcon
                name="Home"
                size={12}
                color={theme.colors.text.secondary}
                variant="outline"
                style={{ transform: [{ rotate: "90deg" }] }}
              />
            </TouchableOpacity>
          </View>
        )}

        {selectedFilters.length > 0 && (
          <View style={styles.filterTags}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterTag,
                  {
                    backgroundColor: selectedFilters.includes(filter.id)
                      ? filter.color
                      : theme.colors.background.secondary,
                  },
                ]}
                onPress={() => toggleFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.filterTagText,
                    {
                      color: selectedFilters.includes(filter.id)
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Loading State */}
        {searchQuery.length > 0 &&
          searchResults.length === 0 &&
          !showSuggestions &&
          renderLoadingAnimation()}

        {/* Suggestions */}
        {showSuggestions && searchQuery.length > 0 && (
          <ScrollView style={styles.suggestionsContainer}>
            {suggestions
              .filter((s) =>
                s.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.suggestionItem,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text
                    style={[
                      styles.suggestionText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        )}

        {/* Search Results */}
        {searchQuery.length > 0 &&
          searchResults.length > 0 &&
          !showSuggestions && (
            <ScrollView
              style={styles.resultsContainer}
              showsVerticalScrollIndicator={false}
            >
              {searchResults.map((item, index) =>
                renderSearchResult(item, index),
              )}
            </ScrollView>
          )}

        {/* Not Found */}
        {searchQuery.length > 0 &&
          searchResults.length === 0 &&
          !showSuggestions &&
          renderNotFound()}

        {/* Empty State */}
        {searchQuery.length === 0 && (
          <ScrollView
            style={styles.emptyState}
            showsVerticalScrollIndicator={false}
          >
            <LinearGradient
              colors={[
                "rgba(16, 185, 129, 0.1)",
                "rgba(139, 92, 246, 0.05)",
                "rgba(245, 158, 11, 0.05)",
              ]}
              style={styles.emptyStateGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View
                style={[
                  styles.emptyStateContent,
                  { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
              >
                <View style={styles.emptyStateIcons}>
                  <MentalHealthIcon
                    name="Brain"
                    size={48}
                    color={theme.colors.therapeutic.calming[400]}
                    variant="outline"
                  />
                  <MentalHealthIcon
                    name="Heart"
                    size={36}
                    color={theme.colors.therapeutic.nurturing[400]}
                    variant="filled"
                  />
                  <MentalHealthIcon
                    name="Mindfulness"
                    size={42}
                    color={theme.colors.therapeutic.peaceful[400]}
                    variant="outline"
                  />
                </View>

                <Text
                  style={[
                    styles.emptyStateTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Discover Mental Health Resources
                </Text>
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Search for meditation techniques, stress management tools,
                  sleep guides, and personalized support
                </Text>

                {/* Popular Searches */}
                <View style={styles.popularSearches}>
                  <Text
                    style={[
                      styles.popularTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Popular Searches
                  </Text>
                  <View style={styles.popularGrid}>
                    {[
                      {
                        term: "Meditation",
                        icon: "Mindfulness",
                        color: theme.colors.therapeutic.calming[500],
                      },
                      {
                        term: "Sleep Help",
                        icon: "Brain",
                        color: theme.colors.therapeutic.peaceful[500],
                      },
                      {
                        term: "Anxiety",
                        icon: "Heart",
                        color: theme.colors.therapeutic.nurturing[500],
                      },
                      {
                        term: "Stress Relief",
                        icon: "Therapy",
                        color: theme.colors.therapeutic.grounding[500],
                      },
                    ].map((item, index) => (
                      <TouchableOpacity
                        key={item.term}
                        style={[
                          styles.popularItem,
                          {
                            backgroundColor: theme.colors.background.secondary,
                          },
                        ]}
                        onPress={() => setSearchQuery(item.term.toLowerCase())}
                      >
                        <LinearGradient
                          colors={[item.color, `${item.color}80`]}
                          style={styles.popularIcon}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <MentalHealthIcon
                            name={item.icon}
                            size={20}
                            color={theme.colors.text.inverse}
                            variant="filled"
                          />
                        </LinearGradient>
                        <Text
                          style={[
                            styles.popularText,
                            { color: theme.colors.text.primary },
                          ]}
                        >
                          {item.term}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Animated.View>
            </LinearGradient>
          </ScrollView>
        )}
      </Animated.View>

      {/* Filter Bottom Sheet */}
      {searchQuery === "mood st" && renderFilterBottomSheet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterButton: {
    padding: 4,
  },
  activeFilters: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 14,
  },
  filterTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingGradient: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    minWidth: "100%",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingDots: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  suggestionsContainer: {
    flex: 1,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultItemWrapper: {
    marginBottom: 8,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resultIconText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 20,
  },
  resultSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
  },
  resultCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  resultAction: {
    padding: 8,
  },
  notFoundContainer: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  notFoundGradient: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  notFoundIllustration: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  notFoundIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundOverlay: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 4,
  },
  notFoundEmojis: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  notFoundEmoji: {
    fontSize: 28,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
  },
  emptyStateGradient: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 0,
    padding: 20,
  },
  emptyStateContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  emptyStateIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  popularSearches: {
    width: "100%",
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  popularItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  popularIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  popularText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
  limitSlider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  limitText: {
    fontSize: 14,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#374151",
    borderRadius: 3,
    position: "relative",
  },
  sliderProgress: {
    height: "100%",
    width: "70%",
    borderRadius: 3,
  },
  sliderHandle: {
    position: "absolute",
    right: "30%",
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  searchSuggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
    justifyContent: "center",
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.2)",
  },
  suggestionChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  filterApplyButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  filterApplyText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DarkSearchScreen;
