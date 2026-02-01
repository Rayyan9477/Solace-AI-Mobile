/**
 * FilterSearchBottomSheet Component
 * @description Search filter bottom sheet with category pills, date picker,
 *   limit range slider, and apply button with result count
 * @task Task 3.15.5: Filter Search Bottom Sheet (Screen 133)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CategoryOption {
  id: string;
  label: string;
  icon: string;
}

interface FilterSearchBottomSheetProps {
  categories: CategoryOption[];
  selectedCategoryId: string | null;
  selectedDate: string;
  minLimit: number;
  maxLimit: number;
  resultCount: number;
  onCategorySelect: (id: string) => void;
  onDatePress: () => void;
  onLimitChange: (min: number, max: number) => void;
  onApply: () => void;
  onClose: () => void;
}

const colors = {
  background: "#2A1F18",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  pillBg: "#3D2E23",
  pillSelected: "#E8853A",
  dateFieldBg: "#3D2E23",
  sliderTrack: "#3D2E23",
  sliderFill: "#9AAD5C",
  applyButtonBg: "#C4A574",
  applyButtonText: "#1C1410",
} as const;

export function FilterSearchBottomSheet({
  categories,
  selectedCategoryId,
  selectedDate,
  minLimit,
  maxLimit,
  resultCount,
  onCategorySelect,
  onDatePress,
  onApply,
}: FilterSearchBottomSheetProps): React.ReactElement {
  return (
    <View testID="filter-search-bottom-sheet" style={styles.container}>
      {/* Handle */}
      <View style={styles.handle} />

      {/* Title */}
      <Text style={styles.title}>Filter Search Result</Text>

      {/* Search Category */}
      <Text style={styles.sectionLabel}>Search Category</Text>
      <View style={styles.pillsRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            testID={`category-pill-${cat.id}`}
            style={[
              styles.pill,
              selectedCategoryId === cat.id && styles.pillSelected,
            ]}
            onPress={() => onCategorySelect(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={cat.label}
          >
            <Text style={styles.pillText}>
              {cat.icon} {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Date */}
      <Text style={styles.sectionLabel}>Search Date</Text>
      <TouchableOpacity
        testID="date-picker-field"
        style={styles.dateField}
        onPress={onDatePress}
        accessibilityRole="button"
        accessibilityLabel="Select date"
      >
        <Text style={styles.dateIcon}>{"\uD83D\uDCC5"}</Text>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <Text style={styles.chevron}>{"\u25BC"}</Text>
      </TouchableOpacity>

      {/* Search Limit */}
      <Text style={styles.sectionLabel}>Search Limit</Text>
      <View testID="limit-slider" style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View style={styles.sliderFill} />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>{minLimit}</Text>
          <Text style={styles.sliderLabel}>{maxLimit}</Text>
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        testID="apply-filter-button"
        style={styles.applyButton}
        onPress={onApply}
        accessibilityRole="button"
        accessibilityLabel={`Filter search results, ${resultCount} results`}
      >
        <Text style={styles.applyButtonText}>
          Filter Search Results ({resultCount}) {"\u2699\uFE0F"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  applyButton: {
    alignItems: "center",
    backgroundColor: colors.applyButtonBg,
    borderRadius: 24,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 44,
    paddingVertical: 14,
  },
  applyButtonText: {
    color: colors.applyButtonText,
    fontSize: 16,
    fontWeight: "700",
  },
  chevron: { color: colors.textSecondary, fontSize: 12 },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  dateField: {
    alignItems: "center",
    backgroundColor: colors.dateFieldBg,
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 8,
    padding: 14,
  },
  dateIcon: { fontSize: 16, marginRight: 8 },
  dateText: { color: colors.white, flex: 1, fontSize: 14 },
  handle: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    height: 4,
    marginBottom: 16,
    width: 40,
  },
  pill: {
    backgroundColor: colors.pillBg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pillSelected: { backgroundColor: colors.pillSelected },
  pillText: { color: colors.white, fontSize: 13, fontWeight: "600" },
  pillsRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  sectionLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 20,
  },
  sliderContainer: { marginTop: 12 },
  sliderFill: {
    backgroundColor: colors.sliderFill,
    borderRadius: 3,
    height: 6,
    left: "20%",
    position: "absolute",
    right: "50%",
    top: 0,
  },
  sliderLabel: { color: colors.textSecondary, fontSize: 12 },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderTrack: {
    backgroundColor: colors.sliderTrack,
    borderRadius: 3,
    height: 6,
    width: "100%",
  },
  title: { color: colors.white, fontSize: 18, fontWeight: "800" },
});

export default FilterSearchBottomSheet;
