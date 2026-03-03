/**
 * FilterSleepBottomSheet Component
 * @description Bottom sheet filter for sleep history with date pickers,
 *   duration slider, sleep type selector, AI toggle, and apply button
 * @task Task 3.10.8: Filter Sleep Bottom Sheet (Screen 96)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface SleepType {
  id: string;
  icon: string;
  label: string;
}

interface FilterSleepBottomSheetProps {
  fromDate: string;
  toDate: string;
  minDuration: number;
  maxDuration: number;
  sleepTypes: SleepType[];
  selectedTypes: string[];
  includeAISuggestion: boolean;
  resultCount: number;
  onFromDatePress: () => void;
  onToDatePress: () => void;
  onTypeToggle: (id: string) => void;
  onAISuggestionToggle: () => void;
  onApplyFilter: () => void;
  onHelpPress: () => void;
}

const localColors = {
  background: palette.brown[900],
  cardBg: palette.brown[800],
  white: palette.white,
  textSecondary: "rgba(255,255,255,0.6)",
  selectedType: palette.accent.orange,
  unselectedType: palette.brown[700],
  toggleOff: palette.brown[700],
  toggleOn: palette.olive[500],
  applyButtonBg: "#5C4A2A",
  handleBg: palette.opacity.white30,
  sliderTrack: palette.brown[700],
  sliderFill: palette.olive[500],
  dateBorder: "rgba(255,255,255,0.15)",
  helpBorder: palette.opacity.white30,
} as const;

export function FilterSleepBottomSheet({
  fromDate,
  toDate,
  minDuration,
  maxDuration,
  sleepTypes,
  selectedTypes,
  includeAISuggestion,
  resultCount,
  onFromDatePress,
  onToDatePress,
  onTypeToggle,
  onAISuggestionToggle,
  onApplyFilter,
  onHelpPress,
}: FilterSleepBottomSheetProps): React.ReactElement {
  return (
    <View testID="filter-sleep-bottom-sheet" style={styles.container}>
      {/* Drag Handle */}
      <View style={styles.handleContainer}>
        <View testID="drag-handle" style={styles.dragHandle} />
      </View>

      {/* Title Row */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Filter Sleep</Text>
        <TouchableOpacity
          testID="help-button"
          style={styles.helpButton}
          onPress={onHelpPress}
          accessibilityRole="button"
          accessibilityLabel="Help with filter"
        >
          <Text style={styles.helpIcon}>?</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <View style={styles.dateRow}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>From</Text>
          <TouchableOpacity
            testID="from-date-picker"
            style={styles.datePicker}
            onPress={onFromDatePress}
            accessibilityRole="button"
            accessibilityLabel="Select from date"
          >
            <Text style={styles.dateIcon}>{"\uD83D\uDCC5"}</Text>
            <Text style={styles.dateText}>{fromDate}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>To</Text>
          <TouchableOpacity
            testID="to-date-picker"
            style={styles.datePicker}
            onPress={onToDatePress}
            accessibilityRole="button"
            accessibilityLabel="Select to date"
          >
            <Text style={styles.dateIcon}>{"\uD83D\uDCC5"}</Text>
            <Text style={styles.dateText}>{toDate}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sleep Duration */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Sleep Duration</Text>
        <View testID="duration-slider" style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderFill} />
            <View style={[styles.sliderThumb, styles.sliderThumbMin]} />
            <View style={[styles.sliderThumb, styles.sliderThumbMax]} />
          </View>
        </View>
        <View style={styles.durationLabelsRow}>
          <Text style={styles.durationLabel}>{minDuration}h</Text>
          <Text style={styles.durationLabel}>{maxDuration}h</Text>
        </View>
      </View>

      {/* Sleep Type */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Sleep Type</Text>
        <View style={styles.typeRow}>
          {sleepTypes.map((type) => {
            const isSelected = selectedTypes.includes(type.id);
            return (
              <TouchableOpacity
                key={type.id}
                testID={`sleep-type-${type.id}`}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: isSelected
                      ? localColors.selectedType
                      : localColors.unselectedType,
                  },
                ]}
                onPress={() => onTypeToggle(type.id)}
                accessibilityRole="button"
                accessibilityLabel={`Toggle ${type.label} sleep type`}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* AI Suggestion Toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Include AI Suggestion</Text>
        <TouchableOpacity
          testID="ai-suggestion-toggle"
          style={styles.toggleTouchable}
          onPress={onAISuggestionToggle}
          accessibilityRole="switch"
          accessibilityLabel="Include AI suggestion"
          accessibilityState={{ checked: includeAISuggestion }}
        >
          <View
            testID="ai-suggestion-track"
            style={[
              styles.toggleTrack,
              {
                backgroundColor: includeAISuggestion
                  ? localColors.toggleOn
                  : localColors.toggleOff,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                includeAISuggestion
                  ? styles.toggleThumbOn
                  : styles.toggleThumbOff,
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        testID="apply-filter-button"
        style={styles.applyButton}
        onPress={onApplyFilter}
        accessibilityRole="button"
        accessibilityLabel="Apply sleep filter"
      >
        <Text style={styles.applyButtonText}>
          Filter Sleep ({resultCount}) {"\u2630"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  applyButton: {
    alignItems: "center",
    backgroundColor: localColors.applyButtonBg,
    borderRadius: 28,
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 24,
    minHeight: 44,
    paddingVertical: 16,
  },
  applyButtonText: {
    color: localColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  container: {
    backgroundColor: localColors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 48,
  },
  dateColumn: {
    flex: 1,
  },
  dateIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  dateLabel: {
    color: localColors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  datePicker: {
    alignItems: "center",
    borderColor: localColors.dateBorder,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  dateText: {
    color: localColors.white,
    fontSize: 13,
    fontWeight: "500",
  },
  dragHandle: {
    backgroundColor: localColors.handleBg,
    borderRadius: 3,
    height: 4,
    width: 40,
  },
  durationLabel: {
    color: localColors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  durationLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
  },
  helpButton: {
    alignItems: "center",
    borderColor: localColors.helpBorder,
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  helpIcon: {
    color: localColors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionLabel: {
    color: localColors.white,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  sliderContainer: {
    paddingVertical: 8,
  },
  sliderFill: {
    backgroundColor: localColors.sliderFill,
    borderRadius: 3,
    height: 6,
    left: "10%",
    position: "absolute",
    top: 0,
    width: "30%",
  },
  sliderThumb: {
    backgroundColor: localColors.sliderFill,
    borderColor: localColors.white,
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    marginTop: -7,
    position: "absolute",
    width: 20,
  },
  sliderThumbMax: {
    left: "35%",
  },
  sliderThumbMin: {
    left: "5%",
  },
  sliderTrack: {
    backgroundColor: localColors.sliderTrack,
    borderRadius: 3,
    height: 6,
    position: "relative",
  },
  title: {
    color: localColors.white,
    fontSize: 22,
    fontWeight: "800",
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 24,
  },
  toggleLabel: {
    color: localColors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  toggleThumb: {
    backgroundColor: localColors.white,
    borderRadius: 11,
    height: 22,
    position: "absolute",
    top: 2,
    width: 22,
  },
  toggleThumbOff: {
    left: 2,
  },
  toggleThumbOn: {
    right: 2,
  },
  toggleTouchable: {
    justifyContent: "center",
    minHeight: 44,
  },
  toggleTrack: {
    borderRadius: 13,
    height: 26,
    position: "relative",
    width: 48,
  },
  typeButton: {
    alignItems: "center",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  typeIcon: {
    fontSize: 18,
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
});

export default FilterSleepBottomSheet;
