/**
 * Mood Screen - Mood Tracking Interface
 * Helps users track and reflect on their emotional states
 */

import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

interface MoodEntry {
  mood: string;
  intensity: number;
  note: string;
  timestamp: Date;
}

const MOODS = [
  { emoji: "😊", label: "Happy", color: "#22c55e" },
  { emoji: "😔", label: "Sad", color: "#3b82f6" },
  { emoji: "😰", label: "Anxious", color: "#f59e0b" },
  { emoji: "😡", label: "Angry", color: "#ef4444" },
  { emoji: "😴", label: "Tired", color: "#8b5cf6" },
  { emoji: "😌", label: "Calm", color: "#10b981" },
];

const INTENSITY_LEVELS = [1, 2, 3, 4, 5];

export const MoodScreen = () => {
  const { theme } = useTheme();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<number | null>(
    null,
  );
  const [recentEntries] = useState<MoodEntry[]>([
    {
      mood: "Happy",
      intensity: 4,
      note: "Had a great day with friends",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      mood: "Calm",
      intensity: 3,
      note: "Morning meditation helped",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text.secondary,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    moodGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    moodButton: {
      width: "48%",
      backgroundColor: theme.colors.background.secondary,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      alignItems: "center",
      ...theme.shadows.sm,
    },
    selectedMoodButton: {
      borderWidth: 2,
      borderColor: theme.colors.therapeutic.nurturing[600] || "#16a34a",
    },
    moodEmoji: {
      fontSize: 32,
      marginBottom: 8,
    },
    moodLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text.primary,
    },
    intensityContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    intensityButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
      ...theme.shadows.sm,
    },
    selectedIntensityButton: {
      backgroundColor: theme.colors.therapeutic.nurturing[600] || "#16a34a",
    },
    intensityText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    selectedIntensityText: {
      color: "#FFFFFF",
    },
    saveButton: {
      backgroundColor: theme.colors.therapeutic.nurturing[600] || "#16a34a",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 24,
    },
    disabledButton: {
      opacity: 0.5,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    historyItem: {
      backgroundColor: theme.colors.background.secondary,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      ...theme.shadows.sm,
    },
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    historyMood: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    historyTime: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    historyNote: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      fontStyle: "italic",
    },
  });

  const saveMoodEntry = () => {
    if (selectedMood && selectedIntensity) {
      if (__DEV__) {
        console.log("Saving mood entry:", {
          mood: selectedMood,
          intensity: selectedIntensity,
          timestamp: new Date(),
        });
      }

      // TODO: Save to Redux store - dispatch(saveMood({ mood: selectedMood, intensity: selectedIntensity }))

      // Reset form
      setSelectedMood(null);
      setSelectedIntensity(null);
    }
  };

  const canSave = selectedMood && selectedIntensity;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>
            Track your emotions to understand your patterns
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select your mood</Text>
          <View style={styles.moodGrid}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={[
                  styles.moodButton,
                  selectedMood === mood.label && styles.selectedMoodButton,
                ]}
                onPress={() => setSelectedMood(mood.label)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedMood && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intensity level</Text>
            <View style={styles.intensityContainer}>
              {INTENSITY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.intensityButton,
                    selectedIntensity === level &&
                      styles.selectedIntensityButton,
                  ]}
                  onPress={() => setSelectedIntensity(level)}
                >
                  <Text
                    style={[
                      styles.intensityText,
                      selectedIntensity === level &&
                        styles.selectedIntensityText,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.disabledButton]}
          onPress={saveMoodEntry}
          disabled={!canSave}
        >
          <Text style={styles.saveButtonText}>Save Mood Entry</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {recentEntries.map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyMood}>
                  {entry.mood} (Level {entry.intensity})
                </Text>
                <Text style={styles.historyTime}>
                  {entry.timestamp.toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.historyNote}>{entry.note}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodScreen;
