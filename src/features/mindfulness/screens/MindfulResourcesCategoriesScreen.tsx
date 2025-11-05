/**
 * Mindful Resources Categories Screen - Organized Mindfulness Topics
 * Based on ui-designs/Dark-mode/🔒 Mindful Resources.png
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

interface ResourceCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  description: string;
  color: string;
}

export const MindfulResourcesCategoriesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const categories: ResourceCategory[] = [
    {
      id: "meditation",
      name: "Meditation",
      icon: "🧘",
      count: 48,
      description: "Guided meditation practices",
      color: theme.colors.purple["60"],
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      icon: "🌸",
      count: 62,
      description: "Present moment awareness techniques",
      color: theme.colors.pink["60"],
    },
    {
      id: "breathing",
      name: "Breathing",
      icon: "🫁",
      count: 35,
      description: "Breathwork and pranayama",
      color: theme.colors.blue["60"],
    },
    {
      id: "body-scan",
      name: "Body Scan",
      icon: "💆",
      count: 28,
      description: "Progressive relaxation exercises",
      color: theme.colors.green["60"],
    },
    {
      id: "visualization",
      name: "Visualization",
      icon: "🌄",
      count: 42,
      description: "Guided imagery and visualization",
      color: theme.colors.orange["60"],
    },
    {
      id: "sleep",
      name: "Sleep",
      icon: "😴",
      count: 56,
      description: "Sleep meditation and bedtime stories",
      color: theme.colors.indigo["60"],
    },
    {
      id: "stress-relief",
      name: "Stress Relief",
      icon: "🌊",
      count: 45,
      description: "Techniques for managing stress",
      color: theme.colors.teal["60"],
    },
    {
      id: "gratitude",
      name: "Gratitude",
      icon: "🙏",
      count: 31,
      description: "Appreciation and thankfulness practices",
      color: theme.colors.yellow["60"],
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
      backgroundColor: theme.colors.purple["60"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },
    heroIcon: {
      fontSize: 64,
      marginBottom: 12,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 8,
      textAlign: "center",
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: "#FFFFFF",
      opacity: 0.9,
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
      fontSize: 48,
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
        <Text style={styles.headerTitle}>Resource Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>📚</Text>
          <Text style={styles.heroTitle}>Explore Mindfulness</Text>
          <Text style={styles.heroSubtitle}>
            Discover guided practices organized by topics to support your
            wellness journey
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate("MindfulResources", {
                    category: category.id,
                  })
                }
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                  <Text
                    style={[styles.categoryCount, { color: category.color }]}
                  >
                    {category.count} resources
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

export default MindfulResourcesCategoriesScreen;
