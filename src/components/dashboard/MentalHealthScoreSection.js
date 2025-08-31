import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { MentalHealthIcon } from "../icons";
import { MentalHealthScoreWidget } from "../ui";

/**
 * Mental Health Score Section Component
 *
 * Integrates the Mental Health Score Widget into the dashboard
 * with contextual information and navigation to detailed views.
 */
const MentalHealthScoreSection = ({
  score = 80,
  trend = "stable", // 'improving', 'stable', 'declining'
  lastUpdated = new Date(),
  onScorePress,
  onTrendPress,
  style = {},
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // Animation for entrance
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Get trend information
  const getTrendInfo = () => {
    switch (trend) {
      case "improving":
        return {
          icon: "progress-tracking",
          color: theme.colors.success[600],
          text: "Improving",
          description: "Your mental health is trending upward",
        };
      case "declining":
        return {
          icon: "crisis-support",
          color: theme.colors.warning[600],
          text: "Needs Attention",
          description: "Consider reaching out for support",
        };
      default:
        return {
          icon: "emotional-balance",
          color: theme.colors.therapeutic.nurturing[600],
          text: "Stable",
          description: "Maintaining consistent mental health",
        };
    }
  };

  const trendInfo = getTrendInfo();

  // Handle score press
  const handleScorePress = () => {
    if (onScorePress) {
      onScorePress(score);
    } else {
      navigation.navigate("MentalHealthDetails", { score, trend });
    }
  };

  // Handle trend press
  const handleTrendPress = () => {
    if (onTrendPress) {
      onTrendPress(trend);
    } else {
      navigation.navigate("MentalHealthTrends");
    }
  };

  // Format last updated time
  const formatLastUpdated = () => {
    const now = new Date();
    const diffInHours = Math.floor((now - lastUpdated) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Updated just now";
    if (diffInHours < 24) return `Updated ${diffInHours}h ago`;
    return `Updated ${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.card,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MentalHealthIcon
            name="mood-tracker"
            size={24}
            color={theme.colors.primary[600]}
            therapeuticTheme="nurturing"
          />
          <View style={styles.headerText}>
            <Text
              style={[styles.headerTitle, { color: theme.colors.text.primary }]}
            >
              Mental Health Score
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              {formatLastUpdated()}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={handleScorePress}
          accessibilityRole="button"
          accessibilityLabel="View detailed mental health analysis"
          accessibilityHint="Opens detailed mental health score breakdown"
        >
          <MentalHealthIcon
            name="mental-goals"
            size={20}
            color={theme.colors.text.tertiary}
            therapeuticTheme="peaceful"
          />
        </TouchableOpacity>
      </View>

      {/* Main Score Widget */}
      <View style={styles.scoreContainer}>
        <MentalHealthScoreWidget
          score={score}
          onPress={handleScorePress}
          animated
          style={styles.scoreWidget}
          accessibilityLabel={`Your mental health score is ${score} out of 100`}
          accessibilityHint="Tap to view detailed analysis and recommendations"
        />
      </View>

      {/* Trend Information */}
      <TouchableOpacity
        style={styles.trendContainer}
        onPress={handleTrendPress}
        accessibilityRole="button"
        accessibilityLabel={`Mental health trend: ${trendInfo.text}. ${trendInfo.description}`}
        accessibilityHint="Tap to view trend analysis over time"
      >
        <View style={styles.trendLeft}>
          <MentalHealthIcon
            name={trendInfo.icon}
            size={20}
            color={trendInfo.color}
            therapeuticTheme="nurturing"
          />
          <View style={styles.trendText}>
            <Text
              style={[styles.trendTitle, { color: theme.colors.text.primary }]}
            >
              Trend: {trendInfo.text}
            </Text>
            <Text
              style={[
                styles.trendDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              {trendInfo.description}
            </Text>
          </View>
        </View>

        <MentalHealthIcon
          name="progress-tracking"
          size={16}
          color={theme.colors.text.quaternary}
          therapeuticTheme="peaceful"
        />
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.therapeutic.calming[50] },
          ]}
          onPress={() => navigation.navigate("MoodTracker")}
          accessibilityRole="button"
          accessibilityLabel="Log your current mood"
        >
          <MentalHealthIcon
            name="emotions"
            size={18}
            color={theme.colors.therapeutic.calming[600]}
          />
          <Text
            style={[
              styles.actionText,
              { color: theme.colors.therapeutic.calming[700] },
            ]}
          >
            Log Mood
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.therapeutic.nurturing[50] },
          ]}
          onPress={() => navigation.navigate("TherapySession")}
          accessibilityRole="button"
          accessibilityLabel="Start a therapy session"
        >
          <MentalHealthIcon
            name="therapy-session"
            size={18}
            color={theme.colors.therapeutic.nurturing[600]}
          />
          <Text
            style={[
              styles.actionText,
              { color: theme.colors.therapeutic.nurturing[700] },
            ]}
          >
            Talk Now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.therapeutic.peaceful[50] },
          ]}
          onPress={() => navigation.navigate("Mindfulness")}
          accessibilityRole="button"
          accessibilityLabel="Start mindfulness exercise"
        >
          <MentalHealthIcon
            name="mindfulness"
            size={18}
            color={theme.colors.therapeutic.peaceful[600]}
          />
          <Text
            style={[
              styles.actionText,
              { color: theme.colors.therapeutic.peaceful[700] },
            ]}
          >
            Mindful
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.8,
  },
  moreButton: {
    padding: 8,
    borderRadius: 8,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreWidget: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  trendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    marginBottom: 20,
  },
  trendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  trendText: {
    marginLeft: 12,
    flex: 1,
  },
  trendTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  trendDescription: {
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default MentalHealthScoreSection;
