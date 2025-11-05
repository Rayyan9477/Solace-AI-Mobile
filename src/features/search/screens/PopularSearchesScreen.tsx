/**
 * Popular Searches Screen - Trending and Suggested Searches
 * Based on ui-designs/Dark-mode/🔒 Search Screen.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface SearchTerm {
  id: string;
  term: string;
  count: number;
  trending?: boolean;
  category: string;
}

export const PopularSearchesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const popularSearches: SearchTerm[] = [
    {
      id: "1",
      term: "anxiety coping strategies",
      count: 2840,
      trending: true,
      category: "Mental Health",
    },
    {
      id: "2",
      term: "sleep meditation",
      count: 2156,
      trending: true,
      category: "Mindfulness",
    },
    {
      id: "3",
      term: "stress management techniques",
      count: 1923,
      category: "Wellness",
    },
    {
      id: "4",
      term: "mindfulness exercises",
      count: 1687,
      trending: true,
      category: "Mindfulness",
    },
    {
      id: "5",
      term: "depression support",
      count: 1542,
      category: "Mental Health",
    },
    {
      id: "6",
      term: "breathing techniques",
      count: 1398,
      category: "Wellness",
    },
    {
      id: "7",
      term: "self-care tips",
      count: 1276,
      category: "Wellness",
    },
    {
      id: "8",
      term: "meditation for beginners",
      count: 1154,
      category: "Mindfulness",
    },
    {
      id: "9",
      term: "panic attack help",
      count: 1089,
      category: "Mental Health",
    },
    {
      id: "10",
      term: "cognitive behavioral therapy",
      count: 987,
      category: "Therapy",
    },
  ];

  const handleSearch = (term: string) => {
    navigation.navigate("Search", { query: term });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
    },
    heroCard: {
      backgroundColor: theme.colors.purple["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
    },
    heroIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    heroTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    heroDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    sectionSubtitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
    },
    searchCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    searchCardLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    rankBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.purple["60"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    rankText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    searchInfo: {
      flex: 1,
    },
    searchTerm: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    searchMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: theme.colors.purple["20"],
    },
    categoryText: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.colors.purple["60"],
      textTransform: "uppercase",
    },
    countText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    searchCardRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    trendingBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.orange["20"],
    },
    trendingText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.orange["60"],
    },
    arrowIcon: {
      fontSize: 18,
      color: theme.colors.text.tertiary,
    },
  });

  const trendingSearches = popularSearches.filter((s) => s.trending);
  const allSearches = popularSearches;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Popular Searches</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🔥</Text>
          <Text style={styles.heroTitle}>Trending Now</Text>
          <Text style={styles.heroDescription}>
            See what others in the community are searching for
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Searches</Text>
            <Text style={styles.sectionSubtitle}>Last 24 hours</Text>
          </View>

          {trendingSearches.map((search, index) => (
            <TouchableOpacity
              key={search.id}
              style={styles.searchCard}
              onPress={() => handleSearch(search.term)}
              accessible
              accessibilityLabel={`Search for ${search.term}`}
              accessibilityRole="button"
            >
              <View style={styles.searchCardLeft}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.searchInfo}>
                  <Text style={styles.searchTerm}>{search.term}</Text>
                  <View style={styles.searchMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{search.category}</Text>
                    </View>
                    <Text style={styles.countText}>
                      {search.count.toLocaleString()} searches
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.searchCardRight}>
                <View style={styles.trendingBadge}>
                  <Text style={styles.trendingText}>TRENDING</Text>
                </View>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Popular Searches</Text>
            <Text style={styles.sectionSubtitle}>This month</Text>
          </View>

          {allSearches.map((search, index) => (
            <TouchableOpacity
              key={search.id}
              style={styles.searchCard}
              onPress={() => handleSearch(search.term)}
              accessible
              accessibilityLabel={`Search for ${search.term}`}
              accessibilityRole="button"
            >
              <View style={styles.searchCardLeft}>
                <View
                  style={[
                    styles.rankBadge,
                    { backgroundColor: theme.colors.brown["40"] },
                  ]}
                >
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.searchInfo}>
                  <Text style={styles.searchTerm}>{search.term}</Text>
                  <View style={styles.searchMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{search.category}</Text>
                    </View>
                    <Text style={styles.countText}>
                      {search.count.toLocaleString()} searches
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.searchCardRight}>
                {search.trending && (
                  <View style={styles.trendingBadge}>
                    <Text style={styles.trendingText}>TRENDING</Text>
                  </View>
                )}
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PopularSearchesScreen;
