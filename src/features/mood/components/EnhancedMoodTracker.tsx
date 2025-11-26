import { logger } from "@shared/utils/logger";

/**
 * Enhanced Mood Tracker Component - Simplified version
 * Basic mood tracking interface without complex dependencies
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Card, Button, Chip, TextInput, ProgressBar } from "react-native-paper";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const moodOptions = [
  { id: 1, emoji: "😢", label: "Very Sad", color: "#FF6B6B" },
  { id: 2, emoji: "😔", label: "Sad", color: "#FFA726" },
  { id: 3, emoji: "😐", label: "Neutral", color: "#FFD54F" },
  { id: 4, emoji: "😊", label: "Happy", color: "#66BB6A" },
  { id: 5, emoji: "😄", label: "Very Happy", color: "#42A5F5" },
];

const EnhancedMoodTracker = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState("");
  const [intensity, setIntensity] = useState(5);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      logger.debug("Mood logged:", { mood: selectedMood, notes, intensity });
      // Navigate back or show success message
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7FAFC",
    },
    header: {
      padding: 20,
      paddingTop: Platform.OS === "ios" ? 60 : 40,
      backgroundColor: "#007AFF",
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFFFFF",
      textAlign: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#2D3748",
      marginBottom: 12,
    },
    moodGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    moodCard: {
      width: "18%",
      aspectRatio: 1,
      marginBottom: 12,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    selectedMoodCard: {
      backgroundColor: "#007AFF",
    },
    moodEmoji: {
      fontSize: 32,
      marginBottom: 4,
    },
    moodLabel: {
      fontSize: 10,
      color: "#718096",
      textAlign: "center",
    },
    selectedMoodLabel: {
      color: "#FFFFFF",
    },
    inputContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    intensityContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    intensityLabel: {
      fontSize: 16,
      color: "#2D3748",
      marginBottom: 8,
    },
    submitButton: {
      backgroundColor: "#007AFF",
      borderRadius: 12,
      paddingVertical: 16,
      marginTop: 20,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
    disabledButton: {
      backgroundColor: "#CBD5E1",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Track Your Mood</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.moodGrid}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodCard,
                  selectedMood?.id === mood.id && styles.selectedMoodCard,
                ]}
                onPress={() => handleMoodSelect(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood?.id === mood.id && styles.selectedMoodLabel,
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add notes (optional)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="How was your day? What's on your mind?"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood intensity</Text>
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityLabel}>Intensity: {intensity}/10</Text>
            <ProgressBar
              progress={intensity / 10}
              color="#007AFF"
              style={{ height: 8, borderRadius: 4 }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !selectedMood && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!selectedMood}
        >
          <Text style={styles.submitButtonText}>Log Mood</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EnhancedMoodTracker;
