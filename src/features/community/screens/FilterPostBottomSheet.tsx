/**
 * FilterPostBottomSheet Component
 * @description Bottom sheet filter with post type pills, date picker, duration
 *   range slider, and apply button with result count preview
 * @task Task 3.14.7: Filter Post Bottom Sheet (Screen 125)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PostTypeOption {
  id: string;
  label: string;
  icon: string;
}

interface FilterPostBottomSheetProps {
  postTypes: PostTypeOption[];
  selectedPostTypeId: string | null;
  selectedDate: string;
  minDuration: number;
  maxDuration: number;
  resultCount: number;
  onPostTypeSelect: (id: string) => void;
  onDatePress: () => void;
  onDurationChange: (min: number, max: number) => void;
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

export function FilterPostBottomSheet({
  postTypes,
  selectedPostTypeId,
  selectedDate,
  minDuration,
  maxDuration,
  resultCount,
  onPostTypeSelect,
  onDatePress,
  onApply,
}: FilterPostBottomSheetProps): React.ReactElement {
  return (
    <View testID="filter-post-bottom-sheet" style={styles.container}>
      <Text style={styles.title}>Filter Post</Text>

      {/* Post Type */}
      <Text style={styles.sectionLabel}>Post Type</Text>
      <View style={styles.pillsRow}>
        {postTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            testID={`type-pill-${type.id}`}
            style={[
              styles.pill,
              selectedPostTypeId === type.id && styles.pillSelected,
            ]}
            onPress={() => onPostTypeSelect(type.id)}
            accessibilityRole="button"
            accessibilityLabel={type.label}
          >
            <Text style={styles.pillText}>
              {type.icon} {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Post Date */}
      <Text style={styles.sectionLabel}>Post Date</Text>
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

      {/* Video Duration */}
      <Text style={styles.sectionLabel}>Video Duration</Text>
      <View testID="duration-slider" style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View style={styles.sliderFill} />
        </View>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>{minDuration}m</Text>
          <Text style={styles.sliderLabel}>{maxDuration}m</Text>
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        testID="apply-filter-button"
        style={styles.applyButton}
        onPress={onApply}
        accessibilityRole="button"
        accessibilityLabel={`Filter posts, ${resultCount} results`}
      >
        <Text style={styles.applyButtonText}>
          Filter Posts ({resultCount}) {"\u2699\uFE0F"}
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
    left: "30%",
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

export default FilterPostBottomSheet;
