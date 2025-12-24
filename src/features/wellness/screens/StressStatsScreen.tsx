/**
 * Stress Stats Screen - Comprehensive Stress Level Analytics
 * Based on ui-designs/Dark-mode/Stress Management.png
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
  Dimensions,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");

interface StressLevelData {
  level: string;
  count: number;
  percentage: number;
  color: string;
  emoji: string;
}

interface StressorData {
  name: string;
  impact: string;
  count: number;
}

export const StressStatsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week",
  );

  const currentStressLevel = 3;
  const stressLevelText = "Moderate";

  const stressLevels: StressLevelData[] = [
    {
      level: "Calm",
      count: 33,
      percentage: 15,
      color: theme.colors.green["60"],
      emoji: "😌",
    },
    {
      level: "Normal",
      count: 91,
      percentage: 42,
      color: theme.colors.yellow["60"],
      emoji: "😊",
    },
    {
      level: "Elevated",
      count: 4,
      percentage: 18,
      color: theme.colors.orange["60"],
      emoji: "😰",
    },
    {
      level: "Stressed",
      count: 33,
      percentage: 15,
      color: theme.colors.red["60"],
      emoji: "😤",
    },
    {
      level: "Extreme",
      count: 0,
      percentage: 10,
      color: theme.colors.purple["60"],
      emoji: "😱",
    },
  ];

  const topStressors: StressorData[] = [
    { name: "Loneliness", impact: "Very High", count: 12 },
    { name: "Work", impact: "High", count: 8 },
    { name: "Life", impact: "Moderate", count: 5 },
    { name: "Relationship", impact: "Moderate", count: 4 },
  ];

  const stressImpact = [
    { category: "Stressor", level: "Loneliness", severity: "high" },
    { category: "Impact", level: "Very High", severity: "high" },
  ];

  const maxCount = Math.max(...stressLevels.map((s) => s.count));

  const handleSettings = () => {
    // Navigate to profile settings screen
    navigation.navigate("ProfileSettings" as never);
  };

  const handleStatsDetail = () => {
    // Show detailed statistics in current screen with expanded view
    Alert.alert(
      "Detailed Statistics",
      "This feature will show comprehensive stress analytics including trends, patterns, and correlations with other health metrics.",
      [{ text: "OK" }]
    );
  };

  const handleSeeAllStressors = () => {
    // Show comprehensive stressor list
    Alert.alert(
      "All Stressors",
      "This feature will display all identified stressors with their frequency, severity, and management strategies.",
      [{ text: "OK" }]
    );
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
    settingsButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    currentLevelCard: {
      backgroundColor: theme.colors.orange["20"],
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      marginBottom: 24,
      position: "relative",
      overflow: "hidden",
    },
    levelCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: theme.colors.orange["40"],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    levelNumber: {
      fontSize: 64,
      fontWeight: "800",
      color: theme.colors.orange["100"],
    },
    levelText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.orange["100"],
      marginBottom: 8,
    },
    periodSelector: {
      flexDirection: "row",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      padding: 4,
      marginTop: 16,
      alignSelf: "center",
      width: 200,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 8,
    },
    periodButtonActive: {
      backgroundColor: theme.colors.brown["60"],
    },
    periodText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    periodTextActive: {
      color: "#FFFFFF",
    },
    statsButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: theme.colors.brown["60"],
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statsButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    seeAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    seeAllText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown["60"],
    },
    chartCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    bubbleChart: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 300,
      gap: 12,
    },
    bubbleContainer: {
      alignItems: "center",
      justifyContent: "center",
      margin: 8,
    },
    bubble: {
      borderRadius: 1000,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    bubbleEmoji: {
      fontSize: 28,
      marginBottom: 4,
    },
    bubbleCount: {
      fontSize: 24,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    bubbleLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginTop: 8,
      textAlign: "center",
    },
    monthlyBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.purple["40"],
      alignSelf: "flex-end",
    },
    monthlyText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.purple["100"],
    },
    stressorCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    stressorName: {
      flex: 1,
    },
    stressorTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    stressorSubtitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    stressorBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    stressorBadgeText: {
      fontSize: 12,
      fontWeight: "700",
    },
    impactGrid: {
      flexDirection: "row",
      gap: 12,
    },
    impactCard: {
      flex: 1,
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
    },
    impactLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    impactValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    impactIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
  });

  const getBubbleSize = (count: number) => {
    const ratio = count / maxCount;
    const minSize = 80;
    const maxSize = 160;
    return minSize + ratio * (maxSize - minSize);
  };

  const getStressorBadgeColor = (impact: string) => {
    if (impact === "Very High")
      return { bg: theme.colors.red["40"], text: theme.colors.red["100"] };
    if (impact === "High")
      return {
        bg: theme.colors.orange["40"],
        text: theme.colors.orange["100"],
      };
    return { bg: theme.colors.yellow["40"], text: theme.colors.yellow["100"] };
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
        <Text style={styles.headerTitle}>Stress Level Stats</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettings}
          accessible
          accessibilityLabel="Stress tracking settings"
          accessibilityRole="button"
          accessibilityHint="Opens stress tracking settings"
        >
          <Text style={{ fontSize: 20 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Stress Level */}
        <View style={styles.currentLevelCard}>
          <View style={styles.levelCircle}>
            <Text style={styles.levelNumber}>{currentStressLevel}</Text>
          </View>
          <Text style={styles.levelText}>{stressLevelText} Stress</Text>

          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "week" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("week")}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "week" && styles.periodTextActive,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === "month" && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod("month")}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "month" && styles.periodTextActive,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.statsButton}
            onPress={handleStatsDetail}
            accessible
            accessibilityLabel="View detailed stress statistics"
            accessibilityRole="button"
            accessibilityHint="Opens detailed stress analytics"
          >
            <Text style={styles.statsButtonText}>Stress Stats</Text>
            <Text style={{ fontSize: 12 }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Stress Level Distribution */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Stress Level Stats</Text>
            <View style={styles.monthlyBadge}>
              <Text style={styles.monthlyText}>📅 Monthly</Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.bubbleChart}>
              {/* LOW-NEW-002 FIX: Use level as stable key instead of index */}
              {stressLevels.map((level) => {
                const size = getBubbleSize(level.count);
                return (
                  <View key={`stress-level-${level.level}`} style={styles.bubbleContainer}>
                    <View
                      style={[
                        styles.bubble,
                        {
                          width: size,
                          height: size,
                          backgroundColor: level.color,
                        },
                      ]}
                    >
                      <Text style={styles.bubbleEmoji}>{level.emoji}</Text>
                      <Text style={styles.bubbleCount}>{level.count}</Text>
                    </View>
                    <Text style={styles.bubbleLabel}>{level.level}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Stress Stats Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>
            Stress Stats
          </Text>
          <View style={styles.impactGrid}>
            {/* LOW-NEW-002 FIX: Use category as stable key instead of index */}
            {stressImpact.map((item) => (
              <View key={`impact-${item.category}`} style={styles.impactCard}>
                <Text style={styles.impactIcon}>
                  {item.category === "Stressor" ? "😰" : "⚠️"}
                </Text>
                <Text style={styles.impactLabel}>{item.category}</Text>
                <Text style={styles.impactValue}>{item.level}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Stressors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Stressors</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={handleSeeAllStressors}
              accessible
              accessibilityLabel="See all stressors"
              accessibilityRole="button"
              accessibilityHint="View complete list of stress triggers"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* LOW-NEW-002 FIX: Use stressor name as stable key instead of index */}
          {topStressors.map((stressor) => {
            const badgeColors = getStressorBadgeColor(stressor.impact);
            return (
              <View key={`stressor-${stressor.name}`} style={styles.stressorCard}>
                <View style={styles.stressorName}>
                  <Text style={styles.stressorTitle}>{stressor.name}</Text>
                  <Text style={styles.stressorSubtitle}>
                    {stressor.count} times this month
                  </Text>
                </View>
                <View
                  style={[
                    styles.stressorBadge,
                    { backgroundColor: badgeColors.bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.stressorBadgeText,
                      { color: badgeColors.text },
                    ]}
                  >
                    {stressor.impact}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
StressStatsScreen.displayName = 'StressStatsScreen';

export default StressStatsScreen;
