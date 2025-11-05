/**
 * Search Categories Screen - Filtered Search by Content Type
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

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export const SearchCategoriesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const categories: Category[] = [
    {
      id: "articles",
      name: "Articles",
      icon: "📰",
      count: 245,
      description: "Mental health articles and guides",
    },
    {
      id: "courses",
      name: "Courses",
      icon: "📚",
      count: 48,
      description: "Mindfulness and wellness courses",
    },
    {
      id: "exercises",
      name: "Exercises",
      icon: "🧘",
      count: 156,
      description: "Breathing and meditation exercises",
    },
    {
      id: "community",
      name: "Community",
      icon: "👥",
      count: 892,
      description: "Support groups and discussions",
    },
    {
      id: "journal",
      name: "Journal",
      icon: "📝",
      count: 342,
      description: "Your journal entries",
    },
    {
      id: "mood",
      name: "Mood Data",
      icon: "😊",
      count: 678,
      description: "Mood tracking history",
    },
    {
      id: "resources",
      name: "Resources",
      icon: "📖",
      count: 189,
      description: "Educational resources",
    },
    {
      id: "therapists",
      name: "Therapists",
      icon: "👨‍⚕️",
      count: 67,
      description: "Find mental health professionals",
    },
  ];

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
    categoriesGrid: {
      gap: 12,
    },
    categoryCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    categoryIcon: {
      fontSize: 40,
      marginRight: 16,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    categoryDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    categoryCount: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.purple["60"],
    },
    categoryArrow: {
      fontSize: 20,
      color: theme.colors.text.tertiary,
    },
  });

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
        <Text style={styles.headerTitle}>Search Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🔍</Text>
          <Text style={styles.heroTitle}>Browse by Category</Text>
          <Text style={styles.heroDescription}>
            Find what you're looking for faster by searching within specific
            categories
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate("Search", { category: category.id })
                }
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {category.count} items
                  </Text>
                </View>
                <Text style={styles.categoryArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchCategoriesScreen;
