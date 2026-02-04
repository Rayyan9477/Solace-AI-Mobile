/**
 * NewPostCategorySelectorScreen Component
 * @description 3x3 category grid for selecting post category before composing
 * @task Task 3.14.3: New Post Category Selector Screen (Screen 121)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface NewPostCategorySelectorScreenProps {
  categories: CategoryItem[];
  selectedCategoryId: string | null;
  onBack: () => void;
  onCategorySelect: (id: string) => void;
  onContinue: () => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  cardBg: palette.background.secondary,
  cardSelected: palette.accent.green,
  textSecondary: palette.text.secondary,
  badgeBg: palette.background.tertiary,
  ctaButtonBg: palette.primary.gold,
  ctaButtonText: palette.background.primary,
} as const;

export function NewPostCategorySelectorScreen({
  categories,
  selectedCategoryId,
  onBack,
  onCategorySelect,
  onContinue,
}: NewPostCategorySelectorScreenProps): React.ReactElement {
  return (
    <View testID="new-post-category-screen" style={styles.container}>
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Community Post</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Add New Post</Text>
      <Text style={styles.subtitle}>Select post category</Text>

      {/* Category Grid */}
      <View style={styles.grid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            testID={`category-card-${cat.id}`}
            style={[
              styles.categoryCard,
              selectedCategoryId === cat.id && styles.categoryCardSelected,
            ]}
            onPress={() => onCategorySelect(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={cat.name}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.continueText}>Continue {"\u2192"}</Text>
        </TouchableOpacity>
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
  badge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 12,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: "600" },
  categoryCard: {
    alignItems: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 44,
    padding: 16,
    width: "30%",
  },
  categoryCardSelected: { backgroundColor: colors.cardSelected },
  categoryIcon: { fontSize: 28 },
  categoryName: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  container: { backgroundColor: colors.background, flex: 1 },
  continueButton: {
    alignItems: "center",
    backgroundColor: colors.ctaButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  continueText: {
    color: colors.ctaButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 24,
    paddingHorizontal: 24,
  },
});

export default NewPostCategorySelectorScreen;
