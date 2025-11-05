/**
 * Sleep Tips Screen - AI-Generated Sleep Improvement Suggestions
 * Based on ui-designs/Dark-mode/🔒 Sleep Quality.png
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

interface SleepTip {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  priority: "high" | "medium" | "low";
}

export const SleepTipsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const sleepTips: SleepTip[] = [
    {
      id: "1",
      category: "Environment",
      title: "Optimize Your Sleep Environment",
      description:
        "Keep your bedroom cool (60-67°F), dark, and quiet. Consider using blackout curtains and white noise machines.",
      icon: "🛏️",
      priority: "high",
    },
    {
      id: "2",
      category: "Routine",
      title: "Establish a Consistent Schedule",
      description:
        "Go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock.",
      icon: "⏰",
      priority: "high",
    },
    {
      id: "3",
      category: "Technology",
      title: "Limit Screen Time Before Bed",
      description:
        "Avoid screens 1-2 hours before bedtime. The blue light can interfere with melatonin production.",
      icon: "📱",
      priority: "high",
    },
    {
      id: "4",
      category: "Nutrition",
      title: "Watch Your Diet",
      description:
        "Avoid large meals, caffeine, and alcohol close to bedtime. Try a light snack if you're hungry.",
      icon: "🍽️",
      priority: "medium",
    },
    {
      id: "5",
      category: "Exercise",
      title: "Exercise Regularly",
      description:
        "Regular physical activity can help you fall asleep faster and enjoy deeper sleep. Avoid vigorous exercise close to bedtime.",
      icon: "🏃",
      priority: "medium",
    },
    {
      id: "6",
      category: "Relaxation",
      title: "Practice Relaxation Techniques",
      description:
        "Try meditation, deep breathing, or progressive muscle relaxation before bed to calm your mind.",
      icon: "🧘",
      priority: "medium",
    },
    {
      id: "7",
      category: "Stress",
      title: "Manage Stress and Worry",
      description:
        "Keep a worry journal to write down concerns before bed. This helps clear your mind for sleep.",
      icon: "📝",
      priority: "low",
    },
    {
      id: "8",
      category: "Comfort",
      title: "Invest in Comfort",
      description:
        "Ensure your mattress and pillows provide adequate support and comfort for your sleeping position.",
      icon: "💤",
      priority: "low",
    },
  ];

  const personalizedRecommendations = [
    {
      id: "1",
      text: "Based on your sleep patterns, try going to bed 30 minutes earlier",
      impact: "+45 min average sleep",
    },
    {
      id: "2",
      text: "Your sleep quality improves when you exercise in the morning",
      impact: "+15% sleep quality",
    },
    {
      id: "3",
      text: "Consider reducing caffeine intake after 2 PM",
      impact: "Faster sleep onset",
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
    bookmarkButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    heroCard: {
      backgroundColor: theme.colors.purple["60"],
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
    recommendationCard: {
      backgroundColor: theme.colors.green["20"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    recommendationIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    recommendationContent: {
      flex: 1,
    },
    recommendationText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    recommendationImpact: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.green["80"],
    },
    tipCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
    },
    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    tipIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    tipHeaderText: {
      flex: 1,
    },
    tipCategory: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    tipTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    priorityHigh: {
      backgroundColor: theme.colors.red["60"],
    },
    priorityMedium: {
      backgroundColor: theme.colors.orange["60"],
    },
    priorityLow: {
      backgroundColor: theme.colors.gray["60"],
    },
    priorityText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
    tipDescription: {
      fontSize: 13,
      lineHeight: 20,
      color: theme.colors.text.secondary,
    },
    actionButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
      alignItems: "center",
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      default:
        return styles.priorityLow;
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.toUpperCase();
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
        <Text style={styles.headerTitle}>Sleep Tips</Text>
        <TouchableOpacity
          style={styles.bookmarkButton}
          accessible
          accessibilityLabel="Bookmark"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>🔖</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>😴</Text>
          <Text style={styles.heroTitle}>Better Sleep, Better Life</Text>
          <Text style={styles.heroSubtitle}>
            Discover personalized tips to improve your sleep quality and wake up
            refreshed
          </Text>
        </View>

        {/* Personalized Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 Personalized for You</Text>
          {personalizedRecommendations.map((recommendation) => (
            <View key={recommendation.id} style={styles.recommendationCard}>
              <Text style={styles.recommendationIcon}>✨</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationText}>
                  {recommendation.text}
                </Text>
                <Text style={styles.recommendationImpact}>
                  {recommendation.impact}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Sleep Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Improvement Tips</Text>
          {sleepTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View style={styles.tipHeaderText}>
                  <Text style={styles.tipCategory}>{tip.category}</Text>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                </View>
                <View
                  style={[styles.priorityBadge, getPriorityStyle(tip.priority)]}
                >
                  <Text style={styles.priorityText}>
                    {getPriorityLabel(tip.priority)}
                  </Text>
                </View>
              </View>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Set Sleep Reminder 🔔</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SleepTipsScreen;
