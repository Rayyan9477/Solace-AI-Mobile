import { logger } from "@shared/utils/logger";

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
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logMood } from "../../app/store/slices/moodSlice";

interface MoodEntry {
  mood: string;
  intensity: number;
  note: string;
  timestamp: Date;
}

const MOODS = [
  { emoji: "😭", label: "Very sad", color: "#E07A5F" },
  { emoji: "😢", label: "Sad", color: "#E8A872" },
  { emoji: "😐", label: "Okay", color: "#B8976B" },
  { emoji: "🙂", label: "Good", color: "#98B068" },
  { emoji: "😁", label: "Happy", color: "#8FBC8F" },
];

const INTENSITY_LEVELS = [1, 2, 3, 4, 5];

export const MoodScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  // Get mood history from Redux state
  const moodHistory = useSelector((state: any) => state.mood.moodHistory || []);
  const weeklyStats = useSelector((state: any) => state.mood.weeklyStats);
  const insights = useSelector((state: any) => state.mood.insights || []);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<number | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Use actual mood history from Redux, show only recent 5 entries
  const recentEntries = moodHistory.slice(0, 5).map(entry => ({
    mood: entry.mood,
    intensity: entry.intensity,
    note: entry.notes || "",
    timestamp: typeof entry.timestamp === "string"
      ? new Date(entry.timestamp)
      : new Date(entry.timestamp),
  }));

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

  const saveMoodEntry = async () => {
    if (selectedMood && selectedIntensity) {
      try {
        setIsSaving(true);

        if (__DEV__) {
          logger.debug("Saving mood entry:", {
            mood: selectedMood,
            intensity: selectedIntensity,
            timestamp: new Date(),
          });
        }

        // Dispatch to Redux store and save to local storage
        const result = await dispatch(
          logMood({
            mood: selectedMood,
            intensity: selectedIntensity,
            notes: "",
            activities: [],
          }) as any
        );

        if (logMood.fulfilled.match(result)) {
          // Successfully saved
          Alert.alert(
            "Mood Saved",
            "Your mood has been recorded successfully.",
            [{ text: "OK" }]
          );

          // Reset form
          setSelectedMood(null);
          setSelectedIntensity(null);
        } else {
          // Handle error
          Alert.alert(
            "Error",
            "Failed to save mood entry. Please try again.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        logger.error("Error saving mood:", error);
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setIsSaving(false);
      }
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
          style={[
            styles.saveButton,
            (!canSave || isSaving) && styles.disabledButton,
          ]}
          onPress={saveMoodEntry}
          disabled={!canSave || isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save Mood Entry"}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          {recentEntries.map((entry, index) => (
            <View key={`mood-entry-${entry.timestamp.getTime()}-${index}`} style={styles.historyItem}>
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

// LOW-NEW-001 FIX: Add displayName for debugging
MoodScreen.displayName = 'MoodScreen';

export default MoodScreen;
