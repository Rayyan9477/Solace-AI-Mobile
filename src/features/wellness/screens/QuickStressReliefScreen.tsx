/**
 * Quick Stress Relief Screen - Immediate Stress Reduction Tools
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

interface QuickTechnique {
  id: string;
  title: string;
  duration: string;
  icon: string;
  description: string;
}

export const QuickStressReliefScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const techniques: QuickTechnique[] = [
    {
      id: "1",
      title: "Box Breathing",
      duration: "2 min",
      icon: "📦",
      description: "Breathe in 4s, hold 4s, out 4s, hold 4s",
    },
    {
      id: "2",
      title: "Progressive Relaxation",
      duration: "3 min",
      icon: "💪",
      description: "Tense and release each muscle group",
    },
    {
      id: "3",
      title: "Grounding 5-4-3-2-1",
      duration: "3 min",
      icon: "🌍",
      description: "Use your 5 senses to ground yourself",
    },
    {
      id: "4",
      title: "Hand Massage",
      duration: "2 min",
      icon: "🤲",
      description: "Gently massage pressure points on hands",
    },
    {
      id: "5",
      title: "Shoulder Rolls",
      duration: "1 min",
      icon: "🔄",
      description: "Release tension in neck and shoulders",
    },
    {
      id: "6",
      title: "Quick Walk",
      duration: "5 min",
      icon: "🚶",
      description: "Take a short mindful walk",
    },
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
      backgroundColor: theme.colors.orange["60"],
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
    techniquesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    techniqueCard: {
      width: "48%",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
    },
    techniqueIcon: {
      fontSize: 48,
      marginBottom: 12,
      textAlign: "center",
    },
    techniqueTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
      textAlign: "center",
    },
    techniqueDuration: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.orange["60"],
      marginBottom: 8,
      textAlign: "center",
    },
    techniqueDescription: {
      fontSize: 12,
      lineHeight: 16,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    emergencyCard: {
      backgroundColor: theme.colors.red["20"],
      marginHorizontal: 20,
      marginTop: 24,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    emergencyIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    emergencyContent: {
      flex: 1,
    },
    emergencyTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    emergencyText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    emergencyButton: {
      backgroundColor: theme.colors.red["60"],
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
      alignSelf: "flex-start",
    },
    emergencyButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

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
        <Text style={styles.headerTitle}>Quick Relief</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>⚡</Text>
          <Text style={styles.heroTitle}>Fast Relief</Text>
          <Text style={styles.heroSubtitle}>
            Quick techniques to reduce stress in moments when you need it most
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instant Techniques</Text>
          <View style={styles.techniquesGrid}>
            {techniques.map((technique) => (
              <TouchableOpacity
                key={technique.id}
                style={styles.techniqueCard}
                onPress={() => navigation.navigate("ExerciseCreate")}
              >
                <Text style={styles.techniqueIcon}>{technique.icon}</Text>
                <Text style={styles.techniqueTitle}>{technique.title}</Text>
                <Text style={styles.techniqueDuration}>
                  ⏱️ {technique.duration}
                </Text>
                <Text style={styles.techniqueDescription}>
                  {technique.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Feeling Overwhelmed?</Text>
            <Text style={styles.emergencyText}>
              If stress feels unmanageable, reach out for professional support
            </Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => navigation.navigate("CrisisSupport")}
            >
              <Text style={styles.emergencyButtonText}>Get Help Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuickStressReliefScreen;
