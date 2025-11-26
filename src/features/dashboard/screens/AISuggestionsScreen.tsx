/**
 * AI Suggestions Screen - Personalized AI-Generated Mental Health Suggestions
 * Based on ui-designs/Dark-mode/Home & Mental Health Score.png
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
  Switch,
} from "react-native";

interface Suggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
  color: string;
  impact: string;
}

export const AISuggestionsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [includeAISuggestions, setIncludeAISuggestions] = useState(true);

  const suggestions: Suggestion[] = [
    {
      id: "1",
      category: "Breathing Activities",
      title: "Breathing Basics",
      description: "25-30min",
      duration: "25-30min",
      icon: "🫁",
      color: theme.colors.orange["60"],
      impact: "+8 pts",
    },
    {
      id: "2",
      category: "Physical Activities",
      title: "Morning Running",
      description: "Gentle Running, Swimming - 15-30min",
      duration: "15-30min",
      icon: "🏃",
      color: theme.colors.purple["60"],
      impact: "+12 pts",
    },
    {
      id: "3",
      category: "Social Connection",
      title: "Video Chat Meeting",
      description: "Daily 1-2hr",
      duration: "1-2hr",
      icon: "💬",
      color: theme.colors.yellow["60"],
      impact: "+6 pts",
    },
    {
      id: "4",
      category: "Professional Support",
      title: "Professional Therapy",
      description: "Psychologist, Therapy - 45-50min",
      duration: "45-50min",
      icon: "🧑‍⚕️",
      color: theme.colors.green["60"],
      impact: "+15 pts",
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
    moreButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      padding: 20,
    },
    scoreCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    scoreHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    scoreTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    normalBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.green["40"],
    },
    normalText: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.green["100"],
    },
    scoreInfo: {
      marginBottom: 16,
    },
    scoreLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    dateBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background.primary,
      borderRadius: 12,
      padding: 12,
      marginHorizontal: 4,
    },
    dateIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    dateText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    rangeSection: {
      marginBottom: 16,
    },
    rangeLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    rangeBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    rangeNumber: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      width: 30,
    },
    rangeTrack: {
      flex: 1,
      height: 8,
      backgroundColor: theme.colors.gray["20"],
      borderRadius: 4,
      marginHorizontal: 12,
      overflow: "hidden",
    },
    rangeFill: {
      height: "100%",
      backgroundColor: theme.colors.green["60"],
      borderRadius: 4,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 12,
      paddingVertical: 12,
      marginBottom: 8,
    },
    filterIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    filterText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    toggleLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
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
    suggestionCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    suggestionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    suggestionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    suggestionIconText: {
      fontSize: 24,
    },
    suggestionInfo: {
      flex: 1,
    },
    suggestionCategory: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 4,
    },
    suggestionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    suggestionImpact: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.green["40"],
    },
    suggestionImpactText: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.green["100"],
    },
    suggestionDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    actionButton: {
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: "center",
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

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
        <Text style={styles.headerTitle}>AI Score Suggestions</Text>
        <TouchableOpacity
          style={styles.moreButton}
          accessible
          accessibilityLabel="More options"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Freud Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Filter Freud Score</Text>
            <View style={styles.normalBadge}>
              <Text style={styles.normalText}>Normal</Text>
            </View>
          </View>

          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>Choose Date</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateBox}>
                <Text style={styles.dateIcon}>📅</Text>
                <Text style={styles.dateText}>2025/8/16</Text>
              </View>
              <View style={styles.dateBox}>
                <Text style={styles.dateIcon}>📅</Text>
                <Text style={styles.dateText}>2025/8/16</Text>
              </View>
            </View>
          </View>

          <View style={styles.rangeSection}>
            <Text style={styles.rangeLabel}>Score Range</Text>
            <View style={styles.rangeBar}>
              <Text style={styles.rangeNumber}>0</Text>
              <View style={styles.rangeTrack}>
                <View style={[styles.rangeFill, { width: "25%" }]} />
              </View>
              <Text style={styles.rangeNumber}>25</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>🔍</Text>
            <Text style={styles.filterText}>Filter Freud Score (15)</Text>
          </TouchableOpacity>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Include AI Suggestions</Text>
            <Switch
              value={includeAISuggestions}
              onValueChange={setIncludeAISuggestions}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.green["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* AI Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Suggestions</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {suggestions.map((suggestion) => (
            <View key={suggestion.id} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <View
                  style={[
                    styles.suggestionIcon,
                    { backgroundColor: `${suggestion.color}40` },
                  ]}
                >
                  <Text style={styles.suggestionIconText}>
                    {suggestion.icon}
                  </Text>
                </View>
                <View style={styles.suggestionInfo}>
                  <Text style={styles.suggestionCategory}>
                    {suggestion.category}
                  </Text>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                </View>
                <View style={styles.suggestionImpact}>
                  <Text style={styles.suggestionImpactText}>
                    {suggestion.impact}
                  </Text>
                </View>
              </View>

              <Text style={styles.suggestionDescription}>
                {suggestion.description}
              </Text>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Start Activity →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const AISuggestionsScreenWithBoundary = () => (
  <ScreenErrorBoundary screenName="AI Suggestions">
    <AISuggestionsScreen />
  </ScreenErrorBoundary>
);

export default AISuggestionsScreenWithBoundary;
