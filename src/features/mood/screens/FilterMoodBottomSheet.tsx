/**
 * FilterMoodBottomSheet Component
 * @description Bottom sheet modal for filtering mood history by type, date, swing, and improvement
 * @task Task 3.8.5: Filter Mood Bottom Sheet (Screen 75)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface MoodType {
  id: string;
  label: string;
  selected: boolean;
}

interface FilterMoodBottomSheetProps {
  visible: boolean;
  moodTypes: MoodType[];
  selectedDate: string;
  moodSwingValue: number;
  showImprovement: boolean;
  resultCount: number;
  onClose: () => void;
  onMoodTypeToggle: (id: string) => void;
  onDateChange: () => void;
  onSwingChange: (value: number) => void;
  onImprovementToggle: () => void;
  onApplyFilter: () => void;
  onHelp: () => void;
}

export function FilterMoodBottomSheet({
  visible,
  moodTypes,
  selectedDate,
  moodSwingValue,
  showImprovement,
  resultCount,
  onClose,
  onMoodTypeToggle,
  onDateChange,
  onImprovementToggle,
  onApplyFilter,
  onHelp,
}: FilterMoodBottomSheetProps): React.ReactElement | null {
  if (!visible) return null;

  return (
    <View testID="filter-mood-bottom-sheet" style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity
        testID="backdrop"
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
        accessibilityLabel="Close filter"
      />

      {/* Sheet Content */}
      <View testID="sheet-content" style={styles.sheetContent}>
        {/* Drag Handle */}
        <View testID="drag-handle" style={styles.dragHandle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Filter Mood</Text>
          <TouchableOpacity
            testID="help-button"
            style={styles.helpButton}
            onPress={onHelp}
            accessibilityRole="button"
            accessibilityLabel="Help with filters"
          >
            <Text style={styles.helpIcon}>?</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Type Chips */}
        <View testID="mood-type-chips" style={styles.chipsContainer}>
          <Text style={styles.sectionLabel}>Mood Type</Text>
          <View style={styles.chipRow}>
            {moodTypes.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                testID={`mood-chip-${mood.id}`}
                style={[
                  styles.chip,
                  mood.selected && styles.chipSelected,
                ]}
                onPress={() => onMoodTypeToggle(mood.id)}
                accessibilityRole="button"
                accessibilityLabel={`${mood.selected ? "Deselect" : "Select"} ${mood.label}`}
              >
                <Text
                  style={[
                    styles.chipText,
                    mood.selected && styles.chipTextSelected,
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Picker Row */}
        <TouchableOpacity
          testID="date-picker-row"
          style={styles.datePickerRow}
          onPress={onDateChange}
          accessibilityRole="button"
          accessibilityLabel="Change date"
        >
          <Text style={styles.sectionLabel}>Date</Text>
          <Text style={styles.dateValue}>{selectedDate}</Text>
        </TouchableOpacity>

        {/* Mood Swing Section */}
        <View testID="mood-swing-section" style={styles.swingSection}>
          <Text style={styles.sectionLabel}>Mood Swing</Text>
          <View style={styles.swingSliderContainer}>
            <Text style={styles.scaleLabel}>1</Text>
            <View style={styles.sliderTrack}>
              <View
                testID="swing-value"
                style={[
                  styles.sliderFill,
                  { width: `${(moodSwingValue / 10) * 100}%` },
                ]}
              />
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${(moodSwingValue / 10) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.scaleLabel}>10</Text>
          </View>
          <Text style={styles.scaleMiddle}>5</Text>
        </View>

        {/* Show Improvement Toggle */}
        <TouchableOpacity
          testID="improvement-toggle"
          style={styles.toggleRow}
          onPress={onImprovementToggle}
          accessibilityRole="switch"
          accessibilityLabel="Toggle show improvement"
        >
          <Text style={styles.toggleLabel}>Show Improvement</Text>
          <View
            style={[
              styles.toggleSwitch,
              showImprovement && styles.toggleSwitchOn,
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                showImprovement && styles.toggleKnobOn,
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Apply Filter Button */}
        <TouchableOpacity
          testID="apply-filter-button"
          style={styles.applyButton}
          onPress={onApplyFilter}
          accessibilityRole="button"
          accessibilityLabel="Apply mood filter"
        >
          <Text style={styles.applyButtonText}>
            Filter Mood ({resultCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  applyButton: {
    alignItems: "center",
    backgroundColor: "#E8853A",
    borderRadius: 12,
    marginTop: 24,
    minHeight: 44,
    paddingVertical: 14,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
  },
  chip: {
    backgroundColor: "#2A1F19",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
    marginRight: 8,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chipSelected: {
    backgroundColor: "#E8853A",
    borderColor: "#E8853A",
  },
  chipText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chipsContainer: {
    marginTop: 20,
  },
  datePickerRow: {
    alignItems: "center",
    borderBottomColor: "#3D2E23",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    minHeight: 44,
    paddingBottom: 16,
  },
  dateValue: {
    color: "#C4A574",
    fontSize: 14,
  },
  dragHandle: {
    alignSelf: "center",
    backgroundColor: "#3D2E23",
    borderRadius: 3,
    height: 4,
    marginBottom: 16,
    width: 40,
  },
  helpButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 24,
  },
  helpIcon: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  scaleLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  scaleMiddle: {
    alignSelf: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
  sectionLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  sheetContent: {
    backgroundColor: "#1C1410",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  sliderFill: {
    backgroundColor: "#E8853A",
    borderRadius: 3,
    height: 6,
    left: 0,
    position: "absolute",
    top: 0,
  },
  sliderThumb: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 16,
    position: "absolute",
    top: -5,
    width: 16,
  },
  sliderTrack: {
    backgroundColor: "#3D2E23",
    borderRadius: 3,
    flex: 1,
    height: 6,
    marginHorizontal: 12,
    position: "relative",
  },
  swingSection: {
    marginTop: 20,
  },
  swingSliderContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 12,
  },
  toggleKnob: {
    backgroundColor: "#94A3B8",
    borderRadius: 10,
    height: 20,
    left: 2,
    position: "absolute",
    top: 2,
    width: 20,
  },
  toggleKnobOn: {
    backgroundColor: "#FFFFFF",
    left: 22,
  },
  toggleLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  toggleRow: {
    alignItems: "center",
    borderTopColor: "#3D2E23",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    minHeight: 44,
    paddingTop: 16,
  },
  toggleSwitch: {
    backgroundColor: "#3D2E23",
    borderRadius: 12,
    height: 24,
    position: "relative",
    width: 44,
  },
  toggleSwitchOn: {
    backgroundColor: "#9AAD5C",
  },
});

export default FilterMoodBottomSheet;
