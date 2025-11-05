/**
 * Stress Assessment Screen - Current Stress Level Input
 * Based on ui-designs/Dark-mode/🔒 Stress Management.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

export const StressAssessmentScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState<number>(3);

  const stressLevels = [
    {
      level: 1,
      label: "Very Low",
      emoji: "😌",
      color: theme.colors.green["60"],
    },
    { level: 2, label: "Low", emoji: "🙂", color: theme.colors.blue["60"] },
    {
      level: 3,
      label: "Moderate",
      emoji: "😐",
      color: theme.colors.orange["60"],
    },
    { level: 4, label: "High", emoji: "😟", color: theme.colors.orange["80"] },
    {
      level: 5,
      label: "Very High",
      emoji: "😰",
      color: theme.colors.red["60"],
    },
  ];

  const triggers = [
    "Work",
    "Relationships",
    "Health",
    "Finances",
    "Family",
    "Social",
    "Sleep",
    "Other",
  ];

  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    questionText: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      textAlign: "center",
      marginBottom: 32,
    },
    levelsContainer: {
      gap: 12,
      marginBottom: 32,
    },
    levelButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: "transparent",
    },
    levelButtonSelected: {
      borderColor: theme.colors.orange["60"],
    },
    levelEmoji: {
      fontSize: 32,
      marginRight: 16,
    },
    levelInfo: {
      flex: 1,
    },
    levelLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    levelNumber: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    selectionIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.gray["40"],
      justifyContent: "center",
      alignItems: "center",
    },
    selectionIndicatorSelected: {
      backgroundColor: theme.colors.orange["60"],
      borderColor: theme.colors.orange["60"],
    },
    checkmark: {
      fontSize: 14,
      color: "#FFFFFF",
    },
    triggersGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    triggerButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["10"],
      borderWidth: 2,
      borderColor: "transparent",
    },
    triggerButtonSelected: {
      backgroundColor: theme.colors.orange["20"],
      borderColor: theme.colors.orange["60"],
    },
    triggerText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    resultCard: {
      backgroundColor: theme.colors.orange["20"],
      marginHorizontal: 20,
      marginTop: 24,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
    },
    resultEmoji: {
      fontSize: 64,
      marginBottom: 12,
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    resultDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    saveButton: {
      backgroundColor: theme.colors.orange["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const currentLevel = stressLevels.find((l) => l.level === selectedLevel);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stress Assessment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.questionText}>
            How stressed do you feel right now?
          </Text>

          <View style={styles.levelsContainer}>
            {stressLevels.map((level) => (
              <TouchableOpacity
                key={level.level}
                style={[
                  styles.levelButton,
                  selectedLevel === level.level && styles.levelButtonSelected,
                ]}
                onPress={() => setSelectedLevel(level.level)}
              >
                <Text style={styles.levelEmoji}>{level.emoji}</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelLabel}>{level.label}</Text>
                  <Text style={styles.levelNumber}>Level {level.level}/5</Text>
                </View>
                <View
                  style={[
                    styles.selectionIndicator,
                    selectedLevel === level.level &&
                      styles.selectionIndicatorSelected,
                  ]}
                >
                  {selectedLevel === level.level && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's causing your stress?</Text>
          <View style={styles.triggersGrid}>
            {triggers.map((trigger) => (
              <TouchableOpacity
                key={trigger}
                style={[
                  styles.triggerButton,
                  selectedTriggers.includes(trigger) &&
                    styles.triggerButtonSelected,
                ]}
                onPress={() => toggleTrigger(trigger)}
              >
                <Text style={styles.triggerText}>{trigger}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {currentLevel && (
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>{currentLevel.emoji}</Text>
            <Text style={styles.resultTitle}>{currentLevel.label} Stress</Text>
            <Text style={styles.resultDescription}>
              {selectedLevel <= 2 &&
                "You're managing stress well. Keep up the good work!"}
              {selectedLevel === 3 &&
                "Your stress is at a moderate level. Consider some relaxation techniques."}
              {selectedLevel >= 4 &&
                "Your stress level is elevated. We recommend trying stress relief exercises."}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate("StressStats")}
        >
          <Text style={styles.saveButtonText}>Save & View Recommendations</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StressAssessmentScreen;
