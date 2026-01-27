/**
 * AssessmentResultsScreen Component
 * @description Assessment results display with score, breakdown, and recommendations
 * @task Task 3.4.5: Assessment Results Screen (Screen 39)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

type Category = "healthy" | "unstable" | "critical";

interface BreakdownItem {
  label: string;
  score: number;
  color: string;
}

interface AssessmentResultsScreenProps {
  score: number;
  category: Category;
  breakdown: BreakdownItem[];
  recommendations: string[];
  onContinue: () => void;
  onViewDetails: () => void;
}

const CATEGORY_CONFIG = {
  healthy: {
    color: "#9AAD5C",
    label: "Healthy",
    emoji: "✨",
  },
  unstable: {
    color: "#E8853A",
    label: "Unstable",
    emoji: "⚠️",
  },
  critical: {
    color: "#E85353",
    label: "Critical",
    emoji: "🚨",
  },
};

export function AssessmentResultsScreen({
  score,
  category,
  breakdown,
  recommendations,
  onContinue,
  onViewDetails,
}: AssessmentResultsScreenProps): React.ReactElement {
  const categoryConfig = CATEGORY_CONFIG[category];

  return (
    <View testID="assessment-results-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Assessment Complete</Text>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View
            testID="score-circle"
            style={[styles.scoreCircle, { borderColor: categoryConfig.color }]}
          >
            <Text testID="score-value" style={styles.scoreValue}>
              {score}
            </Text>
            <Text style={styles.scoreLabel}>Mental Health Score</Text>
          </View>

          {/* Category Badge */}
          <View
            testID="category-badge"
            style={[styles.categoryBadge, { backgroundColor: categoryConfig.color }]}
          >
            <Text style={styles.categoryEmoji}>{categoryConfig.emoji}</Text>
            <Text style={styles.categoryText}>{categoryConfig.label}</Text>
          </View>
        </View>

        {/* Breakdown Section */}
        <View testID="breakdown-section" style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          {breakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>{item.label}</Text>
              <View style={styles.breakdownBar}>
                <View
                  style={[
                    styles.breakdownProgress,
                    {
                      width: `${item.score}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.breakdownScore, { color: item.color }]}>
                {item.score}
              </Text>
            </View>
          ))}
        </View>

        {/* Recommendations Section */}
        <View testID="recommendations-section" style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationBullet}>•</Text>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Button Section */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          testID="view-details-button"
          style={styles.viewDetailsButton}
          onPress={onViewDetails}
          accessibilityRole="button"
          accessibilityLabel="View detailed breakdown"
        >
          <Text style={styles.viewDetailsButtonText}>View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="continue-button"
          style={styles.continueButton}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to main app"
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Text style={styles.continueButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  breakdownBar: {
    backgroundColor: "#2A1F19",
    borderRadius: 4,
    flex: 1,
    height: 8,
    marginHorizontal: 12,
    overflow: "hidden",
  },
  breakdownItem: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 16,
  },
  breakdownLabel: {
    color: "#94A3B8",
    fontSize: 14,
    width: 100,
  },
  breakdownProgress: {
    borderRadius: 4,
    height: "100%",
  },
  breakdownScore: {
    fontSize: 14,
    fontWeight: "600",
    width: 30,
  },
  breakdownSection: {
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    marginBottom: 24,
    marginHorizontal: 24,
    padding: 20,
  },
  buttonSection: {
    flexDirection: "row",
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  categoryBadge: {
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  continueButton: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 28,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 12,
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  continueButtonIcon: {
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButtonText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  recommendationBullet: {
    color: "#9AAD5C",
    fontSize: 16,
    marginRight: 8,
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  recommendationText: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationsSection: {
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    marginBottom: 24,
    marginHorizontal: 24,
    padding: 20,
  },
  scoreCircle: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 80,
    borderWidth: 4,
    height: 160,
    justifyContent: "center",
    width: 160,
  },
  scoreLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  scoreValue: {
    color: "#FFFFFF",
    fontSize: 56,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  viewDetailsButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  viewDetailsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AssessmentResultsScreen;
