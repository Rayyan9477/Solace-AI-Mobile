import { logger } from "@shared/utils/logger";

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { moodStorageService } from "../services/moodStorageService";
import type { MoodEntry as StoredMoodEntry } from "../services/moodStorageService";

interface ActivityCount {
  id: string;
  name: string;
  impact: "Positive" | "Negative" | "Neutral";
  icon: string;
  count: number;
}

export const ActivityTrackingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [moodHistory, setMoodHistory] = useState<StoredMoodEntry[]>([]);

  // Load mood history from SQLite on mount
  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    setIsLoading(true);
    try {
      // Load last 90 days of mood data to get activity patterns
      const moods = await moodStorageService.getMoodHistory(90);
      setMoodHistory(moods);
    } catch (error) {
      logger.error("Failed to load mood history:", error);
      setMoodHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate activity counts from mood history
  const activities = useMemo<ActivityCount[]>(() => {
    const activityMap = new Map<string, number>();

    moodHistory.forEach((entry: any) => {
      if (entry.activities && Array.isArray(entry.activities)) {
        entry.activities.forEach((activity: string) => {
          activityMap.set(activity, (activityMap.get(activity) || 0) + 1);
        });
      }
    });

    // Define activity categories with icons and impact
    const activityDefinitions = {
      Exercise: { icon: "🏃", impact: "Positive" as const },
      "Social Time": { icon: "👥", impact: "Positive" as const },
      Work: { icon: "💼", impact: "Neutral" as const },
      "Work Stress": { icon: "💼", impact: "Negative" as const },
      Sleep: { icon: "😴", impact: "Positive" as const },
      Meditation: { icon: "🧘", impact: "Positive" as const },
      Reading: { icon: "📖", impact: "Positive" as const },
      Hobby: { icon: "🎨", impact: "Positive" as const },
      "Family Time": { icon: "👨‍👩‍👧‍👦", impact: "Positive" as const },
      Relaxation: { icon: "🛀", impact: "Positive" as const },
      Therapy: { icon: "💭", impact: "Positive" as const },
      Conflict: { icon: "😤", impact: "Negative" as const },
      Isolation: { icon: "🚪", impact: "Negative" as const },
    };

    return Array.from(activityMap.entries())
      .map(([name, count]) => ({
        id: name,
        name,
        icon:
          activityDefinitions[name as keyof typeof activityDefinitions]?.icon ||
          "📌",
        impact:
          activityDefinitions[name as keyof typeof activityDefinitions]
            ?.impact || "Neutral",
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [moodHistory]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background.primary },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: { width: 40, height: 40, justifyContent: "center" },
    headerTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      textAlign: "center",
    },
    content: { padding: 20 },
    activityCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    activityIcon: { fontSize: 32, marginRight: 12 },
    activityInfo: { flex: 1 },
    activityName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    activityImpact: { fontSize: 13, color: theme.colors.text.secondary },
    activityCount: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.brown["80"],
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 60,
      paddingHorizontal: 20,
    },
    emptyEmoji: { fontSize: 64, marginBottom: 16 },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyMessage: {
      fontSize: 15,
      color: theme.colors.text.secondary,
      textAlign: "center",
      lineHeight: 22,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Tracking</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={theme.colors.orange["60"]} />
            <Text
              style={{
                marginTop: 16,
                color: theme.colors.text.secondary,
                fontSize: 14,
              }}
            >
              Loading activities...
            </Text>
          </View>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${activity.name}: ${activity.count} times, ${activity.impact} impact`}
              activeOpacity={0.7}
            >
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text
                  style={[
                    styles.activityImpact,
                    activity.impact === "Positive" && {
                      color: theme.colors.success,
                    },
                    activity.impact === "Negative" && {
                      color: theme.colors.error,
                    },
                  ]}
                >
                  {activity.impact} Impact
                </Text>
              </View>
              <Text style={styles.activityCount}>{activity.count}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No activities tracked yet</Text>
            <Text style={styles.emptyMessage}>
              Start tracking your mood with activities to see insights here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActivityTrackingScreen;
