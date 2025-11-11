/**
 * Relaxation Techniques Screen - Various Stress Relief Methods
 * Based on ui-designs/Dark-mode/🔒 Stress Management.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Technique {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  category: string;
}

export const RelaxationTechniquesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const techniques: Technique[] = [
    {
      id: "1",
      title: "Deep Breathing",
      description: "Simple breathing exercises to calm your nervous system",
      duration: "5 min",
      difficulty: "Beginner",
      icon: "🫁",
      category: "Breathing",
    },
    {
      id: "2",
      title: "Progressive Muscle Relaxation",
      description: "Release tension by tensing and relaxing muscle groups",
      duration: "15 min",
      difficulty: "Beginner",
      icon: "💪",
      category: "Physical",
    },
    {
      id: "3",
      title: "Guided Visualization",
      description: "Create a mental safe space for relaxation",
      duration: "10 min",
      difficulty: "Intermediate",
      icon: "🌄",
      category: "Mental",
    },
    {
      id: "4",
      title: "Body Scan Meditation",
      description: "Mindfully scan your body from head to toe",
      duration: "20 min",
      difficulty: "Intermediate",
      icon: "🧘",
      category: "Meditation",
    },
    {
      id: "5",
      title: "Autogenic Training",
      description: "Use self-suggestions to achieve deep relaxation",
      duration: "15 min",
      difficulty: "Advanced",
      icon: "🧠",
      category: "Advanced",
    },
    {
      id: "6",
      title: "Yoga Nidra",
      description: "Guided meditation for conscious deep sleep",
      duration: "30 min",
      difficulty: "Advanced",
      icon: "🕉️",
      category: "Meditation",
    },
  ];

  const quickTechniques = [
    { id: "1", name: "4-7-8 Breathing", time: "2 min", icon: "🌬️" },
    { id: "2", name: "Hand Massage", time: "3 min", icon: "🤲" },
    { id: "3", name: "Shoulder Rolls", time: "1 min", icon: "🔄" },
    { id: "4", name: "Mindful Walk", time: "5 min", icon: "🚶" },
  ];

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
    heroCard: {
      backgroundColor: theme.colors.blue["60"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },
    heroIcon: {
      fontSize: 64,
      marginBottom: 12,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 8,
      textAlign: "center",
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: "#FFFFFF",
      opacity: 0.9,
      textAlign: "center",
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    quickTechniquesRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 24,
    },
    quickTechniqueCard: {
      width: "48%",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
    },
    quickTechniqueIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    quickTechniqueName: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
      textAlign: "center",
    },
    quickTechniqueTime: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    techniqueCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    techniqueHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    techniqueIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    techniqueHeaderText: {
      flex: 1,
    },
    techniqueTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    techniqueCategory: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.blue["60"],
    },
    difficultyBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    difficultyBeginner: {
      backgroundColor: theme.colors.green["60"],
    },
    difficultyIntermediate: {
      backgroundColor: theme.colors.orange["60"],
    },
    difficultyAdvanced: {
      backgroundColor: theme.colors.red["60"],
    },
    difficultyText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    techniqueDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    techniqueFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    techniqueDuration: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    startButton: {
      backgroundColor: theme.colors.blue["60"],
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    startButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return styles.difficultyBeginner;
      case "Intermediate":
        return styles.difficultyIntermediate;
      case "Advanced":
        return styles.difficultyAdvanced;
      default:
        return styles.difficultyBeginner;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Relaxation Techniques</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🧘‍♀️</Text>
          <Text style={styles.heroTitle}>Find Your Calm</Text>
          <Text style={styles.heroSubtitle}>
            Discover proven relaxation techniques to reduce stress and find
            inner peace
          </Text>
        </View>

        {/* Quick Techniques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Relief (Under 5 min)</Text>
          <View style={styles.quickTechniquesRow}>
            {quickTechniques.map((technique) => (
              <TouchableOpacity
                key={technique.id}
                style={styles.quickTechniqueCard}
              >
                <Text style={styles.quickTechniqueIcon}>{technique.icon}</Text>
                <Text style={styles.quickTechniqueName}>{technique.name}</Text>
                <Text style={styles.quickTechniqueTime}>{technique.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Techniques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Techniques</Text>
          {techniques.map((technique) => (
            <TouchableOpacity
              key={technique.id}
              style={styles.techniqueCard}
              onPress={() => navigation.navigate("ExerciseCreate")}
            >
              <View style={styles.techniqueHeader}>
                <Text style={styles.techniqueIcon}>{technique.icon}</Text>
                <View style={styles.techniqueHeaderText}>
                  <Text style={styles.techniqueTitle}>{technique.title}</Text>
                  <Text style={styles.techniqueCategory}>
                    {technique.category}
                  </Text>
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    getDifficultyStyle(technique.difficulty),
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {technique.difficulty}
                  </Text>
                </View>
              </View>

              <Text style={styles.techniqueDescription}>
                {technique.description}
              </Text>

              <View style={styles.techniqueFooter}>
                <Text style={styles.techniqueDuration}>
                  ⏱️ {technique.duration}
                </Text>
                <View style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Session</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RelaxationTechniquesScreen;
