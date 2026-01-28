/**
 * FilterSolaceScoreSheet Component
 * @description Bottom sheet for filtering Solace score history
 * @task Task 3.5.4: Filter Solace Score Sheet (Screen 43)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface FilterSolaceScoreSheetProps {
  isVisible: boolean;
  fromDate: Date;
  toDate: Date;
  scoreRange: [number, number];
  includeAISuggestions: boolean;
  matchingCount: number;
  onClose: () => void;
  onApply: () => void;
  onHelpPress: () => void;
  onFromDatePress: () => void;
  onToDatePress: () => void;
  onScoreRangeChange: (range: [number, number]) => void;
  onToggleAISuggestions: () => void;
}

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function FilterSolaceScoreSheet({
  isVisible,
  fromDate,
  toDate,
  scoreRange,
  includeAISuggestions,
  matchingCount,
  onApply,
  onHelpPress,
  onFromDatePress,
  onToDatePress,
  onToggleAISuggestions,
}: FilterSolaceScoreSheetProps): React.ReactElement | null {
  if (!isVisible) {
    return null;
  }

  return (
    <View testID="filter-solace-score-sheet" style={styles.container}>
      {/* Drag Handle */}
      <View testID="drag-handle" style={styles.dragHandle} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Filter Solace Score</Text>
        <TouchableOpacity
          testID="help-button"
          style={styles.helpButton}
          onPress={onHelpPress}
          accessibilityRole="button"
          accessibilityLabel="Get help"
        >
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Date Range Section */}
      <View style={styles.section}>
        {/* From Date */}
        <View style={styles.dateRow}>
          <Text style={styles.label}>From</Text>
          <TouchableOpacity
            testID="from-date-picker"
            style={styles.datePicker}
            onPress={onFromDatePress}
            accessibilityRole="button"
            accessibilityLabel="Select from date"
          >
            <Text testID="from-date-calendar-icon" style={styles.calendarIcon}>
              📅
            </Text>
            <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
          </TouchableOpacity>
        </View>

        {/* To Date */}
        <View style={styles.dateRow}>
          <Text style={styles.label}>To</Text>
          <TouchableOpacity
            testID="to-date-picker"
            style={styles.datePicker}
            onPress={onToDatePress}
            accessibilityRole="button"
            accessibilityLabel="Select to date"
          >
            <Text testID="to-date-calendar-icon" style={styles.calendarIcon}>
              📅
            </Text>
            <Text style={styles.dateText}>{formatDate(toDate)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Score Range Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Score Range</Text>
        <View testID="score-range-slider" style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderActiveTrack} />
            <View style={styles.sliderThumbLeft} />
            <View style={styles.sliderThumbRight} />
          </View>
          <View style={styles.sliderLabels}>
            <Text testID="min-score-label" style={styles.sliderLabel}>
              {scoreRange[0]}
            </Text>
            <Text testID="max-score-label" style={styles.sliderLabel}>
              {scoreRange[1]}
            </Text>
          </View>
        </View>
      </View>

      {/* AI Suggestions Toggle */}
      <View style={styles.section}>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>Include AI Suggestions</Text>
          <TouchableOpacity
            testID="ai-suggestions-toggle"
            style={[
              styles.toggle,
              includeAISuggestions ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={onToggleAISuggestions}
            accessibilityRole="switch"
            accessibilityLabel="Toggle AI suggestions"
            accessibilityState={{ checked: includeAISuggestions }}
          >
            <View
              style={[
                styles.toggleThumb,
                includeAISuggestions
                  ? styles.toggleThumbOn
                  : styles.toggleThumbOff,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        testID="apply-button"
        style={styles.applyButton}
        onPress={onApply}
        accessibilityRole="button"
        accessibilityLabel={`Filter Solace Score with ${matchingCount} results`}
      >
        <Text style={styles.applyButtonText}>
          Filter Solace Score ({matchingCount})
        </Text>
        <Text style={styles.filterIcon}>🔍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  applyButton: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 24,
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  applyButtonText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  calendarIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  container: {
    backgroundColor: "#1C1410",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  datePicker: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateRow: {
    marginBottom: 16,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  dragHandle: {
    alignSelf: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 2,
    height: 4,
    marginBottom: 16,
    width: 40,
  },
  filterIcon: {
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  helpButton: {
    alignItems: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 32,
  },
  helpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 8,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sliderActiveTrack: {
    backgroundColor: "#9AAD5C",
    height: 8,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderLabel: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  sliderThumbLeft: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 16,
    left: 0,
    position: "absolute",
    top: -4,
    width: 16,
  },
  sliderThumbRight: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 16,
    position: "absolute",
    right: 0,
    top: -4,
    width: 16,
  },
  sliderTrack: {
    backgroundColor: "#3D2E23",
    borderRadius: 4,
    height: 8,
    position: "relative",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  toggle: {
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    padding: 2,
    width: 52,
  },
  toggleOff: {
    backgroundColor: "#3D2E23",
  },
  toggleOn: {
    backgroundColor: "#9AAD5C",
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleThumb: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  toggleThumbOff: {
    transform: [{ translateX: 0 }],
  },
  toggleThumbOn: {
    transform: [{ translateX: 20 }],
  },
});

export default FilterSolaceScoreSheet;
