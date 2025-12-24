/**
 * Stress Management Screen - Track stress levels and provide relief tools
 * Based on ui-designs/Dark-mode/Stress Management.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

type StressLevel = 1 | 2 | 3 | 4 | 5;

const STRESS_LEVELS = [
  { level: 1 as StressLevel, label: "Calm", color: "#98B068" },
  { level: 2 as StressLevel, label: "Normal", color: "#B8C77F" },
  { level: 3 as StressLevel, label: "Elevated", color: "#C96100" },
  { level: 4 as StressLevel, label: "Stressed", color: "#D94500" },
  { level: 5 as StressLevel, label: "Extreme", color: "#8B7DA8" },
];

const STRESSORS = [
  { id: "work", label: "Work", size: "large" },
  { id: "relationships", label: "Relationships", size: "medium" },
  { id: "loneliness", label: "Loneliness", size: "large" },
  { id: "kids", label: "Kids", size: "small" },
  { id: "life", label: "Life", size: "medium" },
  { id: "other", label: "Other", size: "small" },
];

const STRESS_STATS = [
  { date: "15", level: 2, label: "Normal" },
  { date: "16", level: 3, label: "Elevated" },
  { date: "17", level: 4, label: "Stressed" },
  { date: "18", level: 2, label: "Normal" },
  { date: "19", level: 1, label: "Calm" },
];

export const StressManagementScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedLevel, setSelectedLevel] = useState<StressLevel>(3);
  const [selectedStressors, setSelectedStressors] = useState<string[]>([]);

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
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
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
      padding: 20,
    },
    levelCard: {
      backgroundColor: "#C96100",
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      marginBottom: 24,
    },
    levelValue: {
      fontSize: 96,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 8,
    },
    levelLabel: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    levelSelector: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },
    levelDisplay: {
      fontSize: 96,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    levelProgress: {
      width: "100%",
      height: 8,
      backgroundColor: theme.colors.brown["30"],
      borderRadius: 4,
      marginBottom: 16,
      overflow: "hidden",
    },
    levelProgressFill: {
      height: "100%",
      backgroundColor: "#C96100",
      borderRadius: 4,
    },
    levelText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    stressorsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "center",
    },
    stressorButton: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    stressorButtonActive: {
      backgroundColor: "#98B068",
      borderColor: "#98B068",
    },
    stressorSmall: {
      width: 100,
      height: 100,
    },
    stressorMedium: {
      width: 120,
      height: 120,
    },
    stressorLarge: {
      width: 140,
      height: 140,
    },
    stressorText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    stressorTextActive: {
      color: "#FFFFFF",
    },
    impactBanner: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    impactIcon: {
      fontSize: 24,
    },
    impactText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    statsSection: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 20,
      padding: 20,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    statCard: {
      alignItems: "center",
      flex: 1,
    },
    statCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    statDate: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
    },
    continueButton: {
      backgroundColor: theme.colors.brown["70"],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 24,
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.background.secondary,
    },
  });

  const toggleStressor = (id: string) => {
    if (selectedStressors.includes(id)) {
      setSelectedStressors(selectedStressors.filter((s) => s !== id));
    } else {
      setSelectedStressors([...selectedStressors, id]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stress Level</Text>
        <TouchableOpacity onPress={() => navigation.navigate("StressStats")}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: theme.colors.brown["70"],
            }}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Stress Level */}
        <View style={styles.levelCard}>
          <Text style={styles.levelValue}>{selectedLevel}</Text>
          <Text style={styles.levelLabel}>Elevated Stress</Text>
        </View>

        {/* Stress Level Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What's your stress level today?
          </Text>
          <View style={styles.levelSelector}>
            <Text style={styles.levelDisplay}>{selectedLevel}</Text>
            <View style={styles.levelProgress}>
              <View
                style={[
                  styles.levelProgressFill,
                  { width: `${(selectedLevel / 5) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.levelText}>Moderate</Text>
          </View>
        </View>

        {/* Select Stressors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Stressors</Text>
          <Text style={styles.sectionSubtitle}>
            Our AI will decide how your stressor will impacts your life in
            general.
          </Text>
          <View style={styles.stressorsGrid}>
            {STRESSORS.map((stressor) => (
              <TouchableOpacity
                key={stressor.id}
                style={[
                  styles.stressorButton,
                  stressor.size === "small" && styles.stressorSmall,
                  stressor.size === "medium" && styles.stressorMedium,
                  stressor.size === "large" && styles.stressorLarge,
                  selectedStressors.includes(stressor.id) &&
                    styles.stressorButtonActive,
                ]}
                onPress={() => toggleStressor(stressor.id)}
              >
                <Text
                  style={[
                    styles.stressorText,
                    selectedStressors.includes(stressor.id) &&
                      styles.stressorTextActive,
                  ]}
                >
                  {stressor.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Impact Banner */}
        {selectedStressors.length > 0 && (
          <View style={styles.impactBanner}>
            <Text style={styles.impactIcon}>⚠️</Text>
            <Text style={styles.impactText}>
              Life Impact: Very High - Your selected stressors are significantly
              affecting your wellbeing
            </Text>
          </View>
        )}

        {/* Stress Stats */}
        <View style={[styles.section, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Stress Stats</Text>
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              {/* LOW-NEW-002 FIX: Use date as stable key instead of index */}
              {STRESS_STATS.map((stat) => (
                <View key={`stress-${stat.date}`} style={styles.statCard}>
                  <View
                    style={[
                      styles.statCircle,
                      {
                        backgroundColor: STRESS_LEVELS.find(
                          (l) => l.level === stat.level,
                        )?.color,
                      },
                    ]}
                  >
                    <Text style={styles.statValue}>{stat.level}</Text>
                  </View>
                  <Text style={styles.statDate}>{stat.date}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export const StressManagementScreenWithBoundary = () => (
  <ScreenErrorBoundary screenName="Stress Management">
    <StressManagementScreen />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging
StressManagementScreen.displayName = 'StressManagementScreen';
StressManagementScreenWithBoundary.displayName = 'StressManagementScreenWithBoundary';

export default StressManagementScreenWithBoundary;
