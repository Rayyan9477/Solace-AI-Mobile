/**
 * MoodHistoryScreen Component
 * @description Chronological mood history list with biometric data and segmented tabs
 * @task Task 3.8.4: Mood History Screen (Screen 74)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  heartRate: number;
  bloodPressure: number;
}

interface MoodHistoryScreenProps {
  activeTab: "history" | "suggestions";
  entries: MoodEntry[];
  onBack: () => void;
  onTabChange: (tab: "history" | "suggestions") => void;
  onEntryPress: (entry: MoodEntry) => void;
  onFilter: () => void;
  onSettings: () => void;
  onAddMood: () => void;
  onEdit: () => void;
}

export function MoodHistoryScreen({
  activeTab,
  entries,
  onBack,
  onTabChange,
  onEntryPress,
  onFilter,
  onSettings,
  onAddMood,
  onEdit,
}: MoodHistoryScreenProps): React.ReactElement {
  return (
    <View testID="mood-history-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood History</Text>
        <TouchableOpacity
          testID="filter-button"
          style={styles.filterButton}
          onPress={onFilter}
          accessibilityRole="button"
          accessibilityLabel="Filter mood history"
        >
          <Text style={styles.filterIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View testID="segmented-control" style={styles.segmentedControl}>
        <TouchableOpacity
          testID="tab-history"
          style={[
            styles.segmentTab,
            activeTab === "history" && styles.segmentTabActive,
          ]}
          onPress={() => onTabChange("history")}
          accessibilityRole="button"
          accessibilityLabel="View history"
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "history" && styles.segmentTextActive,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="tab-suggestions"
          style={[
            styles.segmentTab,
            activeTab === "suggestions" && styles.segmentTabActive,
          ]}
          onPress={() => onTabChange("suggestions")}
          accessibilityRole="button"
          accessibilityLabel="View AI suggestions"
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "suggestions" && styles.segmentTextActive,
            ]}
          >
            AI Suggestions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mood Entries List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            testID={`mood-entry-${entry.id}`}
            style={styles.entryCard}
            onPress={() => onEntryPress(entry)}
            accessibilityRole="button"
            accessibilityLabel={`${entry.date}: ${entry.mood}`}
          >
            <View style={styles.entryDateColumn}>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
            <View style={styles.entryMoodColumn}>
              <Text style={styles.entryEmoji}>{entry.emoji}</Text>
              <Text style={styles.entryMood}>{entry.mood}</Text>
            </View>
            <View style={styles.entryBiometrics}>
              <View style={styles.biometricRow}>
                <Text style={styles.biometricIcon}>❤️</Text>
                <Text style={styles.biometricValue}>{entry.heartRate} bpm</Text>
              </View>
              <View style={styles.biometricRow}>
                <Text style={styles.biometricIcon}>⚡</Text>
                <Text style={styles.biometricValue}>
                  {entry.bloodPressure} sys
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View testID="bottom-action-bar" style={styles.bottomActionBar}>
        <TouchableOpacity
          testID="settings-button"
          style={styles.actionButton}
          onPress={onSettings}
          accessibilityRole="button"
          accessibilityLabel="Mood settings"
        >
          <Text style={styles.actionIcon}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="add-button"
          style={styles.addButtonLarge}
          onPress={onAddMood}
          accessibilityRole="button"
          accessibilityLabel="Add mood entry"
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="edit-button"
          style={styles.actionButton}
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel="Edit mood entries"
        >
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  actionIcon: {
    fontSize: 22,
  },
  addButtonLarge: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 28,
    elevation: 4,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 56,
  },
  addIcon: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "600",
  },
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  biometricIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  biometricRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 2,
  },
  biometricValue: {
    color: palette.gray[400],
    fontSize: 13,
  },
  bottomActionBar: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderTopColor: palette.brown[700],
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 24,
    paddingTop: 12,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  entryBiometrics: {
    alignItems: "flex-end",
  },
  entryCard: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 8,
    marginHorizontal: 24,
    padding: 16,
  },
  entryDate: {
    color: palette.gray[400],
    fontSize: 13,
    fontWeight: "600",
  },
  entryDateColumn: {
    marginRight: 16,
    width: 50,
  },
  entryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  entryMood: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "600",
  },
  entryMoodColumn: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  filterButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  filterIcon: {
    fontSize: 18,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  listContainer: {
    flex: 1,
    paddingTop: 16,
  },
  segmentTab: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 20,
    flex: 1,
    minHeight: 44,
    paddingVertical: 10,
  },
  segmentTabActive: {
    backgroundColor: palette.onboarding.step2,
  },
  segmentText: {
    color: palette.gray[400],
    fontSize: 14,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: palette.white,
  },
  segmentedControl: {
    backgroundColor: palette.brown[800],
    borderRadius: 24,
    flexDirection: "row",
    marginHorizontal: 24,
    padding: 4,
  },
});

export default MoodHistoryScreen;
